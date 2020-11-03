<template>
  <q-page class="row justify-center q-pa-md">
    <q-list>
      <q-list-header><h3>Einkaufsliste</h3></q-list-header>
      <q-item class="q-px-xl q-mx-xl">
        <q-item-section class="q-pr-xl">
          <q-item-label class="text-body1">Bananen</q-item-label>
          <q-item-label caption>350g</q-item-label>
        </q-item-section>

        <q-item-section class="q-px-xl">
          <!--spacer-->
          <!--q-icon name="local_fire_department" class="inline" color="orange" /-->
        </q-item-section>

        <q-item-section>
          <q-item-label caption>95 kcal pro 100g</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-px-xl q-mx-xl">
        <q-item-section class="q-pr-xl">
          <q-item-label class="text-body1">Nutella</q-item-label>
          <q-item-label caption>1 Glas</q-item-label>
        </q-item-section>

        <q-item-section class="q-px-xl">
          <!--spacer-->
          <!--q-icon name="local_fire_department" class="inline" color="orange" /-->
        </q-item-section>

        <q-item-section>
          <q-item-label caption>541 kcal pro 100g</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-px-xl q-mx-xl">
        <q-item-section class="q-pr-xl">
          <q-item-label class="text-body1">Apfelmus</q-item-label>
          <q-item-label caption>1 Glas</q-item-label>
        </q-item-section>

        <q-item-section class="q-px-xl">
          <!--spacer-->
          <!--q-icon name="local_fire_department" class="inline" color="orange" /-->
        </q-item-section>

        <q-item-section>
          <q-item-label caption>68 kcal pro 100g</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>


<script>
export default {
  name: 'PageShoppingList'
}
</script>
