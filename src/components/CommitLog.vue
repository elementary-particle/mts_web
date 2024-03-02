<template>
  <v-dialog max-width="800" class="font-serif">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" variant="outlined">{{
        t("commitLog")
      }}</v-btn>
    </template>

    <template v-slot:default="{}">
      <loading-overlay v-model="loading"></loading-overlay>
      <v-card>
        <v-card-item class="pb-2">
          <v-card-title>{{ t("commitLog") }}</v-card-title>
        </v-card-item>
        <v-divider />
        <v-list item-props lines="three" height="300" style="overflow-y: auto">
          <template v-for="commit in commitList" :key="commit.id">
            <v-list-item
              :title="commit.createdBy"
              :subtitle="commit.createdAt"
              v-ripple
            >
              <template v-slot:prepend>
                <v-avatar color="grey">
                  <span class="text-h5">{{
                    commit.createdBy[0].toUpperCase()
                  }}</span>
                </v-avatar>
              </template>
              <p class="mt-2">{{ commit.id }}</p>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { Commit } from "@/domain/models/moe";
import moeApi from "@/domain/services/moe";

const props = defineProps<{ id: string }>();
const commitList = ref<Commit[]>([]);

const loading = ref(true);

watch(
  () => props.id,
  (id) => {
    loading.value = true;
    moeApi.commitList(id).then((commitList_) => {
      commitList.value = commitList_;
      loading.value = false;
    });
  },
  { immediate: true },
);

const { t } = useI18n({
  messages: {
    en: {
      commitLog: "Commit Log",
    },
    zhHans: {
      commitLog: "提交记录",
    },
  },
});
</script>
