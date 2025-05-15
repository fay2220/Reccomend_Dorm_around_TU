'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FloatingRegisterButton() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [zones] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  const [zone, setZone] = useState('');
  const [dorms, setDorms] = useState([]);
  const [selectedDormId, setSelectedDormId] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    tel: '',
    address: '',
  });

  const handleOpen = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนใช้งาน');
      return;
    }
    setIsOpen(true);
    setStep(1);
  };

  useEffect(() => {
    if (zone) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/zone/${zone}/`)
        .then(res => res.json())
        .then(data => setDorms(data))
        .catch(err => console.error("โหลดหอพักล้มเหลว:", err));
    } else {
      setDorms([]);
    }
  }, [zone]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('กรุณาเข้าสู่ระบบก่อนส่งข้อมูล');
      return;
    }

    const payload = {
      dorm_id: selectedDormId,
      zone,
      status: 'รอดำเนินการ',
      message,
      ...formData, // username, email, tel, address
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/request-interest/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('ส่งคำร้องสำเร็จ');
        setIsOpen(false);
        const goHome = confirm('กลับหน้าแรกหรือไม่? กด "ยกเลิก" เพื่อดูสถานะ');
        router.push(goHome ? '/' : '/client');
      } else {
        const err = await res.json();
        console.error("ส่งคำร้องล้มเหลว:", err);
        alert('ส่งคำร้องไม่สำเร็จ: ' + JSON.stringify(err));
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาด:", err);
      alert("ไม่สามารถส่งข้อมูลได้");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
      >
        ลงทะเบียนสนใจหอพัก
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-[400px] space-y-4">
            <h2 className="text-xl font-semibold text-center">ลงทะเบียนความสนใจ</h2>

            {step === 1 && (
              <>
                <select
                  className="w-full border p-2"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                >
                  <option value="">-- เลือกโซน --</option>
                  {zones.map((z) => (
                    <option key={z} value={z}>โซน {z}</option>
                  ))}
                </select>

                <select
                  className="w-full border p-2"
                  value={selectedDormId}
                  onChange={(e) => setSelectedDormId(e.target.value)}
                  disabled={!zone}
                >
                  <option value="">-- เลือกหอพัก --</option>
                  {dorms.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>

                <textarea
                  placeholder="ข้อความเพิ่มเติม (ถ้ามี)"
                  className="w-full border p-2"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    ยกเลิก
                  </button>
                  <button
                    disabled={!selectedDormId}
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    ถัดไป
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <input
                  name="username"
                  placeholder="ชื่อผู้ใช้"
                  className="w-full border p-2"
                  value={formData.username}
                  onChange={handleChange}
                />
                <input
                  name="email"
                  placeholder="อีเมล"
                  className="w-full border p-2"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  name="tel"
                  placeholder="เบอร์โทร"
                  className="w-full border p-2"
                  value={formData.tel}
                  onChange={handleChange}
                />
                <input
                  name="address"
                  placeholder="ที่อยู่"
                  className="w-full border p-2"
                  value={formData.address}
                  onChange={handleChange}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    ส่งคำร้อง
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
