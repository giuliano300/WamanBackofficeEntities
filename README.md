# WAMAN Entity and Location portal

This Angular application uses the shared WAMAN API. Credentials must not be stored in this repository or documentation.

## Security integration — 20 November 2026

Entity/location lists and worker/report/document operations are constrained on the server to the authenticated account. Client IDs are not an authorization boundary. Account passwords are never returned in API DTOs. Blank password edits preserve the existing credential.

Attendance download buttons obtain short-lived protected links from Files/GetSecureUrl after the API checks assignment ownership. Annual archives are scoped to the recipient and stored privately; generated ZIP links expire after ten minutes. Direct public document bookmarks are no longer supported. No historical PDF is deleted.

Shared notification connections and REST requests require authentication and recipient ownership. Logout revokes the server token. The Inspector/Entity integration suite uses synthetic accounts and archives its fixtures without sending mail or SMS.

Run npm run build to validate this frontend. The inherited initial-bundle and CommonJS warnings are still present; they are not build failures.

## Operational notes

Deploy the compatible frontend and API together. Review the shared API SQL migrations before activating password hashing, and update/restart the MTRM reader first. Never commit provider keys, database credentials, tokens or sample account passwords. Previously exposed credentials need rotation by their owners; deleting text from the README does not remove Git history.
