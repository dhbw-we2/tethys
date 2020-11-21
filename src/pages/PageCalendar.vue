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
                <!-- Im Folgenden die Direction von /changemeal auf das echt hinterlegte Essen leiten -->
                <q-btn push to="/changemeal" v-if="agenda.avatar" class="row justify-center" style="margin-top: 45px; width: 100%;">
                  <div>
                    <q-avatar style="margin-top: -35px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                      <img :src="agenda.avatar" style="border: rgba(0,0,0,0.4) solid 2px;" alt="Bild von diesem Essen">
                    </q-avatar>
                  </div>
                  <div class="col-12 q-px-sm">
                    <strong>{{ agenda.time }}</strong>
                  </div>
                  <div v-if="agenda.desc" class="col-12 q-px-sm" style="font-size: 10px;">
                    {{ agenda.desc }}
                  </div>
                </q-btn>
              </div>
            </template>
          </template>
        </q-calendar>
      </div>
    </div>
  </q-layout>
</template>



<script>
import db from "src/router/db";

export default {
  data () {
    return {
      currentWeekTime:0,
      selectedDate: '',
      agenda: {
        //value represents day of the week
        0: [{time: '', avatar: '', desc: ''}],
        1: [{time: '', avatar: '', desc: ''}],
        2: [{time: '', avatar: '', desc: ''}],
        3: [{time: '', avatar: '', desc: ''}],
        4: [{time: '', avatar: '', desc: ''}],
        5: [{time: '', avatar: '', desc: ''}],
        6: [{time: '', avatar: '', desc: ''}]
      }
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

    calendarPrev () {
      this.$refs.calendar.prev()
      this.currentWeekTime -= (7*24*60*60*1000)
      this.getCurrentWeekMeals()
    },

    getCurrentWeekMeals() {
      //console.log(new Date(this.currentWeekTime))

      this.agenda[0] = [{time: '', avatar: '', desc: ''}]
      this.agenda[1] = [{time: '', avatar: '', desc: ''}]
      this.agenda[2] = [{time: '', avatar: '', desc: ''}]
      this.agenda[3] = [{time: '', avatar: '', desc: ''}]
      this.agenda[4] = [{time: '', avatar: '', desc: ''}]
      this.agenda[5] = [{time: '', avatar: '', desc: ''}]
      this.agenda[6] = [{time: '', avatar: '', desc: ''}]

      db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(
        doc => {
          doc.data().MealCalendar.forEach(mealRef => {
            //console.log(this.currentWeekTime)
            //console.log(mealRef.Date.seconds * 1000)
            //console.log(this.currentWeekTime + (7*24*60*60*1000) )

            if((mealRef.Date.seconds * 1000) >= (this.currentWeekTime) && (mealRef.Date.seconds * 1000) <= (this.currentWeekTime + (7*24*60*60*1000)))
            {
              db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
                console.log(mealObj.data().DisplayName)
                console.log(new Date(mealRef.Date.seconds * 1000).getDay())
                let day = new Date(mealRef.Date.seconds * 1000).getDay();
                var calendarObj = {time: '', avatar: mealObj.data().bildURL, desc: mealObj.data().DisplayName};
                this.agenda[day].push(calendarObj)
              })
            }
          })
        }
      )
    }
  },

  created() {
    this.currentWeekTime = Date.now();
                                                    //Offset to Thursday        //Align to Monday
    this.currentWeekTime -= (this.currentWeekTime % (7 * 24 * 60 * 60 * 1000) + (3 * 24 * 60 * 60 * 1000))
    this.getCurrentWeekMeals()
  }
}
</script>


