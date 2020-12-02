<template>
  <q-page class="window-height window-width items-center q-pt-xl">
    <div class="row no-wrap" v-for="z in zutaten" >
      <div class="col-2 q-pa-md" align="right">
        {{ z.PortionInGramm }} g
      </div>
      <div class="col-2 q-pa-md text-weight-medium">
        <strong>{{ z.DisplayName }}</strong>
      </div>
      <div class="col-1 q-pa-md" align="right">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-4 q-pt-md text-caption">
        {{ z.KalorienPro100g }} kcal pro 100g
      </div>
    </div>
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

  methods: {
    addElementUniqueToShoppingList(shoppingListObject) {
      for (let i = 0; i < this.zutaten.length; i++)
      {
        if (this.zutaten[i].id == shoppingListObject.id) {
          this.zutaten[i].PortionInGramm += shoppingListObject.PortionInGramm
          return;
        }
      }
      this.zutaten.push(shoppingListObject)
      return
    }
  },

  async created() {
    //getPlannedMeals
    let currentTime = Math.floor(Date.now() / 1000);
    currentTime -= (new Date(currentTime).getSeconds() * 1000) //Remove Seconds
    currentTime -= (new Date(currentTime).getMinutes() * 60 * 1000) //Remove Minutes
    currentTime -= (new Date(currentTime).getHours() * 60 * 60 * 1000) //Remove Hours
    console.log(currentTime)
    //
    db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then( doc => {
        doc.data().MealCalendar.forEach(mealRef => {
          if(mealRef.Date.seconds >= currentTime)
          {
            db.collection('Rezepte').doc(mealRef.Rezept.id).get().then(mealObj => {
                mealObj.data().Zutaten.forEach(zutatRef => {
                  db.collection('Zutaten').doc(zutatRef.id).get().then(zutatObj => {
                    let ShoppingListObject = {
                      DisplayName: zutatObj.data().DisplayName,
                      KalorienPro100g: zutatObj.data().KalorienPro100g,
                      PortionInGramm: zutatObj.data().PortionInGramm,
                      id: zutatRef.id
                    }
                    this.addElementUniqueToShoppingList(ShoppingListObject)
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
