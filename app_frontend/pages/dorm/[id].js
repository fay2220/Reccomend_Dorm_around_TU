'use client';
import { useEffect, useState ,useRef} from 'react';
import { useRouter } from 'next/router';
import NavbarWithSidebar from '../components/NavbarWithSidebar';

export default function DormDetailPage() {
  const containerRef = useRef(null);
  const [dorm, setDorm] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
  
    // โหลดข้อมูลหอพัก
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dorm/${id}/`)
      .then(res => res.json())
      .then(data => setDorm(data));
  }, [id]);
  
  // แก้ขนาด iframe หลัง dorm ถูกโหลด
  useEffect(() => {
    const iframe = containerRef.current?.querySelector('iframe');
    if (iframe) {
      iframe.removeAttribute('width');
      iframe.removeAttribute('height');
      iframe.classList.add('w-full', 'h-[300px]', 'rounded-lg');
    }
  }, [dorm]);
   
  


  if (!dorm) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-gray-900">
      <NavbarWithSidebar />

      {/* Header */}
      <div className="bg-gray-800 text-white py-5 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-3">{dorm.name}</h1>
      </div>

      {/* Main Image */}
      {dorm.images[0] && (
        <div className="flex justify-center mt-6">
          <img
            src={dorm.images[0].image_url}
            alt="Main Dorm Image"
            className="max-w-[600px] w-full h-auto object-cover rounded-xl shadow"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Description Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">🏡 รายละเอียดหอพัก</h2>
          <div className="p-4 border rounded-xl">
            <p className="text-lg max-w-4xl mx-auto">{dorm.description}</p>
          </div>
        </div>

        {/* Room Types */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">💡 ประเภทห้องพัก</h2>
          <div className="space-y-6">
            {dorm.room_types.map((room, i) => (
              <div key={i} className="p-4 border rounded-xl">
                <h3 className="text-lg font-bold mb-1">{room.type_name}</h3>
                <p className="text-sm text-gray-700">ขนาด: {room.size_sqm} ตร.ม.</p>
                <p className="text-sm text-gray-700">
                  ราคา: {parseFloat(room.price_per_month).toLocaleString()} บาท / เดือน
                </p>
                <p className="mt-2 text-gray-800">{room.description}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  {room.images.map((img, j) => (
                    <img
                      key={j}
                      src={img.image_url}
                      alt="room"
                      className="w-full sm:w-[500px] h-[350px] object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Map */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">📍 ที่ตั้ง</h2>
          <div
              ref={containerRef}
              className="w-full max-w-5xl mx-auto flex justify-center"
              dangerouslySetInnerHTML={{ __html: dorm?.location_embed }}
            />
          </div>
      </div>
    </div>
  );
}