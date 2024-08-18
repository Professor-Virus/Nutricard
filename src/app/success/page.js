'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    
    if (session_id && user) {
      console.log("Session_id", session_id);
      console.log("Calling update-subscription from success/page.js");
      
      fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id,
          userId: user.id
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (!data.success) {
          console.error('Failed to update subscription');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else if (!session_id) {
      router.push('/');
    }
  }, [searchParams, user, router]);

  return <div>This is your paid page</div>;
}