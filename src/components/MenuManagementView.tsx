import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Check, X, Search, Sparkles, 
  Utensils, Clock, DollarSign, Tag, AlertCircle 
} from 'lucide-react';
import { MenuItem, CategoryType } from '../types';
import { DessertIllustration } from './DessertIllustrations';

interface MenuManagementViewProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleAvailability: (itemId: string) => void;
}

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({
  menuItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleAvailability,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [formNameTh, setFormNameTh] = useState<string>('');
  const [formNameEn, setFormNameEn] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formCategory, setFormCategory] = useState<CategoryType>('auspicious');
  const [formPrice, setFormPrice] = useState<number>(65);
  const [formPrepTime, setFormPrepTime] = useState<number>(3);
  const [formSweetnessCustom, setFormSweetnessCustom] = useState<boolean>(true);
  const [formBadge, setFormBadge] = useState<string>('');
  const [formIngredients, setFormIngredients] = useState<string>('แป้งข้าวเหนียว, กะทิคั้นสด, น้ำตาลมะพร้าว');
  const [formTheme, setFormTheme] = useState<MenuItem['illustrationTheme']>('gold_sweets');

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.nameTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormNameTh('');
    setFormNameEn('');
    setFormDescription('');
    setFormCategory('auspicious');
    setFormPrice(65);
    setFormPrepTime(3);
    setFormSweetnessCustom(true);
    setFormBadge('');
    setFormIngredients('แป้งข้าวเหนียว, กะทิคั้นสด, น้ำตาลมะพร้าว');
    setFormTheme('gold_sweets');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormNameTh(item.nameTh);
    setFormNameEn(item.nameEn);
    setFormDescription(item.description);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormPrepTime(item.preparationTimeMin);
    setFormSweetnessCustom(item.sweetnessCustomizable);
    setFormBadge(item.badge || '');
    setFormIngredients(item.highlightIngredients.join(', '));
    setFormTheme(item.illustrationTheme);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNameTh.trim()) return;

    const ingredientsList = formIngredients
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        nameTh: formNameTh.trim(),
        nameEn: formNameEn.trim() || formNameTh.trim(),
        description: formDescription.trim(),
        category: formCategory,
        price: Number(formPrice),
        preparationTimeMin: Number(formPrepTime),
        sweetnessCustomizable: formSweetnessCustom,
        badge: formBadge.trim() || undefined,
        highlightIngredients: ingredientsList,
        illustrationTheme: formTheme,
      };
      onUpdateItem(updated);
    } else {
      const newItem: MenuItem = {
        id: `dessert-${Date.now()}`,
        nameTh: formNameTh.trim(),
        nameEn: formNameEn.trim() || formNameTh.trim(),
        description: formDescription.trim(),
        category: formCategory,
        price: Number(formPrice),
        isAvailable: true,
        preparationTimeMin: Number(formPrepTime),
        sweetnessCustomizable: formSweetnessCustom,
        toppingsAvailable: [],
        badge: formBadge.trim() || undefined,
        salesCount: 0,
        revenueGenerated: 0,
        highlightIngredients: ingredientsList,
        illustrationTheme: formTheme,
      };
      onAddItem(newItem);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-serif-thai flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-800" />
            ระบบจัดการเมนูร้านขนมไทย (Menu Inventory)
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>จัดการราคา</span>
            <span aria-hidden="true">·</span>
            <span>เปิด/ปิดสต็อกทันที</span>
            <span aria-hidden="true">·</span>
            <span>ทั้งหมด {menuItems.length} รายการ</span>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          เพิ่มเมนูขนมไทยใหม่
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'all' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ทั้งหมด ({menuItems.length})
          </button>
          <button
            onClick={() => setSelectedCategory('auspicious')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'auspicious' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ขนมมงคล
          </button>
          <button
            onClick={() => setSelectedCategory('coconut_warm')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'coconut_warm' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            กะทิสด & ต้ม
          </button>
          <button
            onClick={() => setSelectedCategory('steamed_dry')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'steamed_dry' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            ขนมนึ่ง & อบ
          </button>
          <button
            onClick={() => setSelectedCategory('beverages')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === 'beverages' ? 'bg-amber-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            เครื่องดื่ม
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อขนม..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700 bg-stone-50/60"
          />
        </div>
      </div>

      {/* Menu List Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 uppercase font-mono tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-16">รูปทรง</th>
                <th className="py-3 px-4">ชื่อเมนูขนมไทย</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-right">ราคา</th>
                <th className="py-3 px-4 text-center">เวลาเตรียม</th>
                <th className="py-3 px-4 text-center">ปรับความหวานได้</th>
                <th className="py-3 px-4 text-center">สถานะสต็อก</th>
                <th className="py-3 px-4 text-center w-24">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  {/* Thumbnail */}
                  <td className="py-2.5 px-4">
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-stone-200 shadow-2xs">
                      <DessertIllustration theme={item.illustrationTheme} title={item.nameTh} />
                    </div>
                  </td>

                  {/* Name & Desc */}
                  <td className="py-2.5 px-4 max-w-xs">
                    <div className="font-semibold text-stone-900 font-serif-thai">{item.nameTh}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{item.nameEn}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.description}</div>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-4 text-stone-600">
                    {item.category === 'auspicious' && 'ขนมมงคลตระกูลทอง'}
                    {item.category === 'coconut_warm' && 'กะทิสด & ขนมต้ม'}
                    {item.category === 'steamed_dry' && 'ขนมนึ่ง & ขนมแห้ง'}
                    {item.category === 'beverages' && 'เครื่องดื่มสมุนไพร'}
                  </td>

                  {/* Price */}
                  <td className="py-2.5 px-4 text-right font-bold text-stone-900 tabular-nums">
                    ฿{item.price.toFixed(2)}
                  </td>

                  {/* Prep time */}
                  <td className="py-2.5 px-4 text-center text-stone-600 tabular-nums">
                    {item.preparationTimeMin} นาที
                  </td>

                  {/* Sweetness */}
                  <td className="py-2.5 px-4 text-center">
                    {item.sweetnessCustomizable ? (
                      <span className="text-emerald-700 font-medium text-[11px]">ปรับได้ 4 ระดับ</span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">สูตรคงที่</span>
                    )}
                  </td>

                  {/* Availability toggle */}
                  <td className="py-2.5 px-4 text-center">
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

                  {/* Actions */}
                  <td className="py-2.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`คุณต้องการลบเมนู "${item.nameTh}" หรือไม่?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="ลบเมนู"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Menu Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-serif-thai font-bold text-base text-stone-900">
                {editingItem ? 'แก้ไขเมนูขนมไทย' : 'เพิ่มเมนูขนมไทยใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">ชื่อขนมภาษาไทย *</label>
                  <input
                    type="text"
                    required
                    value={formNameTh}
                    onChange={(e) => setFormNameTh(e.target.value)}
                    placeholder="เช่น ขนมกล้วยบวชชีมะพร้าวอ่อน"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-stone-700 block mb-1">ชื่อภาษาอังกฤษ</label>
                  <input
                    type="text"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. Banana in Coconut Milk"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">คำอธิบายเมนู & รสชาติ *</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="อธิบายเอกลักษณ์ กรรมวิธี ความหอม หรือความโบราณของขนม..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">หมวดหมู่</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                    className="w-full px-2 py-2 border border-stone-200 rounded-lg bg-white"
                  >
                    <option value="auspicious">ขนมมงคลตระกูลทอง</option>
                    <option value="coconut_warm">กะทิสด & ต้ม</option>
                    <option value="steamed_dry">ขนมนึ่ง & อบ</option>
                    <option value="beverages">เครื่องดื่มสมุนไพร</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">ราคา (บาท) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg tabular-nums"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">เวลาทำ (นาที)</label>
                  <input
                    type="number"
                    min="1"
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">แท็กป้ายกำกับ (Badge)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="เช่น ซิกเนเจอร์, ขายดี"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">สไตล์ภาพประกอบ (SVG Theme)</label>
                  <select
                    value={formTheme}
                    onChange={(e) => setFormTheme(e.target.value as any)}
                    className="w-full px-2 py-2 border border-stone-200 rounded-lg bg-white"
                  >
                    <option value="gold_sweets">ตระกูลทอง / จานทองเหลือง</option>
                    <option value="bualoy">ถ้วยบัวลอยเซลาดอน</option>
                    <option value="mango_rice">ข้าวเหนียวมะม่วง / ใบตอง</option>
                    <option value="khanom_chan">ขนมชั้นดอกบัววิจิตร</option>
                    <option value="lod_chong">ลอดช่องน้ำตาลโตนด</option>
                    <option value="taptim">ทับทิมกรอบสีชาด</option>
                    <option value="piek_poon">เปียกปูนเขียวมรกต</option>
                    <option value="mo_kaeng">หม้อแกงอบหอมเจียว</option>
                    <option value="herbal_drink">แก้วน้ำสมุนไพรเย็นฉ่ำ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">วัตถุดิบเด่น (คั่นด้วยเครื่องหมายจุลภาค ,)</label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="แป้งข้าวเหนียว, กะทิคั้นสด, ใบเตยหอม"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="customSweetness"
                  checked={formSweetnessCustom}
                  onChange={(e) => setFormSweetnessCustom(e.target.checked)}
                  className="rounded text-amber-800 focus:ring-amber-700 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="customSweetness" className="font-medium text-stone-700 cursor-pointer">
                  อนุญาตให้ลูกค้าระบุระดับความหวานได้ (หวานปกติ / หวานน้อย 50% / 25% / 0%)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-medium shadow-xs"
                >
                  {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
