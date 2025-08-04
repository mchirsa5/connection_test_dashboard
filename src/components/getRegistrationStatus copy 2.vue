<template>
  <p class="font-semibold mt-10">REGISTRATION STATUS</p>
  <div class="flex flex-col items-center justify-center">
    
  <AutoComplete
    v-model="value"
    dropdown
    :suggestions="items"
    @complete="search"
    :optionLabel="getLabel"
    :optionTemplate="customTemplate"
  />

    <div v-if="venData" class="mt-4 p-4 bg-white border rounded shadow">
      <p><strong>VEN Name:</strong> {{ venData.venname }}</p>
      <p><strong>VEN ID:</strong> {{ venData.venid }}</p>
      <p><strong>Registration ID:</strong> {{ venData.registrationid }}</p>
      <p><strong>Registration State:</strong> {{ venData.registrationstate }}</p>
      <p><strong>Report State:</strong> {{ venData.reportstate }}</p>
    </div>

    <div v-if="error" class="mt-4 text-lg font-medium text-red-600">
      Error: {{ error }}
    </div>
  </div>

  <p class="font-semibold mt-10">TOGGLE THE STATES</p>
  <div class="flex pt-6 justify-between flex-wrap gap-2">
    <Button label="Open Registration State" icon="pi pi-arrow-right" @click="callApi('openvenregistration', 'registrationstate', 'Open for VEN registration')" />
    <Button label="Open Report State" icon="pi pi-arrow-right" @click="callApi('openreportregistration', 'reportstate', 'Open for report registration')" />
    <Button label="Close Registration State" icon="pi pi-arrow-right" @click="callApi('closevenregistration', 'registrationstate', 'Close for VEN registration')" />
    <Button label="Close Report State" icon="pi pi-arrow-right" @click="callApi('closereportregistration', 'reportstate', 'Close for report registration')" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'

const emit = defineEmits(['update:venid'])

const VEN8 = 'EGAT_VEN0008'
const VEN9 = 'EGAT_VEN0009'

const value = ref(VEN8)
const items = ref([VEN8, VEN9])
const apiUrl = ref('')
const venData = ref(null)
const error = ref(null)

// Emit on value change
watch(value, (newVal) => {
  emit('update:venid', newVal)
})

// Search filter for dropdown
const search = (event) => {
  const baseItems = [VEN8, VEN9].filter(item =>
    item.toLowerCase().includes(event.query.toLowerCase())
  )
  items.value = baseItems
}

// Fetch VEN data
const fetchVenData = async (venid) => {
  apiUrl.value = `http://localhost:3000/api/getvendata?venid=${venid}`
  venData.value = null
  error.value = null

  try {
    const response = await fetch(apiUrl.value)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    const item = data[0]
    venData.value = {
      venname: item.venname,
      venid: item.venid,
      registrationid: item.registrationid,
      registrationstate: item.registrationstate,
      reportstate: item.reportstate
    }
  } catch (err) {
    error.value = err.message
  }
}

// Initial fetch
watch(value, (newValue) => {
  if (newValue) fetchVenData(newValue)
}, { immediate: true })

// POST API function and update state
const callApi = async (endpoint, fieldToUpdate, newState) => {
  if (!value.value) return

  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}?venid=${value.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    // Update the local state directly
    if (venData.value) {
      venData.value[fieldToUpdate] = newState
    }
  } catch (err) {
    console.error(`Error calling ${endpoint}:`, err)
  }
}

// Function to determine label based on registration/report state
const getLabel = (item) => {
  if (!item || typeof item !== 'object') return item

  const reg = item.registrationstate === 'openregist' ? 'Open for VEN registration' : 'Close for VEN registration'
  const rep = item.reportstate === 'openregist' ? 'Open for Report registration' : 'Close for Report registration'

//   if (reg === 'closeregist' && rep === 'closeregist') {
//     return 'Close for report registration'
//   } else if (reg === 'openregist' && rep === 'openregist') {
//     return 'Open for report registration'
//   } else {
//     return 'Error'
//   }
 }

// Optional: Custom template for dropdown items
const customTemplate = (item) => {
  return getLabel(item)
}

items.value = [
  {
    venid: 'EGAT_VEN0008',
    registrationstate: 'closeregist',
    reportstate: 'closeregist'
  },
  {
    venid: 'EGAT_VEN0009',
    registrationstate: 'openregist',
    reportstate: 'openregist'
  }
]

</script>
