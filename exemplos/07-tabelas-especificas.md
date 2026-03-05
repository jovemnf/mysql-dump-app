# Tabelas específicas

Backup apenas de **tabelas escolhidas**, por lista (whitelist) ou por exclusão (blacklist).

## Whitelist: só essas tabelas

Inclui **apenas** as tabelas listadas em `dump.tables`. A ordem na lista é respeitada no dump.

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
        tables: ['usuarios', 'pedidos', 'itens_pedido'],
        excludeTables: false,   // false = whitelist (só essas)
        routine: false,
    },
    dumpToFile: './backup-tabelas-especificas.sql',
});
```

O dump terá schema e dados **somente** de `usuarios`, `pedidos` e `itens_pedido`, nessa ordem.

## Blacklist: todas exceto essas

Exclui as tabelas listadas; todas as outras entram no dump.

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        tables: ['logs_antigos', 'sessoes_expiradas', 'cache_temporario'],
        excludeTables: true,   // true = blacklist (excluir essas)
        routine: false,
    },
    dumpToFile: './backup-excluindo-tabelas.sql',
});
```

## Combinando com views

`dump.tables` afeta **tabelas**. As views são controladas por `dump.views` e `dump.schema.view`:

- Para incluir só algumas views na ordem desejada: use `dump.views: ['view_a', 'view_b']`.
- Para não incluir views: use `dump.schema.view: false`.

Exemplo: só tabelas `a` e `b` + views `v1` e `v2`:

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        tables: ['a', 'b'],
        excludeTables: false,
        views: ['v1', 'v2'],
        routine: false,
    },
    dumpToFile: './backup-tabelas-e-views.sql',
});
```
