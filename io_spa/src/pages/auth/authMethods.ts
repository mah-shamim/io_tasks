import { useRouter } from 'vue-router'
import { appendForm } from 'src/utils/formHelper'
import { useQuasar } from 'quasar'
import AppStorage from 'src/utils/AppStorage'
import { ref } from 'vue';
import { api } from 'boot/axios';
import { UserLoginResultInterface } from 'src/interfaces/user.interface';
import { showMissingFieldsErrors, showNotification } from 'src/utils/utils';
import profileMethods from 'components/profile/profileMethods';

export default function authMethods() {
  // IMPORTS
  const router = useRouter()
  const $q = useQuasar()
  const { setProfileData } = profileMethods()

  // DATA
  const loading = ref(false)
  const loginForm = ref({
    email: '',
    password: '',
  })
  const loginFormRef = ref<HTMLFormElement>()

  const registerForm = ref({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const registerFormRef = ref<HTMLFormElement>()

  // METHODS

  const isPasswordMatch = (val: string) => val === registerForm.value.password || 'Password doesn\'t match'

  const loginUser = () => {
    loginFormRef.value?.validate().then((success: boolean) => {
      if (success) {
        loading.value = true

        api.post('auth/user/login', appendForm(loginForm.value))
          .then((response) => {
            loading.value = false

            updateStateUserProfileData(response.data)
          })
          .catch((err) => {
            loading.value = false
            showMissingFieldsErrors($q, err)
          })
      } else {
        showNotification($q, 'negative', 'Please provide your credentials')
      }
    })
    }

  const registerUser = () => {
    registerFormRef.value?.validate().then((success: boolean) => {
      if (success) {
        loading.value = true

        api.post('auth/user/register', appendForm(registerForm.value))
          .then((response) => {
            loading.value = false

            updateStateUserProfileData(response.data)
          })
          .catch((err) => {
            loading.value = false
            showMissingFieldsErrors($q, err)
          })
      } else {
        showNotification($q, 'negative', 'Please fill the form')
      }
    })
  }

  const updateStateUserProfileData = (data: UserLoginResultInterface) => {
    setProfileData(data.user)

    // set access token in session storage
    AppStorage.storeAccessToken(data.access_token)

    showNotification($q, 'positive', data.message)

    // redirect to home
    router.push({ name: 'TasksPageRoute' })
  }

  return {
    loading,
    loginForm,
    loginFormRef,
    registerForm,
    registerFormRef,
    loginUser,
    registerUser,
    isPasswordMatch,
  }
}
