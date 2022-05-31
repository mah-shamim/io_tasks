import AppStorage from 'src/utils/AppStorage';
import {QNotifyCreateOptions, useQuasar} from 'quasar';

const $qC = useQuasar();

type Position =
  'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
type NotificationType = 'info' | 'positive' | 'negative' | 'warning' | 'default' | 'ongoing'

export const formatString = function (item: string) {
  return item.replace(/_/g, ' ')
}

export const showNotification = function ($q: typeof $qC, type: NotificationType, message: string, position: Position = 'top-right') {
  $q.notify({
    type: type,
    message: message,
    position: position,
  })
}

export const showSuccessNotification = function ($q: typeof $qC, message = 'Success!', position: Position = 'top-right') {
  $q.notify({
    type: 'positive',
    message: message,
    position: position,
  })
}

const prepareErrorMessage = function (
  error: any | string,
  message = 'Sorry! An error occurred, please try again shortly'
) {
  message = error.message ? error.message : message // in case of network error, this is picked

  if (error.response && error.response.data && error.response.data.message) {
    // this picks error response from backend
    message = error.response.data.message
  }

  return message
}

export const showErrorNotification = function (
  $q: typeof $qC,
  error: any | string,
  message = 'Sorry! An error occurred, please try again shortly'
) {
  message = prepareErrorMessage(error, message)
  showNotification($q, 'negative', message)
}

export const showMissingFieldsErrors = function ($q: typeof $qC, error: any | string) {
  let errors: Array<string>
  errors = []

  if (error.response && error.response.data && error.response.data.errors) {
    errors = Object.values(error.response.data.errors)
  }
  if (errors.length !== 0) {
    errors.forEach((err) => {
      showNotification($q, 'negative', err)
    })
  } else {
    showErrorNotification($q, error)
  }
}

export const objectNotification = function ($q: typeof $qC, notification: QNotifyCreateOptions) {
  $q.notify(notification)
}

export const isEmailValid = (val: string) => {
  const regex =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/

  return regex.test(val)
}

export const hasWhiteSpacesOnly = (val: string) => {
  return val.replace(/\s/g, '').length
}

export const isUserLoggedIn = function (): boolean {
  return !!AppStorage.getAccessToken()
}

export const formatNumber = (value: number) => {
  if (!value) return 0
  const formatter = new Intl.NumberFormat('en-US')

  return formatter.format(value)
}

export const headersToSkip = [
  'id',
  // 'created_at',
  // 'updated_at',
  'user_id',
  'relationships',
  'status',
]

export const createHeaderObjectArray = function (
  headersArray: Array<string>,
  addSelectColumn = false,
  headerSkip: Array<string> | null = null
) {
  if (!headerSkip) {
    headerSkip = headersToSkip
  }
  const columnObjects = []

  if (addSelectColumn) {
    columnObjects.push({
      name: 'select',
      sortable: false,
      label: 'Select',
      field: '',
      headerClasses: 'bg-grey-3 text-capitalize',
      align: 'center',
    })
  }

  headersArray.map((header) => {
    if (!headerSkip?.includes(header)) {
      const obj1 = {
        name: header,
        sortable: false,
        label: formatString(header),
        field: header,
        headerClasses: 'bg-grey-3 text-capitalize',
        align: 'center',
      }
      columnObjects.push(obj1)
    }
  })

  return columnObjects
}
