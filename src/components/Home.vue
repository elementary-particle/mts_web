<template>
  <loading-overlay v-model="loading"></loading-overlay>
  <v-parallax src="@/assets/bg.webp" class="parallax"></v-parallax>
  <v-container class="banner" fluid>
    <v-row>
      <v-col align-self="center" class="text-center">
        <h1 class="mb-5 banner-heading">Moe Translation System</h1>
        <h4 class="text-h4 font-weight-light banner-subheading mb-5">
          萌译在线翻译平台
        </h4>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid>
    <v-row>
      <v-col cols="6">
        <h2 class="project-in-list font-weight-light">Project List</h2>
        <v-divider class="project-in-list" />
        <v-window v-model="page" show-arrows="hover">
          <v-window-item v-for="project in projectList" :key="project.id">
            <v-card
              hover
              class="project-in-list"
              color="secondary"
              variant="tonal"
            >
              <v-card-item>
                <v-card-title>{{ project.name }}</v-card-title>
                <v-card-subtitle>{{ project.id }}</v-card-subtitle>
              </v-card-item>
              <v-card-text> Sample Text in Project </v-card-text>
              <v-card-actions>
                <v-btn
                  @click="$router.push(`/project/${project.id}`)"
                  variant="outlined"
                  >{{ t("details") }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
      <v-col cols="6">
        <h2 class="project-in-list font-weight-light">Recent Commits</h2>
        <v-divider class="project-in-list" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { Project } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";

const projectList = ref<Array<Project>>([]);
const page = ref(0);
const loading = ref(false);

onMounted(() => {
  loading.value = true;
  moeApi
    .projectList()
    .then((list) => {
      projectList.value = list;
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 500);
    });
});

const { t } = useI18n({
  messages: {
    en: {
      details: "Details",
    },
    zhHans: {
      details: "详细",
    },
  },
});
</script>

<style>
.parallax {
  height: 500px;
  z-index: 0;
  mask: linear-gradient(0deg, transparent, #000000);
  overflow: hidden;
}

.bg {
  background: url(@/assets/bg.webp) no-repeat 50% 50%;
  background-size: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  overflow: hidden;
  z-index: 0;
  mask: linear-gradient(0deg, transparent, #000000);
}

.banner {
  position: absolute;
  top: 150px;
  left: 0;
  margin-bottom: 5%;
  z-index: 1;
}

.banner-heading {
  font-size: 72px;
  font-weight: 300;
}

.banner-subheading {
  font-size: 36px;
}

.banner-button {
  margin-left: 16px;
  margin-right: 16px;
}

.project-in-list {
  margin-left: 96px;
  margin-right: 96px;
  margin-bottom: 2%;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
