# Stays table — session notes

> Ko-lokasi di `pages/Stays/` bersama `STAYS-CONTEXT.md` (sesi sebelumnya, 2 kartu stat).
> Sesi ini menambahkan tabel villa + sort/filter + action (toggle flag, edit, delete) di
> bawah kartu stat itu. Bukan dokumentasi permanen — pindahkan/hapus kalau sudah tidak
> relevan.

## Apa yang berubah sesi ini

1. **Perbaikan skema basi (prasyarat, dikerjakan dulu).** `stay.schema.ts`, `readStays.ts`,
   `createStay.ts`, `stay-create.schema.ts`, `CreateStayForm.tsx`, dan `database.types.ts`
   masih menyentuh 5 kolom yang sudah di-drop dari `public.stays`
   (`bed_type_label`, `bed_type_note`, `capacity_label`, `airport_code`, `airport_city`) —
   lihat `ADMIN-PANEL-CONTEXT2.md` § "Kontrak data — skema tabel" dan
   `STAYS-INPUT-DECISIONS.md`. Kalau tidak dibuang dulu, `readStays.ts` akan gagal dengan
   `column does not exist` begitu migrasi live, dan tabel yang dibangun sesi ini tidak akan
   pernah tampil. Semua referensi ke 5 kolom itu sudah dibuang dari repo ini.
2. **Tabel villa** (`StayTable`, `StayRow`) di `/stays`, di bawah heading "Villas (N)" +
   tombol "Add Villa".
3. **Sort** — klik heading kolom Villa/Price/Specs untuk toggle asc/desc. Kolom "Created
   date" tidak punya kolom tabel sendiri (lihat keputusan di bawah), jadi sort-nya lewat
   tombol "Newest/Oldest first" di `StayTableOperations`.
4. **Filter** — panel di `StayTableOperations`: Featured only, New only, price range,
   capacity minimum, "Not ready to publish (0 photos)".
5. **Action per baris**: toggle `is_new`/`is_featured` langsung dari tag di tabel, Edit
   (buka form penuh di `/stays/:id/edit`), Delete (manager-only, dengan cleanup storage).

## Revisi visual (sesi lanjutan)

Versi pertama tabel ini ditolak karena tampilannya jauh dari referensi. Yang diperbaiki:

- **Font.** Kolom harga & specs sempat pakai `font-family: "Sono"` (ikut pola `CabinRow` lama).
  Sono itu font **monospace** — itu penyebab utama "fontnya beda jauh". Sekarang tidak ada
  Sono sama sekali di fitur stays; semua ikut font global **Manrope**. Lihat
  `DASHBOARD-STATS-REDESIGN.md`: Sono memang sengaja dibatasi cuma untuk `ErrorFallback.tsx`
  dan `BookingDataBox.tsx`, bukan font umum aplikasi.
- **Shell tabel tidak lagi pakai `ui/Table`.** Komponen generik itu radius-nya 7px, header-nya
  `text-transform: uppercase`, dan header-nya nempel rata ke tepi kartu — tiga hal yang
  bertentangan dengan referensi (radius 20px, header title-case, header bar **inset** di dalam
  kartu ber-padding). Shell-nya sekarang komponen sendiri di `stayTable.styles.ts`, memakai
  `--border-radius-lg` + border `grey-100` yang **sama persis** dengan `ui/Stat/Stat.tsx`,
  supaya kartu tabel terbaca satu keluarga dengan kartu stat di atasnya. `ui/Table` tidak
  disentuh (dibiarkan utuh untuk pemakai lain di masa depan).
- **Ritme spasi.** `StaysStats` sempat punya `margin-bottom: 2.4rem` yang menumpuk dengan
  `gap: 1.2rem` milik `AppLayout`'s `Container` → jarak di bawah kartu stat jadi 3.6rem,
  kelihatan lebih lebar dari semua jarak lain di halaman. Margin itu dihapus; sekarang semua
  jarak antar-section seragam 1.2rem.
- **Toolbar** (judul kiri + search/Filter/Sort by pill di kanan) ditambahkan mengikuti layout
  referensi. Pill-nya `border-radius: 9999px` + border `grey-200`.
- **Kolom flags dihapus dari tabel**, dipindah ke form edit (lihat di bawah).

### Kenapa layout referensi diikuti tapi datanya tidak

Diklarifikasi user: yang harus 1:1 itu **layout**, bukan datanya. Kolom referensi yang tidak
punya padanan di skema `stays` dipetakan ke informasi yang memang ada di repo ini:

| Kolom referensi     | Kolom di sini                          |
| ------------------- | -------------------------------------- |
| Room Name + #302    | Thumbnail + nama villa + `location`    |
| Price / night       | `price_per_night` (Rupiah)             |
| Price (kedua)       | `discount`, atau "No discount"         |
| Amenities           | `capacity` / `beds` / `area`           |
| Thumbnail Tooltip   | jumlah foto                            |
| Status (Available)  | "Ready" / "No photos"                  |
| Action (✏ 👁 ⋮)     | ✏ (edit modal) + ⋮ (menu → delete)     |

**Ikon mata (view) sengaja tidak dibuat.** Padanannya adalah "buka villa di situs customer",
tapi URL situs customer tidak ada di env repo ini, dan `ADMIN-PANEL-CONTEXT2.md` melarang
menampilkan link "lihat di situs" yang seolah-olah langsung jadi (villa baru 404 sampai situs
di-deploy ulang). Jadi tombolnya tidak diadakan daripada mengarang fitur yang tidak berfungsi.

**Status "Ready"/"No photos"** dipilih untuk mengisi slot badge hijau referensi karena itu satu
fakta kesiapan yang paling penting: villa tanpa foto **meng-crash** halaman detail di situs
customer. Bukan "Available/Occupied" — itu sudah jadi 2 kartu stat di atas tabel, dan tidak ada
konsep status ketersediaan di skema `stays` (lihat `STAYS-CONTEXT.md`).

### Edit form jadi modal, route `stays/:id/edit` dihapus

Form edit sekarang muncul sebagai `Modal.Window` yang dibuka ikon pensil di baris tabel, bukan
halaman tersendiri. Konsekuensinya `src/pages/Stays/EditStay.tsx` + route-nya di `App.tsx`
dihapus, berikut `useStay.ts` dan `readStayById.ts` yang cuma dipakai halaman itu (data villa
sekarang datang dari baris tabel yang sudah punya objek `Stay`-nya — tidak perlu query per-id).

Layout form-nya bukan `ui/FormRow` (grid `24rem 1fr 1.2fr`, label di samping input) melainkan
grid 2 kolom dengan label di atas input — `FormRow` bikin modal jadi terlalu tinggi untuk 12
field. Form-nya `max-height: 78vh; overflow-y: auto` supaya tidak melewati viewport.

### Flags (`is_new`/`is_featured`) pindah dari tabel ke form edit

Permintaan eksplisit user. Efek sampingnya bagus: aturan "maksimal 2 villa featured" sekarang
ditegakkan di **satu** tempat saja (checkbox `is_featured` di-disable kalau cap tercapai dan
villa ini belum featured), bukan tersebar di tiap baris tabel. Mematikan featured selalu
diizinkan — staff tidak boleh terkunci di state featured.

### ⚠️ `Modal.Open` wajib pakai bentuk render-function

Ditemukan saat sesi ini dan **bukan sesuatu yang ketahuan dari `npm run build`/`lint`**:

```jsx
// SALAH — tombolnya render, tapi klik-nya tidak melakukan apa-apa
<Modal.Open opens="delete-stay">
    <Menus.Button icon={<HiOutlineTrash />}>Delete</Menus.Button>
</Modal.Open>

// BENAR
<Modal.Open opens="delete-stay">
    {(open) => <Menus.Button icon={<HiOutlineTrash />} onClick={open}>Delete</Menus.Button>}
</Modal.Open>
```

`Modal.Open` (`src/ui/Modal/Modal.tsx`) cuma memasang `handleClick` kalau `children` berupa
function; anak berupa elemen biasa dirender apa adanya tanpa handler. Draft pertama tabel ini
memakai bentuk yang salah, jadi tombol Delete-nya diam saja saat diklik — lolos TypeScript
**dan** ESLint. `CabinRow` lama selalu memakai bentuk function (cek `git show`), jadi ikuti itu.

## Keputusan

### Kenapa sort/filter client-side, bukan URL params seperti `Filter`/`SortBy` yang sudah ada

`src/ui/Filter/Filter.tsx` dan `src/ui/SortBy/SortBy.tsx` yang sudah ada di repo ini
single-select dropdown terikat `useBatchSearchParams` — cocok untuk pola lama
(`CabinTable`/`BookingTable`) yang backend-paginated dan cuma butuh satu filter aktif
sekaligus. Tabel stays beda kebutuhan: `useStays()` membaca **seluruh** katalog tanpa
pagination (villa cuma segelintir baris), dan filter yang diminta butuh **beberapa kriteria
aktif bersamaan** (flag + price range + capacity + kelengkapan data, sekaligus). Mereproduksi
`useBatchSearchParams` untuk multi-kriteria lebih rumit daripada manfaatnya di skala data
sekecil ini — jadi `useStayTableState.ts` (baru) menyimpan sort+filter sebagai state lokal
React, murni `.filter()`/`.sort()` di atas array yang sudah ada di memory.

Konsekuensi: sort/filter **tidak** persist di URL (refresh halaman = reset ke default). Kalau
nanti katalog membesar jauh melampaui "segelintir villa", pola ini perlu ditinjau ulang.

### Kenapa tanpa ikon panah di header kolom

Permintaan eksplisit user, beda dari referensi visual (dashboard "Guesty" di Dribbble) yang
punya ikon panah di setiap kolom. `SortableHeaderCell` (`src/ui/Table/SortableHeaderCell.tsx`,
baru) menandai kolom aktif lewat warna (`var(--color-brand-600)`) saja.

### Kenapa "Created date" tidak punya kolom tabel sendiri

Kolom tabel yang disepakati (Villa/Price/Specs/Flags/Action) tidak menyisakan tempat untuk
kolom "Created" terpisah — 5 kriteria sort yang diminta user (name, price, capacity, created
date) lebih banyak dari kolom yang mau ditampilkan. Sort by `created_at` karena itu dipindah
ke tombol "Newest/Oldest first" di `StayTableOperations`, bukan dipaksakan jadi kolom
tersembunyi. Kalau nanti user ingin kolom "Added" eksplisit, itu perubahan `COLUMNS` di
`StayTable.tsx`.

### Kenapa "belum siap tayang" cuma cek 0 foto (MVP), bukan checklist penuh

Checklist siap-tayang penuh di `ADMIN-PANEL-CONTEXT2.md` § "Cara menguji dari sisi Anda" ada
5 item (baris gambar lengkap, setiap villa punya cover, `sort_order` rapat, `alt` tidak
kembar, 6 amenity shared). Scope sesi ini sengaja dipersempit ke **nol gambar saja** —
satu-satunya kondisi yang benar-benar **meng-crash** halaman villa di situs customer (bukan
sekadar salah tampil). Item checklist lainnya (sort_order tidak rapat, alt kembar, amenity
shared kurang) **belum** dicek dari tabel ini — itu follow-up terbuka kalau dibutuhkan nanti.
Datanya sudah tersedia dari `useStayImages()` (baca penuh `stay_images`, sama seperti
`useStaysOccupancy` membaca penuh booking), jadi menambah item checklist lain nanti tidak
perlu query baru, cuma logic tambahan di `stayImages.ts`/`useStayTableState.ts`.

### Policy 2-featured-max — UI-only, tidak ada constraint database

`ADMIN-PANEL-CONTEXT2.md` baris 659 eksplisit bilang tidak ada constraint DB yang mencegah
villa ketiga ditandai `is_featured = true` — landing page cuma dirancang untuk 2 kartu.
`StayRow.tsx` menghitung `featuredCount` dari data `useStays()` yang sudah di-fetch (tidak
query baru) dan men-disable tag "Featured" kalau `featuredCount >= 2` dan villa itu belum
featured. Toggle dari `true → false` **selalu** diizinkan — kebijakan ini tidak boleh
mengunci staff di posisi tidak bisa keluar dari state featured.

### Edit form — scope kolom `stays` saja, tidak termasuk foto/amenity

`EditStayForm.tsx` (baru) reuse struktur `CreateStayForm.tsx` tapi:
- `slug` **read-only** — sesuai `STAYS-INPUT-DECISIONS.md`, mengubah slug mengubah URL publik
  villa. Admin panel ini tidak punya state "draft" terpisah dari "published", jadi semua villa
  yang sudah ada dianggap published dan slug-nya selalu terkunci di form edit.
- **Tidak** mengulang alur upload foto atau attach amenity dari `CreateStayForm`. Edit form
  cuma menulis kolom `stays` (`updateStay.ts`, generic `Partial<...Update>` payload). Re-upload
  foto atau ubah amenity villa yang sudah ada **belum dikerjakan** — kalau dibutuhkan, itu
  fitur terpisah yang perlu form/flow sendiri (kemungkinan reuse `StayImageUploader`/
  `AmenityPicker` yang sudah ada di create-flow, tapi dengan mutation yang berbeda: insert
  baris baru vs. hapus+insert ulang untuk foto/amenity yang sudah ada).

### Delete villa — storage cleanup dulu, baru baris DB

`deleteStay.ts` (baru) mengikuti urutan di `ADMIN-PANEL-CONTEXT2.md` § "Menghapus gambar":
baca `storage_path` semua `stay_images` milik villa itu → hapus objek dari bucket `stays` →
baru hapus baris `stays` (baris `stay_images`/`stay_amenities` ikut cascade di DB). Kalau
dibalik (hapus baris dulu), `storage_path`-nya sudah tidak bisa dilihat lagi dan file di
bucket jadi yatim selamanya.

Error kode Postgres `23503` (foreign key violation dari `bookings_stay_id_fkey`, `on delete
restrict`) ditangkap eksplisit dan diubah jadi pesan bisnis ("villa ini punya booking..."),
bukan pesan Postgres generik — sesuai `ADMIN-PANEL-CONTEXT2.md` § "Villa yang punya booking
tidak bisa dihapus": ini aturan bisnis, bukan bug yang perlu di-debug tiap kali muncul.

Role gating (`staff` tidak bisa hapus villa, cuma `manager`) ditegakkan di dua tempat: UI
(`StayRow.tsx` cek `useIsStaff().role`, tombol Delete diganti item non-interaktif untuk
`staff`) **dan** RLS di database (`0015_staff_catalog_writes.sql` / disebut sebagai
`0016_admin_staff_catalog_writes.sql` di migrasi lokal repo ini — cek nama file migrasi
sebenarnya di `src/supabase/migrations/` kalau nomor referensinya perlu dicocokkan ulang).
UI-side cuma defense-in-depth; RLS yang jadi penegak sebenarnya.

## File yang disentuh/dibuat sesi ini

**Fix skema basi:**
- `src/features/stays/types/stay.schema.ts`, `stay-create.schema.ts`
- `src/features/stays/services/readStays.ts`, `createStay.ts`
- `src/features/stays/components/CreateStayForm.tsx`
- `src/supabase/types/database.types.ts`

**Lapisan data baru:**
- `src/features/stays/services/updateStay.ts`, `deleteStay.ts`, `readStayById.ts`
- `src/features/stays/hooks/useUpdateStay.ts`, `useDeleteStay.ts`, `useStayImages.ts`, `useStay.ts`, `useStayTableState.ts`
- `src/features/stays/utils/stayImages.ts`
- `src/features/stays/types/stay-edit.schema.ts`

**Komponen tabel:**
- `src/features/stays/components/stayTable.styles.ts` — shell kartu, header bar, grid kolom
- `src/features/stays/components/StayTable.tsx`, `StayRow.tsx`, `StayTableOperations.tsx`

**Edit form (modal):**
- `src/features/stays/components/EditStayForm.tsx`
- `src/features/stays/types/stay-edit.schema.ts`

**Wiring:**
- `src/pages/Stays/Stays.tsx` — render `StayTable` di bawah heading
- `src/features/stays/components/StaysStats.tsx` — hapus `margin-bottom`

**Dihapus di revisi visual** (jangan dibuat ulang tanpa alasan baru):
- `src/pages/Stays/EditStay.tsx` + route `stays/:id/edit` di `App.tsx` → diganti modal
- `src/features/stays/hooks/useStay.ts`, `src/features/stays/services/readStayById.ts` →
  cuma dipakai halaman edit yang sudah dihapus
- `src/ui/Table/SortableHeaderCell.tsx` → header sortable sekarang inline di `StayTable.tsx`

## Scope selanjutnya — BELUM dikerjakan, open items

- **Checklist siap-tayang penuh** (sort_order rapat, alt tidak kembar, 6 amenity shared) di
  filter "belum siap tayang" — sengaja dipersempit ke 0-foto saja untuk sesi ini.
- **Re-upload foto / ubah amenity dari Edit form** — Edit form sesi ini cuma kolom `stays`.
- **Kolom "Created" eksplisit di tabel** kalau user berubah pikiran soal 5 kolom yang
  ditampilkan.
- **Pagination** kalau katalog villa membesar jauh melampaui "segelintir baris" — pola
  client-side sort/filter di `useStayTableState.ts` perlu ditinjau ulang saat itu terjadi.
