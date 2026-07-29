# 4P-1-backend-advanced

RESTful API para gestão de usuários desenvolvida com Node.js e Express seguindo a arquitetura MVC (sem a camada de View).

## Estrutura do Projeto

```text
4P-1-backend-advanced/
├── models/
│   └── User.js             # Modelo e validações do Usuário
├── controller/
│   └── userController.js   # Controladores (CRUD, login e logs)
├── routes/
│   └── userRoutes.js       # Definição das rotas da API REST
├── .env                    # Variáveis de ambiente (não versionado)
├── .env.example            # Template de variáveis de ambiente
├── index.js                # Servidor Express e inicialização
├── package.json
└── README.md
```

## Regras de Validação de Dados

- **`name`**: Texto obrigatório, mínimo de 2 caracteres.
- **`birthday`**: Data obrigatória no formato válido (ex: `YYYY-MM-DD`). **Não permite datas futuras** nem datas anteriores ao ano 1900.
- **`email`**: Formato de e-mail válido (`usuario@dominio.com`) e único no sistema.
- **`password`**: Texto obrigatório com no mínimo 6 caracteres.
- **`role`**: Array de papéis. Papéis permitidos: `['user', 'admin', 'manager']` (padrão: `['user']`).

## Sistema de Logging

Todas as tentativas e erros de validação são registrados no console com marcadores formatados:
- `[VALIDATION FAILED]`: Emitido pelo modelo ao falhar em uma regra de negócio (ex: data futura).
- `[API VALIDATION ERROR]`: Emitido pelo controlador ao capturar requisições HTTP 400 inválidas.
- `[API WARN]`: Emitido ao tentar buscar/atualizar usuário inexistente ou e-mail duplicado.
- `[API SUCCESS]`: Emitido ao concluir operações de criação, atualização, exclusão e autenticação.

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

**Response (400 Bad Request - Data Futura):**
```json
{
  "success": false,
  "message": "Validation error: birthday cannot be a future date."
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

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Authentication successful",
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

1. Crie o arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor:
   ```bash
   # Modo desenvolvimento
   npm run dev

   # Modo produção
   npm start
   ```
