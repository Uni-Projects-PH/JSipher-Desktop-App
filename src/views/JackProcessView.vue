<script setup lang="ts">

import router from "@/router";
import Footer from "@/components/Footer.vue";
import {i18n} from "@/plugins/i18n";
import {ref} from "vue";

const fileIsOK = ref(false);
const successfulApprovement = ref("");

function generateMultiplicityForJack3(xmlFileString: string): void {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlFileString, 'application/xml');

    const modelElement = xmlDoc.querySelector('uml\\:Model');
    if (modelElement) {
      modelElement.setAttribute('xmi:version', '2.1');
      modelElement.setAttribute('xmlns:xmi', 'http://www.omg.org/spec/XMI/20131001');
    }

    const elementsToProcess = xmlDoc.querySelectorAll('ownedAttribute, ownedEnd');

    elementsToProcess.forEach((element) => {
      const xmiType = element.getAttribute('xmi:type');

      if (xmiType === 'uml:Property') {
        const lowerValueElement = element.querySelector('lowerValue');
        const upperValueElement = element.querySelector('upperValue');

        if (lowerValueElement) {
          if (!lowerValueElement.getAttribute('value')) {
            lowerValueElement.setAttribute('value', '0');
          }
        } else {
          const newLowerValueElement = xmlDoc.createElement('lowerValue');
          newLowerValueElement.setAttribute('xmi:type', 'uml:LiteralInteger');
          newLowerValueElement.setAttribute('value', '1');
          element.appendChild(newLowerValueElement);
        }

        if (upperValueElement) {
          if (!upperValueElement.getAttribute('value')) {
            upperValueElement.setAttribute('value', '1');
          }
        } else {
          const newUpperValueElement = xmlDoc.createElement('upperValue');
          newUpperValueElement.setAttribute('xmi:type', 'uml:LiteralInteger');
          newUpperValueElement.setAttribute('value', '1');
          element.appendChild(newUpperValueElement);
        }
      } else if (xmiType === 'uml:Association') {
        return
      } else {
        console.error('Unbekannter Typ:', xmiType);
      }
    });

    // Format XML
    const tab = '  ';
    const formattedXmlString = new XMLSerializer().serializeToString(xmlDoc);
    const formatted = formattedXmlString
        .split('\n')
        .map((line) => {
          if (line.match(/<\/?.+>/)) {
            return line;
          }
          return tab + line;
        })
        .join('\n');

    const updatedXmlBlob = new Blob([formatted], { type: 'text/xml' });

    const url = URL.createObjectURL(updatedXmlBlob);
    const link = document.createElement('a');
    link.download = 'JACK3-kompatibles_Diagramm.uml';
    link.href = url;
    link.click();
    link.remove();

    console.log('XML-Datei erfolgreich aktualisiert.');

  } catch (error) {
    console.error('Fehler beim Aktualisieren der XML-Datei:', error);
  }
}

function adjustXMIData() {
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
    }

    generateMultiplicityForJack3(xmlString);
  };

  reader.onerror = function () {
    if (i18n.global.locale === 'de') {
      alert("Die Datei konnte nicht gelesen werden.");
    } else {
      alert("The file could not be read.");
    }
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
</script>

<template>
  <div class="site-wrapper">
    <div class="headline-box">
      <h1 class="headliner">{{$t('lang.headline')}}</h1>
      <h2 class="sub-headliner">- {{$t('lang.jack-subtitle')}} -</h2>
    </div>
    <div class="approval-wrapper">
      <div class="p-approval-holder" v-if="fileIsOK">
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
        <button class="next-btn" @click="adjustXMIData()">{{$t('lang.jack-next-btn')}}</button>
      </div>
    </article>

    <Footer/>
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