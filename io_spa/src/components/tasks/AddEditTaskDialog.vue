<template>
  <q-card style="width: 550px; max-width: 85vw; margin: 13px">
    <q-toolbar>
      <q-toolbar-title>Add Task</q-toolbar-title>
    </q-toolbar>

    <q-card-section>
      <q-form ref="taskFormRef">

      </q-form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import tasksMethods from 'components/tasks/tasksMethods';
import { TaskInterface} from 'src/interfaces/task.interface';

export default defineComponent({
  name: 'AddEditTaskDialog',
  props: {
    task: {
      type: Object as PropType<TaskInterface>,
      default: () => ({}),
    },
    isEdit: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  setup(props, context) {
    const { taskForm, taskFormRef } = tasksMethods(props, context);

    return {
      taskForm, taskFormRef
    };
  }
})
</script>

<style scoped>

</style>
