# 4P-1-backend-advanced

RESTful API para gestão de usuários desenvolvida com Node.js, Express e MongoDB (Mongoose) seguindo a arquitetura em camadas (Routes, Controllers, Services, Models) com tratamento centralizado de erros de domínio e suíte completa de testes.

## Estrutura do Projeto

```text
4P-1-backend-advanced/
├── config/
│   └── db.js                 # Conexão com o banco de dados MongoDB via Mongoose
├── controller/
│   └── userController.js     # Controladores HTTP (validação de requisição/resposta)
├── errors/
│   └── customErrors.js       # Exceções de domínio (NotFoundError, ConflictError, etc.)
├── models/
│   └── User.js               # Modelo Mongoose e validações de dados do Usuário
├── routes/
│   └── userRoutes.js         # Definição das rotas da API REST
├── services/
│   └── userService.js        # Camada de Serviço (Regras de negócio e operações de banco)
├── tests/
│   ├── unit/                 # Testes unitários do Modelo e dos Serviços
│   └── integration/          # Testes de integração das rotas HTTP (Supertest)
├── .env                      # Variáveis de ambiente (não versionado)
├── .env.example              # Template de variáveis de ambiente
├── app.js                    # Configuração da aplicação Express e Middlewares
├── docker-compose.yml        # Configuração do banco de dados MongoDB 7 no Docker
├── index.js                  # Inicialização do servidor e conexão com o DB
├── package.json
└── README.md
```

---

## Arquitetura e Camadas

- **Routes (`routes/`)**: Mapeiam os endpoints REST para as funções dos controladores.
- **Controllers (`controller/`)**: Tratam requisições HTTP, extraem dados e parâmetros, invocam a camada de serviços e retornam as respostas formatadas com seus respectivos códigos de status (200, 201, 400, 401, 404, 409).
- **Services (`services/`)**: Concentram todas as regras de negócio, validações de unicidade de e-mail e operações assíncronas com o MongoDB via Mongoose.
- **Models (`models/`)**: Definem os Schemas do Mongoose com validações rigorosas e métodos utilitários.
- **Errors (`errors/`)**: Erros de domínio estruturados (`AppError`, `NotFoundError`, `ConflictError`, `ValidationError`, `UnauthorizedError`) para mapeamento limpo de status HTTP.

---

## Regras de Validação de Dados

- **`name`**: Texto obrigatório, mínimo de 2 caracteres.
- **`birthday`**: Data obrigatória no formato válido (ex: `YYYY-MM-DD`). **Não permite datas futuras** nem datas anteriores ao ano 1900.
- **`email`**: Formato de e-mail válido (`usuario@dominio.com`) e único no sistema.
- **`password`**: Texto obrigatório com no mínimo 6 caracteres.
- **`role`**: Array de papéis. Papéis permitidos: `['user', 'admin', 'manager']` (padrão: `['user']`).

---

## Sistema de Logging

Todas as tentativas e erros de validação são registrados no console com marcadores formatados:
- `[DB SUCCESS]`: Emitido ao conectar com sucesso ao MongoDB.
- `[VALIDATION FAILED]`: Emitido ao falhar em uma regra de negócio no modelo.
- `[API VALIDATION ERROR]`: Emitido ao capturar requisições HTTP 400 inválidas.
- `[API WARN]`: Emitido ao tentar buscar/atualizar usuário inexistente ou e-mail duplicado.
- `[API SUCCESS]`: Emitido ao concluir operações de criação, atualização, exclusão e autenticação.

---

## Endpoints e Modelos de Requisição/Resposta

### 1. Criar Usuário (`POST /api/users`)

**Request Body:**
```json
{
  "name": "Alice Silva",
  "birthday": "1995-05-15",
  "email": "alice@example.com",
  "password": "secretPassword123",
  "role": ["user", "admin"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "e4b3c9a1-8d2e-4f1a-9c3b-5d6e7f8a9b0c",
    "name": "Alice Silva",
    "birthday": "1995-05-15",
    "age": 31,
    "email": "alice@example.com",
    "role": ["user", "admin"],
    "isActive": true,
    "createdAt": "2026-07-29T23:00:00.000Z",
    "updatedAt": "2026-07-29T23:00:00.000Z"
  }
}
```

---

### 2. Listar Usuários (`GET /api/users`)

**Response (200 OK):**
```json
{
  "success": true,
  "total": 1,
  "data": [
    {
      "id": "e4b3c9a1-8d2e-4f1a-9c3b-5d6e7f8a9b0c",
      "name": "Alice Silva",
      "birthday": "1995-05-15",
      "age": 31,
      "email": "alice@example.com",
      "role": ["user", "admin"],
      "isActive": true,
      "createdAt": "2026-07-29T23:00:00.000Z",
      "updatedAt": "2026-07-29T23:00:00.000Z"
    }
  ]
}
```

---

### 3. Obter Usuário por ID (`GET /api/users/{id}`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "e4b3c9a1-8d2e-4f1a-9c3b-5d6e7f8a9b0c",
    "name": "Alice Silva",
    "birthday": "1995-05-15",
    "age": 31,
    "email": "alice@example.com",
    "role": ["user", "admin"],
    "isActive": true,
    "createdAt": "2026-07-29T23:00:00.000Z",
    "updatedAt": "2026-07-29T23:00:00.000Z"
  }
}
```

---

### 4. Autenticação de Usuário (`POST /api/users/login`)

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "secretPassword123"
}
```

---

### 5. Atualizar Perfil (`PUT /api/users/{id}`)

**Request Body:**
```json
{
  "name": "Alice Silva Ramos",
  "email": "alice.ramos@example.com",
  "birthday": "1995-05-20"
}
```

---

### 6. Deletar Usuário (`DELETE /api/users/{id}`)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Como Configurar e Executar

1. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Subir o banco de dados MongoDB 7 no Docker:**
   ```bash
   docker compose up -d
   ```

4. **Executar a suíte de testes (Jest + Supertest):**
   ```bash
   npm test
   ```

5. **Iniciar a aplicação:**
   ```bash
   # Modo desenvolvimento (com Nodemon)
   npm run dev

   # Modo produção
   npm start
   ```
