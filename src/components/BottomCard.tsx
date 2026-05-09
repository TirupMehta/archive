"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BottomCard() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bottom-card">
      <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>
      <h3 className="card-title">Get the full experience</h3>
      <p className="card-desc">Sign in or create your account.<br/><a href="#" className="card-link">Learn more</a></p>
      <button className="card-btn" onClick={() => router.push('/login')}>Sign in</button>
    </div>
  );
}
