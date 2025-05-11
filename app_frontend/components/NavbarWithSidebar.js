// components/NavbarWithSidebar.js
'use client';

import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';


export default function NavbarWithSidebar() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const userUrl = process.env.NEXT_PUBLIC_API_URL_USER
  const [currentUser, setCurrentUser] = useState(null);
  const [isSuperUser, setIsSuperUser] = useState(false);

  const [sidebarActive, setSidebarActive] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [address, setAddress] = useState('');

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

  // ฟังก์ชันจัดการเข้าสู่ระบบ
  const submitLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${userUrl}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        // เก็บ token ลง localStorage
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
  
        // Decode JWT เพื่อดูว่าเป็น superuser หรือไม่
        try {
          const decoded = jwtDecode(data.access);
          console.log("🎯 decoded JWT:", decoded);
          console.log("decoded is_superuser =>", decoded.is_superuser);
  
          const usernameFromToken = decoded.username || username;
          const isSuperUserFromToken = decoded.is_superuser === true;
  
          setCurrentUser(usernameFromToken);
          setIsSuperUser(isSuperUserFromToken);
          localStorage.setItem("username", usernameFromToken);
  
        } catch (err) {
          console.error(" JWT decode failed:", err);
          setIsSuperUser(false);
        }
  
        // เคลียร์ฟอร์มและปิด modal
        setUsername('');
        setPassword('');
        showSuccess('เข้าสู่ระบบสำเร็จ!');
        closeLogin();
      } else {
        alert('เข้าสู่ระบบล้มเหลว: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    }
  };
  // ฟังก์ชันจัดการออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentUser(null);
    setIsSuperUser(false);
    setUsername('');
    setPassword('');
    closeSidebar();
  };

  // ฟังก์ชันจัดการสมัครสมาชิก
  const submitRegister = async (e) => {
    e.preventDefault();
    // แยกชื่อ-นามสกุลจาก fullName (ชื่อจริง = คำแรก, นามสกุล = คำที่เหลือ)
    const [firstname, ...rest] = fullName.trim().split(' ');
    const lastname = rest.join(' ').trim();

    try {
      const res = await fetch(`${userUrl}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          firstname,
          lastname,
          email,
          tel,
          address
        })
      });
      const data = await res.json();

      if (res.ok) {
        showSuccess('สมัครสมาชิกสำเร็จ!');
        closeRegister();
        // รีเซ็ตฟอร์มสมัครสมาชิก
        setUsername('');
        setPassword('');
        setFullName('');
        setEmail('');
        setTel('');
        setAddress('');
      } else {
        alert('สมัครไม่สำเร็จ: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาด: ' + err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.username);
        setIsSuperUser(decoded.is_superuser === true);  // ตรวจสอบตรงนี้
        console.log("🧠 loaded from localStorage:", decoded);
      } catch (e) {
        console.warn("JWT decode failed", e);
      }
    }
  }, []);
  return (
    <>
      {/* Success Toast ข้อความแจ้งเตือนเมื่อทำงานสำเร็จ */}
      {successMessage && <div className="success-toast">{successMessage}</div>}

      {/* Navbar ส่วนหัว */}
      <header className="navbar">
        <div className="logo">PROJECT 2X</div>
        <nav>
          <i className="bi bi-person-circle cursor-pointer" onClick={toggleSidebar}></i>
        </nav>
      </header>

      {/* Sidebar เมนูด้านข้าง */}
      <div className={`sidebar${sidebarActive ? ' active' : ''}`}>
        <button onClick={closeSidebar} className="text-2xl p-4">&times;</button>
        <div className="flex flex-col gap-4 px-4">
          {currentUser ? (
            <>
              {/* แสดงชื่อผู้ใช้และไอคอนผู้ใช้ */}
              <div className="text-center text-black">
                <i className="bi bi-person-circle text-3xl"></i>
                <p className="mt-2 font-semibold">{currentUser}</p>
              </div>
              {/* เมนูสำหรับผู้ใช้ทั่วไป */}
              <button className="bg-gray-200 text-black py-2 rounded mb-2 hover:bg-gray-300">
                ดูสถานะคำร้อง
              </button>
              
              {/* เมนูเพิ่มเติมสำหรับผู้ดูแลระบบ (แสดงเมื่อเป็น superuser) */}
              {console.log("Current state: user =", currentUser, "super =", isSuperUser)}
              {isSuperUser && (
                    <>
                        <button className="sidebar-button bg-yellow-500 hover:bg-yellow-600 text-white">
                        แดชบอร์ด
                        </button>
                        <Link href="/dorm/manage">
                          <button className="sidebar-button bg-blue-500 hover:bg-blue-600 text-white" >
                          แก้ไขรายละเอียดหอพัก
                          </button>
                        </Link>
                    </>
                    )}
              {/* ปุ่มออกจากระบบ */}
              <button onClick={handleLogout} className="bg-red-600 text-white py-2 rounded mt-2">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <>
              {/* ปุ่มเข้าสู่ระบบ/สมัครสมาชิก (แสดงเมื่อยังไม่ได้ล็อกอิน) */}
              <button className="action-btn" onClick={openLogin}>เข้าสู่ระบบ</button>
              <button className="action-btn" onClick={openRegister}>สมัครสมาชิก</button>
            </>
          )}
        </div>
      </div>

      {/* Login Modal (หน้าต่างเข้าสู่ระบบ) */}
      {loginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow-md w-96 space-y-4" onSubmit={submitLogin}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-black font-bold">เข้าสู่ระบบ</h2>
              <button type="button" className="text-xl text-black font-bold" onClick={closeLogin}>
                &times;
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full border p-2" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full border p-2" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" className="bg-blue-600 text-white py-2 w-full rounded">
              เข้าสู่ระบบ
            </button>
            <p className="text-blue-600 text-sm cursor-pointer" onClick={openRegister}>
              ยังไม่มีบัญชี? สมัครสมาชิก
            </p>
          </form>
        </div>
      )}

      {/* Register Modal (หน้าต่างสมัครสมาชิก) */}
      {registerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form className="bg-white p-6 rounded shadow-md w-[500px] space-y-4" onSubmit={submitRegister}>
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-black font-bold">สมัครสมาชิก</h2>
              <button type="button" className="text-xl text-black font-bold" onClick={closeRegister}>
                &times;
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Username" 
              className="w-full border p-2" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full border p-2" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="ชื่อ-นามสกุล" 
              className="w-full border p-2" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="อีเมล์" 
              className="w-full border p-2" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="เบอร์โทร" 
              className="w-full border p-2" 
              value={tel} 
              onChange={(e) => setTel(e.target.value)} 
              required 
            />
            <textarea 
              placeholder="ที่อยู่" 
              className="w-full border p-2" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
                สมัครสมาชิก
              </button>
              <button type="button" onClick={closeRegister} className="bg-red-600 text-white py-2 px-4 rounded">
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}