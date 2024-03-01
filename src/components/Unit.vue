<template>
  <loading-overlay v-model="loading" />
  <v-navigation-drawer v-model="drawer" location="right" width="400">
    <v-card class="mx-auto pb-2" variant="tonal" color="primary" rounded="0">
      <v-card-text>
        <p class="font-serif text-disabled">
          {{ unit?.id ?? "[unit.id]" }}
        </p>
        <p class="text-h4 text--primary font-serif font-weight-medium mb-4">
          {{ unit?.title ?? "[ unit.title ]" }}
        </p>
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
        <lang-menu></lang-menu>
        <theme-button></theme-button>
      </v-row>
    </v-footer>
  </v-navigation-drawer>

  <v-sheet class="h-100 d-flex flex-column">
    <v-toolbar>
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
        variant="outlined"
        rounded="0"
        density="compact"
        class="ml-4 font-serif"
      ></v-text-field>

      <v-spacer />

      <v-file-input
        density="compact"
        variant="outlined"
        :label="t('uploadFile')"
        accept=".xlsx"
        class="pt-5 font-serif"
        rounded="0"
        show-size
        v-model="uploadFile"
      ></v-file-input>

      <v-btn
        icon
        @click="upload"
        :disabled="uploadFile.length == 0"
        :title="'Import Xlsx'"
        ><v-icon>mdi-upload</v-icon></v-btn
      >

      <v-btn icon @click="download" :title="'Export Xlsx'"
        ><v-icon>mdi-download</v-icon></v-btn
      >

      <v-btn
        icon
        @click="select(pairs[0])"
        :disabled="!selected || selected?.index == 0"
        :title="'Turn to first line'"
      >
        <v-icon>mdi-page-first</v-icon>
      </v-btn>

      <v-btn
        icon
        @click="selectPrev"
        :disabled="!selected || selected?.index == 0"
        :title="'Turn previous'"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-btn
        icon
        @click="selectNext"
        :disabled="!selected || selected?.index == pairs.length - 1"
        :title="'Turn next'"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-btn
        icon
        @click="select(pairs[pairs.length - 1])"
        :disabled="!selected || selected?.index == pairs.length - 1"
        :title="'Turn to last line'"
      >
        <v-icon>mdi-page-last</v-icon>
      </v-btn>

      <v-btn icon @click="commit" :disabled="!app.userId" :title="'Submit'">
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>

      <v-btn icon @click="drawer = !drawer">
        <v-icon v-if="!drawer">mdi-cog</v-icon>
        <v-icon v-if="drawer">mdi-chevron-double-right</v-icon>
      </v-btn>
    </v-toolbar>

    <v-container class="fill-height py-0 overflow-hidden d-flex" fluid>
      <v-row class="fill-height">
        <v-col cols="8" class="fill-height">
          <v-sheet
            class="text-view h-100 d-flex flex-column"
            @wheel="
              (e) => {
                if (e.deltaY > 0) {
                  selectNext();
                } else if (e.deltaY < 0) {
                  selectPrev();
                }
              }
            "
          >
            <list-scroll ref="view" :items="pairs ?? []" class="py-2">
              <template v-slot:default="{ item }">
                <v-row
                  class="text mx-0 mb-3"
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
            </list-scroll>
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
            auto-grow
            readonly
            :model-value="selected?.source"
          ></v-textarea>

          <v-textarea
            class="font-serif-sc"
            variant="outlined"
            color="primary"
            :label="t('record')"
            rows="6"
            auto-grow
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
            @keydown.enter.prevent="selectNext"
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/store/app";
import { useTheme } from "vuetify";
import { onKeyStroke } from "@vueuse/core";
import { utils, read, writeFile } from "xlsx";

import moeApi from "@/domain/services/moe";
import { TextPair, TextRecord, Unit, makeTextPair } from "@/domain/models/moe";
import ListScroll from "./ListScroll.vue";

class PairItem {
  context: string;
  target: string;
  active: boolean;

  constructor(
    readonly sq: number,
    readonly source: string,
    record: string,
    public index: number,
  ) {
    this.context = "";
    this.target = record;
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
const uploadFile = ref<File[]>([]);

const loading = ref(true);
const selected = ref<PairItem | null>(null);
const drawer = ref(false);

const view = ref<any>(null);

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
        pairs.value = pairList_.map(
          ({ sq, source, record }, index) =>
            new PairItem(sq, source, record, index),
        );

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
    view.value?.makeVisible(item.index);
  }
};

const selectPrev = () => {
  if (selected.value && selected.value.index - 1 >= 0) {
    select(pairs.value[selected.value.index - 1]);
  }
  if (!selected.value && pairs.value) select(pairs.value[0]);
};

const selectNext = () => {
  if (selected.value && selected.value.index + 1 < pairs.value.length) {
    select(pairs.value[selected.value.index + 1]);
  }
  if (!selected.value && pairs.value) select(pairs.value[0]);
};

const commit = async () => {
  loading.value = true;
  if (unit.value && unit.value.id && pairs.value) {
    await moeApi
      .commitAdd(
        unit.value.id,
        pairs.value.map(({ sq, target }) => new TextRecord(sq, target)),
      )
      .then(() => {
        app.snackbar(t("submitOk"), { color: "success" });
        loading.value = false;
      });
  }
};

const download = () => {
  if (unit.value && pairs.value) {
    const book = utils.book_new();
    const columnWidths = [6, 20, 50, 50].map((width) => ({ wch: width }));

    const sheet = utils.json_to_sheet(
      pairs.value.map(({ sq, context, source, target }) => ({
        sq,
        context,
        source,
        target,
      })),
      {
        header: ["sq", "context", "source", "target"],
      },
    );
    sheet["!cols"] = columnWidths;

    const unitId = unit.value.id!.slice(0, 8);

    utils.book_append_sheet(book, sheet, unitId);
    writeFile(book, unit.value.title + ".xlsx");
  }
};

const upload = () => {
  if (unit.value && uploadFile.value.length > 0) {
    const reader = new FileReader();
    const unitId = unit.value.id!.slice(0, 8);
    reader.onload = (e) => {
      if (e.target) {
        const book = read(e.target.result);
        if (book.Sheets[unitId]) {
          pairs.value = utils
            .sheet_to_json<{
              sq: number;
              context: string;
              source: string;
              target: string;
            }>(book.Sheets[unitId], { defval: "" })
            .map(
              ({ sq, context, source, target }, index) =>
                new PairItem(sq, source, target, index),
            );
        }
      }
    };
    reader.readAsArrayBuffer(uploadFile.value[0]);

    app.snackbar(t("uploadOk"), { color: "success" });
    uploadFile.value.length = 0;
  }
};

onKeyStroke(["ArrowUp"], selectPrev);
onKeyStroke(["ArrowDown"], selectNext);

const { t } = useI18n({
  messages: {
    en: {
      sq: "Seq. No.",
      context: "Context",
      source: "Source",
      record: "Translated",
      issues: "Issues",
      lock: "Lock",
      submit: "Submit",
      uploadFile: "Upload File",
      uploadOk: "Uploaded file has been imported",
      sumbitOk: "Changes have been submitted to the server",
    },
    zhHans: {
      sq: "序号",
      context: "环境",
      source: "原文",
      record: "译文",
      issues: "问题",
      lock: "锁定",
      submit: "提交",
      uploadFile: "上传文件",
      uploadOk: "成功导入上传的文件",
      submitOk: "修改已上传到服务器",
    },
  },
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
  background-color: rgb(var(--v-theme-surface-light), 0.4);
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
