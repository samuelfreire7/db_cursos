const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verificarToken = require('../middlewares/verificarToken1');
require('dotenv').config();

const prisma = new PrismaClient();

// 🔐 LOGIN (gera token)
router.post('/login', async (req, res) => {
  const { cargo, matricula } = req.body;

  try {
    const funcionarios = await prisma.funcionarios.findUnique({ where: { matricula } });
    if (!funcionarios) return res.status(404).json({ error: 'Funcionário não encontrado' });

    const matriculaConfere = await bcrypt.compare(matricula, funcionarios.matricula);
    if (!matriculaConfere) return res.status(401).json({ error: 'Matricula incorreta' });

    // Gerar token JWT
    const token = jwt.sign({ id: funcionarios.id, email: funcionarios.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      funcionarios: { id: funcionarios.id, nome: funcionarios.nome, cargo: funcionarios.cargo },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 CRIAR usuário
router.post('/', async (req, res) => {
  const { nome, cargo, matricula } = req.body;
  const hashedMatricula = await bcrypt.hash(matricula, 10);
  try {
    const funcionarios = await prisma.funcionarios.create({
      data: { nome, cargo, matricula: hashedMatricula },
    });
    res.json(funcionarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔐 LISTAR TODOS (com token obrigatório)
router.get('/', verificarToken, async (req, res) => {
  const funcionarios = await prisma.funcionarios.findMany();
  res.json(funcionarios);
});

// 🔎 LISTAR POR ID
router.get('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  const funcionarios = await prisma.funcionarios.findUnique({ where: { id } });
  if (!funcionarios) return res.status(404).json({ error: 'Funcionário não encontrado' });
  res.json(funcionarios);
});

// 🔄 ATUALIZAR usuário
router.put('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const { nome, cargo, matricula } = req.body;
  const hashedMatricula = await bcrypt.hash(matricula, 10);
  try {
    const funcionarios = await prisma.funcionarios.update({
      where: { id: parseInt(id) },
      data: { nome, cargo, matricula: hashedMatricula },
    });
    res.json(funcionarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✏️ ATUALIZAR com PATCH
router.patch('/:id', verificarToken, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updatedFuncionarios = await prisma.funcionarios.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedFuncionarios);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ❌ DELETAR usuário
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.funcionarios.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Funcionário deletado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;