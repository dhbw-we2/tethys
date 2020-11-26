import db from '/db'


<template>
  <q-layout view="lHr LpR lFr" class="row justify-center">
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
                class="justify-start q-ma-sm shadow-5 bg-grey-4"
              >
                <q-btn class="row justify-center" style="margin-top: 45px; width: 100%;" @click="dialogShowMealObject = agenda; dialogShowMeal = true">
                  <div>
                    <q-avatar style="margin-top: -35px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                      <img :src="agenda.Picture" style="border: rgba(0,0,0,0.4) solid 2px;" alt="Bild von diesem Essen">
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

        <q-dialog v-model="dialogShowMeal">
          <q-card>
            <q-card-section class="row items-center q-mx-xl">
              <strong>{{ dialogShowMealObject.DisplayName }}</strong>
            </q-card-section>

            <q-card-section class="row items-center">
              Geplant am: {{ dialogShowMealObject.Time }}
            </q-card-section>
            <q-card-section class="row items-center">
              Kalorien: {{ dialogShowMealObject.Calorie }}
            </q-card-section>

            <q-card-section class="row items-center">
              ID: {{ dialogShowMealObject.Id }}
            </q-card-section>

            <!-- Notice v-close-popup -->
            <q-card-actions align="right">
              <q-btn flat label="Entfernen" color="primary" @click="RemoveMealFromCalendar(dialogShowMealObject.Id)" v-close-popup />
              <q-btn flat label="Schließen" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-btn round color="blue" icon="add" class="float-right q-mr-xl q-mt-xl" size="big" @click="dialogAddMeal = true"/>

        <q-dialog v-model="dialogAddMeal" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <strong>Plane ein Gericht:</strong>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-date landscape v-model="newMealDate" first-day-of-week="1">

              </q-date>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-select outlined v-model="newMeal" :options="rezepte" map-options>

              </q-select>
            </q-card-section>

            <!-- Notice v-close-popup -->
            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
              <q-btn flat label="Add Meal" color="primary" @click="AddMealToCalendar" v-close-popup />
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
      newMealDate: 0,
      newMeal: null,
      dialogShowMeal: false,
      dialogAddMeal: false,
      dialogShowMealObject: { Displayname: "", Time: 0, Calorie: 0, Id: 0 },
      currentWeekTime:0,
      selectedDate: '',
      agenda: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
      rezepte: []
    }

  },

  methods: {
    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    },

    calendarPrev () {
      this.$refs.calendar.prev()
      this.currentWeekTime -= (7*24*60*60*1000)
      this.getCurrentWeekMeals()
    },

    calendarNext () {
      this.$refs.calendar.next()
      this.currentWeekTime += (7*24*60*60*1000)
      console.log(new Date(this.currentWeekTime))
      this.getCurrentWeekMeals()
    },

    AddMealToCalendar() {
      //TODO: Dynamisches Rezept
      var UserRef = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")
      var RezeptRef = db.collection('Rezepte').doc(this.newMeal.id)
      var newMealObj = { Date: new Date(this.newMealDate), Rezept: RezeptRef, ID: this.getRandomID()}
      /*
      console.log(newMealObj)
      UserRef.get().then(profil => {
        console.log(profil.data())
      })
      */

      UserRef.update({
        MealCalendar: firebase.firestore.FieldValue.arrayUnion(newMealObj)
      }).then(object => {
        this.getCurrentWeekMeals()
      })
    },

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

    getCurrentWeekMeals() {
      //console.log(new Date(this.currentWeekTime))

      this.agenda[0] = []
      this.agenda[1] = []
      this.agenda[2] = []
      this.agenda[3] = []
      this.agenda[4] = []
      this.agenda[5] = []
      this.agenda[6] = []

      db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(doc => {
        doc.data().MealCalendar.forEach(mealRef => {
          if((mealRef.Date.seconds * 1000) >= (this.currentWeekTime) && (mealRef.Date.seconds * 1000) <= (this.currentWeekTime + (7*24*60*60*1000) - 1000))
          {
            db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
              mealObj.data().Zutaten.forEach(zutatRef => {
                db.collection('Zutaten').doc(zutatRef.id).get().then(zutatObj => {
                  //console.log(zutatObj.data())
                })
              })

              let date = new Date(mealRef.Date.seconds * 1000)
              let day = date.getDay();
              let calendarObj = {
                Time: date.toLocaleDateString(),
                Picture: mealObj.data().bildURL,
                DisplayName: mealObj.data().DisplayName,
                Calorie: 0,
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
          console.log(rezept)
          this.rezepte.push({label: rezept.data().DisplayName, id: rezept.id})
        })
      })
    },

    getRandomID()
    {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }
  },

  created() {
    this.currentWeekTime = Date.now();
    this.currentWeekTime += (24 * 60 * 60 * 1000) * 3
    this.currentWeekTime -= (this.currentWeekTime % 1000) //Remove Milliseconds
    this.currentWeekTime -= (new Date(this.currentWeekTime).getSeconds() * 1000) //Remove Seconds
    this.currentWeekTime -= (new Date(this.currentWeekTime).getMinutes() * 60 * 1000) //Remove Minutes
    this.currentWeekTime -= (new Date(this.currentWeekTime).getHours() * 60 * 60 * 1000) //Remove Hours

    let day = new Date(this.currentWeekTime).getDay()
    switch(day)
    {
      case 0: day = 7 //sunday = 0 remove 6 (+1) days to beginning of week
      default: day -= 1; //monday = 1 (should not reduce)
               this.currentWeekTime -= (day * 24 * 60 * 60 * 1000)
               break;
    }
    this.getCurrentWeekMeals()
    this.getAvailableRezepte()
  }
}
</script>


