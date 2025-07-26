<template>
  <Dialog
    v-model:visible="props.dialogState"
    modal
    header="Edit Profile"
    :style="{ width: '40rem' }"
    @update:visible="emit('update:dialogState', $event)"
  >
    <template #header> </template>
    <div class="flex flex-col items-center justify-center gap-4"></div>
    <template #footer> </template>
  </Dialog>
</template>
