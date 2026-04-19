# 🗺️ User Journey: Alur Pengguna TrailForge

Dokumen ini memetakan alur interaksi (*User Journey*) seorang *customer* dari titik awal (_Landing Page_) sampai pesanan berhasil (_Checkout & Tracking_).

## Visualisasi Alur Pengguna (Mermaid)

```mermaid
journey
    title Perjalanan Belanja Pelanggan di TrailForge
    section 1. Discovery (Pencarian & Edukasi)
      Buka Landing Page: 5: Customer
      Melihat Efek Parallax/Gunung: 5: Customer
      Klik tombol "Jelajahi Gear": 4: Customer
      Mencari via Search Bar & Kategori: 4: Customer
    
    section 2. Evaluasi Produk
      Masuk ke Halaman Katalog: 4: Customer
      Klik Card Produk: 5: Customer
      Membaca Spesifikasi & Edukasi: 5: Customer
      Melihat Rating & Review Petualang: 4: Customer
      
    section 3. Transaksi
      Klik "Tambah ke Keranjang": 5: Customer
      Membuka Modal Cart: 4: Customer
      Klik "Checkout": 4: Customer
      Mengisi Alamat & Ekspedisi: 3: Customer
      Melakukan Pembayaran (Midtrans): 4: Customer
      
    section 4. Pasca-Pembelian
      Menerima Email Konfirmasi: 5: Customer
      Melacak Status Pesanan (Dashboard): 4: Customer
      Review Produk di Web: 4: Customer
```

## Penjelasan Fase (*Breakdown*)

### Fase 1: Discovery (Kesadaran)
*   **Aksi**: *User* tertarik dengan UI kita yang berasa "Hutan/Gunung" dan mengklik bagian *Jelajahi Gear*. 
*   **Emosi Diharapkan**: Terkesima, *excited*, merasa *trust/premium*.

### Fase 2: Evaluasi Produk
*   **Aksi**: Memerinci spesifikasi produk spesifik (misal: *Hammock Tent*). *User* membaca jurnal / tips cara pasang *hammock* tersebut di produk.
*   **Emosi Diharapkan**: Yakin karena produk diriset ketat, minim keraguan kualitas bahan.

### Fase 3: Transaksi
*   **Aksi**: Konversi. Keranjang belanja dirancang minim hambatan (*frictionless*), pemilihan logistik jelas, dibantu gerbang pembayaran QRIS atau Virtual Account otomatis.
*   **Emosi Diharapkan**: Aman dari penipuan, cepat proses bayarnya.

### Fase 4: Pasca-Pembelian (*Retention*)
*   **Aksi**: Mendapatkan nomor pelacakan unik di akun profil mereka, serta surel (*email*) konfirmasi pembayaran otomatis.
*   **Emosi Diharapkan**: Puas dan nantinya berlanjut ingin memberi *review*.
