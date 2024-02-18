<template>
  
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import { onMounted } from "vue";
  import { useI18n } from "vue-i18n";

  import { Project } from "@/domain/models/moe";
  import moeApi from "@/domain/services/moe";

  const { t } = useI18n();

  const projectList = ref<Array<Project>>([]);

  onMounted(() => {
    moeApi.projectList().then((list) => {
      projectList.value = list;
    });
  });
</script>

<script lang="ts">
  export default {
    name: 'ProjectList',
    data() {
      return {
        projectPage: 0
      }
    },
  }
</script>