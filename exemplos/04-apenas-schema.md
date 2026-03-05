# Apenas schema

Backup somente da **estrutura**: CREATE TABLE e CREATE VIEW. Sem dados, triggers ou rotinas.

Ideal para versionar estrutura ou criar um banco “vazio” com a mesma DDL.

## Schema completo (tabelas + views)

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
            format: true,
            autoIncrement: true,
            engine: true,
            table: {
                ifNotExist: true,
                dropIfExist: false,
                charset: true,
            },
            view: {
                createOrReplace: true,
                definer: false,
                algorithm: false,
                sqlSecurity: false,
            },
        },
    },
    dumpToFile: './backup-schema.sql',
});
```

## Schema direto para arquivo

```javascript
await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        data: false,
        trigger: false,
        routine: false,
    },
    dumpToFile: './schema.sql',
});
```

Com as opções padrão, o schema já inclui tabelas e views. O arquivo terá apenas os `CREATE TABLE` e `CREATE VIEW`, na ordem correta (tabelas primeiro, views depois).
