# Команды для работы с проектом

## Основные команды

### Запуск проекта
```bash
docker-compose up --build
```

### Остановка проекта
```bash
docker-compose down
```

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Только backend
docker-compose logs -f wildfly

# Только frontend
docker-compose logs -f frontend
```

### Пересборка без кэша
```bash
docker-compose build --no-cache
docker-compose up
```

### Очистка
```bash
# Остановить и удалить контейнеры
docker-compose down

# Удалить также volumes
docker-compose down -v

# Удалить образы
docker-compose down --rmi all
```

## Проверка работы

### Проверка API напрямую
```bash
# Без параметров
curl http://localhost/api/hello

# С параметром name
curl "http://localhost/api/hello?name=Test"
```

### Проверка через браузер
- Frontend: http://localhost
- Backend API: http://localhost:8080/backend/api/hello

## Локальная разработка (без Docker)

### Backend
```bash
cd backend
mvn clean package
# WAR файл: target/backend.war
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Откроется на http://localhost:5173
```

