#!/bin/bash

# Docker Compose Tester - Quick Start Script
# Este script automatiza o processo de inicialização

set -e

echo "=========================================="
echo "Docker Compose Tester - Quick Start"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
echo -e "${BLUE}[1/4]${NC} Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Por favor, instale Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker encontrado: $(docker --version)${NC}"

# Verificar se Docker Compose está instalado
echo -e "${BLUE}[2/4]${NC} Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose não encontrado.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose encontrado: $(docker-compose --version)${NC}"

# Verificar portas disponíveis
echo -e "${BLUE}[3/4]${NC} Verificando portas..."
for port in 3000 8080 8081; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠ Porta $port já está em uso${NC}"
    else
        echo -e "${GREEN}✓ Porta $port disponível${NC}"
    fi
done

# Iniciar containers
echo -e "${BLUE}[4/4]${NC} Iniciando containers..."
echo ""

docker-compose up --build

echo ""
echo -e "${GREEN}=========================================="
echo "✓ Serviços iniciados com sucesso!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Acesse:${NC}"
echo -e "  • Tester:  ${GREEN}http://localhost:3000${NC}"
echo -e "  • Apache:  ${GREEN}http://localhost:8080${NC}"
echo -e "  • Nginx:   ${GREEN}http://localhost:8081${NC}"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para parar os containers${NC}"
