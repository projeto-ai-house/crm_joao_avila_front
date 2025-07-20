<template>
  <Form
    v-slot="$form"
    :resolver="resolver"
    :initialValues="formData"
    @submit="onFormSubmit"
    class="flex justify-center flex-col gap-2 md:px-2"
  >
    <div class="flex justify-start items-center mb-4 gap-4">
      <span
        class="min-w-12 min-h-12 flex items-center justify-center self-center rounded-full bg-white/20 text-gray-700 shadow-lg shadow-gray-800/20"
      >
        <RefreshCcw class="stroke-[2.4px] w-5 h-5 text-gray-700" />
      </span>
      <p class="text-md max-w-4/5 text-start">
        Digite seu e-mail para recuperar sua conta.
      </p>
    </div>
    <InputGroup>
      <InputGroupAddon class="!bg-white/40">
        <Mail class="w-4 h-4" />
      </InputGroupAddon>
      <InputText
        id="email"
        name="email"
        type="email"
        placeholder="E-mail"
        v-model="formData.email"
        class="!bg-white/40"
        :invalid="$form.email?.invalid"
      />
    </InputGroup>
    <Message
      v-if="$form.email?.invalid"
      severity="error"
      size="small"
      variant="simple"
      >{{ $form.email.error?.message }}</Message
    >

    <div class="py-3">
      <cite class="text-sm text-gray-600">
        Enviaremos um link de recuperação para o seu e-mail.
      </cite>
    </div>

    <Button
      type="submit"
      severity="contrast"
      label="Enviar Link de Recuperação"
      class="hover:!bg-[#CEF261] hover:!text-black"
      :loading="loginLoading"
      :disabled="loginLoading || $form.email?.invalid"
    />
    <Button
      type="button"
      severity="secondary"
      label="Voltar ao Login"
      class="hover:!bg-[#CEF261] hover:!text-black"
      @click="$emit('click:login')"
    />
  </Form>
</template>

<script lang="ts" setup>
import { Mail, RefreshCcw } from "lucide-vue-next";
import { Button, InputGroup, InputGroupAddon, InputText } from "primevue";
import { reactive, ref } from "vue";
// @ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useRouter } from "vue-router";
import { z } from "zod";
import { Authentication } from "../../services/auth/Authentication";

const emit = defineEmits(["click:login"]);

const router = useRouter();
const loginLoading = ref(false);
const formData = reactive({
  email: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      email: z
        .string()
        .email("Por favor, insira um e-mail válido.")
        .min(1, "O e-mail é obrigatório."),
    })
  )
);

const onFormSubmit = async ({ valid }) => {
  if (valid) {
    try {
      loginLoading.value = true;
      const { email } = formData;
      const response = await Authentication.recoverUserPassword(email);
      if (response.status === 200) {
        // toast.add({
        //   severity: "success",
        //   summary: "E-mail de recuperação enviado.",
        //   detail: "Verifique sua caixa de entrada.",
        //   life: 3000,
        // });
        emit("click:login");
        setTimeout(() => {
          router.push({ name: "Login" });
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      loginLoading.value = false;
    }
  }
};
</script>
