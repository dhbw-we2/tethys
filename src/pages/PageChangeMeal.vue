<template>
  <q-page class="flex-center items-baseline">

    <!-- Design, Dokumentation

    Ladebalken -->

    <!--MEAL LIST-->
    <h5 class="q-pl-md q-ml-xl">Gerichte:</h5>
    <div class="row no-wrap Meallistmeal" @click="MealClicked(m)" v-for="m in meals" >
      <div class="col-1"></div>
      <div class="col-4 " >
        <strong>{{ m.DisplayName }}</strong>
      </div>
      <div class="col-1" align="right">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-3">
        &#8202{{ m.CalorieSum }}&#8198kcal
      </div>
    </div>

    <q-btn color=primary
           icon="add"
           label="Rezept"
           class="q-ma-md float-right"
           size="lg"
           @click="AddMeal" />

    <!--SHOW MEAL DIALOG BOX-->
    <q-dialog v-model="DialogShowMeal">
      <q-card style="width: 650px; max-width: 80vw;">
        <q-card-section class="text-center">
          <strong>{{ DialogShowMealObject.DisplayName }}</strong>
        </q-card-section>

        <q-card-section horizontal>
          <q-img :src="DialogShowMealObject.ImageUrl" class="q-ml-md" style="max-height: 360px; max-width: 360px;" />
          <q-card-section>
            <q-card-section>
              <strong>Zutaten:</strong>
            </q-card-section>
            <q-card-section>
              <q-list>
                <q-item v-for="(ingredient, counter) in DialogShowIngredientList" v-bind:key="counter">
                  {{ingredient.Amount}}g {{ingredient.DisplayName}}
                </q-item>
              </q-list>
            </q-card-section>
          </q-card-section>
        </q-card-section>

        <q-card-section>
          <p>Diese Mahlzeit hat einen Brennwert von {{DialogShowMealObject.CalorieSum}} Kalorien</p>
          <p><strong>Zubereitung:</strong></p>
          {{ DialogShowMealObject.Preparation }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline label="Schließen" color="primary" v-close-popup />
          <q-btn push label="Editieren" color="primary" @click="ShowDialog_EditMeal()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ADD/EDIT(Addit) MEAL DIALOG BOX-->
    <q-dialog v-model="DialogAdditMeal">
      <q-card style="width: 650px; max-width: 80vw;">
        <q-form ref="AdditForm">
          <q-card-section class="items-center">
            <q-input
              class="text-primary"
              required
              filled
              label-color="green"
              v-model="DialogShowMealObject.DisplayName"
              label="Gerichtname"
              :rules="[
              val => val !== null && val !== '']"
            />
          </q-card-section>
          <q-card-section>
            <q-input filled label-color="green" v-model="DialogShowMealObject.ImageUrl" label="Bild-URL" />
          </q-card-section>

          <q-card-section>
            <q-input
              filled
              required
              autogrow
              label-color="green"
              v-model="DialogShowMealObject.Preparation"
              label="Zubereitung:"
              type="textarea"
              :rules="[
              val => val !== null && val !== '']"
            />
          </q-card-section>

          <q-card-section>
            <div class="q-pa-xs q-ma-xs" v-for="(ingredient, counter) in DialogShowIngredientList" v-bind:key="counter">

            <strong>{{counter+1}}.   Zutat:</strong>

            <q-card-section horizontal>
              <q-select
                required
                filled
                use-input
                label-color="green"
                hide-selected
                fill-input
                class="q-pa-xs"
                :value="ingredient"
                label="Zutat"
                :options="options"
                :option-value = "opt => opt.DisplayName"
                :option-label = "(opt) => {if(opt.DisplayName !== undefined){return opt.DisplayName + ' (' + opt.CaloriesPer100g + 'kcal)'}}"
                @input="(opt) => { SelectOptionToIngredient(ingredient,opt); }"
                @filter="filterFn"
                @filter-abort="abortFilterFn"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <q-input
                required
                filled
                min="0"
                class="q-pa-xs"
                label-color="green"
                type="number"
                v-model="ingredient.Amount"
                label="Menge in Gramm"
                lazy-rules
                :rules="[
              val => val !== null && val !== '' || 'Bitte Menge angeben'
              ]"/>
              <q-btn class="q-ma-md text-primary" @click="CloseNewIngredient(counter)" icon="clear" />
            </q-card-section>



          </div>
          <q-card-section horizontal>
            <q-btn class="q-ma-sm" label="Zutat hinzufügen" color="primary" @click="AddEmptyIngredientToLocalList" />
            <q-btn class="q-ma-sm" label="Zutat anlegen" color="primary" @click="AddNewIngredient" />
          </q-card-section>


        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline label="Schließen" color="primary" v-close-popup />
          <q-btn push label="Entfernen" color="primary" @click="DialogAdditRemoveMeal()" v-close-popup />
          <q-btn push type="submit" label="Speichern" color="primary" @click="DialogAdditSaveToDatabase()" />
        </q-card-actions>

        </q-form>
      </q-card>
    </q-dialog>

    <!-- New INGREDIENT DIALOG BOX-->
    <q-dialog v-model="DialogNewIngredient">

      <q-card style="width: 480px;">
        <q-form ref="NewIngredientForm" class="q-gutter-md">

          <q-card-section>
            <p><strong>Neue Zutat hinzufügen:</strong></p>
            <div v-model="DialogNewIngredientObject">
              <q-card-section>
                <q-input
                  class="text-primary"
                  required
                  filled
                  label-color="green"
                  v-model="DialogNewIngredientObject.DisplayName"
                  label="Zutatenname"
                  :rules="[
                val => val !== null && val !== '']"
                />

                <q-input
                  filled
                  min="0"
                  type="number"
                  label-color="green"
                  v-model="DialogNewIngredientObject.CaloriesPer100g"
                  label="Kalorien pro 100g"/>
              </q-card-section>
            </div>

          </q-card-section>

          <q-card-actions align="right">
            <q-btn outline label="Schließen" color="primary" v-close-popup />
            <q-btn push type="submit" label="Speichern" color="primary" @click="DialogNewIngredientSaveToDatabase()" />
          </q-card-actions>

        </q-form>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import db from "src/router/db";

export default {
  name: 'PageChangeMeal',
  props: {
    msg: String
  },
  data(){
    return {
      meals:[],
      options: [],
      DialogShowMealObject: { Displayname: "", Preparation:"" ,ImageUrl: "", Time: 0, Calorie: 0, Id: 0 }, // Backing Field for Show Meal Dialog
      DialogNewIngredientObject: { Displayname: "",  Calorie: 0 },
      DialogShowIngredientList:[{ Name: '', Amount:'', Id:0}],
      DialogShowMeal: false, // Visibility boolean for Show Meal Dialog
      DialogAdditMeal: false, // Visibility boolean for Add/Edit Meal Dialog
      DialogNewIngredient: false, // Visibility boolean for New Ingredient Dialog,

    }
  },
  async created() {
    this.LoadMeals();
  },
  methods : {
    AddMeal(){
      this.DialogShowMealObject = { DisplayName: "", Preparation: "",Time: 0, Calorie: 0, Id: 0 };
      this.DialogShowIngredientList = [];
      this.DialogAdditMeal = true;
    },

    LoadMeals(){
      this.meals = [];
      db.collection('Rezepte').orderBy("DisplayName").get().then( meals => {
        meals.forEach(meal => {
          let ShoppingListObject = {
            DisplayName: meal.data().DisplayName,
            Preparation: meal.data().Zubereitung,
            CalorieSum: 0,
            id: meal.id
          }

          ShoppingListObject.ImageUrl = (meal.data().ImageUrl !== undefined ) ? meal.data().ImageUrl : "";

          meal.data().Zutaten.forEach(ingredientRef => {
            db.collection('Zutaten').doc(ingredientRef.Path.id).get().then(ingredientObj => {
              ShoppingListObject.CalorieSum += Math.floor(ingredientObj.data().CaloriesPer100g * (ingredientRef.Gramm/100));
            })
          })

          this.meals.push(ShoppingListObject)
        })
      });

      this.meals.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

      this.loadIntegredientOptions();
    },

    AddEmptyIngredientToLocalList() {
      this.DialogShowIngredientList.push({
        Name: '',
        Menge: ''
      })
    },

    AddNewIngredient() {
      this.DialogNewIngredientObject = { Displayname: "",  Calorie: 0 },
      this.DialogNewIngredient = true;
    },

    CloseNewIngredient(counter) {
      this.DialogShowIngredientList.splice(counter, 1);
    },

    SelectOptionToIngredient(ingredient,opt){
      if(opt !== undefined || opt != null) {
        console.log(opt.CaloriesPer100g);
        ingredient.DisplayName = opt.DisplayName;
        ingredient.CaloriesPer100g = opt.CaloriesPer100g;
        ingredient.id = opt.id;
      }
    },

    filterFn (val, update, abort) {
      if (this.options.length != 0) {
        update()
        return
      }

      setTimeout(() => {
        update(() => {
          this.loadIntegredientOptions()
        })
      }, 3000)
    },

    abortFilterFn () {

    },

    async loadIntegredientOptions()
    {
      this.options = [];
      db.collection('Zutaten').orderBy("DisplayName").get().then( ingredientObj => {
        ingredientObj.forEach(ingredient => {
          this.options.push({DisplayName: ingredient.data().DisplayName,CaloriesPer100g: ingredient.data().CaloriesPer100g, id: ingredient.id});
        })
      })
    },

    async DialogAdditSaveToDatabase() {
      let list = [];
      let isValidated = false;
      let isSavedToDatabase = false;

      isValidated = await this.$refs.AdditForm.validate();

      console.log(isValidated);
      if(isValidated === true)
      {
        for (let i = 0; i < this.DialogShowIngredientList.length; i++) {

          if(this.DialogShowIngredientList[i].DisplayName !== "" && this.DialogShowIngredientList[i].DisplayName !== undefined) {
            console.log(this.DialogShowIngredientList[i].DisplayName)
            let createNewEntry = true;
            let amount = this.DialogShowIngredientList[i].Amount;

            let ingredientsQueriedRef = await db.collection("Zutaten").where("DisplayName", "==", this.DialogShowIngredientList[i].DisplayName).where("CaloriesPer100g", "==", this.DialogShowIngredientList[i].CaloriesPer100g).get();
            if (ingredientsQueriedRef.size >= 0) {
              console.log(ingredientsQueriedRef.docs[0].id);
               list.push({Path: db.collection('Zutaten').doc(ingredientsQueriedRef.docs[0].id), Gramm: parseInt(amount)});
            }
          }
        };

       let imagurUrl = (this.DialogShowMealObject.ImageUrl !== undefined) ? this.DialogShowMealObject.ImageUrl : "";
          if(this.DialogShowMealObject.Id == 0) {
             await db.collection("Rezepte").add({
              DisplayName: this.DialogShowMealObject.DisplayName,
              Zubereitung: this.DialogShowMealObject.Preparation,
              ImageUrl : imagurUrl,
              Zutaten: list
            })
              .then(function (docRef) {
                isSavedToDatabase = true;
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              })
          }
          else
          {
            await db.collection("Rezepte").doc(this.DialogShowMealObject.Id).update({
              DisplayName: this.DialogShowMealObject.DisplayName,
              Zubereitung: this.DialogShowMealObject.Preparation,
              Zutaten: list
            })
              .then(function () {
                isSavedToDatabase = true;
              })
              .catch(function (error) {
                console.error("Error writing document: ", error);
              })
          }

          if(isSavedToDatabase === true) {
            this.DialogAdditMeal = false;
            this.LoadMeals();
          }
          else
            console.error("Couldnt save to DB");
      }
    },

    async DialogNewIngredientSaveToDatabase()
    {
      await db.collection("Zutaten").add({
        DisplayName: this.DialogNewIngredientObject.DisplayName,
        CaloriesPer100g: parseInt(this.DialogNewIngredientObject.CaloriesPer100g)
      })
        .then(function (docRef) {

        })
        .catch(function (error) {
          console.error("(Zutat)Error adding document: ", error);
        });

      await this.loadIntegredientOptions();
      this.DialogNewIngredient = false;
    },

    async DialogAdditRemoveMeal() {
      if(this.DialogShowMealObject.Id != 0)
        await db.collection("Rezepte").doc(this.DialogShowMealObject.Id).delete();

      this.LoadMeals();
    },

    MealClicked(meal) {
      this.DialogShowIngredientList = [];
      this.DialogShowMeal = true;
      this.DialogShowMealObject.Id = meal.id;
      this.DialogShowMealObject.DisplayName = meal.DisplayName;
      this.DialogShowMealObject.Preparation = meal.Preparation;
      this.DialogShowMealObject.CalorieSum = meal.CalorieSum;
      this.DialogShowMealObject.ImageUrl = meal.ImageUrl;


      //Read Zutaten
      db.collection('Rezepte').doc(meal.id).get().then(mealObj => {
        mealObj.data().Zutaten.forEach(ingredientRef => {
         db.collection('Zutaten').doc(ingredientRef.Path.id).get().then(ingredientObj => {
          this.DialogShowIngredientList.push({
              DisplayName: ingredientObj.data().DisplayName,
              CaloriesPer100g: ingredientObj.data().CaloriesPer100g,
              id: ingredientObj.id,
              Amount: ingredientRef.Gramm,
            })
          })
        })
      })
    },

    ShowDialog_EditMeal(meal){
      this.DialogShowMeal = false;
      this.DialogAdditMeal = true;
    }
  }
}
</script>


<style scoped>

.Meallistmeal{
  /*border: 1.5px solid;*/
  padding:12px;
  margin-bottom: 10px;

}

.Meallistmeal:hover {
  background-color: greenyellow;
  cursor: pointer;
}

</style>
