import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, BarChart3, ChefHat, QrCode, BookOpen, 
  Sparkles, Bell, ArrowRightLeft, ShieldCheck, ChevronRight
} from 'lucide-react';
import { MenuItem, Order, OrderStatus } from './types';
import { INITIAL_MENU_ITEMS, INITIAL_ORDERS } from './data/initialData';
import { CustomerOrderView } from './components/CustomerOrderView';
import { OwnerDashboard } from './components/OwnerDashboard';
import { KitchenOrdersView } from './components/KitchenOrdersView';
import { TableQRGenerator } from './components/TableQRGenerator';
import { MenuManagementView } from './components/MenuManagementView';
import { sounds } from './utils/audio';

type ActiveView = 'customer_order' | 'owner_dashboard' | 'kitchen_kds' | 'table_qr' | 'menu_manager';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('customer_order');
  const [currentTable, setCurrentTable] = useState<string>('โต๊ะ 3');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sanehjaan_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sanehjaan_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Check URL query parameters for table e.g. ?table=โต๊ะ%201
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tableParam = urlParams.get('table');
      if (tableParam) {
        setCurrentTable(tableParam);
        setActiveView('customer_order');
      }
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('sanehjaan_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('sanehjaan_orders', JSON.stringify(orders));
  }, [orders]);

  // Place order from customer view
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Also update item sales counts
    setMenuItems(prev => 
      prev.map(item => {
        const orderItem = newOrder.items.find(it => it.menuItemId === item.id);
        if (orderItem) {
          return {
            ...item,
            salesCount: item.salesCount + orderItem.quantity,
            revenueGenerated: item.revenueGenerated + orderItem.totalPrice,
          };
        }
        return item;
      })
    );
  };

  // Payment success handler (real-time PromptPay verification)
  const handlePaymentSuccess = (orderId: string, slipDetails: Order['slipDetails']) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'preparing', // Auto moves to preparing for kitchen
            paidAt: new Date().toISOString(),
            slipDetails,
          };
        }
        return order;
      })
    );

    // Play chime for kitchen
    sounds.playKitchenNewOrder();
  };

  // Update order status in kitchen
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            completedAt: newStatus === 'served' ? new Date().toISOString() : order.completedAt,
          };
        }
        return order;
      })
    );
  };

  // Menu items CRUD
  const handleAddItem = (newItem: MenuItem) => {
    setMenuItems(prev => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item)
    );
  };

  const handleOpenCustomerViewForTable = (tableNumber: string) => {
    setCurrentTable(tableNumber);
    setActiveView('customer_order');
  };

  // Active kitchen queue count
  const activeKitchenCount = orders.filter(o => ['paid_verifying', 'preparing'].includes(o.status)).length;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 flex flex-col font-thai selection:bg-amber-200 selection:text-amber-950">
      
      {/* 
        Top Bar conforming strictly to Top Bar Contract:
        [Brand title, one line] — [4–5 nav links, 1–2 word labels, single-line] — [1 primary action]
      */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveView('customer_order')}
              className="text-left group cursor-pointer"
            >
              <div className="text-xl font-bold tracking-tight text-amber-950 font-serif-thai whitespace-nowrap flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 group-hover:scale-125 transition-transform" />
                เสน่ห์จันทน์
              </div>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
            <button
              onClick={() => setActiveView('customer_order')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 cursor-pointer ${
                activeView === 'customer_order' ? 'text-amber-900 font-semibold border-b-2 border-amber-800' : ''
              }`}
            >
              สั่งอาหารประจำโต๊ะ
            </button>

            <button
              onClick={() => setActiveView('owner_dashboard')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 cursor-pointer ${
                activeView === 'owner_dashboard' ? 'text-amber-900 font-semibold border-b-2 border-amber-800' : ''
              }`}
            >
              แดชบอร์ดสรุปยอดขาย
            </button>

            <button
              onClick={() => setActiveView('kitchen_kds')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer ${
                activeView === 'kitchen_kds' ? 'text-amber-900 font-semibold border-b-2 border-amber-800' : ''
              }`}
            >
              <span>จอคิวครัว</span>
              {activeKitchenCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                  {activeKitchenCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('table_qr')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 cursor-pointer ${
                activeView === 'table_qr' ? 'text-amber-900 font-semibold border-b-2 border-amber-800' : ''
              }`}
            >
              พิมพ์ป้าย QR โต๊ะ
            </button>

            <button
              onClick={() => setActiveView('menu_manager')}
              className={`py-1 transition-colors whitespace-nowrap shrink-0 hover:text-amber-900 cursor-pointer ${
                activeView === 'menu_manager' ? 'text-amber-900 font-semibold border-b-2 border-amber-800' : ''
              }`}
            >
              จัดการเมนู & สต็อก
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView(activeView === 'customer_order' ? 'owner_dashboard' : 'customer_order');
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeView === 'customer_order' ? 'เข้าสู่โหมดเจ้าของร้าน' : 'มุมมองลูกค้าสั่งอาหาร'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden border-t border-stone-100 px-3 py-2 flex items-center gap-1 overflow-x-auto scrollbar-none text-[11px]">
          <button
            onClick={() => setActiveView('customer_order')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'customer_order' ? 'bg-amber-800 text-white font-medium' : 'text-stone-600'}`}
          >
            สั่งที่โต๊ะ
          </button>
          <button
            onClick={() => setActiveView('owner_dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'owner_dashboard' ? 'bg-amber-800 text-white font-medium' : 'text-stone-600'}`}
          >
            แดชบอร์ด
          </button>
          <button
            onClick={() => setActiveView('kitchen_kds')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${activeView === 'kitchen_kds' ? 'bg-amber-800 text-white font-medium' : 'text-stone-600'}`}
          >
            <span>จอครัว</span>
            {activeKitchenCount > 0 && (
              <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                {activeKitchenCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveView('table_qr')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'table_qr' ? 'bg-amber-800 text-white font-medium' : 'text-stone-600'}`}
          >
            QR โต๊ะ
          </button>
          <button
            onClick={() => setActiveView('menu_manager')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${activeView === 'menu_manager' ? 'bg-amber-800 text-white font-medium' : 'text-stone-600'}`}
          >
            จัดการเมนู
          </button>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeView === 'customer_order' && (
          <CustomerOrderView
            menuItems={menuItems}
            currentTable={currentTable}
            onTableChange={setCurrentTable}
            activeOrders={orders}
            onPlaceOrder={handlePlaceOrder}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}

        {activeView === 'owner_dashboard' && (
          <OwnerDashboard
            orders={orders}
            menuItems={menuItems}
            onToggleAvailability={handleToggleAvailability}
          />
        )}

        {activeView === 'kitchen_kds' && (
          <KitchenOrdersView
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeView === 'table_qr' && (
          <TableQRGenerator
            onOpenCustomerViewForTable={handleOpenCustomerViewForTable}
          />
        )}

        {activeView === 'menu_manager' && (
          <MenuManagementView
            menuItems={menuItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
          />
        )}
      </main>

      {/* Footer conforming strictly to Universal Constitution (no fake versioning or buzzword tickers) */}
      <footer className="border-t border-stone-200/80 bg-white py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif-thai font-semibold text-stone-900">เสน่ห์จันทน์ ขนมไทยชาววัง</span>
            <span aria-hidden="true">·</span>
            <span>ระบบสั่งอาหารผ่าน QR Code & ชำระเงินออนไลน์แบบเรียลไทม์</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>มาตรฐาน PromptPay QR</span>
            <span>·</span>
            <span>รายงานยอดขายรายวัน</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
