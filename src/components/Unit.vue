<template>
  <loading-overlay v-model="loading" />
  <v-app-bar density="compact">
    <v-btn icon @click="$router.back()"><v-icon :icon="mdiArrowLeft" /></v-btn>
    <v-breadcrumbs :items="[unit?.title ?? '[[ unit.title ]]']"></v-breadcrumbs>

    <v-spacer></v-spacer>

    <lang-menu></lang-menu>
    <theme-button></theme-button>

    <v-btn icon :active="drawer" @click="drawer = !drawer">
      <v-icon :icon="mdiDockRight" />
    </v-btn>
  </v-app-bar>

  <v-sheet class="h-100 d-flex flex-column">
    <v-navigation-drawer rail permanent>
      <div class="d-flex flex-column align-center">
        <v-dialog max-width="800" class="font-serif">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" variant="text">
              <v-icon :icon="mdiHistory" />
            </v-btn>
          </template>

          <template v-slot:default="{ isActive }">
            <commit-log v-if="unit" :id="unit.id" :is-active="isActive.value" />
            <div v-if="!unit"></div>
          </template>
        </v-dialog>

        <v-btn
          icon
          @click="commit"
          :disabled="!user.id"
          :title="t('submit')"
          variant="text"
        >
          <v-icon :icon="mdiCloudUpload" />
        </v-btn>

        <v-btn icon variant="text"><v-icon :icon="mdiLock" /></v-btn>

        <v-divider />

        <v-btn
          icon
          @click="upload"
          :disabled="uploadFile.length == 0"
          :title="t('uploadFile')"
          variant="text"
        >
          <v-icon :icon="mdiUpload" />
        </v-btn>

        <v-btn icon @click="download" :title="t('downloadFile')" variant="text">
          <v-icon :icon="mdiDownload" />
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-progress-linear
      :model-value="
        ((selected ? selected.index : 0) / (pairs.length - 1)) * 100
      "
    ></v-progress-linear>

    <v-container class="fill-height py-0 overflow-hidden d-flex" fluid>
      <v-row class="fill-height">
        <v-col class="fill-height">
          <v-toolbar density="compact" rounded>
            <v-text-field
              hide-details
              :prepend-icon="mdiMagnify"
              single-line
              variant="outlined"
              density="compact"
              class="ml-4 font-serif"
            ></v-text-field>

            <v-btn
              icon
              @click="select(pairs.length > 0 ? pairs[0] : null)"
              :disabled="!selected || selected?.index == 0"
              :title="t('firstRecord')"
            >
              <v-icon :icon="mdiPageFirst" />
            </v-btn>

            <v-btn
              icon
              @click="selectPrev"
              :disabled="!selected || selected?.index == 0"
              :title="t('prevRecord')"
            >
              <v-icon :icon="mdiChevronLeft" />
            </v-btn>

            <v-btn
              icon
              @click="selectNext"
              :disabled="!selected || selected?.index == pairs.length - 1"
              :title="t('nextRecord')"
            >
              <v-icon :icon="mdiChevronRight" />
            </v-btn>

            <v-btn
              icon
              @click="select(pairs[pairs.length - 1])"
              :disabled="!selected || selected?.index == pairs.length - 1"
              :title="t('lastRecord')"
            >
              <v-icon :icon="mdiPageLast" />
            </v-btn>
          </v-toolbar>

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

        <v-divider vertical />

        <v-col cols="3" class="pt-4">
          <v-file-input
            density="compact"
            variant="outlined"
            :label="t('uploadFile')"
            accept=".xlsx"
            class="font-serif"
            rounded="0"
            show-size
            v-model="uploadFile"
          ></v-file-input>

          <v-row>
            <v-col cols="5">
              <v-text-field
                variant="outlined"
                color="primary"
                :label="t('sq')"
                class="font-serif"
                readonly
                :model-value="selected?.sq"
              ></v-text-field>
            </v-col>
            <v-col cols="7">
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

        <v-divider vertical />

        <v-col cols="3" class="fill-height" v-show="drawer">
          <v-card
            class="fill-height mx-auto d-flex flex-column font-serif"
            variant="outlined"
          >
            <v-card-item>
              <v-card-title class="font-weight-medium">{{
                t("issues")
              }}</v-card-title>
            </v-card-item>

            <v-divider />

            <v-list item-props lines="two" class="overflow-y-auto">
              <template
                v-for="issue in Array.from({ length: 20 }, () => [
                  {
                    id: '[[ issue.id ]]',
                    title: '[[ issue.title ]]',
                  },
                ]).flat()"
              >
                <v-list-item :title="issue.title" :subtitle="issue.id" v-ripple>
                  <template v-slot:prepend>
                    <v-avatar color="warning">
                      <v-icon color="white " :icon="mdiClipboardText" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { onKeyStroke } from "@vueuse/core";
import { utils, read, writeFile } from "xlsx";

import moeApi from "@/domain/services/moe";
import { TextPair, TextRecord, Unit, makeTextPair } from "@/domain/models/moe";
import { useAppStore } from "@/store/app";
import { useUserStore } from "@/store/user";
import {
  mdiArrowLeft,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClipboardText,
  mdiCloudUpload,
  mdiDockRight,
  mdiDownload,
  mdiHistory,
  mdiLock,
  mdiMagnify,
  mdiPageFirst,
  mdiPageLast,
  mdiUpload,
} from "@mdi/js";

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
const user = useUserStore();

const props = defineProps<{
  id: string;
}>();

const unit = ref<Unit | null>(null);
const pairs = ref<PairItem[]>([]);
const uploadFile = ref<File[]>([]);

const loading = ref(true);
const selected = ref<PairItem | null>(null);
const drawer = ref(true);

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
              ({ sq, source, target }, index) =>
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
      submitOk: "Changes have been submitted to the server",
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
