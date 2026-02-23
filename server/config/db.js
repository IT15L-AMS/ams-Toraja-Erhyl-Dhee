import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Database Connected Successfully!');
        connection.release();
    } catch (err) {
        console.error('❌ Database Connection Failed:', err.message);
        console.log('💡 Tip: Make sure your MySQL server is running and the database "ANS" exists.');
    }
};

testConnection();

export default pool;
