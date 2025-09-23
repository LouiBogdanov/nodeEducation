/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('documents', (table) => {
        table.increments('id').primary();
        table.datetime('createdDate').notNullable();
        table.integer('createdUser').notNullable();
        table.datetime('commitDate').nullable();
        table.integer('commitUser').nullable();
        table.integer('status').notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('documents');
}
