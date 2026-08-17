# Dashboard stats redesign — session notes

> Ko-lokasi di `pages/Dashboard/` supaya sesi/agent berikutnya yang menyentuh dashboard
> menemukan ini duluan. Bukan dokumentasi permanen — pindahkan/hapus kalau sudah tidak relevan.

## Apa yang berubah

Baris 4-kartu KPI di atas Dashboard direstyle mengikuti referensi visual (dashboard hotel
management style: kartu putih rounded, badge icon lingkaran, angka besar + label) dan isinya
diganti dari **Bookings/Sales/Check-ins/Occupancy rate** menjadi (kiri ke kanan):

1. **Total Bookings** — all-time, tidak terikat filter tanggal (`useTotalBookingsCount.ts`, baru).
2. **New Booking** — dalam rentang filter aktif (`DashboardFilter`, "Last 7/30/90 days"). Ini
   persis definisi "Bookings" yang lama, cuma di-relabel + dipindah posisi.
3. **Check-ins** — logika tidak berubah dari sebelumnya, cuma dipindah posisi.
4. **Sales** — logika tidak berubah dari sebelumnya, cuma dipindah posisi.

Font default seluruh aplikasi diganti dari Poppins ke **Manrope** (`GlobalStyles.ts` +
`index.html`) — bukan cuma di-scope ke dashboard. `Sono` (dipakai `ErrorFallback.tsx`,
`BookingDataBox.tsx`) tidak disentuh.

Badge icon di `Stat.tsx` diubah dari warna beda-per-kartu (biru/hijau/indigo/kuning) jadi abu-abu
netral untuk semua kartu, mengikuti referensi visual. Prop `color` dihapus dari `Stat`.

## Keputusan yang sudah dikonfirmasi user (jangan tanya ulang)

- **Total Bookings all-time**: sengaja **reuse** RPC `admin_booking_financials(p_from, p_to)`
  yang sudah ada, dipanggil dengan rentang sangat lebar (`2000-01-01` s/d hari ini), bukan RPC
  baru — supaya tidak menyentuh skema/repo situs customer sama sekali. Lihat
  `useTotalBookingsCount.ts`.
- **Occupancy rate**: **dihapus**, bukan dipindah ke tempat lain di dashboard. Kalau dibutuhkan
  lagi, lihat git history `Stats.tsx`/`DashboardLayout.tsx` sebelum perubahan ini (logikanya:
  `totalNights / (numDays * villaCount)` dari `confirmedStays`), jangan ditulis ulang dari nol.
- **Warna badge**: abu-abu netral dipilih secara eksplisit menggantikan skema warna lama.
- **Font Manrope**: eksplisit global (default `body`), bukan cuma dashboard.

## Catatan biaya / hal yang perlu dipantau

`useTotalBookingsCount` memanggil `admin_booking_financials` tanpa batas tanggal efektif —
mengembalikan **semua** baris booking yang pernah ada. Untuk katalog sekecil ini (4 villa, volume
booking masih rendah) ini bukan masalah. Kalau volume booking bertambah signifikan di masa
depan, pertimbangkan RPC count-only terpisah di repo situs customer (butuh koordinasi skema,
bukan sesuatu yang bisa ditambah sepihak dari admin panel — lihat `ADMIN-PANEL-CONTEXT.md`).
