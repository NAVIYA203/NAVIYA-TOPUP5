<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Free Fire lookups run only in `createServerFn` handlers in `src/lib/ff.functions.ts`; the Games Kinbo / Volsever keys come from server env and never reach the browser. Why: keys are paid/limited and must stay secret.
- The Free Fire item picture list (`src/server/ff-items.json`) is imported lazily inside the server handler only. Why: it is ~1.3 MB and must not ship to the browser; `src/server/` cannot be imported by route files.
- Store packages, prices and contact number live in `src/lib/site.ts`. Why: one place to edit shop data.
- Brand marks come from the user's own logo artwork in `src/assets/` (mascot emblem for the header/footer, hero and page heroes; the header/footer brand name is typed text next to it) and `public/favicon.png` is derived from that emblem. Why: the site must show the user's real brand, not a generated text mark.
