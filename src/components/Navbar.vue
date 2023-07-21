<script setup lang="ts">
import {langVal, toggleLanguage, xmiConverterIsShown} from "@/plugins/i18n";
import {togglePopup} from "@/logic/popup-control";
import {useMainStore} from "@/stores/main";
import {ref} from "vue";
import router from "@/router";
const store = useMainStore();


</script>

<template>
  <div class="navbar-top">
    <div class="navbar-items">
      <p v-if="langVal === true" @click="toggleLanguage()">English</p>
      <p v-else @click="toggleLanguage()">Deutsch</p>
      <p class="navbar-divider"> | </p>
      <p v-if="xmiConverterIsShown" @click="store.$reset(); router.push('/jack-transformator')">{{$t('lang.navbar-jack-transformator')}}</p>
      <p v-else @click="store.$reset(); router.push('/')">{{$t('lang.navbar-xmi-transformator')}}</p>
      <p class="navbar-divider"> | </p>
      <p @click="togglePopup">{{$t('lang.navbar-help')}}</p>
      <p class="navbar-divider"> | </p>
      <router-link to="/" class="home-link" @click="store.$reset()" title="Hiermit kehren Sie nicht nur zur Startseite zurück, sondern setzen auch alle Daten zurück">{{$t('lang.navbar-home')}}</router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">

.navbar-top {
  background: rgba(35, 34, 34, 1);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  .navbar-items {
    display: flex;
    cursor: pointer;
    float: right;
    padding: 1rem;
    color: #f2f2f2;
    text-align: center;
    text-decoration: none;
    font-size: 1.5rem;
    justify-content: space-between;
    margin-left: 2rem;
    margin-right: 0.8rem;

    .navbar-divider {
      margin-left: 1.8rem;
      margin-right: 1.8rem;
      cursor: default;
    }
  }

  .home-link {
    text-decoration: none;
    color: #f2f2f2;
    display: inline-block;
    margin: auto;
  }
}

</style>