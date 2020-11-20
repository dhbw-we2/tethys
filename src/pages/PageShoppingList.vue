<template>
  <q-page class="flex flex-top-left">
    <q-list class="q-pl-xl">
      <q-list-header><h3>Einkaufsliste</h3></q-list-header>
      <q-item v-for="z in zutaten">
        <q-item class="q-px-xl">
          <q-item-section>
            <q-item-label><h6>{{ z.DisplayName }}</h6></q-item-label>
            <q-item-label caption>{{ z.PortionInGramm }}</q-item-label>
          </q-item-section>

          <q-item-section side bottom>
            <q-item-label caption>{{ z.KalorienPro100g }}</q-item-label>
            <q-icon name="local_fire_department" color="orange"/>
          </q-item-section>
        </q-item>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import db from '../router/db'

export default {
  name: 'PageShoppingList',
  data() {
    return {
      zutaten:[],
      zubereitung:"",
      bildULR:""
    }
  },

  created() {
    let zutatenDB = db.collection('Zutaten')
    const snapshot = zutatenDB.get().then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data())
        this.zutaten.push(doc.data())
      })
    })
  }
}
</script>


/*
db.collection('posts').get()
.then(posts => {
if (!posts.empty) {
posts.forEach((doc) => {
this.posts.push(doc.data())
})
this.loadingPosts = false
}
}).catch(error => {
this.$q.dialog({ title: error.code, message: error.message })
this.loadingPosts = false
})
*/
