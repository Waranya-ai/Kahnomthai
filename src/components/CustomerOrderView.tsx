import React, { useState } from 'react';
import { 
  Search, Plus, Minus, ShoppingBag, Utensils, Sparkles, X, 
  ChevronRight, Check, Clock, Info, ShieldCheck, Flame
} from 'lucide-react';
import { MenuItem, CartItem, Order, CategoryType, ToppingOption } from '../types';
import { DessertIllustration } from './DessertIllustrations';
import { PromptPayModal } from './PromptPayModal';
import { sounds } from '../utils/audio';

interface CustomerOrderViewProps {
  menuItems: MenuItem[];
  currentTable: string;
  onTableChange: (newTable: string) => void;
  activeOrders: Order[];
  onPlaceOrder: (order: Order) => void;
  onPaymentSuccess: (orderId: string, slipDetails: Order['slipDetails']) => void;
}

export const CustomerOrderView: React.FC<CustomerOrderViewProps> = ({
  menuItems,
  currentTable,
  onTableChange,
  activeOrders,
  onPlaceOrder,
  onPaymentSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  
  // Customization state
  const [selectedSweetness, setSelectedSweetness] = useState<'100%' | '50%' | '25%' | '0%'>('100%');
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [customerOrderNote, setCustomerOrderNote] = useState<string>('');

  // PromptPay Modal state
  const [pendingPromptPayOrder, setPendingPromptPayOrder] = useState<Order | null>(null);
  const [showOrderTracker, setShowOrderTracker] = useState<boolean>(false);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open customization modal
  const handleOpenCustomize = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCustomizingItem(item);
    setSelectedSweetness('100%');
    setSelectedToppings([]);
    setSpecialInstructions('');
    setQuantity(1);
  };

  const toggleTopping = (topping: ToppingOption) => {
    setSelectedToppings(prev => 
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleAddToCart = () => {
    if (!customizingItem) return;

    const toppingsTotal = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    const unitPriceWithToppings = customizingItem.price + toppingsTotal;
    const itemTotal = unitPriceWithToppings * quantity;

    const newCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      menuItemId: customizingItem.id,
      nameTh: customizingItem.nameTh,
      nameEn: customizingItem.nameEn,
      unitPrice: unitPriceWithToppings,
      quantity,
      sweetnessLevel: selectedSweetness,
      selectedToppings: [...selectedToppings],
      specialInstructions: specialInstructions.trim(),
      totalPrice: itemTotal,
    };

    setCart(prev => [...prev, newCartItem]);
    sounds.playAddToCart();
    setCustomizingItem(null);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Submit cart & generate order
  const handleProceedToPayment = () => {
    if (cart.length === 0) return;

    const orderNumber = `TH-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      tableNumber: currentTable,
      orderType,
      items: [...cart],
      subtotal: cartTotal,
      serviceFee: 0,
      totalAmount: cartTotal,
      status: 'pending_payment',
      paymentMethod: 'promptpay',
      paymentReference: `PP-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      customerNote: customerOrderNote.trim(),
    };

    onPlaceOrder(newOrder);
    setCart([]);
    setIsCartOpen(false);
    setPendingPromptPayOrder(newOrder);
  };

  // Find customer's active orders for this table
  const tableOrders = activeOrders.filter(o => o.tableNumber === currentTable);
  const latestOrder = tableOrders[tableOrders.length - 1];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Table Context Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-amber-200/90 font-medium">สั่งอาหารผ่าน QR Code</span>
            <span className="text-stone-400 text-xs">·</span>
            <span className="text-xs text-stone-300">ร้านเสน่ห์จันทน์ ขนมไทยชาววัง</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-serif-thai tracking-tight flex items-center gap-2">
            <span>สั่งของหวานประจำ:</span>
            <span className="text-amber-300 underline decoration-amber-500/50 underline-offset-4">{currentTable}</span>
          </h1>
          <p className="text-xs text-stone-300/80">
            เลือกขนมไทยโบราณสูตรต้นตำรับ สั่งง่าย จ่ายผ่านพร้อมเพย์ทันที ไม่ต้องรอนาน
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Table Switcher dropdown */}
          <div className="relative">
            <select
              value={currentTable}
              onChange={(e) => onTableChange(e.target.value)}
              className="bg-stone-800/90 text-stone-200 text-xs px-3 py-2 rounded-lg border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="โต๊ะ 1">เปลี่ยนเป็น โต๊ะ 1</option>
              <option value="โต๊ะ 2">เปลี่ยนเป็น โต๊ะ 2</option>
              <option value="โต๊ะ 3">เปลี่ยนเป็น โต๊ะ 3</option>
              <option value="โต๊ะ 4">เปลี่ยนเป็น โต๊ะ 4</option>
              <option value="โต๊ะ 5">เปลี่ยนเป็น โต๊ะ 5</option>
              <option value="โต๊ะ 6">เปลี่ยนเป็น โต๊ะ 6</option>
              <option value="โต๊ะริมสวน 1">เปลี่ยนเป็น โต๊ะริมสวน 1</option>
              <option value="กลับบ้าน (Takeaway)">เปลี่ยนเป็น สั่งกลับบ้าน</option>
            </select>
          </div>

          {/* Active order tracker button */}
          {tableOrders.length > 0 && (
            <button
              onClick={() => setShowOrderTracker(true)}
              className="px-3 py-2 bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5" />
              ติดตามออร์เดอร์ ({tableOrders.length})
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
        {/* Category Filter Buttons (Segmented Controls) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            เมนูทั้งหมด ({menuItems.length})
          </button>
          <button
            onClick={() => setSelectedCategory('auspicious')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'auspicious'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            ขนมมงคลตระกูลทอง
          </button>
          <button
            onClick={() => setSelectedCategory('coconut_warm')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'coconut_warm'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            กะทิสด & ขนมต้ม
          </button>
          <button
            onClick={() => setSelectedCategory('steamed_dry')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'steamed_dry'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            ขนมนึ่ง & ขนมแห้ง
          </button>
          <button
            onClick={() => setSelectedCategory('beverages')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'beverages'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            เครื่องดื่มสมุนไพร
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อขนม หรือวัตถุดิบ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 bg-stone-50/60"
          />
        </div>
      </div>

      {/* Product Cards Grid: Generous 3-column desktop layout */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Utensils className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800 font-serif-thai">ไม่พบเมนูขนมไทยที่ค้นหา</h3>
          <p className="text-xs text-stone-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นเพื่อดูรายการขนมทั้งหมด</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 text-xs font-medium bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
          >
            แสดงเมนูทั้งหมด
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                !item.isAvailable ? 'opacity-60 grayscale-[40%]' : ''
              }`}
            >
              {/* Product Visual (Takes 65% of top area) */}
              <div className="relative h-48 w-full overflow-hidden bg-stone-100 group">
                <DessertIllustration theme={item.illustrationTheme} title={item.nameTh} />
                
                {/* Quiet single highlight badge if present */}
                {item.badge && (
                  <div className="absolute top-2.5 left-2.5 text-[11px] font-medium text-amber-900 bg-white/95 px-2.5 py-0.5 rounded shadow-2xs backdrop-blur-xs">
                    {item.badge}
                  </div>
                )}

                {/* Preparation time */}
                <div className="absolute bottom-2 right-2 text-[10px] text-stone-700 bg-white/90 px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>ปรุงสด {item.preparationTimeMin} นาที</span>
                </div>

                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-md">
                      สินค้าหมดชั่วคราว
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <span>
                      {item.category === 'auspicious' && 'ขนมมงคล'}
                      {item.category === 'coconut_warm' && 'กะทิสด'}
                      {item.category === 'steamed_dry' && 'ขนมนึ่ง & อบ'}
                      {item.category === 'beverages' && 'เครื่องดื่ม'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>ขายแล้ว {item.salesCount} จาน</span>
                  </div>

                  <h3 className="text-base font-semibold text-stone-900 font-serif-thai leading-snug">
                    {item.nameTh}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono italic">
                    {item.nameEn}
                  </p>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Ingredients subtle line */}
                <div className="text-[11px] text-stone-500 flex flex-wrap gap-1">
                  {item.highlightIngredients.map((ing, i) => (
                    <span key={i} className="text-stone-500">
                      #{ing}{i < item.highlightIngredients.length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>

                {/* Card footer: Price & Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-base font-bold text-stone-900 tabular-nums">
                    ฿{item.price.toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleOpenCustomize(item)}
                    disabled={!item.isAvailable}
                    className="px-3 py-1.5 text-xs font-medium bg-amber-800 hover:bg-amber-900 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {item.sweetnessCustomizable || item.toppingsAvailable.length > 0 ? 'เลือกความหวาน' : 'เพิ่มลงตะกร้า'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Bottom Cart Bar (Sticky when cart has items) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-stone-900 text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center relative">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              </div>
              <div>
                <div className="text-xs text-stone-400">{currentTable} · {cart.length} รายการ</div>
                <div className="text-base font-bold text-amber-300 tabular-nums">
                  รวม ฿{cartTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>ดูตะกร้า / ชำระเงิน</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {customizingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-serif-thai font-bold text-base text-stone-900">{customizingItem.nameTh}</h3>
                <p className="text-xs text-stone-500">{customizingItem.nameEn} · ฿{customizingItem.price}</p>
              </div>
              <button
                onClick={() => setCustomizingItem(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Sweetness Selector */}
              {customizingItem.sweetnessCustomizable ? (
                <div>
                  <label className="font-semibold text-stone-800 block mb-2">เลือกระดับความหวาน (Sweetness Level)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { level: '100%', label: 'หวานปกติ (100%)' },
                      { level: '50%', label: 'หวานน้อย (50%)' },
                      { level: '25%', label: 'หวานเล็กน้อย (25%)' },
                      { level: '0%', label: 'ไม่หวาน (0%)' },
                    ].map(opt => (
                      <button
                        key={opt.level}
                        type="button"
                        onClick={() => setSelectedSweetness(opt.level as any)}
                        className={`p-2 rounded-lg text-center border transition-all text-xs ${
                          selectedSweetness === opt.level
                            ? 'border-amber-800 bg-amber-50 text-amber-900 font-medium'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-stone-50 rounded-lg text-stone-500 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>เมนูนี้ปรุงด้วยอัตราส่วนสูตรดั้งเดิม ไม่สามารถลดทอนความหวานได้</span>
                </div>
              )}

              {/* Toppings Options */}
              {customizingItem.toppingsAvailable.length > 0 && (
                <div>
                  <label className="font-semibold text-stone-800 block mb-2">ท็อปปิ้งเพิ่มเติม (Toppings)</label>
                  <div className="space-y-2">
                    {customizingItem.toppingsAvailable.map(topping => {
                      const isSelected = selectedToppings.some(t => t.id === topping.id);
                      return (
                        <div
                          key={topping.id}
                          onClick={() => toggleTopping(topping)}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-amber-700 bg-amber-50/50 text-amber-900'
                              : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isSelected ? 'bg-amber-800 border-amber-800 text-white' : 'border-stone-300'
                            }`}>
                              {isSelected && <Check className="w-3 h-3" />}
                            </div>
                            <span>{topping.nameTh}</span>
                          </div>
                          <span className="font-semibold tabular-nums">+฿{topping.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="font-semibold text-stone-800 block mb-1.5">ข้อความเพิ่มเติมถึงห้องครัว (Special Note)</label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="เช่น แยกน้ำแข็ง, ขอช้อนเพิ่ม 2 คัน..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-700"
                />
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-800">จำนวนที่ต้องการ</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 block">ราคารวมรายการนี้</span>
                <span className="text-lg font-bold text-stone-900 tabular-nums">
                  ฿{((customizingItem.price + selectedToppings.reduce((a, b) => a + b.price, 0)) * quantity).toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-medium text-xs shadow-xs transition-colors"
              >
                ใส่ลงในตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-800" />
                <h3 className="font-serif-thai font-bold text-base text-stone-900">ตะกร้าสั่งอาหาร ({currentTable})</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {cart.map(item => (
                <div key={item.id} className="p-3 bg-stone-50/80 rounded-xl border border-stone-200/70 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-xs text-stone-900">{item.nameTh}</h4>
                      <p className="text-[11px] text-stone-500 font-mono">฿{item.unitPrice} / ชิ้น</p>
                      
                      {/* Sweetness and Toppings details */}
                      <div className="text-[11px] text-amber-900/80 mt-1 space-y-0.5">
                        <div>ความหวาน: {item.sweetnessLevel}</div>
                        {item.selectedToppings.length > 0 && (
                          <div>ท็อปปิ้ง: {item.selectedToppings.map(t => t.nameTh).join(', ')}</div>
                        )}
                        {item.specialInstructions && (
                          <div className="italic text-stone-500">หมายเหตุ: {item.specialInstructions}</div>
                        )}
                      </div>
                    </div>

                    <span className="font-bold text-xs text-stone-900 tabular-nums">
                      ฿{item.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex justify-end items-center gap-2 pt-1 border-t border-stone-200/50">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs"
                    >
                      -
                    </button>
                    <span className="w-5 text-center text-xs font-semibold tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {/* Order options: Dine in vs Takeaway */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-medium text-stone-600 block">รูปแบบการรับประทาน</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                      orderType === 'dine_in'
                        ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    ทานที่ร้าน ({currentTable})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                      orderType === 'takeaway'
                        ? 'border-amber-800 bg-amber-50 text-amber-900 font-semibold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    ใส่กล่องกลับบ้าน
                  </button>
                </div>
              </div>

              {/* Order Note */}
              <div className="pt-1">
                <label className="text-xs font-medium text-stone-600 block mb-1">หมายเหตุสำหรับทั้งบิล</label>
                <input
                  type="text"
                  value={customerOrderNote}
                  onChange={(e) => setCustomerOrderNote(e.target.value)}
                  placeholder="เช่น มารับตอน 14:00 น. หรือ ขอแยกถุง..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Drawer Footer & Checkout Button */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>ยอดรวมค่าอาหาร</span>
                  <span className="tabular-nums">฿{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>ค่าบริการ (Service Charge)</span>
                  <span className="text-emerald-600 font-medium">ฟรี (฿0.00)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>ยอดสุทธิ</span>
                  <span className="tabular-nums text-amber-800">฿{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ชำระเงินผ่าน พร้อมเพย์ (PromptPay QR)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PromptPay Real-Time Payment Modal */}
      {pendingPromptPayOrder && (
        <PromptPayModal
          order={pendingPromptPayOrder}
          isOpen={!!pendingPromptPayOrder}
          onClose={() => setPendingPromptPayOrder(null)}
          onPaymentSuccess={(orderId, slipDetails) => {
            onPaymentSuccess(orderId, slipDetails);
            setPendingPromptPayOrder(null);
            setShowOrderTracker(true);
          }}
        />
      )}

      {/* Real-time Order Tracker Drawer */}
      {showOrderTracker && latestOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif-thai font-bold text-lg text-stone-900">
                  สถานะออร์เดอร์ #{latestOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">{latestOrder.tableNumber} · ชำระเงินเรียบร้อยแล้ว</p>
              </div>
              <button
                onClick={() => setShowOrderTracker(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Progress Stepper */}
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                <div className={`p-2 rounded-lg ${
                  latestOrder.status === 'paid_verifying' ? 'bg-amber-100 text-amber-900 font-bold ring-2 ring-amber-600' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  1. ยืนยันสลิป
                </div>
                <div className={`p-2 rounded-lg ${
                  latestOrder.status === 'preparing' ? 'bg-amber-100 text-amber-900 font-bold ring-2 ring-amber-600 animate-pulse' : 
                  ['ready', 'served'].includes(latestOrder.status) ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-400'
                }`}>
                  2. กำลังปรุงสด
                </div>
                <div className={`p-2 rounded-lg ${
                  latestOrder.status === 'ready' ? 'bg-emerald-100 text-emerald-900 font-bold ring-2 ring-emerald-600 animate-bounce' : 
                  latestOrder.status === 'served' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-400'
                }`}>
                  3. พร้อมเสิร์ฟ
                </div>
                <div className={`p-2 rounded-lg ${
                  latestOrder.status === 'served' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-100 text-stone-400'
                }`}>
                  4. เสิร์ฟเรียบร้อย
                </div>
              </div>

              {/* Status Message */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">
                    {latestOrder.status === 'paid_verifying' && 'ระบบกำลังตรวจสอบสลิปการโอนเงิน...'}
                    {latestOrder.status === 'preparing' && 'ห้องครัวกำลังจัดทำขนมหวานตามคำสั่ง...'}
                    {latestOrder.status === 'ready' && 'ขนมหวานพร้อมเสิร์ฟแล้ว พนักงานกำลังนำไปส่งที่โต๊ะ'}
                    {latestOrder.status === 'served' && 'ขนมหวานเสิร์ฟถึงโต๊ะเรียบร้อย ทานให้อร่อยนะคะ'}
                  </span>
                  <span className="text-amber-800 font-mono text-[11px]">โต๊ะ {latestOrder.tableNumber}</span>
                </div>

                <div className="border-t border-stone-200/60 pt-2 space-y-1">
                  {latestOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-stone-600 text-[11px]">
                      <span>{it.quantity}x {it.nameTh} ({it.sweetnessLevel})</span>
                      <span className="tabular-nums">฿{it.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200/40">
                    <span>ยอดสุทธิ</span>
                    <span className="tabular-nums">฿{latestOrder.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowOrderTracker(false)}
              className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
