import { NextResponse } from 'next/server';
import { firestore } from '../../firebase'; // Adjust the path as needed
import { updateDoc, doc } from 'firebase/firestore';

export async function POST(request) {
  const { session_id, userId } = await request.json();

  if (!session_id) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userRef = doc(firestore, 'users', userId);

    await updateDoc(userRef, {
      isSubscribed: true,
      session_id: session_id
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}