# DoorToDoor MicroFoundation Dashboard

The DoorToDoor admin UI is a React, TypeScript, and Vite application. The authentication frontend is prepared for a proposed cookie-based API contract, but no backend endpoint has been confirmed or connected.

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

Each feature owns its pages, components, styles, and data. `app/App.tsx` composes the auth-protected dashboard flow, while `main.tsx` mounts the app. `AuthProvider` restores the session and `ProtectedRoute` provides generic role, permission, and branch checks. Auth API endpoint and response proposals requiring backend approval are documented in [AUTH_API_DOCUMENTATION.md](./AUTH_API_DOCUMENTATION.md). Set `VITE_API_BASE_URL` for the backend origin; auth requests use secure-cookie credentials and do not persist tokens in browser storage.

## Members demo

The Members menu includes member registration and a searchable directory with profile viewing, editing, and deletion. Member records are held in memory for the current dashboard session only; refresh clears changes. Registration files and KYC/bank details are not uploaded or retained, and no backend is connected.

## Authentication integration status

The login UI supports email/mobile, password visibility, remember-me, loading and error feedback, and a password-recovery request. It will not authenticate until the backend API is implemented and its proposed contract is approved.
