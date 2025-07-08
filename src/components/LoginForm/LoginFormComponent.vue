<template>
  <Toast />
  <Form
    v-slot="$form"
    :resolver="resolver"
    :initialValues="form"
    @submit="onFormSubmit"
    class="flex justify-center flex-col gap-4 md:px-2"
  >
    <div class="flex justify-start items-center mb-4 gap-4">
      <span
        class="min-w-12 min-h-12 flex items-center justify-center self-center rounded-full bg-white/20 text-gray-700 shadow-lg shadow-gray-800/20"
      >
        <LogIn class="stroke-[2.4px] w-5 h-5 text-gray-700" />
      </span>
      <p class="text-md max-w-4/5 text-start">
        Faça login para acessar sua conta e gerenciar sua clínica de forma
        simples e segura.
      </p>
    </div>
    <InputGroup>
      <InputGroupAddon class="!bg-white/40">
        <UserIcon class="w-4 h-4" />
      </InputGroupAddon>
      <InputText
        id="email"
        type="text"
        placeholder="Usuário"
        v-model="form.email"
        class="!bg-white/40"
        :disabled="loginLoading"
        :autofocus="true"
      />
      <Message
        v-if="$form.email?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.email.error?.message }}</Message
      >
    </InputGroup>
    <div class="flex flex-col gap-1">
      <InputGroup>
        <InputGroupAddon class="!bg-white/40">
          <Key class="w-4 h-4" />
        </InputGroupAddon>
        <Password
          name="senha"
          placeholder="Senha"
          v-model="form.senha"
          class="*:!bg-white/40"
          fluid
          :feedback="false"
          :disabled="loginLoading"
        />
      </InputGroup>
      <Message
        v-if="$form.senha?.invalid"
        severity="error"
        size="small"
        variant="simple"
        class="!text-sm"
      >
        {{ $form.senha.error?.message }}
      </Message>
    </div>

    <div class="flex justify-end items-center">
      <!-- <div class="flex items center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  v-model="form.remember"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  for="remember"
                  class="text-sm text-gray-700 dark:text-gray-300"
                  >Lembrar-me</label
                >
              </div> -->
      <a
        href="#"
        class="text-sm text-blue-600 hover:underline dark:text-blue-500"
        @click.prevent="$emit('click:recovery')"
      >
        Esqueci minha senha
      </a>
    </div>

    <Button
      type="submit"
      severity="contrast"
      label="Entrar"
      class="hover:!bg-[#CEF261] hover:!text-black"
      :loading="loginLoading"
    />
  </Form>
</template>

<script lang="ts" setup>
import { Key, LogIn, UserIcon } from "lucide-vue-next";
import Password from "primevue/password";
import { Button, InputGroup, InputGroupAddon, InputText } from "primevue";
import { onMounted, reactive, ref } from "vue";
// @ts-ignore
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { Form } from "@primevue/forms";
import { Authentication } from "../../services/auth/Authentication";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";

interface FormValues {
  email: string;
  senha: string;
}

const userStore = useUserStore();
const router = useRouter();
const toast = useToast();
const emit = defineEmits(["click:recovery"]);
const loginLoading = ref(false);

const form = reactive<FormValues>({
  email: "",
  senha: "",
});

const resolver = ref(
  zodResolver(
    z.object({
      email: z.string().min(1, { message: "Usuário é obrigatório." }),
      senha: z
        .string()
        .min(6, { message: "Minimo de 8 caracteres" })
        .max(48, { message: "Máximo de 48 caracteres." }),
      // .refine((value) => /[a-z]/.test(value), {
      //   message: "Deve conter uma letra minúscula.",
      // })
      // .refine((value) => /[A-Z]/.test(value), {
      //   message: "Deve conter uma letra maiúscula.",
      // })
      // .refine((value) => /d/.test(value), {
      //   message: "Deve conter um número.",
      // }),
    })
  )
);

async function onFormSubmit({ valid }) {
  if (valid) {
    try {
      loginLoading.value = true;
      const { email, senha } = form;
      const response = await Authentication.login(email, senha);
      if (response.status === 200) {
        const { data } = response;
        await userStore.login(data.data);
        router.push("/painel/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      loginLoading.value = false;
    }
  }
}
</script>
