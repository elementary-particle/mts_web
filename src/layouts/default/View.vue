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
</style>
