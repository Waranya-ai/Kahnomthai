export type CategoryType = 'all' | 'auspicious' | 'coconut_warm' | 'steamed_dry' | 'beverages';

export interface ToppingOption {
  id: string;
  nameTh: string;
  price: number;
}

export interface MenuItem {
  id: string;
  nameTh: string;
  nameEn: string;
  description: string;
  category: CategoryType;
  price: number;
  isAvailable: boolean;
  preparationTimeMin: number;
  sweetnessCustomizable: boolean;
  toppingsAvailable: ToppingOption[];
  badge?: string;
  salesCount: number;
  revenueGenerated: number;
  highlightIngredients: string[];
  illustrationTheme: 'gold_sweets' | 'bualoy' | 'mango_rice' | 'khanom_chan' | 'lod_chong' | 'taptim' | 'mo_kaeng' | 'piek_poon' | 'herbal_drink';
}

export interface CartItem {
  id: string;
  menuItemId: string;
  nameTh: string;
  nameEn: string;
  unitPrice: number;
  quantity: number;
  sweetnessLevel: '100%' | '50%' | '25%' | '0%';
  selectedToppings: ToppingOption[];
  specialInstructions: string;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending_payment'      // รอชำระเงิน
  | 'paid_verifying'       // แนบสลิป/รอตรวจสอบ
  | 'preparing'            // ครัวกำลังปรุง
  | 'ready'                // อาหารพร้อมเสิร์ฟ
  | 'served'               // เสิร์ฟแล้ว/เสร็จสิ้น
  | 'cancelled';           // ยกเลิก

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string; // e.g. "โต๊ะ 1", "โต๊ะ 3", "กลับบ้าน (Takeaway)"
  orderType: 'dine_in' | 'takeaway';
  items: CartItem[];
  subtotal: number;
  serviceFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'promptpay' | 'cash';
  paymentReference?: string;
  paidAt?: string;
  createdAt: string;
  completedAt?: string;
  customerNote?: string;
  slipDetails?: {
    bankName: string;
    senderName: string;
    transRef: string;
    amount: number;
    timestamp: string;
  };
}

export interface DailySalesSummary {
  date: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalItemsSold: number;
  hourlySales: { hour: string; revenue: number; ordersCount: number }[];
  categoryBreakdown: { category: string; labelTh: string; revenue: number; percentage: number }[];
  topSellingItems: { nameTh: string; count: number; revenue: number; category: string }[];
}
