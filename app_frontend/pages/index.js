'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarWithSidebar from "../components/NavbarWithSidebar";

export default function Home() {
  
  return (
      <div className="bg-white min-h-screen">
      <NavbarWithSidebar />

      <h1 className="text-black text-2xl font-bold text-center mt-4">แนะนำหอพักใกล้ ม.ธรรมศาสตร์ รังสิต</h1>

      <div className="flex justify-center my-6">
      <Image
        src="/dormmap.png"
        alt="แผนที่โซนหอพัก"
        width={1200}
        height={800}
        className="w-[70vw] max-w-5xl h-auto rounded shadow"
      />
      </div>

      {/*  ส่วนหัวข้อโซนหอพัก พร้อมเส้นคั่น */}
      <div className="border-b border-gray-300 mb-4 mx-6 text-center">
        <h2 className="text-2xl font-bold mb-4">โซนหอพัก</h2>
      </div>

      <section className="dorm-grid px-6">
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
    </div>
  );
}

