# Exemplos de backup com mysql-dump-app

Esta pasta contém exemplos em Markdown para diferentes tipos de backup usando o pacote **mysql-dump-app**.

| Arquivo | Descrição |
|---------|-----------|
| [01-apenas-rotinas.md](./01-apenas-rotinas.md) | Backup apenas de stored procedures e/ou functions |
| [02-apenas-views.md](./02-apenas-views.md) | Backup apenas do schema das views |
| [03-apenas-dados.md](./03-apenas-dados.md) | Backup apenas dos dados (INSERTs) |
| [04-apenas-schema.md](./04-apenas-schema.md) | Backup apenas do schema (tabelas + views) |
| [05-schema-sem-views.md](./05-schema-sem-views.md) | Schema só com tabelas, sem views |
| [06-rotinas-e-tabelas.md](./06-rotinas-e-tabelas.md) | Rotinas + schema e/ou dados de tabelas |
| [07-tabelas-especificas.md](./07-tabelas-especificas.md) | Backup de tabelas escolhidas (whitelist/blacklist) |
| [08-views-ordem-customizada.md](./08-views-ordem-customizada.md) | Views em ordem definida (dependências) |
| [09-backup-completo.md](./09-backup-completo.md) | Backup completo (schema, dados, triggers, rotinas) |

Em todos os exemplos, substitua `connection` pelos dados reais do seu banco (host, user, password, database).
