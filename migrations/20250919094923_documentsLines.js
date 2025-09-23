/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('documentsLines', (table) => {
        table.increments('id').primary();
        table.integer('documentId').notNullable();
        table.integer('lagerId').notNullable();
        table.decimal('lagerCount', 9, 3).notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('documentsLines');
}
