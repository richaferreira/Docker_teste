# 🐳 Docker Quick Start

## ⚡ Início Rápido (30 segundos)

### Linux/Mac
```bash
cd docker-compose-tester
./start.sh
```

### Windows
```bash
cd docker-compose-tester
start.bat
```

### Ou use Docker Compose diretamente
```bash
docker-compose up --build
```

Pronto! Acesse http://localhost:3000

---

## 📋 O que é instalado?

| Serviço | Porta | URL | Descrição |
|---------|-------|-----|-----------|
| **Tester** | 3000 | http://localhost:3000 | Aplicação web de teste |
| **Apache** | 8080 | http://localhost:8080 | Servidor HTTP Apache |
| **Nginx** | 8081 | http://localhost:8081 | Servidor web Nginx |

---

## 🛑 Parar os Serviços

```bash
# Parar mantendo dados
docker-compose down

# Parar e remover tudo
docker-compose down -v
```

---

## 📊 Comandos Essenciais

```bash
# Ver status
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Reiniciar um serviço
docker-compose restart tester

# Entrar em um container
docker-compose exec tester sh
```

---

## 🔧 Customizações

### Mudar porta da aplicação

Edite `docker-compose.yml`:
```yaml
tester:
  ports:
    - "3001:3000"  # Usar porta 3001
```

### Adicionar conteúdo ao Apache

Crie arquivos em `./apache-content/`:
```bash
echo "<h1>Meu conteúdo</h1>" > ./apache-content/test.html
```

Acesse em: http://localhost:8080/test.html

### Adicionar conteúdo ao Nginx

Crie arquivos em `./nginx-content/`:
```bash
echo "<h1>Meu conteúdo</h1>" > ./nginx-content/test.html
```

Acesse em: http://localhost:8081/test.html

---

## 🆘 Troubleshooting

### Porta já está em uso
```bash
# Encontre qual processo está usando a porta
lsof -i :3000

# Ou mude a porta no docker-compose.yml
```

### Docker não está rodando
```bash
# Inicie o Docker Desktop ou Docker Engine
docker ps
```

### Containers não iniciam
```bash
# Veja os logs de erro
docker-compose logs

# Reconstrua do zero
docker-compose down -v
docker-compose up --build
```

---

## 📚 Documentação Completa

Para mais detalhes, veja [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

---

## 🎯 Próximos Passos

1. **Teste de Carga**: Acesse http://localhost:3000 e use a aba "LOAD TEST"
2. **Customize Conteúdo**: Adicione seus próprios arquivos em `apache-content/` e `nginx-content/`
3. **Deploy**: Veja [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) para instruções de produção

---

**Versão**: 1.0  
**Última atualização**: 2026-03-12
