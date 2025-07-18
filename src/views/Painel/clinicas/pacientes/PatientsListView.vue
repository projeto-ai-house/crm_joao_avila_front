<template>
  <!-- BEGIN: TopBar -->
  <div class="flex justify-between items-center pl-1 py-4 bg-white">
    <div>
      <h2 class="font-semibold text-gray-500">Lista de Usuários</h2>
      <p class="text-sm text-gray-400">
        Gerencie os usuários do sistema, incluindo suas informações e
        permissões.
      </p>
    </div>
    <Button
      label="Adicionar"
      icon="pi pi-plus"
      severity="primary"
      size="small"
      @click="
        inEdition = null;
        drawerState = true;
      "
      :disabled="!permissionsUserPage.editar"
    ></Button>
  </div>
  <!-- END: TopBar -->

  <!-- BEGIN: Table -->
  <div class="border border-gray-200/70 rounded-lg overflow-hidden">
    <DataTable
      :value="users"
      v-model:expandedRows="expandedRows"
      stripedRows
      tableStyle="min-width: 50rem"
      :rows="rows"
      v-model:selection="selectedUsers"
      dataKey="ID"
      size="small"
      :loading="loading"
      class="text-sm"
    >
      <template #empty> Nenhum usuário encontrada. </template>
      <template #loading>
        <span class="!text-gray-500 flex items-center justify-center gap-2">
          <i class="pi pi-spin pi-spinner text-gray-500"></i>
          Carregando usuários
        </span>
      </template>

      <Column field="NomeCompleto" header="Nome" sortable>
        <template #body="slotProps">
          <span class="font-semibold text-gray-600">{{
            slotProps.data.NomeCompleto
          }}</span>
        </template>
      </Column>
      <Column field="Email" header="E-mail" sortable></Column>
      <Column field="Convenio" header="Convênio" sortable></Column>
      <Column field="Cargo" header="Cargo" sortable></Column>
      <Column
        field="Vinculos"
        header="Vínculos"
        sortable
        v-if="userStore.user?.Role.includes('CEO/DONO')"
      >
        <template #body="slotProps">
          <div
            v-if="
              slotProps.data?.Role?.nome == 'MEDICO' &&
              !userStore.user?.Role.includes('adm')
            "
          >
            {{
              slotProps.data.Vinculos?.length
                ? slotProps.data.Vinculos.map((v) => v.name).join(", ")
                : "Nenhum vínculo"
            }}
          </div>
          <MultiSelect
            v-else-if="
              slotProps.data?.Role?.nome === 'SECRETARIA' &&
              !userStore.user?.Role.includes('adm')
            "
            :placeholder="linksLoading ? 'Carregando...' : 'Selecione'"
            :loading="linksLoading"
            v-model="slotProps.data.Vinculos"
            optionLabel="name"
            class="max-w-sm"
            size="small"
            fluid
            :filter="false"
            :showToggleAll="false"
            :options="
              users
                .filter(
                  (user) =>
                    user.ID !== slotProps.data.ID &&
                    user?.Role?.id !==
                      users.find((u) => u.ID === slotProps.data.ID)?.Role?.id
                )
                .map((user) => ({
                  name: user.NomeCompleto,
                  value: user.ID,
                }))
            "
          >
            <template #header>
              <div class="font-medium px-3 py-2">Vincular com:</div>
            </template>
            <template #footer>
              <div class="p-3 flex gap-2">
                <Button
                  label="Salvar"
                  severity="info"
                  fluid
                  size="small"
                  icon="pi pi-plus"
                  :loading="linksLoading"
                  :disabled="!permissionsUserPage.editar || linksLoading"
                  @click="
                    saveUserLinks(
                      slotProps.data.ID,
                      slotProps.data.Vinculos,
                      users
                        .filter(
                          (user) =>
                            user.ID !== slotProps.data.ID &&
                            user?.Role?.id !==
                              users.find((u) => u.ID === slotProps.data.ID)
                                ?.Role?.id
                        )
                        .map((user) => ({
                          name: user.NomeCompleto,
                          value: user.ID,
                        }))
                    )
                  "
                />
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column headerStyle="width:4rem">
        <template #body="slotProps">
          <div class="flex items-center justify-center">
            <Button
              icon="pi pi-user-edit"
              label="Editar"
              severity="secondary"
              size="small"
              variant="text"
              @click="
                inEdition = slotProps.data;
                drawerState = true;
              "
              :disabled="!permissionsUserPage.editar"
            />
            <Button
              icon="pi pi-trash"
              label="Excluir"
              severity="danger"
              size="small"
              variant="text"
              class="ml-2"
              @click="
                userInDeletion = slotProps.data.ID;
                confirmDeleteUser();
              "
              :disabled="!permissionsUserPage.excluir"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Paginator
      :rows="rows"
      :totalRecords="totalRecords"
      :first="(currentPage - 1) * rows"
      @page="changePage"
    />
  </div>
  <!-- END: Table -->
</template>

<script setup lang="ts">
import { Button, MultiSelect, Paginator, useConfirm, useToast } from "primevue";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { UserLinksServices } from "../../../../services/user/UserLinksServices";
import { UsersServices } from "../../../../services/user/UsersServices";
import { useUserStore } from "../../../../stores/user";
import { PermissionsUtils } from "../../../../utils/PermissionsUtils";

const toast = useToast();
const loading = ref(false);
const linksLoading = ref(false);
const drawerState = ref(false);
const inEdition = ref(null);
const selectedUsers = ref([]);
const userInDeletion = ref(null);
const expandedRows = ref({});
const userStore = useUserStore();
const confirm = useConfirm();
const users = ref([]);
const router = useRouter();
const permissionsUserPage = ref(
  PermissionsUtils.checkMethodPemission(router.currentRoute.value.fullPath)
);

const rows = 20; // número fixo de itens por página
const totalRecords = ref(0);
const currentPage = ref(1);

function changePage(event: any) {
  currentPage.value = event.page + 1;
  fetchUsers();
}

async function saveUserLinks(userId: string, links: any[], users: any[]) {
  if (!links || links.length < 1) {
    toast.add({
      severity: "warn",
      summary: "Aviso",
      detail: "Selecione pelo menos um usuário para vincular.",
      life: 3000,
    });
    linksLoading.value = false;
    return;
  }
  linksLoading.value = true;
  console.log(users);
  console.log("links", links);

  let added = 0;
  let removed = 0;

  for await (const user of users) {
    try {
      let response: any;
      const link = links.find((l) => l.value === user.value);
      if (!link) {
        response = await UserLinksServices.deleteLink({
          SecretariaID: userId,
          MedicoID: user.value,
        });
        if (response.status === 200) {
          removed++;
        }
        continue;
      }
      response = await UserLinksServices.postLink({
        SecretariaID: userId,
        MedicoID: link?.value,
      });
      if (response.status === 200) {
        added++;
      }
      continue;
    } catch (error) {
      continue;
    }
  }
  if (added > 0 || removed > 0) {
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: `Vínculos atualizados com sucesso! Adicionados: ${added}, Removidos: ${removed}`,
      life: 3000,
    });
  } else {
    toast.add({
      severity: "warn",
      summary: "Aviso",
      detail: "Nenhum vínculo foi adicionado ou removido.",
      life: 3000,
    });
  }
  await fetchUserLinks();
  linksLoading.value = false;
}

const confirmDeleteUser = () => {
  try {
    confirm.require({
      message: "Você tem certeza que deseja salvar as alterações?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "Cancelar",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Confirmar",
        severity: "danger",
        outlined: true,
      },
      accept: () => {
        deleteUser(userInDeletion.value);
      },
      reject: () => {
        userInDeletion.value = null;
      },
    });
  } catch (error) {
    console.error("Erro na validação:", error);
  }
};

async function deleteUser(userId: string) {
  try {
    const response = await UsersServices.deleteUser(userId);
    if (response.status === 200) {
      fetchUsers();
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
}

async function fetchUsers() {
  try {
    loading.value = true;
    const response = await UsersServices.getUsers({
      page: currentPage.value,
    });
    if (response.status === 200) {
      users.value =
        response.data?.data?.Usuarios?.map((it: any) => ({
          ...it,
          Cargo: it.Role?.nome || "N/A",
        })) || [];
      totalRecords.value = response.data?.data?.Itens || 0;
    }
  } catch (error) {
    console.error("Error fetching clinics:", error);
  } finally {
    loading.value = false;
  }
}

async function fetchUserLinks() {
  try {
    loading.value = true;
    linksLoading.value = true;
    const response = await UserLinksServices.getLinks();
    if (response.status !== 200) {
      throw new Error("Failed to fetch user links");
    }
    const vinculos = response.data?.data || [];
    console.log("Vínculos:", vinculos);

    users.value = users.value.map((user) => {
      const currentUserLinks = vinculos?.filter(
        (link: any) => link.Secretaria.ID === user.ID
      );
      return {
        ...user,
        Vinculos: currentUserLinks.map((link: any) => ({
          name: link.Medico.NomeCompleto,
          value: link.Medico.ID,
        })),
      };
    });
    users.value = users.value.map((user) => {
      const currentUserLinks = vinculos.filter(
        (link: any) => link.Medico.ID === user.ID
      );
      return {
        ...user,
        Vinculos: [
          ...(user.Vinculos || []),
          ...currentUserLinks.map((link: any) => ({
            name: link.Secretaria.NomeCompleto,
            value: link.Secretaria.ID,
          })),
        ],
      };
    });
  } catch (error) {
    console.error("Error fetching user links:", error);
  } finally {
    loading.value = false;
    linksLoading.value = false;
  }
}

onMounted(async () => {
  await fetchUsers();
  if (users.value.length) await fetchUserLinks();
});
</script>

<style>
.p-overlay-mask {
  background-color: #437efd11 !important;
  backdrop-filter: blur(5px);
  color: #4c71c0;
  font-weight: 600;
}
</style>
