<template>
  <v-container>
    <template v-for="unit in unitList">
      <v-card :title="unit.title" :text="unit.commit">
        <v-card-actions>
          <v-btn @click="$router.push(`/unit/${unit.id}`)">{{
            t("detailsText")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import { Unit } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";

const route = useRoute();
const { t } = useI18n();

const unitList = ref<Array<Unit>>([]);

const updateView = async (projectId: string | string[]) => {
  unitList.value = await moeApi.unitList(projectId as string);
};

watch(() => route.params.id, updateView);
onMounted(async () => {
  await updateView(route.params.id);
});
</script>
