# Amigo-Secreto
Este projeto é um Aplicativo Web de Sorteio de Amigo Secreto Feito com frontend em **Angular** e backend em **Node.js** e o banco de dados em **SQLite**

## Estrutura do Repositório

- `amigoSecretoFront/`: Contém o código fonte do frontend (Angular).
- `amigoSecretoBack/`: Contém o código fonte do backend (Node.js).

## Requisitos

Antes de começar, você precisará ter os seguintes itens instalados na sua máquina:

- **Node.js** (para o backend)
- **npm** (gerenciador de pacotes para o frontend e backend)
- **Angular CLI** (para o desenvolvimento do frontend)

## Instalação e Execução

### Banco de dados

Como foi feito em SQLite, o banco de dados vem vazio, sendo ele o arquivo /amigoSecretoBack/database.sqlite, caso queira deletar o banco de dado já utilizado para criar outro, basta deletar /amigoSecretoBack/database.sqlite e recriar um arquivo de texto com exatamente o mesmo nome.

### Backend (Node.js)

1. Navegue até o diretório do backend:

   ```bash
   cd amigoSecretoBack
   ```
2. Instale as dependências do backend:

   ```bash
   npm install
   ```

3. Inicie o servidor backend:

    ```bash
    node index.js
    ```

O servidor estará rodando por padrão em http://localhost:3000.


### Frontend (Angular)

1. Navegue até o diretório do frontend:

   ```bash
   cd amigoSecretoFront
   ```
2. Instale as dependências do frontend:

   ```bash
   npm install
   ```

3. Inicie o servidor frontend:

    ```bash
    ng serve
    ```

O frontend estará rodando por padrão em http://localhost:4200. E o aplicativo estara disponivel em http://localhost:4200/grupos. (Será automaticamente redirecionado)

## Explicação
### Frontend (Angular)
O frontend foi desenvolvido com o Angular 18 com bootstrap 5 como biblioteca de estilização para uma criação mais fluida e contém uma interface que se comunica com a API do backend. O Angular utiliza o HttpClientModule para realizar requisições HTTP para a API, consumindo os endpoints disponíveis.

### Backend (Node.js)
O backend é uma API RESTful implementada em Node.js com Express. Ele expõe vários endpoints para manipulação de dados. A API pode ser acessada via HTTP, utilizando os métodos GET, POST, PUT e DELETE.

As chamadas disponiveis são:

- POST /grupos : Criar um novo grupo.
- GET /grupos : Listar todos os grupos criados.
- GET /grupos/:id : Obter informações detalhadas de um grupo.
- DELETE /grupos/:id : Excluir um grupo.
- POST /grupos/:id/participantes : Adicionar um participante a um grupo.
- DELETE /grupos/:id/participantes : Remover um participante de um grupo.
- PUT /grupos/:id/sorteio : Realizar o sorteio de amigo secreto para um grupo. .

### Comunicação Frontend - Backend
O frontend se comunica com o backend realizando chamadas HTTP para os endpoints configurados no Node.js. Essas chamadas foram feitas utilizando o HttpClient do Angular.

