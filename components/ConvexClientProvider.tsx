'use client';

import { ReactNode, useCallback, useState, useRef, useEffect } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth } from 'convex/react';
import { AuthKitProvider, useAuth, useAccessToken } from '@workos-inc/authkit-nextjs/components';

const noop = () => {};

const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Token is valid if it hasn't expired yet (with small buffer for clock skew)
    return payload.exp * 1000 > Date.now() + 5000;
  } catch {
    return false;
  }
};

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(() => {
    const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    return client;
  });

  return (
    // Prevent AuthKit's default window.location.reload() on session expiration.
    // We handle auth state gracefully via Convex token refresh and middleware checks.
    <AuthKitProvider onSessionExpired={noop}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        {children}
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}

function useAuthFromAuthKit() {
  const { user, loading: isLoading } = useAuth();
  const { getAccessToken, accessToken } = useAccessToken();
  const accessTokenRef = useRef<string | undefined>(accessToken);

  const isAuthenticated = !!user;

  // Keep ref updated with latest token
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken?: boolean } = {}): Promise<string | null> => {
      if (!user) {
        return null;
      }

      try {
        return (await getAccessToken()) ?? null;
      } catch (error) {
        const cachedToken = accessTokenRef.current;
        if (isTokenValid(cachedToken)) {
          console.log('[Convex Auth] Using cached token during network issues');
          return cachedToken!;
        }
        return null;
      }
    },
    [user, getAccessToken],
  );

  return {
    isLoading,
    isAuthenticated,
    fetchAccessToken,
  };
}
