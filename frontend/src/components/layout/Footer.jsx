import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="py-5 mt-5">
      <Container className="max-w-screen-2xl">
        <Row className="gy-5">
          {/* Logo & About */}
          <Col lg={4}>
            <h4 className="serif italic mb-4 text-dark">THE ATELIER</h4>
            <p className="text-muted small lh-lg" style={{ maxWidth: '300px' }}>
              Kiến tạo một thế giới của sự xa xỉ tĩnh lặng thông qua thiết kế có chủ đích và sự tinh xảo của nghệ nhân.
            </p>
            <div className="d-flex gap-4 mt-4">
              <a href="#" className="text-muted"><span className="material-symbols-outlined">public</span></a>
              <a href="#" className="text-muted"><span className="material-symbols-outlined">share</span></a>
            </div>
          </Col>

          {/* Navigation & Social */}
          <Col lg={4}>
            <Row>
              <Col xs={6}>
                <span className="font-label text-muted d-block mb-3">ĐIỀU HƯỚNG</span>
                <ul className="list-unstyled d-flex flex-column gap-2">
                  <li><a href="#">BỘ SƯU TẬP</a></li>
                  <li><a href="#">DANH MỤC</a></li>
                  <li><a href="#">TẬP SAN</a></li>
                  <li><a href="#">LƯU TRỮ</a></li>
                </ul>
              </Col>
              <Col xs={6}>
                <span className="font-label text-muted d-block mb-3">MẠNG XÃ HỘI</span>
                <ul className="list-unstyled d-flex flex-column gap-2">
                  <li><a href="#">INSTAGRAM</a></li>
                  <li><a href="#">PINTEREST</a></li>
                  <li><a href="#">LIÊN HỆ</a></li>
                </ul>
              </Col>
            </Row>
          </Col>

          {/* Newsletter */}
          <Col lg={4} className="text-lg-end">
            <span className="font-label text-muted d-block mb-3">BẢN TIN</span>
            <p className="text-muted small mb-4">Hãy là người đầu tiên biết về các đợt ra mắt theo mùa và các buổi bán hàng riêng tư.</p>
            <div className="d-flex gap-2 justify-content-lg-end">
              <a href="#" className="font-label">TUYỂN DỤNG</a>
              <a href="#" className="font-label">ĐIỀU KHOẢN</a>
            </div>
          </Col>
        </Row>

        <div className="mt-5 pt-4 border-top border-light d-flex flex-column flex-md-row justify-content-between gap-3">
          <span className="font-label text-muted small">© 2026 NGUYỄN NGỌC HIỆP. BẢO LƯU MỌI QUYỀN.</span>
          <span className="font-label text-muted small text-md-end">THIẾT KẾ TẠI PARIS / CHẾ TÁC TOÀN CẦU</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
