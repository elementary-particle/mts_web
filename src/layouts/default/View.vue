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
          <v-form @submit.prevent="account.onLoginSubmit">
            <v-text-field v-model="account.username" :readonly="account.loading" :rules="[account.rules.required]" class="mb-2" clearable :label="t('username')"></v-text-field>
            <v-text-field v-model="account.password" :readonly="account.loading" :rules="[account.rules.required]" class="mb-2" clearable :label="t('password')"
            :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>
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
          <v-form @submit.prevent="account.onRegisterSubmit">
            <v-text-field :readonly="account.loading" :rules="[account.rules.required]" class="mb-2" clearable :label="t('username')"></v-text-field>
            <v-text-field :readonly="account.loading" :rules="[account.rules.required]" class="mb-2" clearable :label="t('password')"></v-text-field>
            <v-text-field :readonly="account.loading" :rules="[account.rules.required]" class="mb-2" clearable :label="t('repeatPassword')"></v-text-field>
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

<script lang="ts" setup>
  import { useI18n } from "vue-i18n";

  const { t } = useI18n();
</script>

<script lang="ts">
  import { reactive } from 'vue'
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
    loginDialog: false,
    registerDialog: false,
    username: '',
    password: '',
    loading: false,
    rules: {
      required: (value : string) => !!value || 'Field is required',
    },
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
    },
    onLoginSubmit: function () {
      this.loading = true;
      moeApi.signIn(this.username, this.password).then(response => {
        new Promise(resolve => setTimeout(resolve, 500)).then(() => {
          console.log(response);
          this.loading = false;
        })
      })
    },
    onRegisterSubmit: function () {

    }
  });

  export default {
    name: 'View',
    data() {
      return {
        showPassword: false,
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