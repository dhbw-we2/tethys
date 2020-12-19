<template>
  <q-page class="flex-center">

    <!-- TODO SORT, Kalorien, Validate Entries, Color in Dialog not green, Liste refreshen nach Add,Delete,Edit; Zutaten vorschlagen-->

    <!--MEAL LIST-->
     <h5>Gerichte:</h5>
    <div class="row no-wrap Meallistmeal" @click="MealClicked(m)" v-for="m in meals" >
      <div class="col-1">
        <q-icon name="local_fire_department" color="orange"/>
      </div>
      <div class="col-1">
        {{ m.KalorienPro100g }} kcal
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
          {{ DialogShowMealObject.Zubereitung }}
        </q-card-section>


        <q-card-section class="row items-center">
          Kalorien: {{ DialogShowMealObject.Calorie }}
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

          <!-- <q-select  filled
                     :value="model"
                     use-input
                     hide-selected
                     fill-input
                     input-debounce="0"
                     :options="zutatOptions"
                     @filter="filterFn"
                     @input-value="setModel"
                     hint=""
                     style="width: 250px; padding-bottom: 32px"/> -->

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
      options: ['Stück', 'Gramm'],
      DialogShowMealObject: { Displayname: "", Zubereitung:"" , Time: 0, Calorie: 0, Id: 0 }, // Backing Field for Show Meal Dialog
      DialogShowZutatliste:[{ Name: '', Gramm:'',stueckodermenge: '', Id:0}],
      DialogShowZutatliste2:[{ Name: '', Gramm:'',stueckodermenge: '', Id:0}],
      DialogShowMeal: false, // Visibility boolean for Show Meal Dialog
      DialogAdditMeal: false, // Visibility boolean for Edit Meal Dialog

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
    db.collection('Rezepte').get().then( rezepte => {
        rezepte.forEach(rezept => {
          console.log(rezept.id + rezepte);
          let ShoppingListObject = {
            DisplayName: rezept.data().DisplayName,
            Zubereitung: rezept.data().Zubereitung,
            KalorienPro100g: 0,
            id: rezept.id
          }
          this.addElementUniqueToShoppingList(ShoppingListObject);
        })
    })
  },
  methods : {
    AddMeal(){
      this.DialogShowMealObject = { Displayname: "", Zubereitung: "",Time: 0, Calorie: 0, Id: 0 };
      this.DialogShowZutatliste = [];
      this.DialogAdditMeal = true;
    },

    DialogDeleteZutat(zutat){
      //DB DELETE
      //db.collection('Zutaten').doc(zutat.id).get().then(zutatObj => {
      //    console.log("DisplayName: " + zutatObj.data().DisplayName);
      //    console.log("KalorienPro100g" + zutatObj.data().KalorienPro100g);

      //LIST DELETE
      this.DialogShowZutatliste.splice(this.DialogShowZutatliste.indexOf(zutat),1);
    },

    addElementUniqueToShoppingList(shoppingListObject) {
      //for (let i = 0; i < this.meals.length; i++) {
      //   if (this.meals[i].id == shoppingListObject.id) {
      //    this.meals[i].Zubereitung += shoppingListObject.Zubereitung
      //    return;
      //  }
      // }
      this.meals.push(shoppingListObject)
      return
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
            CaloriesPer100g:  this.DialogShowZutatliste[i].CaloriesPer100g
          })
            .then(function (docRef) {
              console.log("(Zutat)Document written with ID: ", docRef.id);

              liste.push({Path: db.collection('Zutaten').doc(docRef.id), Gramm: gramm});
            })
            .catch(function (error) {
              console.error("(Zutat)Error adding document: ", error);
            });



          }
        };

        console.log("Liste:" + liste);
        console.log("(Rezept) ID:" +this.DialogShowMealObject.Id);
          if(this.DialogShowMealObject.Id == 0) {
             await db.collection("Rezepte").add({
              DisplayName: this.DialogShowMealObject.DisplayName,
              Zubereitung: this.DialogShowMealObject.Zubereitung,
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

          if(isSavedToDatabase === true)
            this.DialogAdditMeal=false;
          else
            console.log("Couldnt save to DB");
      }
      else
        console.log("Not Validated?");
    },
    DialogAdditRemoveMeal() {
      if(this.DialogShowMealObject.Id != 0)
        db.collection("Rezepte").doc(this.DialogShowMealObject.Id).delete();

    },
    MealClicked(meal) {
      this.DialogShowZutatliste = [];
      this.DialogShowMeal = true;
      console.log(meal.id);
      this.DialogShowMealObject.Id = meal.id;
      this.DialogShowMealObject.DisplayName = meal.DisplayName;
      this.DialogShowMealObject.Zubereitung = meal.Zubereitung;


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
  border: 1.5px solid;
  padding:5px;
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
