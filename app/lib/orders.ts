export const DUMMY_ORDERS = [
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
      courier: "JNE Express",
      receipt: "JN-88192837482",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "QRIS",
      subtotal: 3450000,
      shipping_cost: 0,
      discount: 0,
      total: 3450000
    }
  },
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
      courier: "Sicepat Halu",
      receipt: "SC-99120038812",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "Transfer Bank (BCA)",
      subtotal: 1200000,
      shipping_cost: 50000,
      discount: -50000,
      total: 1200000
    }
  },
  {
    id: "TRF-223190",
    status: "Belum Bayar",
    date: "7 Mei 2026",
    total: 450000,
    store: "TrailForge Official",
    items: [
      { id: "104", name: "Polaris Compass Pro", variant: "Default", qty: 1, price: 450000, image: "https://images.unsplash.com/photo-1504376830547-506dedee1643?w=600&q=80" }
    ],
    shipping: {
      courier: "J&T Reguler",
      receipt: "-",
      address: "Alex Mercer\nJl. Jendral Sudirman No. 45, Tower A, Lantai 12\nSudirman Central Business District (SCBD)\nKebayoran Baru, Jakarta Selatan, 12190\n(+62) 812-3456-7890"
    },
    payment: {
      method: "GoPay",
      subtotal: 450000,
      shipping_cost: 15000,
      discount: 0,
      total: 465000
    }
  }
];
