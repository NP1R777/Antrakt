#!/usr/bin/env bash
set -euo pipefail
umask 077
# Backups contain private data. Keep them in an ignored directory, never init.sql.
backup_dir=${5:-"$(dirname "$0")/../backups"}
mkdir -p "$backup_dir"
backup_file=$(mktemp "$backup_dir/antrakt-XXXXXXXX.dump")
if pg_dump -h "${1:-localhost}" -p "${2:-5432}" -d "${3:-antrakt}" -U "${4:-postgres}" --format=custom --no-owner --no-privileges --file="$backup_file"; then
    printf 'Private backup saved: %s\nRestore with pg_restore; do not commit it.\n' "$backup_file"
else
    rm -f -- "$backup_file"
    exit 1
fi
