<template>
  <q-page class="flex flex-top-left">
    <q-list class="q-pl-xl">
      <q-list-header><h3>Einkaufsliste</h3></q-list-header>
      <q-item>
        <q-item class="q-px-xl">
          <q-item-section>
            <q-item-label><h6>Bananen</h6></q-item-label>
            <q-item-label caption>350g</q-item-label>
          </q-item-section>

          <q-item-section side bottom>
            <q-item-label caption>95 kcal pro 100g</q-item-label>
            <q-icon name="local_fire_department" color="orange" />
          </q-item-section>
        </q-item>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Apfel</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Reis</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Hühnchen</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Nutella</q-item-tile>
        </q-item-main>
      </q-item>
      <q-item>
        <q-item-main>
          <q-item-tile label>Rinder Riegel</q-item-tile>
        </q-item-main>
      </q-item>
    </q-list>
  </q-page>
</template>


<script>
export default {
  name: 'PageShoppingList'
}
</script>
