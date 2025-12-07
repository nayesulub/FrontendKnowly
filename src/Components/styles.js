import styled, { keyframes } from 'styled-components';

// ======================
// ANIMATIONS
// ======================

export const fadeIn = keyframes`
  from { 
    opacity: 0; 
  }
  to { 
    opacity: 1; 
  }
`;

export const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const slideDown = keyframes`
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const spin = keyframes`
  to { 
    transform: rotate(360deg); 
  }
`;

export const checkAnimation = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
`;

export const shake = keyframes`
  0%, 100% { 
    transform: translateX(0); 
  }
  10%, 30%, 50%, 70%, 90% { 
    transform: translateX(-10px); 
  }
  20%, 40%, 60%, 80% { 
    transform: translateX(10px); 
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

export const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// ======================
// COLORS
// ======================

export const colors = {
  // PayPal Brand
  paypalBlue: '#0070BA',
  paypalBlueDark: '#003087',
  paypalBlueLight: '#009cde',
  paypalBlueHover: '#005ea6',
  
  // Success
  success: '#10b981',
  successLight: '#d1fae5',
  successDark: '#065f46',
  
  // Error
  error: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#991b1b',
  
  // Warning
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#92400e',
  
  // Info
  info: '#3b82f6',
  infoLight: '#dbeafe',
  infoDark: '#1e40af',
  
  // Neutrals
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Backgrounds
  overlay: 'rgba(0, 0, 0, 0.6)',
  cardBg: '#ffffff',
  sectionBg: '#f9fafb',
};

// ======================
// COMMON COMPONENTS
// ======================

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${colors.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Card = styled.div`
  background: ${colors.cardBg};
  border-radius: 12px;
  padding: ${props => props.padding || '1.5rem'};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: ${props => props.mb || '1rem'};
`;

export const Button = styled.button`
  padding: ${props => props.padding || '12px 24px'};
  background: ${props => props.variant === 'secondary' ? colors.white : colors.paypalBlue};
  border: 2px solid ${props => props.variant === 'secondary' ? colors.gray300 : colors.paypalBlueDark};
  border-radius: 8px;
  font-size: ${props => props.size === 'large' ? '1.1rem' : '1rem'};
  font-weight: 600;
  color: ${props => props.variant === 'secondary' ? colors.gray600 : colors.white};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  &:hover:not(:disabled) {
    background: ${props => props.variant === 'secondary' ? colors.gray100 : colors.paypalBlueHover};
    border-color: ${props => props.variant === 'secondary' ? colors.gray400 : colors.paypalBlueDark};
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const Spinner = styled.div`
  width: ${props => props.size || '16px'};
  height: ${props => props.size || '16px'};
  border: 2px solid ${props => props.color || 'rgba(255, 255, 255, 0.3)'};
  border-top-color: ${props => props.topColor || colors.white};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${colors.gray200};
  margin: ${props => props.margin || '1rem 0'};
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${props => {
    switch(props.variant) {
      case 'success': return colors.successLight;
      case 'error': return colors.errorLight;
      case 'warning': return colors.warningLight;
      default: return colors.infoLight;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'success': return colors.successDark;
      case 'error': return colors.errorDark;
      case 'warning': return colors.warningDark;
      default: return colors.infoDark;
    }
  }};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.padding || '12px'};
  border: 2px solid ${props => props.hasError ? colors.error : colors.gray300};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? colors.error : colors.paypalBlue};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 112, 186, 0.1)'};
  }
  
  &:disabled {
    background: ${colors.gray100};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${colors.gray400};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.gray800};
  margin-bottom: 0.5rem;
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${colors.errorLight};
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: ${colors.errorDark};
  font-size: 0.875rem;
  animation: ${props => props.shake ? shake : 'none'} 0.5s ease-out;
  
  svg {
    flex-shrink: 0;
  }
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${colors.successLight};
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: ${colors.successDark};
  font-size: 0.875rem;
  
  svg {
    flex-shrink: 0;
  }
`;

export const InfoBox = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: ${colors.infoLight};
  border-radius: 8px;
  border-left: 3px solid ${colors.info};
  font-size: 0.875rem;
  color: ${colors.gray800};
  line-height: 1.5;
  
  svg {
    flex-shrink: 0;
  }
`;

// ======================
// LAYOUT COMPONENTS
// ======================

export const Container = styled.div`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${props => props.padding || '0 1rem'};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  gap: ${props => props.gap || '1rem'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => props.align || 'stretch'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '1rem'};
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

// ======================
// TYPOGRAPHY
// ======================

export const Title = styled.h1`
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '1.5rem';
      case 'medium': return '2rem';
      case 'large': return '2.5rem';
      default: return '2rem';
    }
  }};
  font-weight: 700;
  color: ${colors.gray900};
  margin-bottom: ${props => props.mb || '1rem'};
  line-height: 1.2;
`;

export const Subtitle = styled.h2`
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '1.1rem';
      case 'medium': return '1.3rem';
      case 'large': return '1.5rem';
      default: return '1.3rem';
    }
  }};
  font-weight: 600;
  color: ${colors.gray800};
  margin-bottom: ${props => props.mb || '0.75rem'};
`;

export const Text = styled.p`
  font-size: ${props => props.size || '1rem'};
  color: ${props => {
    switch(props.variant) {
      case 'light': return colors.gray500;
      case 'dark': return colors.gray900;
      default: return colors.gray700;
    }
  }};
  line-height: 1.6;
  margin-bottom: ${props => props.mb || '0'};
`;

// ======================
// UTILITY STYLES
// ======================

export const visuallyHidden = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const truncate = `
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const noScrollbar = `
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// ======================
// BREAKPOINTS
// ======================

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (max-width: ${breakpoints.desktop})`,
  wide: `@media (max-width: ${breakpoints.wide})`,
};