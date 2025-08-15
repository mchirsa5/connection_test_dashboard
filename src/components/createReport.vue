<template>
  <div class="pt-4 md:pt-8">
    <h2 class="text-xl font-semibold mb-4">DATA FOR CREATING REPORT</h2>
    <form @submit.prevent="handleSubmit" class="p-4 bg-white border rounded-lg shadow-md">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label for="reportname" class="font-semibold mb-2">Report Name</label>
          <Dropdown 
            id="reportname" 
            v-model="formData.reportname" 
            :options="reportNameOptions" 
            placeholder="Select a Report Specifier" 
            :loading="reportNamesLoading"
            class="w-full"
          />
        </div>

        <div class="flex flex-col">
          <label for="granularity" class="font-semibold mb-2">Granularity (in minutes)</label>
          <InputNumber inputId="granularity" v-model="formData.granularity" placeholder="e.g., 5" :min="0" showButtons />
        </div>
        <div class="flex flex-col">
          <label for="reportbackduration" class="font-semibold mb-2">Report Back Duration (in minutes)</label>
          <InputNumber inputId="reportbackduration" v-model="formData.reportbackduration" placeholder="e.g., 10" :min="0" showButtons />
        </div>
        <div class="flex flex-col">
          <label for="dtstart" class="font-semibold mb-2">Start Date & Time (dtstart)</label>
          <Calendar id="dtstart" v-model="formData.dtstart" showTime hourFormat="24" :showIcon="true" />
        </div>
        <div class="flex flex-col">
            <label for="duration" class="font-semibold mb-2">Duration (in minutes)</label>
            <InputNumber inputId="duration" v-model="formData.duration" placeholder="e.g., 90" :min="0" showButtons />
        </div>
        <div class="flex flex-col">
          <label for="areacodes" class="font-semibold mb-2">Area Codes</label>
          <Chips id="areacodes" v-model="formData.areacodes" separator="," placeholder="Enter codes separated by commas" />
        </div>
      </div>
      <div class="mt-8 flex items-center">
        <Button label="Create Report" type="submit" icon="pi pi-check" :loading="loading" />
        <p v-if="error" class="ml-4 text-red-500">{{ error }}</p>
      </div>
    </form>

    <div v-if="apiResponse" class="mt-8">
      <p class="bg-green-100 text-green-800 font-semibold p-4 rounded-lg">
        {{ apiResponse.message }}. The report ID is {{ apiResponse.id }}.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Chips from 'primevue/chips';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { store } from '../store';

const props = defineProps({
  venId: String
});

const formData = ref({
  reportname: '',
  granularity: null,
  reportbackduration: null,
  areacodes: [],
  dtstart: null,
  duration: null 
});

const loading = ref(false);
const error = ref(null);
const apiResponse = ref(null);

// Refs for the dropdown options
const reportNameOptions = ref([]);
const reportNamesLoading = ref(false);

const formatDateToLocalISO = (date) => {
    if (!date) return null;
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const payloadObject = computed(() => {
    return {
      ven_id: props.venId || null,
      reportname: formData.value.reportname,
      granularity: formData.value.granularity,
      reportbackduration: formData.value.reportbackduration,
      areacodes: formData.value.areacodes,
      dtstart: formatDateToLocalISO(formData.value.dtstart),
      duration: formData.value.duration 
    };
});

const handleSubmit = async () => {
  if (!props.venId) {
    error.value = "A VEN must be selected before creating a report.";
    return;
  }
  loading.value = true;
  error.value = null;
  apiResponse.value = null;
  try {
    const payload = payloadObject.value;
    const response = await fetch('http://localhost:3000/api/requestreport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    const responseData = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(responseData?.message || `Request failed with status ${response.status}`);
    }
    apiResponse.value = responseData;
  } catch (err) {
    error.value = err.message;
    apiResponse.value = null;
  } finally {
    loading.value = false;
  }
};

// Function to fetch report specifier IDs for the dropdown
const fetchReportSpecifiers = async (venid) => {
  if (!venid) {
    reportNameOptions.value = [];
    return;
  }
  reportNamesLoading.value = true;
  error.value = null; 
  try {
    const response = await fetch(`http://localhost:3000/api/getmetareport?venid=${venid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch report types (status: ${response.status})`);
    }
    const data = await response.json();
    
    if (data && Array.isArray(data)) {
        // Create a unique list of 'reportspecifierid's for the dropdown
        const uniqueIds = [...new Set(data.map(report => report.reportspecifierid))];
        reportNameOptions.value = uniqueIds;
    } else {
        reportNameOptions.value = [];
    }

  } catch (err) {
    console.error('Failed to fetch report specifiers:', err);
    error.value = err.message;
    reportNameOptions.value = [];
  } finally {
    reportNamesLoading.value = false;
  }
};

// Watch for changes to venId to fetch the report names
watch(() => props.venId, (newId) => {
  formData.value.reportname = ''; // Reset selection when VEN changes
  fetchReportSpecifiers(newId);
}, { immediate: true });
</script>
