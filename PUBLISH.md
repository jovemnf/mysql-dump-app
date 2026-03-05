# Publicar a primeira versão no npm

## 1. Conferir o pacote

- **Nome:** `mysql-dump-app` (verifique se está livre em https://www.npmjs.com/package/mysql-dump-app)
- **Versão:** `1.0.0` (em `package.json`)

## 2. Build

```bash
npm run build
```

O script `prepublishOnly` também roda o build automaticamente antes de `npm publish`.

## 3. Testar o que será publicado (dry-run)

```bash
npm pack --dry-run
```

Deve listar: `dist/`, `README.md`, `LICENSE.md`, `exemplos/` e `package.json`.

## 4. Login no npm

Se ainda não estiver logado:

```bash
npm login
```

Informe usuário, senha e e-mail do npm.

## 5. Autenticação de dois fatores (2FA) – obrigatório para publicar

O npm exige **2FA** (ou um token com permissão de publicar) para `npm publish`. Se aparecer:

```text
403 Forbidden - Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

**Opção A – Ativar 2FA no site (recomendado):**

1. Acesse https://www.npmjs.com e faça login.
2. Clique no avatar (canto superior direito) → **Account settings**.
3. Em **Two-Factor Authentication**, clique em **Enable 2FA** e siga o fluxo (app autenticador ou SMS).
4. Depois, ao rodar `npm publish`, o npm pede o código de 2FA (one-time password). Informe e a publicação segue.

**Opção B – Token de acesso (para CI ou sem 2FA interativo):**

1. No npm: **Account settings** → **Access Tokens** → **Generate New Token**.
2. Escolha **Granular Access Token**; em **Packages** selecione **Read and write**; marque **Bypass 2FA for publish** se estiver disponível.
3. Use o token no lugar da senha ao fazer `npm login`, ou defina no `.npmrc`:
   ```ini
   //registry.npmjs.org/:_authToken=SEU_TOKEN
   ```

## 6. Publicar

```bash
npm publish
```

Para publicar como pacote público (padrão). Se o nome estiver ocupado, use um escopo, por exemplo:

```bash
npm publish --access public
```

(necessário quando o pacote é `@seu-usuario/mysql-dump-app`)

## 7. Usar a biblioteca

Depois de publicar, em qualquer projeto:

```bash
npm install mysql-dump-app
```

```javascript
const mysqlDumpApp = require('mysql-dump-app');

mysqlDumpApp({
    connection: { host: '...', user: '...', password: '...', database: '...' },
    dumpToFile: './backup.sql',
});
```

---

**Resumo:** `npm run build` → `npm login` → ativar 2FA no npm (se ainda não tiver) → `npm publish`.
