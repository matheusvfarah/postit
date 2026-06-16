# PostIt Casa

Sistema web de bilhetes digitais no estilo post-it, pensado para uso doméstico. Qualquer membro da casa cria bilhetes pelo celular e eles aparecem automaticamente em um display instalado na TV ou geladeira.

## Como funciona

| Dispositivo | Função |
|---|---|
| Celular | Criar, editar e excluir bilhetes |
| TV / Geladeira | Exibir os bilhetes em tempo real |

O display atualiza automaticamente a cada 30 segundos, sem necessidade de interação.

## Tipos de bilhete

**Recado** — mensagem simples com título, texto e autor.

**Lista** — lista de itens como compras ou tarefas, com múltiplos itens.

**Reunião** — convocação com data, horário e mensagem.

Cada bilhete pode ter uma das cinco cores disponíveis: amarelo, rosa, verde, azul ou laranja.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Front-end | HTML, CSS e JavaScript puro |
| Back-end | Node.js com Express |
| Banco de dados | PostgreSQL |
| Comunicação | API REST com JSON |

## Estrutura do projeto

```
postit/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── database/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── display/          (tela da TV)
│   └── painel/           (painel mobile)
├── database/
│   └── dump.sql
└── README.md
```

## Instalação e execução

**1. Pré-requisitos**

Ter instalado: Node.js, npm e PostgreSQL.

**2. Banco de dados**

```bash
createdb postitcasa
psql -d postitcasa -f database/dump.sql
```

**3. Configurar variáveis de ambiente**

Edite o arquivo `backend/.env` com as credenciais do seu PostgreSQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postitcasa
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
```

**4. Instalar dependências e subir o servidor**

```bash
cd backend
npm install
npm start
```

O servidor estará disponível em `http://localhost:3000`.

**5. Abrir o front-end**

Abra os arquivos diretamente no navegador:

```
frontend/painel/index.html    (painel mobile)
frontend/display/index.html   (display da TV)
```

## API REST

Base URL: `http://localhost:3000`

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /bilhetes | Lista todos os bilhetes |
| GET | /bilhetes/:id | Busca um bilhete pelo ID |
| POST | /bilhetes | Cria um novo bilhete |
| PUT | /bilhetes/:id | Edita um bilhete existente |
| DELETE | /bilhetes/:id | Remove um bilhete |

### Exemplos de requisição

**Recado**
```json
{
  "titulo": "Atenção",
  "mensagem": "Não esqueça de pagar a conta de luz.",
  "tipo": "recado",
  "cor": "amarelo",
  "autor": "João"
}
```

**Lista**
```json
{
  "titulo": "Compras do mês",
  "tipo": "lista",
  "cor": "verde",
  "autor": "Maria",
  "itens_lista": ["Arroz", "Feijão", "Ovos", "Leite"]
}
```

**Reunião**
```json
{
  "titulo": "Reunião de família",
  "mensagem": "Vamos conversar sobre as férias.",
  "tipo": "reuniao",
  "cor": "rosa",
  "autor": "Pai",
  "horario": "2026-06-20T19:00:00"
}
```

## Banco de dados

### Tabela `bilhetes`

| Coluna | Tipo | Descrição |
|---|---|---|
| id | SERIAL PRIMARY KEY | Identificador único |
| titulo | VARCHAR(100) | Título do bilhete |
| mensagem | TEXT | Conteúdo do bilhete |
| tipo | VARCHAR(20) | recado, lista ou reuniao |
| cor | VARCHAR(20) | amarelo, rosa, verde, azul ou laranja |
| autor | VARCHAR(50) | Nome de quem criou |
| horario | TIMESTAMP | Data e hora (apenas reunião) |
| itens_lista | JSONB | Itens (apenas lista) |
| criado_em | TIMESTAMP | Data de criação automática |

## Projeto acadêmico

Desenvolvido como projeto avaliativo da disciplina Programação II, UEMG Unidade Passos, semestre 2026/01.
