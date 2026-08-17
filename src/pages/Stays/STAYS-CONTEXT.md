# Stays page — session notes

> Ko-lokasi di `pages/Stays/` supaya sesi/agent berikutnya yang menyentuh rute `/stays`
> menemukan ini duluan. Bukan dokumentasi permanen — pindahkan/hapus kalau sudah tidak relevan.

## Apa yang berubah sesi ini

Rute `/stays` sebelumnya cuma heading + tombol "Add Villa" — tanpa data visual apa pun.
Ditambahkan **2 kartu ringkasan** bergaya kartu KPI dashboard di atas heading itu:

1. **Available** — jumlah villa yang **tidak** ada tamu menginap hari ini.
2. **Occupied** — jumlah villa yang **ada** tamu menginap hari ini.

Plus label nav "Villas" diganti jadi **"Stays Management"** (`src/ui/MainNav/MainNav.tsx`).

Referensi visual (screenshot Dribbble "Guesty" hotel room dashboard) menunjukkan pola
Available/Occupied/Maintenance/Out-of-Order dengan badge persentase — **scope sesi ini
sengaja dibatasi ke 2 kartu saja**, dan bentuknya angka jumlah + kartu bergaya `Stat.tsx`
(icon badge + angka besar + label), bukan gaya persentase di screenshot itu.

## Keputusan yang sudah dikonfirmasi user (jangan tanya ulang)

- **Definisi "Occupied"**: villa yang punya booking dengan
  `status in ('confirmed','checked_in')` dan `start_date <= hari_ini <= end_date` — bukan
  "pernah punya booking apa pun". Logic ada di `useStaysOccupancy.ts`.
- **Definisi "Available"**: `totalStaysCount - occupiedCount`, dihitung di `StaysStats.tsx`.
  Tidak ada state "Maintenance"/"Out of Order" — itu di luar scope karena tidak ada konsep
  itu di skema `stays` sama sekali (lihat `ADMIN-PANEL-CONTEXT.md`).
- **Format nilai**: jumlah villa (mis. `"3"`), **bukan persentase** — konsisten dengan 4 kartu
  KPI dashboard yang lain (`Total Bookings`, `New Booking`, dst).
- **`Stat.tsx` dipindah** dari `src/features/dashboard/components/Stat.tsx` ke
  `src/ui/Stat/Stat.tsx` supaya jadi komponen generik lintas-fitur (dashboard dan stays
  sama-sama pakai tanpa saling import internal antar-fitur). Tidak ada perubahan logic/props —
  cuma pindah lokasi. `Stats.tsx` (dashboard) di-update importnya ke path baru.
- **"Available"/"Occupied" bukan konsep yang ada di database** — tabel `stays` cuma punya
  `is_new`/`is_featured`, tidak ada kolom status ketersediaan. Kedua angka **diturunkan
  (derived)** di frontend dari RPC `admin_booking_financials`, bukan dibaca dari kolom. Kalau
  suatu hari perlu jadi kolom sungguhan (mis. status "Maintenance"), itu perubahan skema di
  repo situs customer — lihat `ADMIN-PANEL-CONTEXT.md`, bukan sesuatu yang bisa ditambah
  sepihak dari admin panel.

## Catatan teknis penting

`admin_booking_financials(p_from, p_to)` memfilter berdasarkan **`created_at`** booking,
**bukan** `start_date`/`end_date` stay-nya. Jadi untuk tahu "siapa yang menginap hari ini",
**tidak bisa** memanggil RPC dengan `p_from`/`p_to` = hari ini — booking untuk stay hari ini
bisa saja dibuat berminggu-minggu sebelumnya. `useStaysOccupancy.ts` karena itu memanggil RPC
dengan rentang lebar yang sama seperti `useTotalBookingsCount.ts`
(`p_from: "2000-01-01"`, `p_to`: hari ini), lalu memfilter `start_date`/`end_date` di client.

> ⚠️ **Bug yang sempat terjadi dan sudah diperbaiki**: draft pertama hook ini memakai query key
> yang **sama** dengan `useTotalBookingsCount.ts` (`["booking-financials", "all-time"]`) dengan
> asumsi react-query akan "dedupe" fetch-nya karena RPC dan parameternya sama persis. Itu salah
> — react-query cache di-key murni dari `queryKey`, **bukan** dari `queryFn`. Dua hook itu
> `queryFn`-nya beda return type (`useTotalBookingsCount` → `number` hasil `.length`;
> `useStaysOccupancy` → array `BookingFinancialRow[]`). Karena key-nya sama, siapa pun yang
> populate cache duluan menentukan bentuk datanya untuk KEDUA hook — kalau yang menang
> `useTotalBookingsCount`, `bookingFinancials` di `useStaysOccupancy` jadi `number`, dan
> `(bookingFinancials ?? []).filter(...)` meledak dengan `filter is not a function`.
>
> **Fix**: `useStaysOccupancy` sekarang pakai key sendiri, `["booking-financials",
> "occupancy-today"]`. Sengaja **tidak** berbagi cache dengan `useTotalBookingsCount` walau
> keduanya memanggil RPC yang identik — aturan yang berlaku ke depan: **jangan pernah samakan
> query key antar-hook kecuali `queryFn`-nya benar-benar mengembalikan shape yang sama**. Kalau
> butuh dedupe request beneran, extract satu shared hook/queryFn yang dipakai bareng, jangan
> cuma menyamakan key-nya.

## File yang disentuh sesi ini

- `src/features/dashboard/components/Stat.tsx` → dipindah ke `src/ui/Stat/Stat.tsx`
- `src/features/dashboard/components/Stats.tsx` → update import path `Stat`
- `src/features/stays/hooks/useStaysOccupancy.ts` → baru
- `src/features/stays/components/StaysStats.tsx` → baru
- `src/pages/Stays/Stays.tsx` → render `StaysStats`, gate loading dengan `Spinner`
- `src/ui/MainNav/MainNav.tsx` → label nav "Villas" → "Stays Management"

## Scope selanjutnya — BELUM dikerjakan, open items (bukan rencana yang sudah disetujui)

- **Daftar/tabel villa di `/stays`.** ✅ Dikerjakan di sesi berikutnya — lihat
  `STAYS-TABLE-DECISIONS.md` di folder yang sama untuk tabel, sort/filter, dan action
  (toggle flag, edit, delete) yang ditambahkan, plus open items baru dari sesi itu.
- **Kartu Maintenance/Out-of-Order** dari referensi Dribbble. Sengaja tidak dikerjakan —
  tidak ada konsep itu di skema `stays`. Butuh kolom baru (mis. status villa) yang berarti
  perubahan skema di repo situs customer dulu, bukan sesuatu yang bisa diakali dari admin
  panel (lihat `ADMIN-PANEL-CONTEXT.md`).
- **Apakah occupancy perlu terikat filter tanggal** seperti `DashboardFilter` ("Last 7/30/90
  days"), atau tetap selalu "hari ini" seperti sekarang? Belum diputuskan — saat ini
  `/stays` tidak menampilkan `DashboardFilter` sama sekali (itu cuma muncul di
  `MainNav.tsx` saat `pathname === "/dashboard"`), jadi occupancy selalu snapshot hari ini.
- **Persentase vs jumlah** — kalau nanti user berubah pikiran ingin gaya persentase seperti
  referensi Dribbble, itu tinggal ubah `StaysStats.tsx` (hitung `%` dari
  `occupiedCount / totalStaysCount`), bukan perubahan data-fetching.
