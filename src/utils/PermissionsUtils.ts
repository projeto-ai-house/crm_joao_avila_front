// import { useUserStore } from "../stores/user";

import { useUserStore } from "../stores/user";

export class PermissionsUtils {
  public static handle(): [string, string[], boolean] {
    // recupera dados do usuario logado
    const { user } = useUserStore();

    // {
    //   "ID": "69ea5775-f706-48e7-b531-3dd5e45d2a2b",
    //   "Email": "adm@adm",
    //   "Nome": "adm@adm",
    //   "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG0iOnRydWUsImNsaW5pY2FfaWQiOiIiLCJleHAiOjE3NTA1NTM2MDQsImlkIjoiNjllYTU3NzUtZjcwNi00OGU3LWI1MzEtM2RkNWU0NWQyYTJiIiwicGVybWlzc29lcyI6WyJtYXN0ZXJfYWRtaW4iXSwicm9sZSI6IkFETSIsInVzdWFyaW8iOiJhZG1AYWRtIn0.F-VbJf1MaLPlPnVZ19Rek_LXWMfUjuonch4NoQ0sY6M",
    //   "Permissoes": [
    //     "master_admin"
    //   ],
    //   "Cpf": "",
    //   "DataNascimento": "",
    //   "Convenio": "",
    //   "DataCriacao": "",
    //   "Role": "ADM",
    //   "Clinica": []
    // }

    if (!user || !user.ID) {
      return ["", [], true];
    }

    // verificar se usuario é admin
    const [ADMIN_ROLE, ADMIN_PERMISSION] =
      import.meta.env.VITE_ADMIN_ROLENAMES?.split(",");

    if (
      user.Permissoes === ADMIN_ROLE &&
      user.Permissoes.includes(ADMIN_PERMISSION)
    ) {
      return [ADMIN_ROLE, [ADMIN_PERMISSION], false];
    } else {
      return [
        user.Role || "",
        user.Permissoes || [],
        user.Permissoes.length === 0,
      ];
    }
  }
}
