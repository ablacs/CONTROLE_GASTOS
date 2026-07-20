# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais com cadastro de pessoas, cadastro
de transações (receitas/despesas) e consulta de totais.

- **Back-end**: .NET 8 / ASP.NET Core Web API + Entity Framework Core (SQLite)
- **Front-end**: React + TypeScript (Vite)

## Estrutura do repositório

controle-gastos/
├── backend/
│ └── ControleGastos.Api/
│ ├── Controllers/ -> Endpoints da API (Pessoas e Transações)
│ ├── Models/ -> Entidades do domínio (Pessoa, Transacao, TipoTransacao)
│ ├── DTOs/ -> Objetos de entrada/saída da API
│ ├── Data/ -> AppDbContext (configuração do EF Core)
│ └── Program.cs -> Ponto de entrada, configuração de serviços e CORS
└── frontend/
└── src/
├── components/ -> Telas de Pessoas, Transações e Totais
├── api.ts -> Comunicação HTTP com o back-end
├── types.ts -> Tipos TypeScript compartilhados
└── styles.css -> Estilos da interface

## Regras de negócio implementadas

1. **Pessoas**: cadastro com Id (Guid, gerado automaticamente), Nome e Idade.
   Suporta criação, listagem e exclusão.
2. **Exclusão em cascata**: ao deletar uma pessoa, todas as transações dela são
   apagadas automaticamente (configurado via `OnDelete(DeleteBehavior.Cascade)`
   no `AppDbContext`, ver `Data/AppDbContext.cs`).
3. **Transações**: cadastro com Id (Guid), Descrição, Valor, Tipo
   (Receita/Despesa) e PessoaId. Suporta criação e listagem.
4. **Menores de idade**: se a pessoa vinculada à transação tiver menos de 18
   anos, apenas despesas podem ser cadastradas (validado em
   `Controllers/TransacoesController.cs`, método `Criar`).
5. **Validação de pessoa existente**: uma transação só pode ser criada se o
   `PessoaId` informado já existir no cadastro de pessoas.
6. **Consulta de totais**: endpoint `GET /api/transacoes/totais` devolve, para
   cada pessoa, o total de receitas, total de despesas e saldo
   (receita - despesa), além do total geral somando todas as pessoas.

## Persistência

Os dados são armazenados em um banco SQLite (arquivo `controle_gastos.db`,
gerado automaticamente na pasta do projeto do back-end). Por ser um arquivo em
disco, os dados persistem mesmo depois de fechar a aplicação.

## Comunicação entre front-end e back-end

O back-end libera CORS apenas para a origem `http://localhost:5173` (endereço
padrão do front-end em desenvolvimento, via Vite), configurado em
`Program.cs`. A URL base usada pelo front-end para chamar a API fica
centralizada em `frontend/src/api.ts` (`BASE_URL`).

## Documentação interativa da API

Com o back-end em execução (ambiente de desenvolvimento), a API expõe uma
interface Swagger para testar todos os endpoints diretamente pelo navegador,
em `/swagger`.

## Como rodar o projeto

Veja o arquivo [`GUIA_DE_EXECUCAO.md`](./GUIA_DE_EXECUCAO.md) para o passo a
passo completo, incluindo instalação do .NET SDK e do Node.js.
