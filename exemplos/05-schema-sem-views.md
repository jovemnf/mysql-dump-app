# Schema sem views

Backup do **schema só com tabelas** (CREATE TABLE). Nenhuma view é incluída.

Use quando o destino não precisa das views ou quando elas serão criadas por outro processo.

## Schema apenas com tabelas

```javascript
const mysqlDumpApp = require('mysql-dump-app');

const result = await mysqlDumpApp({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'sua_senha',
        database: 'meu_banco',
    },
    dump: {
        data: false,
        trigger: false,
        routine: false,
        schema: {
            view: false,   // não incluir views no dump do schema
        },
    },
    dumpToFile: './backup-schema-sem-views.sql',
});
```

## Resumo

| `dump.schema.view` | Efeito |
|--------------------|--------|
| Objeto (padrão)    | Inclui views no schema, com opções (createOrReplace, definer, etc.) |
| `false`            | Não inclui views; só CREATE TABLE |

Triggers e rotinas continuam controlados por `dump.trigger` e `dump.routine` (neste exemplo ambos desativados).
