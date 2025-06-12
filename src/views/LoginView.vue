<template>
  <VideoComponent>
    <header class="text-center mb-4 text-black max-w-2xl">
      <img
        src="@/assets/images/logo.png"
        alt="Mednova Logo"
        class="w-24 h-24 mb-1 mx-auto"
      />
      <h1 class="text-4xl font-normal mb-2">Mednova</h1>
      <p class="text-xl">Automação Inteligente para Clínicas Modernas</p>
      <p class="text-md">
        Faça login para acessar sua conta e gerenciar sua clínica de forma
        simples e segura.
      </p>
    </header>
    <div class="max-w-2xl p-4">
      <Card
        class="!shadow-xl !backdrop-blur-xl !bg-white/0 !bg-gradient-to-b !from-white/20 !to-white/80 border border-white/10 !rounded-2xl !px-2 !py-4 w-screen max-w-full"
      >
        <template #title class="flex flex-col items-center">
          <div
            class="flex items-center justify-center mb-2 rounded-xl w-fit gap-2 text-sm"
          >
            <LogIn class="stroke-[2.4px] w-4 h-4" />
            <h2 class="font-semibold text-center">Entrar</h2>
          </div>
        </template>
        <template #content>
          <Form
            v-slot="$form"
            :resolver="resolver"
            :initialValues="form"
            @submit="onFormSubmit"
            class="flex justify-center flex-col gap-4"
          >
            <div class="flex flex-col gap-1 w-full">
              <InputText
                name="username"
                type="text"
                placeholder="Username"
                size="small"
                class="w-full"
              />
              <Message
                v-if="$form.username?.invalid"
                severity="error"
                size="small"
                variant="simple"
                >{{ $form.username.error?.message }}</Message
              >
            </div>
            <div class="flex flex-col gap-1 w-full">
              <Password
                name="password"
                placeholder="Password"
                :feedback="false"
                size="small"
                class="w-full"
                fluid
              />
              <template v-if="$form.password?.invalid">
                <Message
                  v-for="(error, index) of $form.password.errors"
                  :key="index"
                  severity="error"
                  size="small"
                  variant="simple"
                  >{{ error.message }}</Message
                >
              </template>
            </div>
            <Button type="submit" severity="secondary" label="Submit" />
          </Form>
        </template>
      </Card>
    </div>
  </VideoComponent>
</template>

<script lang="ts" setup>
import VideoComponent from "@/components/VideoComponent.vue";
import { LogIn } from "lucide-vue-next";
import Card from "primevue/card";
import Password from "primevue/password";
import { InputText } from "primevue";
import { reactive, ref } from "vue";
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
