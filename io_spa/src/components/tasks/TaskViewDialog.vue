<template>
  <q-card style="width: 550px; max-width: 85vw; margin: 13px">
    <q-card-section>
      <div class="text-h6">
        {{task.title}}
      </div>
    </q-card-section>

    <q-card-section>
      {{ task.description }}
    </q-card-section>

    <q-separator dark />

    <q-card-section>
      <div class="q-ma-md">
        Created At: <strong class="q-ml-lg">{{ task.created_at }}</strong>
      </div>
      <div class="q-ma-md">
        Updated At: <strong class="q-ml-lg">{{ task.updated_at }}</strong>
      </div>
    </q-card-section>

    <q-card-actions class="q-px-lg" align="right">
      <q-btn
        size="lg"
        class="q-pa-lg q-pl-xl q-pr-xl q-ma-lg text-black text-capitalize"
        v-close-popup
      >
        <span class="text-h5">Close</span>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {TaskInterface} from 'src/interfaces/task.interface';

export default defineComponent({
  name: 'TaskViewDialog',
  props: {
    task: {
      type: Object as PropType<TaskInterface>,
      required: true,
    },
  },
  setup() {
    return {
    }
  }
})
</script>

<style scoped>

</style>
