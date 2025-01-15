'use client';

import React from 'react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background.main};
`;

const MainContent = styled.main`
  margin-left: 250px;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const pathname = usePathname();

  // Se não estiver autenticado ou estiver na página de login, renderiza apenas o children
  if (!user || pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <LayoutContainer>
      <Sidebar />
      <Header />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default RootLayout;
