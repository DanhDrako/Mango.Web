# Here is resource for Restore Solution.

> [!NOTE]
> For BE

```bash
-cd API:
nuget:
microsoft.entityframeworkcore.design
microsoft.entityframeworkcore.sqlserver

-cmd of API:
-- dotnet tool install --global dotnet-ef --version 9.0.4
-- dotnet ef
-- dotnet ef migrations add InitialCreate -o Data/Migrations
-- dotnet ef database update

-want to delete migrations added ?
-- dotnet ef migrations remove

-want to restore all database?
-- dotnet ef database drop
```

> [!NOTE]
> For FE

```bash
-cd Restore
-- npm create vite@latest
-cd client
-- npm i vite-plugin-mkcert -D
-- npm i @mui/material @emotion/react @emotion/styled
-- npm i @fontsource/roboto
-- npm i @mui/icons-material
-- npm i react-router
-- npm i @reduxjs/toolkit
-- npm i react-redux
-- npm i --save react-toastify
-- npm i react-hook-form zod @hookform/resolvers
-- npm i react-dropzone
-- npm i date-fns
-- npm i @mui/lab
-- npm i js-cookie
-- npm i -D @types/js-cookie
-- npm i --save @stripe/react-stripe-js @stripe/stripe-js
-- brew i stripe/stripe-cli/stripe
```

> [!NOTE]
> For Deployment

```bash
> -- Step 1: Config for deployment
> FE (client):

- config outDir: '../API/wwwroot' -> npm run build

> BE

- Add app.UseDefaultFiles(); app.UseStaticFiles(); to config
- Add FallBackController -> app.MapFallbackToController("Index", "Fallback") to config;

> Azure:

- Create resource group -> create Web App (Azure Service) -> Create Database (SQL Database)

\*\* Environment variables resource group (App settings | Connection strings)

- Get connection strings from SQL database -> Add Environment variables Web App (Connection strings): Name: "DefaultConnection", Value: abc{Password}xyz, Type: SQLAzure.
- Add Environment variables Web App (App settings): Name: "StripeSettings\_\_PublishableKey", (same to any variables)
- Config Webhooks to generate need secret key
- From SQL Server -> Show networking settings -> Selected networks -> Remove existing rule -> Tick checkbox allow azure.

> -- Step 2: Publish app to Web App
> BE (API): dotnet publish -c Release -o ./bin/Publish

- Right click to API/Publish folder -> Deploy to Web App -> Selection App Services need to deploy

> -- Step 3: CI/CD deployment

- Add new source "Deployment Center" from Web App -> Select GitHub -> Select repo/branch -> Preview -> Close -> Save (From github, need check actions created ?)

- Git pull -> config it (add build client)
```
