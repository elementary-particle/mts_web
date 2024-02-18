<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import moeApi from "@/domain/services/moe";
import { TextRecord } from "./domain/models/moe";

moeApi.projectList().then((projectList) => {
  if (projectList.length == 0) {
    moeApi.signIn("admin", "password");
    moeApi.projectAdd({ name: "诗词示例项目" }).then((projectId) => {
      moeApi
        .unitAdd(projectId, "人の世　夏目漱石", [
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
        ])
        .then((unitId) => {
          const recordList: Array<TextRecord> = [
            {
              sq: 1,
              content: "我独自沿山路攀岩，不禁浮想联翩。",
            },
            {
              sq: 2,
              content: "做人如若过于理智，难免有欠缺圆滑。",
            },
            {
              sq: 3,
              content: "假若率性而为，又难免过于放荡。",
            },
            {
              sq: 4,
              content: "尚若意气用事，则会到处碰壁。",
            },
            {
              sq: 5,
              content: "总而言之，人世难居。",
            },
          ];
          moeApi.commitAdd(unitId, recordList).then((_) =>
            moeApi.commitAdd(unitId, recordList).then((_) =>
              moeApi.commitAdd(unitId, recordList).then((commitId) => {
                moeApi.unitList(projectId).then((unitList) => {
                  let hasCommit = false;
                  unitList.forEach((unit) => {
                    if (unit.id == unitId) {
                      console.assert(unit.commitId == commitId);
                      hasCommit = true;
                    }
                  });
                  console.assert(hasCommit);
                });
              })
            )
          );
        });
      moeApi.unitAdd(projectId, "堀口大學", [
        {
          sq: 1,
          content: "雨の日は雨を愛そう。",
          meta: "",
        },
        {
          sq: 2,
          content: "風の日は風を好もう。",
          meta: "",
        },
        {
          sq: 3,
          content: "晴れた日は散歩をしよう。",
          meta: "",
        },
        {
          sq: 4,
          content: "貧しくば心に富もう。",
          meta: "",
        },
      ]);
    });
  }
});
</script>
