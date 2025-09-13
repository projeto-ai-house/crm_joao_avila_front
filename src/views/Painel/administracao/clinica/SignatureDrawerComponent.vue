<template>
  <Drawer
    v-model:visible="props.drawerState"
    header="Assinatura da Clínica"
    position="right"
    class="!w-full md:!w-80 lg:!w-[30rem]"
    @update:visible="emit('update:drawerState', $event)"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">Assinatura da Clínica</span>
      </div>
    </template>
    <Form
      ref="formClinic"
      v-slot="$form"
      :initialValues="initialValues"
      :resolver="resolver"
      class="grid grid-cols-12 w-full gap-4"
    >
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-2 mb-1 border-b border-gray-200 pb-2"
        >
          <TicketCheck class="w-5 h-5" /> Assinatura
        </div>

        <!-- Nome da Clínica -->
        <div class="col-span-12 flex flex-col gap-1">
          <div>
            <label
              for="assinatura_id"
              class="text-sm font-medium text-gray-900"
            >
              ID da Assinatura
            </label>
            <InputText
              id="assinatura_id"
              name="assinatura_id"
              type="text"
              fluid
              size="small"
              v-model="initialValues.assinatura_id"
              disabled
            />
          </div>
          <Message
            v-if="$form.assinatura_id?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.assinatura_id.error.message }}
          </Message>
        </div>
      </div>
      <div class="col-span-12 grid grid-cols-12 gap-4">
        <div
          class="col-span-12 flex items-center gap-2 text-gray-700 text-base font-semibold mt-2 mb-1 border-b border-gray-200 pb-2"
        >
          <History class="w-5 h-5" /> Histórico
        </div>
        <div class="col-span-12">
          <DataTable
            :value="historyList"
            stripedRows
            dataKey="ID"
            size="small"
            class="text-sm"
          >
            <template #empty> Nenhum histórico encontrado. </template>
            <Column field="tipo" sortable header="Tipo">
              <template #body="slotProps">
                <div
                  class="truncate-cell"
                  :title="
                    stripeSubscriptionEventDescriptions[slotProps.data.tipo] ||
                    slotProps.data.tipo
                  "
                >
                  {{
                    stripeSubscriptionEventDescriptions[slotProps.data.tipo] ||
                    slotProps.data.tipo
                  }}
                </div>
              </template>
            </Column>
            <Column field="descricao" sortable header="Descrição">
              <template #body="slotProps">
                <div class="truncate-cell" :title="slotProps.data.descricao">
                  {{ slotProps.data.descricao }}
                </div>
              </template>
            </Column>
            <Column field="valor" sortable header="Valor">
              <template #body="slotProps">
                <div class="truncate-cell" :title="slotProps.data.valor">
                  {{ MoneyUtils.formatCurrency(slotProps.data.valor) }}
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </Form>
    <template #footer> </template>
  </Drawer>
</template>

<script setup lang="ts">
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { History, TicketCheck } from "lucide-vue-next";
import { Column, DataTable, InputText, Message, useToast } from "primevue";
import Drawer from "primevue/drawer";
import { useConfirm } from "primevue/useconfirm";
import { computed, inject, ref, watch, type Ref } from "vue";
import { z } from "zod";
import { SignatureServices } from "../../../../services/signature/SignatureServices";
import { useUserStore } from "../../../../stores/user";
import { MoneyUtils } from "../../../../utils/MoneyUtils";

const userStore = useUserStore();
const confirm = useConfirm();
const toast = useToast();
const props = defineProps<{
  drawerState: boolean;
  assinaturaId?: string | null;
}>();
const stripeSubscriptionEventDescriptions: { [eventType: string]: string } = {
  "customer.created": "Cliente criado",
  "customer.subscription.created": "Assinatura criada",
  "customer.subscription.deleted": "Assinatura terminada",
  "customer.subscription.paused": "Assinatura pausada",
  "customer.subscription.resumed": "Assinatura retomada",
  "customer.subscription.trial_will_end": "Período de teste vai acabar",
  "customer.subscription.updated": "Assinatura atualizada",
  "entitlements.active_entitlement_summary.updated":
    "Resumo de direitos ativos atualizado",
  "invoice.created": "Fatura criada",
  "invoice.finalized": "Fatura finalizada",
  "invoice.finalization_failed": "Falha ao finalizar fatura",
  "invoice.paid": "Fatura paga",
  "invoice.payment_action_required": "Pagamento requer ação do cliente",
  "invoice.payment_failed": "Pagamento da fatura falhou",
  "invoice.upcoming": "Fatura próxima",
  "invoice.updated": "Fatura atualizada",
  "subscription_schedule.aborted": "Cronograma de assinatura abortado",
  "subscription_schedule.canceled": "Cronograma de assinatura cancelado",
  "subscription_schedule.completed": "Cronograma de assinatura concluído",
  "subscription_schedule.created": "Cronograma de assinatura criado",
  "subscription_schedule.expiring": "Cronograma de assinatura expirando",
  "subscription_schedule.released": "Cronograma de assinatura liberado",
  "subscription_schedule.updated": "Cronograma de assinatura atualizado",
};

const emit = defineEmits<{
  (e: "update:drawerState", value: boolean): void;
}>();

const globalLoading = inject<Ref<boolean>>("globalLoading");
const historyList = ref([]);
const formClinic = ref(null);
const initialValues = ref({
  assinatura_id: "",
});

const resolver = computed(() =>
  zodResolver(
    z.object({
      assinatura_id: z
        .string()
        .min(1, { message: "ID da assinatura é obrigatório." }),
    })
  )
);

async function fetchSignatureHistory() {
  try {
    const response = await SignatureServices.getHistory({
      assinatura_id: props.assinaturaId || "",
      pagina: 1,
      limite: 1000,
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch signature history");
    }
    historyList.value = response.data?.data?.historico || [];
    // console.log(historyList.value);
  } catch (error) {
    console.error("Erro ao carregar histórico de assinaturas:", error);
  }
}

watch(
  () => props.drawerState,
  async (newValue) => {
    if (newValue) {
      if (!props.assinaturaId) {
        emit("update:drawerState", false);
        return;
      }

      globalLoading.value = true;
      await fetchSignatureHistory();
      initialValues.value.assinatura_id = props.assinaturaId || "";
      formClinic.value?.reset();
      globalLoading.value = false;
    }
  }
);
</script>
