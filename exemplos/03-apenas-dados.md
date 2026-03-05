# Apenas dados

Backup somente dos **dados** (INSERTs). Schema, triggers e rotinas não são gerados.

Útil para popular outro banco que já tem a mesma estrutura.

## Dados de todas as tabelas

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
        trigger: false,
        routine: false,
        data: {
            format: true,
            verbose: true,
            maxRowsPerInsertStatement: 100,
        },
    },
    dumpToFile: './backup-dados.sql',
});
```

## Dados com filtro (WHERE) por tabela

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        schema: false,
        trigger: false,
        routine: false,
        data: {
            where: {
                usuarios: 'ativo = 1',
                pedidos: 'created_at >= "2024-01-01"',
            },
        },
    },
    dumpToFile: './backup-dados-filtrado.sql',
});
```

## Opções úteis de `data`

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `format` | Formatar SQL | `true` |
| `verbose` | Cabeçalhos no arquivo | `true` |
| `maxRowsPerInsertStatement` | Linhas por INSERT | `1` |
| `where` | Condição WHERE por tabela | `{}` |
| `includeViewData` | Incluir dados de views | `false` |
| `lockTables` | Lock de leitura durante dump | `false` |
