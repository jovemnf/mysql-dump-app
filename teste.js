const mysqlDumpApp = require('./dist/cjs.js').default;
const path = require('path');

// Configuração exata do seu sistema
let option = {
    connection: {
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'casat',
    },
    dump: {
        data: false,
        schema: false,
        routine: {
            includeProcedures: true, // Incluir stored procedures
            includeFunctions: true, // Incluir functions
            dropIfExist: true,
        },
    },
    dumpToFile: path.join(__dirname, 'backup-teste.sql'), // Caminho do arquivo de backup
    compressFile: false,
};

// Executar o backup
async function executeBackup() {
    try {
        console.log('Iniciando backup...');
        console.log('Configuração das rotinas:', option.dump.routine);
        const result = await mysqlDumpApp(option);

        console.log('✅ Backup concluído com sucesso!');
        console.log('Schema:', result.dump.schema ? 'Gerado' : 'Não gerado');
        console.log(
            'Rotinas:',
            result.dump.routine ? 'Geradas' : 'Não geradas',
        );
        console.log('Conteúdo das rotinas:', result.dump.routine);
        console.log('Tabelas:', result.tables.length);
    } catch (error) {
        console.error('Erro no backup:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

executeBackup();
