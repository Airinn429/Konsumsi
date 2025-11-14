// src/lib/api.ts
// API helper functions untuk konsumsi orders

const API_BASE_URL = '/api/orders';

export interface OrderItem {
  jenisKonsumsi: string;
  qty: number;
  satuan: string;
  lokasiPengiriman: string;
  sesiWaktu: string;
  waktu: string;
}

export interface CreateOrderPayload {
  kegiatan: string;
  kegiatanLainnya?: string;
  tanggalPermintaan: string;
  tanggalPengiriman: string;
  untukBagian: string;
  yangMengajukan: string;
  noHp: string;
  namaApprover: string;
  tipeTamu?: string;
  keterangan?: string;
  createdBy: string;
  items: OrderItem[];
}

// Fetch all orders
export async function fetchOrders() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

// Create new order
export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }
  
  return response.json();
}

// Cancel order
export async function cancelOrder(orderId: string, alasanPembatalan: string) {
  const response = await fetch(`${API_BASE_URL}/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'Cancelled',
      tanggalPembatalan: new Date().toISOString(),
      alasanPembatalan,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to cancel order');
  }
  
  return response.json();
}
