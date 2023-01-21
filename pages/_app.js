import '../styles/globals.css';
import { SessionProvider, useSession } from 'next-auth/react';
import { store } from '../utils/redux/store';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}
function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=Login Required');
    },
  });
  if (status === 'loading') {
    return <div>loading....</div>;
  }
  return children;
}
export default MyApp;
