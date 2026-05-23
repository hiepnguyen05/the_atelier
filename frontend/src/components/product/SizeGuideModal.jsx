import React from 'react';

const SIZE_GUIDE_DATA = {
  nu: {
    top: {
      headers: ['Size', 'Vòng Ngực (cm)', 'Vòng Eo (cm)', 'Chiều Cao (cm)', 'Cân Nặng (kg)'],
      rows: [
        ['S', '82 - 86', '64 - 68', '150 - 155', '40 - 47'],
        ['M', '86 - 90', '68 - 72', '156 - 160', '48 - 54'],
        ['L', '90 - 94', '72 - 76', '160 - 164', '55 - 60'],
        ['XL', '94 - 98', '76 - 80', '165 - 170', '60 - 65'],
      ]
    },
    bottom: {
      headers: ['Size US/EU', 'Size Việt Nam', 'Vòng Eo (cm)', 'Vòng Mông (cm)'],
      rows: [
        ['26', 'S', '64 - 66', '86 - 89'],
        ['27', 'M', '67 - 69', '90 - 93'],
        ['28', 'L', '70 - 73', '94 - 97'],
        ['29', 'XL', '74 - 77', '98 - 101'],
      ]
    },
    shoes: {
      headers: ['Size EU', 'Size UK', 'Size US', 'Chiều Dài Bàn Chân (cm)'],
      rows: [
        ['35', '2.5', '5', '22.0 - 22.5'],
        ['36', '3.5', '6', '22.5 - 23.0'],
        ['37', '4', '6.5', '23.0 - 23.5'],
        ['38', '5', '7.5', '23.5 - 24.0'],
        ['39', '6', '8.5', '24.0 - 24.5'],
        ['40', '6.5', '9', '24.5 - 25.0'],
      ]
    }
  },
  nam: {
    top: {
      headers: ['Size', 'Vòng Ngực (cm)', 'Chiều Rộng Vai (cm)', 'Chiều Cao (cm)', 'Cân Nặng (kg)'],
      rows: [
        ['S', '88 - 92', '42', '160 - 167', '50 - 60'],
        ['M', '92 - 96', '44', '168 - 173', '60 - 70'],
        ['L', '96 - 100', '46', '173 - 178', '70 - 80'],
        ['XL', '100 - 104', '48', '178 - 185', '80 - 90'],
      ]
    },
    bottom: {
      headers: ['Size', 'Vòng Eo (cm)', 'Chiều Dài Quần (cm)', 'Chiều Cao Đứng (cm)'],
      rows: [
        ['29', '74 - 76', '98', '160 - 165'],
        ['30', '77 - 79', '100', '165 - 170'],
        ['31', '80 - 82', '102', '170 - 175'],
        ['32', '83 - 85', '104', '175 - 180'],
        ['33', '86 - 88', '105', '180 - 185'],
        ['34', '89 - 91', '106', '185 - 190'],
      ]
    },
    shoes: {
      headers: ['Size EU', 'Size UK', 'Size US', 'Chiều Dài Bàn Chân (cm)'],
      rows: [
        ['39', '6', '6.5', '24.0 - 24.5'],
        ['40', '6.5', '7', '24.5 - 25.0'],
        ['41', '7.5', '8', '25.0 - 25.5'],
        ['42', '8', '8.5', '25.5 - 26.0'],
        ['43', '9', '9.5', '26.0 - 26.5'],
        ['44', '9.5', '10', '26.5 - 27.0'],
      ]
    }
  }
};

const SizeGuideModal = ({
  showSizeGuide,
  setShowSizeGuide,
  sizeGuideGender,
  setSizeGuideGender,
  sizeGuideType,
  setSizeGuideType
}) => {
  if (!showSizeGuide) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm animate-fade-in"
      onClick={() => setShowSizeGuide(false)}
    >
      <div 
        className="bg-background border border-outline-variant/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={() => setShowSizeGuide(false)}
          className="absolute top-4 right-4 text-on-background bg-transparent hover:text-secondary p-1 border-none flex items-center justify-center duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl font-light">close</span>
        </button>

        {/* Header */}
        <div className="mb-8 pr-8">
          <span className="font-label text-[10px] tracking-[0.2em] text-secondary uppercase font-semibold">Cẩm Nang Atelier</span>
          <h2 className="font-display italic text-3xl mt-2 text-on-surface">Hướng Dẫn Chọn Kích Cỡ</h2>
          <p className="font-body text-xs text-on-surface-variant/80 mt-2">
            Để chọn được kích cỡ phù hợp nhất, vui lòng đo các thông số của bạn và đối chiếu với bảng kích cỡ dưới đây.
          </p>
        </div>

        {/* Gender Switcher */}
        <div className="flex gap-8 border-b border-outline-variant/20 mb-6">
          <button 
            onClick={() => setSizeGuideGender('nu')}
            className={`pb-2 text-xs font-label uppercase tracking-widest transition-all border-b-2 bg-transparent cursor-pointer ${
              sizeGuideGender === 'nu' 
                ? 'border-on-surface font-semibold text-on-surface' 
                : 'border-transparent text-on-surface-variant/40 hover:text-on-surface'
            }`}
          >
            Thời trang Nữ
          </button>
          <button 
            onClick={() => setSizeGuideGender('nam')}
            className={`pb-2 text-xs font-label uppercase tracking-widest transition-all border-b-2 bg-transparent cursor-pointer ${
              sizeGuideGender === 'nam' 
                ? 'border-on-surface font-semibold text-on-surface' 
                : 'border-transparent text-on-surface-variant/40 hover:text-on-surface'
            }`}
          >
            Thời trang Nam
          </button>
        </div>

        {/* Type Switcher */}
        <div className="flex gap-2 mb-6">
          <button 
            onClick={() => setSizeGuideType('top')}
            className={`px-4 py-2 text-[10px] font-label uppercase tracking-wider border transition-all cursor-pointer ${
              sizeGuideType === 'top' 
                ? 'border-on-surface bg-on-background text-on-primary font-semibold' 
                : 'border-outline-variant/20 bg-transparent text-on-surface-variant hover:border-on-surface'
            }`}
          >
            Áo
          </button>
          <button 
            onClick={() => setSizeGuideType('bottom')}
            className={`px-4 py-2 text-[10px] font-label uppercase tracking-wider border transition-all cursor-pointer ${
              sizeGuideType === 'bottom' 
                ? 'border-on-surface bg-on-background text-on-primary font-semibold' 
                : 'border-outline-variant/20 bg-transparent text-on-surface-variant hover:border-on-surface'
            }`}
          >
            Quần
          </button>
          <button 
            onClick={() => setSizeGuideType('shoes')}
            className={`px-4 py-2 text-[10px] font-label uppercase tracking-wider border transition-all cursor-pointer ${
              sizeGuideType === 'shoes' 
                ? 'border-on-surface bg-on-background text-on-primary font-semibold' 
                : 'border-outline-variant/20 bg-transparent text-on-surface-variant hover:border-on-surface'
            }`}
          >
            Giày &amp; Dép
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-outline-variant/10">
          <table className="w-full text-left border-collapse font-body text-xs text-on-surface">
            <thead>
              <tr className="bg-surface-container/30 border-b border-outline-variant/20">
                {SIZE_GUIDE_DATA[sizeGuideGender][sizeGuideType].headers.map((h, i) => (
                  <th key={i} className="p-4 font-label text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE_DATA[sizeGuideGender][sizeGuideType].rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-outline-variant/10 hover:bg-surface-container/10 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={`p-4 ${cellIndex === 0 ? 'font-semibold font-label' : ''}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Tip */}
        <div className="mt-6 p-4 bg-surface-container/20 border border-outline-variant/5">
          <p className="font-body text-[11px] leading-relaxed text-on-surface-variant/80">
            <span className="font-semibold text-secondary">Mẹo đo:</span> Vui lòng giữ thước dây ngang và thoải mái khi đo. Nếu số đo của bạn nằm giữa hai kích cỡ, chúng tôi khuyên bạn nên chọn kích cỡ lớn hơn để có phom dáng thoải mái nhất.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuideModal;
