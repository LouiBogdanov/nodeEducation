import dotenv from 'dotenv';
dotenv.config();

const { POSTGRES_URL } = process.env;

const knexConfig = {
    client: 'pg',
    connection: {
        connectionString: POSTGRES_URL,
    },
    migrations: {
        tableName: 'knex_migrations_2',
        extension: 'js',
    },
    pool: {
        min: 2,
        max: 10,
    },
};

export default knexConfig;
