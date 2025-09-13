<template>
  <Dialog
    v-model:visible="isVisible"
    modal
    :style="{ width: '28rem' }"
    fluid
    class="referral-modal m-2"
    @update:visible="handleVisibilityChange"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <div class="referral-modal-icon">
          <UserPlus class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-lg text-gray-800">Indique um Amigo</span>
          <span class="text-sm text-gray-500">Indique e ganhe R$200,00</span>
        </div>
      </div>
    </template>

    <div class="referral-modal-content p-0 sm:p-4">
      <!-- Mensagem explicativa -->
      <div class="referral-message">
        <div class="referral-message-icon">
          <Share2 class="w-5 h-5 text-blue-500" />
        </div>
        <div class="referral-message-text">
          <p class="text-gray-700 leading-relaxed">
            Basta compartilhar o link abaixo com a pessoa que você deseja
            indicar. Quando ela fechar qualquer plano pelo seu link, vocês dois
            ganham um desconto de R$200,00 no seu próximo plano!
          </p>
        </div>
      </div>

      <!-- Campo de link com botão de copiar -->
      <div class="referral-link-section">
        <label class="referral-link-label"> Seu link de indicação </label>

        <div class="referral-link-container">
          <InputGroup class="referral-link-input-group">
            <InputText
              :value="referralLink"
              readonly
              class="referral-link-input"
              placeholder="Carregando link..."
            />
            <InputGroupAddon class="referral-copy-addon">
              <Button
                icon="pi pi-copy"
                severity="secondary"
                variant="text"
                size="small"
                class="referral-copy-button"
                :loading="copyLoading"
                @click="copyLink(referralLink)"
                v-tooltip.top="copyTooltip"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <!-- Status de cópia -->
        <div v-if="copySuccess" class="referral-copy-success">
          <CheckCircle class="w-4 h-4 text-green-500" />
          <span class="text-sm text-green-600">Link copiado com sucesso!</span>
        </div>
      </div>

      <!-- Benefícios -->
      <div class="referral-benefits">
        <h4 class="referral-benefits-title">
          <Gift class="w-4 h-4 text-amber-500" />
          Benefícios da Indicação
        </h4>
        <ul class="referral-benefits-list">
          <li class="referral-benefit-item">
            <CheckCircle class="w-4 h-4 text-green-500" />
            <span>Ganhe R$200,00 de desconto por indicação </span>
          </li>
          <li class="referral-benefit-item">
            <CheckCircle class="w-4 h-4 text-green-500" />
            <span> Desconto especial no plano do indicado </span>
          </li>
          <li class="referral-benefit-item">
            <CheckCircle class="w-4 h-4 text-green-500" />
            <span> Prioridade no seu suporte </span>
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="referral-modal-footer">
        <Button
          label="Compartilhar Link"
          icon="pi pi-share-alt"
          severity="primary"
          class="referral-share-button"
          @click="shareLink"
          :disabled="!referralLink"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { CheckCircle, Gift, Share2, UserPlus } from "lucide-vue-next";
import {
  Button,
  Dialog,
  InputGroup,
  InputGroupAddon,
  InputText,
  useToast,
} from "primevue";
import { ref, watch } from "vue";
import {
  ReferralsServices,
  type IReferral,
} from "../../services/referral/ReferralServices";

interface Props {
  visible?: boolean;
  userId?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  userId: "",
});

const emit = defineEmits<{
  "update:visible": [value: boolean];
  share: [link: string];
}>();

const toast = useToast();
const isVisible = ref(props.visible);
const copyLoading = ref(false);
const copySuccess = ref(false);
const copyTooltip = ref("Copiar link");
const referralLink = ref("");

const generateReferralLink = async () => {
  try {
    const baseUrl = window.location.origin;
    const response = await ReferralsServices.getReferrals({
      pagina: 1,
      limite: 1000,
    });
    const referralsList = (await response.data?.data?.indicacoes) || [];
    const hasReferralActive = referralsList.find(
      (referral: IReferral) => referral.status_link === "ATIVO"
    );
    if (hasReferralActive) {
      const orderedReferral = referralsList
        .filter((referral: IReferral) => referral.status_link === "ATIVO")
        .sort(
          (a: IReferral, b: IReferral) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        ?.reverse();
      return baseUrl + "/indicacao/" + orderedReferral[0].codigo_indicacao;
    }

    // Se não houver indicação ativa, gera uma nova
    const newReferralResponse = await ReferralsServices.generateReferral();
    console.log("Nova indicação gerada:", newReferralResponse);
    const newReferral = await newReferralResponse.data?.data;
    return baseUrl + "/indicacao/" + newReferral.codigo_indicacao;
  } catch (error) {
    console.error("Erro ao gerar link de indicação:", error);
    return "Link indisponível no momento";
  }
};

watch(
  () => props.visible,
  async (newVal) => {
    isVisible.value = newVal;
    if (newVal) {
      referralLink.value = await generateReferralLink();
    }
  }
);

watch(isVisible, (newVal) => {
  if (!newVal) {
    copySuccess.value = false;
    copyTooltip.value = "Copiar link";
  }
});

const handleVisibilityChange = (value: boolean) => {
  isVisible.value = value;
  emit("update:visible", value);
};

const copyLink = async (link: string) => {
  if (!referralLink.value || link) return;
  const realLink = link || referralLink.value;
  copyLoading.value = true;
  try {
    await navigator.clipboard.writeText(realLink);
    copySuccess.value = true;
    copyTooltip.value = "Copiado!";
    toast.add({
      severity: "success",
      summary: "Link copiado!",
      detail: "O link de indicação foi copiado para a área de transferência.",
      life: 3000,
    });
    setTimeout(() => {
      copySuccess.value = false;
      copyTooltip.value = "Copiar link";
    }, 3000);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro ao copiar",
      detail: "Não foi possível copiar o link. Tente novamente.",
      life: 3000,
    });
  } finally {
    copyLoading.value = false;
  }
};

const shareLink = async () => {
  if (!referralLink.value) return;

  const shareData = {
    title: "Indicação Mednova",
    text: "Olá! Quero te indicar a Mednova, uma plataforma incrível para gestão médica. Use meu link para se cadastrar:",
    url: referralLink.value,
  };

  try {
    // Verifica se o navegador suporta e pode compartilhar
    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare(shareData))
    ) {
      await navigator.share(shareData);
      emit("share", referralLink.value);
    } else {
      await copyLink(referralLink.value); // fallback: copia para área de transferência
    }
  } catch (err) {
    // Se o usuário cancelar ou der erro, copia o link
    await copyLink(referralLink.value);
  }
};

const closeModal = () => {
  handleVisibilityChange(false);
};
</script>

<style scoped>
.referral-modal :deep(.p-dialog-header) {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.referral-modal :deep(.p-dialog-content) {
  padding: 0;
}

.referral-modal :deep(.p-dialog-footer) {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.referral-modal-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.referral-modal-content {
  /* padding: 1.5rem; */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.referral-message {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  border: 1px solid #bfdbfe;
}

.referral-message-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: flex-start;
  margin-top: 2px;
}

.referral-message-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

.referral-link-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.referral-link-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: var(--font-primary);
}

.referral-link-container {
  width: 100%;
}

.referral-link-input-group {
  width: 100%;
}

.referral-link-input {
  font-family: "Courier New", monospace !important;
  font-size: 12px !important;
  color: #6b7280 !important;
  background: #f9fafb !important;
}

.referral-copy-addon {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
}

.referral-copy-button {
  border-radius: 0 6px 6px 0 !important;
  transition: all 0.2s ease !important;
}

.referral-copy-button:hover {
  background: #f3f4f6 !important;
  transform: scale(1.05) !important;
}

.referral-copy-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  animation: slideInUp 0.3s ease-out;
}

.referral-benefits {
  background: #fffbeb;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 1rem;
}

.referral-benefits-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.75rem;
  font-family: var(--font-primary);
}

.referral-benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.referral-benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  color: #78716c;
}

.referral-stats {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.referral-stats-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}

.referral-stats-number {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  font-family: var(--font-primary);
}

.referral-stats-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.referral-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.referral-share-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  transition: all 0.3s ease !important;
}

.referral-share-button:not(:disabled):hover {
  background: linear-gradient(135deg, #cef261 0%, #a3e635 100%) !important;
  color: #1f2937 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(206, 242, 97, 0.4) !important;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsividade */
@media (max-width: 640px) {
  .referral-modal :deep(.p-dialog) {
    width: 90vw !important;
    margin: 1rem !important;
  }

  .referral-modal-content {
    padding: 0rem;
    gap: 1rem;
  }

  .referral-stats {
    flex-direction: column;
    gap: 0.75rem;
  }

  .referral-stats-item {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }

  .referral-modal-footer {
    flex-direction: column-reverse;
    gap: 0.5rem;
  }

  .referral-modal-footer button {
    width: 100%;
  }
}
</style>
