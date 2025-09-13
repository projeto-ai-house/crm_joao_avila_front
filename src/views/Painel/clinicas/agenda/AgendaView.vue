<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Calendário</Tab>
      <Tab value="1">Fila de Espera</Tab>
    </TabList>
    <TabPanels class="[&_.p-tabpanels]:!pl-0">
      <TabPanel value="0">
        <FullCalendarWrapper />
      </TabPanel>
      <TabPanel value="1">
        <WaitListWrapper />
      </TabPanel>
    </TabPanels>
  </Tabs>
</template>

<script setup lang="ts">
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
import FullCalendarWrapper from "./FullCalendarWrapper.vue";
import WaitListWrapper from "./WaitList.Wrapper.vue";
</script>

<style scoped>
::v-deep(.p-tabpanels) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  @media (min-width: 640px) {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
}
</style>
