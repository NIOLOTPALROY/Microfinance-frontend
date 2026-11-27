# Authentication integration

The client uses the server's cookie-based session endpoints:

| Purpose | Method and path |
| --- | --- |
| Sign in | `POST /api/auth/login` |
| Current session | `GET /api/auth/me` |
| Sign out | `POST /api/auth/logout` |

During local development, Vite proxies `/api` to `http://127.0.0.1:3001`.
`VITE_API_BASE_URL` is the backend origin; the client adds `/api` to it
automatically. Requests include credentials; the browser handles the HttpOnly
session cookie, and the client never stores credentials or tokens in browser
storage.

## Sign-in

The client sends `{ "email": "...", "password": "..." }`. The session uses
the server's 24-hour default.

The server responds with a `user` containing `id`, `email`, `name`, `role`, and
`permissions`. The client maps `name` to `displayName` and `role` to a
single-element `roles` array. The server does not currently return branch IDs,
so the client does not grant branch-scoped access.

## Current limitations

The server does not currently implement password recovery, token refresh, or
mobile-number sign-in. The client must not treat those endpoints as available.
Role and permission authorization must continue to be enforced by the server;
the client's route checks are only for presentation.
