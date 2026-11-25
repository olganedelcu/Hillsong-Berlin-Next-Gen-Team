# Next Generation Team website

Bilingual (EN/DE) site for the Hillsong Berlin Next Generation Team: age groups, weekly Sunday lessons and a team area for editing.

Stack: TanStack Start, React, Tailwind, Supabase (Postgres, auth, storage).

## Run locally

```bash
cp .env.example .env   # fill in your Supabase values
npm install
npm run dev
```

## Backend (free)

Use a free Supabase project. In the SQL editor run `db/schema.sql`, then create a user under Authentication and run `db/seed.sql` (edit the email) to give it the admin role and add dummy content.

Photos for the public pages live in `public/photos/`.
