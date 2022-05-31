<template>
  <q-card style="width: 550px; max-width: 85vw; margin: 13px">
    <q-toolbar>
      <q-toolbar-title>Create Task</q-toolbar-title>
    </q-toolbar>

    <q-card-section>
      <q-form ref="taskFormRef">
        <q-input
          label="Title"
          type="text"
          class="q-ma-lg"
          clearable
          v-model="taskForm.title"
          trim
          lazy-rules
          :rules="[
                  (val) => (val && val.length > 0) || 'Title Required',
                ]"
        />

        <q-input
          label="Description"
          type="textarea"
          class="q-ma-lg"
          clearable
          v-model="taskForm.description"
          trim
          lazy-rules
          :rules="[
                  (val) => (val && val.length > 0) || 'Description Required',
                ]"
        />
      </q-form>
    </q-card-section>

    <q-card-actions class="q-px-lg" align="right">
      <q-btn
        size="lg"
        class="q-pa-lg q-pl-xl q-pr-xl q-ma-lg text-black text-capitalize"
        v-close-popup
      >
        <span class="text-h5">Cancel</span>
      </q-btn>

      <q-btn
        size="lg"
        :loading="loading"
        :disable="loading"
        @click="btnSaveTask(isEdit)"
        color="accent"
        class="q-pa-lg q-pl-xl q-pr-xl q-ma-lg text-capitalize text-white"
      >
        <span class="text-h5">{{ isEdit ? 'Update' : 'Create' }}</span>
        <template v-slot:loading>
          <q-spinner-facebook/>
        </template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType} from 'vue';
import tasksMethods from 'components/tasks/tasksMethods';
import { TaskInterface } from 'src/interfaces/task.interface';

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
    // IMPORTED
    const { taskForm, taskFormRef, loading, btnSaveTask, populateTaskForm } = tasksMethods(props, context);

    // HOOKS
    onMounted(() => {
      if (props.isEdit) {
        populateTaskForm(props.task);
      }
    });

    return {
      taskForm, taskFormRef, loading, btnSaveTask,
    };
  }
})
</script>

<style scoped>

</style>
