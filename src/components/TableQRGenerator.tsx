import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QrCode, Printer, ExternalLink, Check, Copy, UtensilsCrossed, Sparkles } from 'lucide-react';

interface TableQRGeneratorProps {
  onOpenCustomerViewForTable: (tableNumber: string) => void;
}

const DEFAULT_TABLES = [
  'โต๊ะ 1', 'โต๊ะ 2', 'โต๊ะ 3', 'โต๊ะ 4',
  'โต๊ะ 5', 'โต๊ะ 6', 'โต๊ะ 7', 'โต๊ะ 8',
  'โต๊ะริมสวน 1', 'โต๊ะริมสวน 2', 'บาร์ขนมไทย', 'กลับบ้าน (Takeaway)'
];

export const TableQRGenerator: React.FC<TableQRGeneratorProps> = ({ onOpenCustomerViewForTable }) => {
  const [selectedTable, setSelectedTable] = useState<string>('โต๊ะ 1');
  const [customTableInput, setCustomTableInput] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [allQrs, setAllQrs] = useState<{ [table: string]: string }>({});

  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://sanehjaan-thai-sweets.app';
  const tableOrderUrl = `${baseUrl}?table=${encodeURIComponent(selectedTable)}`;

  // Generate single table QR
  useEffect(() => {
    QRCode.toDataURL(tableOrderUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Failed to generate QR:', err);
    });
  }, [tableOrderUrl]);

  // Generate batch QRs for all standard tables
  useEffect(() => {
    if (batchMode) {
      const qrs: { [table: string]: string } = {};
      Promise.all(
        DEFAULT_TABLES.map(tbl => {
          const url = `${baseUrl}?table=${encodeURIComponent(tbl)}`;
          return QRCode.toDataURL(url, {
            width: 200,
            margin: 1,
            color: { dark: '#1c1917', light: '#ffffff' }
          }).then(qr => {
            qrs[tbl] = qr;
          });
        })
      ).then(() => {
        setAllQrs(qrs);
      });
    }
  }, [batchMode, baseUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(tableOrderUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustomTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTableInput.trim()) return;
    setSelectedTable(customTableInput.trim());
    setCustomTableInput('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header section with clean unboxed metadata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-900 font-serif-thai flex items-center gap-2">
            <QrCode className="w-6 h-6 text-amber-700" />
            ระบบสร้าง QR Code สั่งอาหารประจำโต๊ะ
          </h2>
          <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
            <span>พิมพ์ป้ายตั้งโต๊ะ</span>
            <span aria-hidden="true">·</span>
            <span>สแกนกล้องมือถือสั่งอัตโนมัติ</span>
            <span aria-hidden="true">·</span>
            <span>ไม่ต้องโหลดแอปพลิเคชัน</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchMode(!batchMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              batchMode ? 'bg-amber-800 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {batchMode ? 'กลับสู่โหมดโต๊ะเดี่ยว' : 'แสดงป้าย QR ครบทุกโต๊ะ (Batch View)'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            สั่งพิมพ์ป้ายตั้งโต๊ะ
          </button>
        </div>
      </div>

      {!batchMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Table selector & link settings */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-xs space-y-5">
              <div>
                <label className="text-xs font-medium text-stone-500 block mb-2">เลือกโต๊ะที่ต้องการสร้างป้าย QR</label>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_TABLES.map(table => (
                    <button
                      key={table}
                      onClick={() => setSelectedTable(table)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg transition-all text-center whitespace-nowrap truncate ${
                        selectedTable === table
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200/60'
                      }`}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom table input */}
              <form onSubmit={handleAddCustomTable} className="pt-2 border-t border-stone-100">
                <label className="text-xs font-medium text-stone-500 block mb-1.5">หรือระบุชื่อโต๊ะ / โซนที่ต้องการ</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTableInput}
                    onChange={(e) => setCustomTableInput(e.target.value)}
                    placeholder="เช่น โต๊ะ VIP 1, โต๊ะชั้นสอง..."
                    className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 bg-stone-50/50"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium bg-stone-800 text-white rounded-lg hover:bg-stone-700 whitespace-nowrap"
                  >
                    ตั้งค่า
                  </button>
                </div>
              </form>

              {/* Live URL info */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-500">ลิงก์สั่งอาหารของโต๊ะนี้</span>
                  <button
                    onClick={handleCopyLink}
                    className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}
                  </button>
                </div>
                <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200/60 text-xs font-mono text-stone-600 break-all select-all">
                  {tableOrderUrl}
                </div>
              </div>

              {/* Action Button: Test Order as Customer */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenCustomerViewForTable(selectedTable)}
                  className="w-full py-2.5 px-4 text-xs font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  จำลองการเปิดลิงก์สั่งอาหารของ {selectedTable}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick tips */}
            <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-4 text-xs text-amber-900/80 space-y-1.5">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                ข้อดีของการสั่งอาหารผ่าน QR Code เสน่ห์จันทน์
              </div>
              <p>1. ลูกค้าไม่ต้องรอบริกร สามารถดูรูปภาพขนมไทย วัตถุดิบ และเลือกความหวานได้เอง</p>
              <p>2. สแกนแล้วออร์เดอร์ส่งตรงไปยังจอครัว (Kitchen Display) ทันทีหลังยืนยันการชำระเงิน</p>
              <p>3. ลดข้อผิดพลาดในการรับรายการอาหาร และเช็คบิลได้รวดเร็วแบบเรียลไทม์</p>
            </div>
          </div>

          {/* Right panel: Printable Royal Thai Table Tent Card Preview */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <span className="text-xs font-medium text-stone-500 mb-2">ตัวอย่างป้ายตั้งโต๊ะอะคริลิก / พิมพ์ตั้งบนโต๊ะจริง (A5 / Table Stand)</span>
            
            {/* The Print Card Container */}
            <div className="w-full max-w-sm bg-gradient-to-b from-[#faf6ee] to-[#fffdfa] border-2 border-amber-800/40 rounded-2xl p-7 shadow-lg relative text-center flex flex-col items-center">
              {/* Decorative Thai corner accents */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-amber-700" />
              <div className="absolute top-2.5 right-2.5 w-6 h-6 border-t-2 border-r-2 border-amber-700" />
              <div className="absolute bottom-2.5 left-2.5 w-6 h-6 border-b-2 border-l-2 border-amber-700" />
              <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-amber-700" />

              {/* Brand Lockup */}
              <div className="space-y-0.5 mb-2">
                <span className="text-[10px] tracking-widest text-amber-800 uppercase font-medium">Royal Thai Dessert Heritage</span>
                <h3 className="text-xl font-bold text-stone-900 font-serif-thai">ร้านเสน่ห์จันทน์</h3>
                <p className="text-xs text-stone-500 font-thai">ขนมไทยชาววัง & เครื่องดื่มสมุนไพร</p>
              </div>

              {/* Table Badge */}
              <div className="my-2 px-5 py-1 bg-amber-800 text-amber-50 rounded-full font-serif-thai font-bold text-sm tracking-wide shadow-xs">
                {selectedTable}
              </div>

              {/* QR Code Container */}
              <div className="my-3 p-3 bg-white rounded-xl border border-stone-200/80 shadow-xs flex flex-col items-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code สั่งอาหาร ${selectedTable}`}
                    className="w-48 h-48 rounded-lg select-none"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-48 h-48 bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-stone-400">
                    กำลังสร้าง QR...
                  </div>
                )}
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-medium text-stone-600">
                  <QrCode className="w-3.5 h-3.5 text-amber-700" />
                  สแกนสั่งขนมไทย & ชำระเงินที่นี่
                </div>
              </div>

              {/* 3 Step Instructions */}
              <div className="w-full mt-2 pt-3 border-t border-stone-200/80 text-left space-y-1.5 text-[11px] text-stone-600">
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <span>เปิดกล้องมือถือสแกน QR Code</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <span>เลือกเมนูขนมไทย ระบุระดับความหวาน</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <span>ชำระผ่าน PromptPay และรอรับของหวานที่โต๊ะ</span>
                </div>
              </div>

              <div className="mt-4 text-[10px] text-stone-400">
                ฟรี Wi-Fi: SanehJaan_Guest (รหัส: sweet2026)
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Batch View for printing multiple tables */
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-900 flex items-center justify-between">
            <span>แสดงป้ายตั้งโต๊ะทั้งหมด {DEFAULT_TABLES.length} โต๊ะ พร้อมสำหรับกดปุ่มสั่งพิมพ์ (Print) ออกกระดาษการ์ดหรือแผ่นอะคริลิก</span>
            <button
              onClick={() => window.print()}
              className="px-3 py-1 bg-amber-800 text-white rounded text-xs font-medium hover:bg-amber-900"
            >
              พิมพ์ทั้งหมดทันที
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {DEFAULT_TABLES.map(table => (
              <div
                key={table}
                className="bg-white border border-stone-200 rounded-xl p-4 text-center flex flex-col items-center shadow-xs"
              >
                <span className="text-[11px] font-serif-thai font-semibold text-stone-800">ร้านเสน่ห์จันทน์</span>
                <span className="text-xs font-bold text-amber-800 mt-0.5">{table}</span>
                <div className="my-2 p-1.5 bg-stone-50 rounded-lg border border-stone-200/60">
                  {allQrs[table] ? (
                    <img
                      src={allQrs[table]}
                      alt={`QR Code ${table}`}
                      className="w-32 h-32"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-stone-100 animate-pulse rounded" />
                  )}
                </div>
                <span className="text-[10px] text-stone-500">สแกนสั่งขนมไทย & จ่ายเงิน</span>
                <button
                  onClick={() => onOpenCustomerViewForTable(table)}
                  className="mt-2 text-[11px] text-amber-800 hover:underline flex items-center gap-1"
                >
                  เปิดโต๊ะนี้ <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
