.PHONY: help build up down logs restart clean test ps

help:
	@echo "Docker Compose Tester - Makefile Commands"
	@echo ""
	@echo "Usage: make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  build       - Build Docker images"
	@echo "  up          - Start all containers"
	@echo "  down        - Stop all containers"
	@echo "  restart     - Restart all containers"
	@echo "  logs        - View logs from all containers"
	@echo "  logs-tester - View logs from tester only"
	@echo "  logs-apache - View logs from apache only"
	@echo "  logs-nginx  - View logs from nginx only"
	@echo "  ps          - Show container status"
	@echo "  clean       - Remove containers and volumes"
	@echo "  shell-tester- Enter tester container shell"
	@echo "  shell-apache- Enter apache container shell"
	@echo "  shell-nginx - Enter nginx container shell"
	@echo "  test        - Run tests"
	@echo "  help        - Show this help message"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-tester:
	docker-compose logs -f tester

logs-apache:
	docker-compose logs -f apache

logs-nginx:
	docker-compose logs -f nginx

ps:
	docker-compose ps

clean:
	docker-compose down -v

shell-tester:
	docker-compose exec tester sh

shell-apache:
	docker-compose exec apache bash

shell-nginx:
	docker-compose exec nginx bash

test:
	@echo "Testing Apache..."
	curl -f http://localhost:8080/ > /dev/null && echo "✓ Apache OK" || echo "✗ Apache FAILED"
	@echo "Testing Nginx..."
	curl -f http://localhost:8081/ > /dev/null && echo "✓ Nginx OK" || echo "✗ Nginx FAILED"
	@echo "Testing Tester..."
	curl -f http://localhost:3000/ > /dev/null && echo "✓ Tester OK" || echo "✗ Tester FAILED"

.DEFAULT_GOAL := help
