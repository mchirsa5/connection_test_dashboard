<script setup>
import primeVueStepper from '../components/primeVueStepper.vue';
import auth from '../services/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-gray-50">
    <div class="relative flex w-full h-auto bg-yellow-300 items-center justify-center shadow-md px-8">
      <h1 class="text-2xl font-bold tracking-wider pt-3 pb-3">
        DRCC CONNECTION TEST
      </h1>
      <button 
        @click="handleLogout" 
        class="absolute right-8 bg-white text-red-700 font-semibold py-2 px-5 rounded-full hover:bg-red-100 transition-colors duration-300 shadow-sm flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
        </svg>
        <span>Logout</span>
      </button>

    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex items-start justify-center mt-6">
      <primeVueStepper />
    </div>
    
  </div>
</template>
