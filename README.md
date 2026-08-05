# 4P-1-backend-advanced

RESTful API para gestão de usuários desenvolvida com Node.js, Express e MongoDB (Mongoose) seguindo a arquitetura em camadas (Routes, Controllers, Services, Models), camada de segurança com **Autenticação JWT (JSON Web Tokens)**, controle de acesso baseado em papéis (RBAC) e suíte de testes automatizados com Jest e Supertest.

---

## Estrutura do Projeto

```text
4P-1-backend-advanced/
├── config/
│   └── db.js                 # Conexão com o banco de dados MongoDB via Mongoose
├── controller/
│   └── userController.js     # Controladores HTTP (validação de requisição/resposta)
├── errors/
│   └── customErrors.js       # Exceções de domínio (NotFoundError, ConflictError, UnauthorizedError, etc.)
├── middleware/
│   └── authMiddleware.js     # Middlewares de Autenticação JWT e Autorização de Papéis
├── models/
│   └── User.js               # Modelo Mongoose e validações de dados do Usuário
├── routes/
│   └── userRoutes.js         # Definição das rotas da API REST
├── services/
│   └── userService.js        # Camada de Serviço (Regras de negócio e geração de tokens JWT)
├── tests/
│   ├── unit/                 # Testes unitários do Modelo, Serviços e Middlewares JWT
│   └── integration/          # Testes de integração das rotas HTTP (Supertest)
├── utils/
│   └── jwt.js                # Utilitário para assinar e verificar tokens JWT
├── .env                      # Variáveis de ambiente (não versionado)
├── .env.example              # Template de variáveis de ambiente
├── app.js                    # Configuração da aplicação Express e Middlewares
├── docker-compose.yml        # Configuração do banco de dados MongoDB 7 no Docker
├── index.js                  # Inicialização do servidor e conexão com o DB
├── package.json
└── README.md
```

---

## Arquitetura e Camadas de Segurança

- **JWT Helper (`utils/jwt.js`)**: Responsável por assinar tokens JWT contendo `{ id, email, role }` com expiração de 24h utilizando a chave `JWT_SECRET`.
- **Auth Middleware (`middleware/authMiddleware.js`)**: Valida o cabeçalho `Authorization: Bearer <token>` nas requisições para rotas protegidas e fornece autorização por papéis (`authorizeRoles`).
- **Controllers (`controller/`)**: Tratam requisições HTTP e passam parâmetros para a camada de serviço.
- **Services (`services/`)**: Executam as regras de negócio e geram o token JWT no login.
- **Errors (`errors/`)**: Erros de domínio mapeados para códigos de status HTTP (400, 401, 403, 404, 409).

---

## Endpoints e Autenticação JWT

### Rotas Públicas
- `POST /api/users` (Cadastro de usuário)
- `POST /api/users/login` (Autenticação / Obtenção de Token JWT)

### Rotas Protegidas (Exigem cabeçalho `Authorization: Bearer <token>`)
- `GET /api/users` (Listar usuários)
- `GET /api/users/:id` (Obter usuário por ID)
- `PUT /api/users/:id` (Atualizar perfil)
- `DELETE /api/users/:id` (Remover usuário)

---

### Exemplo: Autenticação de Usuário (`POST /api/users/login`)

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "secretPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "e4b3c9a1-8d2e-4f1a-9c3b-5d6e7f8a9b0c",
      "name": "Alice Silva",
      "birthday": "1995-05-15",
      "age": 31,
      "email": "alice@example.com",
      "role": ["user", "admin"],
      "isActive": true,
      "createdAt": "2026-07-29T23:00:00.000Z",
      "updatedAt": "2026-07-29T23:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Como Consumir Rotas Protegidas

Adicione o cabeçalho HTTP `Authorization` em suas requisições:
```http
GET /api/users HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Caso o token não seja enviado ou seja inválido/expirado, a API retornará `401 Unauthorized`:
```json
{
  "success": false,
  "message": "Access token is required"
}
```

---

## Como Configurar e Executar

1. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Instalar dependências:**
   ```bash
   npm install
   ```

3. **Subir o banco de dados MongoDB no Docker:**
   ```bash
   docker compose up -d
   ```

4. **Executar a suíte de testes (Jest + Supertest):**
   ```bash
   npm test
   ```

5. **Iniciar a aplicação:**
   ```bash
   npm run dev
   ```

## Prints de Requests & Responses (Postman)

### Cadastro de Usuário (POST /api/users) ✅

![Cadastro de Usuário (POST /api/users)](images/signup.png)

### Login (POST /api/users/login) ✅

![Login (POST /api/users/login)](images/login.png)

### Listar Usuários (GET /api/users) ✅

![Listar Usuários (GET /api/users)](images/list_users.png)

### Obter Usuário por ID (GET /api/users/:id) ✅

![Obter Usuário por ID (GET /api/users/:id)](images/get_user.png)

### Atualizar Perfil (PUT /api/users/:id) ✅

![Atualizar Perfil (PUT /api/users/:id)](images/update_user.png)

### Remover Usuário (DELETE /api/users/:id) ✅

![Remover Usuário (DELETE /api/users/:id)](images/delete_user.png)
