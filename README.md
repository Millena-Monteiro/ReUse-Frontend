# ♻ ReUse+

## 📜 Descrição
O *ReUse+* é uma plataforma que promove a sustentabilidade e a economia circular, conectando pessoas que desejam doar, trocar ou adquirir itens usados em bom estado. O projeto visa reduzir o consumo excessivo e o descarte inadequado, incentivando a reutilização.

## 🚀 Tecnologias usadas
- Node.js
- Express
- Sequelize (com SQLite)
- JavaScript
- Middleware para validações
- Nodemon (ambiente de desenvolvimento)

## 🔥 Funcionalidades
- ✅ Cadastro e login de usuários
- ✅ Publicação de itens (com título, descrição, categoria, status e usuário)
- ✅ Busca de itens por ID e listagem de todos os itens
- ✅ Sistema de cupons como forma de gamificação (com validade, valor e status)
- ✅ Avaliação dos itens e usuários
- ✅ Histórico de trocas/doações
- ✅ Pagamentos registrados
- ✅ Gerenciamento completo de usuários
- ✅ API REST com operações CRUD para todos os recursos

## 📁 Estrutura de Pastas

src/
├── controllers/        # Lógica das funcionalidades
├── models/             # Modelagem dos dados e banco
├── routes/             # Definição das rotas da API
└── server.js           # Arquivo principal que sobe o servidor


## 🔧 Como rodar o projeto localmente
### Pré-requisitos:
- Node.js instalado (versão 16 ou superior)
- Git instalado

### Passo a passo:
bash
# Clone o repositório
git clone https://github.com/BiaVB/ReUSE-.git

# Acesse a pasta do projeto
cd ReUSE-

# Instale as dependências
npm install

# Rode as migrações e configure o banco se necessário
# (dependendo de como o sequelize está configurado)

# Inicie o servidor
npm run dev 

# Ou, se estiver usando nodemon para desenvolvimento
npx nodemon src/server.js


O servidor irá rodar em:

http://localhost:3000

Ou acesse o deploy:

https://reuse-lwju.onrender.com


## 🔗 Endpoints da API

### 👤 Usuários
| Método | Rota                                | Descrição                              |
|--------|--------------------------------------|-----------------------------------------|
| GET    | /usuarios                            | Lista todos os usuários                 |
| GET    | /usuarios/:id                        | Busca um usuário por ID com todas informações do mesmo                |
| POST   | /usuarios                             | Cria um novo usuário                    |
| PUT    | /usuarios/:id                         | Atualiza um usuário                     |
| DELETE | /usuarios/:id                         | Deleta um usuário                       |

### 📝 Avaliações
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /avaliacoes | Lista todas as avaliações |
| GET | /avaliacoes/:id | Busca avaliação por ID |
| POST | /avaliacoes | Cria uma nova avaliação |
| PUT | /avaliacoes/:id | Atualiza uma avaliação |
| DELETE | /avaliacoes/:id | Deleta uma avaliação |

### 🎟 Cupons
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /cupons | Lista todos os cupons |
| GET | /cupons/:id | Busca cupom por ID |
| POST | /cupons | Cria um novo cupom |
| PUT | /cupons/:id | Atualiza um cupom |
| DELETE | /cupons/:id | Deleta um cupom |

### 📦 Itens
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /itens | Lista todos os itens |
| GET | /itens/:id | Busca item por ID |
| POST | /itens | Cria um novo item |
| PUT | /itens/:id | Atualiza um item |
| DELETE | /itens/:id | Deleta um item |

### 📜 Históricos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | api/historicos | Lista todos os históricos |
| POST | api/historicos | Cria um novo histórico |
| PUT | api/historicos/:id | Atualiza um histórico |
| DELETE | api/historicos/:id | Deleta um histórico |

###  💲 Pagamentos
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /pagamentos | Lista todos os pagamentos |
| POST | /pagamentos | Cria um novo pagamento |
| PUT | /pagamentos/:id | Atualiza um pagamento |
| DELETE | /pagamentos/:id | Deleta um item |

```
---

## 👥 Contribuidores
- Millena Monteiro
- Thauan Carneiro
- Hadiel de Paula
- Eduardo Lopes
- Helen Geovanna
- Gisele Gomes

---

##  🌎 Links do Projeto
- 🔗 [GitHub da API](https://github.com/BiaVB/ReUSE-)
- 🔗 [Link do Deploy da API](https://reuse-lwju.onrender.com)
- 🔗 [GitHub do Front-End](https://github.com/Millena-Monteiro/ReUse-Frontend.git)
- 🔗 [Link do Deploy da API](-)