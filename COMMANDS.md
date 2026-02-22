# News App – Command Reference

Run these from the **project root** (`/home/sapir/Desktop/projects/newsApp`) unless noted.

---

## Shared package

Build the shared package (TypeScript → `dist/`):

```bash
pnpm --filter @newsapp/shared build
```

Watch mode (rebuild on change):

```bash
pnpm --filter @newsapp/shared dev
```

---

## Prisma (API app)

From project root:

```bash
# Create/apply migrations and regenerate client
pnpm --filter api exec prisma migrate dev

# Regenerate Prisma Client only (e.g. after schema change without new migration)
pnpm --filter api exec prisma generate
```

Or from `apps/api`:

```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma generate
```

---

## All-in-one (setup / after pull)

Build shared, run migrations, generate client:

```bash
pnpm --filter @newsapp/shared build && pnpm --filter api exec prisma migrate dev && pnpm --filter api exec prisma generate
```

Or step by step:

```bash
pnpm --filter @newsapp/shared build
pnpm --filter api exec prisma migrate dev
pnpm --filter api exec prisma generate
```

---

## Dev server

Start all apps in dev mode:

```bash
pnpm dev
```
