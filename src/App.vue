<script setup>
import primeVueStepper from './components/primeVueStepper.vue'
</script>

<template>
  <div class="flex flex-col w-screen h-screen">
    <div class="flex w-full h-[4rem] bg-yellow-300 items-center justify-center">
      <h1 class="text-3xl font-bold">CONNECTION TEST</h1>
    </div>
    <div class="flex-1 flex items-start justify-center mt-6">
      <primeVueStepper />
    </div>
  </div>
</template>
