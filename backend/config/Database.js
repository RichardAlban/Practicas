import { Sequelize } from "sequelize";

const db = new Sequelize('auth_db', 'root', '123456789', {
    host: "localhost",
    dialect: "mysql",
    port: 3306,  // Especifica el puerto si es necesario
    dialectOptions: {
        // Si es necesario, puedes agregar configuraciones adicionales aquí.
    },
});

export default db;
