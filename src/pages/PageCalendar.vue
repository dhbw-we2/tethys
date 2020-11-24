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
                :key="timestamp.date + agenda.time"
                :label="agenda.time"
                class="justify-start q-ma-sm shadow-5 bg-grey-4"
              >
                <q-btn v-if="agenda.DisplayName" class="row justify-center" style="margin-top: 45px; width: 100%;" @click="dialogShowMeal = true">
                  <div>
                    <q-avatar style="margin-top: -35px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                      <img :src="agenda.picture" style="border: rgba(0,0,0,0.4) solid 2px;" alt="Bild von diesem Essen">
                    </q-avatar>
                  </div>
                  <div class="col-12 q-px-sm">
                    <strong>{{ agenda.time }}</strong>
                  </div>
                  <div v-if="agenda.DisplayName" class="col-12 q-px-sm" style="font-size: 10px;">
                    {{ agenda.DisplayName }}
                  </div>
                </q-btn>

                <q-dialog v-model="dialogShowMeal" persistent>
                  <q-card>
                    <q-card-section class="row items-center">
                      <h4>{{ agenda.DisplayName }}</h4>
                    </q-card-section>

                    <q-card-section class="row items-center">
                      {{ agenda.Calorie }}
                    </q-card-section>


                    <!-- Notice v-close-popup -->
                    <q-card-actions align="right">
                      <q-btn flat label="Delete Meal" color="primary" v-close-popup />
                      <q-btn flat label="Close Popup" color="primary" v-close-popup />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </template>
          </template>
        </q-calendar>

        <q-btn round color="blue" icon="add" class="float-right q-mr-xl q-mt-xl" size="big" @click="dialogAddMeal = true"/>

        <q-dialog v-model="dialogAddMeal" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <h4>Add New Meal</h4>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-date landscape v-model="newMealDate" first-day-of-week="1">

              </q-date>
            </q-card-section>

            <q-card-section class="row items-center">
              <q-select outlined v-model="newMeal" :options="rezepte">

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
    calendarNext () {
      this.$refs.calendar.next()
      this.currentWeekTime += (7*24*60*60*1000)
      this.getCurrentWeekMeals()
    },

    AddMealToCalendar() {
      var UserRef = db.collection('Nutzer').doc("p6it388BP6p236oqniWj")
      var RezeptRef = db.collection('Rezepte').doc('d6yklg4TTWikuOXyNTME')

      var newMealObj = { Date: new Date(this.newMealDate), Rezept: RezeptRef}
      /*
      console.log(newMealObj)
      UserRef.get().then(profil => {
        console.log(profil.data())
      })
      */

      UserRef.update({
        MealCalendar: firebase.firestore.FieldValue.arrayUnion(newMealObj)
      })
    },

    calendarPrev () {
      this.$refs.calendar.prev()
      this.currentWeekTime -= (7*24*60*60*1000)
      this.getCurrentWeekMeals()
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

          if((mealRef.Date.seconds * 1000) >= (this.currentWeekTime) && (mealRef.Date.seconds * 1000) <= (this.currentWeekTime + (7*24*60*60*1000)))
          {
            db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
              mealObj.data().Zutaten.forEach(zutatRef => {
                db.collection('Zutaten').doc(zutatRef.id).get().then(zutatObj => {
                  //console.log(zutatObj.data())
                })
              })

              let day = new Date(mealRef.Date.seconds * 1000).getDay();
              var calendarObj = {time: '', picture: mealObj.data().bildURL, DisplayName: mealObj.data().DisplayName, Calorie: 0};
              this.agenda[day].push(calendarObj)
            })
          }
        })
      })
    },

    getAvailableRezepte(){
      db.collection('Rezepte').get().then(rezepte => {
        rezepte.forEach(rezept => {
          this.rezepte.push({label: rezept.data().DisplayName, id: rezept.data().id})
        })

        this.rezept = this.rezepte[0]
      })


    }
  },

  created() {
    this.currentWeekTime = Date.now();
                                                    //Offset to Thursday        //Align to Monday
    this.currentWeekTime -= (this.currentWeekTime % (7 * 24 * 60 * 60 * 1000) + (3 * 24 * 60 * 60 * 1000))
    this.getCurrentWeekMeals()
    this.getAvailableRezepte()
  }
}
</script>


