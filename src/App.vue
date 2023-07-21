<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from "@/components/Navbar.vue";
import HelpPopup from "@/components/HelpPopup.vue";
import {onMounted} from "vue";
import {toggleLanguage} from "@/plugins/i18n";

onMounted(() => {
  const language = (navigator.language || navigator.languages[0]).substring(0, 2);

  if (language === 'de') {
    toggleLanguage();
  }
})
</script>

<template>
  <div id="app">
    <HelpPopup />
    <Navbar />
    <RouterView />
  </div>
</template>

<style>

</style>
