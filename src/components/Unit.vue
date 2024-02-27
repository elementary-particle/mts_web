<template>
  <loading-overlay v-model="loading" />

  <v-toolbar density="compact">
    <v-text-field
      hide-details
      prepend-icon="mdi-magnify"
      single-line
      class="ml-4"
    ></v-text-field>

    <v-spacer />

    <v-btn icon>
      <v-icon>mdi-download</v-icon>
    </v-btn>

    <v-btn icon>
      <v-icon>mdi-upload</v-icon>
    </v-btn>

    <v-btn
      icon
      :disabled="selection == null || selection == 1"
      @click="updateSelection(1)"
    >
      <v-icon>mdi-page-first</v-icon>
    </v-btn>

    <v-btn
      icon
      :disabled="selection == null || selection == 1"
      @click="updateSelection(selection - 1)"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>

    <v-btn
      icon
      :disabled="selection == null || selection == sourceList.length"
      @click="updateSelection(selection + 1)"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>

    <v-btn
      icon
      :disabled="selection == null || selection == sourceList.length"
      @click="updateSelection(sourceList.length)"
    >
      <v-icon>mdi-page-last</v-icon>
    </v-btn>

    <v-btn icon :disabled="!isEdited" @click="submitCommit()">
      <v-icon>mdi-cloud-upload</v-icon>
    </v-btn>
  </v-toolbar>

  <v-divider />

  <v-container fluid style="position: static; z-index: 0; overflow: hidden">
    <v-row>
      <v-col cols="5">
        <div class="preview" height="440">
          <v-row
            v-for="source in sourceList"
            :key="source.sq"
            @click="updateSelection(source.sq)"
            class="source"
            v-bind:class="{ selected: source.sq == selection }"
            v-ripple
          >
            <v-col cols="6">
              <div>
                <a>{{ source.content }}</a>
              </div>
            </v-col>
            <v-col cols="6">
              <div>
                <a>{{
                  localTextRecordList?.find((x) => x.sq == source.sq)
                    ?.content ?? ""
                }}</a>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="4" id="editor" class="pt-4">
        <v-row>
          <v-col cols="3"
            ><v-text-field
              variant="outlined"
              color="primary"
              label="Sq"
              :model-value="selection"
              style="font-family: &quot;Noto Serif SC&quot;"
              readonly
            ></v-text-field></v-col
          ><v-col>
            <v-text-field
              variant="outlined"
              color="primary"
              label="Speaker"
              :model-value="selection ? '-' : ''"
              style="font-family: &quot;Noto Serif JP&quot;"
              readonly
            ></v-text-field
          ></v-col>
        </v-row>
        <v-textarea
          :model-value="currentSource?.content ?? ''"
          variant="outlined"
          color="primary"
          label="Source"
          style="font-family: &quot;Noto Serif JP&quot;"
          auto-grow
          readonly
        ></v-textarea>
        <v-textarea
          v-model="currentRecord"
          auto-grow
          variant="outlined"
          color="primary"
          label="Record"
          style="font-family: &quot;Noto Serif SC&quot;"
          :readonly="selection == null"
          clearable
          @keyup.enter="keyDown"
          onkeydown="if (event.keyCode===13) {return false;}"
        ></v-textarea>
        <!-- <v-card class="text-noto">
          <v-card-item>
            <v-card-title>Recent Commits</v-card-title>
          </v-card-item>
          <v-divider />

          <v-list lines="two" height="400">
            <div v-for="commitRecordPair in recordList">
              <v-list-item
                
                :key="commitRecordPair.commit.id"
                :title="commitRecordPair.recordList.find(x => x.sq == selection)?.content"
                :subtitle="commitRecordPair.commit.createdAt"
                v-if="selection != null && commitRecordPair.recordList.find(x => x.sq == selection) != null"
              >
              </v-list-item>
              <v-divider v-if="selection != null && commitRecordPair.recordList.find(x => x.sq == selection) != null" />
            </div>
          </v-list>
        </v-card> -->
      </v-col>
      <v-col cols="3">
        <v-card class="mx-auto" variant="tonal" color="primary">
          <v-card-text>
            <p class="text-noto text-disabled">{{ unit?.id ?? "[unit.id]" }}</p>
            <p class="text-h4 text--primary text-noto font-weight-medium mb-4">
              {{ unit?.title ?? "[unit.name]" }}
            </p>
            <p class="text-noto">{{ "Sample Description of Unit" }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              variant="outlined"
              v-if="app.userId && !isEditing"
              color="warning"
              >Lock & Edit</v-btn
            >
            <v-btn
              variant="outlined"
              v-if="app.userId && isEditing"
              color="success"
              >Commit Changes</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card class="mx-auto mt-4 text-noto">
          <v-card-item>
            <v-card-title>Issues</v-card-title>
          </v-card-item>
          <v-divider />
          <v-list item-props lines="two">
            <v-list-item
              title="[[ issue.title ]]"
              subtitle="[[ issue.id ]]"
              v-ripple
            >
              <template v-slot:prepend>
                <v-avatar color="success">
                  <v-icon color="white">mdi-clipboard-text</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
            <v-list-item
              title="[[ issue.title ]]"
              subtitle="[[ issue.id ]]"
              v-ripple
            >
              <template v-slot:prepend>
                <v-avatar color="warning">
                  <v-icon color="white">mdi-clipboard-text</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
            <v-list-item
              title="[[ issue.title ]]"
              subtitle="[[ issue.id ]]"
              v-ripple
            >
              <template v-slot:prepend>
                <v-avatar color="red">
                  <v-icon color="white">mdi-clipboard-text</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
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
import { ref, watch, onMounted, onUnmounted, watchEffect } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LoadingOverlay from "./LoadingOverlay.vue";

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

type CommitRecordPair = {
  commit: Commit;
  recordList: TextRecord[];
};

const unit = ref<Unit | null>(null);
const tranList = ref<Array<FullRecord>>([]);
const commitList = ref<Array<Commit>>([]);
const sourceList = ref<Array<Source>>([]);
const recordList = ref<Array<CommitRecordPair>>([]);

const localTextRecordList = ref<Array<TextRecord>>([]);

const isEditing = ref(false);
const isEdited = ref(false);
const selection = ref();
const loading = ref(false);

const currentSource = ref<Source>();
const currentRecord = ref();

const updateSelection = function (id: number) {
  if (id == null || id > sourceList.value.length || id <= 0) return;
  selection.value = id;

  currentSource.value = sourceList.value.find((x) => x.sq == selection.value);
  currentRecord.value =
    localTextRecordList.value.find((x) => x.sq == selection.value)?.content ??
    "";
};

const keyDown = function (e: any) {
  if (e.altKey && e.keyCode === 13) {
    currentRecord.value += "\n";
  } else {
    saveAndNext();
  }
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

  isEdited.value = true;
  updateSelection(selection.value + 1);
};

const updateView = async (unitId: string) => {
  loading.value = true;
  try {
    await moeApi.commitList(unitId).then((commitList_) => {
      commitList.value = commitList_;
    });
    await moeApi.unitSourceList(unitId).then((sourceList_) => {
      sourceList.value = sourceList_;
    });
    await moeApi.unitById(unitId).then((unit_) => {
      unit.value = unit_;
      recordList.value = new Array<CommitRecordPair>();

      if (unit_.commitId) {
        commitList.value.forEach((commit) => {
          moeApi.commitRecordList(commit.id).then((recordList_) => {
            recordList.value.push({ commit: commit, recordList: recordList_ });
          });
        });
        moeApi
          .commitRecordList(commitList.value[commitList.value.length - 1]?.id)
          .then((recordList_) => {
            localTextRecordList.value = [];
            recordList_.forEach((record) => {
              localTextRecordList.value.push(Object.assign({}, record));
            });
          });
      }
    });

    loading.value = false;
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
};

const submitCommit = async function () {
  loading.value = true;
  try {
    await moeApi
      .commitAdd(unit.value?.id as string, localTextRecordList.value)
      .then((commitId) => {
        updateView(unit.value?.id as string);
        loading.value = false;

        // recordList.value = localTextRecordList.value;
        isEdited.value = false;

        app.callUpSnackbar("Success", "Successfully submitted", "success");
      });
  } catch (e) {
    console.log(e);
    loading.value = false;
  }
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

.edit-area {
  position: relative;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 100%;
  z-index: 2;
}

.edit-area-bg {
  background: rgb(var(--v-theme-background));
  background-size: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 110px;
}

.preview {
  display: block;
  background: rgb(var(--v-theme-surface));
  padding-left: 18px;
  padding-right: 18px;
  padding-top: 24px;
  padding-bottom: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 150px);
}

.source {
  overflow-wrap: break-word;
  font-family: "Noto Serif SC", "Noto Serif JP";
}

.source:hover .v-col {
  background-color: rgb(var(--v-theme-surface-light));
}

.selected {
  background-color: rgb(var(--v-theme-surface-light));
  overflow-wrap: break-word;
  font-family: "Noto Serif SC", "Noto Serif JP";
}

.text-noto {
  font-family: "Noto Serif SC", "Noto Serif JP";
}

.text-box {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
