<template>
  <v-dialog v-model="model" width="500">
    <loading-overlay model="loading" />
    <v-sheet class="pa-12" rounded>
      <h2 class="mb-5 text-center">{{ t("signUp") }}</h2>
      <v-divider />
      <div class="mx-auto px-6 py-4" max-width="344">
        <v-form @submit.prevent="onSignUp" v-model="valid">
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
            v-model="email"
            :readonly="pending"
            :rules="[required, validEmail]"
            class="mb-2"
            clearable
            :label="t('emailField')"
            variant="outlined"
          >
          </v-text-field>
          <v-text-field
            v-model="pass"
            :readonly="pending"
            :rules="[required, minLength(8)]"
            class="mb-2"
            clearable
            :label="t('passField')"
            variant="outlined"
            type="password"
          >
          </v-text-field>
          <v-text-field
            v-model="repeatPass"
            :readonly="pending"
            :rules="[required, minLength(8), matchedPass]"
            class="mb-2"
            clearable
            :label="t('repeatPassField')"
            variant="outlined"
            type="password"
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
            >{{ t("signUp") }}</v-btn
          >
          <br />
          <v-btn
            variant="text"
            class="text-center"
            @click="emit('click:signIn')"
            block
            >{{ t("signIn") }}</v-btn
          >
        </v-form>
      </div>
    </v-sheet>
  </v-dialog>
  <v-dialog v-model="verification" width="500">
    <v-card
      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="12"
      max-width="400"
      width="100%"
    >
      <h3 class="text-h6 mb-4">Verify Your Account</h3>
      <div class="text-body-2">
        We sent a verification code to {{ email }} <br />
        Please check your email and paste the code below.
      </div>

      <v-sheet color="surface">
        <v-otp-input v-model="otp" :disabled="validating"></v-otp-input>
      </v-sheet>

      <v-btn
        class="my-4"
        color="primary"
        height="40"
        text="Verify"
        variant="flat"
        :loading="validating"
        @click="validating = true"
        :disabled="otp.length < 6"
      ></v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LoadingOverlay from "./LoadingOverlay.vue";

const model = defineModel({ default: false });
const emit = defineEmits(["click:signIn"]);

const loading = ref(false);

const name = ref("");
const pass = ref("");
const repeatPass = ref("");
const email = ref("");
const valid = ref(false);
const pending = ref(false);

const verification = ref(false);
const otp = ref("");
const validating = ref(false);

const required = (value: string) => !!value || t("fieldRequired");
const validEmail = (value: string) => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(value) || t("invalidEmail");
};
const minLength = (length: number) => (value: string) =>
  value.length >= length || t("tooShort", { length });
const matchedPass = (value: string) =>
  (value === pass.value ?? "") || t("unmatchedPass");

const onSignUp = () => {
  model.value = false;
  verification.value = true;
};

const { t } = useI18n({
  messages: {
    en: {
      nameField: "Name",
      passField: "Password",
      repeatPassField: "Repeat Password",
      emailField: "Email",
      invalidEmail: "Invalid email format",
      fieldRequired: "Required",
      tooShort: "Too short, at least {length} characters required",
      unmatchedPass: "Passwords don't match",
    },
    zhHans: {
      nameField: "用户名",
      passField: "密码",
      repeatPassField: "重复密码",
      emailField: "邮箱",
      invalidEmail: "无效邮箱地址",
      fieldRequired: "必须",
      tooShort: "至少由 {length} 个字符组成",
      unmatchedPass: "密码不匹配",
    },
  },
});
</script>
