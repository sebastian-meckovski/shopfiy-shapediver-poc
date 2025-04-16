// SessionContext.tsx
import { ISessionApi } from '@shapediver/viewer.session';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const SessionContext = createContext<{
  session: ISessionApi | null;
  setSession: React.Dispatch<React.SetStateAction<ISessionApi | null>>;
}>({
  session: null,
  setSession: () => {},
});

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<ISessionApi | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
