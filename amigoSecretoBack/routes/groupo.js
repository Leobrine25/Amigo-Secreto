const express = require('express');
const db = require('../models/database');

const router = express.Router();

router.post('/', (req, res) => {
    const { name_group } = req.body;
    if (name_group == ""){
        return res.status(400).json({error: 'O Nome não pode estar vazio'})
    }

    db.get('SELECT * FROM grupos WHERE name_group = ?', [name_group], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            return res.status(400).json({ error: 'Grupo já existe' });
        }

        db.run('INSERT INTO grupos (name_group) VALUES (?)', [name_group], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Grupo Criado', id: this.lastID });
        });
    });
});

// Listar Grupos
router.get('/', (req, res) => {
    db.all('SELECT * FROM grupos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

//Pegar informação do Grupo
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM grupos WHERE id = ?', [id], (err, group) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!group) {
            return res.status(404).json({ error: 'Grupo não encontrado' });
        }

        db.all(
            `SELECT users.id, users.name 
            FROM user_grupos 
            JOIN users ON user_grupos.id_user = users.id 
            WHERE user_grupos.id_group = ?`, 
            [id], 
            (err, participants) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            db.all(
                `SELECT s.id_user_secreto AS gifter_id, 
                        s.id_user_presenteado AS receiver_id,
                        u1.name AS gifter_name, 
                        u2.name AS receiver_name 
                 FROM sorteio s
                 JOIN users u1 ON s.id_user_secreto = u1.id
                 JOIN users u2 ON s.id_user_presenteado = u2.id
                 WHERE s.id_group = ?`,
                [id],
                (err, drawResults) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    res.json({
                        group,
                        participants,
                        sorteioOccurred: drawResults.length > 0,
                        drawResults: drawResults.length > 0 ? drawResults : null,
                    });
                }
            );
        });
    });
});

//Deletar Grupo
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.serialize(() => {
        db.get('SELECT * FROM grupos WHERE id = ?', [id], (err, group) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!group) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            db.run('DELETE FROM user_grupos WHERE id_group = ?', [id], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao excluir relacionamentos de usuários' });
                }

                db.run('DELETE FROM sorteio WHERE id_group = ?', [id], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Erro ao excluir sorteios' });
                    }

                    db.run('DELETE FROM grupos WHERE id = ?', [id], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Erro ao excluir o grupo' });
                        }

                        res.status(200).json({ message: 'Grupo e todos os relacionamentos excluídos com sucesso' });
                    });
                });
            });
        });
    });
});

module.exports = router;