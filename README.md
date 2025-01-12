# SuperCheck - Sistema de Checklist para Caminhões

## Sobre o Sistema

O SuperCheck é uma aplicação web desenvolvida para gerenciar checklists de caminhões. O sistema permite criar e gerenciar verificações de segurança e manutenção de veículos, com funcionalidades específicas para motoristas e administradores.

Principais funcionalidades:
- Gerenciamento de usuários (motoristas, executores e administradores)
- Cadastro e gerenciamento de caminhões
- Criação e gerenciamento de templates de checklist
- Execução e acompanhamento de checklists
- Categorização de itens de verificação
- Sistema de autenticação e autorização

## Configuração do Ambiente

### 1. Banco de Dados (SQL Server)

1. Instale o Microsoft SQL Server (Express ou Developer Edition)
2. Crie um novo banco de dados chamado "SuperCheck"
3. Configure a string de conexão no arquivo `SuperCheck/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=seu_servidor;Database=SuperCheck;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Substitua "seu_servidor" pelo nome do seu servidor SQL Server (exemplo: "localhost" ou "localhost\\SQLEXPRESS")

### 2. Backend (.NET)

1. Navegue até a pasta do backend:
```powershell
cd SuperCheck
```

2. Restaure os pacotes NuGet:
```powershell
dotnet restore
```

4. Execute o projeto:
```powershell
dotnet run
```

O backend estará rodando em `http://localhost:5277`

### 3. Frontend (Angular)

1. Navegue até a pasta do frontend:
```powershell
cd front/SuperCheck
```

2. Instale as dependências:
```powershell
npm install
```

3. Configure a URL do backend no arquivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5277'
};
```

4. Execute o projeto:
```powershell
npm start
```

O frontend estará disponível em `http://localhost:4200`

## Primeiro Acesso

### Usuário Administrador Padrão
O sistema já vem com um usuário administrador configurado:
- Login: admin
- Senha: 123qwe

### Configuração Inicial

1. Faça login com o usuário administrador
2. Acesse o menu "Usuários" para criar um novo motorista
3. Acesse o menu "Caminhões" para cadastrar os veículos

Após isso na tela inicial de chcklists você já vai conseguir criar um checklist (ainda sem template). Se quiser você pode criar um template e depois usar esse template para criar seus checklists mais rapidamente

## Observações Importantes

- O sistema utiliza autenticação via JWT Token
- Como supervisor você vai conseguir criar e gerenciar todos os recursos da aplicação e executar o checklist. Crie usuário do tipo executor que vão conseguir apenas criar e executar checklists.
