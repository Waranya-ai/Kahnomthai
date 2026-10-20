import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, Award, Calendar, 
  Download, ArrowUpRight, BarChart3, PieChart, RefreshCw, FileSpreadsheet
} from 'lucide-react';
import { Order, MenuItem } from '../types';

interface OwnerDashboardProps {
  orders: Order[];
  menuItems: MenuItem[];
  onToggleAvailability: (itemId: string) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  orders,
  menuItems,
  onToggleAvailability,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week'>('today');
  const [activeHourlyBar, setActiveHourlyBar] = useState<number | null>(null);

  // Compute daily stats dynamically from orders
  const validOrders = orders.filter(o => o.status !== 'cancelled' && o.status !== 'pending_payment');
  
  // Calculate total revenue
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrdersCount = validOrders.length;
  const averageOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  
  // Total dessert items sold
  const totalItemsSold = validOrders.reduce((sum, o) => 
    sum + o.items.reduce((iSum, it) => iSum + it.quantity, 0), 0
  );

  // Hourly distribution for chart (10:00 to 20:00)
  const hourlySlots = [
    { hour: '10:00', orders: 4, revenue: 980 },
    { hour: '11:00', orders: 8, revenue: 2150 },
    { hour: '12:00', orders: 12, revenue: 3820 },
    { hour: '13:00', orders: 11, revenue: 3410 },
    { hour: '14:00', orders: 7, revenue: 1980 },
    { hour: '15:00', orders: 9, revenue: 2640 },
    { hour: '16:00', orders: 6, revenue: 1720 },
    { hour: '17:00', orders: 10, revenue: 2890 },
    { hour: '18:00', orders: 13, revenue: 4120 },
    { hour: '19:00', orders: 8, revenue: 2360 },
    { hour: '20:00', orders: 4, revenue: 1130 },
  ];

  // Category breakdown calculation
  const categoryTotals: { [key: string]: { labelTh: string; revenue: number; count: number } } = {
    auspicious: { labelTh: 'ขนมมงคลตระกูลทอง', revenue: 0, count: 0 },
    coconut_warm: { labelTh: 'กะทิสด & ขนมต้ม', revenue: 0, count: 0 },
    steamed_dry: { labelTh: 'ขนมนึ่ง & ขนมแห้ง', revenue: 0, count: 0 },
    beverages: { labelTh: 'เครื่องดื่มสมุนไพร', revenue: 0, count: 0 },
  };

  menuItems.forEach(item => {
    if (categoryTotals[item.category]) {
      categoryTotals[item.category].revenue += item.revenueGenerated;
      categoryTotals[item.category].count += item.salesCount;
    }
  });

  const totalCatRevenue = Object.values(categoryTotals).reduce((a, b) => a + b.revenue, 0) || 1;

  // Top-selling items sorted by count
  const sortedMenuItems = [...menuItems].sort((a, b) => b.salesCount - a.salesCount);
  const bestSeller = sortedMenuItems[0];

  // Export Daily Sales Report (CSV)
  const handleExportCSV = () => {
    const headers = ['OrderNumber', 'Table', 'Type', 'Amount', 'Status', 'PaymentMethod', 'Time', 'Items'];
    const rows = validOrders.map(o => [
      o.orderNumber,
      `"${o.tableNumber}"`,
      o.orderType,
      o.totalAmount,
      o.status,
      o.paymentMethod,
      `"${new Date(o.createdAt).toLocaleTimeString('th-TH')}"`,
      `"${o.items.map(it => `${it.nameTh} x${it.quantity}`).join('; ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SanehJaan_Daily_Sales_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxHourlyRevenue = Math.max(...hourlySlots.map(h => h.revenue));

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Dashboard Top Header Bar with zero-pill clean layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-serif-thai flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-800" />
            แดชบอร์ดสรุปยอดขายประจำวัน
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>ร้านเสน่ห์จันทน์ ขนมไทยชาววัง</span>
            <span aria-hidden="true">·</span>
            <span>วันที่ {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">อัปเดตข้อมูลแบบเรียลไทม์</span>
          </div>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-2">
          {/* Segmented Control for Time Range */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg border border-stone-200/80">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                timeRange === 'today' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              วันนี้ (Today)
            </button>
            <button
              onClick={() => setTimeRange('yesterday')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                timeRange === 'yesterday' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              เมื่อวานนี้
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                timeRange === 'week' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              7 วันล่าสุด
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            ดาวน์โหลดรายงาน CSV
          </button>
        </div>
      </div>

      {/* 4 Core KPI Cards (Single Elevation Depth) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">ยอดขายรวมวันนี้</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900 tabular-nums">
              ฿{totalRevenue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% จากเมื่อวาน (ยอดเติบโต)</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Completed Orders Count */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">จำนวนบิลที่สำเร็จ</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900 tabular-nums">
              {totalOrdersCount} <span className="text-sm font-normal text-stone-500">บิล</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1.5">
              <span>รวม {totalItemsSold} จานของหวาน</span>
              <span>·</span>
              <span className="text-emerald-700 font-medium">สแกน QR 100%</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Average Order Value */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">ยอดเฉลี่ยต่อบิล (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-stone-900 tabular-nums">
              ฿{averageOrderValue.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1.5">
              <span>เฉลี่ย 2.8 จานต่อโต๊ะ</span>
              <span>·</span>
              <span className="text-indigo-700 font-medium">ทานที่ร้าน 75%</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Best Seller Dish */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">เมนูขายดีอันดับหนึ่ง</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-base font-bold text-stone-900 truncate font-serif-thai">
              {bestSeller?.nameTh || 'ข้าวเหนียวมะม่วงอกร่องทอง'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1.5">
              <span className="font-semibold text-stone-900 tabular-nums">{bestSeller?.salesCount || 74} จาน</span>
              <span>·</span>
              <span className="tabular-nums text-amber-800 font-medium">฿{(bestSeller?.revenueGenerated || 8880).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Section: Interactive Hourly Sales Chart & Category Revenue Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Hourly Sales Distribution (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm text-stone-900 font-serif-thai">
                แนวโน้มยอดขายตามช่วงเวลา (Hourly Revenue Breakdown)
              </h3>
              <p className="text-xs text-stone-500">ยอดขายรายชั่วโมง ตั้งแต่ร้านเปิด 10:00 น. ถึง 20:00 น.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 block">ช่วงเวลาพีคที่สุด</span>
              <span className="text-xs font-bold text-amber-800">18:00 - 19:00 น. (฿4,120)</span>
            </div>
          </div>

          {/* SVG Bar Chart with Hover States */}
          <div className="relative pt-6 pb-2">
            <div className="h-52 flex items-end justify-between gap-2 px-2 border-b border-stone-200">
              {hourlySlots.map((slot, index) => {
                const heightPercent = Math.max(12, (slot.revenue / maxHourlyRevenue) * 100);
                const isHovered = activeHourlyBar === index;
                return (
                  <div
                    key={slot.hour}
                    onMouseEnter={() => setActiveHourlyBar(index)}
                    onMouseLeave={() => setActiveHourlyBar(null)}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-stone-900 text-white text-[11px] px-2.5 py-1 rounded-md shadow-lg pointer-events-none whitespace-nowrap animate-in fade-in">
                        <div className="font-bold tabular-nums">฿{slot.revenue.toLocaleString()}</div>
                        <div className="text-stone-300 text-[10px]">{slot.orders} ออร์เดอร์</div>
                      </div>
                    )}

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-sm transition-all duration-200 ${
                        isHovered
                          ? 'bg-amber-600'
                          : 'bg-gradient-to-t from-amber-800/80 to-amber-700/60 hover:bg-amber-700'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] text-stone-400 mt-2 px-1 font-mono">
              {hourlySlots.map(slot => (
                <span key={slot.hour} className="text-center flex-1">{slot.hour}</span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>* รวมเฉพาะยอดขายที่ยืนยันการชำระเงินผ่านระบบ PromptPay</span>
            <span className="tabular-nums font-mono">Total Tracked: ฿{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Right: Category Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm text-stone-900 font-serif-thai mb-1">
              สัดส่วนยอดขายตามหมวดหมู่
            </h3>
            <p className="text-xs text-stone-500 mb-4">วิเคราะห์ความนิยมขนมไทยแต่ละประเภท</p>

            <div className="space-y-4">
              {Object.entries(categoryTotals).map(([key, data]) => {
                const percent = Math.round((data.revenue / totalCatRevenue) * 100);
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800">{data.labelTh}</span>
                      <span className="font-bold text-stone-900 tabular-nums">
                        {percent}% <span className="text-[11px] font-normal text-stone-400">(฿{data.revenue.toLocaleString()})</span>
                      </span>
                    </div>
                    {/* Clean Progress Bar */}
                    <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className={`h-full rounded-full ${
                          key === 'auspicious' ? 'bg-amber-600' :
                          key === 'coconut_warm' ? 'bg-emerald-600' :
                          key === 'steamed_dry' ? 'bg-stone-700' : 'bg-indigo-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
            <div className="flex justify-between">
              <span>หมวดที่ขายดีสุด:</span>
              <span className="font-semibold text-stone-800">กะทิสด & ขนมต้ม</span>
            </div>
            <div className="flex justify-between">
              <span>กำไรขั้นต้นเฉลี่ย:</span>
              <span className="font-semibold text-emerald-700">68.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Top-Selling Desserts Leaderboard Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-base text-stone-900 font-serif-thai">
              อันดับเมนูขนมไทยขายดี & จัดการสต็อกแบบเรียลไทม์
            </h3>
            <p className="text-xs text-stone-500">
              กดสลับสวิตช์สถานะสต็อกเพื่อเปิด/ปิดการสั่งซื้อในหน้าลูกค้าทันที
            </p>
          </div>
          <span className="text-xs text-stone-400 tabular-nums">
            แสดง {sortedMenuItems.length} รายการ
          </span>
        </div>

        {/* Dense, High-legibility Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase font-mono tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">อันดับ</th>
                <th className="py-3 px-4">ชื่อเมนูขนมไทย</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-right">ราคาต่อจาน</th>
                <th className="py-3 px-4 text-right">ยอดขาย (จาน)</th>
                <th className="py-3 px-4 text-right">ยอดรวม (บาท)</th>
                <th className="py-3 px-4 text-center">สถานะสต็อก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedMenuItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Rank */}
                  <td className="py-3 px-4 text-center font-bold text-stone-700 tabular-nums">
                    {index === 0 && <span className="text-amber-600">🥇 1</span>}
                    {index === 1 && <span className="text-stone-500">🥈 2</span>}
                    {index === 2 && <span className="text-amber-800">🥉 3</span>}
                    {index > 2 && index + 1}
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900 font-serif-thai">{item.nameTh}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{item.nameEn}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-stone-600">
                    {item.category === 'auspicious' && 'ขนมมงคลตระกูลทอง'}
                    {item.category === 'coconut_warm' && 'กะทิสด & ขนมต้ม'}
                    {item.category === 'steamed_dry' && 'ขนมนึ่ง & ขนมแห้ง'}
                    {item.category === 'beverages' && 'เครื่องดื่มสมุนไพร'}
                  </td>

                  {/* Unit Price */}
                  <td className="py-3 px-4 text-right font-medium text-stone-800 tabular-nums">
                    ฿{item.price.toFixed(2)}
                  </td>

                  {/* Sales Count */}
                  <td className="py-3 px-4 text-right font-bold text-stone-900 tabular-nums">
                    {item.salesCount}
                  </td>

                  {/* Total Revenue */}
                  <td className="py-3 px-4 text-right font-bold text-amber-800 tabular-nums">
                    ฿{item.revenueGenerated.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </td>

                  {/* In-Stock Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onToggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      {item.isAvailable ? 'พร้อมจำหน่าย' : 'ของหมด (Out)'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
