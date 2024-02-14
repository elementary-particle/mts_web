<template>
  <v-container>
    <template v-for="commit in commitList">
      <v-card :title="commit.id" :text="commit.createdAt"></v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

import moeApi from "@/domain/services/moe";
import { Commit } from "@/domain/models/moe";

const route = useRoute();

const commitList = ref<Array<Commit>>([]);

const updateView = async (unitId: string | string[]) => {
  commitList.value = await moeApi.commitList(unitId as string);
};

watch(() => route.params.id, updateView);
onMounted(async () => await updateView(route.params.id));
</script>
