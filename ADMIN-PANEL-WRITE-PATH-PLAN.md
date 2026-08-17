# Rencana jalur tulis admin panel — status & langkah ke depan

> Dokumen kerja untuk sesi/agent berikutnya di repo ini. Melanjutkan pertanyaan terbuka
> di [`ADMIN-PANEL-CONTEXT.md`](./ADMIN-PANEL-CONTEXT.md#-pertanyaan-terbuka-jalur-tulis-admin-panel-belum-diverifikasi)
> dengan hasil verifikasi terbaru dan rencana konkret. Baca `ADMIN-PANEL-CONTEXT.md` dulu —
> dokumen ini tidak mengulang kontrak skema/wewenang yang sudah ada di sana, hanya menambah
> status jalur tulis dan urutan kerja yang aman.
>
> **Terakhir diverifikasi: 2026-08-15**, sesi yang sama dengan perbaikan `.env`.

## Status terverifikasi hari ini

Prasyarat di `ADMIN-PANEL-CONTEXT.md` — "project ref admin panel harus dibetulkan dulu ke
`aoedxrhwzjracosjcmzo`" — **sudah selesai**. Diverifikasi lewat tiga langkah:

1. `.env` lokal (gitignored, tidak pernah masuk git) diupdate: `VITE_SUPABASE_URL` dan
   `VITE_SUPABASE_KEY` diganti ke project `aoedxrhwzjracosjcmzo`, diambil user langsung dari
   Supabase Dashboard → Project Settings → API Keys (bukan disalin dari repo situs customer).
2. Payload JWT anon key di-decode: `ref: aoedxrhwzjracosjcmzo`, `role: anon` — cocok dengan
   URL, dan jenis key-nya benar (anon, bukan `service_role`, sehingga aman ada di browser).
3. Test koneksi langsung ke REST API Supabase:
   - `GET /rest/v1/stays` → **HTTP 200**, mengembalikan baris asli (`tuscan-twilight-villa`,
     `coastal-arch-retreat`, `riverside-stone-lodge`) — konfirmasi satu database dengan situs
     customer.
   - `POST /rest/v1/amenities` (insert dummy) → **HTTP 401**,
     `"new row violates row-level security policy for table \"amenities\""` (kode Postgres
     `42501`) — konfirmasi temuan #3 di `ADMIN-PANEL-CONTEXT.md`: RLS keempat tabel katalog
     memang belum punya policy tulis apa pun. Tidak ada baris yang tersisa di database dari
     test ini — insert ditolak sebelum baris tersimpan.

**Kesimpulan:** admin panel sekarang **baca (SELECT) berfungsi penuh** terhadap database yang
benar. **Tulis (INSERT/UPDATE/DELETE) masih terblokir total** oleh RLS, di keempat tabel
katalog, untuk role apa pun. Ini bukan bug — ini state yang diharapkan sampai salah satu
arsitektur di bawah dipilih dan dibangun.

## Keputusan arsitektur — SUDAH DIPUTUSKAN (2026-08-15)

> **Update 2026-08-15**: Opsi A dipilih user secara eksplisit di sesi migrasi
> dashboard/fetch-sync. Bagian di bawah ini dipertahankan sebagai catatan trade-off, **bukan**
> pertanyaan terbuka lagi.

Dua arsitektur dari `ADMIN-PANEL-CONTEXT.md`:

- **A. RLS staff-role — DIPILIH.** Admin panel tetap SPA + anon key. Untuk tulis katalog
  (`stays`/`stay_images`/`amenities`/`stay_amenities`), rencananya menambah policy
  INSERT/UPDATE/DELETE baru dibatasi ke `public.staff` — tabel yang **sudah ada** dari
  `0014_admin_staff_access.sql` (dipakai ulang, tidak perlu tabel staff kedua). Opsi B
  ditolak.
- **B. Server tipis + service role** — tidak dipilih. Alasan: repo ini SPA murni tanpa
  komponen server sama sekali; menambah backend baru untuk kebutuhan yang bisa diselesaikan
  RLS dianggap menambah permukaan risiko (service role key yang harus dijaga sendiri) tanpa
  manfaat proporsional.

**Status implementasi: BELUM DIKERJAKAN.** Keputusan arsitektur sudah final, tapi migration
RLS write untuk keempat tabel katalog dan form create/update/delete villa **belum ditulis** —
itu task terpisah berikutnya. Jangan mulai menulis kode fitur tulis (form submit, mutation
hook, migration RLS write, dsb.) tanpa sesi implementasi khusus untuk itu, tapi juga **jangan
tanya ulang ke user Opsi A vs B** — itu sudah dijawab.

## Migration tambahan yang sudah berjalan sejak dokumen ini pertama ditulis

- **`0014_admin_staff_access.sql`** — lihat `ADMIN-PANEL-CONTEXT.md` § "Akses baca
  staff/manager ke data guest". Live sejak 2026-08-15, dijalankan dari repo situs customer.
  Memberi tabel `public.staff` + 3 fungsi `security definer` baca terbatas ke
  `bookings`/`guests` (tanpa membuka `guests` langsung).
- **`0015_admin_staff_booking_financials.sql`** — ditambahkan di sesi migrasi
  dashboard/fetch-sync yang sama (2026-08-15), file-nya disiapkan di repo admin panel ini
  (`src/supabase/migrations/`) tapi **dijalankan manual oleh user** ke database live, sama
  seperti `0014`. Fungsi `admin_booking_financials(p_from, p_to)` — pola sama persis seperti
  `admin_booking_roster()`, tapi filter `created_at` (bukan overlap tanggal stay) dan
  mengembalikan `total_price`/`num_nights`/`status` untuk kebutuhan dashboard (Bookings/
  Sales/Check-ins/Occupancy rate + chart `AreaChart`/`PieChart`). **Kenapa fungsi baru, bukan
  RLS policy langsung ke `bookings`:** RLS Postgres membatasi baris, bukan kolom — policy
  `SELECT` mentah akan ikut membocorkan `access_code` (kode self-check-in sensitif) dan
  `guest_id`. Fungsi ini tidak pernah join ke `public.guests` sama sekali.

## Pembersihan fitur lama (2026-08-15)

Sesi migrasi dashboard/fetch-sync yang sama juga **menghapus** fitur lama yang meniru domain
"cabin booking" generik, sekarang sudah tidak relevan dengan skema Seaspace:
`features/cabins`, `features/bookings` (CRUD + `apiBookings.ts` lama), `features/guests`
(create), `features/settings`, beserta halaman dan route-nya. **Tidak** lagi "dibiarkan apa
adanya" seperti rencana awal — sudah tidak ada di repo ini.

`features/check-in-out` **sengaja dikecualikan** dari penghapusan (masih dipakai, masih
menunjuk skema lama, belum diperbaiki). Karena ternyata bergantung pada beberapa bagian dari
fitur yang dihapus (`BookingDataBox`, `useBooking`, `apiBookings.ts` subset, `useSettings`),
bagian-bagian itu **dipindahkan ke dalam `features/check-in-out/` sendiri** (bukan dihapus)
supaya fitur ini tetap mandiri dan tetap kompil. `src/types/bookings.type.ts` (skema zod
booking lama, dipakai `check-in-out`) dipertahankan di lokasinya semula (`src/types/`, bukan
bagian dari `features/bookings/`) tapi dependensinya ke `features/cabins/types/cabin.schema`
diganti jadi schema cabin lokal (`legacyCabinSchema`) supaya lepas dari `features/cabins`
yang sudah dihapus.

## Langkah aman ke depan

Urutan ini berlaku **terlepas dari arsitektur mana yang akhirnya dipilih** — semuanya prasyarat
bersama, tidak ada yang perlu dibongkar kalau keputusan berubah nanti.

### 1. Riset & keputusan arsitektur (belum dimulai)

- Bahas trade-off A vs B dengan user secara eksplisit sebelum coding. Pertimbangan yang relevan
  di repo ini:
  - Repo ini SPA murni (Vite, tanpa server sendiri) — opsi B berarti menambah komponen baru
    (server/route handler) yang saat ini tidak ada sama sekali di stack.
  - Opsi A berarti skema baru (`staff` table) yang jadi tanggung jawab repo **situs customer**
    kalau mengikuti pola `guests` (auth-triggered) — atau bisa juga dibuat independen di
    Supabase project yang sama tanpa menyentuh repo situs customer, tergantung desain.
  - Berapa staf yang akan pakai admin panel ini **belum diketahui** (lihat `CLAUDE.md`) —
    relevan untuk menimbang kompleksitas opsi A (role management) vs B (satu shared service
    key).
- Setelah dipilih, catat keputusan dan alasannya — baik di sini maupun (kalau menyentuh skema)
  didokumentasikan balik ke pemilik `ADMIN-PANEL-CONTEXT.md`.

### 2. Kalau opsi A (RLS staff-role) dipilih

1. Desain tabel `staff` (skema, siapa yang boleh menambah baris pertama kali — perlu proses
   manual/dashboard untuk staf pertama, karena belum ada mekanisme self-signup untuk staff).
2. Tulis migration Postgres untuk `staff` + policy INSERT/UPDATE/DELETE di keempat tabel
   katalog, dibatasi `auth.uid() in (select id from staff)` atau setara.
3. **Uji policy dengan akun staff sungguhan sebelum dianggap selesai** — ulangi test koneksi
   yang sama seperti di atas (`POST /rest/v1/amenities` dummy, lalu hapus) memakai token staff,
   harus **200/201**, bukan lagi 401.
4. Tambah auth staff (login) di admin panel kalau belum ada — cek dulu apakah `ProtectedRoute`
   yang sudah ada (lihat `CLAUDE.md`) cukup atau perlu diperluas.

### 3. Kalau opsi B (server tipis + service role) dipilih

1. Tentukan platform hosting server tipis ini (repo ini murni Vite/SPA, jadi ini komponen baru
   — bukan sekadar tambah file).
2. Service role key **hanya** boleh hidup di environment server itu, tidak pernah di `.env`
   yang dibaca `import.meta.env.*` (yang otomatis ter-bundle ke client oleh Vite).
3. Endpoint server memvalidasi request datang dari staf terautentikasi (server memverifikasi
   sesi/token Supabase Auth staf) sebelum memakai service role key untuk menulis.
4. Ulangi test koneksi yang sama lewat endpoint baru ini, bukan langsung ke Supabase dari
   browser.

### 4. Verifikasi wajib sebelum fitur tulis dianggap selesai (berlaku untuk A maupun B)

Jalankan tiga query dari
[Cara menguji dari sisi Anda](./ADMIN-PANEL-CONTEXT.md#cara-menguji-dari-sisi-anda) di
`ADMIN-PANEL-CONTEXT.md` setelah fitur tulis pertama (mis. create villa) selesai:

- Tidak ada baris `stay_images` yang kosong `blur_data_url`/`width`/`height`.
- Setiap villa punya `sort_order = 0` (cover).
- Villa baru dapat 6 baris `stay_amenities` shared.

## Guardrail selama masa transisi (sebelum arsitektur tulis ada)

- Jangan coba "mengakali" 401 RLS dengan menambah service role key ke `.env` **Vite** (`VITE_`
  prefix ter-bundle ke client — itu justru insiden kebocoran secret sungguhan, beda dari anon
  key yang memang aman di browser).
- Jangan menulis langsung ke `bookings`/`guests`/`reviews` meski secara teknis service role key
  nanti bisa — tetap di luar wewenang admin panel, lihat
  [Batas wewenang admin panel](./ADMIN-PANEL-CONTEXT.md#batas-wewenang-admin-panel).
- Test koneksi tulis (kalau perlu diulang) selalu pakai baris dummy yang jelas
  (`__connectivity_test__` atau sejenisnya) dan **hapus lagi setelah test**, seperti yang
  dilakukan pada 2026-08-15 (insert-nya sendiri gagal karena RLS, jadi tidak ada yang perlu
  dibersihkan saat itu — tapi kalau policy sudah aktif nanti dan test berhasil, wajib
  dibersihkan).

## Referensi cepat

- Kontrak skema, wewenang, dan pipeline upload gambar: [`ADMIN-PANEL-CONTEXT.md`](./ADMIN-PANEL-CONTEXT.md)
- Aturan tegas repo ini: [`CLAUDE.md`](./CLAUDE.md)
