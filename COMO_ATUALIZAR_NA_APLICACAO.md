# 🚀 Como Atualizar o mysqldump na Sua Aplicação

## 📋 **Instruções Passo a Passo**

### **Método 1: Atualização Rápida (Recomendado)**

1. **Ir para o diretório da sua aplicação:**

    ```bash
    cd /caminho/para/seu/rastreamos-api
    ```

2. **Executar comandos de atualização:**

    ```bash
    # Limpar cache
    npm cache clean --force

    # Atualizar mysqldump
    npm install git+https://github.com/jovemnf/mysqldump.git#develop --force

    # Ou usar commit específico
    npm install git+https://github.com/jovemnf/mysqldump.git#46404dda24fbfb63ba4896ac8f048d5a849baf0d --force
    ```

3. **Verificar se funcionou:**
    ```bash
    node -e "const mysqldump = require('mysqldump'); console.log('✅ mysqldump atualizado!');"
    ```

### **Método 2: Usando Script Automatizado**

1. **Copiar o script para sua aplicação:**

    ```bash
    # Copiar o script update-mysqldump-app.js para o diretório da sua aplicação
    cp /Users/wallacesilva/WebstormProjects/mysqldump/update-mysqldump-app.js /caminho/para/seu/rastreamos-api/
    ```

2. **Executar o script:**

    ```bash
    cd /caminho/para/seu/rastreamos-api
    node update-mysqldump-app.js
    ```

3. **Remover o script (opcional):**
    ```bash
    rm update-mysqldump-app.js
    ```

### **Método 3: Atualização Manual do package.json**

1. **Editar o package.json:**

    ```json
    {
        "dependencies": {
            "mysqldump": "git+https://github.com/jovemnf/mysqldump.git#46404dda24fbfb63ba4896ac8f048d5a849baf0d"
        }
    }
    ```

2. **Reinstalar:**
    ```bash
    npm install --legacy-peer-deps
    ```

## 🔍 **Verificar se a Atualização Funcionou**

### **Teste 1: Verificar Versão**

```bash
node -e "console.log('mysqldump carregado com sucesso!');"
```

### **Teste 2: Testar Conexão**

```javascript
const mysqldump = require('mysqldump');

// Teste básico
const option = {
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'sua_senha',
        database: 'seu_banco',
    },
    dump: {
        data: false,
        schema: false,
        routine: false,
    },
};

mysqldump(option)
    .then(() => console.log('✅ Teste de conexão OK!'))
    .catch(err => console.error('❌ Erro:', err.message));
```

## 🚨 **Se Houver Problemas**

### **Problema 1: Erro de Dependências**

```bash
# Usar flag legacy-peer-deps
npm install --legacy-peer-deps
```

### **Problema 2: Cache Corrompido**

```bash
# Limpar tudo e reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### **Problema 3: Conflito de Versões**

```bash
# Forçar instalação
npm install git+https://github.com/jovemnf/mysqldump.git#develop --force --legacy-peer-deps
```

## 📊 **Verificar Commits Disponíveis**

Para ver se há atualizações disponíveis:

```bash
# Ver commit atual no seu package.json
grep mysqldump package.json

# Ver commit mais recente no repositório
git ls-remote https://github.com/jovemnf/mysqldump.git develop
```

## ✅ **Status Após Atualização**

Após a atualização, você deve ver:

-   ✅ `mysqldump` carregando sem erros
-   ✅ Conexão com banco funcionando
-   ✅ Backup executando corretamente
-   ✅ Sem erros de "connection closed state"

## 🎯 **Recomendação**

Use o **Método 1** (Atualização Rápida) para a maioria dos casos. É simples e eficaz!

```bash
npm cache clean --force
npm install git+https://github.com/jovemnf/mysqldump.git#develop --force
```

**Pronto! Seu mysqldump estará atualizado na sua aplicação de monitoramento veicular!** 🚗📊
