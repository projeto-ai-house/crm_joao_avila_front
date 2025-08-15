<template>
  <div class="card flex justify-center">
    <Button
      v-tooltip.bottom="'Notificações'"
      icon="pi pi-bell"
      severity="primary"
      variant="text"
      rounded
      @click="toggle"
    />

    <Popover ref="op">
      <div class="flex flex-col gap-4 w-[25rem]">TESTADO</div>
    </Popover>
  </div>
</template>

<script setup>
import { Button, Popover } from "primevue";
import { SSE } from "sse.js";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { AuthenticationUtils } from "../../utils/AuthenticationUtils";

const op = ref();

const toggle = (event) => {
  op.value.toggle(event);
};

const notifications = ref([]);
const newNotification = ref("");

async function connectSSE() {
  const url = import.meta.env.VITE_API_PUSH_URL + "/sse/notifications";
  const token = new AuthenticationUtils().getToken();

  const source = new SSE(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "text/event-stream",
    },
  });

  source.addEventListener("notification", (event) => {
    console.log("Received notification:", event.data);
  });
  source.addEventListener("message", (event) => {
    console.log("Received message:", event.data);
  });
}

onMounted(() => {
  connectSSE();
});

onBeforeUnmount(() => {
  //   if (eventSource) {
  //     eventSource.close();
  //   }
});
</script>
