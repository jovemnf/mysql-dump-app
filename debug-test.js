const mysqlDumpApp = require('./dist/cjs.js').default;

async function debugTest() {
    try {
        console.log('🔍 Iniciando teste de debug...');

        const result = await mysqlDumpApp({
            connection: {
                host: 'localhost',
                user: 'root',
                password: 'password',
                database: 'test_db',
            },
            dump: {
                routine: {
                    includeProcedures: true,
                    includeFunctions: true,
                    definer: false,
                    dropIfExist: false,
                },
                data: false,
                trigger: false,
            },
        });

        console.log('✅ Teste bem-sucedido!');
        console.log('Schema:', result.dump.schema ? 'Presente' : 'Ausente');
        console.log('Routines:', result.dump.routine ? 'Presente' : 'Ausente');
    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

debugTest();
