<template>
  <VideoComponent>
    <header class="text-center mb-4 text-black max-w-2xl !font-secondary">
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-20 md:w-24 h-20 md:h-24 mb-1 mx-auto drop-shadow-2xl drop-shadow-gray-800/20"
      />
      <h1 class="text-2xl md:text-4xl font-normal mb-2">Mednova</h1>
      <p class="text-md px-4 md:text-xl">
        Automação Inteligente para Clínicas Modernas
      </p>
      <!-- <LoaderPinwheel class="animate-spin text-gray-600" /> -->
    </header>
    <div class="max-w-xl p-4">
      <Card
        class="overflow-hidden !shadow-xl !backdrop-blur-xl !bg-white/0 !bg-gradient-to-b !from-white/20 !to-white/80 border border-white/10 !rounded-2xl !px-1 !py-2 md:!px-2 md:!py-4 w-screen max-w-[94vw] sm:max-w-full"
      >
        <template #content>
          <div class="form-slider-container !font-secondary">
            <transition :name="transitionName" mode="out-in">
              <div v-if="inForm" key="referral" class="form-referral w-full">
                <Form
                  v-slot="$form"
                  :resolver="resolver"
                  :initialValues="form"
                  @submit="onSubmit"
                  class="flex justify-center flex-col gap-4 md:px-2"
                >
                  <div class="flex justify-start items-center mb-4 gap-4">
                    <span
                      class="min-w-12 min-h-12 flex items-center justify-center self-center rounded-full bg-white/20 text-gray-700 shadow-lg shadow-gray-800/20"
                    >
                      <Handshake class="stroke-[2.4px] w-5 h-5 text-gray-700" />
                    </span>
                    <p class="text-md max-w-4/5 text-start">
                      Preencha o formulário para usar sua indicação, logo
                      entraremos em contato com você.
                    </p>
                  </div>

                  <!-- Nome do Responsável -->
                  <InputGroup>
                    <InputGroupAddon class="!bg-white/40">
                      <User class="w-4 h-4" />
                    </InputGroupAddon>
                    <InputText
                      id="nome_dono_indicado"
                      type="text"
                      placeholder="Nome do responsável"
                      v-model="form.nome_dono_indicado"
                      class="!bg-white/40"
                      :disabled="loginLoading"
                      :autofocus="true"
                    />
                    <Message
                      v-if="$form.nome_dono_indicado?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $form.nome_dono_indicado.error?.message }}</Message
                    >
                  </InputGroup>

                  <!-- Nome da Clínica -->
                  <InputGroup>
                    <InputGroupAddon class="!bg-white/40">
                      <Building class="w-4 h-4" />
                    </InputGroupAddon>
                    <InputText
                      id="nome_clinica_indicada"
                      type="text"
                      placeholder="Nome da clínica"
                      v-model="form.nome_clinica_indicada"
                      class="!bg-white/40"
                      :disabled="loginLoading"
                    />
                    <Message
                      v-if="$form.nome_clinica_indicada?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $form.nome_clinica_indicada.error?.message }}</Message
                    >
                  </InputGroup>

                  <!-- CNPJ -->
                  <InputGroup>
                    <InputGroupAddon class="!bg-white/40">
                      <FileText class="w-4 h-4" />
                    </InputGroupAddon>
                    <InputMask
                      id="cnpj_indicado"
                      mask="99.999.999/9999-99"
                      placeholder="CNPJ"
                      v-model="form.cnpj_indicado"
                      class="!bg-white/40"
                      :disabled="loginLoading"
                    />
                    <Message
                      v-if="$form.cnpj_indicado?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $form.cnpj_indicado.error?.message }}</Message
                    >
                  </InputGroup>

                  <!-- Telefone/WhatsApp -->
                  <InputGroup>
                    <InputGroupAddon class="!bg-white/40">
                      <Phone class="w-4 h-4" />
                    </InputGroupAddon>
                    <InputMask
                      id="telefone_whatsapp_indicado"
                      mask="+55 99 99999-9999"
                      placeholder="Telefone/WhatsApp"
                      v-model="form.telefone_whatsapp_indicado"
                      class="!bg-white/40"
                      :disabled="loginLoading"
                    />
                    <Message
                      v-if="$form.telefone_whatsapp_indicado?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{
                        $form.telefone_whatsapp_indicado.error?.message
                      }}</Message
                    >
                  </InputGroup>

                  <!-- E-mail -->
                  <InputGroup>
                    <InputGroupAddon class="!bg-white/40">
                      <Mail class="w-4 h-4" />
                    </InputGroupAddon>
                    <InputText
                      id="email_indicado"
                      type="email"
                      placeholder="E-mail"
                      v-model="form.email_indicado"
                      class="!bg-white/40"
                      :disabled="loginLoading"
                    />
                    <Message
                      v-if="$form.email_indicado?.invalid"
                      severity="error"
                      size="small"
                      variant="simple"
                      >{{ $form.email_indicado.error?.message }}</Message
                    >
                  </InputGroup>

                  <Button
                    type="submit"
                    severity="contrast"
                    label="Enviar Indicação"
                    class="hover:!bg-[#CEF261] hover:!text-black"
                    :loading="loginLoading"
                  />
                </Form>
              </div>
              <div v-else key="success" class="form-success w-full">
                <div
                  class="flex justify-center flex-col gap-6 md:px-2 text-center"
                >
                  <div class="flex justify-center items-center mb-4">
                    <span
                      class="min-w-16 min-h-16 flex items-center justify-center self-center rounded-full bg-green-500/20 text-green-700 shadow-lg shadow-green-800/20"
                    >
                      <svg
                        class="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </span>
                  </div>

                  <div class="space-y-3">
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-800">
                      Seus dados foram enviados com sucesso!
                    </h3>
                    <p class="text-md text-gray-700 px-4">
                      Obrigado por confiar na Mednova! Entraremos em contato em
                      breve para dar continuidade ao processo.
                    </p>
                  </div>

                  <!-- <div class="flex flex-col gap-3 mt-6">
                    <Button
                      severity="contrast"
                      label="Fazer Nova Indicação"
                      class="hover:!bg-[#CEF261] hover:!text-black"
                      @click="showForm"
                    />
                  </div> -->
                </div>
              </div>
            </transition>
          </div>
        </template>
      </Card>
    </div>
  </VideoComponent>
</template>

<script lang="ts" setup>
import VideoComponent from "@/components/VideoComponent.vue";
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import {
  Building,
  FileText,
  Handshake,
  Mail,
  Phone,
  User,
} from "lucide-vue-next";
import {
  Button,
  InputGroup,
  InputGroupAddon,
  InputMask,
  InputText,
  Message,
} from "primevue";
import Card from "primevue/card";
import { onBeforeMount, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";
import { ReferralsServices } from "../services/referral/ReferralServices";

interface FormValues {
  codigo_indicacao: string;
  nome_dono_indicado: string;
  nome_clinica_indicada: string;
  cnpj_indicado: string;
  telefone_whatsapp_indicado: string;
  email_indicado: string;
}

const route = useRoute();
const router = useRouter();
const inForm = ref(true);
const loginLoading = ref(false);
const transitionName = ref("slide-left");

function showSuccess() {
  transitionName.value = "slide-left";
  inForm.value = false;
}

function showForm() {
  transitionName.value = "slide-right";
  inForm.value = true;
  // Limpar o formulário para nova indicação (mantendo apenas o código)
  const codigoAtual = form.codigo_indicacao;
  Object.assign(form, {
    codigo_indicacao: codigoAtual,
    nome_dono_indicado: "",
    nome_clinica_indicada: "",
    cnpj_indicado: "",
    telefone_whatsapp_indicado: "",
    email_indicado: "",
  });
}

async function onSubmit() {
  console.log("Formulário enviado:", form);
  try {
    loginLoading.value = true;
    const formData = {
      ...form,
      codigo_indicacao: form.codigo_indicacao.trim(),
    };

    const response = await ReferralsServices.postReferralSubscription(formData);
    console.log("Res posta do serviço:", response);
    if (response.status !== 200) {
      console.error("Erro ao enviar o formulário:", response);
      return;
    }
    showSuccess();
  } catch (error) {
    console.error("Erro ao enviar o formulário:", error);
  } finally {
    loginLoading.value = false;
  }
}

const form = reactive<FormValues>({
  codigo_indicacao: (route.params.code as string) || "",
  nome_dono_indicado: "",
  nome_clinica_indicada: "",
  cnpj_indicado: "",
  telefone_whatsapp_indicado: "",
  email_indicado: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      codigo_indicacao: z
        .string()
        .min(1, { message: "Código de indicação é obrigatório." }),
      nome_dono_indicado: z
        .string()
        .min(2, { message: "Nome do responsável é obrigatório." }),
      nome_clinica_indicada: z
        .string()
        .min(2, { message: "Nome da clínica é obrigatório." }),
      cnpj_indicado: z
        .string()
        .min(1, { message: "CNPJ é obrigatório." })
        .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
          message: "CNPJ deve estar no formato 00.000.000/0000-00",
        }),
      telefone_whatsapp_indicado: z
        .string()
        .min(1, { message: "Telefone é obrigatório." })
        .regex(/^\+55 \d{2} \d{4,5}-\d{4}$/, {
          message: "Telefone deve estar no formato +55 00 00000-0000",
        }),
      email_indicado: z
        .string()
        .min(1, { message: "E-mail é obrigatório." })
        .email({ message: "E-mail deve ter um formato válido." }),
    })
  )
);

onBeforeMount(() => {
  // Inicialização do formulário
});
</script>

<style scoped>
@media screen and (min-width: 640px) {
  .form-slider-container {
    min-height: 240px !important;
  }
}
.form-slider-container {
  position: relative;
  min-height: auto;
  display: flex;
  flex-direction: column;
}

.form-referral,
.form-success {
  width: 100%;
}

/* Slide para a esquerda (form -> success) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide para a direita (success -> form) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
