<template>
  <v-container>
    <template v-for="project in projectList">
      <v-card :title="project.name">
        <v-card-actions>
          <v-btn @click="$router.push(`/project/${project.id}`)">{{
            t("detailsText")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { Project } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";

const { t } = useI18n();

const projectList = ref<Array<Project>>([]);

onMounted(() => {
  moeApi.projectList().then((list) => {
    projectList.value = list;
    if (list.length == 0) {
      moeApi.projectAdd({ name: "Project 1" });
      moeApi.projectAdd({ name: "Project 2" });
    }
  });
});
</script>
