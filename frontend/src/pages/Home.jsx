import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[120vh] w-full overflow-hidden bg-surface-container">
        <div className="absolute inset-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7JPY3Z64aUIlKLGpa6uHyZKtSsRCCKvjQe2I028gxDDCHs55Qa7MB3afSMz-71UK9yH5C1SgonR0tLlIntr2C6EAHFsW5PyZrU3wKJHjxPLWAtGUo9AmzyTKw4Im-HSZGhY6L8-lunDf1Ay4_Qu3ezoolPL4ojIJBhlFJdEybdVfkMws33RWE0t9-_zTcbt4yRoRc_-QPvd0BrNr4AW3fvnNFW88YtgshrXLgJMsW00UdY_OMLBhtJo2d266Q8pONOA6ftiZnvu0" 
            alt="Editorial Hero" 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-24 md:pb-32">
          <span className="font-label text-white mb-6 block text-[10px] tracking-[0.4em]">XUÂN / HÈ 2024</span>
          <h2 className="text-white font-headline text-[clamp(3.5rem,10vw,8rem)] leading-[0.85] font-extralight tracking-tighter italic mb-12">
            Cấu Trúc <br /> 
            <span className="md:ml-40 block mt-2">Vô Thường</span>
          </h2>
          
          <div className="flex flex-col md:flex-row md:items-center gap-12 max-w-5xl">
            <button className="bg-white text-on-surface px-12 py-5 font-label text-[11px] tracking-[0.2em] font-bold hover:bg-on-surface hover:text-white transition-all duration-500 flex items-center gap-4 w-fit">
              KHÁM PHÁ BỘ SƯU TẬP
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <p className="text-white/60 font-body text-sm md:text-base leading-relaxed max-w-xs font-light">
              Cuộc đối thoại giữa lụa mềm mại và những hình khối kiến trúc. Định nghĩa lại di sản hiện đại qua lăng kính của Digital Atelier.
            </p>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 md:py-40 px-6 md:px-12 bg-background">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16 md:mb-24">
            <div className="max-w-2xl">
              <span className="font-label text-secondary mb-6 block">SẢN PHẨM MỚI</span>
              <h3 className="font-headline text-4xl md:text-6xl italic leading-tight mb-8">Những Thiết Yếu Tuyển Chọn</h3>
              <p className="text-on-surface-variant font-body text-base leading-relaxed max-w-lg font-light">
                Từng món đồ được tạo tác với ý niệm độc bản. Những thiết kế mới nhất của chúng tôi tập trung vào sự phong phú của xúc giác và tính ứng dụng vượt thời gian.
              </p>
            </div>
            <Link to="/" className="font-label text-[10px] tracking-[0.2em] text-on-surface border-b border-outline-variant/30 pb-2 hover:border-on-surface transition-all uppercase no-underline">
              XEM TẤT CẢ DANH MỤC
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
            {/* Large Feature */}
            <div className="md:col-span-7 group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-surface-variant mb-6">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6RCBogpyB1f3Wp766SQLOW_0_W8teUFyhzVg9TtAJT1m__IzGxqmC8uqS3k0lvTMBW3X34jjCevvZHcZ2n06FN_J8a647zeyz0KmHh6MhcoyonoAQ2j4FVMqGsHulcll8ofx24FNhMTvLIt6MC4teLk4XSVzO8WxbVRTc_GUqYdOW8dQlTjIXlRCb3X7APZ21YPutFo9rKJZ2NEZ8F4Zy2Rg_861RzCzor_rCY8pS9ZFr0CMEkdRaPazao1CrrOkPXPkDOhl-uJg" 
                  alt="Featured Product" 
                  className="w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 font-label text-[9px] tracking-widest">
                  THIẾT KẾ ĐẶC TRƯNG
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-headline text-xl mb-1">Áo Khoác Architect Oversized</h4>
                  <span className="font-label text-on-surface-variant text-[9px] opacity-60">LEN NGUYÊN BẢN / MÀU CÁT</span>
                </div>
                <span className="font-headline text-2xl italic">1,240 USD</span>
              </div>
            </div>

            {/* Small Stacked */}
            <div className="md:col-span-5 flex flex-col gap-16 md:pt-24">
              <div className="group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-surface-variant mb-6">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAL-b-0M1Km7kmr39S4TFygwpirQ5IoWv_SHw_OGoCi-nK_ezK8gHq3X0GXZN4ZKHufCsLfRRaOGRT30F-8Ujf5CfuzUAMvaoKBfk2ryHsaCP3zzlD8uDRUrqX00QOBIr_QR6eSU5G42QHGejct5TQtM59mYx6VbB1vAladPkfaGmbx4Laqa6ccNQnodDDPEkbv4vGOBz0eqL2nkHMJgLg-t1uts2gIKMbPImcjtUkgYCybllZ7mKe0-evgNhB9j7Dm5dLaAL9LtE" 
                    alt="Product 2" 
                    className="w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <div>
                  <h4 className="font-headline text-lg mb-1">Áo Sơ Mi Lụa Organza</h4>
                  <span className="font-headline text-lg italic">480 USD</span>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden bg-surface-variant mb-6">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY8kNl67XW9vuf3-WBMHvz1VtMxxc2xi8OYvf5L1EK1dmNcnDplq8WnCJY6T-jkDaJ3XNio223vi_pUKILc40nBOxdHwYSulW7OTk9je5NEexJyebVO7Dvlv-qz1DlAytsLOLHWVPMBywJHXPySAKBF68sspmwa112RvMcpo5tLUFU1n65nGVbeLAfLRvInjTt5VKnR26NyooyKljJkAr3mgkrgXQt69hQZH-3jg3OMV1leNd5vMXC2S3s_5JRhe9jJ0YK1gurqVc" 
                    alt="Product 3" 
                    className="w-full h-full object-cover grayscale-[0.1] group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
                <div>
                  <h4 className="font-headline text-lg mb-1">Túi Cầm Tay Envelope</h4>
                  <span className="font-headline text-lg italic">890 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 md:py-40 bg-surface-container-low overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative">
              <div className="aspect-[5/6] overflow-hidden shadow-2xl">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLuydvu4HD6B9Qzhs2E0BWiXkxGvv7vJXGnULposWqvd87i0BATI-1s1ddokaHUREtM6TF-DqdGMyl739zTPK-vn1ylo9bM27faytiTHDbrdOE129Yq9m0OHnbCN0ejDC6M8r8W4KhwRMc6_FqjRrgGqvRy7G91u_-RDTnXGWTEkQLIndXdVen6gkFluqCwZAG9GLiAt-Qw42YZLpr1VHTkslLrdvjfH4A0VobeFPLaK7jJXrOeZrVJn6EBKNZ2ed4lpr6Qp6gOJo" 
                  alt="Atelier" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 md:p-12 shadow-xl max-w-[280px] hidden md:block">
                <p className="font-label text-[10px] text-on-surface-variant italic leading-relaxed">
                  "Sứ mệnh của chúng tôi là trả lại linh hồn cho trang phục, tôn vinh công sức thầm lặng của những nghệ nhân."
                </p>
              </div>
            </div>
            
            <div className="lg:pl-12">
              <span className="font-label text-secondary mb-6 block">TRIẾT LÝ CỦA CHÚNG TÔI</span>
              <h3 className="font-headline text-4xl md:text-7xl leading-tight mb-12">Chế Tác Những <br /> <span className="italic">Di Sản Hiện Đại</span></h3>
              <div className="space-y-6 text-on-surface-variant font-body text-base leading-relaxed max-w-md font-light">
                <p>
                  Ra đời từ mong muốn kết hợp nghệ thuật may đo truyền thống với sự chính xác của kỹ thuật số, THE ATELIER hoạt động tại điểm giao thoa giữa di sản và đổi mới. 
                </p>
                <p>
                  Chúng tôi tin rằng sự xa xỉ không nằm ở logo, mà nằm ở cảm nhận thực thụ về chất liệu cao cấp và sự lao động vô hình của những đôi tay chuyên gia.
                </p>
              </div>
              <button className="mt-12 border border-outline-variant/50 px-10 py-4 font-label text-[11px] tracking-widest hover:bg-on-surface hover:text-white transition-all duration-500 uppercase">
                ĐỌC CÂU CHUYỆN
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 md:py-40 px-6 bg-background text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-headline text-4xl md:text-5xl italic mb-6">Tập San</h3>
          <p className="text-on-surface-variant font-body text-base font-light mb-12">
            Đăng ký để nhận lookbook theo mùa, quyền truy cập kho lưu trữ độc quyền và những câu chuyện từ xưởng may.
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-end max-w-xl mx-auto">
            <div className="w-full text-left">
              <label className="font-label text-[9px] text-on-surface-variant mb-2 block font-bold">ĐỊA CHỈ EMAIL</label>
              <input 
                type="email" 
                placeholder="EMAIL@CUA-BAN.COM" 
                className="w-full bg-transparent border-0 border-b border-on-surface py-3 font-label text-[11px] focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            <button className="bg-on-surface text-white px-10 py-4 font-label text-[11px] tracking-widest hover:bg-secondary transition-all w-full md:w-auto uppercase whitespace-nowrap">
              THAM GIA
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
