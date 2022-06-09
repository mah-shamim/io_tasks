<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page className="overlay">
        <div class="fixed-center text-center">
          <p>
            <q-img src="~assets/sad.svg" style="width:30vw;max-width:150px;"/>
          </p>
          <p class="text-faded">Sorry mate, service is experiencing some problems. Please try again shortly<strong>(500)</strong></p>
          <q-btn color="primary" no-caps style="width:200px;" to="/" label="Go Home"/>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'Error_500'
};
</script>
