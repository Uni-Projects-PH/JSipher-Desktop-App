<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import router from "@/router";
import {ref} from "vue";
import {useMainStore} from "@/stores/main";
import {i18n} from "@/plugins/i18n";

const fileIsApproved = ref(false);
const store = useMainStore();
const successfulApprovement = ref("");

function checkFileContent() {
  const fileUpload = document.getElementById("diagram-upload") as HTMLInputElement;
  const reader = new FileReader();
  reader.onload = function () {
    const xmlString = reader.result as string;
    const parser = new DOMParser();
    const xmlDOM = parser.parseFromString(xmlString, "text/xml");
    const modelTag = xmlDOM.getElementsByTagName("uml:Model")[0];

    if (!xmlDOM || !modelTag) {
      if (i18n.global.locale === 'de') {
        alert("Die Datei konnte nicht gelesen werden.");
      } else {
        alert("The file could not be read.");
      }
      return;
    }

    store.parseModel(modelTag);
    console.log(store.model);

    fileIsApproved.value = true;
    if (i18n.global.locale === 'de') {
      successfulApprovement.value = "Ihre Datei wurde erfolgreich verifiziert.";
    } else {
      successfulApprovement.value = "Your file was successfully verified.";
    }
  };

  reader.onerror = function () {
    if (i18n.global.locale === 'de') {
      alert("Die Datei konnte nicht gelesen werden.");
    } else {
      alert("The file could not be read.");
    }
    return;
  };

  const file = fileUpload.files ? fileUpload.files[0] : null;
  if (!file) {
    if (i18n.global.locale === 'de') {
      alert("Es wurde keine Datei ausgewählt.");
    } else {
      alert("No file was selected.");
    }
    return;
  }

  reader.readAsText(file);
}

function checkForVerification() {
  if (!fileIsApproved.value) {
    if (i18n.global.locale === 'de') {
      alert("Bitte verifizieren Sie Ihre Datei mittels 'Datei überprüfen' zunächst.");
    } else {
      alert("Please verify your file first by using 'Verify file'.");
    }
    return;
  }
  router.push('/select-diagrams');
}
</script>

<template>
  <div class="site-wrapper">
    <div class="headline-box">
      <h1 class="headliner">{{$t('lang.headline')}}</h1>
      <h2 class="sub-headliner">- {{$t('lang.subtitle')}} -</h2>
    </div>
    <div class="approval-wrapper">
      <div class="p-approval-holder" v-if="fileIsApproved">
        <p class="successful-approvement">{{successfulApprovement}}</p>
      </div>
    </div>
    <article class="section-container upload-container">
      <h2 class="upload-title">
        {{$t('lang.upload-here')}}
      </h2>
      <input type="file"
             id="diagram-upload" name="uploadedDiagram"
             accept=".xmi, .uml">
      <p>
        {{$t('lang.upload-info')}}
      </p>
      <div class="process-btn-holder">
        <button class="back-btn" @click="router.back()">{{$t('lang.back-btn')}}</button>
        <button class="test-btn" @click="checkFileContent()">{{$t('lang.test-btn')}}</button>
        <button class="next-btn" @click="checkForVerification()">{{$t('lang.next-btn')}}</button>
      </div>
    </article>

    <Footer />
  </div>
</template>

<style scoped lang="scss">
  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 10rem;

    .upload-title {
      text-decoration: underline;
      text-underline-offset: 0.5rem;
    }

    input {
      margin-top: 2rem;
      font-size: 0.8rem;
      padding: 0.2rem;
      border: #f2f2f2 1px solid;
      border-radius: 5px;
      cursor: pointer;
    }

    .process-btn-holder {
      display: flex;
      width: 100%;
      justify-content: center;

      .test-btn {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        background: #deb002;
        color: #000000;
      }

      .next-btn {
        margin-left: 0.5rem;
        background: #07a80c;
        color: #000000;
      }
    }
  }

  .approval-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;

    .p-approval-holder {
      border: #07a80c 3px solid;
      border-radius: 15px;
      padding-left: 0.6rem;
      padding-right: 0.6rem;

      p {
        font-size: 1.4rem;
        color: #07a80c;
      }
    }

  }

</style>