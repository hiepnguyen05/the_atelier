import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 h-100">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7JPY3Z64aUIlKLGpa6uHyZKtSsRCCKvjQe2I028gxDDCHs55Qa7MB3afSMz-71UK9yH5C1SgonR0tLlIntr2C6EAHFsW5PyZrU3wKJHjxPLWAtGUo9AmzyTKw4Im-HSZGhY6L8-lunDf1Ay4_Qu3ezoolPL4ojIJBhlFJdEybdVfkMws33RWE0t9-_zTcbt4yRoRc_-QPvd0BrNr4AW3fvnNFW88YtgshrXLgJMsW00UdY_OMLBhtJo2d266Q8pONOA6ftiZnvu0" 
            alt="Editorial Hero" 
            className="hero-image h-100 w-100"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="position-absolute bottom-0 start-0 p-4 p-md-5 mb-md-5 w-100">
          <span className="font-label text-white mb-4 d-block" style={{ fontSize: '10px', letterSpacing: '0.3em' }}>XUÂN / HÈ 2024</span>
          <h2 className="hero-title">
            Cấu Trúc <br /> 
            <span className="ps-md-5 ms-md-5">Vô Thường</span>
          </h2>
          <Row className="align-items-center mt-5 gy-4">
            <Col md="auto">
              <Button className="btn-premium">
                KHÁM PHÁ BỘ SƯU TẬP
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </Button>
            </Col>
            <Col md={4} lg={3}>
              <p className="text-white-50 small m-0 lh-lg font-light">
                Cuộc đối thoại giữa lụa mềm mại và những hình khối kiến trúc. Định nghĩa lại di sản hiện đại qua lăng kính của Digital Atelier.
              </p>
            </Col>
          </Row>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-section px-4 px-md-5 bg-background">
        <Container fluid className="px-0">
          <Row className="mb-5 align-items-end gy-4">
            <Col lg={6}>
              <span className="font-label text-secondary mb-4 d-block">SẢN PHẨM MỚI</span>
              <h3 className="display-4 serif italic mb-4" style={{ fontSize: '3rem' }}>Những Thiết Yếu Tuyển Chọn</h3>
              <p className="text-muted font-light lh-lg" style={{ maxWidth: '500px' }}>
                Từng món đồ được tạo tác với ý niệm độc bản. Những thiết kế mới nhất của chúng tôi tập trung vào sự phong phú của xúc giác và tính ứng dụng vượt thời gian.
              </p>
            </Col>
            <Col lg={6} className="text-lg-end pb-3">
              <a href="#" className="link-hover text-uppercase">XEM TẤT CẢ DANH MỤC</a>
            </Col>
          </Row>

          <Row className="gx-5 gy-5 mt-4">
            {/* Large Feature */}
            <Col md={7}>
              <div className="product-card">
                <div className="product-image-wrapper mb-4 position-relative" style={{ aspectRatio: '4/5' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6RCBogpyB1f3Wp766SQLOW_0_W8teUFyhzVg9TtAJT1m__IzGxqmC8uqS3k0lvTMBW3X34jjCevvZHcZ2n06FN_J8a647zeyz0KmHh6MhcoyonoAQ2j4FVMqGsHulcll8ofx24FNhMTvLIt6MC4teLk4XSVzO8WxbVRTc_GUqYdOW8dQlTjIXlRCb3X7APZ21YPutFo9rKJZ2NEZ8F4Zy2Rg_861RzCzor_rCY8pS9ZFr0CMEkdRaPazao1CrrOkPXPkDOhl-uJg" 
                    alt="Featured Product" 
                    className="product-image"
                  />
                  <div className="position-absolute top-0 left-0 m-4 bg-white bg-opacity-75 glass px-3 py-2 font-label" style={{ fontSize: '9px' }}>THIẾT KẾ ĐẶC TRƯNG</div>
                </div>
                <div className="d-flex justify-content-between align-items-start px-2">
                  <div>
                    <h4 className="h5 serif mb-1">Áo Khoác Architect Oversized</h4>
                    <span className="font-label text-muted" style={{ fontSize: '9px' }}>LEN NGUYÊN BẢN / MÀU CÁT</span>
                  </div>
                  <span className="serif h4 italic">1,240 USD</span>
                </div>
              </div>
            </Col>

            {/* Small Stacked */}
            <Col md={5} className="d-flex flex-column gap-5 pt-md-5 mt-md-5">
              <div className="product-card">
                <div className="product-image-wrapper mb-4" style={{ aspectRatio: '1/1' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAL-b-0M1Km7kmr39S4TFygwpirQ5IoWv_SHw_OGoCi-nK_ezK8gHq3X0GXZN4ZKHufCsLfRRaOGRT30F-8Ujf5CfuzUAMvaoKBfk2ryHsaCP3zzlD8uDRUrqX00QOBIr_QR6eSU5G42QHGejct5TQtM59mYx6VbB1vAladPkfaGmbx4Laqa6ccNQnodDDPEkbv4vGOBz0eqL2nkHMJgLg-t1uts2gIKMbPImcjtUkgYCybllZ7mKe0-evgNhB9j7Dm5dLaAL9LtE" 
                    alt="Product 2" 
                    className="product-image"
                  />
                </div>
                <div className="px-2">
                  <h4 className="h6 serif mb-1">Áo Sơ Mi Lụa Organza</h4>
                  <span className="serif h6 italic">480 USD</span>
                </div>
              </div>

              <div className="product-card">
                <div className="product-image-wrapper mb-4" style={{ aspectRatio: '3/4' }}>
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCY8kNl67XW9vuf3-WBMHvz1VtMxxc2xi8OYvf5L1EK1dmNcnDplq8WnCJY6T-jkDaJ3XNio223vi_pUKILc40nBOxdHwYSulW7OTk9je5NEexJyebVO7Dvlv-qz1DlAytsLOLHWVPMBywJHXPySAKBF68sspmwa112RvMcpo5tLUFU1n65nGVbeLAfLRvInjTt5VKnR26NyooyKljJkAr3mgkrgXQt69hQZH-3jg3OMV1leNd5vMXC2S3s_5JRhe9jJ0YK1gurqVc" 
                    alt="Product 3" 
                    className="product-image"
                  />
                </div>
                <div className="px-2">
                  <h4 className="h6 serif mb-1">Túi Cầm Tay Envelope</h4>
                  <span className="serif h6 italic">890 USD</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-section bg-light overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-low) !important' }}>
        <Container className="max-w-screen-2xl">
          <Row className="align-items-center gx-lg-5 gy-5">
            <Col lg={6} className="position-relative">
              <div className="story-image-wrapper shadow-sm">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLuydvu4HD6B9Qzhs2E0BWiXkxGvv7vJXGnULposWqvd87i0BATI-1s1ddokaHUREtM6TF-DqdGMyl739zTPK-vn1ylo9bM27faytiTHDbrdOE129Yq9m0OHnbCN0ejDC6M8r8W4KhwRMc6_FqjRrgGqvRy7G91u_-RDTnXGWTEkQLIndXdVen6gkFluqCwZAG9GLiAt-Qw42YZLpr1VHTkslLrdvjfH4A0VobeFPLaK7jJXrOeZrVJn6EBKNZ2ed4lpr6Qp6gOJo" 
                  alt="Atelier" 
                  className="w-100 h-100 object-fit-cover"
                />
              </div>
              <div className="position-absolute bottom-0 end-0 bg-white p-5 d-none d-md-block shadow-sm translate-middle-x mb-n4 me-n4" style={{ width: '280px' }}>
                <p className="font-label text-muted italic m-0 lh-relaxed" style={{ fontSize: '10px' }}>
                  "Sứ mệnh của chúng tôi là trả lại linh hồn cho trang phục, tôn vinh công sức thầm lặng của những nghệ nhân."
                </p>
              </div>
            </Col>
            <Col lg={6} className="ps-lg-5">
              <span className="font-label text-secondary mb-4 d-block">TRIẾT LÝ CỦA CHÚNG TÔI</span>
              <h3 className="display-4 mb-5" style={{ fontSize: '3.5rem' }}>Chế Tác Những <br /> <span className="serif italic">Di Sản Hiện Đại</span></h3>
              <div className="text-muted font-light lh-lg space-y-4" style={{ maxWidth: '450px' }}>
                <p>
                  Ra đời từ mong muốn kết hợp nghệ thuật may đo truyền thống với sự chính xác của kỹ thuật số, THE ATELIER hoạt động tại điểm giao thoa giữa di sản và đổi mới. 
                </p>
                <p className="mt-4">
                  Chúng tôi tin rằng sự xa xỉ không nằm ở logo, mà nằm ở cảm nhận thực thụ về chất liệu cao cấp và sự lao động vô hình của những đôi tay chuyên gia.
                </p>
              </div>
              <Button className="btn-outline-premium mt-5">
                ĐỌC CÂU CHUYỆN
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="py-section bg-background text-center">
        <Container>
          <h3 className="serif italic display-5 mb-4">Tập San</h3>
          <p className="text-muted font-light mb-5 mx-auto" style={{ maxWidth: '500px' }}>
            Đăng ký để nhận lookbook theo mùa, quyền truy cập kho lưu trữ độc quyền và những câu chuyện từ xưởng may.
          </p>
          <Form className="mx-auto d-flex flex-column flex-md-row gap-4 align-items-end" style={{ maxWidth: '600px' }}>
            <Form.Group className="flex-grow-1 text-start w-100">
              <Form.Label className="font-label text-muted mb-2">ĐỊA CHỈ EMAIL</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="EMAIL@CUA-BAN.COM" 
                className="bg-transparent border-0 border-bottom border-dark rounded-0 shadow-none px-0 py-3 font-label"
                style={{ fontSize: '12px' }}
              />
            </Form.Group>
            <Button className="btn-premium w-100 w-md-auto py-3">THAM GIA</Button>
          </Form>
        </Container>
      </section>
    </div>
  );
};

export default Home;
