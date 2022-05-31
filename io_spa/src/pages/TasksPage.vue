<template>
  <q-page>
    <q-card elevated class="q-pa-md q-ma-md">
      <q-toolbar>
        <q-toolbar-title>IO Tasks</q-toolbar-title>
      </q-toolbar>

      <q-card-section>
        <q-table
          :rows="tasksData.data"
          :columns="tableHeaders"
          row-key="id"
          :loading="loadingTasks"
          :rows-per-page-options="[0]"
          hide-bottom
          :auto-width="true"
          color="primary"
          class="q-mb-md"
        >

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-capitalize text-black"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:top-right>
            <div class="q-mb-md">
              <q-input
                debounce="1000"
                dense
                v-model="taskPagination.searchQuery"
                placeholder="Search..."
                class="q-mr-xl"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="q-mb-md">
              <q-btn
                label="Add Task"
                color="primary"
                @click="btnShowAddTaskDialog"
                class="q-mr-sm text-white q-pl-md q-pr-md q-mt-xs text-capitalize"
              />
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <template v-for="col in props.cols">
                <q-td class="text-center" v-if="!skipColumns(col.name)" :key="col.name">
                  <div class="text-ellipsis">
                    {{ props.row[col.name] }}
                  </div>
                </q-td>

                <q-td v-if="col.name === 'actions'" :key="col.name" class="text-center">
                  <q-btn
                    class="q-ma-xs"
                    outline
                    color="info"
                    icon="visibility"
                    @click="btnShowViewTaskDialog(props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-ma-xs"
                    outline
                    color="positive"
                    icon="edit"
                    @click="btnShowEditTaskDialog(props.row)"
                  ></q-btn>
                  <q-btn
                    class="q-ma-xs"
                    outline
                    @click="btnDeleteTask(props.row)"
                    color="negative"
                    icon="delete"
                  ></q-btn>
                </q-td>
              </template>
            </q-tr>
          </template>
        </q-table>

        <!-- no data returned -->
        <template v-if="!tasksData.data?.length && !loadingTasks">
          <p class="text-h6 text-center">No tasks to show</p>
        </template>

        <!-- pagination -->
        <div class="row">
          <div class="col-md-4 q-pa-md float-left">
            <span class="q-pt-xl-lg">
              Showing
              <strong>{{ taskPagination.from || 0 }}</strong>
              to
              <strong>{{ taskPagination.to || 0 }} </strong>
              of
              <strong>{{ taskPagination.total }}</strong>
              entries
            </span>
          </div>

          <div class="col-md-4 q-pa-md text-center">
            <div class="q-gutter-md row items-start">
              <q-select
                dense
                item-aligned
                input-debounce="1000"
                v-model="taskPagination.perPage"
                :options="perPageOptions"
                class="q-pa-none q-ma-none"
              />
              <div class="q-ma-md">Per Page</div>
            </div>
          </div>

          <div class="col-md-4 q-pa-md float-right">
            <q-pagination
              class="float-right"
              @update:model-value="onPageChange"
              v-model="taskPagination.page"
              :max="taskPagination.lastPage"
              direction-links
              boundary-links
              :max-pages="5"
              :ellipses="true"
            >
            </q-pagination>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- dialogs -->
    <q-dialog v-model="addTaskDialog" persistent>
      <add-edit-task-dialog :task="selectedTask" :isEdit="isEdit" @success="closeDialog" />
    </q-dialog>

    <q-dialog v-model="viewTaskDialog">
      <task-view-dialog :task="selectedTask" />
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import {defineComponent, onMounted, defineAsyncComponent, watch} from 'vue';
import tasksMethods from 'components/tasks/tasksMethods';

export default defineComponent({
  name: 'TasksPage',
  components: {
    addEditTaskDialog: defineAsyncComponent(() => import('components/tasks/AddEditTaskDialog.vue')),
    taskViewDialog: defineAsyncComponent(() => import('components/tasks/TaskViewDialog.vue')),
  },

  setup (props, context) {
    // IMPORTED
    const {
      tasksData,
      loadingTasks,
      fetchTasks,
      addTaskDialog,
      selectedTask,
      closeDialog,
      onPageChange,
      perPageOptions,
      tableHeaders,
      taskPagination,
      btnDeleteTask,
      btnShowAddTaskDialog,
      btnShowEditTaskDialog,
      btnShowViewTaskDialog,
      isEdit,
      viewTaskDialog,
    } = tasksMethods(props, context);

    // HOOKS
    onMounted(() => {
      fetchTasks();
    });

    watch(
      () => taskPagination.searchQuery,
      () => {
        fetchTasks()
      }
    )

    watch(
      () => taskPagination.perPage,
      () => {
        fetchTasks()
      }
    )

    watch(
      tasksData,
      () => {
        if (Object.prototype.hasOwnProperty.call(tasksData.value, 'meta')) {
          taskPagination.from = tasksData.value.meta?.from || 0;
          taskPagination.to = tasksData.value.meta?.to || 0;
          taskPagination.total = tasksData.value.meta?.total || 0;
          taskPagination.lastPage = tasksData.value.meta?.last_page || 1;
        }
      },
      { deep: true }
    )

    // METHODS
    const skipColumns = (col: string) => {
      let skip = ['actions']

      return skip.includes(col)
    }

    return {
      tasksData,
      loadingTasks,
      addTaskDialog,
      selectedTask,
      isEdit,
      viewTaskDialog,
      closeDialog,
      onPageChange,
      perPageOptions,
      tableHeaders,
      taskPagination,
      btnDeleteTask,
      btnShowAddTaskDialog,
      btnShowEditTaskDialog,
      btnShowViewTaskDialog,
      skipColumns
    };
  }
});
</script>

<style scoped>
.text-ellipsis {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
