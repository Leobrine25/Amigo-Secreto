const express = require('express');
const db = require('../models/database');
const router = express.Router();

function addUserToGroup(userId, groupId, res) {
    db.run(
        'INSERT INTO user_grupos (id_group, id_user) VALUES (?, ?)',
        [groupId, userId],
        (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ error: 'Erro ao adicionar usuário ao grupo.' });
            }

            res.status(201).json({
                message: 'Usuário adicionado ao grupo com sucesso.',
            });
        }
    );
}

router.post('/:id/participantes', (req, res) => {
    const { id } = req.params;
    const { userName } = req.body;

    if (!userName) {
        return res.status(400).json({ error: 'O campo userName é obrigatório.' });
    }

    db.serialize(() => {
        db.get('SELECT * FROM grupos WHERE id = ?', [id], (err, group) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!group) {
                return res.status(404).json({ error: 'Grupo não encontrado.' });
            }

            db.get(
                `SELECT u.id FROM user_grupos ug
                 JOIN users u ON ug.id_user = u.id
                 WHERE ug.id_group = ? AND LOWER(u.name) = LOWER(?)`,
                [id, userName],
                (err, existingUser) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    if (existingUser) {
                        return res
                            .status(400)
                            .json({ error: 'Já existe um usuário com este nome no grupo.' });
                    }

                    db.get(
                        'SELECT id FROM users WHERE LOWER(name) = LOWER(?)',
                        [userName],
                        (err, user) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            if (user) {
                                addUserToGroup(user.id, id, res);
                            } else {
                                db.run(
                                    'INSERT INTO users (name) VALUES (?)',
                                    [userName],
                                    function (err) {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .json({ error: 'Erro ao criar usuário.' });
                                        }

                                        addUserToGroup(this.lastID, id, res);
                                    }
                                );
                            }
                        }
                    );
                }
            );
        });
    });
});

router.delete('/:id/participantes', (req, res) => {
    const { id } = req.params; 
    const { userId } = req.body; 

    db.serialize(() => {
        // Check if the group exists
        db.get('SELECT * FROM grupos WHERE id = ?', [id], (err, group) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!group) {
                return res.status(404).json({ error: 'Grupo não encontrado' });
            }

            db.run('DELETE FROM user_grupos WHERE id_group = ? AND id_user = ?', [id, userId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erro ao remover usuário' });
                }
                res.status(200).json({ message: 'Usuário removido do grupo com sucesso' });
            });
        });
    });
});

module.exports = router;
