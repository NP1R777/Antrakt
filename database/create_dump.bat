@echo off
setlocal
set "DB_HOST=%~1"
set "DB_PORT=%~2"
set "DB_NAME=%~3"
set "DB_USER=%~4"
set "BACKUP_DIR=%~5"
if not defined DB_HOST set "DB_HOST=localhost"
if not defined DB_PORT set "DB_PORT=5432"
if not defined DB_NAME set "DB_NAME=antrakt"
if not defined DB_USER set "DB_USER=postgres"
if not defined BACKUP_DIR set "BACKUP_DIR=%~dp0..\backups"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
set "BACKUP_FILE=%BACKUP_DIR%\antrakt-%RANDOM%-%RANDOM%.dump"
if exist "%BACKUP_FILE%" exit /b 1
pg_dump -h "%DB_HOST%" -p "%DB_PORT%" -d "%DB_NAME%" -U "%DB_USER%" --format=custom --no-owner --no-privileges --file="%BACKUP_FILE%"
if errorlevel 1 (
    if exist "%BACKUP_FILE%" del "%BACKUP_FILE%"
    exit /b 1
)
echo Private backup saved: "%BACKUP_FILE%"
echo Restore with pg_restore. Do not commit this file.
