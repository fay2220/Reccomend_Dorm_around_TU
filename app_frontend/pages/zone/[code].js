'use client';

export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import NavbarWithSidebar from "../../components/NavbarWithSidebar";
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import Image from 'next/image';

export default function ZonePage() {
  const [dorms, setDorms] = useState([]);
  const router = useRouter();
  const { code } = router.query;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!code) return;
    fetch(`${baseUrl}/getAllDorm/`)
      .then((res) => res.json())
      .then((data) => {
        const zoneDorms = data.data.filter((dorm) =>
          dorm.zone.toLowerCase() === code?.toLowerCase()
        );
        setDorms(zoneDorms);
      });
  }, [code, baseUrl]);

 return (
  <div className="bg-white min-h-screen">
    <NavbarWithSidebar />
    <BackButton />
    <h1 className="zone-title text-2xl font-bold mb-6 text-center">โซน {code}</h1>

    <div className="px-4 max-w-screen-xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {dorms.map((dorm) => (
          <Link
            href={`/dorm/${dorm.id}`}
            key={dorm.id}
            className="zone-card relative block w-full max-w-[270px] bg-white rounded-xl shadow min-h-[340px] flex flex-col justify-between"
          >
            <div className="aspect-[4/3] w-full relative rounded-t-xl overflow-hidden">
              <img
                src={dorm.images[0]?.image_url}
                alt={dorm.name}
                className="zone-img object-cover w-full h-full"
              />
            </div>
            <div className="p-3">
              <p className="zone-card-name text-base font-bold">{dorm.name}</p>
              {dorm.room_types?.length > 0 && (
                <div className="zone-card-price text-sm text-gray-700 font-medium mt-1 text-right">
                  เริ่มต้น {parseFloat(dorm.room_types[0].price_per_month).toLocaleString()} บาท / เดือน
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);
}
