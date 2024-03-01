<template>
  <v-dialog v-model="model" width="500">
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const model = defineModel({ default: false });
const emit = defineEmits(["click:signIn"]);

const name = ref("");
const pass = ref("");
const repeatPass = ref("");
const email = ref("");
const valid = ref(false);
const pending = ref(false);

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

const onSignUp = () => {};

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
