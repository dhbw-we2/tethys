<template>
  <q-page class="row justify-center q-pa-md">
    <h5 align="center">Profile</h5>
    <div class="q-pa-md" style="width: 700px">
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Account"
          caption="John Doe"
        >
          <q-card>
            <q-card-section>
              <q-avatar  size="480px">
                <img src="https://avatars3.githubusercontent.com/u/13683277?s=460&u=a90a4b666d907370d387e5af56a6c6c5e295ee2b&v=4">
              </q-avatar>
            </q-card-section>
          </q-card>
        </q-expansion-item>

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
                :data="data"
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
  <!--<q-page class="row constrain q-pa-md">-->
  <!-- <h5 align="center">Profile</h5>

    <div class="row flex large-gutter">
      <div>First column</div>
      <div>Second column</div>
    </div>

    <div class="row-4 large-gutter">
      &lt;!&ndash;<div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">

          <q-item>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://avatars3.githubusercontent.com/u/13683277">
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">freddie_walker</q-item-label>
              <q-item-label caption>
                {{ post.location }}
              </q-item-label>
            </q-item-section>
          </q-item>

          &lt;!&ndash;<q-card
            v-for="post in posts"
            :key="post.id"
            class="card-post q-mb-md"
            bordered
            flat
          >&ndash;&gt;


&lt;!&ndash;            <q-separator />

            <q-img height="50%"
                   :src="post.imageUrl"
            />

            <q-card-section>
              <div>{{ post.caption }}</div>
              <div class="text-caption text-grey">{{ post.date | niceDate }}</div>
            </q-card-section>

          </q-card>&ndash;&gt;
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>
      &lt;!&ndash;  <template v-else>
          <q-card  bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>&ndash;&gt;
      </div>&ndash;&gt;

      <div class="col-4 large-screen-only">

        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="480px">
              <img src="https://avatars3.githubusercontent.com/u/13683277?s=460&u=a90a4b666d907370d387e5af56a6c6c5e295ee2b&v=4">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">artingo</q-item-label>
            <q-item-label caption>
              Fred Walther
            </q-item-label>
          </q-item-section>
        </q-item>

      </div>

      <div>
        <q-item class="fixed">
          <q-item-section>
            <div class="q-pa-md">
              <q-table
                title="Treats"
                :data="data"
                :columns="columns"
                row-key="name"
                dark
                color="amber"
              />
            </div>
          </q-item-section>
        </q-item>
      </div>

    </div>
-->
  <!--</q-page>-->
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'PageProfile',
  data () {
    return {
      columns: [
        {
          name: 'desc',
          required: true,
          label: 'Meal',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`,
          sortable: false
        },
        { name: 'Kalorien', align: 'center', label: 'Calories', field: 'calories', sortable: false },
        { name: 'Fett', label: 'Fat (g)', field: 'fat', sortable: false },
        { name: 'Kohlenhydrate', label: 'Carbs (g)', field: 'carbs', sortable: false },
        { name: 'Eiweiß', label: 'Protein (g)', field: 'protein', sortable: false }
      ],
      data: [
        {
          name: 'Morgens',
          calories: 800,
          fat: 6.0,
          carbs: 24,
          protein: 44.0,
        },
        {
          name: 'Mittag',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
        },
        {
          name: 'Abends',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
        },
        {
          name: 'Snacks',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
        },
        {
          name: 'Ganzer Tag',
          calories: 2800,
          fat: 70.0,
          carbs: 250,
          protein: 100.9,
        }
      ]
    }
  },
  methods: {
    getPosts() {
      this.loadingPosts = true
      this.$axios.get('http://localhost:3000/posts').then(response => {
        this.posts = response.data
        this.loadingPosts = false
      }).catch(err => {
        this.$q.dialog({
          title: 'Error',
          message: 'Could not find your location.'
        })
        this.loadingPosts = false
      })
    }
  },
  filters: {
    niceDate(value) {
      return date.formatDate(value, 'MMMM D h:mmA')
    }
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

