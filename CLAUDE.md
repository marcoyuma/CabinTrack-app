# CLAUDE.md — Admin Panel (Seaspace)

@ADMIN-PANEL-CONTEXT.md

## Apa aplikasi ini

Admin panel internal untuk mengelola katalog villa Seaspace. Read-write ke Supabase lewat
service role key, dipakai staf internal (bukan customer publik). Lihat
`ADMIN-PANEL-CONTEXT.md` (di-import di atas) untuk kontrak lengkap dengan situs customer —
skema tabel, wewenang, pipeline upload gambar, dan alasan di balik tiap batasan.

Dipakai staf internal untuk mengelola katalog 4 villa (`stays`, `stay_images`, `amenities`,
`stay_amenities`). Jumlah staf pengguna belum diketahui — jangan menebak.

## Aturan tegas — jangan dilanggar tanpa membaca alasannya di ADMIN-PANEL-CONTEXT.md

- **Hanya menulis ke `stays`, `stay_images`, `amenities`, `stay_amenities`, dan bucket `stays`.**
  Jangan menulis ke `auth.users`, `public.guests`, `public.reviews`, `public.bookings`, atau
  bucket `guests` — walau service role key secara teknis bisa. Baca
  [Batas wewenang admin panel](./ADMIN-PANEL-CONTEXT.md#batas-wewenang-admin-panel) sebelum
  menambah fitur yang mendekati batas ini.
- **Service role key tidak boleh menyentuh browser.** Semua tulisan lewat server (route
  handler / server action / backend) — tidak pernah dikirim ke client bundle.
- **Setiap upload gambar wajib mengisi `blur_data_url`, `width`, `height`.** Replikasi pipeline
  di [Kontrak upload gambar](./ADMIN-PANEL-CONTEXT.md#-kontrak-upload-gambar) persis — resize,
  strip EXIF, WebP quality 80, generate blur 16px. Baris yang lolos tanpa ini akan meng-crash
  halaman villa di situs customer.
- **Villa yang punya booking tidak bisa dihapus** (`on delete restrict`). Tangani error dari
  Postgres sebagai aturan bisnis di UI (mis. tombol "Delete" disabled + tooltip), bukan sebagai
  bug yang perlu di-debug tiap kali muncul.
- **Perubahan tidak langsung terlihat customer** — cache situs customer bertahan sampai
  ~1 jam (time-based) sampai webhook revalidasi dibangun. Jangan buka bug report untuk ini;
  lihat [penjelasan lengkapnya](./ADMIN-PANEL-CONTEXT.md#kenapa-perubahan-anda-tidak-langsung-terlihat-customer).
- **Mengubah `slug` mengubah URL publik villa.** Beri peringatan di UI edit, atau kunci field
  ini setelah villa dipublikasikan.

## Stack

- **React 19 + TypeScript (strict)**, build tool **Vite 6** (`@vitejs/plugin-react-swc`).
  **Bukan Next.js** — repo ini adalah SPA murni, tidak ada server/SSR runtime sama sekali.
- **Routing**: `react-router-dom` v7, data router (`createBrowserRouter`/`RouterProvider`)
  didefinisikan di `src/App.tsx`.
- **Data fetching & cache**: `@tanstack/react-query` v5.
- **Styling**: `styled-components` v6 — **bukan Tailwind**, beda dari situs customer.
- **Form & validasi**: `react-hook-form` + `zod`.
- **Auth**: Supabase Auth, rute terproteksi dibungkus `ProtectedRoute`.

**Kenapa bukan Next.js App Router.** Ini sudah dipertimbangkan dan sengaja tidak dipakai:
admin panel ini internal, di belakang auth, tidak pernah diindeks — nilai jual utama App
Router (SSR/ISR, SEO, image optimization untuk pengunjung publik) tidak relevan di sini.
Migrasi berarti menulis ulang routing, pola fetching, dan `styled-components` (butuh
registry khusus di bawah React Server Components) untuk aplikasi yang sudah jalan, tanpa
manfaat fungsional. Jangan mengusulkan migrasi ke Next.js tanpa alasan baru yang konkret.

@AGENTS.md

## Planning & Language

- When presenting a plan, summary, or explanation in chat, use everyday, common Indonesian language
  words. Avoid stiff, overly technical, or academic terms when a simpler word says the same
  thing.
- Don't make something that's already complex sound more complicated — break it into small,
  easy-to-follow steps instead of dense paragraphs.
- Write explanations clearly enough that someone else could follow them, or that I could
  re-read them later without losing context. Don't assume I'll remember the reasoning behind
  a decision.
- This only applies to conversational replies (plans, summaries, explanations in chat always indonesian absolutely).
  Code comments, docs, and markdown files always stay in English — see "Code Comments" below.

## Code Comments

- Comment on _why_, not _what_ — don't restate what the code already makes obvious.
  Avoid: `// increment counter` above `count++`
- Prioritize comments for:
    - Non-trivial or easily misunderstood business logic
    - Reasoning behind a technical choice, especially when there's a trade-off
      (e.g. why a Server Component was used instead of a Client Component)
    - Workarounds for library limitations/bugs — link the related issue if one exists
    - Important assumptions about data shape/format from an API or database
    - Side effects that aren't obvious from the function/variable name
- Don't comment every line — skip anything self-explanatory.
- Use JSDoc for functions, custom hooks, and components exported across files
  (params, return value, and a short usage example if needed).

## Struktur folder

Feature-based di bawah `src/`:

- `features/{bookings,cabins,guests,dashboard,settings,check-in-out,authentication}` —
  masing-masing punya `components/`, `hooks/`, `types/`, sebagian `services/`.
- `ui/` — komponen generik dipakai lintas fitur.
- `pages/` — komponen halaman yang dipetakan router.
- `services/` — pemanggil Supabase per domain, mis. `apiCabins`, `apiBookings`.
- `context/`, `hooks/`, `shared/` — util dan state lintas fitur.
- `supabase/` — client (`supabase.ts`) + `types/database.types.ts` hasil generate.

## Environment variables

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY` — ini **anon key**, bukan service role key. Lihat
  [Catatan terbuka: anon key vs service role key](#catatan-terbuka-anon-key-vs-service-role-key)
  di atas untuk kenapa ini jadi pertanyaan terbuka.

Dibaca lewat `import.meta.env.*` (konvensi Vite — wajib prefix `VITE_` agar ter-expose ke
client bundle).

## Testing & verifikasi sebelum menganggap selesai

**Belum ada test suite** — tidak ada vitest/jest/testing-library/cypress/playwright
terpasang, tidak ada file `*.test.ts(x)`. Yang tersedia:

- `npm run build` — `tsc -b && vite build`, dipakai sebagai pengecekan tipe.
- `npm run lint` — eslint.

Sebelum menandai perubahan tulis-ke-database selesai, jalankan tiga query verifikasi di
[Cara menguji dari sisi Anda](./ADMIN-PANEL-CONTEXT.md#cara-menguji-dari-sisi-anda) — baris
gambar lengkap, setiap villa punya cover, villa baru dapat 6 fasilitas shared. Wajib manual
karena tidak ada test otomatis yang mengecek ini.

## Kalau ragu soal wewenang atau skema

Jangan menebak. `ADMIN-PANEL-CONTEXT.md` di root repo ini adalah kontrak yang disepakati
dengan repo situs customer — kalau sesuatu tidak tercakup di sana (mis. kolom baru yang
sepertinya berguna untuk fitur admin), itu artinya perlu perubahan skema di repo situs
customer dulu, bukan sesuatu yang boleh ditambahkan sepihak dari sini.
