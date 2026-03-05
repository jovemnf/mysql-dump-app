# Rotinas e tabelas

Backup que combina **rotinas** (procedures/functions) com **schema** e/ou **dados** das tabelas.

## Schema + rotinas

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
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-schema-e-rotinas.sql',
});
```

O arquivo terá: primeiro o schema (tabelas + views), depois as rotinas.

## Schema + dados + rotinas

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-schema-dados-rotinas.sql',
});
```

## Apenas rotinas + dados (sem schema)

Útil quando a estrutura já existe no destino e você só quer dados e lógica (procedures/functions).

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        schema: false,
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-dados-e-rotinas.sql',
});
```
