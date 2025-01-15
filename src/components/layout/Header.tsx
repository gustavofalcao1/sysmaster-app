'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { MagnifyingGlass, Bell, User } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';

const HeaderContainer = styled.header`
  height: 64px;
  background: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  margin-left: 250px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  input {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    padding-left: 2.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    width: 300px;
    background: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.main};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.background.main};
  }
`;

const UserMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 200px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const MenuItem = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.main};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  span:first-child {
    font-weight: 500;
  }

  span:last-child {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderContainer>
      <SearchBar>
        <MagnifyingGlass />
        <input type="text" placeholder="Search..." />
      </SearchBar>
      <UserSection>
        <ThemeSwitcher />
        <IconButton>
          <Bell />
        </IconButton>
        <UserProfile onClick={() => setMenuOpen(!menuOpen)}>
          <UserAvatar>
            <User weight="fill" />
          </UserAvatar>
          <UserInfo>
            <span>{user?.name}</span>
            <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </UserInfo>
          <UserMenu isOpen={menuOpen}>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </UserMenu>
        </UserProfile>
      </UserSection>
    </HeaderContainer>
  );
};

export default Header;
