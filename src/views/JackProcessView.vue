<script setup lang="ts">

import router from "@/router";
import Footer from "@/components/Footer.vue";
import {i18n} from "@/plugins/i18n";
import {ref} from "vue";
import {formatXmi} from "@/logic/xmi-formatter";

const fileIsOK = ref(false);
const successfulApprovement = ref("");

function processAssociationsForMultiplicities(xmiDocument: Document) {
  const packagedElements = xmiDocument.querySelectorAll('packagedElement');
  const packagedElementsList = Array.from(packagedElements);
  const ownedAttributeIdToTypeMapping = new Map<string, string>();

  packagedElementsList.forEach(x => {
    const ownedAttributes = x.querySelectorAll('ownedAttribute');
    ownedAttributes.forEach(y => {
      const id = y.getAttribute('xmi:id');
      const type = y.getAttribute('type');
      ownedAttributeIdToTypeMapping.set(id, type);
    });
  });

  console.log("Gefundene Assoziationen:", packagedElements.length); // Neu

  // Iteriere über jede gefundene Assoziation
  packagedElements.forEach((e) => {
    const association = e.getAttribute('xmi:type');

    if (association === 'uml:Association') {
      console.log("Verarbeite Assoziation:", e);
      // Finde die beiden Klassen, die durch die Assoziation verbunden sind
      const ownedEnds = e.querySelectorAll('ownedEnd');

      let class1OwnedEnd, class2OwnedEnd, classId1, classId2, class1, class2, clazz;

      if (ownedEnds.length === 1) {
        class1OwnedEnd = ownedEnds[0];
        classId1 = class1OwnedEnd.getAttribute('type');
        class1 = packagedElementsList.find(x => x.getAttribute('xmi:id') === classId1);

        // Extrahiere die IDs aus dem memberEnd Attribut
        const memberEndAttr = e.getAttribute('memberEnd');
        if (memberEndAttr) {
          const otherId = memberEndAttr.replace(class1OwnedEnd.getAttribute("xmi:id"), "").trim();
          const classId = ownedAttributeIdToTypeMapping.get(otherId);
          clazz = packagedElementsList.find(x => x.getAttribute('xmi:id') === classId);
          console.log("Gefundene Klasse:", clazz);
          console.log("Class 1:", class1);
          console.log("Class 1 Owned End:", class1OwnedEnd);
        }

      } else if (ownedEnds.length === 2) {
        class1OwnedEnd = ownedEnds[0];
        class2OwnedEnd = ownedEnds[1];

        classId1 = class1OwnedEnd.getAttribute('type');
        classId2 = class2OwnedEnd.getAttribute('type');

        class1 = packagedElementsList.find(x => x.getAttribute('xmi:id') === classId1);
        class2 = packagedElementsList.find(x => x.getAttribute('xmi:id') === classId2);

      } else {
        console.error('Unbekannte Anzahl an ownedEnds:', ownedEnds.length);
      }

      console.log(class1);
      console.log(class2);


      /*const class1OwnedEnd = ownedEnds[0];
      const class2OwnedEnd = ownedEnds[1];

      // Ermittle die IDs der verbundenen Klassen
      const classId1 = class1OwnedEnd.getAttribute('type');
      const classId2 = class2OwnedEnd.getAttribute('type');

      console.log(classId1, classId2);

      // Finde die Klassen im Dokument
      const class1 = packagedElementsList.filter(x => x.getAttribute('xmi:id') === classId1)[0];
      const class2 = packagedElementsList.filter(x => x.getAttribute('xmi:id') === classId2)[0];

      console.log(class1);
      console.log(class2);*/

      if (class1 && class2) {
        class1.innerHTML += class2OwnedEnd.outerHTML.replace(/ownedEnd/g, 'ownedAttribute');
        class2.innerHTML += class1OwnedEnd.outerHTML.replace(/ownedEnd/g, 'ownedAttribute');
      } else if (class1) {
        clazz.innerHTML += class1OwnedEnd.outerHTML.replace(/ownedEnd/g, 'ownedAttribute');
      } else if (class2) {
        class1.innerHTML += class2OwnedEnd.outerHTML.replace(/ownedEnd/g, 'ownedAttribute');
      }
    }
  });

  const serializer = new XMLSerializer();
  const modifiedXmiString = serializer.serializeToString(xmiDocument);
  console.log("Modifiziertes XMI:", modifiedXmiString); // Neu
  console.log(xmiDocument);

  generateMultiplicityForJack3(modifiedXmiString);
}


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
      } else {
        console.error('Unbekannter Typ:', xmiType);
      }
    });

    const allElements = xmlDoc.querySelectorAll('*');
    allElements.forEach((element) => {
      if (element !== modelElement) {
        element.removeAttribute('xmlns:xmi');
      }
    });

    // Format XML
    const unformattedXmlString = new XMLSerializer().serializeToString(xmlDoc);
    const formattedXmlString = formatXmi(unformattedXmlString);

    const updatedXmlBlob = new Blob([formattedXmlString], { type: 'text/xml' });

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

    processAssociationsForMultiplicities(xmlDOM);
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