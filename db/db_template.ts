import mysql from 'mysql'

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '[Your password]',
    database: '[Your database]'
});

db.connect();

