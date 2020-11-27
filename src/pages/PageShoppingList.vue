<template>
  <q-page class="items-center">
    <div class="row no-wrap" v-for="z in zutaten" >
      <div class="col-1">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-1">
        {{ z.KalorienPro100g }} kcal
      </div>
      <div class="col-4">
        <strong>{{ z.DisplayName }}</strong>
      </div>
      <div class="col-2">
        {{ z.PortionInGramm }}g
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
    const currentTime = Math.floor(Date.now() / 1000);
    //
    db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then( doc => {
        doc.data().MealCalendar.forEach(mealRef => {
          if(mealRef.Date.seconds > currentTime)
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
