import { useSession } from 'next-auth/react';
import React from 'react';

export default function ProductsScreen() {
  const { user } = useSession();
  console.log(user);
  return <div>Screen</div>;
}
ProductsScreen.auth = true;
