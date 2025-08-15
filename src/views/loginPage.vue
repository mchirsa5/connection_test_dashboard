<template>
  <div 
    class="bg-container min-h-screen flex items-center justify-center bg-cover bg-center relative" 
    :style="{ backgroundImage: `url(${bgLoginImage})` }"
  >
    <div class="bg-white rounded-lg shadow-lg flex w-full max-w-4xl overflow-hidden relative">
      <div class="w-1/2 p-10 text-white bg-gradient-to-b from-purple-700 to-orange-500 flex flex-col justify-center">
        <h2 class="text-3xl font-bold mb-4">DRCC Connection Testing</h2>
        <p class="text-sm">
          This platform has been developed by EGAT to support and validate communication protocols between the Demand Response Control Centre (DRCC) and Load Aggregators (LAs).
        </p>
      </div>
      <div class="w-1/2 p-10">
        <h2 class="text-2xl text-purple-700 mb-6 text-center">USER LOGIN</h2>
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-violet-600 size-5 ml-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </span>
            <input
              type="text"
              v-model="username"
              placeholder="Username"
              class="w-full pl-12 pr-4 py-2 rounded-full bg-violet-200 text-violet-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="text-violet-600 size-5 ml-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </span>
            <input
              type="password"
              v-model="password"
              placeholder="Password"
              class="w-full pl-12 pr-4 py-2 rounded-full bg-violet-200 text-violet-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>
          <div class="flex justify-center pt-4">
            <button type="submit" class="w-auto bg-gradient-to-l from-purple-700 to-violet-400 text-white py-2 px-10 rounded-full hover:from-purple-900 hover:to-violet-500 transition-all duration-300">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import auth from '../services/auth';
import bgLoginImage from '../image/bgLogin.jpg';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    await auth.login(username.value, password.value);
    router.push('/testconnection');
  } catch (error) {
    console.error('Login failed:', error);
    errorMessage.value = error.message || 'Invalid username or password.';
  }
};
</script>

<style scoped>
.bg-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
