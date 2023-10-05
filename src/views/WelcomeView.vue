<script setup lang="ts">
import router from "@/router";
import {RouterView} from "vue-router";
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";
import {xmiConverterIsShown} from "@/plugins/i18n";

onMounted(() => {
  if (!xmiConverterIsShown.value) {
    xmiConverterIsShown.value = true;
  }
});

</script>

<template>
  <div class="site-wrapper">
    <div class="headline-box">
      <h1 class="headliner">{{$t('lang.headline')}}</h1>
      <h2 class="sub-headliner">- {{$t('lang.subtitle')}} -</h2>
    </div>
    <div class="div-body">
    <p class="info-box">
      {{$t('lang.first-paragraph')}}<br><br>{{$t('lang.second-paragraph')}}<br><strong>{{$t('lang.third-paragraph')}}</strong><br>{{$t('lang.fourth-paragraph')}}
    </p>
    </div>
    <div class="bottom-wrapper">
      <button class="start-button" @click="router.push('/conversion-process')">{{$t('lang.start-button')}}</button>
    </div>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
  .bottom-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 150%;
    padding-bottom: 10rem;
  }
</style>