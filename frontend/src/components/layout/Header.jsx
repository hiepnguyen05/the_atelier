import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Collapse } from 'react-bootstrap';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed-top glass border-bottom">
      {/* Top Bar - Fixed 80px */}
      <Container fluid className="px-4 px-md-5 d-flex align-items-center position-relative" style={{ height: '80px' }}>
        
        {/* Left: Hamburger (Mobile) & Nav (Desktop) */}
        <div className="flex-1 d-flex align-items-center">
          <button 
            onClick={() => setOpen(!open)}
            className="border-0 p-0 shadow-none d-md-none me-3 bg-transparent d-flex align-items-center"
            type="button"
            aria-expanded={open}
          >
            <span className="material-symbols-outlined text-dark" style={{ fontSize: '28px' }}>
              {open ? 'close' : 'menu'}
            </span>
          </button>
          
          <Nav className="d-none d-md-flex align-items-center gap-4">
            <Nav.Link href="#" className="active border-bottom border-dark pb-1">Bộ Sưu Tập</Nav.Link>
            <Nav.Link href="#">Danh Mục</Nav.Link>
            <Nav.Link href="#">Câu Chuyện</Nav.Link>
            <Nav.Link href="#">Lưu Trữ</Nav.Link>
          </Nav>
        </div>

        {/* Center: Brand Logo - Absolute Center */}
        <div className="position-absolute start-50 translate-middle-x">
          <Navbar.Brand href="/" className="m-0 p-0">
            <h1 className="m-0 text-dark tracking-widest-extra text-uppercase h4" style={{ letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
              THE ATELIER
            </h1>
          </Navbar.Brand>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex-1 d-flex justify-content-end align-items-center gap-2 gap-md-4">
          <Form className="d-none d-lg-flex position-relative align-items-center">
            <span className="material-symbols-outlined position-absolute start-0 text-muted" style={{ fontSize: '14px' }}>search</span>
            <FormControl
              type="text"
              placeholder="TÌM KIẾM"
              className="bg-transparent border-0 shadow-none ps-4 text-uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.1em', width: '100px' }}
            />
          </Form>
          <Nav.Link href="#" className="p-0">
            <span className="material-symbols-outlined text-dark">shopping_bag</span>
          </Nav.Link>
          <Nav.Link href="#" className="p-0 d-none d-sm-block">
            <span className="material-symbols-outlined text-dark">person</span>
          </Nav.Link>
        </div>
      </Container>

      {/* Mobile Menu Dropdown - Slides down below the 80px bar */}
      <Collapse in={open}>
        <div className="d-md-none bg-white border-top shadow-sm">
          <Container className="py-4">
            <Nav className="flex-column gap-3">
              <Nav.Link href="#" className="p-0 text-dark font-label" style={{ fontSize: '11px', letterSpacing: '0.25em' }} onClick={() => setOpen(false)}>BỘ SƯU TẬP</Nav.Link>
              <Nav.Link href="#" className="p-0 text-dark font-label" style={{ fontSize: '11px', letterSpacing: '0.25em' }} onClick={() => setOpen(false)}>DANH MỤC</Nav.Link>
              <Nav.Link href="#" className="p-0 text-dark font-label" style={{ fontSize: '11px', letterSpacing: '0.25em' }} onClick={() => setOpen(false)}>CÂU CHUYỆN</Nav.Link>
              <Nav.Link href="#" className="p-0 text-dark font-label" style={{ fontSize: '11px', letterSpacing: '0.25em' }} onClick={() => setOpen(false)}>LƯU TRỮ</Nav.Link>
              <hr className="my-3 opacity-10" />
              <Nav.Link href="#" className="p-0 d-flex align-items-center gap-2 text-muted font-label" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                TÌM KIẾM
              </Nav.Link>
              <Nav.Link href="#" className="p-0 d-flex align-items-center gap-2 text-muted font-label" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                TÀI KHOẢN
              </Nav.Link>
            </Nav>
          </Container>
        </div>
      </Collapse>
    </nav>
  );
};

export default Header;
