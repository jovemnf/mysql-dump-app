import * as sqlformatter from 'sql-formatter';

import { SchemaDumpOptions } from './interfaces/Options';
import { Table } from './interfaces/Table';
import { DB } from './DB';

interface ShowCreateView {
    View: string;
    'Create View': string;
    character_set_client: string;
    collation_connection: string;
}
interface ShowCreateTable {
    Table: string;
    'Create Table': string;
}
type ShowCreateTableStatementRes = ShowCreateView | ShowCreateTable;

function isCreateView(v: ShowCreateTableStatementRes): v is ShowCreateView {
    return 'View' in v;
}

type SchemaDumpOptionsWithViews = Required<SchemaDumpOptions> & {
    views?: Array<string>;
};

async function getSchemaDump(
    connection: DB,
    options: SchemaDumpOptionsWithViews,
    tables: Array<Table>,
): Promise<Array<Table>> {
    const format = options.format
        ? (sql: string) => sqlformatter.format(sql)
        : (sql: string) => sql;

    // Incluir ou não views conforme schema.view (false = sem views; objeto = com views)
    let tablesToProcess =
        options.view === false
            ? tables.filter(t => !t.isView)
            : tables;

    if (
        options.view !== false &&
        options.views &&
        options.views.length > 0
    ) {
        const tablesOnly = tablesToProcess.filter(t => !t.isView);
        const viewsOnly = tablesToProcess.filter(t => t.isView);
        const viewsOrdered = options.views
            .map(name => viewsOnly.find(v => v.name === name))
            .filter((t): t is Table => t !== undefined);
        tablesToProcess = tablesOnly.concat(viewsOrdered);
    }

    // we create a multi query here so we can query all at once rather than in individual connections
    const getSchemaMultiQuery = tablesToProcess
        .map(t => `SHOW CREATE TABLE \`${t.name}\`;`)
        .join('\n');
    const createStatements = (await connection.multiQuery<
        ShowCreateTableStatementRes
    >(getSchemaMultiQuery))
        // mysql2 returns an array of arrays which will all have our one row
        .map(r => r[0])
        .map((res, i) => {
            const table = tablesToProcess[i];
            if (isCreateView(res)) {
                return {
                    ...table,
                    name: res.View,
                    schema: format(res['Create View']),
                    data: null,
                    isView: true,
                };
            }

            return {
                ...table,
                name: res.Table,
                schema: format(res['Create Table']),
                data: null,
                isView: false,
            };
        })
        .map(s => {
            // clean up the generated SQL as per the options

            if (!options.autoIncrement) {
                s.schema = s.schema.replace(/AUTO_INCREMENT\s*=\s*\d+ /g, '');
            }
            if (!options.engine) {
                s.schema = s.schema.replace(/ENGINE\s*=\s*\w+ /, '');
            }
            if (s.isView && options.view && typeof options.view === 'object') {
                const viewOpts = options.view;
                if (viewOpts.createOrReplace) {
                    s.schema = s.schema.replace(/^CREATE/, 'CREATE OR REPLACE');
                }
                if (!viewOpts.algorithm) {
                    s.schema = s.schema.replace(
                        /^CREATE( OR REPLACE)? ALGORITHM[ ]?=[ ]?\w+/,
                        'CREATE$1',
                    );
                }
                if (!viewOpts.definer) {
                    s.schema = s.schema.replace(
                        /^CREATE( OR REPLACE)?( ALGORITHM[ ]?=[ ]?\w+)? DEFINER[ ]?=[ ]?.+?@.+?( )/,
                        'CREATE$1$2$3',
                    );
                }
                if (!viewOpts.sqlSecurity) {
                    s.schema = s.schema.replace(
                        // eslint-disable-next-line max-len
                        /^CREATE( OR REPLACE)?( ALGORITHM[ ]?=[ ]?\w+)?( DEFINER[ ]?=[ ]?.+?@.+)? SQL SECURITY (?:DEFINER|INVOKER)/,
                        'CREATE$1$2$3',
                    );
                }
            } else {
                if (options.table.dropIfExist) {
                    s.schema = s.schema.replace(
                        /^CREATE TABLE/,
                        `DROP TABLE IF EXISTS \`${s.name}\`;\nCREATE TABLE`,
                    );
                } else if (options.table.ifNotExist) {
                    s.schema = s.schema.replace(
                        /^CREATE TABLE/,
                        'CREATE TABLE IF NOT EXISTS',
                    );
                }
                if (options.table.charset === false) {
                    s.schema = s.schema.replace(
                        /( )?(DEFAULT )?(CHARSET|CHARACTER SET) = \w+/,
                        '',
                    );
                }
            }

            // fix up binary/hex default values if formatted
            if (options.format) {
                s.schema = s.schema
                    // fix up binary and hex strings
                    .replace(/DEFAULT b '(\d+)'/g, "DEFAULT b'$1'")
                    .replace(/DEFAULT X '(\d+)'/g, "DEFAULT X'$1'")
                    // fix up set defs which get split over two lines and then cause next lines to be extra indented
                    .replace(/\n {2}set/g, ' set')
                    .replace(/ {4}/g, '  ');
            }

            // add a semicolon to separate schemas
            s.schema += ';';

            // pad the sql with a header
            s.schema = [
                '# ------------------------------------------------------------',
                `# SCHEMA DUMP FOR TABLE: ${s.name}`,
                '# ------------------------------------------------------------',
                '',
                s.schema,
                '',
            ].join('\n');

            return s;
        })
        .sort((a, b) => {
            // sort the views to be last

            if (a.isView && !b.isView) {
                return 1;
            }
            if (!a.isView && b.isView) {
                return -1;
            }

            return 0;
        });

    return createStatements;
}

export {
    ShowCreateView,
    ShowCreateTable,
    ShowCreateTableStatementRes,
    getSchemaDump,
};
