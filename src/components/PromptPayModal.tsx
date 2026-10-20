import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, QrCode, ShieldCheck, ArrowRight, Download, Clock, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { sounds } from '../utils/audio';

interface PromptPayModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (orderId: string, slipDetails: Order['slipDetails']) => void;
}

export const PromptPayModal: React.FC<PromptPayModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>('ธนาคารกสิกรไทย (K PLUS)');
  const [payerName, setPayerName] = useState<string>('คุณ วริศรา นิลประเสริฐ');

  // Dynamic PromptPay payload string
  const promptPayRef = order.paymentReference || `PP-${Date.now().toString().slice(-8)}`;
  const amountFormatted = order.totalAmount.toFixed(2);
  const promptPayPayload = `00020101021229370016A000000677010111011300668912345675802TH5303764540${amountFormatted.length < 10 ? '0' + amountFormatted.length : amountFormatted}${amountFormatted}5802TH62150711${promptPayRef}6304`;

  useEffect(() => {
    if (!isOpen) return;

    // Generate high resolution PromptPay QR
    QRCode.toDataURL(promptPayPayload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    }).then(url => {
      setQrCodeUrl(url);
    }).catch(err => {
      console.error('Error generating PromptPay QR', err);
    });

    setTimeLeft(600);
    setIsProcessing(false);
    setIsSuccess(false);

    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, order.totalAmount, promptPayPayload]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const triggerPaymentSuccess = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      sounds.playPaymentSuccess();

      // Confetti burst
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#e11d48']
      });

      const slipData = {
        bankName: selectedBank,
        senderName: payerName,
        transRef: 'TX' + Math.floor(100000000000 + Math.random() * 900000000000).toString(),
        amount: order.totalAmount,
        timestamp: new Date().toLocaleString('th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };

      setTimeout(() => {
        onPaymentSuccess(order.id, slipData);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top PromptPay Header */}
        <div className="bg-[#113566] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center">
              <span className="text-[#113566] font-bold text-xs tracking-tighter">พร้อมเพย์</span>
            </div>
            <div>
              <h3 className="font-semibold text-sm leading-tight">ชำระเงินผ่าน พร้อมเพย์ (PromptPay QR)</h3>
              <p className="text-[11px] text-blue-200/90">สแกนจ่ายได้ทุกแอปพลิเคชันธนาคารในไทย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5">
          {!isSuccess ? (
            <>
              {/* Order amount highlight */}
              <div className="text-center bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                <span className="text-xs text-stone-500 block mb-0.5">ยอดชำระสุทธิ ({order.tableNumber})</span>
                <div className="text-3xl font-bold text-stone-900 tabular-nums">
                  ฿{order.totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 mt-1">
                  <span>เลขออร์เดอร์ #{order.orderNumber}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-mono text-amber-700">
                    <Clock className="w-3 h-3" />
                    เวลาคงเหลือ {timeFormatted}
                  </span>
                </div>
              </div>

              {/* QR Code Container with official look */}
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-xl border-2 border-[#113566]/20 shadow-xs relative">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="PromptPay QR Code"
                      className="w-56 h-56 rounded-md select-none"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-56 h-56 bg-stone-100 animate-pulse rounded-md flex items-center justify-center text-xs text-stone-400">
                      กำลังสร้าง QR พร้อมเพย์...
                    </div>
                  )}

                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#113566] text-white rounded-full text-[10px] font-medium tracking-wide shadow-xs whitespace-nowrap">
                    สแกน QR เพื่อจ่ายเงิน
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-semibold text-stone-800">ร้านเสน่ห์จันทน์ ขนมไทยชาววัง</p>
                  <p className="text-[11px] text-stone-500 font-mono">Biller ID: 0105562098492 · PromptPay</p>
                </div>
              </div>

              {/* Simulation Helper Panel */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-medium text-amber-950">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ระบบตรวจสอบการชำระเงินแบบเรียลไทม์
                  </span>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 px-1.5 py-0.5 rounded">Real-time Hook</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <label className="text-stone-500 block mb-1">จำลองแอปธนาคาร:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full p-1 bg-white border border-stone-200 rounded text-stone-800 text-xs"
                    >
                      <option value="ธนาคารกสิกรไทย (K PLUS)">K PLUS (กสิกรไทย)</option>
                      <option value="ธนาคารไทยพาณิชย์ (SCB EASY)">SCB EASY (ไทยพาณิชย์)</option>
                      <option value="ธนาคารกรุงไทย (Krungthai NEXT)">Krungthai NEXT (กรุงไทย)</option>
                      <option value="ธนาคารกรุงเทพ (Bualuang mBanking)">Bualuang mBanking (กรุงเทพ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-stone-500 block mb-1">ชื่อผู้โอนจำลอง:</label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      className="w-full p-1 bg-white border border-stone-200 rounded text-stone-800 text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={triggerPaymentSuccess}
                  disabled={isProcessing}
                  className="w-full mt-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      กำลังตรวจสลิปโอนเงินผ่านระบบ...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      จำลองสแกนจ่ายสำเร็จ (Instant Payment)
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Payment Success Screen with Authentic Bank Slip */
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-900 font-serif-thai">ชำระเงินสำเร็จเรียบร้อย</h4>
                <p className="text-xs text-stone-500 mt-0.5">ระบบส่งคำสั่งทำขนมไทยไปยังห้องครัวเรียบร้อยแล้ว</p>
              </div>

              {/* Digital E-Slip Preview */}
              <div className="bg-[#f8fafc] border border-stone-200 rounded-xl p-4 text-left text-xs space-y-2 relative shadow-xs">
                <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
                  <span className="font-semibold text-stone-800">{selectedBank}</span>
                  <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">โอนเงินสำเร็จ</span>
                </div>
                
                <div className="space-y-1 text-stone-600 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-stone-400">จาก:</span>
                    <span className="font-medium text-stone-800">{payerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">ไปยัง:</span>
                    <span className="font-medium text-stone-800">บจก. เสน่ห์จันทน์ ขนมไทย</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">จำนวนเงิน:</span>
                    <span className="font-bold text-stone-900 tabular-nums">฿{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">เลขอ้างอิง:</span>
                    <span className="font-mono text-[10px] text-stone-500">{order.paymentReference || 'TX9841029418'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">เวลาที่ทำรายการ:</span>
                    <span className="text-stone-500">{new Date().toLocaleTimeString('th-TH')} น.</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-stone-400">
                กำลังนำคุณไปยังหน้ารอรับขนมหวานสักครู่...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>ความปลอดภัยระดับธนาคารแห่งประเทศไทย</span>
          <button
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 font-medium"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
