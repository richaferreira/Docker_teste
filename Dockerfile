# Estágio 1: Build do React
FROM node:20-alpine AS build
WORKDIR /app

# Copia arquivos de dependências da raiz
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copia TODOS os arquivos do projeto (importante para os Aliases funcionarem)
COPY . .

# Roda o build de dentro da pasta raiz, mas apontando para o arquivo de config
RUN npx vite build client --config vite.config.ts

# Estágio 2: Servindo com Nginx
FROM nginx:stable-alpine
# O Vite por padrão joga o build na pasta dist/public conforme seu config
COPY --from=build /app/dist/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]