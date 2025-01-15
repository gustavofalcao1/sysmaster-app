'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  House,
  DeviceTablet,
  UsersThree,
  Gear,
  ChartLine,
  Bell,
  Users,
} from '@phosphor-icons/react';

const SidebarContainer = styled.aside`
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: ${({ theme }) => theme.colors.background.sidebar};
  color: white;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0 ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NavHeader = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  letter-spacing: 0.05em;
`;

interface NavItemProps {
  active?: boolean;
}

const NavItem = styled(Link)<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  text-decoration: none;
  color: ${({ theme, active }) => (active ? 'white' : theme.colors.text.light)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => (active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Sidebar = () => {
  const pathname = usePathname();

  const mainNavItems = [
    { href: '/', label: 'Dashboard', icon: House },
    { href: '/devices', label: 'Devices', icon: DeviceTablet },
    { href: '/groups', label: 'Groups', icon: UsersThree },
    { href: '/users', label: 'Users', icon: Users },
  ];

  const systemNavItems = [
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Gear },
  ];

  return (
    <SidebarContainer>
      <Logo>SysMaster</Logo>

      <NavSection>
        <NavHeader>Main</NavHeader>
        {mainNavItems.map((item) => (
          <NavItem key={item.href} href={item.href} active={pathname === item.href}>
            <item.icon weight={pathname === item.href ? 'fill' : 'regular'} />
            {item.label}
          </NavItem>
        ))}
      </NavSection>

      <NavSection>
        <NavHeader>System</NavHeader>
        {systemNavItems.map((item) => (
          <NavItem key={item.href} href={item.href} active={pathname === item.href}>
            <item.icon weight={pathname === item.href ? 'fill' : 'regular'} />
            {item.label}
          </NavItem>
        ))}
      </NavSection>
    </SidebarContainer>
  );
};

export default Sidebar;
