# Piscinas App Frontend (Vite + React)

Proyecto frontend creado con Vite, ReactJS, Redux Toolkit, React Router, Material UI (MUI) y Axios.

## Scripts

- `npm install` — instala dependencias
- `npm run dev` — servidor de desarrollo en http://localhost:3000
- `npm run build` — build de producción
- `npm run preview` — previsualiza el build

## Stack
- React 18 (sin TypeScript)
- Vite
- Redux Toolkit
- React Router DOM 6
- Material UI (MUI)
- Axios

## Estructura recomendada

```
frontend/
├── src/
│   ├── app/
│   │   └── store.js
│   ├── features/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── authSlice.js
│   │   ├── piscinas/
│   │   │   ├── PiscinasListPage.jsx
│   │   │   ├── PiscinaFormPage.jsx
│   │   │   └── piscinasSlice.js
│   │   └── usuarios/
│   │       ├── UsuariosListPage.jsx
│   │       └── usuariosSlice.js
│   ├── pages/
│   │   └── WelcomePage.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Variables de entorno

Crea un archivo `.env` con:
```
VITE_API_URL=http://localhost:4000
```

---

¡Listo para desarrollar!
