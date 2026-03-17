# Docker Compose Tester - Guia de Deployment

## 📋 Visão Geral

Este guia explica como rodar o **Docker Compose Tester** e seus servidores (Apache e Nginx) em containers Docker. O projeto inclui um Dockerfile para construir a aplicação web e um docker-compose.yml que orquestra todos os serviços.

## 🔧 Pré-requisitos

- **Docker Desktop** (versão 20.10+) ou **Docker Engine** com Docker Compose
- **Git** (para clonar o repositório)
- Portas 3000, 8080 e 8081 disponíveis na sua máquina

## 📦 Estrutura de Arquivos

```
docker-compose-tester/
├── Dockerfile                 # Build da aplicação web
├── docker-compose.yml         # Orquestração de containers
├── .dockerignore              # Arquivos ignorados no build
├── DOCKER_GUIDE.md           # Este arquivo
├── apache-content/
│   └── index.html            # Página padrão do Apache
├── nginx-content/
│   └── index.html            # Página padrão do Nginx
├── client/                   # Código React frontend
├── server/                   # Código Node.js backend
└── package.json              # Dependências do projeto
```

## 🚀 Guia Rápido

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/docker-compose-tester.git
cd docker-compose-tester
```

### 2. Construir e Iniciar os Containers

```bash
docker-compose up --build
```

Este comando:
- Constrói a imagem Docker da aplicação web
- Inicia 3 containers: Tester (porta 3000), Apache (porta 8080), Nginx (porta 8081)
- Aguarda os health checks de cada serviço

### 3. Acessar a Aplicação

Abra seu navegador e acesse:

- **Docker Compose Tester**: http://localhost:3000
- **Apache HTTP Server**: http://localhost:8080
- **Nginx Server**: http://localhost:8081

### 4. Parar os Containers

```bash
docker-compose down
```

Para remover volumes também:

```bash
docker-compose down -v
```

## 📊 Comandos Úteis

### Ver status dos containers

```bash
docker-compose ps
```

### Ver logs em tempo real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas o Tester
docker-compose logs -f tester

# Apenas Apache
docker-compose logs -f apache

# Apenas Nginx
docker-compose logs -f nginx
```

### Reiniciar um serviço específico

```bash
docker-compose restart tester
docker-compose restart apache
docker-compose restart nginx
```

### Executar comando dentro de um container

```bash
# Dentro do Tester
docker-compose exec tester sh

# Dentro do Apache
docker-compose exec apache bash

# Dentro do Nginx
docker-compose exec nginx bash
```

### Reconstruir a imagem sem cache

```bash
docker-compose build --no-cache
```

## 🏗️ Configuração Detalhada

### Dockerfile

O Dockerfile usa **multi-stage build** para otimizar o tamanho da imagem:

1. **Stage 1 (Builder)**: Instala dependências e faz build do projeto
2. **Stage 2 (Runtime)**: Copia apenas os arquivos necessários

Características:
- Base: `node:22-alpine` (imagem leve)
- Instala dependências com `pnpm`
- Build com `pnpm run build`
- Health check configurado
- Expõe porta 3000

### docker-compose.yml

Define 3 serviços:

#### Serviço `tester` (Aplicação Web)
- Imagem: Construída a partir do Dockerfile
- Porta: 3000
- Depende de: Apache e Nginx
- Health check: Verifica se a aplicação está respondendo

#### Serviço `apache`
- Imagem: `httpd:latest` (Apache HTTP Server)
- Porta: 8080 (mapeada para 80 interno)
- Volume: `./apache-content` → `/usr/local/apache2/htdocs`
- Health check: Testa conexão HTTP

#### Serviço `nginx`
- Imagem: `nginx:latest`
- Porta: 8081 (mapeada para 80 interno)
- Volume: `./nginx-content` → `/usr/share/nginx/html`
- Health check: Testa conexão HTTP

**Rede**: Todos os serviços estão conectados na rede `web-servers` para comunicação interna.

## 🔍 Verificando a Saúde dos Serviços

Docker Compose executa health checks automaticamente. Para ver o status:

```bash
docker-compose ps
```

Você verá algo como:

```
NAME                      STATUS
docker-compose-tester     Up 2 minutes (healthy)
docker-compose-apache     Up 2 minutes (healthy)
docker-compose-nginx      Up 2 minutes (healthy)
```

## 📝 Personalizando Conteúdo

### Apache

Edite ou adicione arquivos em `./apache-content/`:

```bash
echo "<h1>Meu conteúdo Apache</h1>" > ./apache-content/custom.html
```

Acesse em: http://localhost:8080/custom.html

### Nginx

Edite ou adicione arquivos em `./nginx-content/`:

```bash
echo "<h1>Meu conteúdo Nginx</h1>" > ./nginx-content/custom.html
```

Acesse em: http://localhost:8081/custom.html

## 🌐 Usando em Produção

### Build da Imagem

Para criar uma imagem Docker standalone (sem docker-compose):

```bash
docker build -t docker-compose-tester:latest .
```

### Executar Container Isolado

```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  docker-compose-tester:latest
```

### Push para Registry

```bash
# Fazer login
docker login

# Tagear imagem
docker tag docker-compose-tester:latest seu-usuario/docker-compose-tester:latest

# Push
docker push seu-usuario/docker-compose-tester:latest
```

## 🔐 Variáveis de Ambiente

O Dockerfile e docker-compose.yml suportam as seguintes variáveis:

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NODE_ENV` | `production` | Ambiente Node.js |
| `PORT` | `3000` | Porta da aplicação |

Para customizar, edite o `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
```

## 🐛 Troubleshooting

### Erro: "Port 3000 is already in use"

Mude a porta no docker-compose.yml:

```yaml
ports:
  - "3001:3000"  # Usar porta 3001 no host
```

### Erro: "Cannot connect to Docker daemon"

Certifique-se de que Docker está rodando:

```bash
docker ps
```

Se não funcionar, reinicie o Docker Desktop.

### Containers não iniciam

Verifique os logs:

```bash
docker-compose logs
```

### Health check falha

Aguarde alguns segundos e verifique novamente:

```bash
docker-compose ps
```

Se persistir, reconstrua:

```bash
docker-compose down
docker-compose up --build
```

## 📈 Performance

### Otimizar Build

1. Use `.dockerignore` para excluir arquivos desnecessários
2. Coloque instruções que mudam raramente no topo do Dockerfile
3. Use multi-stage build (já implementado)

### Otimizar Runtime

1. Use Alpine Linux (já implementado)
2. Instale apenas dependências de produção
3. Configure health checks apropriados

## 🔄 Atualizações

Para atualizar a aplicação:

```bash
# Puxar novas mudanças
git pull

# Reconstruir e reiniciar
docker-compose up --build
```

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [Apache Docker Hub](https://hub.docker.com/_/httpd)
- [Nginx Docker Hub](https://hub.docker.com/_/nginx)

## 💡 Dicas

1. **Desenvolvimento Local**: Use `docker-compose up` sem `--build` para reutilizar a imagem
2. **Debugging**: Use `docker-compose exec` para entrar em um container
3. **Logs**: Mantenha os logs rodando em outro terminal: `docker-compose logs -f`
4. **Volumes**: Mudanças em `apache-content/` e `nginx-content/` são refletidas imediatamente

## 📞 Suporte

Se encontrar problemas, verifique:

1. Versão do Docker: `docker --version`
2. Versão do Docker Compose: `docker-compose --version`
3. Logs dos containers: `docker-compose logs`
4. Portas disponíveis: `netstat -an | grep LISTEN`

---

**Versão**: 1.0  
**Última atualização**: 2026-03-12  
**Compatibilidade**: Docker 20.10+, Docker Compose 1.29+
