require('dotenv').config(); // Carregar variáveis do arquivo .env
const mysql = require('mysql2');

// Configurações da conexão usando variáveis de ambiente
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Testar a conexão
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL como ID:', connection.threadId);

    // Criar o banco de dados
    const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME;
    connection.query(createDatabaseQuery, (err) => {
        if (err) {
            console.error('Erro ao criar banco de dados:', err);
            connection.end();
            return;
        }
        console.log('Banco de dados criado ou já existe.');

        // Mudar para o banco de dados criado
        connection.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) {
                console.error('Erro ao mudar para o banco de dados:', err);
                connection.end();
                return;
            }

            // Criar tabelas
            const createTables = [
                `CREATE TABLE IF NOT EXISTS usuarios (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL,
                    password VARCHAR(255) NOT NULL
                )`,
                `CREATE TABLE IF NOT EXISTS clientes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nome VARCHAR(100) NOT NULL,
                    telefone VARCHAR(15),
                    email VARCHAR(100)
                )`,
                `CREATE TABLE IF NOT EXISTS veiculos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    cliente_id INT,
                    modelo VARCHAR(100),
                    placa VARCHAR(10),
                    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
                )`,
                `CREATE TABLE IF NOT EXISTS servicos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    descricao VARCHAR(255),
                    preco DECIMAL(10, 2)
                )`,
                `CREATE TABLE IF NOT EXISTS produtos (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nome VARCHAR(100),
                    quantidade INT,
                    preco DECIMAL(10, 2)
                )`
            ];

            // Executar cada consulta de criação de tabela
            createTables.forEach((query) => {
                connection.query(query, (err) => {
                    if (err) {
                        console.error('Erro ao criar tabela:', err);
                    } else {
                        console.log('Tabela criada ou já existe.');
                    }
                });
            });

            // Fechar a conexão
            connection.end();
        });
    });
});