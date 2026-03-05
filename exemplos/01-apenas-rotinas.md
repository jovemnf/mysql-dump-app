# Apenas rotinas (stored procedures e functions)

Backup somente das **stored procedures** e/ou **functions** do banco. Schema, dados e triggers ficam de fora.

## Apenas stored procedures

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
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: false,
            definer: false,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-apenas-procedures.sql',
});

console.log('Rotinas (procedures):', result.dump.routine);
```

## Apenas functions

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: false,
            includeFunctions: true,
            definer: false,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-apenas-functions.sql',
});
```

## Procedures e functions juntas

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            definer: false,
            dropIfExist: true,
            delimiter: ';;',
        },
    },
    dumpToFile: './backup-rotinas-completo.sql',
});
```

## Opções úteis de `routine`

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `includeProcedures` | Incluir stored procedures | `true` |
| `includeFunctions` | Incluir functions | `true` |
| `definer` | Incluir DEFINER na rotina | `false` |
| `dropIfExist` | Gerar DROP antes do CREATE | `false` |
| `delimiter` | Delimitador entre statements | `';;'` |
