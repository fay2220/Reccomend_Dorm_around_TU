'use client';

import React, { useEffect, useState } from 'react';
import AddDormForm from './DormAdd';
import EditDormForm from './EditDorm';
import NavbarWithSidebar from './NavbarWithSidebar';

export default function DormPage() { //ตั้งค่าเริ่มต้นให้อยู่ในหน้าเพิ่มก่่อน 
  const [mode, setMode] = useState('add');

  return (
    <div>
      <NavbarWithSidebar />
      <div className="bg-gray-100 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">

          {/* Tab toggle */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setMode('add')}
              className={`px-4 py-2 font-medium text-sm rounded-t-md ${
                mode === 'add'
                  ? 'bg-white text-blue-600 border-x border-t border-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              เพิ่ม
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 font-medium text-sm rounded-t-md ml-2 ${
                mode === 'edit'
                  ? 'bg-white text-blue-600 border-x border-t border-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              แก้ไข
            </button>
          </div>

          {/* Form section */}
          {mode === 'add' ? <AddDormForm /> : <EditDormForm />}
        </div>
      </div>
    </div>
  );
}