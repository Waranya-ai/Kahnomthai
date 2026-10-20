import React, { useState } from 'react';
import { 
  ChefHat, Clock, CheckCircle, Printer, Volume2, VolumeX, 
  AlertCircle, Utensils, CheckCheck, Eye, X, ShieldCheck
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { sounds } from '../utils/audio';

interface KitchenOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const KitchenOrdersView: React.FC<KitchenOrdersViewProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'active') {
      return ['paid_verifying', 'preparing', 'ready'].includes(order.status);
    }
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const handleStatusAdvance = (order: Order) => {
    let nextStatus: OrderStatus = order.status;
    if (order.status === 'pending_payment' || order.status === 'paid_verifying') {
      nextStatus = 'preparing';
    } else if (order.status === 'preparing') {
      nextStatus = 'ready';
    } else if (order.status === 'ready') {
      nextStatus = 'served';
    }

    onUpdateOrderStatus(order.id, nextStatus);
    if (soundEnabled) {
      sounds.playKitchenNewOrder();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header with sound toggle and count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-serif-thai flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-amber-800" />
            จอคิวครัว & รายการทำขนมไทย (Kitchen Display System)
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>สถานะออร์เดอร์สด</span>
            <span aria-hidden="true">·</span>
            <span>ส่งตรงจาก QR Code ประจำโต๊ะ</span>
            <span aria-hidden="true">·</span>
            <span>รอทำ {orders.filter(o => ['paid_verifying', 'preparing'].includes(o.status)).length} ออร์เดอร์</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? 'เปิดเสียงเตือนออร์เดอร์ใหม่' : 'ปิดเสียงเตือน'}
          </button>
        </div>
      </div>

      {/* Filter Tabs (Segmented Buttons) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-stone-100 p-1 rounded-xl border border-stone-200/80 w-fit">
        <button
          onClick={() => setFilterStatus('active')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'active' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          คิวที่ต้องทำตอนนี้ ({orders.filter(o => ['paid_verifying', 'preparing', 'ready'].includes(o.status)).length})
        </button>
        <button
          onClick={() => setFilterStatus('paid_verifying')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'paid_verifying' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          รอตรวจสอบสลิป ({orders.filter(o => o.status === 'paid_verifying').length})
        </button>
        <button
          onClick={() => setFilterStatus('preparing')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'preparing' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          กำลังปรุงสด ({orders.filter(o => o.status === 'preparing').length})
        </button>
        <button
          onClick={() => setFilterStatus('ready')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'ready' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          พร้อมเสิร์ฟ ({orders.filter(o => o.status === 'ready').length})
        </button>
        <button
          onClick={() => setFilterStatus('served')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'served' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          เสิร์ฟแล้ว ({orders.filter(o => o.status === 'served').length})
        </button>
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            filterStatus === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          ทั้งหมด ({orders.length})
        </button>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3">
          <ChefHat className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="text-base font-semibold text-stone-800 font-serif-thai">ไม่มีรายการที่ต้องทำในหมวดนี้</h3>
          <p className="text-xs text-stone-500">เมื่อลูกค้าสแกนสั่งอาหารและชำระเงิน รายการจะแสดงขึ้นที่นี่ทันที</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-xl border flex flex-col justify-between shadow-xs overflow-hidden transition-all ${
                order.status === 'paid_verifying' ? 'border-amber-400 bg-amber-50/20' :
                order.status === 'preparing' ? 'border-amber-600' :
                order.status === 'ready' ? 'border-emerald-500' :
                'border-stone-200'
              }`}
            >
              {/* Order Card Header */}
              <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-stone-900 font-serif-thai">
                      #{order.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 text-white">
                      {order.tableNumber}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <span>{order.orderType === 'dine_in' ? 'ทานที่ร้าน' : 'ใส่กล่องกลับบ้าน'}</span>
                    <span>·</span>
                    <span className="font-mono text-stone-600">
                      {new Date(order.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedReceiptOrder(order)}
                    title="ดูใบเสร็จ / พิมพ์ใบสั่งครัว"
                    className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Order Items Body */}
              <div className="p-4 space-y-3 flex-1">
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs pb-2 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                            {item.quantity}
                          </span>
                          <span>{item.nameTh}</span>
                        </div>
                        <div className="text-[11px] text-stone-500 pl-6 space-y-0.5">
                          <div>ความหวาน: <span className="font-medium text-stone-700">{item.sweetnessLevel}</span></div>
                          {item.selectedToppings.length > 0 && (
                            <div>ท็อปปิ้ง: {item.selectedToppings.map(t => t.nameTh).join(', ')}</div>
                          )}
                          {item.specialInstructions && (
                            <div className="text-amber-800 font-medium">หมายเหตุ: {item.specialInstructions}</div>
                          )}
                        </div>
                      </div>

                      <span className="font-medium text-stone-700 tabular-nums">
                        ฿{item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer Global Note */}
                {order.customerNote && (
                  <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200/60">
                    <span className="font-semibold">ข้อความลูกค้า: </span>
                    {order.customerNote}
                  </div>
                )}

                {/* Payment Slip Summary */}
                {order.slipDetails && (
                  <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-[11px] text-stone-600 space-y-0.5">
                    <div className="flex justify-between items-center text-emerald-700 font-medium">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        PromptPay ยืนยันแล้ว
                      </span>
                      <span className="tabular-nums font-bold">฿{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {order.slipDetails.bankName} · {order.slipDetails.senderName}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Status Progression Button */}
              <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 tabular-nums">
                  รวม ฿{order.totalAmount.toFixed(2)}
                </span>

                {order.status === 'paid_verifying' && (
                  <button
                    onClick={() => handleStatusAdvance(order)}
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    เริ่มปรุง (Start Cooking)
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusAdvance(order)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    ปรุงเสร็จแล้ว แจ้งพร้อมเสิร์ฟ
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusAdvance(order)}
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    เสิร์ฟถึงโต๊ะแล้ว (Complete)
                  </button>
                )}

                {order.status === 'served' && (
                  <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    เสิร์ฟเรียบร้อย
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Thermal Receipt Modal */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-2">
              <span className="font-semibold text-xs text-stone-600">ใบสั่งครัว & เช็คบิล</span>
              <button onClick={() => setSelectedReceiptOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Thermal Receipt Style */}
            <div className="bg-[#fafaf9] border border-stone-300 p-4 font-mono text-xs text-stone-800 space-y-3 shadow-inner">
              <div className="text-center space-y-0.5 border-b border-stone-300 pb-2">
                <div className="font-bold font-serif-thai text-sm">ร้านเสน่ห์จันทน์ ขนมไทย</div>
                <div className="text-[10px] text-stone-500">โทร 02-984-2391 · สาขาเรือนไทย</div>
                <div className="text-[11px] font-bold mt-1">ใบสั่งทำขนมหวาน (KITCHEN TICKET)</div>
              </div>

              <div className="flex justify-between text-[11px]">
                <span>ออร์เดอร์: #{selectedReceiptOrder.orderNumber}</span>
                <span className="font-bold">{selectedReceiptOrder.tableNumber}</span>
              </div>
              <div className="text-[10px] text-stone-500">
                เวลา: {new Date(selectedReceiptOrder.createdAt).toLocaleString('th-TH')}
              </div>

              <div className="border-t border-b border-dashed border-stone-400 py-2 space-y-1.5">
                {selectedReceiptOrder.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px]">
                    <div>
                      <span>{it.quantity}x {it.nameTh}</span>
                      <div className="text-[10px] text-stone-500">
                        ({it.sweetnessLevel}{it.selectedToppings.length ? ` + ${it.selectedToppings.map(t=>t.nameTh).join(',')}` : ''})
                      </div>
                    </div>
                    <span>฿{it.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-xs">
                <div className="flex justify-between font-bold text-sm">
                  <span>ยอดสุทธิ (Net Total)</span>
                  <span>฿{selectedReceiptOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-stone-500">ชำระผ่าน PromptPay (เรียบร้อยแล้ว)</div>
              </div>

              <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-300">
                ขอบพระคุณที่อุดหนุนขนมไทยเสน่ห์จันทน์
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                พิมพ์ใบเสร็จ
              </button>
              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-xs font-medium hover:bg-stone-200"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
