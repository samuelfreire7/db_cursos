const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Criar aluno
router.post('/', async (req, res) => {
    const { nome, email, curso_id } = req.body;
    try {
        const alunos = await prisma.alunos.create({
            data: { nome, email, curso_id }
        });
        res.json(alunos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar alunos
router.get('/', async (req, res) => {
    const alunos = await prisma.alunos.findMany();
    res.json(alunos);
});
// Listar por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const alunos = await prisma.alunos.findUnique({ where: { id } });
  if (!alunos) return res.status(404).json({ error: 'Aluno não encontrado' });
  res.json(alunos);
});


// Atualizar aluno
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, curso_id } = req.body;
    try {
        const alunos = await prisma.alunos.update({
            where: { id: parseInt(id) },
            data: { nome, email, curso_id }
        });
        res.json(alunos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedAlunos = await prisma.alunos.update({
    where: { id },
    data: req.body
  });
  res.json(updatedAlunos);
});


// Deletar curso
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.alunos.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'Aluno deletado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
