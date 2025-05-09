'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import NavbarWithSidebar from "./components/NavbarWithSidebar";

export default function Home() {
  
  return (
    <div className="bg-white min-h-screen">
      <NavbarWithSidebar />
      <h1 className='text-black text-2xl font-bold'>แนะนำหอพักใกล้ ม.ธรรมศาสตร์ รังสิต</h1>
      <div className="flex justify-center">
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
    </div>
  );
}

