import * as mysql from 'mysql2/promise';

const pool: Array<DB> = [];

class DB {
    private readonly connection: mysql.IPromiseConnection;
    private isConnected: boolean = true;

    // can only instantiate via DB.connect method
    private constructor(connection: mysql.IPromiseConnection) {
        this.connection = connection;
    }

    public static async connect(options: mysql.IConnectionConfig): Promise<DB> {
        const instance = new DB(await mysql.createConnection(options));
        pool.push(instance);

        return instance;
    }

    public async query<T>(sql: string): Promise<Array<T>> {
        if (!this.isConnected) {
            throw new Error(
                'Conexão não está ativa. Não é possível executar query.',
            );
        }

        try {
            const res = await this.connection.query<T>(sql);
            return res[0];
        } catch (error) {
            if (error.message && error.message.includes('closed state')) {
                this.isConnected = false;
                throw new Error(
                    'Conexão foi fechada inesperadamente. Verifique a configuração do banco de dados.',
                );
            }
            throw error;
        }
    }
    public async multiQuery<T>(sql: string): Promise<Array<Array<T>>> {
        if (!this.isConnected) {
            throw new Error(
                'Conexão não está ativa. Não é possível executar multiQuery.',
            );
        }

        try {
            let isMulti = true;
            if (sql.split(';').length === 2) {
                isMulti = false;
            }

            let res = (await this.connection.query<Array<T>>(sql))[0];
            if (!isMulti) {
                // mysql will return a non-array payload if there's only one statement in the query
                // so standardise the res..
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                res = [res] as any;
            }

            return res;
        } catch (error) {
            if (error.message && error.message.includes('closed state')) {
                this.isConnected = false;
                throw new Error(
                    'Conexão foi fechada inesperadamente. Verifique a configuração do banco de dados.',
                );
            }
            throw error;
        }
    }

    public async end(): Promise<void> {
        if (this.isConnected) {
            try {
                await this.connection.end();
                this.isConnected = false;
            } catch (error) {
                console.warn('Erro ao fechar conexão:', error);
                this.isConnected = false;
            }
        }
    }

    public static async cleanup(): Promise<void> {
        await Promise.all(
            pool.map(async p => {
                await p.end();
            }),
        );
    }
}

export { DB };
