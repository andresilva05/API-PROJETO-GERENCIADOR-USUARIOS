// Importa o módulo Express para criar o servidor e manipular rotas
import express from 'express';

// Importa a função v4 da biblioteca uuid para gerar identificadores únicos
import { v4 as uuidv4 } from 'uuid';

// Importa o middleware cors para permitir requisições de outros domínios
import cors from 'cors';

// Cria uma instância do aplicativo Express
const app = express();

// Inicia o servidor na porta 3001 ou na porta definida pela variável de ambiente
const PORT = process.env.PORT || 3001;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Middleware cors para permitir que a API seja acessada por outros domínios
app.use(cors());

// Inicializa um array para armazenar os usuários (simula um banco de dados)
const users = [];

// Middleware para verificar se o ID do usuário existe antes de realizar certas operações
const checkUserId = (request, response, next) => {
    const { id } = request.params;
    const index = users.findIndex((user) => user.id === id);

    if (index < 0) {
        return response.status(404).json({ message: 'User not found' });
    }

    request.userIndex = index;
    request.userId = id;
    next();
}

// Rota GET para buscar todos os usuários cadastrados
app.get('/users', (request, response) => {
    return response.json(users);
});

// Rota POST para criar um novo usuário
app.post('/users', (request, response) => {
    const { name, age } = request.body;
    const user = { id: uuidv4(), name, age };
    users.push(user);
    return response.status(201).json(user);
});

// Rota PUT para atualizar um usuário existente pelo ID
app.put('/users/:id', checkUserId, (request, response) => {
    const { id } = request.params;
    const { name, age } = request.body;

    if (!name || !age) {
        return response.status(400).json({ message: "Nome e idade são obrigatórios" });
    }

    const updatedUser = { id, name, age };
    users[request.userIndex] = updatedUser;
    return response.json(updatedUser);
});

// Rota DELETE para deletar um usuário pelo ID
app.delete('/users/:id', checkUserId, (request, response) => {
    users.splice(request.userIndex, 1);
    return response.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
