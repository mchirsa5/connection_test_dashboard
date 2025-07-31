
<template>
  <div class="flex flex-col items-center justify-center">
    <AutoComplete v-model="value" dropdown :suggestions="items" @complete="search" />
    <Button label="Get updated status" @click="getStatus" class="mb-4" />

    <div v-if="status" class="text-lg font-medium text-green-700">
      Status: {{ status }}
    </div>

    <div v-if="error" class="text-lg font-medium text-red-600">
      Error: {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import AutoComplete from 'primevue/autocomplete';

// Dropdown list
const VEN8 = 'EGAT_VEN0008'
const VEN9 = 'EGAT_VEN0009'

const value = ref(VEN8)
const items = ref([VEN8, VEN9])

const search = (event) => {
  const baseItems = [VEN8, VEN9].filter(item =>
    item.toLowerCase().includes(event.query.toLowerCase())
  )
  items.value = baseItems
}

// Fecth API to get registration status

const status = ref(null)
const error = ref(null)

const getStatus = async () => {
  status.value = null
  error.value = null

try {
    const response = await fetch(`https://your-backend.com/api/venstatus?venid=${value.value}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    status.value = data.status || 'No status found'
  } catch (err) {
    error.value = err.message
  }
}

</script>