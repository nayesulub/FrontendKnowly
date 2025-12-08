import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CheckoutButton from './CheckoutButton';
import { API_BASE_URL } from '../utils/config';

export function Pago() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardHolder: ''
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ---------- Helpers de auth ----------
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // ---------- Cargar usuario al entrar a /pago ----------
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/Login');
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error al leer user de localStorage:', error);
      localStorage.removeItem('user');
      navigate('/Login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ---------- Registrar compra de suscripción en la tabla compras ----------
  const registrarCompraSuscripcion = async (headers) => {
    try {
      const compraRes = await fetch(`${API_BASE_URL}/compras`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tipo_compra: 'suscripcion_premium',
          descripcion: 'Suscripción Knowly Plus mensual',
          coins_usados: 0,
          monto: 69.99,
        }),
      });

      if (!compraRes.ok) {
        const txt = await compraRes.text();
        console.warn('Error registrando compra de suscripción:', compraRes.status, txt);
        // No cortamos el flujo porque la suscripción ya se activó
      }
    } catch (err) {
      console.warn('Fallo al registrar compra de suscripción (no crítico):', err);
    }
  };

  // ---------- Activar suscripción en backend + actualizar localStorage ----------
  const activarSuscripcionMensual = async () => {
    try {
      setProcessing(true);

      const headers = getAuthHeaders();
      console.log('activarSuscripcionMensual - headers:', headers);

      const res = await fetch(`${API_BASE_URL}/subscribe/monthly`, {
        method: 'POST',
        headers,
        // si usas cookies/sanctum descomenta la siguiente línea:
        // credentials: 'include',
      });

      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

      console.log('activarSuscripcionMensual - status:', res.status, 'body:', data);

      if (!res.ok) {
        const msg =
          data && data.message
            ? data.message
            : typeof data === 'string'
            ? data
            : 'Error al activar suscripción';
        alert(`Error del servidor: ${res.status} — ${msg}`);
        setProcessing(false);
        return;
      }

      // ✅ éxito: actualizar usuario localmente a rol premium (idrol = 2)
      if (user) {
        const updatedUser = { ...user, idrol: 2 };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const updatedUser = { ...parsedUser, idrol: 2 };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      }

      // 🔹 Registrar la compra de la suscripción (similar a cristales)
      await registrarCompraSuscripcion(headers);

      alert(
        `🎉 Suscripción activada. ${
          data && data.expira_el
            ? 'Expira el ' + new Date(data.expira_el).toLocaleDateString('es-MX')
            : ''
        }`
      );

      setProcessing(false);
      navigate('/precios');
    } catch (error) {
      console.error('activarSuscripcionMensual error:', error);
      alert('Ocurrió un error de red al activar la suscripción. Revisa la consola y el backend.');
      setProcessing(false);
    }
  };

  // ---------- Handlers de formulario tarjeta ----------
  const handleChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatear número de tarjeta (grupos de 4)
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Formatear fecha de expiración (MM/AA)
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limitar CVC a 3 dígitos
    if (name === 'cvc') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (processing) return;

    console.log('Procesando pago con tarjeta:', formData);

    // 👉 Activamos la suscripción en el backend, actualizamos localStorage
    // y registramos la compra (todo dentro de activarSuscripcionMensual)
    await activarSuscripcionMensual();
  };

  const handleOxxoPay = async () => {
    if (processing) return;

    alert('Redirigiendo a OXXO Pay / generando referencia...');
    await activarSuscripcionMensual();
  };

  if (loading) {
    return (
      <PageContainer>
        <p>Cargando...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Logo src="./Knowly.png" alt="Knowly Logo" />
      </Header>

      <MainContent>
        <SubscriptionTitle>Suscríbete a Knowly Plus</SubscriptionTitle>
        <PriceHighlight>$69.99 MXN por mes</PriceHighlight>

        <ContentGrid>
          {/* Columna Izquierda - Desglose */}
          <BreakdownSection>
            <SectionTitle>Resumen de tu pedido</SectionTitle>
            <BreakdownCard>
              <BreakdownItem>
                <ItemLabel>Suscripción Knowly Plus</ItemLabel>
                <ItemPrice>$69.99</ItemPrice>
              </BreakdownItem>
              <Divider />
              <BreakdownItem>
                <ItemLabel>Subtotal</ItemLabel>
                <ItemPrice>$69.99</ItemPrice>
              </BreakdownItem>
              <BreakdownItem>
                <ItemLabel>Impuestos</ItemLabel>
                <ItemPrice>$00.00</ItemPrice>
              </BreakdownItem>
              <Divider />
              <BreakdownItem total>
                <ItemLabel>Total</ItemLabel>
                <ItemPrice>$69.99</ItemPrice>
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
                    required
                    disabled={processing}
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
                      required
                      disabled={processing}
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
                      required
                      disabled={processing}
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
                  required
                  disabled={processing}
                />

                <SubscribeButton type="submit" disabled={processing}>
                  {processing ? 'Procesando...' : 'Suscribirse'}
                </SubscribeButton>
              </FormContainer>

              <Divider style={{ margin: '1.5rem 0' }} />

              <AlternativePayment>
                <AlternativeLabel>O paga con otros métodos</AlternativeLabel>

                <CheckoutButton
                  amount="69.99"
                  currency="MXN"
                  onSuccess={async (data) => {
                    console.log('Pago exitoso:', data);
                    await activarSuscripcionMensual();
                  }}
                  onCancel={() => console.log('Pago cancelado')}
                  disabled={processing}
                />

                <OxxoButton type="button" onClick={handleOxxoPay} disabled={processing}>
                  <OxxoLogo>OXXO</OxxoLogo>
                  <span>Pagar con OXXO</span>
                </OxxoButton>
              </AlternativePayment>
            </PaymentCard>
          </PaymentSection>
        </ContentGrid>
      </MainContent>
    </PageContainer>
  );
}

export default Pago;

/* Tus styled-components se quedan igual que los que ya tenías */


/* --- tus styled-components van igual que antes --- */


// 🎨 Styled Components

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffffff;
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

const SubscribeButton = styled.button`
  background: #6CBF40;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: #5da635;
  }
  
  &:active {
    transform: scale(0.98);
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
  gap: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background: #005ea6;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PayPalLogo = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: white;
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