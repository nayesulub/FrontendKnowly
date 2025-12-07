import React, { useState } from 'react';
import styled from 'styled-components';
import PayPalModal from './PayPalModal';

const CheckoutButton = ({ amount = '69.99', currency = 'MXN', onSuccess, onError, onCancel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = () => {
    setIsLoading(true);
    // Simular pequeño delay de carga
    setTimeout(() => {
      setIsLoading(false);
      setIsModalOpen(true);
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    console.log('Pago confirmado');
    handleCloseModal();
    if (onSuccess) {
      onSuccess({ amount, currency, transactionId: 'MOCK-' + Date.now() });
    }
  };

  const handleCancelPayment = () => {
    console.log('Pago cancelado');
    handleCloseModal();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <PayPalButton 
        type="button" 
        onClick={handleOpenModal}
        disabled={isLoading}
      >
        {isLoading ? (
          <ButtonContent>
            <Spinner />
            <span>Cargando...</span>
          </ButtonContent>
        ) : (
          <ButtonContent>
            <PayPalLogo>PayPal</PayPalLogo>
          </ButtonContent>
        )}
      </PayPalButton>

      {isModalOpen && (
        <PayPalModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          onCancel={handleCancelPayment}
          amount={amount}
          currency={currency}
        />
      )}
    </>
  );
};

export default CheckoutButton;

// Styled Components

const PayPalButton = styled.button`
  width: 100%;
  background: #0070BA;
  border: 2px solid #003087;
  color: white;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #005ea6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const PayPalLogo = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;