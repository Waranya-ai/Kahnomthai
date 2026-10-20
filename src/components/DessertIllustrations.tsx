import React from 'react';

interface DessertIllustrationProps {
  theme: string;
  className?: string;
  title?: string;
}

export const DessertIllustration: React.FC<DessertIllustrationProps> = ({ theme, className = "w-full h-full", title }) => {
  switch (theme) {
    case 'gold_sweets':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-50 via-amber-100/70 to-amber-200/50 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            {/* Soft background glow & Thai motif */}
            <circle cx="200" cy="150" r="110" fill="#fef3c7" opacity="0.6" />
            <circle cx="200" cy="150" r="95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.3" />
            
            {/* Antique hammered brass tray */}
            <ellipse cx="200" cy="205" rx="140" ry="38" fill="#d97706" opacity="0.4" />
            <ellipse cx="200" cy="200" rx="135" ry="34" fill="#b45309" />
            <ellipse cx="200" cy="196" rx="130" ry="30" fill="#f59e0b" />
            <ellipse cx="200" cy="194" rx="122" ry="26" fill="#fbbf24" />
            
            {/* Banana leaf lining */}
            <path d="M 100 190 Q 200 180 300 190 Q 200 205 100 190 Z" fill="#15803d" opacity="0.75" />
            <path d="M 120 188 Q 200 178 280 188" stroke="#166534" strokeWidth="1" fill="none" />

            {/* Thong Yip flower folds */}
            <g transform="translate(145, 155)">
              <ellipse cx="0" cy="10" rx="26" ry="14" fill="#d97706" opacity="0.6" />
              <path d="M -18 5 C -25 -10, -5 -25, 0 -28 C 5 -25, 25 -10, 18 5 C 15 15, -15 15, -18 5 Z" fill="#f59e0b" />
              <path d="M -12 -5 C -18 -18, -2 -22, 0 -26 C 2 -22, 18 -18, 12 -5 Z" fill="#fbbf24" />
              <circle cx="0" cy="-6" r="6" fill="#fef08a" />
              <circle cx="0" cy="-6" r="2.5" fill="#ca8a04" />
            </g>

            {/* Thong Yod teardrops */}
            <g transform="translate(240, 160)">
              <ellipse cx="0" cy="12" rx="24" ry="12" fill="#d97706" opacity="0.5" />
              <path d="M -12 10 C -18 0, -8 -18, 0 -25 C 8 -18, 18 0, 12 10 C 6 18, -6 18, -12 10 Z" fill="#ea580c" />
              <path d="M -8 8 C -12 0, -5 -12, 0 -18 C 5 -12, 12 0, 8 8 Z" fill="#f97316" />
              <ellipse cx="3" cy="-3" rx="4" ry="7" fill="#fed7aa" opacity="0.7" />
            </g>

            {/* Center Foi Thong golden nest */}
            <g transform="translate(198, 165)">
              <ellipse cx="0" cy="8" rx="28" ry="14" fill="#ca8a04" opacity="0.6" />
              <ellipse cx="0" cy="2" rx="25" ry="12" fill="#eab308" />
              {/* Golden silk lines */}
              <path d="M -22 0 Q -5 -8 20 2 Q 5 10 -20 2" stroke="#fef08a" strokeWidth="2" fill="none" />
              <path d="M -18 3 Q 0 -6 18 0 Q -2 8 -16 4" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
              <path d="M -14 -2 Q 2 6 16 -3" stroke="#fef9c3" strokeWidth="1" fill="none" />
              <circle cx="2" cy="0" r="2" fill="#ffffff" />
            </g>

            {/* Real gold leaf flakes floating accents */}
            <polygon points="175,130 178,135 173,138 171,133" fill="#eab308" />
            <polygon points="230,135 233,139 229,141" fill="#f59e0b" />
          </svg>
        </div>
      );

    case 'bualoy':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            {/* Celadon ceramic bowl */}
            <ellipse cx="200" cy="225" rx="130" ry="25" fill="#44403c" opacity="0.2" />
            <path d="M 80 160 C 80 235, 320 235, 320 160 Z" fill="#0f766e" />
            <ellipse cx="200" cy="160" rx="120" ry="40" fill="#14b8a6" />
            <ellipse cx="200" cy="158" rx="112" ry="34" fill="#f8fafc" />
            
            {/* Coconut cream milk surface with candle smoke swirl */}
            <ellipse cx="200" cy="158" rx="108" ry="32" fill="#fffbeb" />
            <path d="M 120 155 Q 200 170 280 155" stroke="#fef3c7" strokeWidth="6" strokeLinecap="round" opacity="0.6" fill="none" />
            
            {/* Poached egg yolk (Khai Wan) */}
            <ellipse cx="200" cy="150" rx="22" ry="16" fill="#f59e0b" />
            <ellipse cx="198" cy="148" rx="18" ry="13" fill="#fbbf24" />
            <ellipse cx="194" cy="144" rx="6" ry="4" fill="#fef08a" opacity="0.9" />

            {/* Taro Purple Pearls */}
            <circle cx="150" cy="158" r="10" fill="#9333ea" />
            <circle cx="148" cy="156" r="3" fill="#e9d5ff" opacity="0.7" />
            <circle cx="235" cy="168" r="9" fill="#a855f7" />

            {/* Pandan Green Pearls */}
            <circle cx="245" cy="148" r="10" fill="#16a34a" />
            <circle cx="243" cy="146" r="3" fill="#bbf7d0" opacity="0.7" />
            <circle cx="160" cy="172" r="9" fill="#22c55e" />

            {/* Pumpkin Golden Pearls */}
            <circle cx="178" cy="166" r="11" fill="#ea580c" />
            <circle cx="218" cy="164" r="10" fill="#f97316" />

            {/* Young coconut ribbons */}
            <path d="M 130 148 Q 145 142 165 146" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 225 140 Q 245 136 260 143" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'mango_rice':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-50 via-emerald-50/60 to-yellow-50 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            {/* Banana leaf platter base */}
            <ellipse cx="200" cy="205" rx="145" ry="40" fill="#14532d" opacity="0.3" />
            <ellipse cx="200" cy="195" rx="140" ry="36" fill="#15803d" />
            <path d="M 65 195 Q 200 175 335 195 Q 200 215 65 195 Z" fill="#16a34a" />
            {/* Leaf ribs */}
            <line x1="75" y1="195" x2="325" y2="195" stroke="#14532d" strokeWidth="1.5" opacity="0.4" />

            {/* Butterfly Pea Blue & White Sticky Rice Mound */}
            <ellipse cx="145" cy="180" rx="46" ry="24" fill="#1e3a8a" opacity="0.3" />
            <ellipse cx="145" cy="172" rx="44" ry="22" fill="#2563eb" />
            <ellipse cx="142" cy="170" rx="38" ry="18" fill="#3b82f6" />
            <path d="M 120 162 Q 145 158 170 165 Q 160 178 125 174 Z" fill="#f8fafc" opacity="0.9" />
            {/* Coconut Cream cascade */}
            <path d="M 132 158 Q 144 168 140 176" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Crispy golden mung beans sprinkles */}
            <circle cx="138" cy="165" r="2.5" fill="#facc15" />
            <circle cx="148" cy="168" r="2.5" fill="#facc15" />
            <circle cx="142" cy="173" r="2.5" fill="#eab308" />
            <circle cx="152" cy="162" r="2.5" fill="#eab308" />

            {/* Sliced Golden Mango Slices */}
            <g transform="translate(230, 168)">
              {/* Slice 1 */}
              <path d="M -40 10 C -45 -18, 20 -28, 48 -10 C 35 15, -20 22, -40 10 Z" fill="#d97706" />
              <path d="M -36 8 C -40 -14, 18 -24, 44 -8 C 32 12, -18 18, -36 8 Z" fill="#f59e0b" />
              <path d="M -28 4 C -30 -10, 15 -18, 38 -5 C 28 8, -12 12, -28 4 Z" fill="#fbbf24" />
              
              {/* Diamond lattice cut markings */}
              <line x1="-15" y1="-14" x2="-2" y2="12" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="8" y1="-12" x2="18" y2="8" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="-25" y1="-2" x2="30" y2="-2" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" />
            </g>
          </svg>
        </div>
      );

    case 'khanom_chan':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 via-purple-50 to-amber-50 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="215" rx="120" ry="28" fill="#78716c" opacity="0.2" />
            <ellipse cx="200" cy="205" rx="110" ry="24" fill="#e7e5e4" />
            <ellipse cx="200" cy="202" rx="100" ry="20" fill="#fafaf9" />

            {/* Layered Khanom Chan Lotus Flower (Center) */}
            <g transform="translate(200, 165)">
              {/* Layer 1 (Dark Green Pandan) */}
              <ellipse cx="0" cy="25" rx="45" ry="14" fill="#15803d" />
              {/* Layer 2 (Light Coconut) */}
              <ellipse cx="0" cy="20" rx="42" ry="13" fill="#f0fdf4" />
              {/* Layer 3 (Green) */}
              <ellipse cx="0" cy="15" rx="40" ry="12" fill="#16a34a" />
              {/* Layer 4 (Light) */}
              <ellipse cx="0" cy="10" rx="38" ry="12" fill="#f0fdf4" />
              {/* Layer 5 (Purple Butterfly Pea) */}
              <ellipse cx="0" cy="5" rx="36" ry="11" fill="#7e22ce" />
              {/* Layer 6 (Light) */}
              <ellipse cx="0" cy="0" rx="34" ry="11" fill="#faf5ff" />
              {/* Layer 7 (Top Lotus Rosette) */}
              <ellipse cx="0" cy="-5" rx="32" ry="10" fill="#9333ea" />
              <circle cx="0" cy="-8" r="6" fill="#fbbf24" />
              <polygon points="0,-12 3,-7 -3,-7" fill="#fef08a" />
            </g>

            {/* Secondary diamond cut slices on the side */}
            <g transform="translate(130, 185) scale(0.7)">
              <polygon points="0,-20 25,-8 25,18 0,30 -25,18 -25,-8" fill="#15803d" />
              <polygon points="0,-20 25,-8 0,4 -25,-8" fill="#22c55e" />
              <polygon points="0,-14 18,-5 0,3 -18,-5" fill="#f0fdf4" />
            </g>
            <g transform="translate(270, 185) scale(0.7)">
              <polygon points="0,-20 25,-8 25,18 0,30 -25,18 -25,-8" fill="#6b21a8" />
              <polygon points="0,-20 25,-8 0,4 -25,-8" fill="#a855f7" />
              <polygon points="0,-14 18,-5 0,3 -18,-5" fill="#faf5ff" />
            </g>
          </svg>
        </div>
      );

    case 'lod_chong':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-50 via-emerald-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            {/* Glass bowl with ice and palm sugar caramel */}
            <ellipse cx="200" cy="225" rx="100" ry="20" fill="#57534e" opacity="0.2" />
            <path d="M 120 130 C 120 220, 280 220, 280 130 Z" fill="#fed7aa" opacity="0.8" />
            <ellipse cx="200" cy="130" rx="80" ry="22" fill="#fff7ed" />
            
            {/* Rich palm sugar amber layer */}
            <path d="M 130 170 C 150 205, 250 205, 270 170 Z" fill="#92400e" opacity="0.85" />
            
            {/* Crushed clear ice cubes */}
            <rect x="160" y="140" width="22" height="18" rx="4" fill="#ffffff" opacity="0.75" />
            <rect x="210" y="142" width="20" height="16" rx="4" fill="#ffffff" opacity="0.75" />
            <rect x="185" y="150" width="24" height="18" rx="4" fill="#ffffff" opacity="0.85" />

            {/* Pandan noodles (green worm drops) */}
            <path d="M 150 160 Q 155 175 160 185" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 175 155 Q 182 170 180 188" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 205 160 Q 212 178 210 190" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 230 162 Q 225 178 238 186" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 188 172 Q 196 182 202 192" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'taptim':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-rose-50 via-red-50 to-pink-100 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="225" rx="100" ry="20" fill="#713f12" opacity="0.2" />
            <path d="M 120 135 C 120 220, 280 220, 280 135 Z" fill="#ffe4e6" opacity="0.9" />
            <ellipse cx="200" cy="135" rx="80" ry="20" fill="#fdf2f8" />
            
            {/* White coconut milk swirl */}
            <ellipse cx="200" cy="148" rx="68" ry="18" fill="#ffffff" />
            
            {/* Ruby Chestnuts (Taptim) */}
            <g>
              <rect x="150" y="145" width="14" height="14" rx="4" fill="#e11d48" transform="rotate(15 157 152)" />
              <rect x="175" y="152" width="15" height="15" rx="4" fill="#be123c" transform="rotate(25 182 159)" />
              <rect x="200" y="142" width="16" height="16" rx="4" fill="#f43f5e" transform="rotate(-10 208 150)" />
              <rect x="225" y="150" width="14" height="14" rx="4" fill="#e11d48" transform="rotate(40 232 157)" />
              <rect x="165" y="165" width="13" height="13" rx="3" fill="#be123c" transform="rotate(8 171 171)" />
              <rect x="195" y="162" width="14" height="14" rx="4" fill="#9f1239" transform="rotate(-20 202 169)" />
            </g>

            {/* Crushed ice mounds */}
            <ellipse cx="195" cy="138" rx="28" ry="12" fill="#ffffff" opacity="0.8" />
          </svg>
        </div>
      );

    case 'piek_poon':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-950/20 via-emerald-900/10 to-stone-100 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="215" rx="110" ry="25" fill="#44403c" opacity="0.25" />
            <rect x="110" y="195" width="180" height="16" rx="6" fill="#a8a29e" />
            <rect x="115" y="192" width="170" height="12" rx="4" fill="#d6d3d1" />

            {/* Glossy Black/Green Piek Poon Cubes */}
            <g transform="translate(160, 160)">
              <polygon points="0,-25 35,-10 35,25 0,40 -35,25 -35,-10" fill="#064e3b" />
              <polygon points="0,-25 35,-10 0,6 -35,-10" fill="#047857" />
              <polygon points="0,-25 0,6 35,-10" fill="#059669" opacity="0.6" />
              {/* Glossy light catch */}
              <ellipse cx="-5" cy="-8" rx="14" ry="4" fill="#a7f3d0" opacity="0.5" />
            </g>

            <g transform="translate(230, 165)">
              <polygon points="0,-22 30,-9 30,22 0,35 -30,22 -30,-9" fill="#022c22" />
              <polygon points="0,-22 30,-9 0,5 -30,-9" fill="#065f46" />
              <ellipse cx="-4" cy="-7" rx="12" ry="3.5" fill="#a7f3d0" opacity="0.4" />
            </g>

            {/* Shredded Coconut Curled Ribbons */}
            <path d="M 140 145 Q 165 130 175 145" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 155 138 Q 180 152 195 136" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 215 142 Q 235 132 245 148" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      );

    case 'mo_kaeng':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="225" rx="110" ry="25" fill="#44403c" opacity="0.25" />
            
            {/* Traditional brass baking tray */}
            <rect x="115" y="150" width="170" height="60" rx="8" fill="#b45309" />
            <rect x="110" y="145" width="180" height="15" rx="4" fill="#f59e0b" />
            <rect x="115" y="148" width="170" height="8" rx="2" fill="#fbbf24" />

            {/* Baked Custard Surface with golden-brown crust */}
            <ellipse cx="200" cy="155" rx="78" ry="18" fill="#d97706" />
            <ellipse cx="198" cy="154" rx="74" ry="16" fill="#b45309" />
            
            {/* Caramelized blister spots */}
            <circle cx="160" cy="154" r="7" fill="#78350f" />
            <circle cx="215" cy="153" r="8" fill="#78350f" />
            <circle cx="185" cy="156" r="6" fill="#92400e" />

            {/* Crispy Fried Shallots (Hom Daeng Jiew) */}
            <path d="M 155 150 Q 165 146 170 152" stroke="#451a03" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 190 148 Q 200 144 205 152" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 210 149 Q 225 145 220 154" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="178" cy="150" r="1.5" fill="#fbbf24" />
          </svg>
        </div>
      );

    case 'herbal_drink':
    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 400 300" className="w-full h-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="245" rx="50" ry="12" fill="#475569" opacity="0.25" />
            
            {/* Tall ribbed glass */}
            <path d="M 160 80 L 170 230 C 170 236, 230 236, 230 230 L 240 80 Z" fill="#e0e7ff" opacity="0.6" stroke="#94a3b8" strokeWidth="1" />
            
            {/* Butterfly pea gradient drink liquid */}
            <path d="M 163 115 L 171 228 C 172 233, 228 233, 229 228 L 237 115 Z" fill="url(#drinkGradient)" />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="drinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="50%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Ice Cubes inside drink */}
            <rect x="180" y="130" width="22" height="22" rx="4" fill="#ffffff" opacity="0.6" transform="rotate(12 191 141)" />
            <rect x="188" y="165" width="20" height="20" rx="4" fill="#ffffff" opacity="0.5" transform="rotate(-8 198 175)" />

            {/* Fresh Lime Slice on the glass rim */}
            <g transform="translate(162, 85) rotate(-25)">
              <circle cx="0" cy="0" r="22" fill="#65a30d" />
              <circle cx="0" cy="0" r="19" fill="#facc15" />
              <circle cx="0" cy="0" r="17" fill="#fef08a" />
              {/* Segments */}
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#ca8a04" strokeWidth="1" />
              <line x1="0" y1="-15" x2="0" y2="15" stroke="#ca8a04" strokeWidth="1" />
            </g>

            {/* Reusable Bamboo Straw */}
            <rect x="210" y="45" width="6" height="150" rx="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" transform="rotate(10 213 45)" />
          </svg>
        </div>
      );
  }
};
