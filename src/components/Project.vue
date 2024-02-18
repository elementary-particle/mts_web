<template>
  <v-container>
    <v-row class="intro">
      <v-col :cols="1">
        <v-avatar color="surface-variant" :size="66"></v-avatar>
      </v-col>
      <v-col cols="7">
        <h3 class="text-h5 mb-4">
          {{ project?.name ?? 'Project Name' }}
        </h3>
        <h5 class="subheading">
          {{ project?.id ?? 'Project Id' }}
        </h5>
      </v-col>
      <v-col>
        <v-row align="center" align-self="center" justify="space-around" style="text-align: end;">
          <v-col><v-btn variant="outlined" v-if="account.isLoggedIn">Join this project</v-btn></v-col>
          <v-col><v-btn variant="outlined">More Info</v-btn></v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" grow>
      <v-tab value="1">Info</v-tab>
      <v-tab value="2">Units</v-tab>
      <v-tab value="3">Contributors</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-window v-model="tab">
      <v-window-item value="1">
        <v-row class="info">
          <v-col cols="6">
            <v-card>
              <v-card-item>
                <v-card-title>Introduction</v-card-title>
              </v-card-item>
              <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque at arcu cursus, ultrices dui a, egestas leo. Quisque sem erat, efficitur vitae nibh eu, pharetra porttitor neque. Curabitur et urna nec erat tristique viverra et quis leo. Nunc non ipsum interdum, scelerisque sapien vel, iaculis massa. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean interdum mi eu nunc rutrum, sed eleifend arcu iaculis. Nullam dui nisl, vehicula et interdum sed, pharetra at leo. Aliquam bibendum dui finibus, eleifend diam in, mollis leo. In libero turpis, vulputate nec gravida et, sollicitudin ut massa. Integer et erat est. Mauris cursus lobortis ante, ut tincidunt nisl lobortis id. In at sapien dapibus ligula malesuada interdum ut sit amet erat. Vestibulum a accumsan tortor.
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-item>
                <v-card-title>Requirement</v-card-title>
              </v-card-item>
              <v-card-text>
                Sed at imperdiet tellus. Pellentesque vitae lacus sed augue rutrum ornare in a nulla. Nam risus mauris, mollis vitae felis sit amet, pretium sodales mauris. Integer tempor lacus nunc, sit amet condimentum diam gravida vel. Ut sodales tristique ante, in placerat nibh tincidunt et. Donec in lorem eget felis posuere porta eu et neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit.              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-row class="">
              <v-col cols="4"><h5>Translation Progress</h5></v-col>
              <v-col>
                <v-progress-linear model-value="80" color="light-green" height="20" striped>
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
            <v-row class="">
              <v-col cols="4"><h5>Proofreading Progress</h5></v-col>
              <v-col>
                <v-progress-linear model-value="10" color="cyan" height="20" striped>
                  <template v-slot:default="{ value }">
                    <strong>{{ Math.ceil(value) }}%</strong>
                  </template>
                </v-progress-linear>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item value="2">
        <v-data-iterator :items="unitList" :page="unitPage" :items-per-page="2">
          <template v-slot:default="{ items }">
            <v-row class="unit">
              <v-col cols="6" v-for="item in items">
                <v-card hover>
                  <v-card-item>
                    <v-card-title>{{ item.raw.title }}</v-card-title>
                    <v-card-subtitle>{{ item.raw.id }}</v-card-subtitle>
                  </v-card-item>
                  <v-card-text>
                    Sample Text in Unit
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="$router.push(`/unit/${item.raw.id}`)" variant="outlined">{{ t("detailsText") }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            
          </template>
          <template v-slot:footer="{ pageCount }">
            <v-pagination :length="pageCount" v-model="unitPage"></v-pagination>
          </template>
        </v-data-iterator>
      </v-window-item>
      <v-window-item value="3">
        Contributors
      </v-window-item>
    </v-window>

    
  </v-container>

  <div class="toolbar">
    <v-row>
      <v-col><v-btn icon="mdi-arrow-left" size="large" @click="$router.go(-1)"></v-btn></v-col>
      <v-col><v-btn icon="mdi-home" size="large" @click="$router.push('/')"></v-btn></v-col>
    </v-row>
  </div>

</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { useI18n } from "vue-i18n";

  import { Unit , Project } from "@/domain/models/moe";
  import moeApi from "@/domain/services/moe";

  import { overlay , account } from "@/layouts/default/View.vue";

  const route = useRoute();
  const { t } = useI18n();

  const project = ref<Project>();
  const unitList = ref<Array<Unit>>([]);

  const updateView = async (projectId: string | string[]) => {
    overlay.callUp();
    unitList.value = await moeApi.unitList(projectId as string);
    project.value = (await moeApi.projectList()).find(x => x.id == projectId);

    overlay.callDown();
  };

  watch(() => route.params.id, updateView);
  onMounted(async () => {
    await updateView(route.params.id);
  });
</script>

<script lang="ts">
  export default {
    name: 'Project',
    data() {
      return {
        unitPage: 1,
        tab: 0,
        account: account
      }
    },
  }
</script>

<style>
  .intro {
    padding-top: 3%;
    padding-bottom: 2%;
  }

  .info {
    padding-top: 48px;
  }

  .unit {
    padding-top: 3%;
    padding-bottom: 3%;
  }
</style>