# DoorToDoor MicroFoundation Dashboard

The DoorToDoor admin UI is a React, TypeScript, and Vite application. Sign-in, session restoration, and sign-out use the server's cookie-based authentication API.

## Development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run lint
npm run build
```

## Source structure

```text
src/
  app/
    App.tsx
  services/
    apiClient.ts
  assets/
  features/
    auth/
      components/
      context/
      hooks/
      pages/
      services/
        authService.ts
      styles/
      types.ts
    dashboard/
      components/
      data/
      pages/
      styles/
      types.ts
    members/
      data/
      pages/
      styles/
      types.ts
  index.css
  main.tsx
```

Each feature owns its pages, components, styles, and data. `app/App.tsx` composes the auth-protected dashboard flow, while `main.tsx` mounts the app. `AuthProvider` restores the session and `ProtectedRoute` provides generic role, permission, and branch checks. See [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md) for the API contract. In development, Vite proxies auth requests to `http://127.0.0.1:3001`; set `VITE_API_BASE_URL` when connecting to a separately deployed backend.

## Members demo

The Members menu includes member registration and a searchable directory with profile viewing, editing, and deletion. Member records are held in memory for the current dashboard session only; refresh clears changes. Registration files and KYC/bank details are not uploaded or retained, and no backend is connected.

## Authentication integration status

The login UI supports email, password visibility, loading and error feedback. Password recovery and token refresh are not yet implemented by the server.
