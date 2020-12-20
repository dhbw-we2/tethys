<template>
  <q-page class="flex-center">

    <!-- Zutaten vorschlagen, Bevor ZUtat hinzugefügt wírd prüfen, Design, Dokumentation

    Ladebalken -->

    <!--MEAL LIST-->
     <h5>Gerichte:</h5>
    <div class="row no-wrap Meallistmeal" @click="MealClicked(m)" v-for="m in meals" >
      <div class="col-1">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-1">
        {{ m.CalorieSum }} kcal
      </div>
      <div class="col-4" >
        <strong>{{ m.DisplayName }}</strong>
      </div>
    </div>

    <q-btn label="+ MEAL"
           color="primary"
           @click="AddMeal" />

    <!--SHOW MEAL DIALOG BOX-->
    <q-dialog v-model="DialogShowMeal">
      <q-card>
        <q-card-section class="row items-center q-mx-xl">
          <strong>{{ DialogShowMealObject.DisplayName }}</strong>
        </q-card-section>

        <q-card-section class="row items-center">
          Zubereitung: <br>
          {{ DialogShowMealObject.Preparation }}
        </q-card-section>


        <q-card-section class="row items-center">
          Kalorien: {{ DialogShowMealObject.CalorieSum }}
        </q-card-section>

        <!-- <q-card-section class="row items-center">
          ID: {{ DialogShowMealObject.Id }}
        </q-card-section> -->

        <q-card-section class="row items-center">
          Zutaten:<br>
          <div class="NewIngredientContainer"
               v-for="(zutat, counter) in DialogShowIngredientList"
               v-bind:key="counter">
            <!-- <span class="cancelX" @click="DialogDeleteZutat(zutat)">x</span> -->
            Zutat {{counter}}:<br>
            <!-- DisplayName:--> {{ zutat.DisplayName }}<br>
            Menge: {{ zutat.Gramm }}g<br>
            KalorienPer100g: {{ zutat.CaloriesPer100g }}
            <!-- id: {{zutat.id}} -->
          </div><br>
        </q-card-section>

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
          <q-btn flat label="Editieren" color="primary" @click="ShowDialog_EditMeal()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ADD/EDIT(Addit) MEAL DIALOG BOX-->
    <q-dialog v-model="DialogAdditMeal">
      <q-card>
        <q-form ref="AdditForm" class="q-gutter-md">

        <q-card-section class="row items-center q-mx-xl">

          <q-input
            class="DialogInputTextColor"
            required
            filled
            label-color="green"
            v-model="DialogShowMealObject.DisplayName"
            label="Gerichtname"
            :rules="[
              val => val !== null && val !== '']"
          />

          <q-input
            filled
            label-color="green"
            v-model="DialogShowMealObject.ImageUrl"
            label="Bild-URL"
          />

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

          <div class="NewIngredientContainer"
               v-for="(zutat, counter) in DialogShowIngredientList"
               v-bind:key="counter">
            <span class="cancelX" @click="CloseNewIngredient(counter)">x</span>
            <label>{{counter+1}}.   Zutat:</label>


            <q-select
              filled
              :value="zutat.DisplayName"
              use-input
              label-color="green"
              hide-selected
              fill-input
              v-model="zutat.DisplayName"
              label="Zutat"
              :options="options"
              :option-label = "opt => opt.DisplayName + ' (' + opt.CaloriesPer100g + 'g)'"
              @filter="filterFn"
              @filter-abort="abortFilterFn"
              style="width: 250px"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-btn label="*Neu*"
                   color="primary"
                   @click="AddIngredient" />
            <q-input
              required
              filled
              min="0"
              type="number"
              label-color="green"
              v-model="zutat.CaloriesPer100g"
              label="Calories per 100g *"
              lazy-rules
              :rules="[
              val => val !== null && val !== '' || 'Bitte Kalorien angeben'
              ]"/>


            <q-input
              required
              filled
              min="0"
              label-color="green"
              type="number"
              v-model="zutat.Gramm"
              label="Menge *"
              lazy-rules
              :rules="[
              val => val !== null && val !== '' || 'Bitte Menge angeben'
              ]"/>



            <q-input
              filled
              label-color="green"
              label="Neue Zutat *"
              v-model="zutat.DisplayName"
              required
              autocomplete="on"
              filled />
          </div>

          <q-btn label="+ Zutat "
                 color="primary"
                 @click="AddIngredient" />


        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
          <q-btn flat label="Entfernen" color="primary" @click="DialogAdditRemoveMeal()" v-close-popup />
          <q-btn flat type="submit" label="Speichern" color="primary" @click="DialogAdditSaveToDatabase()" />
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
      DialogShowIngredientList:[{ Name: '', Gramm:'', Id:0}],
      DialogShowMeal: false, // Visibility boolean for Show Meal Dialog
      DialogAdditMeal: false, // Visibility boolean for Add/Edit Meal Dialog

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

          meal.data().Zutaten.forEach(zutatRef => {
            db.collection('Zutaten').doc(zutatRef.Path.id).get().then(zutatObj => {
              ShoppingListObject.CalorieSum += Math.floor(zutatObj.data().CaloriesPer100g * (zutatRef.Gramm/100));
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

    AddIngredient() {
      this.DialogShowIngredientList.push({
        Name: '',
        Menge: ''
      })
    },

    CloseNewIngredient(counter) {
      this.DialogShowIngredientList.splice(counter, 1);
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
      db.collection('Zutaten').orderBy("DisplayName").get().then( zutatObj => {
        zutatObj.forEach(zutat => {
          this.options.push({DisplayName: zutat.data().DisplayName,CaloriesPer100g: zutat.data().CaloriesPer100g});
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
          // TODO lookup for this Zutat

          let gramm = this.DialogShowIngredientList[i].Gramm;
          if(this.DialogShowIngredientList[i].DisplayName !== "") {
            //TODO add zutat if not available

            if (this.DialogShowIngredientList[i].Id == 0) {
              await db.collection("Zutaten").add({
                DisplayName: this.DialogShowIngredientList[i].DisplayName,
                CaloriesPer100g: parseInt(this.DialogShowIngredientList[i].CaloriesPer100g)
              })
                .then(function (docRef) {
                  list.push({Path: db.collection('Zutaten').doc(docRef.id), Gramm: parseInt(gramm)});
                })
                .catch(function (error) {
                  console.error("(Zutat)Error adding document: ", error);
                });
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

    DialogAdditRemoveMeal() {
      if(this.DialogShowMealObject.Id != 0)
        db.collection("Rezepte").doc(this.DialogShowMealObject.Id).delete();

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
        mealObj.data().Zutaten.forEach(zutatRef => {
         db.collection('Zutaten').doc(zutatRef.Path.id).get().then(zutatObj => {
          this.DialogShowIngredientList.push({
              DisplayName: zutatObj.data().DisplayName,
              CaloriesPer100g: zutatObj.data().CaloriesPer100g,
              id: zutatObj.id,
              Gramm: zutatRef.Gramm,
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
  border: 1.5px solid;
  padding:5px;
  margin-bottom: 10px;

}
.Meallistmeal:hover {
  background-color: greenyellow;
}

.NewIngredientContainer{
  border: 1.5px solid;
  padding:5px;
  margin-bottom: 10px;
}

.cancelX{
  width: 30px;
  float: right;
  cursor: pointer;
}

.DialogInputTextColor{
  color: #f7c548;
}



</style>
