<template>
  <v-main>
    <v-overlay :model-value="overlay.status" persistent class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <router-view />

    <v-dialog v-model="account.loginDialog" width="500">
      <v-sheet class="pa-12" rounded>
        <h2 class="mb-5 text-center">{{ t('login') }}</h2>
        <v-divider />
        <div class="mx-auto px-6 py-4" max-width="344">
          <v-form @submit.prevent="onLoginSubmit" v-model="account.validation">
            <v-text-field v-model="username" :readonly="account.loading" :rules="[requiredValidation]" class="mb-2" clearable
              :label="t('username')"
              variant="outlined">
            </v-text-field>
            <v-text-field v-model="password" :readonly="account.loading" :rules="[requiredValidation]" class="mb-2" clearable
              :label="t('password')"
              :type="showLoginPassword ? 'text' : 'password'"
              @click:append="showLoginPassword = !showLoginPassword"
              :append-icon="showLoginPassword ? 'mdi-eye' : 'mdi-eye-off'"
              variant="outlined">
            </v-text-field>
            <br>
            <v-btn :loading="account.loading" block color="success" size="large" type="submit" variant="elevated">{{ t('login') }}</v-btn>
            <br>
            <v-btn variant="text" class="text-center" @click="account.showRegister()" block>{{ t('dontHaveAccountText') }}</v-btn>
          </v-form>
        </div>
      </v-sheet>
    </v-dialog>
    <v-dialog v-model="account.registerDialog" width="500">      
      <v-sheet class="pa-12" rounded>
        <h2 class="mb-5 text-center">{{ t('register') }}</h2>
        <v-divider />
        <div class="mx-auto px-6 py-4" max-width="344">
          <v-form @submit.prevent="onRegisterSubmit" v-model="account.validation">
            <v-text-field v-model="username" :readonly="account.loading" :rules="[requiredValidation]" class="mb-2" clearable
              :label="t('username')"
              variant="outlined">
            </v-text-field>
            <v-text-field v-model="email" :readonly="account.loading" :rules="[requiredValidation, emailValidation]"
              class="mb-2"
              clearable
              :label="t('email')"
              variant="outlined">
            </v-text-field>
            <v-text-field v-model="registerPassword" :readonly="account.loading"
              :rules="[requiredValidation, counterValidation]"
              class="mb-2"
              clearable
              :label="t('password')"
              variant="outlined"
              :type="showRegisterPassword ? 'text' : 'password'"
              @click:append="showRegisterPassword = !showRegisterPassword"
              :append-icon="showRegisterPassword ? 'mdi-eye' : 'mdi-eye-off'">
            </v-text-field>
            <v-text-field v-model="registerRepeatPassword" :readonly="account.loading"
              :rules="[requiredValidation, repeatValidation, counterValidation]"
              class="mb-2"
              clearable
              :label="t('repeatPassword')"
              variant="outlined"
              :type="showRegisterRepeatPassword ? 'text' : 'password'"
              @click:append="showRegisterRepeatPassword = !showRegisterRepeatPassword"
              :append-icon="showRegisterRepeatPassword ? 'mdi-eye' : 'mdi-eye-off'">
            </v-text-field>
            <br>
            <v-btn :loading="account.loading" block color="success" size="large" type="submit" variant="elevated">{{ t('register') }}</v-btn>
            <br>
            <v-btn variant="text" class="text-center" @click="account.showLogin()" block>{{ t('haveAccountText') }}</v-btn>
          </v-form>
        </div>
      </v-sheet>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
  import { reactive } from 'vue'
  import { useI18n } from "vue-i18n";
  import moeApi from '@/domain/services/moe';

  export const overlay = reactive ({
    status: false,
    callUp: function () {
      this.status = true;
    },
    callDown: function () {
      this.delay(500).then(() => this.status = false);
    },
    delay: async function (time : number) {
      return new Promise(resolve => setTimeout(resolve, time));
    }
  });

  export const account = reactive ({
    isLoggedIn: false,
    userId: '',
    loginDialog: false,
    registerDialog: false,
    loading: false,
    validation: false,
    showLogin: function () {
      this.registerDialog = false;
      this.loginDialog = true;
    },
    showRegister: function () {
      this.loginDialog = false;
      this.registerDialog = true;
    },
    hide: function () {
      this.loginDialog = false;
      this.registerDialog = false;
    }
  });

  export default {
    name: 'View',
    setup() {
      const { t } = useI18n();
      return {
        t
      }
    },
    data() {
      return {
        username: '',
        password: '',
        email: '',
        registerPassword: '',
        registerRepeatPassword: '',
        showLoginPassword: false,
        showRegisterPassword: false,
        showRegisterRepeatPassword: false,
        account: account,
        overlay: overlay
      }
    },
    methods: {
      onLoginSubmit: function () {
        if (!account.validation) return;

        account.loading = true;
        moeApi.signIn(this.username, this.password).then(response => {
          new Promise(resolve => setTimeout(resolve, 500)).then(() => {
            account.isLoggedIn = true;
            account.userId = response;
            account.loading = false;
          })
        });
      },
      onRegisterSubmit: async function () {

      },
      requiredValidation: function (value : string) { return !!value || this.t('requiredFieldText') },
      counterValidation: function (value : string) { return value.length <= 16 || this.t('exceedLengthLimitText') },
      emailValidation: function (value : string) {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || this.t('invalidEmailText')
      },
      repeatValidation: function (value : string) {
        return value === (this.registerPassword ?? '') || this.t('passwordNotMatchText')
      }
    }
  }
</script>

<style>
  .toolbar {
    position: fixed;
    bottom: 90px;
    right: 50px;
    max-height: 0px;
  }

  .login-panel {
    margin-left: 64px;
    margin-right: 64px;
  }
</style>