import mysql from "mysql2/promise"
import {config} from "dotenv"

config()

export const connection = mysql.createPool({
	host: process.env.CATALOG_FIT_MYSQL_DB_HOST,
	port: 3307,
	user: process.env.CATALOG_FIT_MYSQL_DB_USER,
	password: process.env.CATALOG_FIT_MYSQL_DB_PASSWORD,
	database: process.env.CATALOG_FIT_MYSQL_DB_SCHEMA,
	waitForConnections: true,
	idleTimeout: 300000,
	connectionLimit: 12,
	queueLimit: 25,
	maxIdle: 3,
	enableKeepAlive: true
})