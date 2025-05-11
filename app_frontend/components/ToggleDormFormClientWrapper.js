
'use client';

import dynamic from 'next/dynamic';


const ToggleDormForm = dynamic(() => import('./ToggleDormForm'), { ssr: false });

export default function ToggleDormFormClientWrapper(props) {
  return <ToggleDormForm {...props} />;
}