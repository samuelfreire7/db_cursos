const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const cursosRoutes = require('./routes/cursos');
const alunosRoutes = require('./routes/alunos');
const userRoutes = require('./routes/user');
const funcionariosRoutes = require('./routes/funcionarios');

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/cursos', cursosRoutes);
app.use('/alunos', alunosRoutes);
app.use('/users', userRoutes);
app.use('/funcionarios', funcionariosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
