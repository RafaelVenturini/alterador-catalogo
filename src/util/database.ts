import mysql from "mysql2/promise"
import {config} from "dotenv"
config()


export const connection = mysql.createPool({
	host: process.env.HOST,
	port: 3307,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	idleTimeout: 300000,
})