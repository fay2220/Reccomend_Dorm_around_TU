'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'
import NavbarWithSidebar from '@/components/NavbarWithSidebar';

export default function ClientStatusPage() {
  const [requests, setRequests] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn('No token found. Redirecting...');
          router.push('/');
          return;
        }

        const decoded = jwtDecode(token);
        console.log('Decoded JWT:', decoded);
        const currentUsername = decoded.username;
        setUser({ username: currentUsername });

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request-interest/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('All requests =>', res.data);

        const filtered = res.data.filter((req) => req.username === currentUsername);
        console.log('Filtered requests for user:', filtered);

        setRequests(filtered);
      } catch (err) {
        console.error('Error fetching data:', err);
        router.push('/');
      }
    };

    fetchUserAndRequests();
  }, [router]);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg.jpeg")' }}
    >
      <NavbarWithSidebar />

        <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-10">
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-xl shadow-xl max-h-[500px] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">คำร้องของคุณ</h2>
            {requests.length === 0 ? (
              <p className="text-gray-600">ยังไม่มีคำร้อง</p>
            ) : (
              requests.map((req, index) => (
                <div key={index} className="mb-4 border-b pb-2">
                  <p><strong>Zone:</strong> {req.zone}</p>
                  <p><strong>หอพัก:</strong> {req.dorm_name}</p>
                  <p><strong>Status:</strong> <span className="text-blue-700">{req.status}</span></p>
                  <p><strong>ข้อความ:</strong> {req.message}</p>
                  <p className="text-sm text-gray-500">ส่งเมื่อ: {new Date(req.created_at).toLocaleString('th-TH')}</p>
                </div>
              ))
            )}
          </div>
        </div>
      
    </div>
    
  )}
