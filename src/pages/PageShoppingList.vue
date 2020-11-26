<template>
  <q-page class="items-center">
    <!--{{zutaten}}-->
    <!--{{meals}}-->
    <q-list class="q-pl-xl">
      <q-list-header><h3>Einkaufsliste</h3></q-list-header>
      <q-item v-for="z in zutaten">
        <q-item class="q-px-xl">
          <q-item-section>
            <q-item-label caption>{{ z.KalorienPro100g }} kcal</q-item-label>
            <q-icon name="local_fire_department" color="orange"/>
          </q-item-section>

          <q-item-section>
            <q-item-label><strong>{{ z.DisplayName }}</strong></q-item-label>
            <q-item-label caption>{{ z.PortionInGramm }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import db from '../router/db'

export default {
  name: 'PageShoppingList',
  data() {
    return {
      zutaten:[],
      meals:[]
    }
  },

  created() {
    //getPlannedMeals
    const currentTime = Math.floor(Date.now() / 1000);

    db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(
      doc => {
        doc.data().MealCalendar.forEach(mealRef => {
          if(mealRef.Date.seconds > currentTime)
          {
            db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
                mealObj.data().Zutaten.forEach(zutatRef => {
                  db.collection('Zutaten').doc(zutatRef.id).get().then(zutatObj => {
                    this.zutaten.push(zutatObj.data())
                    //console.log(zutatObj.data())
                  })
                })
              })
          }
        })
      }
    )
  }


}
</script>
