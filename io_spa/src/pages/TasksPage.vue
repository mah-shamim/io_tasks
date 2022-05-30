<template>
  <q-page>
    <q-card elevated class="q-pa-md q-ma-md">
      <q-toolbar>
        <q-toolbar-title>IO Tasks</q-toolbar-title>
      </q-toolbar>
    </q-card>

    <!-- dialogs -->
    <q-dialog v-model="addTaskDialog" persistent>
      <add-edit-task-dialog @success="closeDialog" />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, onMounted, defineAsyncComponent} from 'vue';
import tasksMethods from 'components/tasks/tasksMethods';

export default defineComponent({
  name: 'TasksPage',
  components: {
    addEditTaskDialog: defineAsyncComponent(() => import('components/tasks/AddEditTaskDialog.vue')),
  },

  setup (props, context) {
    const {
      tasksData,
      loadingTasks,
      fetchTasks,
      addTaskDialog,
      selectedTask,
      closeDialog,
    } = tasksMethods(props, context);

    onMounted(() => {
      fetchTasks();
    });

    return {
      tasksData,
      loadingTasks,
      addTaskDialog,
      selectedTask,
      closeDialog
    };
  }
});
</script>
