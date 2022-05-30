<template>
  <q-layout view="hhh lpR fFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          IO  Tasks App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
  },

  setup () {
    return {

    }
  }
});
</script>
