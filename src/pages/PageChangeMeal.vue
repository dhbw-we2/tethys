import db from '../router/db'

<template>
  <q-page class="flex flex-center">
    <!-- <h5>Add Meal</h5> -->

    <div class="q-gutter-md" style="max-width: 300px">
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
             v-for="(applicant, counter) in Zutatliste"
             v-bind:key="counter">
          <span class="cancelX" @click="CloseNewZutat(counter)">x</span>
          <label for="duration">{{counter+1}}.   Zutat:</label>
          <q-input
            filled
            label="Neue Zutat *"
            v-model="applicant.Name"
            required
            filled />

          <q-input
            required
            ref="age"
            filled
            type="number"
            v-model="applicant.Menge"
            label="Menge *"
            lazy-rules
            :rules="[
          val => val !== null && val !== '' || 'Please type a menge'
        ]"/>
          <q-select v-model="model" :options="options" label="Gramm"/>

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
    </div>
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
      gerichtname: '',
      zubereitung: '',
      options: [
        'Stück', 'Gramm'
      ],
      Zutatliste:[
        {
          Name: '',
          Menge:''
        }
      ]
    }
  },
  methods : {
    addVisa(){
      this.Zutatliste.push({
        Name:'',
        Menge: ''
      })
    },
    CloseNewZutat(counter){
      this.Zutatliste.splice(counter,1);
    },
    AddToDatabase() {
      let liste;
      this.Zutatliste.forEach(zutat => {
        let newestEntry = db.collection("Zutaten").doc().set({
          Name: zutat.Name,
        })
        liste.add(newestEntry);
      },

      db.collection("Rezepte").doc().set({
        DisplayName: this.gerichtname,
        Zubereitung: this.zubereitung,
        Zutaten: liste
      })
        .then(function() {
        console.log("Document successfully written!");
      })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        })
      )
    }
  }
}
</script>


<style scoped>

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
