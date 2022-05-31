<template>
  <q-page class="row force-center">
    <div class="column q-pa-md">
      <div class="row">
        <q-card square class="shadow-24 text-center">
          <q-card-section class="bg-primary">
            <h4 class="text-h5 text-white q-my-xs">IO Tasks</h4>
          </q-card-section>

          <q-card-section>
            <h6 class="h4 q-mt-sm">Login to add Your Tasks</h6>
            <q-form ref="loginFormRef">
              <q-input
                label="Email"
                type="email"
                class="q-ma-lg"
                clearable
                v-model="loginForm.email"
                trim
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Email Required', isEmail]"
              >
                <template v-slot:prepend>
                  <q-icon size="md" name="mail" class="q-ml-md" />
                </template>
              </q-input>

              <q-input
                label="Password"
                class="q-ma-lg"
                clearable
                :type="passWordField.fieldType"
                v-model="loginForm.password"
                trim
                @keydown.enter.prevent="loginUser"
                lazy-rules
                :rules="[(val) => (val && val.length > 0) || 'Password Required', isShortPassword]"
              >
                <template v-slot:prepend>
                  <q-icon size="md" name="lock" class="q-ml-md" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="passWordField.visibilityIcon"
                    @click="switchVisibility"
                    class="cursor-pointer"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-lg">
            <q-btn
              :loading="loading"
              :disable="loading"
              unelevated
              @click="loginUser"
              size="lg"
              color="accent"
              class="full-width text-white text-capitalize"
            >
              <span class="text-h5">Login</span>
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </q-card-actions>

          <q-card-section class="text-center q-pa-sm">
            <p class="text-grey-9" style="cursor: pointer">Forgotten Password?</p>
          </q-card-section>
          <q-card-section class="text-center q-pa-sm">
            <q-btn
              outline
              label="Register"
              class="text-capitalize"
              @click="$router.push({ name: 'AuthRegister' })"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import formMethods from 'src/utils/formMethodsComposable';
import authMethods from './authMethods';

export default defineComponent({
  name: 'AuthLogin',

  setup() {
    // IMPORTS
    const { isEmail, passWordField, switchVisibility, isShortPassword} = formMethods()
    const { loginUser, loginForm, loginFormRef, loading } = authMethods()

    return {
      isEmail, passWordField, switchVisibility, isShortPassword,
      loginUser, loginForm, loginFormRef, loading,
    }
  }
})
</script>

<style lang="sass" scoped>
.login-box
  background: linear-gradient(#8274C5, #5A4A9F)

.logo-style
  height: 80px

.login-box
  background: #ffffff 0% 0% no-repeat padding-box
  border: 1px solid #707070
  border-radius: 10px 50px 10px 50px
  opacity: 0.62
  width: auto
  height: auto

.force-center
  display: flex
  justify-content: center
  align-items: center
</style>
