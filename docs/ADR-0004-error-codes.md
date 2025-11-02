# ADR-0004 — Error Codes & Error Format

Status: Accepted · Date: TODAY

## Error JSON format

POC minimal (matches current middleware):

### A) Global error handler

```json
{ "status": "error", "message": "<short>" }
```

### B) Validation errors (express-validator)

```json
{
  "errors": [
    /* validation issues */
  ]
}
```

> Note: The richer envelope below is a future target; not enforced in the current POC.

Target (future):

```json
{
  "code": "<CONST>",
  "message": "<short>",
  "requestId": "<uuid>",
  "details": {}
}
```

## Canonical codes (POC)

- AUTH_INVALID_CREDENTIALS
- AUTH_TOKEN_MISSING
- AUTH_TOKEN_EXPIRED
- AUTH_FORBIDDEN_ROLE
- VALIDATION_ERROR
- CONFLICT_EMAIL_EXISTS
- NOT_FOUND
- RATE_LIMITED
