import db from '/db'

<template>
  <q-layout view="lHr LpR lFr" class="row justify-center text-grey-10">
    <div style="max-width: 1280px; width: 100%;" >
      <div class="row justify-center items-center">
        <q-btn flat label="Vorherige Woche" @click="calendarPrev" />
        <q-separator vertical />
        <q-btn flat label="Nächste Woche" @click="calendarNext" />
      </div>
      <q-separator />
      <div style="overflow: hidden">
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="week-agenda"
          :weekdays="[1,2,3,4,5,6,0]"
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          locale="de-de"
          style="min-height: 400px; height: 100%;"
        >
          <template #day-body="{ timestamp }">
            <template v-for="(agenda) in getAgenda(timestamp)">
              <div
                :key="agenda.Id"
                :label="agenda.DisplayName"
                class="justify-start q-ma-sm bg-primary "
              >
                <q-btn class="row justify-center q-mt-lg" @click="dialogShowMealObject = agenda; dialogShowMealIsVisible = true">
                  <div>
                    <q-avatar>
                      <img :src="agenda.Picture" style="border: white solid 2px;">
                    </q-avatar>
                  </div>
                  <div class="col-12 q-px-sm">
                    <strong>{{ agenda.DisplayName }}</strong>
                  </div>
                </q-btn>
              </div>
            </template>
          </template>
        </q-calendar>
        <div class="row no-wrap justify-around">
          <div>
            {{ DailyCalorie[1] }} kcal
          </div>
          <div>
            {{ DailyCalorie[2] }} kcal
          </div>
          <div>
            {{ DailyCalorie[3] }} kcal
          </div>
          <div>
            {{ DailyCalorie[4] }} kcal
          </div>
          <div>
            {{ DailyCalorie[5] }} kcal
          </div>
          <div>
            {{ DailyCalorie[6] }} kcal
          </div>
          <div>
            {{ DailyCalorie[0] }} kcal
          </div>
        </div>

        <q-dialog v-model="dialogShowMealIsVisible">
          <q-card>
            <q-card-section class="row items-center q-mx-xl">
              <strong>{{ dialogShowMealObject.DisplayName }}</strong>
            </q-card-section>



            <q-card-section>
              <img :src="dialogShowMealObject.Picture" style="max-height: 360px; max-width: 360px;">
            </q-card-section>

            <q-card-section class="row items-center">
              Geplant am: {{ dialogShowMealObject.Time }}
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Schließen" color="primary" v-close-popup />
              <q-btn push label="Entfernen" color="primary" @click="RemoveMealFromCalendar(dialogShowMealObject.Id)" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-btn round color=primary icon="add" class="q-ma-md float-right q-mr-xl q-mt-xl" size="xl" @click="dialogAddCalendarEntryIsVisible = true"/>

        <q-dialog v-model="dialogAddCalendarEntryIsVisible">
          <q-card>
            <q-card-section class="row items-center">
              <strong>Plane ein Gericht:</strong>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-date landscape v-model="dialogAddCalendarEntrySelectedDate" first-day-of-week="1" />
            </q-card-section>

            <q-card-section class="row items-center">
              <q-select outlined v-model="dialogAddCalendarEntrySelectedRecipe" :options="dialogAddCalendarEntryRecipes" map-options />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn outline label="Schließen" color="primary" v-close-popup />
              <q-btn push label="Planen" color="primary" @click="AddMealToCalendar" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-layout>
</template>



<script>
import db from "src/router/db";
import firebase from "firebase";

export default {
  data () {
    return {

      dialogAddCalendarEntryIsVisible: false, // Visibility boolean for new Meal Dialog
      dialogAddCalendarEntrySelectedDate: 0, // Backing Field for new Meal Dialog - Selected Date
      dialogAddCalendarEntryRecipes: [], // Backing Field for new Meal Dialog - Available Recipes
      dialogAddCalendarEntrySelectedRecipe: null, // Backing Field for new Meal Dialog - Selected Recipe

      dialogShowMealIsVisible: false, // Visibility boolean for Show Meal Dialog
      dialogShowMealObject: { Displayname: "", Time: 0, Id: 0, Picture: "" }, // Backing Field for Show Meal Dialog

      currentWeekTime:0, // TimeStamp of current week beginning (Monday)
      selectedDate: '', // Backing Field for q-calendar
      agenda: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, // Backing Field for q-calendar

      DailyCalorie: {
        0: 0, //Sunday
        1: 0, //Monday
        2: 0, //Tuesday
        3: 0, //Wednesday
        4: 0, //Thursday
        5: 0, //Friday
        6: 0  //Saturday
      }
    }

  },

  methods: {
    /**
     * function from q-calendar for Backing Field
     */
    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    },

    /**
     * function to move calendar one week back
     */
    calendarPrev () {
      this.$refs.calendar.prev()
      this.currentWeekTime -= (7*24*60*60*1000)
      this.getCurrentWeekMeals()
    },

    /**
     * function to move to next week
     */
    calendarNext () {
      this.$refs.calendar.next()
      this.currentWeekTime += (7*24*60*60*1000)
      this.getCurrentWeekMeals()
    },

    /**
     * Resets the local backing fields,
     * will be called when a refresh takes place
     */
    resetPage() {
      this.DailyCalorie = {
        0: 0, //Sunday
        1: 0, //Monday
        2: 0, //Tuesday
        3: 0, //Wednesday
        4: 0, //Thursday
        5: 0, //Friday
        6: 0  //Saturday
      }

      this.agenda[0] = []
      this.agenda[1] = []
      this.agenda[2] = []
      this.agenda[3] = []
      this.agenda[4] = []
      this.agenda[5] = []
      this.agenda[6] = []
    },

    /**
     * This functions will add a new meal to the calendar
     */
    AddMealToCalendar() {
      var UserRef = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")
      var RezeptRef = db.collection('Rezepte').doc(this.dialogAddCalendarEntrySelectedRecipe.id)
      var newMealObj = { Date: new Date(this.dialogAddCalendarEntrySelectedDate), Rezept: RezeptRef, ID: this.getRandomID()}

      UserRef.update({
        MealCalendar: firebase.firestore.FieldValue.arrayUnion(newMealObj)
      }).then(object => {
        this.getCurrentWeekMeals()
      })
    },

    /**
     * Removes referenced meal from firebase and refresh backing fields
     * @param id - id from vue to remove correct meal
     */
    RemoveMealFromCalendar(id) {
      let UserRef = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")

      UserRef.get().then(object => {
       object.data().MealCalendar.forEach(mealObj => {
         if(mealObj.ID == id)
         {
           UserRef.update({
             MealCalendar: firebase.firestore.FieldValue.arrayRemove(mealObj)
           }).then(obj => {
             this.getCurrentWeekMeals()
           })
         }
       })
      })
    },

    /**
     * refill all meal from current week
     */
    getCurrentWeekMeals() {
      this.resetPage()

      db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(doc => {
        doc.data().MealCalendar.forEach(mealRef => {
          if((mealRef.Date.seconds * 1000) >= (this.currentWeekTime) && (mealRef.Date.seconds * 1000) <= (this.currentWeekTime + (7*24*60*60*1000) - 1000))
          {
            db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
              let date = new Date(mealRef.Date.seconds * 1000)
              let day = date.getDay()

              mealObj.data().Zutaten.forEach(zutatRef => {
                let request = db.collection('Zutaten').doc(zutatRef.Path.id).get().then(zutatObj => {
                  this.DailyCalorie[new Date(mealRef.Date.seconds * 1000).getDay()] += (Math.floor(zutatObj.data().CaloriesPer100g * (zutatRef.Gramm / 100)))
                })
              })

              let calendarObj = {
                Time: date.toLocaleDateString(),
                Picture: mealObj.data().bildURL,
                DisplayName: mealObj.data().DisplayName,
                Id: mealRef.ID
              };
              this.agenda[day].push(calendarObj)
            })
          }
        })
      })
    },

    getAvailableRezepte(){
      db.collection('Rezepte').get().then(rezepte => {
        rezepte.forEach(rezept => {
          this.dialogAddCalendarEntryRecipes.push({label: rezept.data().DisplayName, id: rezept.id})
        })
      }).then(obj => {
        if(this.dialogAddCalendarEntryRecipes.length > 0)
        {
          this.dialogAddCalendarEntrySelectedRecipe = this.dialogAddCalendarEntryRecipes[0]
        }
      })
    },

    getRandomID()
    {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  },

  created() {
    this.currentWeekTime = Date.now();
    this.currentWeekTime -= (this.currentWeekTime % 1000) //Remove Milliseconds
    this.currentWeekTime -= (new Date(this.currentWeekTime).getSeconds() * 1000) //Remove Seconds
    this.currentWeekTime -= (new Date(this.currentWeekTime).getMinutes() * 60 * 1000) //Remove Minutes
    this.currentWeekTime -= (new Date(this.currentWeekTime).getHours() * 60 * 60 * 1000) //Remove Hours

    //Preselect current day in backingfield: format YYYY/MM/DD
    this.dialogAddCalendarEntrySelectedDate = new Date(this.currentWeekTime).getFullYear() + "/" +
                       (new Date(this.currentWeekTime).getMonth() + 1) +  "/" + /* getMonth is IndexBased, hence the increment */
                       new Date(this.currentWeekTime).getDate()

    let day = new Date(this.currentWeekTime).getDay()
    switch(day)
    {
      case 0: day = 7 //sunday = 0 remove 6 days to align to monday
      default: day -= 1; //day aligns to sunday = 0; so remove one less (monday = 1)
               this.currentWeekTime -= (day * 24 * 60 * 60 * 1000)
               break;
    }
    this.getCurrentWeekMeals()
    this.getAvailableRezepte()
  }
}
</script>


