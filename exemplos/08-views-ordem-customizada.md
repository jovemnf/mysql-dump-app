# Views em ordem customizada

Quando **views dependem umas das outras**, a ordem de criação no SQL importa. Use `dump.views` com a lista na ordem correta.

**Importante:** Não é obrigatório informar `schema.view`. Por padrão o dump já inclui views (o `schema.view` interno é um objeto). O banco buscará as views normalmente; você só precisa usar `schema.view: false` quando quiser **excluir** views do schema.

## Ordem de criação das views

O dump do schema coloca **tabelas primeiro** e **views depois**. Entre as views, a ordem segue a lista em `dump.views`. Se uma view usar outra, a “base” deve vir antes.

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
        views: [
            'view_base_usuarios',
            'view_resumo_por_mes',
            'view_dashboard_geral',
        ],
        data: false,
        routine: false,
    },
    dumpToFile: './backup-views-ordenadas.sql',
});
```

- Se `dump.views` **tiver itens**: só essas views entram no dump, **nessa ordem**.
- Se `dump.views` estiver **vazio ou não informado**: todas as views são incluídas na ordem retornada pelo banco.

## Só views, na ordem que você definir

Para um arquivo que tenha **apenas** as views (além das tabelas, que sempre podem ir no schema), use `dump.tables` para limitar tabelas e `dump.views` para definir quais views e em que ordem. O exemplo abaixo mantém todas as tabelas e só controla a lista e ordem das views:

```javascript
const result = await mysqlDumpApp({
    connection: { host: 'localhost', user: 'root', password: '***', database: 'meu_banco' },
    dump: {
        views: ['view_dependencia', 'view_filha_1', 'view_filha_2'],
        data: false,
        routine: false,
    },
    dumpToFile: './backup-views-ordenadas.sql',
});
```

## Resumo

| Situação | Configuração |
|----------|--------------|
| Todas as views, ordem do banco | Não definir `dump.views` ou `dump.views: []` |
| Só algumas views, ordem definida | `dump.views: ['view1', 'view2', ...]` |
| Nenhuma view | `dump.schema.view: false` |
