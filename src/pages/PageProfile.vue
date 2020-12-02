<template>
  <q-page class="row justify-center q-pa-md">
    <h5 align="center">Profile</h5>
    <div class="q-pa-md" style="width: 700px">
      <q-list bordered class="rounded-borders">
          <q-card>
            <q-card-section>
              <q-avatar size="360px">
                <img src="https://avatars3.githubusercontent.com/u/13683277?s=460&u=a90a4b666d907370d387e5af56a6c6c5e295ee2b&v=4">
              </q-avatar>
            </q-card-section>
          </q-card>


        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Kalorien Einstellungen"
        >
          <q-card>
            <q-card-section>
              <!--https://quasar.dev/vue-components/table-->
              <q-table
                title="Tägliche Kalorien"
                :data="caldata"
                :columns="columns"
                row-key="name"
                light
                color="amber"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Andere"
        >
          <q-card>
            <q-card-section>
              nothing yet
            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-list>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar';
import firebase from 'firebase';
export default {
  name: 'PageProfile',
  data () {
    return {}
  },

  methods: {

  },

  created() {
    this.getPosts()
  }
}


</script>

<style lang="sass">
.card-post
  .q-img
    min-height: 200px
</style>

