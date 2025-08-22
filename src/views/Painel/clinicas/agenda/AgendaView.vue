<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">Calendário</Tab>
      <Tab value="1">Fila de Espera</Tab>
    </TabList>
    <TabPanels>
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

<style scoped></style>
