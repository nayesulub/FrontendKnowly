import React, { useState } from 'react';
import styled from 'styled-components';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CheckoutButton from './CheckoutButton';
import { API_BASE_URL } from '../utils/config';

// 🔹 Config de los packs
const PACKS = {
  small: {
    key: 'small',
    label: '30 cristales',
    coins: 30,
    price: 25.0,
    descripcion: "Paquete pequeño de 30 cristales",
  },
  medium: {
    key: 'medium',
    label: '80 cristales',
    coins: 80,
    price: 59.0,
    descripcion: "Paquete mediano de 80 cristales",
  },
  large: {
    key: 'large',
    label: '170 cristales',
    coins: 170,
    price: 129.0,
    descripcion: "Paquete grande de 170 cristales",
  },
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function Pagos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔹 pack dinámico desde la URL
  const packKey = searchParams.get('pack') || 'medium';
  const selectedPack = PACKS[packKey] || PACKS.medium;

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardHolder: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({ ...formData, [name]: value });
  };

  // 🔹 Actualiza coins en BD y en localStorage
  const agregarCristalesAlUsuario = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Error: Usuario no encontrado');
      return null;
    }

    const user = JSON.parse(userData);

    try {
      // 1️⃣ Llamar a /user/add-coins
      const coinsRes = await fetch(`${API_BASE_URL}/user/add-coins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ coins: selectedPack.coins }),
      });

      const coinsText = await coinsRes.text();
      let coinsData = null;
      try { coinsData = coinsText ? JSON.parse(coinsText) : null; } catch(e) { coinsData = null; }

      if (!coinsRes.ok) {
        console.error("Error al agregar coins en el backend:", coinsRes.status, coinsText);
        alert("No se pudieron agregar los cristales en la base de datos.");
        return null;
      }

      const newCoins =
        coinsData?.user?.coins ??
        coinsData?.coins ??
        (user.coins || 0) + selectedPack.coins;

      const updatedUser = { ...user, coins: newCoins };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 2️⃣ Registrar compra en la tabla compras (intentar, pero no bloquear si falla)
      try {
        const compraRes = await fetch(`${API_BASE_URL}/compras`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            tipo_compra: "compra_cristales",
            descripcion: selectedPack.descripcion,
            coins_usados: 0,
            monto: selectedPack.price,
          }),
        });

        if (!compraRes.ok) {
          const txt = await compraRes.text();
          console.warn("Error registrando compra:", compraRes.status, txt);
          // no retornamos null porque los coins ya se añadieron
        }
      } catch (err) {
        console.warn("Fallo al registrar compra (no crítico):", err);
      }

      return updatedUser;
    } catch (error) {
      console.error("Error agregando cristales:", error);
      alert("Ocurrió un error al actualizar tus cristales.");
      return null;
    }
  };

  const finalizarPagoExitoso = () => {
    setPaymentSuccess(true);
    setProcessing(false);

    setTimeout(() => {
      navigate('/Asignaturas');
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // Simulación de llamada a API externa (Stripe, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedUser = await agregarCristalesAlUsuario();
      if (!updatedUser) {
        setProcessing(false);
        return;
      }

      finalizarPagoExitoso();
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error procesando el pago. Por favor intenta de nuevo.');
      setProcessing(false);
    }
  };

  const handlePayPalSuccess = async (data) => {
    console.log('Pago exitoso con PayPal:', data);
    setProcessing(true);

    try {
      const updatedUser = await agregarCristalesAlUsuario();
      if (!updatedUser) {
        setProcessing(false);
        return;
      }

      finalizarPagoExitoso();
    } catch (error) {
      console.error('Error procesando pago con PayPal:', error);
      alert('Error procesando el pago. Por favor intenta de nuevo.');
      setProcessing(false);
    }
  };

  const handlePayPalCancel = () => {
    console.log('Pago con PayPal cancelado');
  };

  const handleOxxoPay = () => {
    alert('Redirigiendo a OXXO Pay...');
  };

  return (
    <PageContainer>
      <Header>
        <Logo src="./Knowly.png" alt="Knowly Logo" />
      </Header>

      <MainContent>
        <SubscriptionTitle>{selectedPack.label}</SubscriptionTitle>
        <PriceHighlight>${selectedPack.price.toFixed(2)} MXN</PriceHighlight>

        <ContentGrid>
          {/* Columna Izquierda - Desglose */}
          <BreakdownSection>
            <SectionTitle>Resumen de tu pedido</SectionTitle>
            <BreakdownCard>
              <BreakdownItem>
                <ItemLabel>{selectedPack.label}</ItemLabel>
                <ItemPrice>${selectedPack.price.toFixed(2)}</ItemPrice>
              </BreakdownItem>
              <Divider />
              <BreakdownItem>
                <ItemLabel>Subtotal</ItemLabel>
                <ItemPrice>${selectedPack.price.toFixed(2)}</ItemPrice>
              </BreakdownItem>
              <BreakdownItem>
                <ItemLabel>Impuestos</ItemLabel>
                <ItemPrice>$00.00</ItemPrice>
              </BreakdownItem>
              <Divider />
              <BreakdownItem total>
                <ItemLabel>Total</ItemLabel>
                <ItemPrice>${selectedPack.price.toFixed(2)}</ItemPrice>
              </BreakdownItem>
            </BreakdownCard>
            <SecurityNote>
              <Lock size={14} />
              <span>Pago 100% seguro y encriptado</span>
            </SecurityNote>
          </BreakdownSection>

          {/* Columna Derecha - Formulario de Pago */}
          <PaymentSection>
            <SectionTitle>Método de pago</SectionTitle>
            <PaymentCard>
              <FormContainer onSubmit={handleSubmit}>
                <Label>Número de tarjeta</Label>
                <InputGroup>
                  <IconWrapper>
                    <CreditCard size={18} />
                  </IconWrapper>
                  <Input
                    type="text"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    disabled={processing || paymentSuccess}
                    required
                  />
                </InputGroup>

                <InputRow>
                  <InputColumn>
                    <Label>Fecha de expiración</Label>
                    <Input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/AA"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      disabled={processing || paymentSuccess}
                      required
                    />
                  </InputColumn>
                  <InputColumn>
                    <Label>CVC</Label>
                    <Input
                      type="text"
                      name="cvc"
                      placeholder="123"
                      value={formData.cvc}
                      onChange={handleChange}
                      disabled={processing || paymentSuccess}
                      required
                    />
                  </InputColumn>
                </InputRow>

                <Label>Nombre del titular</Label>
                <Input
                  type="text"
                  name="cardHolder"
                  placeholder="Como aparece en la tarjeta"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  disabled={processing || paymentSuccess}
                  required
                />

                <SubscribeButton 
                  type="submit" 
                  disabled={processing || paymentSuccess}
                  processing={processing}
                  success={paymentSuccess}
                >
                  {processing ? (
                    <>
                      <Spinner />
                      <span>Procesando pago...</span>
                    </>
                  ) : paymentSuccess ? (
                    <>
                      <CheckCircle size={20} />
                      <span>¡Compra exitosa!</span>
                    </>
                  ) : (
                    <span>Comprar</span>
                  )}
                </SubscribeButton>
              </FormContainer>

              <Divider style={{ margin: '1.5rem 0' }} />

              <AlternativePayment>
                <AlternativeLabel>O paga con otros métodos</AlternativeLabel>
                
                <CheckoutButton 
                  amount={selectedPack.price.toFixed(2)}
                  currency="MXN"
                  onSuccess={handlePayPalSuccess}
                  onCancel={handlePayPalCancel}
                  disabled={processing || paymentSuccess}
                />

                <OxxoButton 
                  type="button" 
                  onClick={handleOxxoPay}
                  disabled={processing || paymentSuccess}
                >
                  <OxxoLogo>OXXO</OxxoLogo>
                  <span>Pagar con OXXO</span>
                </OxxoButton>
              </AlternativePayment>
            </PaymentCard>
          </PaymentSection>
        </ContentGrid>
      </MainContent>

      {paymentSuccess && (
        <SuccessOverlay>
          <SuccessModal>
            <SuccessIcon>
              <CheckCircle size={64} />
            </SuccessIcon>
            <SuccessTitle>¡Pago Exitoso!</SuccessTitle>
            <SuccessMessage>
              Se han agregado <strong>{selectedPack.coins} cristales</strong> a tu cuenta.
              <br />
              Redirigiendo...
            </SuccessMessage>
          </SuccessModal>
        </SuccessOverlay>
      )}
    </PageContainer>
  );
}

export default Pagos;

// 🎨 Styled Components

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
  padding: 0;
  width: 100%;
`;

const Header = styled.header`
  max-width: 100%;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Logo = styled.img`
  width: 180px;
  height: auto;
`;

const MainContent = styled.main`
  max-width: 100%;
  padding: 3rem 2rem;
`;

const SubscriptionTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const PriceHighlight = styled.p`
  font-size: 1.8rem;
  font-weight: bold;
  color: #29c5f6;
  text-align: center;
  margin-bottom: 3rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const BreakdownSection = styled.section``;

const PaymentSection = styled.section``;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const BreakdownCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PaymentCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const BreakdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  font-size: ${props => props.total ? '1.2rem' : '1rem'};
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  color: ${props => props.total ? '#2c3e50' : '#555'};
`;

const ItemLabel = styled.span``;

const ItemPrice = styled.span`
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 0.5rem 0;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  color: #0284c7;
  font-size: 0.9rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 0.3rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #29c5f6;
  }
  
  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const InputColumn = styled.div`
  display: flex;
  flex-direction: column;
  
  ${Input} {
    padding: 12px;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SubscribeButton = styled.button`
  background: ${props => {
    if (props.success) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    if (props.processing) return '#9ca3af';
    return '#6CBF40';
  }};
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  margin-top: 1rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: ${props => (props.disabled && !props.success ? 0.7 : 1)};
  
  &:hover {
    background: ${props => {
      if (props.success) return 'linear-gradient(135deg, #059669 0%, #047857 100%)';
      if (props.processing) return '#9ca3af';
      return '#5da635';
    }};
  }
  
  &:active {
    transform: ${props => (props.disabled ? 'none' : 'scale(0.98)')};
  }
`;

const AlternativePayment = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlternativeLabel = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const OxxoButton = styled.button`
  width: 100%;
  background: #fff;
  border: 2px solid #FFD100;
  color: #E20714;
  padding: 14px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background: #FFF9E6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const OxxoLogo = styled.span`
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #E20714 0%, #FFD100 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const SuccessModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
  animation: scaleIn 0.3s ease;

  @keyframes scaleIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const SuccessIcon = styled.div`
  color: #10b981;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  animation: checkBounce 0.6s ease;

  @keyframes checkBounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.6;

  strong {
    color: #10b981;
    font-weight: 700;
  }
`;
