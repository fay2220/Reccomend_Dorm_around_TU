'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditDormForm() {
  const router = useRouter();
  const [zone, setZone] = useState('');
  const [dormList, setDormList] = useState([]);
  const [selectedDormId, setSelectedDormId] = useState('');
  const [dormData, setDormData] = useState(null);

  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  useEffect(() => {
    if (zone) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/zone/${zone}`)
        .then((res) => res.json())
        .then((data) => setDormList(data));
    } else {
      setDormList([]);
    }
  }, [zone]);

  useEffect(() => {
    if (selectedDormId) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dorm/${selectedDormId}/`)
        .then((res) => {
          if (!res.ok) throw new Error('Dorm not found');
          return res.json();
        })
        .then((data) => setDormData(data))
        .catch((err) => {
          console.error('fetch error:', err);
          setDormData(null);
        });
    } else {
      setDormData(null);
    }
  }, [selectedDormId]);

  const handleChange = (field, value) => {
    setDormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...dormData.images];
    updated[index].image_url = value;
    setDormData({ ...dormData, images: updated });
  };

  const handleAddImage = () => {
    setDormData({ ...dormData, images: [...dormData.images, { image_url: '' }] });
  };

  const handleRemoveImage = (index) => {
    const updated = [...dormData.images];
    updated.splice(index, 1);
    setDormData({ ...dormData, images: updated });
  };

  const handleRoomTypeChange = (index, field, value) => {
    const updated = [...dormData.room_types];
  
    if (field === 'price_per_month' || field === 'size_sqm') {
      updated[index][field] = parseFloat(value); // แปลงเป็น float
    } else if (field === 'is_available') {
      updated[index][field] = value === 'ว่าง';
    } else {
      updated[index][field] = value;
    }
  
    setDormData({ ...dormData, room_types: updated });
  };

  const handleRoomImageChange = (roomIndex, imageIndex, value) => {
    const roomTypes = [...dormData.room_types];
    roomTypes[roomIndex].images[imageIndex].image_url = value;
    setDormData({ ...dormData, room_types: roomTypes });
  };

  const handleAddRoomImage = (roomIndex) => {
    const roomTypes = [...dormData.room_types];
    roomTypes[roomIndex].images.push({ image_url: '' });
    setDormData({ ...dormData, room_types: roomTypes });
  };

  const handleAddRoomType = () => {
    const newRoom = {
      type_name: '',
      price_per_month: '',
      size_sqm: '',
      description: '',
      is_available: true,
      images: [{ image_url: '' }],
    };
    setDormData({ ...dormData, room_types: [...dormData.room_types, newRoom] });
  };

  const handleSubmit = async () => {
    const cleanedRoomTypes = dormData.room_types.map((room) => ({
      ...room,
      price_per_month: parseFloat(room.price_per_month),
      size_sqm: parseFloat(room.size_sqm),
    }));
  
    const payload = {
      ...dormData,
      room_types: cleanedRoomTypes,
    };
  
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dorm/${selectedDormId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  
    alert('บันทึกการแก้ไขสำเร็จ');
    setSelectedDormId('');
    setDormData(null);
  };

  const handleDelete = async () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหอพักนี้?')) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dorm/${selectedDormId}`, {
        method: 'DELETE',
      });
      alert('ลบสำเร็จ');
      router.back();
    }
  };
  const handleRemoveRoomType = (index) => {
    const room = dormData.room_types[index];
  
    // ถ้ามี id แสดงว่าเป็นของใน database → เรียก API ลบก่อน
    if (room.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/roomtype/${room.id}/`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to delete');
          // ลบออกจาก state
          const updated = [...dormData.room_types];
          updated.splice(index, 1);
          setDormData({ ...dormData, room_types: updated });
        })
        .catch((err) => {
          console.error('Delete error:', err);
          alert('ไม่สามารถลบ RoomType ได้');
        });
    } else {
      // ถ้ายังไม่เคยเซฟ ก็ลบออกจาก state ได้เลย
      const updated = [...dormData.room_types];
      updated.splice(index, 1);
      setDormData({ ...dormData, room_types: updated });
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label>เลือกโซน</label>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full border p-2 rounded">
            <option value="">-- เลือกโซน --</option>
            {zones.map((z) => (
              <option key={z} value={z}>โซน {z}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label>เลือกหอพัก</label>
          <select
            value={selectedDormId}
            onChange={(e) => setSelectedDormId(e.target.value)}
            disabled={!zone}
            className="w-full border p-2 rounded"
          >
            <option value="">-- เลือกหอพัก --</option>
            {dormList.map((dorm) => (
              <option key={dorm.id} value={dorm.id}>{dorm.name}</option>
            ))}
          </select>
        </div>
      </div>

      {dormData && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">แบบฟอร์มแก้ไข: {dormData.name}</h3>

          <input
            className="w-full border p-2"
            value={dormData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="ชื่อหอพัก"
          />

          <input
            className="w-full border p-2"
            value={dormData.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
            placeholder="โซน A-H"
          />

          <textarea
            className="w-full border p-2"
            value={dormData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="คำอธิบาย"
          />

          <label className="font-medium">รูปภาพหอพัก</label>
          {dormData.images.map((img, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="w-full border p-2"
                value={img.image_url}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                placeholder={`Image URL ${idx + 1}`}
              />
              <button onClick={() => handleRemoveImage(idx)} className="text-red-500">❌</button>
            </div>
          ))}
          <button onClick={handleAddImage} className="bg-blue-500 text-white px-3 py-1 rounded">+ เพิ่มรูป</button>

          {dormData.room_types.map((room, idx) => (
            <div key={idx} className="relative p-4 mt-4 bg-gray-50 border rounded">
                <button
                onClick={() => handleRemoveRoomType(idx)}
                className="absolute top-2 right-2 text-red-500 text-xl"
              >
                ❌
              </button>
              <h4 className="font-semibold mb-2">Room Type {idx + 1}</h4>
              <input
                value={room.type_name}
                onChange={(e) => handleRoomTypeChange(index, 'type_name', e.target.value)}
              />

              <input
                className="w-full border p-2 my-1"
                value={room.type_name}
                onChange={(e) => handleRoomTypeChange(idx, 'type_name', e.target.value)}
                placeholder="ชื่อห้อง"
              />

              <input
                className="w-full border p-2 my-1"
                value={room.price_per_month}
                onChange={(e) => handleRoomTypeChange(idx, 'price_per_month', e.target.value)}
                placeholder="ราคา / เดือน"
              />

              <input
                className="w-full border p-2 my-1"
                value={room.size_sqm}
                onChange={(e) => handleRoomTypeChange(idx, 'size_sqm', e.target.value)}
                placeholder="ขนาดห้อง (ตร.ม.)"
              />

              <textarea
                className="w-full border p-2 my-1"
                value={room.description}
                onChange={(e) => handleRoomTypeChange(idx, 'description', e.target.value)}
                placeholder="รายละเอียดห้อง"
              />

              <select
                className="w-full border p-2 my-1"
                value={room.is_available ? 'ว่าง' : 'ไม่ว่าง'}
                onChange={(e) => handleRoomTypeChange(idx, 'is_available', e.target.value === 'ว่าง')}
              >
                <option value="ว่าง">ว่าง</option>
                <option value="ไม่ว่าง">ไม่ว่าง</option>
              </select>

              {room.images.map((img, imgIdx) => (
                <input
                  key={imgIdx}
                  className="w-full border p-2 my-1"
                  value={img.image_url}
                  onChange={(e) => handleRoomImageChange(idx, imgIdx, e.target.value)}
                  placeholder={`Room Image ${imgIdx + 1}`}
                />
              ))}

              <button onClick={() => handleAddRoomImage(idx)} className="bg-blue-500 text-white px-3 py-1 rounded">+ เพิ่มรูปห้อง</button>
            </div>
          ))}

          <button onClick={handleAddRoomType} className="bg-green-500 text-white px-4 py-2 rounded">+ เพิ่ม Room Type</button>

          <div className="flex gap-4 mt-6">
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">ลบหอพัก</button>
            <button onClick={() => router.back()} className="bg-gray-300 text-black px-4 py-2 rounded">ยกเลิก</button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded ml-auto">บันทึกการแก้ไข</button>
          </div>
        </div>
      )}
    </div>
  );
}

