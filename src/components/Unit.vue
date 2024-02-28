<template>
  <loading-overlay v-model="loading" />
  <v-navigation-drawer v-model="unitInfoDrawer" location="right" width="400">
    <v-card class="mx-auto pb-2" variant="tonal" color="primary" rounded="0">
      <v-card-text>
        <p class="font-serif text-disabled">
          {{ unit?.id ?? "[unit.id]" }}
        </p>
        <p class="text-h4 text--primary font-serif font-weight-medium mb-4">
          {{ unit?.title ?? "[ unit.title ]" }}
        </p>
        <p class="font-serif">{{ "Sample Description of Unit" }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" color="warning">{{ t("lock") }}</v-btn>
        <v-btn variant="outlined" color="success">{{ t("submit") }}</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mx-auto mt-1 font-serif" variant="flat" rounded="0">
      <v-card-item>
        <v-card-title class="font-weight-medium">{{
          t("issues")
        }}</v-card-title>
      </v-card-item>
      <v-divider />
      <v-list item-props lines="two" height="300" style="overflow-y: auto">
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

    <v-footer class="footer font-serif">
      <v-row justify="space-around" no-gutters class="my-2">
        <v-menu location="top">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-icon>mdi-translate</v-icon>
            </v-btn>
          </template>

          <v-list nav>
            <template v-for="locale in availableLocales" :key="locale">
              <v-list-item
                :title="
                  t('lang', locale, {
                    locale,
                  })
                "
                @click="
                  $i18n.locale = locale;
                  toggleLang(locale);
                "
                :active="$i18n.locale == locale"
                density="compact"
              ></v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-btn icon @click="toggleTheme()">
          <v-icon v-if="theme.global.name.value == 'light'">
            mdi-weather-sunny
          </v-icon>
          <v-icon v-if="theme.global.name.value == 'dark'">
            mdi-weather-night
          </v-icon>
        </v-btn>
      </v-row>
    </v-footer>
  </v-navigation-drawer>

  <v-sheet class="h-100 d-flex flex-column">
    <v-toolbar density="compact">
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        class="ml-4 font-serif"
      ></v-text-field>

      <v-spacer />

      <v-btn icon>
        <v-icon>mdi-download</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-upload</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-page-first</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-page-last</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>

      <v-btn icon @click="unitInfoDrawer = !unitInfoDrawer">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container class="fill-height py-0 overflow-hidden d-flex" fluid>
      <v-row class="fill-height">
        <v-col cols="8" class="fill-height">
          <v-sheet class="text-view h-100 d-flex flex-column">
            <v-virtual-scroll ref="view" :items="pairs ?? []" class="py-2">
              <template v-slot:default="{ item }">
                <v-row
                  class="text mx-0 mb-2"
                  v-ripple
                  :class="{
                    selected: item.active,
                  }"
                  @click="() => select(item)"
                >
                  <v-col cols="6">
                    <a class="font-serif-jp">{{ item.source }}</a>
                  </v-col>
                  <v-col cols="6">
                    <a class="font-serif-sc">{{ item.target }}</a>
                  </v-col>
                </v-row>
              </template>
            </v-virtual-scroll>
          </v-sheet>
        </v-col>
        <v-col cols="4" class="pt-4">
          <v-row>
            <v-col cols="3">
              <v-text-field
                variant="outlined"
                color="primary"
                :label="t('sq')"
                class="font-serif"
                readonly
                :model-value="selected?.sq"
              ></v-text-field>
            </v-col>
            <v-col cols="9">
              <v-text-field
                variant="outlined"
                color="primary"
                :label="t('context')"
                class="font-serif"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>

          <v-textarea
            class="font-serif-jp"
            variant="outlined"
            color="primary"
            :label="t('source')"
            rows="3"
            readonly
            :model-value="selected?.source"
          ></v-textarea>

          <v-textarea
            class="font-serif-sc"
            variant="outlined"
            color="primary"
            :label="t('record')"
            rows="6"
            counter
            :readonly="!selected"
            :model-value="selected?.target"
            @update:model-value="
              (value) => {
                if (selected) {
                  selected.target = value;
                }
              }
            "
            @keydown.enter.prevent="
              () => {
                if (selected && selected.index + 1 < pairs.length) {
                  select(pairs[selected.index + 1]);
                } else {
                  select(null);
                }
              }
            "
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, watchEffect, nextTick } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useI18n } from "vue-i18n";
import { VVirtualScroll } from "vuetify/lib/components/index.mjs";

import moeApi from "@/domain/services/moe";
import { TextPair, Unit, makeTextPair } from "@/domain/models/moe";
import { useAppStore } from "@/store/app";

import { useTheme } from "vuetify";

class PairItem extends TextPair {
  target: string;
  active: boolean;

  constructor(
    public index: number,
    pair: TextPair,
  ) {
    super(pair.sq, pair.meta, pair.source, pair.record);
    this.target = pair.record;
    this.active = false;
  }
}

const app = useAppStore();
const theme = useTheme();

const props = defineProps<{
  id: string;
}>();

const unit = ref<Unit | null>(null);
const pairs = ref<PairItem[]>([]);

const loading = ref(true);
const selected = ref<PairItem | null>(null);
const unitInfoDrawer = ref(false);

const view = ref<VVirtualScroll | null>(null);

watch(
  () => props.id,
  (id) => {
    loading.value = true;

    moeApi.unitById(id).then((unit_) => {
      unit.value = unit_;
      moeApi.unitSourceList(id).then(async (sourceList) => {
        let pairList_: TextPair[] = [];
        if (unit_.commitId) {
          const recordList = await moeApi.commitRecordList(unit_.commitId);
          pairList_ = makeTextPair(sourceList, recordList);
        } else {
          pairList_ = makeTextPair(sourceList);
        }
        pairs.value = pairList_.map((pair, index) => new PairItem(index, pair));

        loading.value = false;
      });
    });
  },
  { immediate: true },
);

const select = (item: PairItem | null) => {
  if (selected.value) {
    selected.value.active = false;
  }
  selected.value = item;
  if (item) {
    item.active = true;
  }
};

const toggleTheme = () => {
  localStorage.theme = localStorage.theme == "dark" ? "light" : "dark";
  theme.global.name.value = localStorage.theme;
};

const toggleLang = (lang: string) => {
  localStorage.lang = lang;
};

const { t, locale, availableLocales } = useI18n({
  messages: {
    en: {
      sq: "Seq. No.",
      context: "Context",
      source: "Source",
      record: "Translated",
      issues: "Issues",
      lock: "Lock",
      submit: "Submit",
      lang: "English",
    },
    zhHans: {
      sq: "序号",
      context: "环境",
      source: "原文",
      record: "译文",
      issues: "问题",
      lock: "锁定",
      submit: "提交",
      lang: "简体中文",
    },
  },
});

onMounted(async () => {
  theme.global.name.value = localStorage.theme
    ? localStorage.theme
    : matchMedia("(prefers-color-scheme:dark)").matches
      ? "dark"
      : "light";

  let l: string = localStorage.lang ? localStorage.lang : navigator.language;
  if (l.startsWith("zh")) {
    locale.value = localStorage.lang = "zhHans";
  } else if (l.startsWith("en")) {
    locale.value = localStorage.lang = "en";
  }
});
</script>

<style scoped>
.text-view {
  background: rgb(var(--v-theme-surface-dark));
}

.text {
  overflow-wrap: break-word;
  font-family: serif;
  line-height: 1.2em;
}

.text:hover .v-col {
  background-color: rgb(var(--v-theme-surface-light));
}

.selected {
  background-color: rgb(var(--v-theme-surface-light));
  overflow-wrap: break-word;
  font-family: serif;
}

.font-serif {
  font-family: serif, "Noto Serif JP", "Noto Serif SC";
}

.font-serif-jp {
  font-family: serif, "Noto Serif JP";
}

.font-serif-sc {
  font-family: serif, "Noto Serif SC";
}

.footer {
  background-color: rgb(var(--v-theme-surface-light));
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
