<template>
  <v-container>
    <loading-overlay v-model="loading"></loading-overlay>
    <v-row>
      <v-col cols="8">
        <v-data-iterator :items="unitList" :page="dataPage" :items-per-page="8">
          <template v-slot:default="{ items }">
            <template v-for="item in items" :key="item.raw.id">
              <v-card
                link
                variant="tonal"
                class="my-2 text-mono"
                @click="$router.push(`/unit/${item.raw.id}`)"
              >
                <v-row class="align-center pa-2">
                  <v-col cols="2">
                    <p>{{ item.raw.title }}</p>
                  </v-col>
                  <v-divider vertical />
                  <v-col cols="6">
                    <p>{{ item.raw.id }}</p>
                  </v-col>
                  <v-divider vertical />
                  <v-col cols="4">
                    <p>{{ item.raw.commitId?.slice(0, 8) ?? "[no commit]" }}</p>
                  </v-col>
                </v-row>
              </v-card>
            </template>
          </template>

          <template v-slot:footer="{ pageCount }">
            <v-pagination v-model="page" :length="pageCount" />
          </template>
        </v-data-iterator>
      </v-col>
      <v-col cols="4">
        <v-card class="mx-auto pb-2" variant="tonal" color="primary">
          <v-card-text>
            <p class="font-mono text-disabled">
              {{ project?.id ?? "[ project.id ]" }}
            </p>
            <p class="text-h4 text--primary font-mono font-weight-medium mb-4">
              {{ project?.name }}
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
          <v-card-text class="font-weight-light"> [[]] </v-card-text>
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
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import axios from "axios";

import { Unit, Project } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";

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
      shirotsume: "白詰草話",
    },
  },
});
const router = useRouter();
const route = useRoute();
const user = useUserStore();

const props = defineProps<{
  id: string;
}>();

const project = ref<Project | null>(null);
const unitList = ref<Array<Unit>>([]);

const loading = ref(false);
const page = ref(1);
const dataPage = computed(() => {
  if (unitList.value.length == 0) {
    return 0;
  } else {
    return page.value;
  }
});

watch(
  () => route.query.page,
  (page_) => {
    if (typeof page_ == "string" && /\d+/.test(page_)) {
      page.value = parseInt(page_);
    }
  },
  { immediate: true },
);

watch(
  page,
  (page_) => {
    router.replace({ ...route, query: { page: page_ } });
  },
  { immediate: true },
);

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

<style scoped>
.text-mono {
  font-family: monospace;
}
</style>
