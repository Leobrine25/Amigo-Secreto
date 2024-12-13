const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const gruposRoutes = require('./routes/groupo');
const participantesRoutes = require('./routes/participantes');
const sorteioRoutes = require('./routes/sorteio')

require('./models/database');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());


// Endpoint grupos
app.use('/grupos', gruposRoutes);

// Endpont participantes
app.use('/grupos', participantesRoutes);

// Endpoint sorteio
app.use('/grupos', sorteioRoutes);


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
