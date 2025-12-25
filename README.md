# CI-CD-course — TodoApp (.NET 8 + React/Vite)

A simple Todo application with:
- **Backend:** ASP.NET Core (.NET 8) in `TodoApp.Server`
- **Frontend:** React + Vite in `todoapp.client`
- **Tests (3 kinds):**
  1) **.NET unit tests** (`TodoApp.Server.Tests`)
  2) **API tests** (Postman/Newman)
  3) **E2E UI tests** (Playwright)

Dokumentation for API is in: TodoApp.Server/DOKUMENTATION.md

---

# First time setup
- **in console in root folder:** trust local https development certificate 
    `dotnet dev-certs https --trust`
- **in console in todoapp.client:** install dependencies 
    `npm install`

---

# Run the application locally
for the application to work the frontend and beckend both need to be running.

### Option 1 — Run from terminal (backend)
- **from console in root folder:** 
    `dotnet run --project TodoApp.Server/TodoApp.Server.csproj --launch-profile https`

### Option 2 — Run from UI (VS backend + VS Code frontend)
-**From UI (vs backend and vsc frontend):** Open the full solution (root folder) in **Visual Studio** and run as **https** via the Play button.  
This will start frontend and backend — then **Ctrl+Click** the link in the console.

---

# Run only frontend
Open the todpapp.client folder in **Visual Studio code**. In the terminal run:
    `run npm run dev`

---

# Run tests
Tests need to run in order and depend on each other to run the full cycle without failing and without leaving todos behind.
(Gitflow actions only run tests if PR to develop or main branch exists)

### Unit tests
- **in console in root folder:** 
    `dotnet test`
-**Or from Test Explorer in Visual Studio**

---

### Integration tests (API tests)
- **in console in root folder:** 
    `$env:ASPNETCORE_URLS="http://localhost:5159"; dotnet run --project TodoApp.Server/TodoApp.Server.csproj`
- **in console in todoapp.client:** 
    `npm run test:api`

| Endpoint | what it tests |
|----------|------------|
| `POST /todo/add` | Return 201,  expects todo object with required properties in correct variable type |
| `GET /todo` | Return 200, expects an array with objects containing the required variables |
| `GET /todo/{{todoId}}` | Return 200, expects an object with an id correcponding with object created in add test |
| `POST /todo/update` | Return 200, expects todo object with required properties in correct variable type  |
| `POST /todo/delete` | Return 200 och ett giltigt objekt |

---

### E2E tests (Playwright)
-**in console in root folder:** 
    `dotnet run --project TodoApp.Server/TodoApp.Server.csproj --launch-profile https`
- **in new console in todoapp.client:** 
    `npm run test:e2e`

---

## Notes
-**If commands give errors:**
     make sure there are no trust issues with the certificate.