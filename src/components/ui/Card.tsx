'use client';

import styled from 'styled-components';

interface CardProps {
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme, padding = 'md' }) => theme.spacing[padding]};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;
