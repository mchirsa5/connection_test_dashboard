<template>
  <div class="pt-4 md:pt-8">
    <h2 class="text-xl font-semibold mb-4">META DATA</h2>

    <div v-if="loading" class="text-center">
      <p>Loading Report Data...</p>
    </div>

    <div v-else-if="error" class="text-red-500 text-center">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else-if="venData.length > 0">
      <div v-for="report in venData" :key="report.id" class="w-full p-4 mb-4 bg-white border rounded-lg shadow-md">
        <div class="space-y-2">
          <p><strong>Report Specifier ID:</strong> {{ report.reportspecifierid }}</p>
          <p><strong>Report Name:</strong> {{ report.reportname }}</p>
          <p><strong>Duration:</strong> {{ report.duration }}</p>
          <p><strong>Registered Time:</strong> {{ formatDate(report.registedtime) }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500">
      <p>No reports found for this VEN.</p>
    </div>
  </div>
</template>

<script setup>
import { store } from '../store';
import { ref, watch } from 'vue';

const props = defineProps({
  venId: {
    type: String,
    required: true,
  },
});

const venData = ref([]);
const loading = ref(false);
const error = ref(null);

// --- NEW FUNCTION ---
/**
 * Formats an ISO date string to 'YYYY-MM-DD HH:MM:SS' in the Thailand timezone.
 * @param {string} dateString - The ISO date string to format.
 * @returns {string} The formatted date string or an empty string if input is invalid.
 */
const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    
    // Using toLocaleString with the 'sv-SE' locale is a convenient way 
    // to get the YYYY-MM-DD format. We combine it with the Thailand timezone.
    const options = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Use 24-hour format
    };
    
    const formattedDate = new Intl.DateTimeFormat('sv-SE', options).format(date);
    
    return formattedDate.replace(',', '');
  } catch (e) {
    console.error("Failed to format date:", e);
    return dateString;
  }
};


const fetchVenData = async (venid) => {
  if (!venid) {
    venData.value = [];
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    const response = await fetch(`http://localhost:3000/api/getmetareport?venid=${venid}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }
    const data = await response.json();
    venData.value = data || []; 
    store.venData = venData.value; 
  } catch (err) {
    error.value = err.message;
    console.error('Failed to fetch VEN data:', err);
  } finally {
    loading.value = false;
  }
};

watch(() => props.venId, (newId) => {
  fetchVenData(newId);
}, { immediate: true });
</script>
