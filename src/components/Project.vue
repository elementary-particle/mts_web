<template>
  <v-container>
    <v-row class="intro">
      <v-col :cols="1">
        <v-avatar color="surface-variant" :size="66"></v-avatar>
      </v-col>
      <v-col cols="7">
        <h3 class="text-h5 mb-4">
          {{ project?.name ?? "[project.name]" }}
        </h3>
        <h5 class="subheading">
          {{ project?.id ?? "[project.id]" }}
        </h5>
      </v-col>
      <v-col>
        <v-row
          align-self="center"
          justify="space-around"
          style="text-align: end"
        >
          <v-col
            ><v-btn variant="outlined" v-if="app.userId"
              >Join this project</v-btn
            ></v-col
          >
          <v-col><v-btn variant="outlined">More Info</v-btn></v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="title" grow>
      <v-tab :value="0">{{ t("info") }}</v-tab>
      <v-tab :value="1">{{ t("units") }}</v-tab>
      <v-tab :value="2">{{ t("contributors") }}</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-window v-model="tab">
      <loading-overlay v-model="loading"></loading-overlay>
      <v-window-item :value="0">
        <v-row class="info">
          <v-col cols="6">
            <v-card>
              <v-card-item>
                <v-card-title>{{ t("introduction") }}</v-card-title>
              </v-card-item>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque at arcu cursus, ultrices dui a, egestas leo.
                Quisque sem erat, efficitur vitae nibh eu, pharetra porttitor
                neque. Curabitur et urna nec erat tristique viverra et quis leo.
                Nunc non ipsum interdum, scelerisque sapien vel, iaculis massa.
                Class aptent taciti sociosqu ad litora torquent per conubia
                nostra, per inceptos himenaeos. Aenean interdum mi eu nunc
                rutrum, sed eleifend arcu iaculis. Nullam dui nisl, vehicula et
                interdum sed, pharetra at leo. Aliquam bibendum dui finibus,
                eleifend diam in, mollis leo. In libero turpis, vulputate nec
                gravida et, sollicitudin ut massa. Integer et erat est. Mauris
                cursus lobortis ante, ut tincidunt nisl lobortis id. In at
                sapien dapibus ligula malesuada interdum ut sit amet erat.
                Vestibulum a accumsan tortor.
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-item>
                <v-card-title>{{ t("requirement") }}</v-card-title>
              </v-card-item>
              <v-card-text>
                Sed at imperdiet tellus. Pellentesque vitae lacus sed augue
                rutrum ornare in a nulla. Nam risus mauris, mollis vitae felis
                sit amet, pretium sodales mauris. Integer tempor lacus nunc, sit
                amet condimentum diam gravida vel. Ut sodales tristique ante, in
                placerat nibh tincidunt et. Donec in lorem eget felis posuere
                porta eu et neque. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit.
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-row class="">
              <v-col cols="4" class="text-center"
                ><h5>{{ t("translationProgress") }}</h5></v-col
              >
              <v-col>
                <v-progress-linear
                  model-value="80"
                  color="light-green"
                  height="20"
                  striped
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row class="">
              <v-col cols="4" class="text-center"
                ><h5>{{ t("proofreadingProgress") }}</h5></v-col
              >
              <v-col>
                <v-progress-linear
                  model-value="10"
                  color="cyan"
                  height="20"
                  striped
                >
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="1">
        <v-data-iterator
          :items="unitList"
          :page="unitPage"
          :items-per-page="4"
          class="mx-4"
        >
          <template v-slot:default="{ items }">
            <v-row class="unit">
              <v-col cols="6" v-for="item in items" :key="item.raw.id">
                <v-card hover>
                  <v-card-item>
                    <v-card-title>{{ item.raw.title }}</v-card-title>
                    <v-card-subtitle>{{ item.raw.id }}</v-card-subtitle>
                  </v-card-item>
                  <v-card-text> Sample Text in Unit </v-card-text>
                  <v-card-actions>
                    <v-btn
                      @click="enterProjectAttempt(item.raw.id)"
                      variant="outlined"
                      >{{ t("details") }}</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
          <template v-slot:footer="{ pageCount }">
            <v-pagination :length="pageCount" v-model="unitPage"></v-pagination>
          </template>
        </v-data-iterator>
      </v-window-item>
      <v-window-item :value="2"> Contributors </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";

import { Unit, Project } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";
import { useAppStore } from "@/store/app";
import axios from "axios";

const { t } = useI18n({
  messages: {
    en: {
      details: "Details",
      info: "Info",
      units: "Units",
      contributors: "Contributors",
      introduction: "Introduction",
      requirement: "Requirement",
      translationProgress: "Translation Progress",
      auditionProgress: "Audition Progress",
      notLoggedIn: "You must be logged in first",
    },
    zhHans: {
      details: "详细",
      info: "基本信息",
      units: "单元",
      contributors: "贡献者",
      introduction: "介绍",
      requirement: "要求",
      translationProgress: "翻译进度",
      proofreadingProgress: "校对进度",
      notLoggedIn: "需要登录才能查看",
    },
  },
});
const app = useAppStore();

const props = defineProps<{
  id: string;
}>();

const project = ref<Project | null>(null);
const unitList = ref<Array<Unit>>([]);
const loading = ref(false);

const tab = ref(null);
const unitPage = ref(1);

const enterProjectAttempt = function (unitId: string) {
  if (!app.userId) {
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

<style>
.intro {
  padding-top: 3%;
  padding-bottom: 2%;
}

.info {
  padding-top: 48px;
}

.unit {
  padding-top: 3%;
  padding-bottom: 3%;
}
</style>
