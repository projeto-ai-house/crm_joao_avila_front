<template>
  <div
    class="referral-button-wrapper"
    v-if="userStore.user?.Role?.includes('CEO')"
  >
    <Button
      @click="handleReferralClick"
      class="referral-button"
      :disabled="disabled"
      :loading="loading"
    >
      <div class="referral-content">
        <div class="referral-icon">
          <UserPlus class="w-5 h-5" />
        </div>
        <div class="referral-text">
          <span class="referral-title">Indique um Amigo</span>
          <span class="referral-subtitle">Indique e ganhe R$200,00!</span>
        </div>
        <!-- <div class="referral-arrow">
          <ChevronRight class="w-4 h-4" />
        </div> -->
      </div>
    </Button>

    <!-- Badge de destaque opcional -->
    <!-- <div v-if="showBadge" class="referral-badge">
      <Gift class="w-3 h-3" />
      <span>Novo</span>
    </div> -->

    <!-- Modal de Indicação -->
    <ReferralModal
      :visible="modalVisible"
      @update:visible="modalVisible = $event"
      @share="handleShare"
      :userId="userId"
    />
  </div>
</template>

<script setup lang="ts">
import { UserPlus } from "lucide-vue-next";
import { Button } from "primevue";
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import ReferralModal from "./ReferralModal.vue";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  showBadge?: boolean;
  variant?: "primary" | "outline" | "minimal";
  userId?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  showBadge: true,
  variant: "primary",
  userId: "",
});

const emit = defineEmits<{
  click: [];
  share: [link: string];
}>();

const modalVisible = ref(false);

const handleReferralClick = () => {
  if (!props.disabled && !props.loading) {
    modalVisible.value = true;
    emit("click");
  }
};

const handleShare = (link: string) => {
  emit("share", link);
};

const userStore = useUserStore();
// console.log("userStore:", userStore.user);
</script>

<style scoped>
.referral-button-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.referral-button {
  --p-button-padding-x: 0;
  --p-button-padding-y: 0;
  --p-button-border-radius: 16px;

  background: linear-gradient(
    135deg,
    #3b82f6 0%,
    #1d4ed8 50%,
    #1e40af 100%
  ) !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3),
    0 2px 10px rgba(59, 130, 246, 0.2) !important;

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden !important;
  position: relative !important;
  width: 100%;
  /* min-width: 220px; */
  opacity: 1;
}

.referral-button:not(:disabled):hover {
  background: linear-gradient(
    135deg,
    #cef261 0%,
    #a3e635 50%,
    #84cc16 100%
  ) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 30px rgba(206, 242, 97, 0.4),
    0 4px 15px rgba(206, 242, 97, 0.3) !important;
  opacity: 1 !important;
}

.referral-button:not(:disabled):hover .referral-content {
  color: #1f2937 !important;
}

.referral-button:not(:disabled):hover .referral-icon,
.referral-button:not(:disabled):hover .referral-arrow {
  color: #1f2937 !important;
}

.referral-button:not(:disabled):active {
  transform: translateY(-1px) !important;
  transition: all 0.1s ease !important;
}

.referral-button:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
  transform: none !important;
}

.referral-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 12px 16px 16px;
  color: white;
  transition: color 0.3s ease;
}

.referral-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.referral-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 16px;
  text-align: left;
}

.referral-title {
  font-family: var(--font-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 2px;
}

.referral-subtitle {
  font-family: var(--font-secondary);
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
  line-height: 1.2;
}

.referral-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.referral-button:not(:disabled):hover .referral-arrow {
  background: rgba(0, 0, 0, 0.1);
  transform: translateX(2px);
}

.referral-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  animation: badge-pulse 2s infinite;
  z-index: 10;
}

/* Variantes do botão */
.referral-button.outline {
  background: transparent !important;
  border: 2px solid #3b82f6 !important;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1) !important;
}

.referral-button.outline .referral-content {
  color: #3b82f6;
}

.referral-button.outline:not(:disabled):hover {
  background: #3b82f6 !important;
  border-color: #3b82f6 !important;
}

.referral-button.outline:not(:disabled):hover .referral-content {
  color: white !important;
}

.referral-button.minimal {
  background: rgba(59, 130, 246, 0.1) !important;
  border: none !important;
  box-shadow: none !important;
}

.referral-button.minimal .referral-content {
  color: #3b82f6;
}

.referral-button.minimal:not(:disabled):hover {
  background: rgba(59, 130, 246, 0.15) !important;
}

/* Responsividade */
/* @media (max-width: 640px) {
  .referral-button {
    min-width: 240px;
    height: 56px;
  }

  .referral-content {
    padding: 12px 16px;
  }

  .referral-title {
    font-size: 14px;
  }

  .referral-subtitle {
    font-size: 11px;
  }
} */

/* Estados de loading */
.referral-button .p-button-loading-icon {
  color: white;
}

.referral-button:not(:disabled):hover .p-button-loading-icon {
  color: #1f2937;
}

/* Animação de entrada */
.referral-button-wrapper {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
