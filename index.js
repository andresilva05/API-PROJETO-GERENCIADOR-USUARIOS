// Importa o módulo Express para criar o servidor e manipular rotas
import express from 'express';

// Importa a função v4 da biblioteca uuid para gerar identificadores únicos
import { v4 as uuidv4, v4 } from 'uuid';

// Importa o middleware cors para permitir requisições de outros domínios
import cors from 'cors';

// Cria uma instância do aplicativo Express
const app = express();

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Middleware cors para permitir que a API seja acessada por outros domínios
app.use(cors());

/* Tipos de parâmetros comuns em APIs:
- Query params: /users?name=andre&age=18  -> usados para filtros de busca.
- Route params: /users/1                  -> usados para buscar, atualizar ou deletar itens específicos.
- Request body: { "name": "Andre", "age": 18 } -> usados para criar ou modificar recursos (ex.: inserir dados no back-end).

- Métodos HTTP mais comuns:
  - GET     => Buscar dados no back-end
  - POST    => Criar dados no back-end
  - PUT/PATCH => Atualizar dados no back-end
  - DELETE  => Deletar dados no back-end
*/

// Inicializa um array para armazenar os usuários (simula um banco de dados)
const users = [];

// Middleware para verificar se o ID do usuário existe antes de realizar certas operações
const checkUserId = (request, response, next) => {
    // Extrai o 'id' dos parâmetros da rota
    const { id } = request.params;
    
    // Busca o índice do usuário na lista de usuários baseado no 'id'
    const index = users.findIndex((user) => user.id === id);

    // Se o índice for menor que 0, significa que o usuário não foi encontrado
    if (index < 0) {
        return response.status(404).json({ message: 'User not found' }); // Retorna erro 404 se o usuário não existir
    }

    // Adiciona o índice e o 'id' do usuário na requisição para ser acessado nas rotas subsequentes
    request.userIndex = index;
    request.userId = id;
    
    // Chama o próximo middleware ou a rota
    next();
}

// Rota GET para buscar todos os usuários cadastrados
app.get('/users', (request, response) => {
    // Retorna a lista de usuários em formato JSON
    return response.json(users);
});

// Rota POST para criar um novo usuário
app.post('/users', (request, response) => {
    // Extrai o nome e a idade do corpo da requisição
    const { name, age } = request.body;

    // Cria um novo objeto de usuário com um ID gerado pelo UUID
    const user = { id: v4(), name, age };

    // Adiciona o novo usuário à lista de usuários
    users.push(user);

    // Retorna o usuário recém-criado com status 201 (Created)
    return response.status(201).json(user);
});

// Rota PUT para atualizar um usuário existente pelo ID
app.put('/users/:id', (request, response) => {
    // Extrai o 'id' dos parâmetros da URL
    const { id } = request.params;
    
    // Extrai o novo nome e idade do corpo da requisição
    const { name, age } = request.body;

    // Valida se o nome e a idade foram fornecidos
    if (!name || !age) {
        return response.status(400).json({ message: "Nome e idade são obrigatórios" }); // Retorna erro 400 se faltar algum dado
    }

    // Encontra o índice do usuário com o 'id' correspondente
    const index = users.findIndex(user => user.id === id);

    // Verifica se o usuário existe
    if (index < 0) {
        return response.status(404).json({ message: "Usuário não encontrado" }); // Retorna erro 404 se o usuário não for encontrado
    }

    // Atualiza os dados do usuário
    const updatedUser = { id, name, age };
    users[index] = updatedUser; // Substitui o usuário antigo com os novos dados

    // Retorna o usuário atualizado
    return response.json(updatedUser);
});

// Rota DELETE para deletar um usuário pelo ID
app.delete('/users/:id', (request, response) => {
    // Extrai o 'id' dos parâmetros da URL
    const { id } = request.params;

    // Encontra o índice do usuário na lista de usuários
    const index = users.findIndex(user => user.id === id);

    // Verifica se o usuário existe
    if (index < 0) {
        return response.status(404).json({ message: "Usuário não encontrado" }); // Retorna erro 404 se o usuário não for encontrado
    }

    // Remove o usuário da lista
    users.splice(index, 1);

    // Retorna status 204 (No Content) para indicar que a exclusão foi bem-sucedida, sem conteúdo no corpo da resposta
    return response.status(204).send();
});

// Inicia o servidor na porta 3001 ou na porta definida pela variável de ambiente
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    // Exibe uma mensagem no console indicando que o servidor está rodando
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Explicações principais:
// Rotas HTTP: São as rotas que o servidor responde, como GET, POST, PUT, DELETE, usadas para buscar, criar, atualizar ou excluir dados.
// Middleware checkUserId: Verifica se o usuário existe na base de dados antes de realizar ações de atualização ou remoção.
// Armazenamento de usuários: Os usuários são armazenados em um array users, e cada usuário tem um id único gerado pela função uuid.
// Requisições assíncronas: As requisições podem ser feitas em ambientes de front-end, como o React, usando axios para consumir os dados dessa API.
