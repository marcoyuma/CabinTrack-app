# Screenshots

These four images are referenced by the root [`README.md`](../../README.md) **by exact
filename**. To update one, overwrite the file in place — no Markdown editing needed.

Do not rename these files or add new ones. Markdown has no wildcard support, so the root
README references the names literally; a new name would need a README edit before it shows up.

## Slots

| File                | Screen                                                                            |
| ------------------- | --------------------------------------------------------------------------------- |
| `01-dashboard.png`  | Dashboard — booking stats, occupancy snapshot, sales/bookings charts. This is the first image a visitor sees, so it carries the most weight. |
| `02-stays-list.png` | Stays — the villa catalogue table, with sort/filter controls visible.              |
| `03-stay-form.png`  | Create/edit villa form — best with the map location picker and photo uploader both in frame. |
| `04-bookings.png`   | Bookings — the guest booking table with filters and the financial summary.         |

There is deliberately no screenshot for the Check-in flow: it's a single-booking screen that
shows little without exposing real guest data.

## Capture guidelines

- **Aspect ratio:** roughly 16:9, matching the current set (~2900×1670). Keeping new captures
  close to this stops the README layout from jumping when one is swapped out.
- **Resolution:** the current images are retina captures at ~2900px wide and land around
  0.4–1 MB each. That's fine for four images; just don't let the folder grow unbounded, since
  GitHub scales them down for display anyway.
- **Format:** PNG, and keep the `.png` extension — the README references it.
- **Before capturing:** log in as a staff account with real catalogue data, and close the
  React Query devtools panel (bottom-left floating button) so it doesn't end up in frame.
- **Privacy:** these live in a Git repo. The Bookings screen shows real guest names, emails,
  and national IDs — blur them before committing, or capture with seed data instead.
