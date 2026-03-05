# Apenas views

Backup somente do **schema das views** (CREATE VIEW). Tabelas, dados e rotinas não entram.

Use quando quiser exportar só as definições de views para outro ambiente.

## Todas as views

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
            // view como objeto = inclui views (padrão)
            view: {
                createOrReplace: true,
                definer: false,
                algorithm: false,
                sqlSecurity: false,
            },
        },
    },
    dumpToFile: './backup-views.sql',
});
```

O schema gerado terá **tabelas + views** (views sempre vêm depois das tabelas). Se quiser **só as views** no arquivo, use `dump.tables: []` e `dump.views` com a lista de views (veja [08-views-ordem-customizada.md](./08-views-ordem-customizada.md)); assim você controla quais objetos entram.

## Só algumas views, na ordem que quiser

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        tables: [],        // opcional: se vazio, todas as tabelas + as views abaixo
        views: ['view_base', 'view_resumo', 'view_dashboard'],
        data: false,
        trigger: false,
        routine: false,
    },
    dumpToFile: './backup-views-selecionadas.sql',
});
```

O arquivo terá o schema de **todas as tabelas** e apenas as views listadas em `views`, na ordem informada (útil quando uma view depende de outra).
