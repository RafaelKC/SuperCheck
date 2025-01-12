[English](README.md) | [Português](README_PT.md)

# SuperCheck - Truck Checklist System

## About the System

SuperCheck is a web application developed to manage truck checklists. The system allows you to create and manage vehicle safety and maintenance checks, with specific functionalities for drivers and administrators.

Main features:
- User management (drivers, executors, and administrators)
- Truck registration and management
- Checklist template creation and management
- Checklist execution and monitoring
- Verification item categorization
- Authentication and authorization system

## Environment Setup

### 1. Database (SQL Server)

1. Install Microsoft SQL Server (Express or Developer Edition)
2. Create a new database called "SuperCheck"
3. Configure the connection string in the `SuperCheck/appsettings.json` file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your_server;Database=SuperCheck;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Replace "your_server" with your SQL Server name (example: "localhost" or "localhost\\SQLEXPRESS")

### 2. Backend (.NET)

1. Navigate to the backend folder:
```powershell
cd SuperCheck
```

2. Restore NuGet packages:
```powershell
dotnet restore
```

4. Run the project:
```powershell
dotnet run
```

The backend will be running at `http://localhost:5277`

### 3. Frontend (Angular)

1. Navigate to the frontend folder:
```powershell
cd front/SuperCheck
```

2. Install dependencies:
```powershell
npm install
```

3. Configure the backend URL in the `src/environments/environment.ts` file:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5277'
};
```

4. Run the project:
```powershell
npm start
```

The frontend will be available at `http://localhost:4200`

## First Access

### Default Administrator User
The system comes with a pre-configured administrator user:
- Login: admin
- Password: 123qwe

### Initial Setup

1. Log in with the administrator user
2. Access the "Users" menu to create a new driver
3. Access the "Trucks" menu to register vehicles

After this, on the checklists home screen, you'll be able to create a checklist (without a template yet). If you want, you can create a template and then use this template to create your checklists more quickly

## Important Notes

- The system uses JWT Token authentication
- As a supervisor, you'll be able to create and manage all application resources and execute checklists. Create executor-type users who will only be able to create and execute checklists.
