<template>
  <div class="flex flex-col items-center justify-center">
    <AutoComplete v-model="value" dropdown :suggestions="items" @complete="search" />
    
    <div v-if="apiUrl" class="mt-4 p-2 bg-gray-100 border rounded">
      <p class="text-sm text-gray-700">Current API Endpoint:</p>
      <code class="text-blue-600">{{ apiUrl }}</code>
    </div>

    <div v-if="status" class="mt-4 text-lg font-medium text-green-700">
      Status: {{ status }}
    </div>

    <div v-if="error" class="mt-4 text-lg font-medium text-red-600">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete';

// Dropdown list
const VEN8 = 'EGAT_VEN0008'
const VEN9 = 'EGAT_VEN0009'

const value = ref(VEN8)
const items = ref([VEN8, VEN9])
const apiUrl = ref('')
const status = ref(null)
const error = ref(null)

const search = (event) => {
  const baseItems = [VEN8, VEN9].filter(item =>
    item.toLowerCase().includes(event.query.toLowerCase())
  )
  items.value = baseItems
}

// Watch for changes in the selected value and update the API URL and fetch status
watch(value, async (newValue) => {
  if (!newValue) {
    apiUrl.value = ''
    status.value = null
    error.value = null
    return
  }

  apiUrl.value = `http://localhost:3000/api/getvendata?venid=${newValue}`
  status.value = null
  error.value = null

  try {
    const response = await fetch(apiUrl.value)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    status.value = data.status || 'No status found'
  } catch (err) {
    error.value = err.message
  }
}, { immediate: true })

</script>