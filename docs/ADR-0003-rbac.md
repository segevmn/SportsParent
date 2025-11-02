# ADR-0003 — RBAC Matrix

Status: Accepted · Date: TODAY

Current enforcement (POC): roles present in code — `user`, `admin`.
Planned (not enforced yet): `coach`, `scout`

| Capability                        | user | coach\* | scout\* | admin |
| --------------------------------- | :--: | :-----: | :-----: | :---: |
| Register / Login                  |  ✔  |   ✔    |   ✔    |  ✔   |
| Manage own resources              |  ✔  |   ✔    |   ✔    |  ✔   |
| Verify roles (coach/scout)        |  ✖  |   ✖    |   ✖    |  ✔   |
| Player search (advanced)          |  ✖  |   ⚠    |   ✔    |  ✔   |
| Create opportunities/teams/events |  ✖  |   ✔    |   ⚠    |  ✔   |
| System-wide management            |  ✖  |   ✖    |   ✖    |  ✔   |

Notes:

- `coach*` / `scout*` = planned roles; not enforced in this POC.
- `scout` requires verification; `coach` may get limited search later.
- `/admin/*` routes must be protected with `isAuth` + `requireRole('admin')`.
