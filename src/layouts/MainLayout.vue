<template>
  <q-layout view="lHr LpR lFr">
    <q-header
      class="text-grey-10 no-border"
      style="background:linear-gradient(to right, rgba(0,0,0,0), #9cec1e, #9cec1e, #9cec1e, #9cec1e, #9cec1e, #9cec1e, rgba(1,1,1,0) )"
      bordered
    >
      <q-toolbar class="constrain float float-center">
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
          icon="eva-file-text-outline"
          size="18px"
          flat
          round
          dense
        />
        <q-separator
          class="large-screen-only bg-secondary"
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

    <div class="q-pa-md q-gutter-md" >
      <q-responsive :ratio="1">
        <div style="min-height: 100vh">

          <q-parallax class="fixed-top" style="min-height: 100vh">
            <!--https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/heart-healthy-food-1580231690.jpg
          https://online.ahu.edu/wp-content/uploads/2019/03/Healthy-Food-Doesnt-Have-To-Be-Expensive.jpg-->
              <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/heart-healthy-food-1580231690.jpg">
            <q-page-container padding class="fixed-center"  style="padding-top: 154px; width: 70vw; background:linear-gradient(to bottom, white, rgb(242, 253, 225), rgb(232, 253, 205))">
              <router-view />
            </q-page-container>
          </q-parallax>

        </div>
      </q-responsive>
    </div>

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
