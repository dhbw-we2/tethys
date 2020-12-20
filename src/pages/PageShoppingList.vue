<template>
  <q-page class="flex-center q-pt-xl items-baseline" >
    <h5 class="q-pl-md q-ml-xl">Deine Einkaufsliste für die nächsten 14 Tage:</h5>
    <div class="row no-wrap" v-for="ingredient in Ingredients" >
      <div class="col-2 q-pa-md" align="right">
        {{ ingredient.Amount }}&#8198g
      </div>
      <div class="col-4 q-pa-md text-weight-medium">
        <strong>{{ ingredient.DisplayName }}</strong>
      </div>
      <div class="col-1 q-pa-md" align="right">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-3 q-pt-md text-caption">
        {{ ingredient.CaloriesPer100g }}&#8198kcal pro 100&#8198g
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
      Ingredients:[],
    }
  },

  methods: {
    /**
     * this function adds ingredients to the backing fields and increases the amount, if it is already in the list
     * @param {object} shoppingListObject - custom application object
     */
    addElementUniqueToShoppingList(shoppingListObject) {
      for (let i = 0; i < this.Ingredients.length; i++)
      {
        if (this.Ingredients[i].id == shoppingListObject.id) {
          this.Ingredients[i].Amount += shoppingListObject.Amount
          return;
        }
      }
      this.Ingredients.push(shoppingListObject)
      return
    },

    /**
     * This function constructs and calls the function to add the ingredient to the backing fields
     * @param ingredientReference {string} - firestore reference
     * @param ingredient {} - firestore ingredient object
     */
    createShoppingListObject(ingredientReference, ingredient) {
      let ShoppingListObject = {
        DisplayName: ingredient.data().DisplayName,
        CaloriesPer100g: ingredient.data().CaloriesPer100g,
        Amount: ingredientReference.Gramm,
        id: ingredientReference.Path.id
      }

      this.addElementUniqueToShoppingList(ShoppingListObject)
    }

  },

  /**
   * This function will be called on page load, it will load all the data from the firestore and add it to the backing fields
   */
  created() {
    let currentTime = Math.floor(Date.now() / 1000);
    currentTime -= (new Date(currentTime * 1000).getSeconds()) //Remove seconds
    currentTime -= (new Date(currentTime  * 1000).getMinutes() * 60) //Remove minutes
    currentTime -= (new Date(currentTime  * 1000).getHours() * 60 * 60) //Remove hours

    db.collection('Nutzer').doc("p6it388BP6p236oqniWj").get().then(UserReference => {
        UserReference.data().MealCalendar.forEach(calendarEntry => {
          if(calendarEntry.Date.seconds >= currentTime && calendarEntry.Date.seconds <= (currentTime + (14 * 24 * 60 * 60) /*14 days offset*/ - 1))
          {
            db.collection('Rezepte').doc(calendarEntry.Rezept.id).get().then(recipe => {
              recipe.data().Zutaten.forEach(ingredientReference => {
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
