# mysql-dump-app

Biblioteca Node.js para gerar backup (dump) de bancos MySQL com controle fino do que entra no arquivo: schema, dados, views, triggers e rotinas (procedures e functions). Pensada para quem precisa escolher tabelas, definir a ordem das views ou exportar só rotinas, por exemplo.

## Instalação

```bash
npm install mysql-dump-app
```

## Uso básico

Informe a conexão e, se quiser, o caminho do arquivo. O resto usa padrões sensatos (schema + dados + triggers + rotinas).

```javascript
const mysqlDumpApp = require('mysql-dump-app');

await mysqlDumpApp({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'sua_senha',
        database: 'meu_banco',
    },
    dumpToFile: './backup.sql',
});
```

Para receber o resultado em memória em vez de gravar em arquivo, omita `dumpToFile`:

```javascript
const result = await mysqlDumpApp({
    connection: { host: '...', user: '...', password: '...', database: '...' },
});

console.log(result.dump.schema);  // SQL do schema
console.log(result.dump.data);    // SQL dos dados
console.log(result.dump.trigger);  // SQL dos triggers
console.log(result.dump.routine);  // SQL das procedures/functions
console.log(result.tables);        // lista de tabelas processadas
```

## O que você pode controlar

- **Schema** – Incluir ou não as definições (CREATE TABLE e CREATE VIEW). Opção de pular views (`schema.view: false`).
- **Views** – Lista e ordem das views no dump (`dump.views: ['view_a', 'view_b']`), útil quando uma view depende de outra.
- **Tabelas** – Só algumas tabelas ou “todas exceto” (`dump.tables` + `dump.excludeTables`).
- **Dados** – Incluir ou não os INSERTs; filtros por tabela (`dump.data.where`).
- **Triggers** – Incluir ou não os triggers.
- **Rotinas** – Incluir procedures e/ou functions, com opções de DEFINER e DROP IF EXISTS.
- **Arquivo** – Gravar em arquivo (`dumpToFile`) e, se quiser, comprimir (`compressFile: true`).

A referência completa das opções está nos tipos TypeScript em [`dist/mysql-dump-app.d.ts`](./dist/mysql-dump-app.d.ts) (gerado no build).

## Exemplos prontos

A pasta **[`exemplos/`](./exemplos)** traz vários cenários em Markdown com código que você pode copiar e colar:

| Exemplo | Descrição |
|--------|------------|
| [01-apenas-rotinas](./exemplos/01-apenas-rotinas.md) | Só stored procedures e/ou functions |
| [02-apenas-views](./exemplos/02-apenas-views.md) | Só o schema das views |
| [03-apenas-dados](./exemplos/03-apenas-dados.md) | Só os dados (INSERTs), com opção de WHERE |
| [04-apenas-schema](./exemplos/04-apenas-schema.md) | Só estrutura (tabelas + views) |
| [05-schema-sem-views](./exemplos/05-schema-sem-views.md) | Schema só com tabelas, sem views |
| [06-rotinas-e-tabelas](./exemplos/06-rotinas-e-tabelas.md) | Rotinas junto com schema e/ou dados |
| [07-tabelas-especificas](./exemplos/07-tabelas-especificas.md) | Whitelist ou blacklist de tabelas |
| [08-views-ordem-customizada](./exemplos/08-views-ordem-customizada.md) | Views em ordem definida (dependências) |
| [09-backup-completo](./exemplos/09-backup-completo.md) | Backup completo com compactação |

Em todos os exemplos, basta trocar `connection` pelos dados do seu banco.

## Opções principais (resumo)

### Conexão (`connection`)

- `host`, `port`, `user`, `password`, `database` (obrigatórios na prática)
- `charset`, `ssl` (opcionais)

### Dump (`dump`)

- **`tables`** – Lista de tabelas. Com `excludeTables: false` = só essas (whitelist); com `excludeTables: true` = todas exceto essas (blacklist).
- **`views`** – Lista de views na ordem desejada. Se tiver itens, só essas views entram no schema, nessa ordem. Vazio = todas as views.
- **`schema`** – `false` para não incluir schema. Se for objeto, pode ter `view: false` para não incluir views, ou opções de formatação/tabela/view.
- **`data`** – `false` para não incluir dados. Se for objeto, aceita `where`, `maxRowsPerInsertStatement`, `includeViewData`, etc.
- **`trigger`** – `false` para não incluir triggers.
- **`routine`** – `false` para não incluir rotinas. Se for objeto: `includeProcedures`, `includeFunctions`, `definer`, `dropIfExist`, `delimiter`.

### Saída

- **`dumpToFile`** – Caminho do arquivo (ex.: `'./backup.sql'` ou `'./backup.sql.gz'`).
- **`compressFile`** – `true` para gerar arquivo gzip.

## Resultado (`DumpReturn`)

O retorno da função tem a forma:

- **`dump.schema`** – String SQL do schema ou `null`.
- **`dump.data`** – String SQL dos dados ou `null`.
- **`dump.trigger`** – String SQL dos triggers ou `null`.
- **`dump.routine`** – String SQL das rotinas ou `null`.
- **`tables`** – Array com as tabelas/views processadas (nome, schema, data, etc.).

## TypeScript

O pacote exporta tipos. Após o build, as declarações ficam em `dist/mysql-dump-app.d.ts`. Em projeto TypeScript você pode importar:

```typescript
import mysqlDumpApp from 'mysql-dump-app';
```

## Licença

MIT.
