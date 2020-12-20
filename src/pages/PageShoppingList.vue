<template>
  <q-page class="flex-center q-pt-xl items-baseline" >
    <h5 class="q-pl-md q-ml-xl">Deine Einkaufsliste für die nächsten 14 Tage:</h5>
    <div class="row no-wrap" v-for="z in zutaten" >
      <div class="col-2 q-pa-md" align="right">
        {{ z.PortionSize }}&#8198g
      </div>
      <div class="col-4 q-pa-md text-weight-medium">
        <strong>{{ z.DisplayName }}</strong>
      </div>
      <div class="col-1 q-pa-md" align="right">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-3 q-pt-md text-caption">
        {{ z.CaloriesPer100g }}&#8198kcal pro 100&#8198g
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
          this.zutaten[i].PortionSize += shoppingListObject.PortionSize
          return;
        }
      }
      this.zutaten.push(shoppingListObject)
      return
    },

    createShoppingListObject(reference, zutatObj) {

      let ShoppingListObject = {
        DisplayName: zutatObj.data().DisplayName,
        CaloriesPer100g: zutatObj.data().CaloriesPer100g,
        PortionSize: reference.Gramm,
        id: reference.Path.id
      }

      this.addElementUniqueToShoppingList(ShoppingListObject)
    }

  },

  async created() {
    //getPlannedMeals
    let currentTime = Math.floor(Date.now() / 1000);
    currentTime -= (new Date(currentTime * 1000).getSeconds()) //Remove Seconds
    currentTime -= (new Date(currentTime  * 1000).getMinutes() * 60) //Remove Minutes
    currentTime -= (new Date(currentTime  * 1000).getHours() * 60 * 60) //Remove Hours

    //
    db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then( doc => {
        doc.data().MealCalendar.forEach(calendarEntry => {
          if(calendarEntry.Date.seconds >= currentTime && calendarEntry.Date.seconds <= (currentTime + (14 * 24 * 60 * 60) - 1))
          {
            db.collection('Rezepte').doc(calendarEntry.Rezept.id).get().then(receipe => {
                receipe.data().Zutaten.forEach(ingredientReference => {
                  db.collection('Zutaten').doc(ingredientReference.Path.id).get().then(this.createShoppingListObject.bind(null, ingredientReference))
                })
              })
          }
        })
      }
    )
  }
}
</script>
