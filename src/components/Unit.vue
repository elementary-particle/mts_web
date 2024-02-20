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

    <v-row class="mt-2">
      <v-col cols="8">
        <v-table>
          <thead>
            <tr>
              <th class="text-left" width="120">Sq</th>
              <th class="text-left">Source</th>
            </tr>
          </thead>
        </v-table>
        <v-expansion-panels v-model="expansion">
          <v-expansion-panel
            v-for="source in viewUnitSourceList"
            :key="source.sq"
          >
            <v-expansion-panel-title @click="updateSelection(source.sq)">
              <v-row no-gutters>
                <v-col cols="2" class="d-flex justify-start">
                  {{ source.sq }}
                </v-col>
                <v-col cols="10" class="text--secondary">
                  {{ source.content }}
                </v-col>
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
                  icon="mdi-check"
                  v-if="
                    localTextRecordList.find((x) => x.sq == source.sq) !=
                      null &&
                    localTextRecordList.find((x) => x.sq == source.sq)
                      ?.content ==
                      textRecordList.find((x) => x.sq == source.sq)?.content
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
                      textRecordList.find((x) => x.sq == source.sq)?.content
                  "
                >
                </v-icon>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row no-gutters>
                <v-col cols="2"></v-col>
                <v-col class="mt-2">
                  {{ textRecordList[source.sq - 1]?.content ?? "" }}
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
      <v-col cols="4">
        <v-card class="mx-auto">
          <v-card-title class="text-h6 font-weight-regular">
            Editor
          </v-card-title>
          <v-spacer></v-spacer>
          <v-form ref="form" class="pa-4 pt-6">
            <v-text-field
              variant="filled"
              color="primary"
              label="Sq"
              :model-value="selection"
              readonly
            ></v-text-field>
            <v-textarea
              :model-value="currentSource?.content ?? ''"
              variant="filled"
              color="primary"
              label="Source"
              auto-grow
              readonly
            ></v-textarea>
            <v-textarea
              v-model="currentRecord"
              auto-grow
              :readonly="selection == null"
              variant="filled"
              color="primary"
              label="Record"
            ></v-textarea>
          </v-form>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn
              variant="text"
              @click="updateSelection(selection + 1)"
              :disabled="selection >= unitSourceList.length"
            >
              Next
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveAndNext()"> Save & Next </v-btn>
          </v-card-actions>
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
import { ref, watch, onMounted } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import moeApi from "@/domain/services/moe";
import { Commit, Source, TextRecord } from "@/domain/models/moe";
import { useAppStore } from "@/store/app";

const route = useRoute();
const app = useAppStore();

const commitList = ref<Array<Commit>>([]);
const unitSourceList = ref<Array<Source>>([]);
const textRecordList = ref<Array<TextRecord>>([]);

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

const updateView = async (unitId: string | string[]) => {
  try {
    commitList.value = await moeApi.commitList(unitId as string);
    unitSourceList.value = await moeApi.unitSourceList(unitId as string);
    textRecordList.value =
      (await moeApi.commitRecordList(commitList.value[0]?.id)) ??
      new Array<TextRecord>(unitSourceList.value.length);
  } catch (e) {
    console.log(e);
  }
  localTextRecordList.value = JSON.parse(JSON.stringify(textRecordList.value));

  page.value = 1;
  maxPage.value = Math.ceil(unitSourceList.value.length / 10);
  updateTable();
};

const updateTable = function () {
  viewUnitSourceList.value = unitSourceList.value.slice(
    (page.value - 1) * 10,
    page.value * 10,
  );

  selection.value = viewUnitSourceList.value[expansion.value]?.sq;
};

const updateSelection = function (id: number) {
  if (id > unitSourceList.value.length || id <= 0) return;
  page.value = Math.ceil(id / 10);

  selection.value = id;
  expansion.value = (id - 1) % 10;

  currentSource.value = unitSourceList.value.find(
    (x) => x.sq == selection.value,
  );
  currentRecord.value =
    localTextRecordList.value.find((x) => x.sq == selection.value)?.content ??
    "";
};

const saveAndNext = function () {
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
    `${localTextRecordList.value.find((x) => x.sq == selection.value)?.content}, ${textRecordList.value.find((x) => x.sq == selection.value)?.content}`,
  );

  isEdited.value = true;
  updateSelection(selection.value + 1);
};

const beforeUnloadHandler = function (e: any) {
  if (isEdited.value) e.returnValue = "Exit?";
};

watch(() => route.params.id, updateView);
watch(() => page.value, updateTable);
onMounted(async () => await updateView(route.params.id));
onMounted(() =>
  window.addEventListener("beforeunload", beforeUnloadHandler, false),
);
onBeforeRouteLeave((to, from, next) => {
  if (isEdited.value) {
    let isSave = confirm("Changes you made may not be saved.");
    if (isSave) next(true);
    else next(false);
  } else next(true);
});
</script>

<style>
.intro {
  padding-top: 3%;
  padding-bottom: 2%;
}

.info {
  padding-top: 48px;
}
</style>
