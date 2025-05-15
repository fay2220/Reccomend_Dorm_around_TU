'use client';

import React, { useState, useEffect } from 'react';
import BackButton from './BackButton';

export default function AddDormForm({ mode = 'add', initialData = null }) {
  const [dorm, setDorm] = useState({
    name: '',
    zone: '',
    description: '',
    images: [''],
    room_types: [
      {
        type_name: '',
        price_per_month: '',
        size_sqm: '',
        is_available: true,
        description: '',
        images: [''],
      },
    ],
    location_embed: '',
  });

  const handleChange = (field, value) => {
    setDorm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...dorm.images];
    updatedImages[index] = value;
    setDorm((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setDorm((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    if (dorm.images.length > 1) {
      const updatedImages = dorm.images.filter((_, i) => i !== index);
      setDorm((prev) => ({ ...prev, images: updatedImages }));
    }
  };

  const handleRoomChange = (i, field, value) => {
    const newRooms = [...dorm.room_types];
    newRooms[i][field] = value;
    setDorm((prev) => ({ ...prev, room_types: newRooms }));
  };

  const handleRoomImageChange = (i, j, value) => {
    const newRooms = [...dorm.room_types];
    newRooms[i].images[j] = value;
    setDorm((prev) => ({ ...prev, room_types: newRooms }));
  };

  const addRoomType = () => {
    setDorm((prev) => ({
      ...prev,
      room_types: [
        ...prev.room_types,
        {
          type_name: '',
          price_per_month: '',
          size_sqm: '',
          is_available: true,
          description: '',
          images: [''],
        },
      ],
    }));
  };

  const removeRoomType = (index) => {
    if (dorm.room_types.length > 1) {
      const updatedRoomTypes = dorm.room_types.filter((_, i) => i !== index);
      setDorm((prev) => ({ ...prev, room_types: updatedRoomTypes }));
    }
  };

  const addRoomImage = (roomIndex) => {
    const updatedRoomTypes = [...dorm.room_types];
    updatedRoomTypes[roomIndex].images.push('');
    setDorm((prev) => ({ ...prev, room_types: updatedRoomTypes }));
  };

  const removeRoomImage = (roomIdx, imageIdx) => {
    const updatedRoomTypes = [...dorm.room_types];
    if (updatedRoomTypes[roomIdx].images.length > 1) {
      updatedRoomTypes[roomIdx].images = updatedRoomTypes[roomIdx].images.filter((_, i) => i !== imageIdx);
      setDorm((prev) => ({ ...prev, room_types: updatedRoomTypes }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...dorm,
        images: dorm.images.map((url) => ({ image_url: url })),
        room_types: dorm.room_types.map(({ id, ...room }) => ({
          ...room,
          images: room.images.map((url) => ({ image_url: url })),
        })),
      };

      console.log('Submitting:', payload);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registerDorm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert('บันทึกสำเร็จ');
    } catch (err) {
      console.error('Submission Error:', err);
      alert('เกิดข้อผิดพลาดขณะบันทึก');
    }
  };

  useEffect(() => {
    if (initialData) {
      const sanitized = {
        ...initialData,
        room_types: initialData.room_types.map(({ id, ...r }) => r),
      };
      setDorm(sanitized);
    }
  }, [initialData]);

  return (
    <div className="bg-white min-h-screen">
      <BackButton />
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white shadow-md rounded-lg mt-6">
        <h2 className="text-2xl font-bold text-gray-800">เพิ่ม/แก้ไขข้อมูลหอพัก</h2>

        <div className="flex gap-4">
          <input
            placeholder="ชื่อหอพัก"
            value={dorm.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          />
          <select
            className="w-full border p-2 rounded"
            value={dorm.zone}
            onChange={(e) => handleChange('zone', e.target.value)}
          >
            <option value="">-- เลือกโซน --</option>
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((z) => (
              <option key={z} value={z}>
                โซน {z}
              </option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="คำอธิบายหอพัก"
          value={dorm.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />

        <div>
          <label className="block font-semibold text-gray-700 mb-2">รูปภาพหอพัก</label>
          {dorm.images.map((url, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                value={url}
                placeholder={`Image URL ${idx + 1}`}
                onChange={(e) => handleImageChange(idx, e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              {dorm.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(idx)}
                  className="text-red-500 text-xl font-bold px-2"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            + เพิ่มรูป
          </button>
        </div>

        <div className="space-y-6">
          {dorm.room_types.map((room, i) => (
            <div key={i} className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-lg">Room Type {i + 1}</h4>
                {dorm.room_types.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoomType(i)}
                    className="text-red-500 text-xl font-bold px-2"
                  >
                    ×
                  </button>
                )}
              </div>
              <input
                placeholder="ชื่อห้อง"
                value={room.type_name}
                onChange={(e) => handleRoomChange(i, 'type_name', e.target.value)}
                className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                placeholder="ราคา / เดือน"
                value={room.price_per_month}
                onChange={(e) => handleRoomChange(i, 'price_per_month', e.target.value)}
                className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                placeholder="ขนาดห้อง (ตร.ม.)"
                value={room.size_sqm}
                onChange={(e) => handleRoomChange(i, 'size_sqm', e.target.value)}
                className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <textarea
                placeholder="รายละเอียดห้อง"
                value={room.description}
                onChange={(e) => handleRoomChange(i, 'description', e.target.value)}
                className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
                rows={2}
              />
              <label className="block mb-1 font-medium text-gray-700">สถานะห้องว่าง</label>
              <select
                value={room.is_available ? 'true' : 'false'}
                onChange={(e) => handleRoomChange(i, 'is_available', e.target.value === 'true')}
                className="block w-full mb-2 p-2 border border-gray-300 rounded-md"
              >
                <option value="true">ว่าง</option>
                <option value="false">ไม่ว่าง</option>
              </select>
              {room.images.map((img, j) => (
                <div key={j} className="flex items-center gap-2 mb-2">
                  <input
                    value={img}
                    placeholder={`Room Image ${j + 1}`}
                    onChange={(e) => handleRoomImageChange(i, j, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                  {room.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoomImage(i, j)}
                      className="text-red-500 text-xl font-bold px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addRoomImage(i)}
                className="px-3 py-1 bg-blue-400 text-white rounded-md"
              >
                + เพิ่มรูปห้อง
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRoomType}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            + เพิ่ม Room Type
          </button>
        </div>

        <textarea
          placeholder="Google Maps Embed"
          value={dorm.location_embed}
          onChange={(e) => handleChange('location_embed', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={3}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={() => router.back()}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
