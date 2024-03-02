<template>
  <v-main>
    <router-view />
  </v-main>
</template>

<script lang="ts">
export default {
  name: "DefaultView",
};
</script>
<style>
.toolbar {
  position: fixed;
  bottom: 90px;
  right: 50px;
  max-height: 0px;
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
</style>
