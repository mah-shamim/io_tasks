import {isEmailValid} from 'src/utils/utils';
import {ref} from 'vue';

export default function formMethods() {
  const isRequired = (val: string) => (val && val.length > 0) || 'Required'
  const isEmail = (val: string) => (val && isEmailValid(val)) || 'Invalid Email'
  const isShortEmail = (val: string) => (val && val.length > 3) || 'Email too short'
  const isShortPassword = (val: string) => (val && val.length > 6) || 'Password too short'

  const passWordField = ref({
    fieldType: 'password',
    visibility: false,
    visibilityIcon: 'visibility',
  })

  const switchVisibility = () => {
    passWordField.value.visibility = !passWordField.value.visibility
    passWordField.value.visibilityIcon = passWordField.value.visibility
      ? 'visibility_off'
      : 'visibility'
    passWordField.value.fieldType = passWordField.value.visibility ? 'text' : 'password'
  }

  return {
    isRequired,
    isEmail,
    isShortEmail,
    isShortPassword,
    passWordField,
    switchVisibility,
  }
}
