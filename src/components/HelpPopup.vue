<script setup lang="ts">
import {closePopup, popupIsActivated} from "@/logic/popup-control";

</script>

<template>
  <div class="pop-background" v-if="popupIsActivated">
    <div class="help-box-popup" v-if="popupIsActivated">
      <h1 class="help-box-h1">{{$t('lang.help-title')}}</h1>
      <p class="help-box-p">{{$t('lang.help-text')}}</p>
      <p class="help-box-p">{{$t('lang.help-link-intel')}}</p>
      <a class="help-box-a" href="https://ilias.th-koeln.de/goto.php?target=root_1&client_id=ILIAS_FH_Koeln" title="ST1-Forum">{{$t('lang.help-link-st1')}}</a>
      <a class="help-box-a" href="https://ilias.th-koeln.de/goto.php?target=root_1&client_id=ILIAS_FH_Koeln" title="MAS-Forum">{{$t('lang.help-link-mas')}}</a>
      <button class="close-helpbox" @click="closePopup">{{$t('lang.help-close')}}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.pop-background {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background: hsla(200, 100%, 0%, .4);
  backdrop-filter: blur(11px);

  .help-box-popup {
    position: absolute;
    z-index: 1000;
    width: 50%;
    background: rgba(40, 39, 39, 1);
    border-radius: 10px;
    outline: 2px solid rgb(190, 190, 190);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    box-shadow: 0 0 4px 18px rgba(0, 0, 0, 0.4);

    .help-box-p {
      font-size: 1.4rem;
      margin: 1rem;
    }

    .help-box-h1 {
      font-size: 2.8rem;
      margin: 1rem;
    }

    .help-box-a {
      font-size: 1.4rem;
      margin: 1rem;
      color: #f2f2f2;
      text-decoration: underline;
      display: block;
    }

    .close-helpbox {
      font-size: 0.9rem;
      color: #f2f2f2;
      background: #91031f;
      border-radius: 5px;
      border:1px solid #000201;
      padding: 0.4rem;
      font-weight: lighter;
      box-shadow: 0 7px 4px rgba(0, 0, 0, 0.25);
      display: block;
      margin: 2.1rem auto 1.4rem;
      transition: 0.3s ease-in-out;
    }
  }
}
</style>


