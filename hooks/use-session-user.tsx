'use client';

import { useAuth, useUser } from '@clerk/nextjs';

export function useSessionUser() {
  const { isLoaded: isAuthLoaded, userId, sessionId, getToken } = useAuth();
  const { isLoaded: isUserLoaded, isSignedIn, user } = useUser();

  const isLoaded = isAuthLoaded && isUserLoaded;
  const isAuthenticated = isSignedIn && Boolean(userId);

  return {
    isLoaded,
    isAuthenticated,
    user,
    userId,
    sessionId,
    getToken,
  };
}
