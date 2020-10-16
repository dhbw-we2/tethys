<template>
  <q-layout view="lHr LpR lFr">
    <q-header
      class="bg-white text-grey-10"
      bordered
    >
      <q-toolbar class="constrain float float-left">
        <q-btn
          to="/"
          class="large-screen-only q-mr-sm"
          icon="eva-calendar-outline"
          size="18px"
          flat
          round
          dense
        />
        <q-btn
          to="/shoppinglist"
          class="large-screen-only q-mr-sm"
          icon="eva-file-text-outline"
          size="18px"
          flat
          round
          dense
        />
        <q-separator
          class="large-screen-only"
          vertical
          spaced
        />
        <q-toolbar-title class="text-roboto text-bold">
          Meal-O-Mat
        </q-toolbar-title>
        <q-btn
          to="/profile"
          class="large-screen-only"
          icon="eva-person-outline"
          size="18px"
          flat
          round
          dense
        />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="right" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',

  data () {
    return {

    }
  }
}
</script>

<style lang="sass">
  .q-toolbar
    @media (min-width: $breakpoint-sm-min)
      height: 77px
  .q-toolbar__title
    font-size: 30px
    @media (max-width: $breakpoint-xs-max)
      text-align: center
  .q-footer
    .q-tab__icon
      font-size: 30px
</style>
