# Kanban Board

Por Murilo Beraldo.

## 🚀 Como Rodar o Projeto

O projeto é dividido em duas partes: `backend` (API e Banco de Dados) e `frontend` (Interface). Você precisará de dois terminais abertos.

### 1. Backend (NestJS + Prisma)

Abra o primeiro terminal na pasta raiz e execute:

```bash
cd backend

# Instalar dependências
npm install

# Crie um arquivo .env na pasta backend com o seguinte conteúdo:
# DATABASE_URL="file:./dev.db"

# Configurar o banco de dados (SQLite)
npx prisma migrate dev --name init

# Iniciar o servidor
npm run start:dev
```
O servidor rodará em: `http://localhost:3000`

### 🗄️ Visualizar Banco de Dados (Opcional)

Se quiser inspecionar as tabelas e dados visualmente, você pode usar o **Prisma Studio**.
Abra um novo terminal na pasta `backend` e execute:

```bash
npx prisma studio
```
Acesse em: `http://localhost:5555`

### 🧪 Rodando os Testes

Para garantir a qualidade do código, foram implementados testes unitários tanto no backend quanto no frontend.

#### Backend (Testes de Lógica e Serviço)
```bash
cd backend
npm run test
```
*Isso testará a lógica crítica de reordenação de tarefas e integridade dos dados.*

#### Frontend (Testes de Componentes e Interface)
```bash
cd frontend
npm run test
```
*Isso testará a renderização do Board, a lógica do Masonry Layout e a interação dos Signals.*

### 2. Frontend (Angular)

Abra um segundo terminal na pasta raiz e execute:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start
```
Acesse a aplicação em: `http://localhost:4200`

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Angular 21 (Signals, Standalone Components)
- **Drag & Drop:** Angular CDK
- **Estilização:** CSS
- **Testes:** Vitest / Jasmine

### Backend
- **Framework:** NestJS
- **Banco de Dados:** SQLite
- **ORM:** Prisma
- **Testes:** Jest

---

## 🧠 Decisões Técnicas e Jornada de Aprendizado

Este projeto marca meu **primeiro contato prático com Angular**, complementando meus estudos atuais em React (fullstackopen.com). O objetivo foi explorar o ecossistema Angular moderno e construir uma aplicação completa e funcional.

### Evolução do Projeto
1.  **MVP (Frontend):** Iniciei criando os componentes básicos (`Board`, `Column`, `Card`) e implementando a reatividade com **Angular Signals** em vez do tradicional RxJS para gerenciamento de estado local.
2.  **Integração Backend:** Desenvolvi uma API REST com **NestJS**. A primeira versão utilizava persistência em memória (arrays), evoluindo posteriormente para **Prisma + SQLite** para garantir persistência real e integridade dos dados.
3.  **Refinamento de UX/UI:**
    *   **Masonry Layout:** Implementei um algoritmo customizado para distribuir as colunas verticalmente, otimizando o espaço da tela (semelhante ao Pinterest/Trello).
    *   **Interatividade:** Adicionei botões de ação contextuais ("Adicionar Tarefa") dentro de cada coluna e animações suaves.
4.  **Qualidade de Código:** Implementei testes unitários no Backend (cobrindo a lógica complexa de reordenação de tarefas) e no Frontend (garantindo a renderização correta do layout). Utilizei ferramentas de IA como suporte para acelerar o desenvolvimento de estilos e refatoração.