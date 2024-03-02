<template>
  <v-container>
    <loading-overlay v-model="loading"></loading-overlay>
    <v-row>
      <v-col cols="8">
        <v-expansion-panels>
          <v-expansion-panel v-for="unit in unitList" :key="unit.id">
            <v-expansion-panel-title ripple>
              <v-row class="px-4" no-gutters>
                <v-col cols="3">{{ unit.title }}</v-col>
                <v-col cols="5" class="text-medium-emphasis">{{
                  "[[ lastCommit.description ]]"
                }}</v-col>
                <v-col cols="4" class="text-right text-medium-emphasis">{{
                  "[[ lastCommit.time ]]"
                }}</v-col>
              </v-row>
            </v-expansion-panel-title>
            <v-progress-linear model-value="10" color="light-green">
            </v-progress-linear>
            <v-expansion-panel-text
              style="background-color: rgba(var(--v-theme-surface-light), 0.4)"
              class="pt-2"
            >
              <v-row class="mx-3">
                <v-col cols="6">
                  {{ "Status: [[ unit.currentStatus ]]" }}
                </v-col>
                <v-col class="text-right"
                  ><v-btn
                    variant="outlined"
                    density="comfortable"
                    @click="navToUnit(unit.id as string)"
                    >{{ t("details") }}</v-btn
                  ></v-col
                >
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="4">
        <v-card
          class="mx-auto pb-2"
          variant="tonal"
          color="primary"
          rounded="0"
        >
          <v-card-text>
            <p class="font-serif text-disabled">
              {{ project?.id ?? "[ project.id ]" }}
            </p>
            <p class="text-h4 text--primary font-serif font-weight-medium mb-4">
              {{ t(`${project?.name}`) ?? project?.name }}
            </p>
          </v-card-text>
          <v-card-actions class="mx-2">
            <v-btn variant="outlined" v-if="user.id" color="success">{{
              t("join")
            }}</v-btn>
            <v-btn variant="outlined" color="secondary">{{
              t("details")
            }}</v-btn>
          </v-card-actions>
          <v-divider class="my-2" />
          <v-card-title>{{ t("introduction") }}</v-card-title>
          <v-card-text class="font-weight-light">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque at arcu cursus, ultrices dui a, egestas leo. Quisque
            sem erat, efficitur vitae nibh eu, pharetra porttitor neque.
            Curabitur et urna nec erat tristique viverra et quis leo. Nunc non
            ipsum interdum, scelerisque sapien vel, iaculis massa. Class aptent
            taciti sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Aenean interdum mi eu nunc rutrum, sed eleifend arcu
            iaculis. Nullam dui nisl, vehicula et interdum sed, pharetra at leo.
            Aliquam bibendum dui finibus, eleifend diam in, mollis leo. In
            libero turpis, vulputate nec gravida et, sollicitudin ut massa.
            Integer et erat est. Mauris cursus lobortis ante, ut tincidunt nisl
            lobortis id. In at sapien dapibus ligula malesuada interdum ut sit
            amet erat. Vestibulum a accumsan tortor.
          </v-card-text>
          <v-divider class="my-2" />
          <v-card-title>{{ t("contributors") }}</v-card-title>
          <v-row no-gutters class="mx-4">
            <v-btn icon class="mx-1 my-2"
              ><v-avatar><span class="text-h5">A</span></v-avatar></v-btn
            >
            <v-btn icon class="mx-1 my-2"
              ><v-avatar><span class="text-h5">B</span></v-avatar></v-btn
            >
            <v-btn icon class="mx-1 my-2"
              ><v-avatar><span class="text-h5">C</span></v-avatar></v-btn
            >
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

import router from "@/router";
import { Unit, Project } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";

const { t } = useI18n({
  messages: {
    en: {
      details: "Details",
      join: "Join Project",
      info: "Info",
      units: "Units",
      contributors: "Contributors",
      introduction: "Introduction",
      requirement: "Requirement",
      translationProgress: "Translation Progress",
      auditionProgress: "Audition Progress",
      notLoggedIn: "You must be logged in first",
      shirotsume: "Shirotsume Souwa",
    },
    zhHans: {
      details: "详细",
      join: "加入项目",
      info: "基本信息",
      units: "单元",
      contributors: "贡献者",
      introduction: "介绍",
      requirement: "要求",
      translationProgress: "翻译进度",
      auditionProgress: "校对进度",
      notLoggedIn: "需要登录才能查看",
      shirotsume: "白詰草話",
    },
  },
});

const app = useAppStore();
const user = useUserStore();

const props = defineProps<{
  id: string;
}>();

const project = ref<Project | null>(null);
const unitList = ref<Array<Unit>>([]);
const loading = ref(false);

const tab = ref(null);
const unitPage = ref(1);

const navToUnit = function (unitId: string) {
  if (!user.id) {
    app.snackbar(t("notLoggedIn"), { color: "error" });
  } else {
    router.push(`/unit/${unitId}`);
  }
};

watch(
  () => props.id,
  (id) => {
    loading.value = true;

    axios
      .all([
        moeApi.projectById(id).then((data) => {
          project.value = data;
        }),
        moeApi.unitList(id).then((data) => {
          unitList.value = data;
        }),
      ])
      .then(() => {
        loading.value = false;
      });
  },
  { immediate: true },
);
</script>
