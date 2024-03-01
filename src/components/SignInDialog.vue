<template>
  <v-dialog v-model="model" width="500">
    <v-sheet class="pa-12" rounded>
      <h2 class="mb-5 text-center">{{ t("signIn") }}</h2>
      <v-divider />
      <div class="mx-auto px-6 py-4" max-width="344">
        <v-form @submit.prevent="onSignIn" v-model="valid">
          <v-text-field
            v-model="name"
            :readonly="pending"
            :rules="[required]"
            class="mb-2"
            clearable
            :label="t('nameField')"
            variant="outlined"
          >
          </v-text-field>
          <v-text-field
            v-model="pass"
            :readonly="pending"
            :rules="[required]"
            class="mb-2"
            clearable
            :label="t('passField')"
            :type="reviewPassword ? 'text' : 'password'"
            @click:append-inner="reviewPassword = !reviewPassword"
            :append-inner-icon="reviewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            variant="outlined"
          >
          </v-text-field>
          <br />
          <v-btn
            :loading="pending"
            block
            color="success"
            size="large"
            type="submit"
            variant="elevated"
            >{{ t("signIn") }}</v-btn
          >
          <br />
          <v-btn
            variant="text"
            class="text-center"
            @click="emit('click:signUp')"
            block
            >{{ t("signUp") }}</v-btn
          >
        </v-form>
      </div>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import moeApi from "@/domain/services/moe";
import { useAppStore } from "@/store/app";

let app = useAppStore();

const model = defineModel({ default: false });
const emit = defineEmits(["click:signUp"]);

const name = ref("");
const pass = ref("");
const valid = ref(false);
const pending = ref(false);
const reviewPassword = ref(false);

const required = (value: string) => !!value || t("fieldRequired");

const onSignIn = () => {
  if (valid.value) {
    pending.value = true;
  }
  moeApi
    .signIn(name.value, pass.value)
    .then((userId) => {
      app.userId = userId;
      model.value = false;
    })
    .finally(() => {
      setTimeout(() => {
        pending.value = false;
      }, 500);
    });
};

const { t } = useI18n({
  messages: {
    en: {
      nameField: "Name",
      passField: "Password",
      signIn: "Sign In",
      fieldRequired: "Required",
      signUp: "No Account?",
    },
    zhHans: {
      nameField: "用户名",
      passField: "密码",
      signIn: "登录",
      fieldRequired: "必须",
      signUp: "没有账户？",
    },
  },
});
</script>
