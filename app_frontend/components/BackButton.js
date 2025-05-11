'use client';

import { useRouter } from 'next/navigation'; 

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-block text-3xl text-blue-600 hover:text-blue-800 hover:underline mb-4"
    >
      ←
    </button>
  );
}