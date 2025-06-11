const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
  
    try {
      const user = await prisma.users.findUnique({ where: { email } });
  
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  
      const senhaConfere = await bcrypt.compare(senha, user.senha);
      if (!senhaConfere) return res.status(401).json({ error: 'Senha incorreta' });
  
      res.json({
        message: 'Login realizado com sucesso',
        user: { id: user.id, nome: user.nome, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Criar user
router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha , 10);
    try {
        const user = await prisma.users.create({
            data: { nome, email, senha: hashedPassword }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar user
router.get('/', async (req, res) => {
    const user = await prisma.users.findMany();
    res.json(user);
});
// Listar por ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'Curso não encontrado' });
  res.json(user);
});


// Atualizar user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email, senha  } = req.body;
    const hashedPassword = await bcrypt.hash(senha , 10);
    try {
        const user = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { nome, email, senha: hashedPassword }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// atualizar com Patch
router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const updatedUsers = await prisma.user.update({
    where: { id },
    data: req.body
  });
  res.json(updatedUsers);
});


// Deletar user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'User deletado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
