<template>
  <div class="q-pa-none bg-image">
    <q-layout view="lHr LpR lFr" >
      <q-img class="fixed-center" height="100vh" width="100vw" src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/heart-healthy-food-1580231690.jpg"/>
      <q-header
        class="text-grey-10"
        style="background:linear-gradient(to right,  rgba(232, 253, 205,0.7), #9cec1e, #9cec1e, #9cec1e, #9cec1e, #9cec1e, #9cec1e, rgba(232, 253, 205,0.7) )"
      >
        <q-toolbar class="constrain float float-center">

          <q-toolbar-title class="text-roboto text-bold">
            Meal-O-Mat
          </q-toolbar-title>
          <q-btn
            to="/"
            class="q-mr-sm"
            icon="eva-calendar-outline"
            size="18px"
            flat
            round
            dense
          />
          <q-btn
            to="/shoppinglist"
            class=" q-mr-sm"
            icon="eva-shopping-cart-outline"
            size="18px"
            flat
            round
            dense
          />
          <q-btn
            to="/changemeal"
            class="q-mr-sm"
            icon="eva-file-text-outline"
            size="18px"
            flat
            round
            dense
          />
        </q-toolbar>
      </q-header>
      <q-page-container class="absolute-center" style="padding-top: 184px; width: 70vw; background:linear-gradient(to bottom, white, rgb(242, 253, 225), rgb(232, 253, 205))">
        <router-view />
      </q-page-container>

      <div class="q-pa-none q-gutter-md bg-image" >

        <!--
  <q-img height="100vh" width="100vw"
               src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/heart-healthy-food-1580231690.jpg"
        />

        -->
      </div>


    </q-layout>
  </div>
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

