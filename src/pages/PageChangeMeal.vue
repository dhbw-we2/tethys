<template>
  <q-page class="flex-center items-baseline">

    <!--  Color in Dialog not green, Zutaten vorschlagen, Bevor ZUtat hinzugefügt wírd prüfen, Design, Verenglische, Dokumentation, Kommentare/Console raus

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
      <q-card>
        <q-card-section class="row items-center q-mx-xl">
          <strong>{{ DialogShowMealObject.DisplayName }}</strong>
        </q-card-section>

        <q-card-section class="row items-center">
          Zubereitung: <br>
          {{ DialogShowMealObject.Zubereitung }}
        </q-card-section>


        <q-card-section class="row items-center">
          Kalorien: {{ DialogShowMealObject.CalorieSum }}
        </q-card-section>

        <!-- <q-card-section class="row items-center">
          ID: {{ DialogShowMealObject.Id }}
        </q-card-section> -->

        <q-card-section class="row items-center">
          Zutaten:<br>
          <div class="NewZutatContainer"
               v-for="(zutat, counter) in DialogShowZutatliste"
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

          <!-- <label> ID: {{ DialogShowMealObject.Id }}</label> -->

          <q-input
            required
            filled v-model="DialogShowMealObject.DisplayName"
            label="Gerichtname"
          />

          <q-input
            filled v-model="DialogShowMealObject.ImageUrl"
            label="Bild-URL"
          />

          <q-input
            ref="zubereitung"
            filled
            required
            autogrow
            v-model="DialogShowMealObject.Zubereitung"
            label="Zubereitung:"
            lazy-rules
            type="textarea"
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <div class="NewZutatContainer"
               v-for="(zutat, counter) in DialogShowZutatliste"
               v-bind:key="counter">
            <span class="cancelX" @click="CloseNewZutat(counter)">x</span>
            <label>{{counter+1}}.   Zutat:</label>
            <q-input
              filled
              label="Neue Zutat *"
              v-model="zutat.DisplayName"
              required
              autocomplete="on"
              filled />

            <q-select
              filled
              :value="zutat.DisplayName"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="zutat.DisplayName"
              label="Zutat"
              :options="options"
              @input-value="(val) => {zutat.DisplayName = val}"
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

            <q-input
              required
              filled
              min="0"
              type="number"
              v-model="zutat.Gramm"
              label="Menge *"
              lazy-rules
              :rules="[
              val => val !== null && val !== '' || 'Please type a menge'
              ]"/>

            <q-input
              required
              filled
              min="0"
              type="number"
              v-model="zutat.CaloriesPer100g"
              label="Calories per 100g *"
              lazy-rules
              :rules="[
              val => val !== null && val !== '' || 'Please type a menge'
              ]"/>
          </div>

          <q-btn label="+ Zutat "
                 color="primary"
                 @click="AddZutat" />


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
  name: 'PageAddMeal',
  props: {
    msg: String
  },
  data(){
    return {
      meals:[],
      gerichtname: '',
      zubereitung: '',
      options: [],
      DialogShowMealObject: { Displayname: "", Zubereitung:"" ,ImageUrl: "", Time: 0, Calorie: 0, Id: 0 }, // Backing Field for Show Meal Dialog
      DialogShowZutatliste:[{ Name: '', Gramm:'',stueckodermenge: '', Id:0}],
      DialogShowZutatliste2:[{ Name: '', Gramm:'',stueckodermenge: '', Id:0}],
      DialogShowMeal: false, // Visibility boolean for Show Meal Dialog
      DialogAdditMeal: false, // Visibility boolean for Add/Edit Meal Dialog

    }
  },
  async created() {
    this.LoadMeals();
  },
  methods : {
    AddMeal(){
      this.DialogShowMealObject = { Displayname: "", Zubereitung: "",Time: 0, Calorie: 0, Id: 0 };
      this.DialogShowZutatliste = [];
      this.DialogAdditMeal = true;
    },

    LoadMeals(){
      this.meals = [];
      db.collection('Rezepte').orderBy("DisplayName").get().then( rezepte => {
        rezepte.forEach(rezept => {
          console.log(rezept.id + rezepte);
          let ShoppingListObject = {
            DisplayName: rezept.data().DisplayName,
            Zubereitung: rezept.data().Zubereitung,
            CalorieSum: 0,
            id: rezept.id
          }

          ShoppingListObject.ImageUrl = (rezept.data().ImageUrl !== undefined ) ? rezept.data().ImageUrl : "";


          //foreach zutat let ShoppingListObject + Kalorien
          rezept.data().Zutaten.forEach(zutatRef => {
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

      this.loadZutatenOptions();
    },

    AddZutat() {
      this.DialogShowZutatliste.push({
        Name: '',
        Menge: ''
      })
    },

    CloseNewZutat(counter) {
      this.DialogShowZutatliste.splice(counter, 1);
    },

    filterFn (val, update, abort) {
      console.log(this.options.length);
      if (this.options.length != 0) {
        update()
        return
      }

      setTimeout(() => {
        update(() => {
          this.loadZutatenOptions()
        })
      }, 3000)
    },

    abortFilterFn () {
      // console.log('delayed filter aborted')
    },

    async loadZutatenOptions()
    {
      this.options = [];
      db.collection('Zutaten').orderBy("DisplayName").get().then( zutatObj => {
        zutatObj.forEach(zutat => {
          this.options.push(zutat.data().DisplayName);
        })
      })
    },

    async DialogAdditSaveToDatabase() {
      let liste = [];
      let isValidated = false;
      let isSavedToDatabase = false;

      isValidated = await this.$refs.AdditForm.validate();

      if(isValidated === true)
      {
        console.log("IsValidated");

        for (let i = 0; i < this.DialogShowZutatliste.length; i++) {
          //lookup for this Zutat

          let gramm = this.DialogShowZutatliste[i].Gramm;
          if(this.DialogShowZutatliste[i].DisplayName !== "") {
            //TODO add zutat if not available

          await db.collection("Zutaten").add({
            DisplayName: this.DialogShowZutatliste[i].DisplayName,
            CaloriesPer100g:  parseInt(this.DialogShowZutatliste[i].CaloriesPer100g)
          })
            .then(function (docRef) {
              console.log("(Zutat)Document written with ID: ", docRef.id);

              liste.push({Path: db.collection('Zutaten').doc(docRef.id), Gramm: parseInt(gramm)});
            })
            .catch(function (error) {
              console.error("(Zutat)Error adding document: ", error);
            });
          }
        };

        console.log("Liste:" + liste);
        console.log("(Rezept) ID:" +this.DialogShowMealObject.Id);

        let imagurUrl = (this.DialogShowMealObject.ImageUrl !== undefined) ? this.DialogShowMealObject.ImageUrl : "";
          if(this.DialogShowMealObject.Id == 0) {
             await db.collection("Rezepte").add({
              DisplayName: this.DialogShowMealObject.DisplayName,
              Zubereitung: this.DialogShowMealObject.Zubereitung,
              ImageUrl : imagurUrl,
              Zutaten: liste
            })
              .then(function (docRef) {
                console.log("(Rezept)Document successfully written!: " + docRef.id);
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
              Zubereitung: this.DialogShowMealObject.Zubereitung,
              Zutaten: liste
            })
              .then(function () {
                console.log("Document successfully written!");
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
            console.log("Couldnt save to DB");
      }
      else
        console.log("Not Validated?");
    },

    DialogAdditRemoveMeal() {
      if(this.DialogShowMealObject.Id != 0)
        db.collection("Rezepte").doc(this.DialogShowMealObject.Id).delete();

      this.LoadMeals();
    },

    MealClicked(meal) {
      this.DialogShowZutatliste = [];
      this.DialogShowMeal = true;
      console.log(meal.id);
      this.DialogShowMealObject.Id = meal.id;
      this.DialogShowMealObject.DisplayName = meal.DisplayName;
      this.DialogShowMealObject.Zubereitung = meal.Zubereitung;
      this.DialogShowMealObject.CalorieSum = meal.CalorieSum;
      this.DialogShowMealObject.ImageUrl = meal.ImageUrl;


      //Read Zutaten
      db.collection('Rezepte').doc(meal.id).get().then(mealObj => {
        mealObj.data().Zutaten.forEach(zutatRef => {
          console.log("Zutaten: " + zutatRef.Path);

          db.collection('Zutaten').doc(zutatRef.Path.id).get().then(zutatObj => {
            console.log("DisplayName: " + zutatObj.data().DisplayName);
            console.log("KalorienPro100g" + zutatObj.data().CaloriesPer100g);

            this.DialogShowZutatliste.push({
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
  /*border: 1.5px solid;*/
  padding:12px;
  margin-bottom: 10px;

}
.Meallistmeal:hover {
  background-color: greenyellow;
}

.NewZutatContainer{
  border: 1.5px solid;
  padding:5px;
  margin-bottom: 10px;
}

.cancelX{
  width: 30px;
  float: right;
  cursor: pointer;
}

#visa {
  margin: 20px auto;
  max-width: 700px;
}

#app {
font-family: 'Avenir', Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-align: center;
color: #2c3e50;
margin-top: 60px;
}
</style>
