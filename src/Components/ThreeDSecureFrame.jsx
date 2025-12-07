import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Shield, Lock, AlertCircle } from 'lucide-react';

const ThreeDSecureFrame = ({ onSuccess, onCancel, orderId, bankName = 'Banco Simulado' }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  // Auto-focus en el input al montar
  useEffect(() => {
    const input = document.getElementById('3ds-code-input');
    if (input) input.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simular verificación con delay
    setTimeout(() => {
      // Códigos válidos para testing
      const validCodes = ['123456', '000000', '111111'];
      
      if (validCodes.includes(code)) {
        // Éxito
        onSuccess({
          verified: true,
          code: code,
          orderId: orderId,
          timestamp: new Date().toISOString()
        });
      } else {
        // Error
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError(`Número máximo de intentos alcanzado. La transacción ha sido cancelada.`);
          setTimeout(() => {
            onCancel({ reason: 'max_attempts_exceeded' });
          }, 2000);
        } else {
          setError(`Código incorrecto. Te quedan ${maxAttempts - newAttempts} intentos.`);
          setCode('');
        }
        
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (error) setError('');
  };

  return (
    <ThreeDSContainer>
      <BankHeader>
        <BankLogo>
          <Shield size={24} />
        </BankLogo>
        <BankInfo>
          <BankName>{bankName}</BankName>
          <BankSecure>
            <Lock size={12} />
            <span>Verificación segura</span>
          </BankSecure>
        </BankInfo>
      </BankHeader>

      <ThreeDSBody>
        <SecurityBadge>
          <ShieldIcon>
            <Shield size={48} color="#0070BA" />
          </ShieldIcon>
          <BadgeTitle>Verificación 3D Secure</BadgeTitle>
          <BadgeDescription>
            Para completar tu compra, introduce el código de verificación
          </BadgeDescription>
        </SecurityBadge>

        <TransactionInfo>
          <InfoRow>
            <InfoLabel>Comercio:</InfoLabel>
            <InfoValue>Knowly Plus</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>Orden:</InfoLabel>
            <InfoValue>{orderId?.slice(0, 20)}...</InfoValue>
          </InfoRow>
        </TransactionInfo>

        <VerificationForm onSubmit={handleSubmit}>
          <FormLabel>Código de verificación</FormLabel>
          <FormDescription>
            Introduce el código de 6 dígitos que enviamos a tu teléfono
          </FormDescription>
          
          <CodeInputWrapper>
            <CodeInput
              id="3ds-code-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={handleCodeChange}
              placeholder="000000"
              disabled={isVerifying || attempts >= maxAttempts}
              hasError={!!error}
            />
            {code.length === 6 && !error && (
              <CheckMark>✓</CheckMark>
            )}
          </CodeInputWrapper>

          {error && (
            <ErrorMessage shake={!!error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </ErrorMessage>
          )}

          <FormHint>
            💡 Códigos de prueba válidos: 123456, 000000, 111111
          </FormHint>

          <ButtonGroup>
            <CancelButton 
              type="button" 
              onClick={() => onCancel({ reason: 'user_cancelled' })}
              disabled={isVerifying}
            >
              Cancelar
            </CancelButton>
            <VerifyButton 
              type="submit" 
              disabled={code.length !== 6 || isVerifying || attempts >= maxAttempts}
            >
              {isVerifying ? (
                <>
                  <Spinner />
                  <span>Verificando...</span>
                </>
              ) : (
                'Verificar'
              )}
            </VerifyButton>
          </ButtonGroup>
        </VerificationForm>

        <AttemptsIndicator>
          <AttemptDot active={attempts >= 1} failed />
          <AttemptDot active={attempts >= 2} failed />
          <AttemptDot active={attempts >= 3} failed />
        </AttemptsIndicator>

        <SecurityNote>
          <Lock size={14} />
          <NoteText>
            Tu información está protegida con cifrado de nivel bancario.
            Nunca te pediremos tu contraseña completa.
          </NoteText>
        </SecurityNote>
      </ThreeDSBody>

      <BankFooter>
        <FooterText>Powered by 3D Secure 2.0</FooterText>
      </BankFooter>
    </ThreeDSContainer>
  );
};

export default ThreeDSecureFrame;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const checkPop = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

// Styled Components
const ThreeDSContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const BankHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #003087 0%, #0070BA 100%);
  color: white;
`;

const BankLogo = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BankInfo = styled.div`
  flex: 1;
`;

const BankName = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const BankSecure = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  opacity: 0.9;
`;

const ThreeDSBody = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const SecurityBadge = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ShieldIcon = styled.div`
  margin-bottom: 1rem;
`;

const BadgeTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const BadgeDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.5;
`;

const TransactionInfo = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  &:last-child { border-bottom: none; }
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const InfoValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
`;

const VerificationForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const FormDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const CodeInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const CodeInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5rem;
  border: 2px solid ${props => props.hasError ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#ef4444' : '#0070BA'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 112, 186, 0.1)'};
  }
  
  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #d1d5db;
    letter-spacing: 0.5rem;
  }
`;

const CheckMark = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #10b981;
  font-size: 1.5rem;
  font-weight: bold;
  animation: ${checkPop} 0.3s ease-out;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  animation: ${props => props.shake ? shake : 'none'} 0.5s ease-out;
`;

const FormHint = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: #92400e;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.875rem;
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VerifyButton = styled.button`
  padding: 0.875rem;
  background: #0070BA;
  border: 2px solid #003087;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background: #005ea6;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const AttemptsIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const AttemptDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? (props.failed ? '#ef4444' : '#10b981') : '#e5e7eb'};
  transition: all 0.3s;
`;

const SecurityNote = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 3px solid #0070BA;
`;

const NoteText = styled.p`
  font-size: 0.8rem;
  color: #1f2937;
  line-height: 1.5;
`;

const BankFooter = styled.div`
  padding: 1rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
`;