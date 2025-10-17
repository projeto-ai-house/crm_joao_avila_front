<template>
  <div class="w-full h-full">
    <Tabs value="0">
      <TabList>
        <Tab value="0">
          <span class="text-sm font-semibold">Usuário</span>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <Form
            ref="formUser"
            v-slot="$form"
            :initialValues="initialValues"
            :resolver="resolver"
            @submit="handleSubmit"
            class="grid grid-cols-12 gap-4"
          >
            <!-- Nome -->
            <div class="flex flex-col col-span-12 md:col-span-6">
              <FloatLabel variant="on">
                <InputText
                  id="name"
                  name="name"
                  v-model="initialValues.name"
                  class="w-full"
                />
                <label for="name"> Nome Completo </label>
              </FloatLabel>
              <Message
                v-if="$form.name?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.name.error.message }}
              </Message>
            </div>

            <!-- Email -->
            <div class="flex flex-col col-span-12 md:col-span-6">
              <FloatLabel variant="on">
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  v-model="initialValues.email"
                  class="w-full"
                />
                <label for="email"> Email </label>
              </FloatLabel>
              <Message
                v-if="$form.email?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.email.error.message }}
              </Message>
            </div>

            <!-- Nova Senha -->
            <div class="flex flex-col col-span-12 md:col-span-6 lg:col-span-6">
              <FloatLabel variant="on">
                <Password
                  id="newPassword"
                  name="newPassword"
                  v-model="initialValues.newPassword"
                  class="w-full"
                  fluid
                  :feedback="true"
                  toggle-mask
                />
                <label for="newPassword">Nova Senha</label>
              </FloatLabel>
              <Message
                v-if="$form.newPassword?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.newPassword.error.message }}
              </Message>
              <small class="text-gray-500 ml-1 mt-0.5">
                Deixe em branco se não quiser alterar a senha
              </small>
            </div>

            <!-- Confirmar Nova Senha -->
            <div class="flex flex-col col-span-12 md:col-span-6 lg:col-span-6">
              <FloatLabel variant="on">
                <Password
                  id="confirmPassword"
                  name="confirmPassword"
                  v-model="initialValues.confirmPassword"
                  class="w-full"
                  fluid
                  :feedback="false"
                  toggle-mask
                />
                <label for="confirmPassword">Confirmar Nova Senha</label>
              </FloatLabel>
              <Message
                v-if="$form.confirmPassword?.invalid"
                severity="error"
                size="small"
                variant="simple"
              >
                {{ $form.confirmPassword.error.message }}
              </Message>
              <small class="text-gray-500 ml-1 mt-0.5">
                Deixe em branco se não quiser alterar a senha
              </small>
            </div>

            <!-- Botões -->
            <div
              class="flex flex-col justify-end sm:flex-row gap-3 pt-4 col-span-12"
            >
              <Button
                type="submit"
                label="Salvar Alterações"
                :loading="isLoading"
                severity="primary"
              />
              <Button
                type="button"
                label="Cancelar"
                @click="resetForm"
                severity="secondary"
                outlined
              />
            </div>
          </Form>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { Tab, TabList, TabPanel, TabPanels, Tabs, useToast } from "primevue";
//@ts-ignore
import { Form } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import Button from "primevue/button";
import FloatLabel from "primevue/floatlabel";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Password from "primevue/password";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";
import { RolesServices } from "../../../services/roles/RolesServices";
import { UsersServices } from "../../../services/user/UsersServices";
import { useUserStore } from "../../../stores/user";
import { PermissionsUtils } from "../../../utils/PermissionsUtils";

const router = useRouter();
const toast = useToast();
const isLoading = ref(false);
const userStore = useUserStore();
const formUser = ref(null);
const role = ref(null);

// Valores iniciais do formulário
const initialValues = ref({
  name: "",
  email: "",
  newPassword: "",
  confirmPassword: "",
});

// Schema de validação com Zod
const getValidationSchema = () => {
  return z
    .object({
      name: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (
              val &&
              val.trim().length > 0 &&
              val.trim().split(/\s+/).length <= 1
            ) {
              return false;
            }
            return true;
          },
          {
            message: "Informe o nome completo",
          }
        ),
      email: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (
              val &&
              val.trim().length > 0 &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
            ) {
              return false;
            }
            return true;
          },
          {
            message: "Email inválido",
          }
        ),
      newPassword: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (val && val.length > 0 && val.length < 6) {
              return false;
            }
            return true;
          },
          { message: "Nova senha deve ter pelo menos 6 caracteres" }
        ),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) => {
        if (data.newPassword && data.newPassword !== data.confirmPassword) {
          return false;
        }
        return true;
      },
      {
        message: "Senhas não conferem",
        path: ["confirmPassword"],
      }
    );
};

const resolver = ref(zodResolver(getValidationSchema()));

// Função para carregar dados do usuário
const loadUserData = async () => {
  try {
    const userData = userStore.user;
    initialValues.value.name = userData.Nome || "";
    initialValues.value.email = userData.Email || "";
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Erro ao carregar dados do usuário",
      life: 5000,
    });
  }
};

// Função para salvar alterações
const handleSubmit = async ({ valid, values }) => {
  if (!valid) {
    toast.add({
      severity: "error",
      summary: "Formulário Inválido",
      detail: "Por favor, corrija os erros antes de salvar",
      life: 4000,
    });
    return;
  }

  // Validação adicional para confirmação de senha
  if (
    initialValues.value.newPassword &&
    initialValues.value.newPassword !== initialValues.value.confirmPassword
  ) {
    toast.add({
      severity: "error",
      summary: "Erro de Validação",
      detail: "Senhas não conferem",
      life: 4000,
    });
    return;
  }

  isLoading.value = true;

  try {
    const updateData = {
      ID: userStore.user.ID,
      nome_completo: initialValues.value.name,
      Email: initialValues.value.email,
      password_hash: initialValues.value.newPassword || undefined,
    };

    const response = await UsersServices.putUser({
      Usuario: updateData,
      Role: {
        role_id: role.value,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      // Limpar senhas após sucesso
      initialValues.value.newPassword = "";
      initialValues.value.confirmPassword = "";
    }
  } catch (error) {
    console.log("Erro ao atualizar perfil:", error);
  } finally {
    isLoading.value = false;
  }
};

// Função para resetar o formulário
const resetForm = () => {
  initialValues.value = {
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  };
  loadUserData();
};

onMounted(async () => {
  const rolesList = await RolesServices.getRoles({});
  const [current_role_name] = PermissionsUtils.handleUser();

  const current_role = rolesList?.data?.data.find((r) =>
    r.Nome.toLowerCase()?.includes(current_role_name.toLowerCase())
  );
  if (current_role) {
    role.value = current_role?.ID;
  }

  console.log(role.value);

  const state = router.options.history?.state;
  const inRecovery = state?.inRecovery
    ? JSON.parse(state?.inRecovery as string)
    : false;

  if (inRecovery) {
    toast.add({
      severity: "warn",
      summary: "Você recuperou seu acesso!",
      detail: "Altere sua senha já!",
      life: 8000,
    });
  }

  console.log(userStore.user);

  // Carregar dados do usuário
  loadUserData();
});
</script>

<style scoped>
::v-deep(.p-tabpanels) {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

@media (min-width: 640px) {
  ::v-deep(.p-tabpanels) {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}
</style>
