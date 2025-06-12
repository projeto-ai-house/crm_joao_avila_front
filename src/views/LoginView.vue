<template>
  <VideoComponent>
    <header class="text-center mb-4 text-black max-w-2xl">
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-24 h-24 mb-1 mx-auto drop-shadow-2xl drop-shadow-gray-800/20"
      />
      <h1 class="text-4xl font-normal mb-2">Mednova</h1>
      <p class="text-xl">Automação Inteligente para Clínicas Modernas</p>
    </header>
    <div class="max-w-xl p-4">
      <Card
        class="!shadow-xl !backdrop-blur-xl !bg-white/0 !bg-gradient-to-b !from-white/20 !to-white/80 border border-white/10 !rounded-2xl !px-2 !py-4 w-screen max-w-full"
      >
        <!-- <template #title class="flex flex-col items-center">
          <div
            class="flex items-center justify-center mb-2 rounded-xl w-fit gap-2 text-sm"
          >
            <LogIn class="stroke-[2.4px] w-4 h-4" />
            <h2 class="font-semibold text-center">Entrar</h2>
          </div>
        </template> -->
        <template #content>
          <Form
            v-slot="$form"
            :resolver="resolver"
            :initialValues="form"
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4 px-2"
          >
            <div class="flex justify-start items-center mb-4 gap-4">
              <span
                class="w-12 h-12 flex items-center justify-center self-center rounded-full bg-white/20 text-gray-700 shadow-lg shadow-gray-800/20"
              >
                <LogIn class="stroke-[2.4px] w-5 h-5 text-gray-700" />
              </span>
              <!-- <h2 class="text-2xl font-medium text-center">Entrar</h2> -->
              <p class="text-md max-w-4/5 text-start">
                Faça login para acessar sua conta e gerenciar sua clínica de
                forma simples e segura.
              </p>
            </div>
            <InputGroup>
              <InputGroupAddon class="!bg-white/40">
                <UserIcon class="w-4 h-4" />
              </InputGroupAddon>
              <InputText
                id="username"
                type="text"
                placeholder="Usuário"
                v-model="form.username"
                class="!bg-white/40"
              />
              <Message
                v-if="$form.username?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.username.error?.message }}</Message
              >
            </InputGroup>
            <div class="flex flex-col gap-1">
              <InputGroup>
                <InputGroupAddon class="!bg-white/40">
                  <Key class="w-4 h-4" />
                </InputGroupAddon>
                <Password
                  name="password"
                  placeholder="Password"
                  v-model="form.password"
                  toggleMask
                  class="*:!bg-white/40"
                  promptLabel="Digite sua senha"
                  weakLabel="Senha fraca"
                  mediumLabel="Senha média"
                  strongLabel="Senha forte"
                />
              </InputGroup>
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
                >Esqueci minha senha</a
              >
            </div>

            <Button
              type="submit"
              severity="contrast"
              label="Entrar"
              class="hover:!bg-[#CEF261] hover:!text-black"
            />
          </Form>
        </template>
      </Card>
    </div>
  </VideoComponent>
</template>

<script lang="ts" setup>
import VideoComponent from "@/components/VideoComponent.vue";
import { Key, LogIn, UserIcon } from "lucide-vue-next";
import Card from "primevue/card";
import Password from "primevue/password";
import { Button, InputGroup, InputGroupAddon, InputText } from "primevue";
import { reactive, ref } from "vue";
// @ts-ignore
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { Form } from "@primevue/forms";

const toast = useToast();

const resolver = ref(
  zodResolver(
    z.object({
      username: z.string().min(1, { message: "Username is required." }),
      password: z
        .string()
        .min(8, { message: "Minimo de 8 caracteres" })
        .max(48, { message: "Máximo de 48 caracteres." })
        .refine((value) => /[a-z]/.test(value), {
          message: "Deve conter uma letra minúscula.",
        })
        .refine((value) => /[A-Z]/.test(value), {
          message: "Deve conter uma letra maiúscula.",
        })
        .refine((value) => /d/.test(value), {
          message: "Deve conter um número.",
        }),
    })
  )
);

const onFormSubmit = ({ valid }) => {
  if (valid) {
    console.log("Form submitted successfully:", form);

    toast.add({
      severity: "success",
      summary: "Form is submitted.",
      life: 3000,
    });
  }
};

const form = reactive({
  username: "",
  password: "",
});
</script>
