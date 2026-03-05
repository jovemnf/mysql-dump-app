# Novas Funcionalidades - Controle de Views, Stored Procedures e Functions

## Visão Geral

Este documento descreve as novas funcionalidades implementadas para permitir controle granular sobre views, stored procedures e functions no mysql-dump-app.

## Funcionalidades Implementadas

### 1. Controle de Views no Schema

As views são sempre incluídas no dump do schema. O controle é feito apenas por **`dump.views`** (mesmo padrão de `dump.tables`):

-   **Tipo:** `Array<string>` (opcional)
-   **Padrão:** `[]`
-   **Regra:** Se `dump.views` tiver algum item → usa só essa lista, na ordem informada. Se estiver vazio ou não configurado → inclui todas as views (na ordem do banco). Útil quando views dependem umas das outras (a ordem define a ordem de criação).

```typescript
// Todas as views (padrão)
const dump = await mysqlDumpApp({
    connection: { /* ... */ },
    dump: {},
});

// Só essas views, nesta ordem
const dump2 = await mysqlDumpApp({
    connection: { /* ... */ },
    dump: {
        views: ['view_base', 'view_intermediaria', 'view_final'],
    },
});
```

### 2. Controle de Stored Procedures e Functions

**Nova seção:** `dump.routine`

#### Opções Disponíveis:

-   **`includeProcedures`** (boolean, padrão: true): Incluir stored procedures
-   **`includeFunctions`** (boolean, padrão: true): Incluir functions
-   **`definer`** (boolean, padrão: false): Incluir definer nas rotinas
-   **`dropIfExist`** (boolean, padrão: false): Adicionar DROP IF EXISTS
-   **`delimiter`** (string | false, padrão: ';;'): Delimitador para rotinas

#### Exemplos de Uso:

```typescript
// Apenas stored procedures
const dump1 = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        routine: {
            includeProcedures: true,
            includeFunctions: false,
        },
    },
});

// Apenas functions
const dump2 = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        routine: {
            includeProcedures: false,
            includeFunctions: true,
        },
    },
});

// Excluir todas as rotinas
const dump3 = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        routine: false,
    },
});
```

### 3. Estrutura de Retorno Atualizada

A interface `DumpReturn` agora inclui:

```typescript
interface DumpReturn {
    dump: {
        schema: string | null;
        data: string | null;
        trigger: string | null;
        routine: string | null; // NOVO
    };
    tables: Array<Table>;
}
```

## Casos de Uso Comuns

### 1. Separar Views das Tabelas

```typescript
// Schema sem views
const schemaSemViews = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        schema: true,
    },
});
```

### 2. Obter Apenas Stored Procedures

```typescript
const apenasProcedures = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: true,
            includeFunctions: false,
        },
    },
});
```

### 3. Obter Apenas Functions

```typescript
const apenasFunctions = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        schema: false,
        data: false,
        trigger: false,
        routine: {
            includeProcedures: false,
            includeFunctions: true,
        },
    },
});
```

### 4. Dump Completo com Separação

```typescript
const dumpCompleto = await mysqlDumpApp({
    connection: {
        /* ... */
    },
    dump: {
        routine: {
            includeProcedures: true,
            includeFunctions: true,
        },
    },
});

// Acessar cada parte separadamente
console.log('Schema:', dumpCompleto.dump.schema);
console.log('Views:', dumpCompleto.dump.routine); // Views estarão aqui se incluídas
console.log('Procedures:', dumpCompleto.dump.routine);
console.log('Functions:', dumpCompleto.dump.routine);
```

## Compatibilidade

-   ✅ **Retrocompatível**: Todas as funcionalidades existentes continuam funcionando
-   ✅ **Padrões sensatos**: Novas opções têm valores padrão que mantêm o comportamento atual
-   ✅ **Opcional**: As novas funcionalidades são opcionais e não afetam dumps existentes

## Arquivos Modificados

1. **`src/interfaces/Options.ts`**: Adicionadas novas interfaces e opções
2. **`src/interfaces/DumpReturn.ts`**: Adicionado campo `routine`
3. **`src/getRoutineDump.ts`**: Nova função para obter rotinas
4. **`src/getSchemaDump.ts`**: Atualizado para suportar exclusão de views
5. **`src/main.ts`**: Integração das novas funcionalidades

## Próximos Passos

Para usar as novas funcionalidades:

1. Atualize suas chamadas para incluir as novas opções conforme necessário
2. Teste com seus bancos de dados existentes
3. Ajuste as configurações conforme suas necessidades específicas

## Exemplo Completo

Veja o arquivo `example-usage.ts` para exemplos práticos de uso das novas funcionalidades.
