# Como Atualizar o mysqldump

## Problema

Quando você usa uma dependência Git diretamente como:

```json
"mysqldump": "git+https://github.com/jovemnf/mysqldump.git#develop"
```

O npm/yarn baixa o commit específico da branch no momento da instalação e não atualiza automaticamente quando novos commits são feitos.

## Soluções

### 1. Atualização Rápida (Manual)

```bash
# Limpar cache
npm cache clean --force

# Forçar reinstalação
npm install --force
# ou
yarn install --force
```

### 2. Usar o Script Automatizado (Recomendado)

```bash
# Executar o script de atualização
npm run update-mysqldump
# ou
yarn update-mysqldump
```

Este script irá:

-   ✅ Verificar o commit mais recente da branch develop
-   ✅ Atualizar o package.json com o novo commit hash
-   ✅ Limpar o cache do npm
-   ✅ Reinstalar as dependências

### 3. Usar Commit Hash Específico

Em vez de usar a branch `develop`, use um commit hash específico:

```json
"mysqldump": "git+https://github.com/jovemnf/mysqldump.git#46404dda24fbfb63ba4896ac8f048d5a849baf0d"
```

### 4. Verificar Atualizações Disponíveis

Para verificar se há atualizações disponíveis:

```bash
# Ver o commit atual no package.json
grep mysqldump package.json

# Ver o commit mais recente no repositório
git ls-remote https://github.com/jovemnf/mysqldump.git develop
```

## Recomendação

Use o script `npm run update-mysqldump` sempre que quiser garantir que está usando a versão mais recente da branch develop.
