<template>
  <sign-in-dialog
    v-model="signIn"
    @click:sign-up="
      () => {
        signIn = false;
        signUp = true;
      }
    "
  ></sign-in-dialog>
  <sign-up-dialog
    v-model="signUp"
    @click:sign-in="
      () => {
        signUp = false;
        signIn = true;
      }
    "
  ></sign-up-dialog>
  <v-btn
    icon
    @click="
      () => {
        signUp = false;
        signIn = true;
      }
    "
    v-if="!app.userId"
    ><v-icon>mdi-account</v-icon></v-btn
  >
  <v-menu min-width="200px" rounded v-if="app.userId">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="primary">
          <span class="text-h5">A</span>
        </v-avatar>
      </v-btn>
    </template>
    <v-card width="250" flat rounded="0">
      <v-card-text>
        <div class="mx-auto text-left">
          <v-row>
            <v-col cols="3">
              <v-avatar color="primary">
                <span class="text-h5">A</span>
              </v-avatar>
            </v-col>
            <v-col>
              <h3>Username</h3>
              <p class="text-caption mt-1">email@sample.com</p>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-divider />
      <v-list flat rounded="0">
        <v-list-item @click="null">
          <v-list-item-title>{{ t("settings") }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="app.userId = ''">
          <v-list-item-title>{{ t("logout") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAppStore } from "@/store/app";
import { useI18n } from "vue-i18n";

const app = useAppStore();

const { t } = useI18n({
  messages: {
    en: {
      settings: "Settings",
      logout: "Log out",
    },
    zhHans: {
      settings: "设置",
      logout: "登出",
    },
  },
});

const signIn = ref(false);
const signUp = ref(false);
</script>
