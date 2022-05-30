export const appendForm = function (form: any) {
  const formData = new FormData()

  for (const key in form) {
    if (Array.isArray(form[key])) {
      formData.append(key, JSON.stringify(form[key]))
    } else {
      formData.append(key, form[key])
    }
  }

  return formData
}

export const appendEditForm = function (form: any) {
  const formData = new FormData()

  for (const key in form) {
    if (Array.isArray(form[key])) {
      formData.append(key, JSON.stringify(form[key]))
    } else {
      formData.append(key, form[key])
    }
  }

  formData.append('_method', 'put')

  return formData
}
