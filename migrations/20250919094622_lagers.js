/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('lagers', (table) => {
        table.increments('id').primary();
        table.string('fullName').notNullable();
        table.string('unit').notNullable();
        table.boolean('isWeight').notNullable();
    });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable('lagers');
}
