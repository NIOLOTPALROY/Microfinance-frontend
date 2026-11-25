# Authentication API Integration Contract

> **Draft only — backend developer approval required.** The paths and JSON shapes below are proposals used to prepare the frontend. They are not confirmed backend endpoints or a claim that authentication is currently connected.

## Current frontend behavior

- The login page sends email or mobile, password, and the remember-me selection to the auth service.
- The frontend expects session credentials to be delivered through secure cookies; it does not read or store tokens in `localStorage` or `sessionStorage`.
- `VITE_API_BASE_URL` configures the API origin. If unset, Axios uses the current origin.
- All API services should reuse `src/services/apiClient.ts` so cookie, timeout, and expired-session handling remain centralized.
- The app checks the existing session with `GET /api/auth/me` before rendering protected dashboard content.
- The refresh call is available but is not called automatically until the backend confirms that contract.
- `ProtectedRoute` accepts backend-defined roles, permissions, and a branch ID. The app does not assign or assume role names.

## Proposed endpoint summary

| Purpose | Proposed method and path | Expected success |
| --- | --- | --- |
| Sign in | `POST /api/auth/login` | `200` with the authenticated user and session cookie |
| Current session | `GET /api/auth/me` | `200` with the authenticated user; `401` if no valid session |
| Sign out | `POST /api/auth/logout` | `204` or `200`; revoke the session and expire cookies |
| Refresh session (optional) | `POST /api/auth/refresh` | `200` with the refreshed user and renewed cookie |
| Request password recovery | `POST /api/auth/forgot-password` | `202` with a generic confirmation |

**Confirm or replace every path, method, status code, cookie name, and response shape with the backend developer before integration.** The proposed paths are currently isolated in `src/features/auth/services/authService.ts`.

## Proposed login request

```json
{
  "identifier": "staff@example.com",
  "password": "<entered password>",
  "rememberMe": true
}
```

`identifier` may contain an email address or mobile number. `rememberMe` is a request for the server to choose an appropriate session lifetime; the browser does not implement that lifetime itself. Never log the password or persist it in browser storage.

## Proposed user and login response

```json
{
  "user": {
    "id": "opaque-user-id",
    "displayName": "Staff Name",
    "email": "staff@example.com",
    "mobile": "+<country-code-and-number>",
    "roles": ["<backend-defined-role>"],
    "permissions": ["<backend-defined-permission>"],
    "branchIds": ["<backend-defined-branch-id>"],
    "lastLoginAt": "2026-11-25T00:00:00Z"
  }
}
```

The frontend currently validates `id`, `displayName`, `roles`, `permissions`, and `branchIds`. `email`, `mobile`, and `lastLoginAt` are optional. Confirm which fields are available and whether arrays may ever be omitted; if so, agree on a safe normalized response rather than silently granting access.

## Session, cookie, and CSRF requirements

Preferred proposal: the API sets and clears an opaque session cookie or refresh cookie using `HttpOnly`, `Secure` (HTTPS), and an appropriate `SameSite` policy. Do not return long-lived bearer or refresh tokens in JSON for browser storage.

The backend should:

- Set cookie expiration based on the approved remember-me policy.
- Revoke the session and expire the cookie on logout.
- Configure credentialed CORS only for approved frontend origins.
- Define CSRF protections for state-changing requests. Confirm whether a CSRF token is required, where it is obtained, and its header name; the frontend intentionally does not guess a token endpoint or header.
- Return `401` for missing, expired, or invalid sessions. The shared Axios client signals session expiry for protected API responses.

## Proposed refresh behavior

Refresh is optional. If supported, confirm the endpoint, whether it rotates the cookie, expected response, reuse-detection behavior, and error semantics. The frontend exposes `authService.refreshToken()` and `useAuth().refreshToken()` but does not refresh on a timer or silently retry requests until this contract is approved.

## Proposed password recovery

Request:

```json
{
  "identifier": "staff@example.com"
}
```

Return the same generic confirmation for existing and non-existing accounts, for example:

```json
{
  "message": "If an account matches, recovery instructions will be sent using the contact details on file."
}
```

The current UI does not reveal whether the identifier belongs to an account. Confirm whether the workflow uses email, SMS, both, a one-time link/code, expiry rules, and a separate reset-password endpoint. The frontend currently requests recovery only; it does not collect or submit a reset token/new password.

## Roles, permissions, and branch scope

The frontend treats role names, permission strings, and branch IDs as opaque values provided by the backend. No role hierarchy, administrator bypass, or permission names are assumed.

- `allowedRoles` on `ProtectedRoute` means the user must have at least one listed role.
- `requiredPermissions` means the user must have every listed permission.
- `branchId` requires that the exact ID be present in `user.branchIds`.
- The server must enforce all authorization independently; client-side route guards are a UX boundary, not a security boundary.

Confirm canonical role and permission identifiers, whether permissions are additive, how branch membership is returned, and whether a separately defined global-scope permission exists. Do not infer branch access from the dashboard's demo branch labels.

## Proposed error response

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "The sign-in details were not accepted.",
  "requestId": "optional-correlation-id"
}
```

Suggested statuses to confirm:

- `400` — invalid request or validation error.
- `401` — incorrect credentials or expired session.
- `403` — authenticated but not permitted.
- `429` — rate limited; include a suitable `Retry-After` header when possible.
- `5xx` — temporary server failure; do not expose stack traces or secrets.

The frontend displays a safe message and does not log credentials. Confirm the final error envelope and user-facing message policy, including whether server-provided messages are safe to display.

## Backend approval checklist

- [ ] Confirm base URL, endpoint paths, methods, and status codes.
- [ ] Confirm login and user response schemas and required fields.
- [ ] Confirm cookie/session strategy, remember-me lifetime, CORS, and CSRF contract.
- [ ] Confirm logout revocation and expired-session behavior.
- [ ] Confirm whether refresh is supported and its rotation/error contract.
- [ ] Confirm password recovery channels and anti-enumeration response.
- [ ] Confirm role, permission, and branch identifier formats.
- [ ] Confirm error envelope and safe messages.
- [ ] Configure `VITE_API_BASE_URL` for each environment and use HTTPS in production.
