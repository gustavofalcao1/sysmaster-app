'use client';

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from '@phosphor-icons/react';

const SwitchButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background.main};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SwitchButton onClick={toggleTheme}>
      {theme === 'light' ? <Moon weight="regular" /> : <Sun weight="regular" />}
    </SwitchButton>
  );
}
