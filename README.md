# SysMaster

SysMaster é uma aplicação web moderna para gerenciamento de dispositivos, usuários e grupos em uma rede corporativa.

## Features

- 🔐 **Autenticação e Autorização**
  - Login seguro
  - Roles (admin/user)
  - Proteção de rotas

- 👥 **Gerenciamento de Usuários**
  - Criação e edição de usuários
  - Atribuição de roles
  - Associação com devices

- 🏢 **Gerenciamento de Grupos**
  - Organização de devices
  - Prefixos automáticos
  - Gerenciamento de localização

- 💻 **Gerenciamento de Devices**
  - Status em tempo real
  - Especificações técnicas
  - Associação com grupos e usuários

- 📊 **Dashboard**
  - Estatísticas gerais
  - Status dos devices
  - Atividades recentes

- 💾 **Persistência de Dados**
  - Armazenamento em JSON
  - Cache em localStorage
  - API REST para manipulação

## Tecnologias

- ⚛️ **Frontend**
  - Next.js 13 (App Router)
  - TypeScript
  - Styled Components
  - Phosphor Icons

- 🎨 **UI/UX**
  - Design responsivo
  - Tema dark/light
  - Componentes reutilizáveis

- 🔧 **Backend**
  - Next.js API Routes
  - Sistema de arquivos local
  - Cache em localStorage

## Começando

### Pré-requisitos

- Node.js 18+
- Yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gustavofalcao1/sysmaster-app.git
cd sysmaster-app
```

2. Instale as dependências:
```bash
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
yarn dev
```

4. Acesse http://localhost:3000

### Credenciais de Teste

- Admin
  - Username: admin
  - Password: admin123

## Estrutura do Projeto

```
src/
  ├── app/              # Páginas e API routes
  │   ├── api/         # Endpoints da API
  │   └── ...          # Páginas da aplicação
  ├── components/       # Componentes reutilizáveis
  │   ├── layout/      # Componentes de layout
  │   └── ui/          # Componentes de UI
  ├── context/         # Contextos React
  ├── data/            # Arquivos JSON de dados
  ├── lib/             # Utilitários e serviços
  ├── styles/          # Estilos globais
  └── types/           # Definições de tipos
```

## Desenvolvimento

### Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento
- `yarn build` - Cria a build de produção
- `yarn start` - Inicia o servidor de produção
- `yarn lint` - Executa o linter
- `yarn format` - Formata o código

## Estado Atual

### Implementado
- ✅ Sistema de autenticação
- ✅ CRUD de usuários
- ✅ CRUD de grupos
- ✅ CRUD de devices
- ✅ Dashboard com estatísticas
- ✅ Persistência de dados em JSON
- ✅ Cache em localStorage
- ✅ API REST

### Em Desenvolvimento
- 🚧 Atualizações em tempo real
- 🚧 Sistema de notificações
- 🚧 Monitoramento avançado de devices
- 🚧 Métricas de performance

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
