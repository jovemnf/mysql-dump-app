import { getSchemaDump } from '../src/getSchemaDump';
import { Table } from '../src/interfaces/Table';
import { DB } from '../src/DB';

function makeTable(name: string, isView: boolean): Table {
    return {
        name,
        schema: null,
        data: null,
        columns: {},
        columnsOrdered: [],
        triggers: [],
        isView,
    };
}

function createMockConnection(
    tableResults: Array<{ type: 'table' | 'view'; name: string }>,
): DB {
    const rows = tableResults.map(({ type, name }) =>
        type === 'view'
            ? [{ View: name, 'Create View': `CREATE VIEW \`${name}\` AS SELECT 1;` }]
            : [{ Table: name, 'Create Table': `CREATE TABLE \`${name}\` (id int);` }],
    );
    return {
        multiQuery: jest.fn().mockResolvedValue(rows),
    } as unknown as DB;
}

const defaultSchemaOptions = {
    format: false,
    autoIncrement: true,
    engine: true,
    table: { ifNotExist: true, dropIfExist: false, charset: true },
    view: {
        createOrReplace: true,
        definer: false,
        algorithm: false,
        sqlSecurity: false,
    },
};

describe('getSchemaDump', () => {
    describe('schema.view', () => {
        it('should exclude views when schema.view is false', async () => {
            const tables: Table[] = [
                makeTable('t1', false),
                makeTable('v1', true),
                makeTable('t2', false),
            ];
            const connection = createMockConnection([
                { type: 'table', name: 't1' },
                { type: 'table', name: 't2' },
            ]);

            const result = await getSchemaDump(
                connection,
                { ...defaultSchemaOptions, view: false },
                tables,
            );

            expect(result).toHaveLength(2);
            expect(result.every(t => !t.isView)).toBe(true);
            expect(result.map(t => t.name)).toEqual(['t1', 't2']);
            expect(connection.multiQuery).toHaveBeenCalledTimes(1);
            const query = (connection.multiQuery as jest.Mock).mock.calls[0][0];
            expect(query).not.toMatch(/`v1`/);
        });

        it('should include views when schema.view is object', async () => {
            const tables: Table[] = [
                makeTable('t1', false),
                makeTable('v1', true),
            ];
            const connection = createMockConnection([
                { type: 'table', name: 't1' },
                { type: 'view', name: 'v1' },
            ]);

            const result = await getSchemaDump(
                connection,
                defaultSchemaOptions,
                tables,
            );

            expect(result).toHaveLength(2);
            const v1 = result.find(t => t.name === 'v1');
            expect(v1).toBeDefined();
            expect(v1!.isView).toBe(true);
        });
    });

    describe('dump.views (order and filter)', () => {
        it('should output views in the order specified by options.views', async () => {
            const tables: Table[] = [
                makeTable('t1', false),
                makeTable('v2', true),
                makeTable('v1', true),
                makeTable('t2', false),
            ];
            const connection = createMockConnection([
                { type: 'table', name: 't1' },
                { type: 'table', name: 't2' },
                { type: 'view', name: 'v1' },
                { type: 'view', name: 'v2' },
            ]);

            const result = await getSchemaDump(
                connection,
                { ...defaultSchemaOptions, views: ['v1', 'v2'] },
                tables,
            );

            const names = result.map(t => t.name);
            expect(names).toEqual(['t1', 't2', 'v1', 'v2']);
            const viewIndices = result
                .map((t, i) => (t.isView ? i : -1))
                .filter(i => i >= 0);
            expect(result[viewIndices[0]].name).toBe('v1');
            expect(result[viewIndices[1]].name).toBe('v2');
        });

        it('should include only views listed in options.views', async () => {
            const tables: Table[] = [
                makeTable('t1', false),
                makeTable('v1', true),
                makeTable('v2', true),
                makeTable('v3', true),
            ];
            const connection = createMockConnection([
                { type: 'table', name: 't1' },
                { type: 'view', name: 'v2' },
                { type: 'view', name: 'v3' },
            ]);

            const result = await getSchemaDump(
                connection,
                { ...defaultSchemaOptions, views: ['v2', 'v3'] },
                tables,
            );

            expect(result.map(t => t.name)).toEqual(['t1', 'v2', 'v3']);
            expect(result.some(t => t.name === 'v1')).toBe(false);
        });

        it('should ignore view names in options.views that do not exist', async () => {
            const tables: Table[] = [
                makeTable('t1', false),
                makeTable('v1', true),
            ];
            const connection = createMockConnection([
                { type: 'table', name: 't1' },
                { type: 'view', name: 'v1' },
            ]);

            const result = await getSchemaDump(
                connection,
                { ...defaultSchemaOptions, views: ['inexistente', 'v1'] },
                tables,
            );

            expect(result.map(t => t.name)).toEqual(['t1', 'v1']);
        });
    });
});
