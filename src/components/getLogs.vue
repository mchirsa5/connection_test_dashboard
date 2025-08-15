<template>
  <div>
    <h2 class="text-xl font-semibold mt-10 mb-4">LOGS INFO</h2>
    <AutoComplete
      v-model="selectNumRows"
      dropdown
      :suggestions="suggestions"
      @complete="searchNumRows"
      placeholder="Select number of rows"
      class="w-full md:w-1/2"
    />
    <div class="mt-4">
      <p class="text-sm text-gray-600">
        <strong>API URL:</strong> <span>{{ apiUrl }}</span>
      </p>
    </div>
    <div v-if="loading" class="mt-4">
      <p>Loading...</p>
    </div>
    <div v-else-if="error" class="mt-4 text-red-500">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else-if="filteredLogs.length" class="mt-4">
      <h3 class="text-lg font-semibold mb-2">Last Responses</h3>

      <div v-for="(log, index) in filteredLogs" :key="index" class="bg-gray-100 p-4 rounded-lg mb-4">
        <p><strong>Response Time:</strong> {{ log.reqdatetime }}</p>
        <p><strong>Request Type:</strong> {{ log.reqtype }}</p>
        <p><strong>Request Content:</strong></p>
        <pre class="bg-white p-2 rounded text-sm overflow-y-auto whitespace-pre-wrap" style="max-height: 250px;">{{ formatXml(log.reqcontent) }}</pre>
        <p><strong>Response Time:</strong> {{ log.resdatetime }}</p>
        <p><strong>Response Type:</strong> {{ log.restype }}</p>
        <p><strong>Response Content:</strong></p>
        <pre class="bg-white p-2 rounded text-sm overflow-y-auto whitespace-pre-wrap" style="max-height: 250px;">{{ formatXml(log.rescontent) }}</pre>
      </div>
    </div>
    <div v-else class="mt-4">
      <p v-if="props.filterParameters.length > 0 && logs.length > 0">
        No log related to this process
      </p>
      <p v-else>
        No logs to display.
      </p>
    </div>
  </div>
</template>

<script setup>
import { store } from '../store';
import { ref, watch, onMounted, computed } from 'vue';
import AutoComplete from 'primevue/autocomplete';

const props = defineProps({
  venId: {
    type: String,
    required: true,
  },
  filterParameters: {
    type: Array,
    default: () => [],
  },
});

const selectNumRows = ref('1');
const availableNumRows = ref(['1', '10', '20', '30', '40', '50', '60']);
const suggestions = ref([]);
const logs = ref([]);
const loading = ref(false);
const error = ref(null);

const apiUrl = computed(() => {
  return props.venId
    ? `http://localhost:3000/api/getlastresponse?venid=${props.venId}&numrows=${selectNumRows.value}`
    : '';
});

const filteredLogs = computed(() => {
  if (!props.filterParameters || props.filterParameters.length === 0) {
    return logs.value;
  }
  
  const filterSet = new Set(props.filterParameters.map(p => p.toLowerCase().trim()));

  return logs.value.filter(log => {
    const reqType = (log.reqtype || '').toLowerCase().trim();
    const resType = (log.restype || '').toLowerCase().trim();
    return filterSet.has(reqType) || filterSet.has(resType);
  });
});


const searchNumRows = (event) => {
  suggestions.value = availableNumRows.value.filter(id =>
    id.toLowerCase().includes(event.query.toLowerCase())
  );
};

const fetchLogs = async () => {
  if (!props.venId) {
    logs.value = [];
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(apiUrl.value);
    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }
    const data = await response.json();
    logs.value = data; 
  } catch (err) {
    error.value = err.message;
    console.error('Failed to fetch logs:', err);
  } finally {
    loading.value = false;
  }
};

const formatXml = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      console.warn('XML parsing error:', parseError[0].textContent);
      return xmlString;
    }
    const formatNode = (node, indent = 0) => {
      const pad = '  '.repeat(indent);
      let result = '';
      if (node.nodeType === 1) { // Element
        const tagName = node.nodeName;
        const attrs = Array.from(node.attributes || [])
          .map(attr => `${attr.name}="${attr.value}"`)
          .join(' ');
        const openTag = attrs ? `<${tagName} ${attrs}>` : `<${tagName}>`;
        const children = Array.from(node.childNodes || []);
        if (children.length === 0) {
          result += `${pad}${openTag.replace('>', ' />')}\n`;
        } else {
          result += `${pad}${openTag}\n`;
          children.forEach(child => {
            result += formatNode(child, indent + 1);
          });
          result += `${pad}</${tagName}>\n`;
        }
      } else if (node.nodeType === 3) { // Text
        const text = node.nodeValue.trim();
        if (text) result += `${pad}${text}\n`;
      }
      return result;
    };
    return formatNode(xmlDoc.documentElement).trim();
  } catch (e) {
    console.error('Failed to format XML:', e);
    return xmlString;
  }
};

watch([() => props.venId, selectNumRows], fetchLogs, { immediate: true });
</script>
