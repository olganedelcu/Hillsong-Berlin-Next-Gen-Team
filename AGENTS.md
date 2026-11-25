## Application architecture
- Keep shared ministry chrome and the single auth-state subscription in the root-provided shell, with a language context for all interface text; this prevents competing subscriptions and keeps language consistent.
- Load public lessons/events through a public server function with an RLS-scoped publishable client and TanStack Query loaders; this makes SSR safe without exposing secrets.
- Store team permissions in user_roles, not profiles or editable metadata, and enforce is_team in every write handler and database policy; signing in alone never grants editing rights.
- Store lesson photos privately; sign only paths from RLS-filtered published lessons for public readers, while team uploads require role-based storage policies.
- Keep reusable ministry UI under src/components/ministry and public URLs top-level; signed-in editing lives under the managed authenticated layout.
