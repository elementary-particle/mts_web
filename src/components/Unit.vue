<template>
  <Affix class="edit-area">
    <div class="edit-area-bg"></div>
    <v-container class="edit-area-content">
      <v-row>
        <v-col cols="1">
          <v-menu location="bottom">
            <template v-slot:activator="{ props, isActive }">
              <v-btn
                :icon="isActive ? 'mdi-chevron-up' : 'mdi-menu'"
                size="large"
                v-bind="props"
              ></v-btn>
            </template>

            <v-btn
              icon="mdi-menu"
              size="large"
              class="mt-2 mb-2"
              @click="addTestUnit()"
            ></v-btn>
            <v-btn icon="mdi-menu" size="large" class="mt-2 mb-2"></v-btn>
            <v-btn icon="mdi-menu" size="large" class="mt-2 mb-2"></v-btn>
          </v-menu>
        </v-col>
        <v-col>
          <v-text-field
            label="Record"
            variant="outlined"
            rounded
            v-model="currentRecord"
            clearable
            @keyup.enter="saveAndNext()"
            onkeydown="if (event.keyCode===13) {return false;}"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn
            block
            rounded="xl"
            size="x-large"
            :color="'success'"
            @click="saveAndNext()"
            >{{ t("saveAndNext") }}</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </Affix>

  <v-tabs v-model="unitTab" align-tabs="title">
    <v-tab :value="1"> Editor </v-tab>
    <v-tab :value="2"> Info </v-tab>
  </v-tabs>

  <v-divider />

  <v-window v-model="unitTab">
    <v-window-item :value="1">
      <v-container fluid style="position: static; z-index: 0">
        <v-row class="ml-4 mr-4">
          <v-col cols="8">
            <v-table hover>
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
                      <div class="text-box">
                        {{ source.content }}
                      </div>
                    </v-col>
                    <v-col cols="5" class="text--secondary">
                      <div class="text-box">
                        {{
                          localTextRecordList?.find((x) => x.sq == source.sq)
                            ?.content ?? ""
                        }}
                      </div>
                    </v-col>
                    <v-col cols="1" class="text--secondary"></v-col>
                  </v-row>
                  <template v-slot:actions>
                    <v-icon
                      icon="mdi-circle-outline"
                      v-if="
                        localTextRecordList?.find((x) => x.sq == source.sq) ==
                        null
                      "
                    >
                    </v-icon>
                    <v-icon
                      color="teal"
                      icon="mdi-check-circle"
                      v-if="
                        localTextRecordList?.find((x) => x.sq == source.sq) !=
                          null &&
                        localTextRecordList?.find((x) => x.sq == source.sq)
                          ?.content ==
                          recordList?.find((x) => x.sq == source.sq)?.content
                      "
                    >
                    </v-icon>
                    <v-icon
                      color="warning"
                      icon="mdi-alert-circle"
                      v-if="
                        localTextRecordList?.find((x) => x.sq == source.sq) !=
                          null &&
                        localTextRecordList?.find((x) => x.sq == source.sq)
                          ?.content !=
                          recordList?.find((x) => x.sq == source.sq)?.content
                      "
                    >
                    </v-icon>
                  </template>
                </v-expansion-panel-title>
                <!-- <v-expansion-panel-text>
              <v-row no-gutters>
                <v-col cols="1" class="mt-2"></v-col>
                <v-col class="mt-2">
                  {{ recordList.find((x) => x.sq == source.sq)?.content ?? "" }}
                </v-col>
              </v-row>
            </v-expansion-panel-text> -->
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
            <affix :offset="110">
              <v-card class="mx-auto">
                <v-card-title class="text-h6 font-weight-regular">
                  Inspector
                </v-card-title>
                <v-tabs
                  v-model="inspectorTab"
                  color="secondary"
                  align-tabs="center"
                  grow
                >
                  <v-tab :value="1">Basic Info</v-tab>
                  <v-tab :value="2">History Commits</v-tab>
                  <v-tab :value="3">Comments</v-tab>
                </v-tabs>
                <v-divider />
                <v-window v-model="inspectorTab">
                  <v-window-item :value="1">
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
                        variant="outlined"
                        color="primary"
                        label="Record"
                        readonly
                      ></v-textarea>
                    </v-form>
                  </v-window-item>
                  <v-window-item :value="2"></v-window-item>
                  <v-window-item :value="3"></v-window-item>
                </v-window>

                <!-- <v-divider></v-divider> -->
                <!-- <v-card-actions>
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
            </v-card-actions> -->
              </v-card>
            </affix>
          </v-col>
        </v-row>
      </v-container>
    </v-window-item>

    <v-window-item :value="2">
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
      </v-container>
    </v-window-item>
  </v-window>

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

const unit = ref<Unit | null>(null);
const tranList = ref<Array<FullRecord>>([]);
const commitList = ref<Array<Commit>>([]);
const sourceList = ref<Array<Source>>([]);
const recordList = ref<Array<TextRecord>>([]);

const inspectorTab = ref(1);
const unitTab = ref(1);

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

      page.value = 1;
      maxPage.value = Math.ceil(sourceList.value.length / 10);
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
        recordList.value = new Array<TextRecord>();
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const addTestUnit = function () {
  moeApi.signIn("admin", "password");
  moeApi.projectAdd({ name: "诗词示例项目 2" }).then((projectId) => {
    moeApi.unitAdd(projectId, "人の世　夏目漱石 2", [
      {
        sq: 1,
        content: "山道を登りながら　こう考えた",
        meta: "",
      },
      {
        sq: 2,
        content: "地には叩けば　角が立つ",
        meta: "",
      },
      {
        sq: 3,
        content: "情に棹差せば　ながされろ",
        meta: "",
      },
      {
        sq: 4,
        content: "意地を通せば　窮屈だ",
        meta: "",
      },
      {
        sq: 5,
        content: "とにかく　人の世は住みにくい",
        meta: "",
      },
      {
        sq: 6,
        content: "山道を登りながら　こう考えた",
        meta: "",
      },
      {
        sq: 7,
        content: "地には叩けば　角が立つ",
        meta: "",
      },
      {
        sq: 8,
        content: "情に棹差せば　ながされろ",
        meta: "",
      },
      {
        sq: 9,
        content: "意地を通せば　窮屈だ",
        meta: "",
      },
      {
        sq: 10,
        content: "とにかく　人の世は住みにくい",
        meta: "",
      },
      {
        sq: 11,
        content: "山道を登りながら　こう考えた",
        meta: "",
      },
      {
        sq: 12,
        content: "地には叩けば　角が立つ",
        meta: "",
      },
      {
        sq: 13,
        content: "情に棹差せば　ながされろ",
        meta: "",
      },
      {
        sq: 14,
        content: "意地を通せば　窮屈だ",
        meta: "",
      },
      {
        sq: 15,
        content: "とにかく　人の世は住みにくい",
        meta: "",
      },
      {
        sq: 16,
        content: "山道を登りながら　こう考えた",
        meta: "",
      },
      {
        sq: 17,
        content: "地には叩けば　角が立つ",
        meta: "",
      },
      {
        sq: 18,
        content: "情に棹差せば　ながされろ",
        meta: "",
      },
      {
        sq: 19,
        content: "意地を通せば　窮屈だ",
        meta: "",
      },
      {
        sq: 20,
        content: "とにかく　人の世は住みにくい",
        meta: "",
      },
    ]);
  });
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

.selected {
  background-color: rgb(var(--v-theme-surface-light));
}

.text-box {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
