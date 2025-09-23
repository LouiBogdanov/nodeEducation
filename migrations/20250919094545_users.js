export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('surname').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
    });
}

export function down(knex) {
    return knex.schema.dropTable('users');
}
