# Backup completo

Backup **completo** do banco: schema (tabelas + views), dados, triggers e rotinas (procedures e functions).

## Básico

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
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-completo.sql',
});
```

Por padrão já entram: schema (tabelas + views), dados e triggers. Com `routine` configurado, as rotinas também são incluídas.

## Com compactação

```javascript
await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        routine: {
            includeProcedures: true,
            includeFunctions: true,
            dropIfExist: true,
        },
    },
    dumpToFile: './backup-completo.sql.gz',
    compressFile: true,
});
```

## Ordem no arquivo

O arquivo de backup completo segue esta ordem:

1. Variáveis de sessão (header)
2. **Schema** (CREATE TABLE e CREATE VIEW)
3. **Triggers**
4. **Rotinas** (procedures e functions)
5. **Dados** (INSERT por tabela)
6. Restauração de variáveis (footer)

## Opções úteis para backup completo

| Opção | Descrição |
|-------|-----------|
| `dump.schema.view` | Objeto = incluir views; `false` = não incluir |
| `dump.views` | Lista (e ordem) de views a incluir |
| `dump.data.maxRowsPerInsertStatement` | Linhas por INSERT (performance) |
| `dump.data.lockTables` | Lock de leitura durante o dump |
| `compressFile: true` | Gerar `.sql.gz` |
