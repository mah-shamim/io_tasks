import {ref, computed, reactive, SetupContext} from 'vue';
import {useTasksStore} from 'stores/tasks/tasks';
import {useQuasar} from 'quasar';
import {createHeaderObjectArray, showMissingFieldsErrors, showNotification} from 'src/utils/utils';
import {TaskInterface} from 'src/interfaces/task.interface';

export default function tasksMethods(props: any, context: SetupContext) {
  // IMPORTS
  const $q = useQuasar()
  const taskStore = useTasksStore();

  // DATA
  const loading = ref(false);
  const addTaskDialog = ref(false);
  const isEdit = ref(false);
  const viewTaskDialog = ref(false);
  const selectedTask = ref<TaskInterface>();

  const taskPagination = reactive({
    page: 1,
    perPage: 10,
    searchQuery: '',
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  })

  const taskFormRef = ref<HTMLFormElement>()
  const taskForm = ref({
    id: 0,
    title: '',
    description: '',
  })

  const perPageOptions = [10, 20, 50]

  // COMPUTED
  const tasksData = computed(() => taskStore.getTasks)
  const loadingTasks = computed(() => taskStore.getLoading)
  const singleTask = computed(() => taskStore.getSingleTask)
  const tableHeaders = computed(() => {
    if (tasksData.value.data && tasksData.value.data.length) {
      const firstKeys = Object.keys(tasksData.value.data[0])

      firstKeys.push('actions')

      return createHeaderObjectArray(firstKeys)
    }
    return []
  })

  // METHODS
  const fetchTasks = () => taskStore.fetchTasks(taskPagination);
  const fetchSingleTask = (id: number) => taskStore.fetchSingleTask(id);
  const onPageChange = (page: number) => {
    taskPagination.page = page
    fetchTasks()
  }

  const btnSaveTask = (actionEdit = false) => {
    taskFormRef.value?.validate().then((success: boolean) => {
      if (success) {
        loading.value = true

        if (actionEdit) {
          updateTaskAction()
        } else {
          addTaskAction()
        }

      } else {
        showNotification($q, 'negative', 'Please fill the form')
      }
    })
  }

  const addTaskAction = () => {
    taskStore
      .storeTask(taskForm.value)
      .then(() => {
        loading.value = false
        showNotification($q, 'positive', 'Task Saved')
        context.emit('success')
      })
      .catch((err) => {
        loading.value = false
        showMissingFieldsErrors($q, err)
      })
  }

  const updateTaskAction = () => {
    taskStore
      .updateTask(taskForm.value)
      .then(() => {
        loading.value = false
        showNotification($q, 'positive', 'Task Update')
        context.emit('success')
      })
      .catch((err) => {
        loading.value = false
        showMissingFieldsErrors($q, err)
      })
  }

  const btnDeleteTask = (task: TaskInterface) => {
    $q.dialog({
      title: 'Confirm',
      message: `Are you sure you want to delete ${task.title}?`,
      cancel: true,
      persistent: false,
    })
      .onOk(() => {
        taskStore
          .deleteTask(task.id)
          .then(() => {
            showNotification($q, 'positive', `${task.title} has been deleted`)
            fetchTasks()
          })
          .catch((err) => {
            showMissingFieldsErrors($q, err)
          })
      })
      .onCancel(() => {
        showNotification($q, 'info', 'Delete cancelled')
      })
  }

  const closeDialog = () => {
    addTaskDialog.value = false
    fetchTasks()
  }

  const btnShowAddTaskDialog = () => {
    isEdit.value = false
    taskForm.value = {
      id: 0,
      title: '',
      description: '',
    }
    addTaskDialog.value = true
    selectedTask.value = undefined
  }

  const btnShowEditTaskDialog = (task: TaskInterface) => {
    addTaskDialog.value = true
    isEdit.value = true
    selectedTask.value = task
  }

  const btnShowViewTaskDialog = (task: TaskInterface) => {
    selectedTask.value = task
    viewTaskDialog.value = true
  }

  const populateTaskForm = (task: TaskInterface) => {
    taskForm.value.id = task.id
    taskForm.value.title = task.title
    taskForm.value.description = task.description
  }

  return {
    loading,
    addTaskDialog,
    viewTaskDialog,
    taskPagination,
    taskForm,
    taskFormRef,
    isEdit,
    selectedTask,
    perPageOptions,
    tasksData,
    loadingTasks,
    singleTask,
    tableHeaders,
    fetchTasks,
    fetchSingleTask,
    btnSaveTask,
    btnDeleteTask,
    onPageChange,
    btnShowAddTaskDialog,
    btnShowEditTaskDialog,
    btnShowViewTaskDialog,
    closeDialog,
    populateTaskForm,
  }
}
