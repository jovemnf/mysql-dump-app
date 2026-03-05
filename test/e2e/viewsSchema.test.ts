import { config } from '../testConfig';
import { mysqldump } from '../scripts/import';

describe('mysql-dump-app.e2e', () => {
    describe('schema.view e dump.views', () => {
        it('should exclude views from schema when schema.view is false', async () => {
            const res = await mysqldump({
                connection: config,
                dump: {
                    schema: {
                        view: false,
                    },
                    data: false,
                    trigger: false,
                    routine: false,
                },
            });

            expect(res.dump.schema).toBeTruthy();
            expect(res.dump.schema).not.toMatch(/CREATE OR REPLACE .*VIEW `everything`/);
            expect(res.dump.schema).not.toMatch(/CREATE\s+VIEW\s+`everything`/);
            // Tabelas devem continuar presentes
            expect(res.dump.schema).toMatch(/CREATE TABLE IF NOT EXISTS `date_types`/);
        });

        it('should include views in schema when schema.view is object (default)', async () => {
            const res = await mysqldump({
                connection: config,
                dump: {
                    tables: ['date_types', 'everything'],
                    excludeTables: false,
                    data: false,
                    trigger: false,
                    routine: false,
                },
            });

            expect(res.dump.schema).toMatch(/CREATE OR REPLACE .*VIEW `everything`/);
        });

        it('should include only views listed in dump.views when provided', async () => {
            const res = await mysqldump({
                connection: config,
                dump: {
                    views: ['everything'],
                    data: false,
                    trigger: false,
                    routine: false,
                },
            });

            expect(res.dump.schema).toBeTruthy();
            expect(res.dump.schema).toMatch(/CREATE OR REPLACE .*VIEW `everything`/);
            // A view "everything" deve aparecer após as tabelas (ordem de dump.views)
            const schemaStr = res.dump.schema || '';
            const idxEverything = schemaStr.indexOf('VIEW `everything`');
            const idxDateTypes = schemaStr.indexOf('TABLE IF NOT EXISTS `date_types`');
            expect(idxDateTypes).toBeGreaterThanOrEqual(0);
            expect(idxEverything).toBeGreaterThan(idxDateTypes);
        });

        it('should output views in the order specified by dump.views', async () => {
            // Com apenas uma view no banco, a ordem é trivial; garantimos que a opção é aplicada
            const res = await mysqldump({
                connection: config,
                dump: {
                    tables: ['number_types', 'date_types', 'everything'],
                    excludeTables: false,
                    views: ['everything'],
                    data: false,
                    trigger: false,
                    routine: false,
                },
            });

            expect(res.dump.schema).toMatch(/VIEW `everything`/);
            const schemaStr = res.dump.schema || '';
            const viewSectionStart = schemaStr.indexOf('# SCHEMA DUMP FOR TABLE: everything');
            const tableNumberTypes = schemaStr.indexOf('# SCHEMA DUMP FOR TABLE: number_types');
            const tableDateTypes = schemaStr.indexOf('# SCHEMA DUMP FOR TABLE: date_types');
            expect(viewSectionStart).toBeGreaterThan(tableNumberTypes);
            expect(viewSectionStart).toBeGreaterThan(tableDateTypes);
        });

        it('should include all views when dump.views is empty (default)', async () => {
            const res = await mysqldump({
                connection: config,
                dump: {
                    data: false,
                    trigger: false,
                    routine: false,
                },
            });

            expect(res.dump.schema).toMatch(/CREATE OR REPLACE .*VIEW `everything`/);
        });
    });
});
