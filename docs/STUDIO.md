# Internal portal / Content Studio

Implementation branch: `feat/internal-portal`. API/UI reference: `origin/feat/studio-demo`, files under `src/features/studio/` (the demo's separate login and multi-account localStorage are intentionally replaced by the portal ACCOUNT session).

API contract: https://kidzeconomy.com.vn/finteen/v3/api-docs
Base URL: `VITE_API_BASE_URL=https://kidzeconomy.com.vn/finteen`.

## Entry points

- `/internal/login`: internal email/password login, then `/api/auth/me` supplies account id and roles.
- `/internal`: Studio overview for Editor/Reviewer/Manager; Admin console for ADMIN.
- `/internal/chapters`: latest chapter drafts and lifecycle operations.
- `/internal/editor/CH04`: inspect/play through the draft. Editor/Admin can edit scenes or JSON and save. Schema is fetched from `/api/studio/scene-schema`; scalar scene fields described by its schema are shown under additional fields. Nested/unsupported structures remain editable in JSON without dropping unknown fields.
- The visual editor uses a central stage, right-side properties and a horizontal scene thumbnail strip. Add a scene with one click after the selection, or duplicate it. IDs are generated without collisions; duplicate content preserves custom fields and gets new option IDs. Choice branches/endings are not automatically redirected when inserting a page.
- `/internal/reviews`: submitted chapters (Reviewer/Admin).
- `/internal/releases`: next release plan and publish action (Manager/Admin).
- `/internal/history`: release history; Manager/Admin can change the current version or recall with a reason, Reviewer reads only.
- `/internal/assets`: upload, filter, inspect, relabel, copy refs and delete orphan assets.
- `/internal/questions`: question search/filter, create/update, retire/restore; results use client pagination.
- `/internal/admin`: ADMIN console. Includes Content Studio link and AI keys tab, alongside existing price, role, entitlement and transaction management.

## Permissions

Menus follow the lead's three-stage workflow. Editor: Chapters, Assets, Questions. Reviewer: Pending review, Chapters (read/play), Release history (read), Assets (read), Questions (read). Manager: Publish, Release history, Chapters (read), Assets, Questions. ADMIN receives all Studio items plus the existing administration console.

The menu is the union of every role returned by `/api/auth/me`, with duplicate routes removed. The optional role selector changes only the overview shown on the home page; it never hides another role's menu items or changes API permissions.

| Operation | Editor | Reviewer | Manager | Admin |
| --- | --- | --- | --- | --- |
| Read chapters, draft, releases, plan, assets, questions, schema | Yes | Yes | Yes | Yes |
| Save draft / submit | Yes | No | No | Yes |
| Withdraw submitted draft | Author only | No | No | Author only |
| Review / return | No | Yes | No | Yes |
| Publish / set current / recall | No | No | Yes | Yes |
| Write assets and questions | Yes | No | Yes | Yes |
| Prices, roles, AI keys | No | No | No | Yes |

- A reviewer cannot review their own edited draft, including ADMIN. Review notes are mandatory.
- Publishing is disabled when the plan contains a draft edited by the current account. Only approved drafts qualify. The backend remains authoritative for permission and revision checks.
- Release creation sends `{note}`; backend calculates version. The preview version is not submitted as an override.
- Recall requires a nonblank reason. Delete requires an orphan, registered asset.
- Upload accepts PNG/JPEG/WebP up to 5 MB per file and sends `file`, optional `label`/`chapterCode` as FormData; the browser supplies multipart Content-Type.
- Every Studio call uses the existing ACCOUNT bearer, expiry checks and ApiResponse parser. No second token store or demo credentials are added.
- Request failures show message, HTTP status and code. Failed mutations do not show success. Filter requests ignore stale responses.
- Preview follows scene transitions/choices and can simulate minigame pass/fail. It is not the complete production minigame runtime.

## API coverage

- Chapters: GET list/draft/schema; PUT draft; POST submit/withdraw/review.
- Releases: GET history/next; POST publish/current/recall.
- Assets: GET list/detail; POST multipart upload; PUT metadata; DELETE orphan.
- Questions: GET filtered list; POST create; PUT update; POST retire/restore.
- Admin: existing account lookup, role list/grant/revoke/log and plan pricing retained. AI keys now support GET list, POST add/test/enable/disable and DELETE.

## Schema v2 / path validation

- Scene schema is fetched using the current internal token; its schemaVersion is shown in the schema details. Choice conditions remain arbitrary JSON described by the server schema, including variable names `choice:<group>` and `inspected:<card-id>`.
- Each choice has a condition editor and `lockedReason`. A nonnull condition marks the reason as required in the form and shows a reminder if blank. Incomplete content can still be saved as a draft; malformed JSON must be fixed before serialization.
- `onFailSceneId` is removed from scenes when loading/saving/duplicating drafts. The Studio minigame preview retries the same scene on failure. Other fields and published gameplay data files are not migrated.
- PUT draft warnings are displayed persistently after save. They do not turn a successful save into a failure. If the follow-up GET fails, the editor preserves the saved content/warnings and reports that refresh failed.
- POST submit performs backend path validation. HTTP 400 / code 1001 errors retain the exact message (including `đường đi:` and line breaks) in the submit form, which stays open; an edit link opens that chapter's draft.
- Register/resend/forgot rate limits (30 per 15 minutes per IP) are enforced by the backend. No separate frontend IP counter or automatic retry is added; existing OTP cooldown and account lock handling are distinct.

## Verification

Run contract/permission/render checks:

```powershell
node --test tests/studio-api.test.mjs tests/studio-schema-v2.test.mjs tests/studio-scenes.test.mjs tests/studio-permissions.test.mjs tests/internal-render.test.mjs tests/auth-api.test.mjs tests/auth-login-policy.test.mjs tests/auth-render.test.mjs
npm run build
```

The browser smoke script uses Playwright and local Chrome/Edge. Use an available Playwright installation or a temporary npm-exec installation; no project dependency is required. Point `PLAYWRIGHT_MODULE` to its `index.mjs`, `BROWSER_EXECUTABLE` to the browser binary, then run `node tests/studio-browser.mjs`. All API responses in that script are mocked; no production data is modified.

Manual production test: Editor saves/submits a draft, a different Reviewer approves it, then a different Manager previews/publishes the release. Reviewer should see read-only asset/question controls. ADMIN can use the Studio link to test all operations, subject to the same author restrictions.

Production authenticated operations still need validation with actual internal accounts; no credentials are included in this repository.
