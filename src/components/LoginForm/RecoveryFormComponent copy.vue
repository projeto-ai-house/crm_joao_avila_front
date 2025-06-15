<template>
  <Form
    v-slot="$form"
    :resolver="resolver"
    :initialValues="form"
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
        type="text"
        placeholder="E-mail"
        v-model="form.email"
        class="!bg-white/40"
      />
      <Message
        v-if="$form.email?.invalid"
        severity="error"
        size="small"
        variant="simple"
        >{{ $form.email.error?.message }}</Message
      >
    </InputGroup>

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
import { Key, LogIn, Mail, RefreshCcw, RefreshCcwDot, UserIcon } from "lucide-vue-next";
import Password from "primevue/password";
import { Button, InputGroup, InputGroupAddon, InputText } from "primevue";
import { reactive, ref } from "vue";
// @ts-ignore
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { useToast } from "primevue/usetoast";
import { z } from "zod";
import { Form } from "@primevue/forms";

const emit = defineEmits(["click:login"]);

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
  email: "",
});
</script>
