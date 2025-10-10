# 📁 Deploy Folder

Esta pasta contém os arquivos necessários para o deploy automatizado do projeto para a VPS.

## 📄 Arquivos

- **`deploy.js`** - Script principal de deploy
- **`.env.deploy.example`** - Template de configuração
- **`.env.deploy`** - Suas credenciais (não commitado, criado localmente)
- **`DEPLOY.md`** - Documentação completa

## 🚀 Como usar

1. Configure suas credenciais:

   ```bash
   npm run deploy:setup
   ```

2. Edite o arquivo `.env.deploy` com suas informações da VPS

3. Execute o deploy:
   ```bash
   npm run deploy
   ```

## 📚 Documentação Completa

Para instruções detalhadas, troubleshooting e exemplos, consulte [DEPLOY.md](./DEPLOY.md)
