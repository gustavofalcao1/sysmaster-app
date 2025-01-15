'use client';

import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const getVariantStyles = (variant: ButtonVariant = 'primary') => {
  const variants = {
    primary: css`
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      &:hover {
        background: ${({ theme }) => theme.colors.secondary};
      }
    `,
    secondary: css`
      background: ${({ theme }) => theme.colors.background.paper};
      color: ${({ theme }) => theme.colors.text.primary};
      border: 1px solid ${({ theme }) => theme.colors.border};
      &:hover {
        background: ${({ theme }) => theme.colors.background.main};
      }
    `,
    outline: css`
      background: transparent;
      color: ${({ theme }) => theme.colors.primary};
      border: 1px solid ${({ theme }) => theme.colors.primary};
      &:hover {
        background: ${({ theme }) => theme.colors.primary};
        color: white;
      }
    `,
    ghost: css`
      background: transparent;
      color: ${({ theme }) => theme.colors.text.primary};
      &:hover {
        background: ${({ theme }) => theme.colors.background.main};
      }
    `,
  };
  return variants[variant];
};

const getSizeStyles = (size: ButtonSize = 'md') => {
  const sizes = {
    sm: css`
      padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
      font-size: 0.875rem;
    `,
    md: css`
      padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
      font-size: 1rem;
    `,
    lg: css`
      padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
      font-size: 1.125rem;
    `,
  };
  return sizes[size];
};

export const Button = styled.button<ButtonProps>`
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ variant }) => getVariantStyles(variant)}
  ${({ size }) => getSizeStyles(size)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
