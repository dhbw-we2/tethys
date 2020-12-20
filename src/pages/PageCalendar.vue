import db from '/db'

<template>
  <q-layout view="lHr LpR lFr" class="row justify-center text-grey-10">
    <div style="max-width: 1280px; width: 100%;" >
      <div class="text-h5 text-center q-py-md" >{{ new Date(currentWeekTime).toLocaleString('de-De', {month: "long"}) }} - {{ new Date(currentWeekTime).getFullYear() }}</div>
      <div style="border-style: solid;" class="border-color-grey-3">
        <div class="row justify-center items-center">
          <q-btn flat label="Vorherige Woche" @click="calendarPrev" />
          <q-separator vertical />
          <q-btn flat label="Nächste Woche" @click="calendarNext" />
        </div>
        <q-separator />
        <div>
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="week-agenda"
          :weekdays="[1,2,3,4,5,6,0]"
          animated
          transition-prev="slide-right"
          transition-next="slide-left"
          locale="de-de"
          no-scroll
          style="min-height: 100px;"
        >
          <template #day-body="{ timestamp }">
            <template v-for="(agenda) in getAgenda(timestamp)">
              <q-card :key="agenda.Id" :label="agenda.DisplayName" class="bg-primary column items-center text-center q-ma-sm"
                      @click="dialogShowMealObject = agenda; dialogShowMealIsVisible = true">

                  <q-card-section class="q-pb-none">
                    <q-avatar>
                      <img :src="agenda.Picture" style="border: white solid 2px;">
                    </q-avatar>
                  </q-card-section>
                  <q-card-section class="q-pt-xs">
                    <strong>{{ agenda.DisplayName }}</strong>
                  </q-card-section>

                  <q-tooltip content-class="bg-white text-black">
                    <strong>Für mehr Infos klicken!</strong>
                  </q-tooltip>

              </q-card>
            </template>
          </template>
        </q-calendar>
        </div>
      </div>

      <div class="row no-wrap justify-around q-pt-md">
        <div>{{ DailyCalorie[1] }}&#8198kcal</div>
        <div>{{ DailyCalorie[2] }}&#8198kcal</div>
        <div>{{ DailyCalorie[3] }}&#8198kcal</div>
        <div>{{ DailyCalorie[4] }}&#8198kcal</div>
        <div>{{ DailyCalorie[5] }}&#8198kcal</div>
        <div>{{ DailyCalorie[6] }}&#8198kcal</div>
        <div>{{ DailyCalorie[0] }}&#8198kcal</div>
      </div>

      <q-dialog v-model="dialogShowMealIsVisible">
        <q-card style="width: 650px; max-width: 80vw;">
          <q-card-section class="text-center">
            <strong>{{ dialogShowMealObject.DisplayName }}</strong>
          </q-card-section>

          <q-card-section horizontal>
            <q-img :src="dialogShowMealObject.Picture" class="q-ml-md" style="max-height: 360px; max-width: 360px;" />

            <q-card-section>
              <q-card-section>
                <strong>Zutaten:</strong>
              </q-card-section>
              <q-card-section>
                <q-list>
                  <q-item v-for="ingredient in dialogShowMealObject.Ingredients" :key="getRandomID()">
                    {{ingredient.Amount}}g {{ingredient.DisplayName}}
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card-section>
          </q-card-section>

          <q-card-section style="max-width: 70vw;">
            <p>Diese Mahlzeit ist geplant für den {{ dialogShowMealObject.Time }} mit einem Brennwert von {{dialogShowMealObject.Calories}} Kalorien</p>
            <p><strong>Zubereitung:</strong></p>
            {{ dialogShowMealObject.Zubereitung }}
          </q-card-section>

          <q-card-actions align="right">
            <q-btn outline label="Schließen" color="primary" v-close-popup />
            <q-btn push label="Entfernen" color="primary" @click="RemoveMealFromCalendar(dialogShowMealObject.Id)" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-btn round color=primary icon="add" class="q-ma-md float-right" size="lg" @click="dialogAddCalendarEntryIsVisible = true"/>

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
      dialogShowMealObject: { DisplayName: "", Time: 0, Id: 0, Picture: "", Zubereitung: "" }, // Backing Field for Show Meal Dialog

      currentWeekTime:0, // TimeStamp of the beginning of the current week (Monday)
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
     * function from q-calendar to access Backing Fields
     * @param {int} day - (between 0 and 6, representing sunday: 0 to saturday: 6)
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
      this.getCurrentWeekCalendarEntries()
    },

    /**
     * function to move calendar one week forward
     */
    calendarNext () {
      this.$refs.calendar.next()
      this.currentWeekTime += (7*24*60*60*1000)
      this.getCurrentWeekCalendarEntries()
    },

    /**
     * Resets the local backing fields,
     * will be called when a refresh is triggered
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
     * This functions will add a new entry to the calendar and triggers a refresh of the backing fields
     */
    AddMealToCalendar() {
      var UserReference = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")
      var RezeptReference = db.collection('Rezepte').doc(this.dialogAddCalendarEntrySelectedRecipe.id)
      var newCalendarEntry = { Date: new Date(this.dialogAddCalendarEntrySelectedDate), Rezept: RezeptReference, ID: this.getRandomID()}

      UserReference.update({
        MealCalendar: firebase.firestore.FieldValue.arrayUnion(newCalendarEntry)
      }).then(object => {
        this.getCurrentWeekCalendarEntries()
      })
    },

    /**
     * Removes referenced meal from firebase and refresh backing fields
     * @param id - id from vue to remove correct meal
     */
    RemoveMealFromCalendar(id) {
      let UserRef = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")

      UserRef.get().then(object => {
       object.data().MealCalendar.forEach(calendarEntry => {
         if(calendarEntry.ID == id)
         {
           UserRef.update({
             MealCalendar: firebase.firestore.FieldValue.arrayRemove(calendarEntry)
           }).then(callback => {
             this.getCurrentWeekCalendarEntries()
           })
         }
       })
      })
    },

    /**
     * load all calendar entries for the current week
     */
    getCurrentWeekCalendarEntries() {
      this.resetPage()

      db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(UserReference => {
        UserReference.data().MealCalendar.forEach(calendarEntry => {
          if((calendarEntry.Date.seconds * 1000) >= (this.currentWeekTime) && (calendarEntry.Date.seconds * 1000) <= (this.currentWeekTime + (7*24*60*60*1000) - 1000))
          {
            db.collection('Rezepte').doc(calendarEntry.Rezept.id).get().then(Recipe => {
              let date = new Date(calendarEntry.Date.seconds * 1000)
              let day = date.getDay()

              let calendarObj = {
                Time: date.toLocaleDateString(),
                Picture: Recipe.data().ImageUrl,
                DisplayName: Recipe.data().DisplayName,
                Id: calendarEntry.ID,
                Zubereitung: Recipe.data().Zubereitung,
                Ingredients: [ ],
                Calories: 0
              };

              Recipe.data().Zutaten.forEach(async ingredientReference => {
                await db.collection('Zutaten').doc(ingredientReference.Path.id).get().then(ingredient => {
                  calendarObj.Ingredients.push({DisplayName: ingredient.data().DisplayName, Amount: ingredientReference.Gramm} )
                  let calories = Math.floor(ingredient.data().CaloriesPer100g * (ingredientReference.Gramm / 100))
                  calendarObj.Calories += calories
                  this.DailyCalorie[new Date(calendarEntry.Date.seconds * 1000).getDay()] += calories
                })
              })

              this.agenda[day].push(calendarObj)
            })
          }
        })
      })
    },

    /**
     * load all available Recipes
     **/
    getAvailableRecipes(){
      db.collection('Rezepte').get().then(recipes => {
        recipes.forEach(recipe => {
          this.dialogAddCalendarEntryRecipes.push({label: recipe.data().DisplayName, id: recipe.id})
        })
      }).then(callback => {
        if(this.dialogAddCalendarEntryRecipes.length > 0)
        {
          this.dialogAddCalendarEntrySelectedRecipe = this.dialogAddCalendarEntryRecipes[0]
        }
      })
    },

    /**
     * generates a random id, for our meal entries, so they can be referenced and enables the opportunity for multiple same meals in one day.
     */
    getRandomID()
    {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  },

  /**
   * This function will be called on page load, to init backing fields
   */
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
      default: day -= 1; //day aligns to sunday = 0; so remove one fewer, to monday = 1
               this.currentWeekTime -= (day * 24 * 60 * 60 * 1000)
               break;
    }

    this.getCurrentWeekCalendarEntries()
    this.getAvailableRecipes()
  }
}
</script>


