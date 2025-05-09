

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const toggleSidebar = () => setSidebarActive(!sidebarActive);
  const closeSidebar = () => setSidebarActive(false);

  const openRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };
  const closeRegister = () => setRegisterOpen(false);
  const openLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };
  const closeLogin = () => setLoginOpen(false);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const submitRegister = (e) => {
    e.preventDefault();
    showSuccess('สมัครสมาชิกสำเร็จ!');
    closeRegister();
  };

  const submitLogin = (e) => {
    e.preventDefault();
    showSuccess('เข้าสู่ระบบสำเร็จ!');
    closeLogin();
  };

  
  return (
    <>
      {successMessage && (
        <div className="success-toast">
          {successMessage}
        </div>
      )}

      <header className="navbar">
        <div className="logo">PROJECT 2X</div>
        <nav>
          <i id="userIcon" className="bi bi-person-circle" onClick={toggleSidebar}></i>
        </nav>
      </header>

      <div id="sidebar" className={`sidebar${sidebarActive ? ' active' : ''}`}>
        <button onClick={closeSidebar} className="close-btn">×</button>
        <button className="action-btn" onClick={openLogin}>เข้าสู่ระบบ</button>
        <button className="action-btn" onClick={openRegister}>สมัครสมาชิก</button>
      </div>

      <h1>แนะนำหอพักใกล้ ม.ธรรมศาสตร์ รังสิต</h1>
      <div className="maps">
        <Image src="/map.jpg" alt="แผนที่โซนหอพัก" width={600} height={400} />
      </div>

      <section className="dorm-grid">
        {[
          { src: 'jpark.png', name: 'J-PARK', zone: 'A' },
          { src: '1.png', name: 'เชียงราก 1', zone: 'B' },
          { src: '2.png', name: 'เชียงราก 2', zone: 'C' },
          { src: 'kave.png', name: 'Kave', zone: 'D' },
          { src: 'Dcon.png', name: 'Dcondo', zone: 'E' },
          { src: 'Sunta.png', name: 'Sunta', zone: 'F' },
          { src: 'Tu dome.png', name: 'TU Dome', zone: 'G' },
          { src: 'golf view.png', name: 'Golf View', zone: 'H' },
        ].map(({ src, name, zone }) => (
          <Link key={name} href={`/zone/${zone}`} className="dorm-card">
            <Image src={`/${src}`} alt={name} width={300} height={140} />
            <h3>{name}</h3>
            <p>โซน {zone}</p>
          </Link>
        ))}
      </section>

      {registerOpen && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close" onClick={closeRegister}>×</span>
            <h2>สมัครสมาชิก</h2>
            <form onSubmit={submitRegister}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <input type="text" placeholder="ชื่อ-นามสกุล" required />
              <input type="email" placeholder="อีเมล์" required />
              <input type="tel" placeholder="เบอร์โทร" required />
              <textarea placeholder="ที่อยู่" required></textarea>
              <div className="buttons">
                <button type="submit" className="btn-register">สมัครสมาชิก</button>
                <button type="button" className="btn-cancel" onClick={closeRegister}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loginOpen && (
        <div className="modal active">
          <div className="modal-content">
            <span className="close" onClick={closeLogin}>×</span>
            <h2>ลงชื่อเข้าใช้งาน</h2>
            <form onSubmit={submitLogin}>
              <input type="text" placeholder="Username" required />
              <input type="password" placeholder="Password" required />
              <div className="buttons">
                <button type="submit" className="btn-login">เข้าสู่ระบบ</button>
              </div>
              <div className="login-bottom">
                ยังไม่ได้เป็นสมาชิก? <a href="#" onClick={openRegister}>ลงทะเบียน</a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
