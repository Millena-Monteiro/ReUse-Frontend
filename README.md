# ♻️ ReUse+

## 📜 Descrição
O **ReUse+** é uma plataforma colaborativa que conecta pessoas interessadas em doar, trocar ou encontrar itens usados em bom estado.Nosso objetivo é transformar o consumo consciente em um hábito acessível, sustentável e humano.

## 🚀 Tecnologias usadas
- Next.js
- TailwindCss
- React
- TypeScript
- Node.js
- Express
- Sequelize (com SQLite)
- JavaScript
- Middleware para validações
- Nodemon (ambiente de desenvolvimento)



## 📁 Estrutura de Pastas
```

```

## 🔧 Como rodar o projeto localmente
### Pré-requisitos:
- Node.js instalado (versão 16 ou superior)
- Git instalado

### Passo a passo:
```bash
# Clone o repositório
git clone https://github.com/Millena-Monteiro/ReUse-Frontend.git

# Acesse a pasta do projeto
cd ReUse-Frontend

# Instale as dependências
npm install

# Inicie o servidor
npm run dev 

# Ou, se estiver usando nodemon para desenvolvimento
npx nodemon src/server.js
```

O servidor irá rodar em:
```
http://localhost:3000
```
Ou acesse o deploy:
```
COLOCAR O LINK AQUI
```

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

### 🎟️ Cupons
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

---

⚠️ Aviso Legal
Este pojeto é desenvolvido apenas para fins educativos. Não nos responsabilizamos por qualquer uso indevido das informações ou funcionalidades aqui apresentados.

---
© 2025 ReUse+.Todos os direitos reservados.