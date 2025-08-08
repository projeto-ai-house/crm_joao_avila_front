<template>
  <Drawer
    v-model:visible="drawerState"
    header="Adicionar Clínica"
    position="bottom"
    class="!w-full max-h-[90vh] overflow-y-auto font-normal"
    style="height: auto"
    @update:visible="emit('update:close')"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">Submissões</span>
      </div>
    </template>
    <DataTable :value="submissions">
      <Column field="nome_clinica_indicada" header="Identificação">
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">
            {{ slotProps.data.nome_clinica_indicada || "Não informado" }}
          </span>
          <span class="block text-sm text-gray-500">
            {{ slotProps.data.nome_dono_indicado || "Não informado" }}
          </span>
        </template>
      </Column>
      <Column field="cnpj_indicado" header="CNPJ">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span>{{ slotProps.data.cnpj_indicado || "Não informado" }}</span>
            <Button
              v-if="slotProps.data.cnpj_indicado"
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="copyToClipboard(slotProps.data.cnpj_indicado, 'CNPJ')"
              class="p-1"
            />
          </div>
        </template>
      </Column>
      <Column field="email_indicado" header="E-mail">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span>{{ slotProps.data.email_indicado || "Não informado" }}</span>
            <Button
              v-if="slotProps.data.email_indicado"
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="copyToClipboard(slotProps.data.email_indicado, 'E-mail')"
              class="p-1"
            />
          </div>
        </template>
      </Column>
      <Column field="telefone_whatsapp_indicado" header="Telefone/WhatsApp">
        <template #body="slotProps">
          <div class="flex items-center gap-2">
            <span>{{
              slotProps.data.telefone_whatsapp_indicado || "Não informado"
            }}</span>
            <Button
              v-if="slotProps.data.telefone_whatsapp_indicado"
              icon="pi pi-copy"
              size="small"
              severity="secondary"
              text
              @click="
                copyToClipboard(
                  slotProps.data.telefone_whatsapp_indicado,
                  'Telefone/WhatsApp'
                )
              "
              class="p-1"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <template #footer>
      <div class="flex items-center gap-2"></div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Button, Column, DataTable, Drawer, useToast } from "primevue";
import { defineEmits, inject, ref, type Ref } from "vue";
import { ReferralsServices } from "../../../../services/referral/ReferralServices";

const globalLoading = inject<Ref<boolean>>("globalLoading");
const emit = defineEmits(["update:close"]);
defineExpose({ openDrawer, closeDrawer });
const toast = useToast();

const drawerState = ref(false);
const submissions = ref([]);

async function openDrawer(data: any) {
  if (!data?.total_submissoes || data?.total_submissoes < 1) {
    toast.add({
      severity: "info",
      summary: "Informação",
      detail: "Nenhuma submissão encontrada para este código de indicação.",
      life: 2000,
    });
    emit("update:close");
    return;
  }
  drawerState.value = true;
  await fetchReferralSubmissions(data?.codigo_indicacao);
}

function closeDrawer() {
  drawerState.value = false;
  emit("update:close");
}

async function fetchReferralSubmissions(referralId: number) {
  try {
    globalLoading.value = true;
    const response = await ReferralsServices.getReferralSubs(
      referralId?.toString()
    );
    if (response.status === 200) {
      submissions.value = response.data?.data || [];
    }
  } catch (error) {
    console.error("Error fetching referral submissions:", error);
  } finally {
    globalLoading.value = false;
  }
}

async function copyToClipboard(text: string, fieldName: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      severity: "success",
      summary: "Copiado!",
      detail: `${fieldName} copiado para a área de transferência.`,
      life: 2000,
    });
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível copiar para a área de transferência.",
      life: 2000,
    });
  }
}
</script>
