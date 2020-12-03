<template>
  <q-page class="flex-center">

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
      <div class="col-2">
        Zubereitung: <br>{{ m.Zubereitung }}
      </div>
    </div>

    <q-btn label="+ MEAL"
           type="submit"
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

        <q-card-section class="row items-center">
          ID: {{ DialogShowMealObject.Id }}
        </q-card-section>

        <q-card-section class="row items-center">
          Zutaten:<br>
          <div class="NewZutatContainer"
               v-for="(zutat, counter) in DialogShowZutatliste"
               v-bind:key="counter">
            <span class="cancelX" @click="DialogDeleteZutat(zutat)">x</span>
            Zutat {{counter}}:<br>
            DisplayName: {{ zutat.DisplayName }}<br>
            id: {{zutat.id}}

          </div><br>
        </q-card-section>

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
          <q-btn flat label="Editieren" color="primary" @click="ShowDialog_EditMeal(DialogShowMealObject.Id)" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ADD/EDIT MEAL DIALOG BOX-->
    <q-dialog v-model="DialogAdditMeal">
      <q-card>
        <q-card-section class="row items-center q-mx-xl">
        <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
          <label> {{DialogAdditMealObject.Id}}</label>

          <q-input filled v-model="DialogAdditMealObject.DisplayName" label="Gerichtname" />

          <q-input
            ref="zubereitung"
            filled
            v-model="DialogAdditMealObject.Zubereitung"
            label="Zubereitung:"
            hint="zubereitung"
            lazy-rules
            type="textarea"
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />

          <div class="NewZutatContainer"
               v-for="(zutat, counter) in DialogAdditZutatliste"
               v-bind:key="counter">
            <span class="cancelX" @click="CloseNewZutat(counter)">x</span>
            <label>{{counter+1}}.   Zutat:</label>
            <q-input
              filled
              label="Neue Zutat *"
              v-model="zutat.DisplayName"
              required
              filled />

            <q-input
              required
              ref="age"
              filled
              type="number"
              v-model="zutat.Menge"
              label="Menge *"
              lazy-rules
              :rules="[
          val => val !== null && val !== '' || 'Please type a menge'
        ]"/>
            <q-select v-model="zutat.stueckodermenge" :options="options" label="Gramm"/>
          </div>

          <q-btn label="+ Zutat "
                 type="submit"
                 color="primary"
                 @click="AddZutat" />

        </form>
        </q-card-section>

        <!-- Notice v-close-popup -->
        <q-card-actions align="right">
          <q-btn flat label="Schließen" color="primary" v-close-popup />
          <q-btn flat label="Entfernen" color="primary" @click="RemoveMeal()" v-close-popup />
          <q-btn flat label="Speichern" color="primary" @click="AddToDatabase()" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--ADD MEAL-->
    <!--<div class="q-gutter-md" style="max-width: 300px">
      <form @submit.prevent.stop="onSubmit" @reset.prevent.stop="onReset" class="q-gutter-md">
        Gerichtname:
        <q-input filled v-model="gerichtname" label="Neues Gericht" />

        Zubereitung:
        <q-input
          ref="zubereitung"
          filled
          v-model="zubereitung"
          label="Your zubereitung *"
          hint="zubereitung"
          lazy-rules
          type="textarea"
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <div class="NewZutatContainer"
             v-for="(zutat, counter) in Zutatliste"
             v-bind:key="counter">
          <span class="cancelX" @click="CloseNewZutat(counter)">x</span>
          <label>{{counter+1}}.   Zutat:</label>
          <q-input
            filled
            label="Neue Zutat *"
            v-model="zutat.Name"
            required
            filled />

          <q-input
            required
            ref="age"
            filled
            type="number"
            v-model="zutat.Menge"
            label="Menge *"
            lazy-rules
            :rules="[
          val => val !== null && val !== '' || 'Please type a menge'
        ]"/>
          <q-select v-model="zutat.stueckodermenge" :options="options" label="Gramm"/>

        </div>


        <q-btn label="+"
               type="submit"
               color="primary"
               @click="addVisa" />

        <div>
          <q-btn label="Submit" type="submit" @click="AddToDatabase" color="primary" />
          <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
        </div>
      </form>
    </div>-->


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
      DialogAdditZutatliste:[{ Name: '', Menge:'',stueckodermenge: '', Id:0}],
      DialogShowMeal: false, // Visibility boolean for Show Meal Dialog
      DialogAdditMeal: false, // Visibility boolean for Edit Meal Dialog
      DialogShowMealObject: { Displayname: "", Zubereitung:"" , Time: 0, Calorie: 0, Id: 0 }, // Backing Field for Show Meal Dialog
      DialogAdditMealObject: { Displayname: "", Zubereitung: "", Time: 0, Calorie: 0, Id: 0 }, // Backing Field for Show Meal Dialog
      DialogShowZutatliste:[] , //:[{ Name: '', Menge:'',stueckodermenge: ''}],-->
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
      this.DialogAdditMealObject = { Displayname: "", Zubereitung: "",Time: 0, Calorie: 0, Id: 0 };
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
      this.DialogAdditZutatliste.push({
        Name: '',
        Menge: ''
      })
    },
    CloseNewZutat(counter) {
      this.DialogAdditZutatliste.splice(counter, 1);
    },

    AddToDatabase() {
      let liste;
      this.DialogAdditZutatliste.forEach(async zutat => {

        //lookup for this Zutat
        if(zutat.DisplayName != "")
        {
          //add zutat if not available
            let newestEntry = await db.collection("Zutaten").doc();
            newestEntry.set({
              DisplayName: zutat.DisplayName,
              KalorienPro100g: 0, //TODO
              PortionInGramm: 0, //TODO
            });
          console.log(newestEntry);
            liste.add(newestEntry);
          }
        });

      console.log("Liste:" + liste);
      console.log("ID:" +this.DialogAdditMealObject.Id);
        if(this.DialogAdditMealObject.Id == 0) {
          db.collection("Rezepte").doc().set({
            DisplayName: this.DialogAdditMealObject.DisplayName,
            Zubereitung: this.DialogAdditMealObject.Zubereitung,
            Zutaten: liste
          })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            })
        }
        else
        {
          db.collection("Rezepte").doc(this.DialogAdditMealObject.Id).update({
            DisplayName: this.DialogAdditMealObject.DisplayName,
            Zubereitung: this.DialogAdditMealObject.Zubereitung,
            //Zutaten: liste
          })
            .then(function () {
              console.log("Document successfully written!");
            })
            .catch(function (error) {
              console.error("Error writing document: ", error);
            })
        }
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
          console.log("Zutaten: " + zutatRef.id);

          db.collection('Zutaten').doc(zutatRef.id).get().then(zutatObj => {
            console.log("DisplayName: " + zutatObj.data().DisplayName);
            console.log("KalorienPro100g" + zutatObj.data().KalorienPro100g);

            this.DialogShowZutatliste.push({
              DisplayName: zutatObj.data().DisplayName,
              Kalorie: zutatObj.data().KalorienPro100g,
              id: zutatObj.id
            })
          })
        })
      })
    },
    ShowDialog_EditMeal(meal){
      this.DialogAdditMealObject = this.DialogShowMealObject;
      this.DialogAdditZutatliste = this.DialogShowZutatliste;
      this.DialogShowZutatliste = [];
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
