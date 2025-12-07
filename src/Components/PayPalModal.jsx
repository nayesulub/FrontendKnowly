import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { X, Shield, Lock, CheckCircle, XCircle } from 'lucide-react';
import useMockPayment from './useMockPayment';
import ThreeDSecureFrame from './ThreeDSecureFrame';

const PayPalModal = ({ isOpen, onClose, onConfirm, onCancel, amount, currency }) => {
  const [paymentState, setPaymentState] = useState('review'); // 'review', 'processing', '3ds', 'success', 'error', 'cancelled'
  const [transactionData, setTransactionData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const { createOrder, confirmPayment, verify3DSecure, isProcessing, error } = useMockPayment();

  // Bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar modal con tecla ESC (solo en estado review)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && paymentState === 'review') {
        handleCancelPayment();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, paymentState]);

  // Crear orden al abrir el modal
  useEffect(() => {
    if (isOpen && !orderId) {
      createOrder({
        amount,
        currency,
        description: 'Suscripción Knowly Plus'
      }).then(order => {
        setOrderId(order.id);
        console.log('✅ Orden creada:', order.id);
      }).catch(err => {
        console.error('❌ Error al crear orden:', err);
        setPaymentState('error');
      });
    }
  }, [isOpen, orderId]);

  const handleConfirmPayment = async () => {
    if (!orderId) return;

    setPaymentState('processing');

    try {
      const result = await confirmPayment(orderId, {
        type: 'card',
        amount,
        currency
      });

      if (result.status === 'success') {
        setTransactionData(result);
        setPaymentState('success');
        
        // Llamar callback de éxito después de 2 segundos
        setTimeout(() => {
          onConfirm(result);
        }, 2500);
      } else if (result.status === 'requires_action') {
        console.log('🔐 Requiere autenticación 3D Secure');
        setTransactionData(result);
        setPaymentState('3ds');
      }
    } catch (err) {
      console.error('❌ Error en el pago:', err);
      setTransactionData(err);
      setPaymentState('error');
    }
  };

  const handle3DSSuccess = async (verificationData) => {
    console.log('✅ 3DS verificado:', verificationData);
    setPaymentState('processing');

    // Simular procesamiento final después de 3DS
    setTimeout(() => {
      const finalResult = {
        status: 'success',
        transactionId: `TXN-3DS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        orderId: orderId,
        amount: amount,
        currency: currency,
        verified3DS: true,
        timestamp: new Date().toISOString(),
        message: 'Pago procesado exitosamente con 3D Secure'
      };
      
      setTransactionData(finalResult);
      setPaymentState('success');
      
      setTimeout(() => {
        onConfirm(finalResult);
      }, 2500);
    }, 1500);
  };

  const handle3DSCancel = (data) => {
    console.log('❌ 3DS cancelado:', data);
    setCancelReason(data.reason === 'max_attempts_exceeded' 
      ? 'Número máximo de intentos excedido' 
      : 'Verificación cancelada por el usuario'
    );
    setPaymentState('cancelled');
  };

  const handleRetry = () => {
    setPaymentState('review');
    setTransactionData(null);
    setCancelReason('');
  };

  const handleCancelPayment = () => {
    setCancelReason('Pago cancelado por el usuario');
    setPaymentState('cancelled');
    
    setTimeout(() => {
      onCancel();
    }, 1500);
  };

  const handleCloseSuccess = () => {
    if (transactionData) {
      onConfirm(transactionData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={paymentState === 'review' ? handleCancelPayment : null}>
      <ModalContainer 
        onClick={(e) => e.stopPropagation()}
        isFullHeight={paymentState === '3ds'}
      >
        {/* Header */}
        <ModalHeader>
          <HeaderContent>
            <PayPalLogo>
              <LogoBlue>Pay</LogoBlue>
              <LogoLight>Pal</LogoLight>
            </PayPalLogo>
            <SecurityBadge>
              <Shield size={14} />
              <span>Pago seguro</span>
            </SecurityBadge>
          </HeaderContent>
          {(paymentState === 'review' || paymentState === 'error') && (
            <CloseButton onClick={handleCancelPayment}>
              <X size={24} />
            </CloseButton>
          )}
        </ModalHeader>

        {/* Body - Cambiar contenido según estado */}
        <ModalBody isFullHeight={paymentState === '3ds'}>
          {paymentState === 'review' && (
            <>
              <SectionTitle>Resumen de tu compra</SectionTitle>
              
              <MerchantInfo>
                <MerchantLogo>K</MerchantLogo>
                <MerchantDetails>
                  <MerchantName>Knowly Plus</MerchantName>
                  <MerchantDescription>Suscripción mensual</MerchantDescription>
                </MerchantDetails>
              </MerchantInfo>

              <OrderSummary>
                <SummaryRow>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <SummaryValue>{currency} ${amount}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>Comisión de servicio</SummaryLabel>
                  <SummaryValue>{currency} $0.00</SummaryValue>
                </SummaryRow>
                <Divider />
                <SummaryRow total>
                  <SummaryLabel>Total</SummaryLabel>
                  <SummaryValue>{currency} ${amount}</SummaryValue>
                </SummaryRow>
              </OrderSummary>

              <PaymentMethodSection>
                <MethodTitle>Método de pago</MethodTitle>
                <PaymentMethod>
                  <MethodIcon>💳</MethodIcon>
                  <MethodDetails>
                    <MethodName>Tarjeta de crédito/débito</MethodName>
                    <MethodDescription>Visa, Mastercard, American Express</MethodDescription>
                  </MethodDetails>
                  <MethodRadio>
                    <RadioInput type="radio" name="payment" defaultChecked />
                    <RadioCustom />
                  </MethodRadio>
                </PaymentMethod>
                
                <PaymentMethod>
                  <MethodIcon>💰</MethodIcon>
                  <MethodDetails>
                    <MethodName>Saldo de PayPal</MethodName>
                    <MethodDescription>$0.00 disponible</MethodDescription>
                  </MethodDetails>
                  <MethodRadio>
                    <RadioInput type="radio" name="payment" disabled />
                    <RadioCustom />
                  </MethodRadio>
                </PaymentMethod>
              </PaymentMethodSection>

              <SecurityNote>
                <Lock size={16} />
                <SecurityText>
                  <strong>Tu información está protegida.</strong> PayPal no comparte tus datos financieros con el comercio.
                </SecurityText>
              </SecurityNote>
            </>
          )}

          {paymentState === 'processing' && (
            <ProcessingContainer>
              <SpinnerLarge />
              <ProcessingTitle>Procesando tu pago...</ProcessingTitle>
              <ProcessingText>Por favor espera mientras verificamos tu pago con el banco.</ProcessingText>
              <ProcessingText small>Esto puede tomar unos segundos.</ProcessingText>
            </ProcessingContainer>
          )}

          {paymentState === '3ds' && (
            <ThreeDSecureFrame
              onSuccess={handle3DSSuccess}
              onCancel={handle3DSCancel}
              orderId={orderId}
              bankName="Banco Simulado"
            />
          )}

          {paymentState === 'success' && transactionData && (
            <SuccessContainer>
              <SuccessIconWrapper>
                <CheckCircle size={64} color="#10b981" strokeWidth={2} />
              </SuccessIconWrapper>
              <SuccessTitle>¡Pago exitoso!</SuccessTitle>
              <SuccessText>Tu suscripción ha sido activada correctamente.</SuccessText>
              
              <TransactionDetails>
                <DetailRow>
                  <DetailLabel>ID de transacción:</DetailLabel>
                  <DetailValue>{transactionData.transactionId}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Monto:</DetailLabel>
                  <DetailValue>{transactionData.currency} ${transactionData.amount}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Fecha:</DetailLabel>
                  <DetailValue>{new Date(transactionData.timestamp).toLocaleString('es-MX')}</DetailValue>
                </DetailRow>
                {transactionData.verified3DS && (
                  <DetailRow>
                    <DetailLabel>Verificación 3DS:</DetailLabel>
                    <DetailValue>✓ Completada</DetailValue>
                  </DetailRow>
                )}
              </TransactionDetails>

              <SuccessNote>
                Recibirás un correo de confirmación en los próximos minutos.
              </SuccessNote>
            </SuccessContainer>
          )}

          {paymentState === 'error' && (
            <ErrorContainer>
              <ErrorIconWrapper>
                <XCircle size={64} color="#ef4444" strokeWidth={2} />
              </ErrorIconWrapper>
              <ErrorTitle>Pago rechazado</ErrorTitle>
              <ErrorText>{error || 'Hubo un problema al procesar tu pago.'}</ErrorText>
              
              {transactionData && transactionData.details && (
                <ErrorDetails>
                  <strong>Motivo:</strong> {transactionData.details}
                </ErrorDetails>
              )}

              <ErrorSuggestions>
                <SuggestionTitle>¿Qué puedes hacer?</SuggestionTitle>
                <SuggestionList>
                  <li>Verifica que los datos de tu tarjeta sean correctos</li>
                  <li>Asegúrate de tener fondos suficientes</li>
                  <li>Intenta con otra tarjeta o método de pago</li>
                  <li>Contacta a tu banco si el problema persiste</li>
                </SuggestionList>
              </ErrorSuggestions>
            </ErrorContainer>
          )}

          {paymentState === 'cancelled' && (
            <CancelledContainer>
              <CancelledIcon>ℹ️</CancelledIcon>
              <CancelledTitle>Pago cancelado</CancelledTitle>
              <CancelledText>{cancelReason}</CancelledText>
              <CancelledNote>
                Puedes intentar nuevamente cuando lo desees.
              </CancelledNote>
            </CancelledContainer>
          )}
        </ModalBody>

        {/* Footer - Cambiar botones según estado */}
        {paymentState !== '3ds' && (
          <ModalFooter>
            {paymentState === 'review' && (
              <>
                <CancelButton onClick={handleCancelPayment}>
                  Cancelar
                </CancelButton>
                <ConfirmButton onClick={handleConfirmPayment} disabled={isProcessing}>
                  {isProcessing ? 'Procesando...' : 'Pagar ahora'}
                </ConfirmButton>
              </>
            )}

            {paymentState === 'success' && (
              <ConfirmButton onClick={handleCloseSuccess} fullWidth>
                Continuar
              </ConfirmButton>
            )}

            {paymentState === 'error' && (
              <>
                <CancelButton onClick={handleCancelPayment}>
                  Cancelar
                </CancelButton>
                <ConfirmButton onClick={handleRetry}>
                  Intentar de nuevo
                </ConfirmButton>
              </>
            )}

            {paymentState === 'cancelled' && (
              <ConfirmButton onClick={onClose} fullWidth>
                Cerrar
              </ConfirmButton>
            )}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PayPalModal;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const checkAnimation = keyframes`
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

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
`;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: ${props => props.isFullHeight ? '95vh' : '90vh'};
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f8f9fa;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PayPalLogo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const LogoBlue = styled.span`
  color: #003087;
`;

const LogoLight = styled.span`
  color: #009cde;
`;

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #e8f5e9;
  color: #2e7d32;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  svg { flex-shrink: 0; }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const ModalBody = styled.div`
  padding: ${props => props.isFullHeight ? '0' : '2rem'};
  flex: 1;
  overflow-y: auto;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const MerchantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const MerchantLogo = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #29c5f6 0%, #6CBF40 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const MerchantDetails = styled.div`
  flex: 1;
`;

const MerchantName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
`;

const MerchantDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const OrderSummary = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: ${props => props.total ? '1.1rem' : '0.95rem'};
  font-weight: ${props => props.total ? '700' : '400'};
  color: ${props => props.total ? '#1f2937' : '#4b5563'};
`;

const SummaryLabel = styled.span``;
const SummaryValue = styled.span`
  font-weight: 600;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 0.75rem 0;
`;

const PaymentMethodSection = styled.div`
  margin-bottom: 1.5rem;
`;

const MethodTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: #0070BA;
    background: #f0f9ff;
  }
  &:has(input:checked) {
    border-color: #0070BA;
    background: #f0f9ff;
  }
  &:has(input:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MethodIcon = styled.div`
  font-size: 1.5rem;
`;

const MethodDetails = styled.div`
  flex: 1;
`;

const MethodName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
`;

const MethodDescription = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const MethodRadio = styled.div`
  position: relative;
`;

const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const RadioCustom = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
  ${RadioInput}:checked + & {
    border-color: #0070BA;
    background: #0070BA;
  }
  ${RadioInput}:checked + &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
  }
`;

const SecurityNote = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 3px solid #0070BA;
`;

const SecurityText = styled.div`
  font-size: 0.875rem;
  color: #1f2937;
  line-height: 1.5;
  strong {
    display: block;
    margin-bottom: 0.25rem;
  }
`;

// Processing State
const ProcessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const SpinnerLarge = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid #e5e7eb;
  border-top-color: #0070BA;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1.5rem;
`;

const ProcessingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
`;

const ProcessingText = styled.p`
  font-size: ${props => props.small ? '0.875rem' : '1rem'};
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

// Success State
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
`;

const SuccessIconWrapper = styled.div`
  margin-bottom: 1.5rem;
  animation: ${checkAnimation} 0.6s ease-out;
`;

const SuccessTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.5rem;
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const TransactionDetails = styled.div`
  width: 100%;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  &:last-child { border-bottom: none; }
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DetailValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
`;

const SuccessNote = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
`;

// Error State
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
`;

const ErrorIconWrapper = styled.div`
  margin-bottom: 1.5rem;
  animation: ${shake} 0.5s ease-out;
`;

const ErrorTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const ErrorDetails = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #991b1b;
  text-align: left;
  width: 100%;
`;

const ErrorSuggestions = styled.div`
  width: 100%;
  text-align: left;
`;

const SuggestionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
`;

const SuggestionList = styled.ul`
  list-style: disc;
  padding-left: 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  li {
    margin-bottom: 0.5rem;
  }
`;

// Cancelled State
const CancelledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const CancelledIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1.5rem;
`;

const CancelledTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const CancelledText = styled.p`
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
`;

const CancelledNote = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #f8f9fa;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const ConfirmButton = styled.button`
  flex: ${props => props.fullWidth ? '1' : '2'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  padding: 12px;
  background: #0070BA;
  border: 2px solid #003087;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    background: #005ea6;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 112, 186, 0.3);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;