import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { TasksResultInterface, TaskInterface } from 'src/interfaces/task.interface';
import { PaginationInterface } from 'src/interfaces/pagination.interface';
import {appendEditForm, appendForm} from 'src/utils/formHelper';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: {} as TasksResultInterface,
    singleTask: {} as TaskInterface,
    loading: false,
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getLoading: (state) => state.loading,
    getSingleTask: (state) => state.singleTask,
  },

  actions: {
    fetchTasks(payload: Partial<PaginationInterface>): Promise<TasksResultInterface> {
      this.loading = true;
      return new Promise((resolve, reject) => {
        api
          .get('tasks', {params: payload})
          .then((response) => {

            this.tasks = response.data
            this.loading = false;

            resolve(response)
          })
          .catch((error) => {
            this.loading = false;

            reject(error)
          })
      })
    },

    fetchSingleTask(id: number): Promise<any> | null {
      this.loading = true;
      return new Promise((resolve, reject) => {
        api
          .get('tasks/' + id)
          .then((response) => {

            this.singleTask = response.data.data
            this.loading = false;

            resolve(response)
          })
          .catch((error) => {
            this.loading = false;

            reject(error)
          })
      })
    },

    storeTask(form: any) {
      return new Promise((resolve, reject) => {
        api
          .post('tasks', appendForm(form))
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },

    updateTask(form: any) {
      return new Promise((resolve, reject) => {
        api
          .post(`tasks/${form.id}`, appendEditForm(form))
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },

    deleteTask(id: number) {
      return new Promise((resolve, reject) => {
        api
          .delete(`tasks/${id}`)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
      })
    },
  }
});
