# --- Estágio 1: Build ---
# Use a versão do Node que você usa no desenvolvimento
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copia o package.json e o lock file
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código do seu projeto
COPY . .

# Roda o comando de build para gerar os arquivos estáticos
RUN npm run build

# --- Estágio 2: Produção ---
# Usa uma imagem leve do Nginx para servir os arquivos
FROM nginx:stable-alpine

# Copia os arquivos estáticos gerados no estágio de build
# O Vue geralmente gera os arquivos na pasta 'dist'
COPY --from=build-stage /app/dist /usr/share/nginx/html

# (Opcional, mas recomendado) Copia uma configuração customizada do Nginx
# para lidar com rotas de Single Page Application (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80, que é a padrão do Nginx
EXPOSE 3100

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]