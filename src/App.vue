<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import db from './router/db'
export default {
  name: 'App',
  /*
  created(){
    //hiermit greifen wir nur auf ein konkretes Dokument zu
    let docs = db.collection('Rezepte')
    const snapshot = docs.get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
      })
    })
    if (snapshot.empty) {
      console.log('No matching documents.')
      return
    }
  }
  */
}
</script>
