<script setup>

import { ref } from 'vue'
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import getRegistrationStatus from './getRegistrationStatus.vue';
import getLogs from './getLogs.vue';

const selectedVenId = ref('')
</script>

<template>
    <div class="card flex justify-center">
        <Stepper value="1" linear class="basis-[50rem]">
            <StepList>
                <Step value="1">CHECK STATUS REGISTRATION</Step>
                <Step value="2">LOGGING REGISTRATION SERVICES TESTING</Step>
                <Step value="3">UPDATE REPORT TESTING</Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <div class="flex flex-col h-full">
                        <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto p-4 text-left">
                            <p class="font-semibold mb-2 text-xl">STEP 1: REGISTRATION STATUS</p>
                            <p class="font-medium">
                                This step is carried out to ensure that the Virtual End Node (VEN) is capable of properly handling registration services with the Virtual Top Node (VTN).
                                During the registration process, the status must be set to "OPEN" to allow communication.
                                Once registration is complete, the status should be switched to "CLOSE" without delay to finalise the procedure and maintain system integrity.
                            </p>
                            <getRegistrationStatus />
                        </div>
                    </div>
                    
                    <div class="flex pt-6 justify-end">
                        <Button label="Next" icon="pi pi-arrow-right" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="2">
                    <div class="flex flex-col h-full">
                        <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto p-4 text-left">
                            <p class="font-semibold mb-2 text-xl">STEP 2: DRMS LOG DATA</p>
                            <p class="font-medium">
                                This step focuses on retrieving and presenting the most recent log entries from the DRMS system. The accompanying data reflects the metadata of the report, specifically the ReportSpecifierId. To ensure accurate retrieval, it is necessary to determine the appropriate number of rows to extract from the DRMS logs.
                            </p>
                            <getLogs />
                        </div>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')" />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="3">
                    <div class="flex flex-col h-full">
                        <div class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">Content III</div>
                    </div>
                    <div class="pt-6">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
            </StepPanels>
        </Stepper>
    </div>
</template>
