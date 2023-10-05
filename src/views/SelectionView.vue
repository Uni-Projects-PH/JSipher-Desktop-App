<script setup lang="ts">
import {Package} from "@/@types/model";
import Footer from "@/components/Footer.vue";
import TreeView from "@/components/TreeView.vue";
import router from "@/router";
import {useMainStore} from "@/stores/main";
import {provide, ref} from "vue";
import {toKeaModel} from "@/uml-handler/kea-transfomer";

const store = useMainStore();
const selectedPackage = ref<String>("");
const packageIsSelected = ref<Boolean>(false);
const downloadableJSONFile = ref();

function selectPackage(pkg: Package) {
  selectedPackage.value = pkg.name;
  packageIsSelected.value = true;
  const kea = toKeaModel(pkg.children);
  console.log(kea);
  downloadableJSONFile.value = JSON.stringify(kea);
}

function getDownloadableJSON() {

  // download json as file
  const element = document.createElement("a");
  const file = new Blob([downloadableJSONFile.value], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = "diagramm_fuer_kea-mod.json";
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();

  element.remove();

}

provide("selectPackage", selectPackage);
</script>

<template>
  <div class="site-wrapper">
    <div class="headline-box">
      <h1 class="headliner">{{$t('lang.headline')}}</h1>
      <h2 class="sub-headliner">- {{$t('lang.subtitle')}} -</h2>
    </div>
    <h2 class="select-title">
      {{$t('lang.select-here')}}
    </h2>
    <div class="diagram-selection">
      <TreeView :model="store.model"/>
    </div>
    <div class="selected-pkg-msg" v-if="packageIsSelected">
      <p>{{$t('lang.selected-pkg-msg')}} <i>{{selectedPackage}}</i></p>
    </div>
    <div class="selection-btn-holder">
      <button class="back-btn btn-in-holder" @click="router.back()">{{$t('lang.back-btn')}}</button>
      <button class="download-btn btn-in-holder" v-if="packageIsSelected" @click="getDownloadableJSON()">{{$t('lang.download-btn')}}</button>
    </div>
    <Footer />
  </div>
</template>

<style scoped lang="scss">
  .diagram-selection {
    border: #f2f2f2 3px solid;
    border-radius: 15px;
    min-height: 10rem;
    min-width: 50rem;
    margin-bottom: 0.7rem;
  }

  .select-title {
    text-decoration: underline;
    text-underline-offset: 0.5rem;
  }

  .selected-pkg-msg {
    display: flex;
    justify-content: center;
    border: #ffc700 3px solid;
    border-radius: 15px;
    padding-left: 0.6rem;
    padding-right: 0.6rem;

    p {
      color: #ffc700;
      font-size: 1.4rem;
    }
  }

  .selection-btn-holder {
    margin-top: 0.7rem;
    display: flex;
    justify-content: center;
    border: #f2f2f2 3px solid;
    border-radius: 15px;

    .btn-in-holder {
      margin: 0.5rem;
    }

    .download-btn {
      margin-left: 0.5rem;
      background: #07a80c;
      color: #000000;
    }
  }

</style>