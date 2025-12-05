# Lab3 - Простой проект с Backend и Frontend

## Быстрый старт

### Запуск через Docker Compose

```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Остановка
docker-compose down
```

После запуска:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/backend/api/hello

## Что реализовано

### Backend (JAX-RS)
- Простой REST endpoint `/api/hello` 
- Возвращает JSON с приветственным сообщением
- Использует WildFly 34 с JDK 17

### Frontend (React + TanStack Store)
- Компонент `TestApi` для тестирования API
- Использует TanStack Store для хранения состояния
- Отображает ответ от сервера

## Структура проекта

```
lab3/
├── backend/              # Java backend (JAX-RS)
│   ├── src/main/java/   # Исходный код
│   ├── pom.xml          # Maven конфигурация
│   └── Dockerfile       # Docker образ
├── frontend/            # React frontend
│   ├── src/            # Исходный код
│   ├── package.json    # npm зависимости
│   └── Dockerfile      # Docker образ
└── docker-compose.yml  # Docker Compose конфигурация
```

## Команды для сборки

### Полная сборка через Docker
```bash
docker-compose up --build
```

### Локальная сборка Backend (опционально)
```bash
cd backend
mvn clean package
```

### Локальная разработка Frontend (опционально)
```bash
cd frontend
npm install
npm run dev
```

## Тестирование API

После запуска откройте http://localhost - на главной странице будет компонент для тестирования API.

Или через curl:
```bash
curl http://localhost/api/hello
curl http://localhost/api/hello?name=User
```

Подробная инструкция в файле [BUILD.md](./BUILD.md)

