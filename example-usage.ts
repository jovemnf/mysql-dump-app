import mysqlDumpApp from './src/main';

const connection = {
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'casat',
};

// Exemplo de uso com as novas funcionalidades
async function exemploUso() {
    try {
        // Exemplo 1: Incluir apenas stored procedures, excluindo functions
        const dump1 = await mysqlDumpApp({
            connection,
            dump: {
                routine: {
                    includeProcedures: true, // Incluir stored procedures
                    includeFunctions: false, // Excluir functions
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 1 - Apenas stored procedures:');
        console.log(dump1.dump.routine);

        // Exemplo 2: Incluir apenas functions, excluindo procedures
        const dump2 = await mysqlDumpApp({
            connection,
            dump: {
                routine: {
                    includeProcedures: false, // Excluir stored procedures
                    includeFunctions: true, // Incluir functions
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 2 - Apenas functions:');
        console.log(dump2.dump.routine);

        // Exemplo 3: Incluir só essas views, na ordem desejada (respeita dependências)
        const dump3 = await mysqlDumpApp({
            connection,
            dump: {
                views: ['view_base', 'view_intermediaria', 'view_final'],
                routine: false,
            },
        });

        console.log('Dump 3 - Views no schema (ordem personalizada):');
        console.log(dump3.dump.schema);

        // Exemplo 4: Dump completo (views sempre incluídas; dump.views vazio = todas)
        const dump4 = await mysqlDumpApp({
            connection,
            dump: {
                routine: {
                    includeProcedures: true,
                    includeFunctions: true,
                    definer: false,
                    dropIfExist: true,
                },
            },
        });

        console.log('Dump 4 - Schema + rotinas:');
        console.log(dump4.dump.schema);
        console.log('Dump 4 - Rotinas:');
        console.log(dump4.dump.routine);
    } catch (error) {
        console.error('Erro ao fazer dump:', error);
    }
}

// Executar exemplo
exemploUso();
