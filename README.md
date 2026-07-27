# 4P-1-backend-advanced

Atividade da disciplina de **Advanced Back-End**.

## Descrição

Projeto Node.js demonstrando a implementação da classe `User` com atributos obrigatórios, validações, dados auditáveis e métodos auxiliares.

## Estrutura do Projeto

- `User.js` — Classe `User` com atributos e métodos.
- `index.js` — Script principal com exemplo de instanciação e teste dos métodos.
- `package.json` — Configuração do projeto e scripts de execução.

## Classe `User`

### Atributos

| Atributo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `name` | `string` | Sim | Nome completo do usuário |
| `birthday` | `Date` | Sim | Data de nascimento |
| `email` | `string` | Sim | Endereço de e-mail válido |
| `password` | `string` | Sim | Senha (mínimo 6 caracteres) |
| `id` | `string` | Não (Auto) | UUID v4 gerado automaticamente |
| `role` | `Array<string>` | Não | Papéis do usuário (padrão: `['user']`) |
| `isActive` | `boolean` | Não | Status da conta (padrão: `true`) |
| `createdAt` | `Date` | Não (Auto) | Data de criação |
| `updatedAt` | `Date` | Não (Auto) | Data da última atualização |

### Métodos

- `getAge()` — Retorna a idade calculada a partir de `birthday`.
- `updateProfile({ name, email, birthday })` — Atualiza atributos do perfil e recalcula `updatedAt`.
- `updatePassword(newPassword)` — Atualiza a senha e recalcula `updatedAt`.
- `authenticate(inputPassword)` — Valida se a senha informada confere.
- `activate()` / `deactivate()` — Altera o status `isActive`.
- `toJSON()` — Retorna representação pública em objeto, omitindo a propriedade `password`.

## Como Executar

### Pré-requisitos

- Node.js instalado (v16+)

### Scripts Disponíveis

```bash
# Execução normal
npm start

# Execução em modo de desenvolvimento (com nodemon)
npm run dev
```
