<template>
  <v-container>
    <v-row class="intro">
      <v-col :cols="1">
        <v-avatar color="surface-variant" :size="66"></v-avatar>
      </v-col>
      <v-col cols="7">
        <h3 class="text-h5 mb-4">
          {{ "[unit.name]" }}
        </h3>
        <h5 class="subheading">
          {{ "[unit.id]" }}
        </h5>
      </v-col>
      <v-col>
        <v-row
          align-self="center"
          justify="space-around"
          style="text-align: end"
        >
          <v-col
            ><v-btn variant="outlined" v-if="app.userId && !isEditing"
              >Edit Mode</v-btn
            ></v-col
          >
          <v-col
            ><v-btn variant="outlined" v-if="app.userId && isEditing"
              >Commit Changes</v-btn
            ></v-col
          >
          <v-col><v-btn variant="outlined">More Info</v-btn></v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-divider></v-divider>
  </v-container>
  <v-container fluid>
    <v-row class="ml-4 mr-4">
      <v-col cols="8">
        <v-table>
          <thead>
            <v-row no-gutters class="mt-2 mb-2 ml-5 mr-4">
              <v-col class="text-left" cols="1"><b>Sq</b></v-col>
              <v-col class="text-left" cols="5"><b>Source</b></v-col>
              <v-col class="text-left" cols="5"><b>Record</b></v-col>
              <v-col class="text-right" cols="1"><b>Status</b></v-col>
            </v-row>
          </thead>
        </v-table>
        <v-expansion-panels v-model="expansion">
          <v-expansion-panel
            v-for="source in viewUnitSourceList"
            :key="source.sq"
          >
            <v-expansion-panel-title @click="updateSelection(source.sq)">
              <v-row no-gutters>
                <v-col cols="1" class="d-flex justify-start">
                  {{ source.sq }}
                </v-col>
                <v-col cols="5" class="text--secondary">
                  {{ source.content }}
                </v-col>
                <v-col cols="5" class="text--secondary">
                  {{
                    localTextRecordList.find((x) => x.sq == source.sq)
                      ?.content ?? ""
                  }}
                </v-col>
                <v-col cols="1" class="text--secondary"></v-col>
              </v-row>
              <template v-slot:actions>
                <v-icon
                  icon="mdi-circle-outline"
                  v-if="
                    localTextRecordList.find((x) => x.sq == source.sq) == null
                  "
                >
                </v-icon>
                <v-icon
                  color="teal"
                  icon="mdi-check-circle"
                  v-if="
                    localTextRecordList.find((x) => x.sq == source.sq) !=
                      null &&
                    localTextRecordList.find((x) => x.sq == source.sq)
                      ?.content ==
                      recordList.find((x) => x.sq == source.sq)?.content
                  "
                >
                </v-icon>
                <v-icon
                  color="warning"
                  icon="mdi-alert-circle"
                  v-if="
                    localTextRecordList.find((x) => x.sq == source.sq) !=
                      null &&
                    localTextRecordList.find((x) => x.sq == source.sq)
                      ?.content !=
                      recordList.find((x) => x.sq == source.sq)?.content
                  "
                >
                </v-icon>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row no-gutters>
                <v-col cols="1" class="mt-2"></v-col>
                <v-col class="mt-2">
                  {{ recordList.find((x) => x.sq == source.sq)?.content ?? "" }}
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        <div class="text-center mt-2">
          <v-pagination
            v-model="page"
            :length="maxPage"
            rounded="circle"
          ></v-pagination>
        </div>
      </v-col>
      <v-col cols="4" id="editor">
        <affix :offset="20">
          <v-card class="mx-auto">
            <v-card-title class="text-h6 font-weight-regular">
              {{ t("editor") }}
            </v-card-title>
            <v-divider />
            <v-form ref="form" class="pa-4 pt-6">
              <v-text-field
                variant="outlined"
                color="primary"
                label="Sq"
                :model-value="selection"
                readonly
              ></v-text-field>
              <v-textarea
                :model-value="currentSource?.content ?? ''"
                variant="outlined"
                color="primary"
                label="Source"
                auto-grow
                readonly
              ></v-textarea>
              <v-textarea
                v-model="currentRecord"
                auto-grow
                :readonly="selection == null"
                variant="outlined"
                color="primary"
                label="Record"
                clearable
                @keyup.enter="saveAndNext()"
                onkeydown="if (event.keyCode===13) {return false;}"
              ></v-textarea>
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                variant="text"
                @click="updateSelection(selection + 1)"
                :disabled="selection >= sourceList.length"
              >
                {{ t("next") }}
              </v-btn>
              <v-btn color="primary" @click="saveAndNext()">
                {{ t("saveAndNext") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </affix>
      </v-col>
    </v-row>
  </v-container>

  <div class="toolbar">
    <v-row>
      <v-col
        ><v-btn
          icon="mdi-arrow-left"
          size="large"
          @click="$router.go(-1)"
        ></v-btn
      ></v-col>
      <v-col
        ><v-btn icon="mdi-home" size="large" @click="$router.push('/')"></v-btn
      ></v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import moeApi from "@/domain/services/moe";
import {
  Commit,
  FullRecord,
  Source,
  TextRecord,
  Unit,
  makeFullCommit,
} from "@/domain/models/moe";
import { useAppStore } from "@/store/app";
import axios from "axios";
import { watchEffect } from "vue";

const route = useRoute();
const { t } = useI18n({
  messages: {
    en: {
      editor: "Editor",
      next: "Next",
      saveAndNext: "Save & Next",
    },
    zhHans: {
      editor: "编辑器",
      next: "下一项",
      saveAndNext: "保存并下一项",
    },
  },
});
const app = useAppStore();

const props = defineProps<{
  id: string;
}>();

const unit = ref<Unit | null>(null);
const tranList = ref<Array<FullRecord>>([]);
const commitList = ref<Array<Commit>>([]);
const sourceList = ref<Array<Source>>([]);
const recordList = ref<Array<TextRecord>>([]);

const localTextRecordList = ref<Array<TextRecord>>([]);

const viewUnitSourceList = ref<Array<Source>>([]);

const isEditing = ref(false);
const isEdited = ref(false);
const page = ref(1);
const maxPage = ref(1);
const selection = ref();
const expansion = ref();

const currentSource = ref<Source>();
const currentRecord = ref();

watchEffect(() => {
  viewUnitSourceList.value = sourceList.value.slice(
    (page.value - 1) * 10,
    page.value * 10,
  );
  selection.value = viewUnitSourceList.value[expansion.value]?.sq;
});

const updateSelection = function (id: number) {
  if (id > sourceList.value.length || id <= 0) return;
  page.value = Math.ceil(id / 10);

  selection.value = id;
  expansion.value = (id - 1) % 10;

  currentSource.value = sourceList.value.find((x) => x.sq == selection.value);
  currentRecord.value =
    localTextRecordList.value.find((x) => x.sq == selection.value)?.content ??
    "";
};

const saveAndNext = function () {
  if (selection.value == null) return;
  let target = localTextRecordList.value.find((x) => x.sq == selection.value);

  if (target) {
    if (target.content === currentRecord.value) {
      updateSelection(selection.value + 1);
      return;
    }
    target.content = currentRecord.value;
  } else {
    localTextRecordList.value.push(
      new TextRecord(selection.value, currentRecord.value),
    );
  }

  console.log(
    `${localTextRecordList.value.find((x) => x.sq == selection.value)?.content}, ${recordList.value.find((x) => x.sq == selection.value)?.content}`,
  );

  isEdited.value = true;
  updateSelection(selection.value + 1);
};

const updateView = (unitId: string) => {
  try {
    moeApi.commitList(unitId).then((commitList_) => {
      commitList.value = commitList_;
    });
    moeApi.unitSourceList(unitId).then((sourceList_) => {
      sourceList.value = sourceList_;
    });
    moeApi.unitById(unitId).then((unit_) => {
      unit.value = unit_;
      if (unit_.commitId) {
        moeApi.commitRecordList(commitList.value[0]?.id).then((recordList_) => {
          recordList.value = recordList_;
          localTextRecordList.value = [];
          recordList.value.forEach((record) => {
            localTextRecordList.value.push(Object.assign({}, record));
          });
        });
      } else {
        recordList.value = new Array<TextRecord>(sourceList.value.length);
      }
    });
  } catch (e) {
    console.log(e);
  }

  page.value = 1;
  maxPage.value = Math.ceil(sourceList.value.length / 10);
};

const beforeUnloadHandler = function (e: any) {
  if (isEdited.value) e.returnValue = "Exit?";
};

watch(() => props.id, updateView, { immediate: true });

onMounted(() =>
  window.addEventListener("beforeunload", beforeUnloadHandler, false),
);
onUnmounted(() =>
  window.removeEventListener("beforeunload", beforeUnloadHandler, false),
);
onBeforeRouteLeave((to, from, next) => {
  if (isEdited.value) {
    let isSave = confirm("Changes you made may not be saved.");
    if (isSave) next(true);
    else next(false);
  } else next(true);
});
</script>

<style scoped>
.intro {
  padding-top: 3%;
  padding-bottom: 2%;
}
</style>
