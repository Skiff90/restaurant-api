#!/bin/bash

# Конфігурація
BACKUP_DIR="/var/backups/restaurant-api"
DB_NAME="restaurant_db"
DB_USER="your_db_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Створення директорії для бекапу
mkdir -p $BACKUP_DIR

# Бекап бази даних
pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Бекап завантажених файлів
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" /path/to/uploads

# Видалення старих бекапів (старіших 7 днів)
find $BACKUP_DIR -type f -mtime +7 -delete

# Відправка повідомлення про успішний бекап
echo "Backup completed successfully at $TIMESTAMP" | mail -s "Restaurant API Backup Status" admin@example.com 