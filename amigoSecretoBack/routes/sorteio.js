const express = require('express');
const db = require('../models/database');
const router = express.Router();

router.post('/:id/sorteio', (req, res) => {
    const { id } = req.params; 

    db.serialize(() => {
        db.get('SELECT * FROM grupos WHERE id = ?', [id], (err, group) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!group) {
                return res.status(404).json({ error: 'Grupo não encontrado.' });
            }

            db.get('SELECT COUNT(*) AS count FROM sorteio WHERE id_group = ?', [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                if (result.count > 0) {
                    db.run('DELETE FROM sorteio WHERE id_group = ?', [id], (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Erro ao limpar os resultados anteriores.' });
                        }
                    });
                }

                db.all(
                    `SELECT u.id, u.name FROM user_grupos ug
                    JOIN users u ON ug.id_user = u.id
                    WHERE ug.id_group = ?`,
                    [id],
                    (err, participants) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (participants.length < 2) {
                            return res
                                .status(400)
                                .json({ error: 'O grupo deve ter pelo menos 2 participantes para o sorteio.' });
                        }

                        const shuffled = participants.sort(() => Math.random() - 0.5);

                        const drawResults = shuffled.map((participant, index) => {
                            const receiver =
                                index === shuffled.length - 1 ? shuffled[0] : shuffled[index + 1];
                            return {
                                id_group: id,
                                id_user_secreto: participant.id,
                                id_user_presenteado: receiver.id,
                            };
                        });

                        const placeholders = drawResults
                            .map(() => '(?, ?, ?)')
                            .join(', ');
                        const values = drawResults.flatMap((result) => [
                            result.id_group,
                            result.id_user_secreto,
                            result.id_user_presenteado,
                        ]);

                        db.run(
                            `INSERT INTO sorteio (id_group, id_user_secreto, id_user_presenteado) VALUES ${placeholders}`,
                            values,
                            (err) => {
                                if (err) {
                                    return res.status(500).json({
                                        error: 'Erro ao salvar os resultados do sorteio.',
                                    });
                                }

                                db.all(
                                    `SELECT s.id_group, 
                                    u1.name AS gifter_name, 
                                    u2.name AS receiver_name
                                    FROM sorteio s
                                    JOIN users u1 ON s.id_user_secreto = u1.id
                                    JOIN users u2 ON s.id_user_presenteado = u2.id
                                    WHERE s.id_group = ?`,
                                    [id],
                                    (err, results) => {
                                        if (err) {
                                            return res.status(500).json({
                                                error: 'Erro ao buscar os resultados do sorteio.',
                                            });
                                        }

                                        res.status(201).json({
                                            message: 'Novo sorteio realizado com sucesso.',
                                            results: results,
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            });
        });
    });
});

module.exports = router;