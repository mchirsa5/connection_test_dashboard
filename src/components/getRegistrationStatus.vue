<template>
  <div class="pt-4 md:pt-8">
    <h2 class="text-xl font-semibold mb-4">REGISTRATION STATUS</h2>

    <div class="flex flex-col justify-center space-y-6">
      <AutoComplete
        v-model="selectedVenId"
        dropdown
        :suggestions="suggestions"
        @complete="searchVen"
        placeholder="Select a VEN"
        class="w-full md:w-1/2"
      />

      <div v-if="venData" class="w-full p-4 bg-white border rounded-lg shadow-md">
        <div class="space-y-2">
          <p><strong>VEN Name:</strong> {{ venData.venname }}</p>
          <p><strong>VEN ID:</strong> {{ venData.venid }}</p>
          <p><strong>Registration ID:</strong> {{ venData.registrationid }}</p>
          <p><strong>Profile Name:</strong> {{ venData.profilename }}</p>
          <p><strong>Transport Name:</strong> {{ venData.transportname }}</p>
          <p><strong>Pull mode:</strong> {{ venData.httppullmodel }}</p>
          <p><strong>Poll Frequency:</strong> {{ venData.requestedoadrpollfreq }}</p>
          <p><strong>Report Only:</strong> {{ venData.reportonly }}</p>
          <p><strong>XML Signature:</strong> {{ venData.xmlsignature }}</p>
          <p><strong>Registration State:</strong> <span :class="stateClass(venData.registrationstate)">{{ venData.registrationstate }}</span></p>
          <p><strong>Report State:</strong> <span :class="stateClass(venData.reportstate)">{{ venData.reportstate }}</span></p>
        </div>
      </div>

      <div v-if="error" class="mt-4 text-lg font-medium text-red-500">
        Error: {{ error }}
      </div>
    </div>

    <h2 class="text-xl font-semibold mt-12 mb-4">TOGGLE THE VEN REGISTRATION STATES</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Button label="Open Registration" icon="pi pi-check-circle" @click="toggleState('openvenregistration')" />
      <Button label="Close Registration" severity="danger" icon="pi pi-times-circle" @click="toggleState('closevenregistration')" />
    </div>
    <h2 class="text-xl font-semibold mt-6 mb-4">TOGGLE THE REPORT REGISTRATION STATES</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Button label="Open Reporting" icon="pi pi-check-circle" @click="toggleState('openreportregistration')" />
      <Button label="Close Reporting" severity="danger" icon="pi pi-times-circle" @click="toggleState('closereportregistration')" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import { store } from '../store';

const props = defineProps({
  venId: String
});
const emit = defineEmits(['update:venId']);

const defaultVenId = 'EGAT_VEN0008';
const selectedVenId = ref(props.venId || defaultVenId);
const suggestions = ref([]);
const venData = ref(null);
const error = ref(null);
const availableVenIds = ref(['EGAT_VEN0008', 'EGAT_VEN0009']);

/**
 * Fetches the detailed data for a given VEN ID from the API.
 */
const fetchVenData = async (venid) => {
  if (!venid) {
    venData.value = null;
    return;
  }
  error.value = null;
  venData.value = null;

  
try {
    const response = await fetch(`http://localhost:3000/api/getvendata?venid=${venid}`);
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }
    const data = await response.json();
    venData.value = data[0] || null;
    store.venData = venData.value;
  } catch (err) {
    error.value = err.message;
    console.error('Failed to fetch VEN data:', err);
  }
};

/**
 * Emits the default VEN ID if none is provided.
 */
onMounted(() => {
  if (!props.venId) {
    emit('update:venId', defaultVenId);
  }
});

/**
 * Watch for changes in selected VEN ID and fetch data.
 */
watch(selectedVenId, (newVal) => {
  emit('update:venId', newVal);
  fetchVenData(newVal);
}, { immediate: true });

/**
 * Calls a POST endpoint to toggle a state and refreshes the data on success.
 */
const toggleState = async (endpoint) => {
  if (!selectedVenId.value) {
    error.value = 'Please select a VEN first.';
    return;
  }
  error.value = null;

  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}?venid=${selectedVenId.value}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }

    await fetchVenData(selectedVenId.value);
  } catch (err) {
    error.value = err.message;
    console.error(`Error calling ${endpoint}:`, err);
  }
};

/**
 * Filters available VEN IDs for the AutoComplete component.
 */
const searchVen = (event) => {
  suggestions.value = availableVenIds.value.filter(id =>
    id.toLowerCase().includes(event.query.toLowerCase())
  );
};

/**
 * Returns a Tailwind CSS class based on the state string for visual feedback.
 */
const stateClass = (state) => {
  if (typeof state !== 'string') return '';
  return state.includes('open') ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
};
</script>


<style>
body {
  background-color: #f8fafc;
}
</style>