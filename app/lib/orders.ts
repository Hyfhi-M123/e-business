// Status flow: Belum Bayar → Menunggu Konfirmasi → Dikemas → Dikirim → Selesai
// Courier & tracking info only available from "Dikirim" onwards

export type OrderStatus = "Belum Bayar" | "Menunggu Konfirmasi" | "Dikemas" | "Dikirim" | "Selesai" | "Dibatalkan";

export interface TrackingEvent {
  status: string;
  title: string;
  desc: string;
  time: string;
  icon: "check" | "box" | "warehouse" | "truck" | "navigation" | "building" | "delivered";
}

export interface OrderShipping {
  courier: string;
  courier_code: string;
  service: string;
  receipt: string;
  driver?: { name: string; phone: string; plate: string };
  address: string;
  tracking?: TrackingEvent[];
}

export interface OrderItem {
  id: string;
  name: string;
  variant: string;
  qty: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  store: string;
  items: OrderItem[];
  shipping: OrderShipping;
  payment: {
    method: string;
    subtotal: number;
    shipping_cost: number;
    discount: number;
    total: number;
  };
  // Lifecycle timestamps
  timeline: {
    ordered_at: string;
    paid_at?: string;
    confirmed_at?: string;    // Seller confirms
    packed_at?: string;       // Seller finished packing
    shipped_at?: string;      // Handed to courier
    delivered_at?: string;    // Delivered to buyer
  };
}

export const DUMMY_ORDERS: Order[] = [
  // 1. BELUM BAYAR — baru checkout, belum bayar
  {
    id: "TRF-223190",
    status: "Belum Bayar",
    date: "12 Mei 2026",
    total: 465000,
    store: "TrailForge Official",
    items: [
      { id: "104", name: "Polaris Compass Pro", variant: "Default", qty: 1, price: 450000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" }
    ],
    shipping: {
      courier: "",
      courier_code: "",
      service: "",
      receipt: "-",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "GoPay",
      subtotal: 450000,
      shipping_cost: 15000,
      discount: 0,
      total: 465000
    },
    timeline: {
      ordered_at: "2026-05-12T04:30:00",
    },
  },

  // 2. MENUNGGU KONFIRMASI — sudah bayar, menunggu seller
  {
    id: "TRF-330412",
    status: "Menunggu Konfirmasi",
    date: "11 Mei 2026",
    total: 2850000,
    store: "TrailForge Official",
    items: [
      { id: "105", name: "Summit Ridge Backpack 65L", variant: "Forest Green", qty: 1, price: 2850000, image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=600&q=80" }
    ],
    shipping: {
      courier: "",
      courier_code: "",
      service: "",
      receipt: "-",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "QRIS",
      subtotal: 2850000,
      shipping_cost: 0,
      discount: 0,
      total: 2850000
    },
    timeline: {
      ordered_at: "2026-05-11T15:20:00",
      paid_at: "2026-05-11T15:22:00",
    },
  },

  // 3. DIKEMAS — seller sudah konfirmasi & sedang kemas
  {
    id: "TRF-441098",
    status: "Dikemas",
    date: "10 Mei 2026",
    total: 1750000,
    store: "TrailForge Official",
    items: [
      { id: "106", name: "Alpine Thermal Flask 1L", variant: "Matte Black", qty: 2, price: 875000, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80" }
    ],
    shipping: {
      courier: "JNE",
      courier_code: "jne",
      service: "REG",
      receipt: "-",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "Transfer Bank (BCA)",
      subtotal: 1750000,
      shipping_cost: 18000,
      discount: -18000,
      total: 1750000
    },
    timeline: {
      ordered_at: "2026-05-10T09:00:00",
      paid_at: "2026-05-10T09:05:00",
      confirmed_at: "2026-05-10T10:30:00",
      packed_at: "2026-05-10T14:00:00",
    },
  },

  // 4. DIKIRIM — sudah di tangan kurir, tracking AKTIF
  {
    id: "TRF-991203",
    status: "Dikirim",
    date: "7 Mei 2026",
    total: 3450000,
    store: "TrailForge Official",
    items: [
      { id: "101", name: "Vertex Summit Tent", variant: "Alpine White", qty: 1, price: 3450000, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80" }
    ],
    shipping: {
      courier: "JNE",
      courier_code: "jne",
      service: "REG",
      receipt: "WYB-1778541521467",
      driver: { name: "Budi Santoso", phone: "0812-9876-5432", plate: "B 1234 XYZ" },
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890",
      tracking: [
        { status: "confirmed", title: "Pesanan Dikonfirmasi", desc: "Pembayaran berhasil diterima.", time: "2026-05-07T09:15:00", icon: "check" },
        { status: "allocated", title: "Sedang Dikemas", desc: "Barang sedang dikemas oleh tim gudang TrailForge.", time: "2026-05-07T10:30:00", icon: "box" },
        { status: "picking_up", title: "Menunggu Pickup Kurir", desc: "Paket siap dijemput oleh kurir JNE.", time: "2026-05-07T13:00:00", icon: "warehouse" },
        { status: "picked", title: "Paket Telah Dijemput", desc: "Kurir telah mengambil paket dari gudang.", time: "2026-05-07T14:22:00", icon: "truck" },
        { status: "dropping_off", title: "Dalam Perjalanan", desc: "Paket berada di Sorting Center JNE Jakarta.", time: "2026-05-07T18:45:00", icon: "navigation" },
        { status: "dropping_off", title: "Transit — Hub Cilandak", desc: "Paket tiba di Hub JNE Cilandak untuk proses distribusi.", time: "2026-05-08T06:10:00", icon: "building" },
      ],
    },
    payment: {
      method: "QRIS",
      subtotal: 3450000,
      shipping_cost: 0,
      discount: 0,
      total: 3450000
    },
    timeline: {
      ordered_at: "2026-05-07T09:00:00",
      paid_at: "2026-05-07T09:15:00",
      confirmed_at: "2026-05-07T10:00:00",
      packed_at: "2026-05-07T12:30:00",
      shipped_at: "2026-05-07T14:22:00",
    },
  },

  // 5. SELESAI — delivered, tracking lengkap
  {
    id: "TRF-445821",
    status: "Selesai",
    date: "20 April 2026",
    total: 1200000,
    store: "TrailForge Official",
    items: [
      { id: "102", name: "Timberline X-Coat Arctic", variant: "M - Midnight Black", qty: 1, price: 1200000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80" }
    ],
    shipping: {
      courier: "SiCepat",
      courier_code: "sicepat",
      service: "HALU",
      receipt: "SC-99120038812",
      driver: { name: "Riko Febrian", phone: "0815-7777-3210", plate: "B 9012 DEF" },
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890",
      tracking: [
        { status: "confirmed", title: "Pesanan Dikonfirmasi", desc: "Pembayaran via Transfer Bank (BCA) berhasil diterima.", time: "2026-04-20T08:30:00", icon: "check" },
        { status: "allocated", title: "Sedang Dikemas", desc: "Barang sedang dikemas oleh tim gudang TrailForge.", time: "2026-04-20T10:00:00", icon: "box" },
        { status: "picked", title: "Paket Telah Dijemput", desc: "Kurir SiCepat telah mengambil paket dari gudang.", time: "2026-04-20T14:15:00", icon: "truck" },
        { status: "dropping_off", title: "Dalam Perjalanan", desc: "Paket berada di Sorting Center SiCepat Jakarta.", time: "2026-04-20T19:30:00", icon: "navigation" },
        { status: "dropping_off", title: "Transit — Hub Kebayoran", desc: "Paket tiba di Hub SiCepat Kebayoran Baru.", time: "2026-04-21T07:45:00", icon: "building" },
        { status: "delivered", title: "Paket Terkirim", desc: "Paket diterima oleh: ALEX MERCER (penerima langsung).", time: "2026-04-21T11:20:00", icon: "delivered" },
      ],
    },
    payment: {
      method: "Transfer Bank (BCA)",
      subtotal: 1200000,
      shipping_cost: 50000,
      discount: -50000,
      total: 1200000
    },
    timeline: {
      ordered_at: "2026-04-20T08:00:00",
      paid_at: "2026-04-20T08:30:00",
      confirmed_at: "2026-04-20T09:00:00",
      packed_at: "2026-04-20T12:00:00",
      shipped_at: "2026-04-20T14:15:00",
      delivered_at: "2026-04-21T11:20:00",
    },
  },
];
