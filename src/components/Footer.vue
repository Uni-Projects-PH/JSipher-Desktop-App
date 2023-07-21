<script setup lang="ts">

</script>

<template>
  <footer class="footer">
    <p class="footer-text">
      {{$t('lang.footer')}}
    </p>
    <a href="https://www.flaticon.com/free-icons/change" title="Icons & Symbols">{{$t('lang.footer-legal')}}</a>
  </footer>
</template>

<style scoped lang="scss">

.footer {
  font-size: 1.2rem;
  text-align: center;
  margin-top: auto;
  line-height: 1.4;
  bottom: 0;
  width: 100%;

  a {
    color: rgb(190, 190, 190);
    text-decoration: none;
    font-style: italic;
  }
}

</style>