# 🚀 Guia de Deploy Automatizado

Este documento explica como configurar e usar o sistema de deploy automatizado para transferir o projeto para sua VPS via SSH e executar os comandos Docker.

## 📋 Pré-requisitos

### No seu computador (local):

- Node.js instalado (v16 ou superior)
- Acesso SSH à VPS (usuário/senha ou chave privada)

### Na VPS (servidor):

- Docker instalado
- Docker Compose instalado
- Acesso SSH configurado
- Diretório de destino criado (ou o script criará automaticamente)

## 🔧 Configuração Inicial

### 1. Instale as dependências (já feito)

```bash
npm install
```

### 2. Configure o arquivo de credenciais

Crie o arquivo `.env.deploy` a partir do exemplo:

```bash
npm run deploy:setup
```

Ou manualmente:

```bash
copy .env.deploy.example .env.deploy
```

### 3. Edite o arquivo `.env.deploy`

Abra o arquivo `.env.deploy` e configure com suas informações:

```env
# Informações do servidor
VPS_HOST=seu-servidor.com.br
VPS_PORT=22
VPS_USERNAME=root

# Autenticação (escolha uma)
VPS_PASSWORD=sua_senha_aqui
# OU
# VPS_PRIVATE_KEY_PATH=C:\Users\seu_usuario\.ssh\id_rsa

# Configurações do projeto
VPS_REMOTE_DIR=/var/www/crm-joao-avila
DOCKER_COMPOSE_FILE=docker-compose.yml
PROJECT_NAME=CRM João Avila
```

## 🎯 Como Usar

### Deploy completo (recomendado)

Para fazer o deploy completo do projeto:

```bash
npm run deploy
```

Este comando irá:

1. ✅ Validar as configurações
2. 📦 Compactar o projeto (excluindo node_modules, dist, etc)
3. 🔌 Conectar ao servidor via SSH
4. 📤 Enviar o projeto compactado
5. 📂 Extrair os arquivos no servidor
6. 🛑 Parar os containers antigos
7. 🐳 Fazer pull das imagens Docker
8. 🚀 Reconstruir e iniciar os containers
9. 📊 Mostrar o status dos containers

## 📁 Arquivos Importantes

### `deploy.js`

Script principal de deploy que gerencia todo o processo.

### `.env.deploy`

Arquivo de configuração com credenciais (⚠️ **NÃO comite este arquivo**)

### `.env.deploy.example`

Exemplo de configuração (pode ser commitado)

### `.dockerignore`

Define quais arquivos não devem ser incluídos na imagem Docker

## 🔒 Segurança

### ⚠️ IMPORTANTE:

1. **Nunca comite o arquivo `.env.deploy`** com suas credenciais reais
2. Adicione `.env.deploy` ao `.gitignore`
3. Use chave SSH ao invés de senha quando possível
4. Mantenha permissões restritas no arquivo de credenciais

### Como usar chave SSH (mais seguro):

```env
# No .env.deploy
VPS_PRIVATE_KEY_PATH=C:\Users\seu_usuario\.ssh\id_rsa
# VPS_PASSWORD=  # deixe comentado
```

## 🐳 Configuração do Docker na VPS

Certifique-se de que sua VPS tem um arquivo `docker-compose.yml` ou que ele será enviado pelo deploy.

Exemplo básico de `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3100:3100"
    restart: always
    environment:
      - NODE_ENV=production
```

## 🔍 Verificação

Após o deploy, você verá algo assim:

```
🚀 ========================================
🚀   INICIANDO DEPLOY - CRM João Avila
🚀 ========================================

📦 Compactando projeto...
✅ Projeto compactado: 2.45 MB
🔌 Conectando ao servidor...
✅ Conectado com sucesso!
📁 Verificando diretório remoto...
✅ Diretório /var/www/crm-joao-avila pronto
📤 Enviando projeto para o servidor...
✅ Projeto enviado com sucesso!
📂 Extraindo projeto no servidor...
✅ Projeto extraído com sucesso!
🛑 Parando containers antigos...
✅ Containers parados
🐳 Fazendo pull das imagens Docker...
✅ Pull das imagens concluído
🚀 Iniciando containers...
✅ Containers iniciados com sucesso!
📊 Verificando status dos containers...

NAME                   IMAGE               STATUS
crm-app-1             crm-app:latest      Up 2 seconds

✅ ========================================
✅   DEPLOY CONCLUÍDO EM 45.32s
✅ ========================================
```

## 🛠️ Troubleshooting

### Erro de conexão SSH

- Verifique se o host, porta e credenciais estão corretos
- Teste a conexão manual: `ssh usuario@servidor.com`
- Verifique o firewall da VPS

### Erro no Docker

- Certifique-se de que Docker e Docker Compose estão instalados na VPS
- Verifique os logs: `docker-compose logs`
- Verifique permissões do usuário SSH para executar Docker

### Arquivo muito grande

- Verifique se o `.dockerignore` está excluindo node_modules e dist
- Remova arquivos grandes desnecessários antes do deploy

### Erro de permissão

- Verifique se o usuário SSH tem permissão de escrita no diretório
- Pode ser necessário usar `sudo` ou ajustar permissões

## 📞 Comandos Úteis

### Na VPS (via SSH):

```bash
# Ver logs dos containers
cd /var/www/crm-joao-avila
docker-compose logs -f

# Parar containers
docker-compose down

# Reiniciar containers
docker-compose restart

# Ver status
docker-compose ps

# Reconstruir sem cache
docker-compose build --no-cache
docker-compose up -d
```

## 🔄 Workflows Comuns

### Deploy de correção rápida:

```bash
# 1. Faça suas alterações no código
# 2. Execute o deploy
npm run deploy
```

### Deploy após mudanças no Dockerfile:

```bash
npm run deploy
# O script automaticamente reconstruirá a imagem
```

### Rollback manual (na VPS):

```bash
# Conecte via SSH
ssh usuario@servidor.com

# Vá para o diretório
cd /var/www/crm-joao-avila

# Use uma versão anterior (se tiver backup)
# ou reverta o código no git e faça novo deploy
```

## 📚 Bibliotecas Utilizadas

Este sistema usa bibliotecas confiáveis e bem mantidas:

- **node-ssh** (^13.0.0): Cliente SSH robusto para Node.js

  - Suporta autenticação por senha e chave privada
  - Transferência de arquivos via SCP
  - Execução de comandos remotos

- **dotenv** (^16.0.0): Gerenciamento de variáveis de ambiente

  - Carrega configurações do arquivo .env.deploy
  - Mantém credenciais seguras

- **archiver** (^7.0.0): Compactação de arquivos
  - Cria arquivos tar.gz otimizados
  - Reduz tempo de transferência

## 🎓 Dicas

1. **Teste local primeiro**: Execute `npm run build` para garantir que o projeto compila
2. **Backup**: Mantenha backups antes de fazer deploy em produção
3. **Logs**: Sempre verifique os logs após o deploy
4. **Monitoramento**: Configure alertas para monitorar o status da aplicação
5. **Atualizações**: Mantenha Docker e Node.js atualizados na VPS

## 📝 Notas Adicionais

- O script cria automaticamente o diretório remoto se não existir
- Arquivos temporários são limpos automaticamente após o deploy
- A compactação exclui automaticamente node_modules, dist, .git e outros arquivos desnecessários
- O processo é idempotente: pode ser executado múltiplas vezes com segurança

---

**Desenvolvido para o projeto CRM João Avila**

Para suporte, consulte a documentação do Docker e Node-SSH:

- [Docker Docs](https://docs.docker.com/)
- [Node-SSH GitHub](https://github.com/steelbrain/node-ssh)
