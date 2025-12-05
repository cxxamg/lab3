# Инструкция по сборке и запуску проекта

## Требования
- Docker и Docker Compose
- Maven (опционально, для локальной сборки backend)
- Node.js и npm (опционально, для локальной разработки frontend)

## Быстрый запуск через Docker Compose

### 1. Сборка и запуск всех сервисов

```bash
# Из корневой директории проекта
docker-compose up --build
```

Эта команда:
- Соберет backend (Maven сборка внутри Docker)
- Соберет frontend (Vite build внутри Docker)
- Запустит WildFly с backend
- Запустит Nginx с frontend

### 2. Проверка работы

После запуска:
- Frontend доступен по адресу: http://localhost
- Backend API доступен по адресу: http://localhost:8080/backend/api/hello
- Тестовый компонент на главной странице позволит проверить работу API

### 3. Остановка

```bash
docker-compose down
```

## Локальная разработка (опционально)

### Backend

```bash
cd backend
mvn clean package
# WAR файл будет в target/backend.war
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend будет доступен на http://localhost:5173
```

## Структура проекта

```
lab3/
├── backend/
│   ├── src/main/java/com/lab3/rest/
│   │   ├── HelloResource.java      # REST endpoint
│   │   └── JaxRsApplication.java   # JAX-RS конфигурация
│   ├── pom.xml                     # Maven конфигурация
│   └── Dockerfile                  # Docker образ для backend
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TestApi.jsx         # Компонент для тестирования API
│   │   └── ...
│   ├── package.json
│   ├── Dockerfile                  # Docker образ для frontend
│   └── nginx.conf                  # Nginx конфигурация
└── docker-compose.yml              # Docker Compose конфигурация
```

## API Endpoints

### GET /api/hello
Возвращает приветственное сообщение.

**Параметры:**
- `name` (query, опционально) - имя для приветствия

**Пример:**
```bash
curl http://localhost/api/hello
curl http://localhost/api/hello?name=User
```

**Ответ:**
```json
{
  "message": "Hello, User!",
  "timestamp": "1234567890"
}
```

## Устранение проблем

### Backend не запускается
- Проверьте, что порт 8080 свободен
- Проверьте логи: `docker-compose logs wildfly`

### Frontend не подключается к backend
- Убедитесь, что оба сервиса в одной сети Docker
- Проверьте nginx.conf - путь прокси должен быть правильным
- Проверьте логи: `docker-compose logs frontend`

### Ошибки сборки
- Убедитесь, что Docker имеет достаточно памяти (минимум 2GB)
- Попробуйте очистить кэш: `docker-compose build --no-cache`

