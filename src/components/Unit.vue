<template>
  <v-container>
    <v-row class="intro">
      <v-col :cols="1">
        <v-avatar color="surface-variant" :size="80"></v-avatar>
      </v-col>
      <v-col cols="6">
        <h1 class="text-h4 mb-4">
          {{ "[unit.name]" }}
        </h1>
        <h4 class="subheading">
          {{ "[unit.id]" }}
        </h4>
      </v-col>
      <v-col style="text-align: right">
        <v-btn variant="outlined">Commit Changes</v-btn>
        <v-btn variant="outlined">More Info</v-btn>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-table>
            <thead>
              <tr>
                <th class="text-left" width="100">Sq</th>
                <th class="text-left" width="300">Source</th>
                <th class="text-left">Record</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="source in unitSourceList" :key="source.sq">
                <td>{{ source.sq }}</td>
                <td>{{ source.content }}</td>
                <td>
                  <v-text-field
                    variant="plain"
                    :model-value="
                      textRecordList.find((x) => x.sq == source.sq)?.content ??
                      ''
                    "
                  ></v-text-field>
                </td>
              </tr>
            </tbody>
          </v-table>
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
import { useRoute } from "vue-router";

import moeApi from "@/domain/services/moe";
import { Commit, Source, TextRecord } from "@/domain/models/moe";

const route = useRoute();

const commitList = ref<Array<Commit>>([]);
const unitSourceList = ref<Array<Source>>([]);
const textRecordList = ref<Array<TextRecord>>([]);

const updateView = async (unitId: string | string[]) => {
  commitList.value = await moeApi.commitList(unitId as string);
  unitSourceList.value = await moeApi.unitSourceList(unitId as string);
  textRecordList.value =
    (await moeApi.commitRecordList(commitList.value[0]?.id)) ?? [];
};

watch(() => route.params.id, updateView);
onMounted(async () => await updateView(route.params.id));
</script>
