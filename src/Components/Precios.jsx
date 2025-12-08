import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Check, X, Crown, Zap, Shield, Star, User, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../utils/config';

export function Precios() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleCrystalPurchase = async (pack) => {
    if (!user) {
      alert("Necesitas iniciar sesión para comprar cristales.");
      navigate("/Login");
      return;
    }

    // Definir packs
    const packsConfig = {
      small: {
        coins: 30,
        price: 25.0,
        descripcion: "Paquete pequeño de 30 cristales",
      },
      medium: {
        coins: 80,
        price: 59.0,
        descripcion: "Paquete mediano de 80 cristales",
      },
      large: {
        coins: 170,
        price: 129.0,
        descripcion: "Paquete grande de 170 cristales",
      },
    };

    const selectedPack = packsConfig[pack];

    if (!selectedPack) {
      console.error("Pack no válido:", pack);
      return;
    }

    try {
      // 1️⃣ Agregar coins al usuario
      const coinsRes = await fetch(`${API_BASE_URL}/user/add-coins`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          coins: selectedPack.coins,
        }),
      });

      if (!coinsRes.ok) {
        console.error("Error al agregar coins");
        alert("No se pudieron agregar los cristales. Intenta de nuevo.");
        return;
      }

      const coinsData = await coinsRes.json();

      // Actualizar user en estado y localStorage
      const updatedUser = {
        ...user,
        coins: coinsData.user?.coins ?? coinsData.coins ?? 0,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 2️⃣ Registrar compra en la tabla compras
      const compraRes = await fetch(`${API_BASE_URL}/compras`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tipo_compra: "compra_cristales",
          descripcion: selectedPack.descripcion,
          coins_usados: 0, // aquí NO gastamos coins, los estamos comprando
          monto: selectedPack.price,
        }),
      });

      if (!compraRes.ok) {
        console.error("Error al registrar la compra");
        alert("Se agregaron los cristales, pero hubo un problema registrando la compra.");
        return;
      }

      alert(
        `✅ Compra realizada correctamente.\n\nHas recibido ${selectedPack.coins} cristales.\nSaldo actual: ${updatedUser.coins} cristales.`
      );
    } catch (error) {
      console.error("Error en la compra:", error);
      alert("Ocurrió un error al procesar la compra. Intenta de nuevo.");
    }
  };

  // 👉 NUEVO: ir a la vista de Pagos al hacer clic en las monedas
  const handleGoToCoinsPayment = () => {
    navigate("/pagos");
  };

  // useEffect para obtener datos del usuario al cargar el componente
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          navigate('/Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        localStorage.removeItem('user');
        navigate('/Login');
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [navigate]);

  // useEffect para manejar clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectPlan = (plan) => {
    if (plan === "Premium") {
      navigate("/pago");
    }
  };

  // Función para alternar la visibilidad del menú
  const toggleUserMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowMenu(false);
    navigate('/Login');
  };

  // Función para ir al perfil
  const handleProfileClick = () => {
    setShowMenu(false);
    navigate('/Perfil');
  };

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Verificando sesión...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Logo src="./Knowly.png" alt="Knowly" />
        <Nav>
          <NavItemsWrapper>
            <NavLink href="Asignaturas">ASIGNATURAS</NavLink>
            <NavLink href="SelecNivel">GRADOS</NavLink>
            <NavLink href="precios">PRECIOS</NavLink>
            {user ? (
              <>
                {/* 👉 AHORA ES CLICKEABLE Y LLEVA A /pagos */}
                <CoinsContainer onClick={handleGoToCoinsPayment}>
                  <CoinIcon>
                    <img src="/coin.png" alt="Coin" />
                  </CoinIcon>
                  <CoinsAmount>{user.coins || 0}</CoinsAmount>
                </CoinsContainer>
                <UserInfo ref={menuRef}>
                  <UserAvatar onClick={toggleUserMenu}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </UserAvatar>
                  {showMenu && (
                    <UserMenuDropdown>
                      <MenuItem onClick={handleProfileClick}>
                        <User size={16} />
                        <span>Perfil</span>
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Cerrar Sesión</span>
                      </MenuItem>
                    </UserMenuDropdown>
                  )}
                </UserInfo>
              </>
            ) : (
              <>
                <NavLink href="Login">ACCEDE</NavLink>
                <RegisterButton onClick={() => navigate('/registro')}>Registrate</RegisterButton>
              </>
            )}
          </NavItemsWrapper>
        </Nav>
      </Header>

      <MainContent>
        <PageTitle>CÁMBIATE A PLAN PREMIUM</PageTitle>

        <PlansGrid>
          {/* Plan Gratis */}
          <PlanCard>
            <FreeBadge>FREE</FreeBadge>
            
            <IconWrapper>
              <Zap size={48} color="#4ade80" strokeWidth={2.5} />
            </IconWrapper>
            
            <PlanTitle>GRATIS</PlanTitle>
            <PlanPrice>$0 MXN</PlanPrice>
            
            <PlanDescription>
              Funciones básicas de Knowly a tu alcance, aprender no tiene que ser aburrido!
            </PlanDescription>

            <Divider />

            <FeaturesList>
              <Feature disabled>
                <FeatureIcon disabled><X size={18} strokeWidth={2.5} /></FeatureIcon>
                <FeatureText disabled>Más grados</FeatureText>
              </Feature>
              <Feature disabled>
                <FeatureIcon disabled><X size={18} strokeWidth={2.5} /></FeatureIcon>
                <FeatureText disabled>Desactivar anuncios</FeatureText>
              </Feature>
              <Feature disabled>
                <FeatureIcon disabled><X size={18} strokeWidth={2.5} /></FeatureIcon>
                <FeatureText disabled>Nuevas materias</FeatureText>
              </Feature>
              <Feature disabled>
                <FeatureIcon disabled><X size={18} strokeWidth={2.5} /></FeatureIcon>
                <FeatureText disabled>Nuevas prácticas</FeatureText>
              </Feature>
            </FeaturesList>

            <ActionButton secondary onClick={() => { navigate('/Asignaturas'); handleSelectPlan('Gratis'); }}>
              Comenzar
            </ActionButton>
          </PlanCard>

          {/* Plan Premium */}
          <PlanCard premium>
            <PremiumGlow />
            
            <IconWrapper premium>
              <Crown size={48} color="#ffffff" strokeWidth={2.5} fill="#fbbf24" />
            </IconWrapper>
            
            <PlanTitle premium>PREMIUM</PlanTitle>
            <PlanPrice premium>$69.99<PriceUnit>/Mes</PriceUnit></PlanPrice>
            
            <PlanDescription>
              Nuevas funciones dentro de Knowly. ¡Suscríbete!
            </PlanDescription>

            <Divider premium />

            <FeaturesList>
              <Feature>
                <FeatureIcon premium><Check size={18} strokeWidth={3} /></FeatureIcon>
                <FeatureText>Más grados</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon premium><Check size={18} strokeWidth={3} /></FeatureIcon>
                <FeatureText>Desactivar anuncios</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon premium><Check size={18} strokeWidth={3} /></FeatureIcon>
                <FeatureText>Nuevas materias</FeatureText>
              </Feature>
              <Feature>
                <FeatureIcon premium><Check size={18} strokeWidth={3} /></FeatureIcon>
                <FeatureText>Nuevas prácticas</FeatureText>
              </Feature>
              <Feature>
                <FeatureText>Y mas</FeatureText>
              </Feature>
            </FeaturesList>

            <ActionButton primary onClick={() => handleSelectPlan('Premium')}>
              Suscribir
            </ActionButton>
          </PlanCard>
        </PlansGrid>

        {/* 💎 SECCIÓN DE CRISTALES - DESPUÉS DE LOS PLANES */}
        <CrystalsSection>
  <CrystalsSectionTitle>Compra Cristales</CrystalsSectionTitle>
  <CrystalsGrid>
    {/* 30 Cristales -> pack=small */}
    <CrystalCard>
      <CrystalIcon src="/coin.png" alt="Cristales" />
      <CrystalText>30 cristales</CrystalText>
      <CrystalPrice>$25.00 MXN</CrystalPrice>
      <CrystalButton onClick={() => navigate('/pagos?pack=small')}>
        Comprar
      </CrystalButton>
    </CrystalCard>

    {/* 80 Cristales -> pack=medium */}
    <CrystalCard featured>
      <CrystalBadge>Popular</CrystalBadge>
      <CrystalIcon src="/coin.png" alt="Cristales" />
      <CrystalText>80 cristales</CrystalText>
      <CrystalPrice>$59.00 MXN</CrystalPrice>
      <CrystalButton onClick={() => navigate('/pagos?pack=medium')}>
        Comprar
      </CrystalButton>
    </CrystalCard>

    {/* 170 Cristales -> pack=large */}
    <CrystalCard>
      <CrystalIcon src="/coin.png" alt="Cristales" />
      <CrystalText>170 cristales</CrystalText>
      <CrystalPrice>$129.00 MXN</CrystalPrice>
      <CrystalButton onClick={() => navigate('/pagos?pack=large')}>
        Comprar
      </CrystalButton>
    </CrystalCard>
  </CrystalsGrid>
</CrystalsSection>
      </MainContent>
    </PageContainer>
  );
}

export default Precios;

// 🎨 Styled Components

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 50%, #fce7f3 100%);
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.2);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const Logo = styled.img`
  height: 60px;

  @media (max-width: 768px) {
    height: 50px;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-grow: 1;
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
`;

const NavItemsWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 5px;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    color: #fbbf24;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0.5rem 0.2rem;
  }
`;

const RegisterButton = styled.button`
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.7rem 1.8rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 13px;
  }
`;

const CoinsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    margin-right: 0.3rem;
  }
`;

const CoinIcon = styled.div`
  color: #fbbf24;
  display: flex;
  align-items: center;
  filter: drop-shadow(0 2px 4px rgba(251, 191, 36, 0.5));
  animation: coinFloat 3s ease-in-out infinite;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  @keyframes coinFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(10deg); }
  }

  @media (max-width: 768px) {
    img {
      width: 20px;
      height: 20px;
    }
  }
`;

const CoinsAmount = styled.span`
  color: white;
  font-weight: 700;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(251, 191, 36, 0.4);
  }

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
  animation: dropdownFadeIn 0.2s ease-out;

  @keyframes dropdownFadeIn {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid white;
    filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
  }

  @media (max-width: 768px) {
    min-width: 160px;
    right: -10px;
  }
`;

const MenuItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #7c3aed;
    
    svg {
      color: #7c3aed;
    }
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }

  svg {
    color: #6b7280;
    transition: color 0.2s ease;
  }
`;

const MenuSeparator = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 4px 0;
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

// 💎 ESTILOS PARA LA SECCIÓN DE CRISTALES
const CrystalsSection = styled.section`
  max-width: 1200px;
  margin: 5rem auto 0 auto;
  padding: 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin-top: 4rem;
  }
`;

const CrystalsSectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  text-align: center;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

const CrystalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const CrystalCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  border: ${props => props.featured ? '4px solid #fbbf24' : '2px solid transparent'};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CrystalBadge = styled.div`
  position: absolute;
  top: -14px;
  right: 20px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  box-shadow: 0 6px 15px rgba(251, 191, 36, 0.5);
`;

const CrystalIcon = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(251, 191, 36, 0.6));
  animation: floatCoin 3s ease-in-out infinite;
  
  @keyframes floatCoin {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-12px) rotate(15deg); }
  }

  @media (max-width: 768px) {
    width: 75px;
    height: 75px;
  }
`;

const CrystalText = styled.p`
  font-size: 1.5rem;
  font-weight: 800;
  color: #2c3e50;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const CrystalPrice = styled.p`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }
`;

const CrystalButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  
  &:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 4rem;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const PlanCard = styled.div`
  background: ${props => props.premium 
    ? 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)'
    : 'white'
  };
  border-radius: 24px;
  padding: 3rem 2.5rem;
  position: relative;
  border: ${props => props.premium ? '3px solid transparent' : '2px solid #e5e7eb'};
  background-clip: ${props => props.premium ? 'padding-box' : 'border-box'};
  box-shadow: ${props => props.premium 
    ? '0 20px 60px rgba(124, 58, 237, 0.15), 0 0 0 3px #a855f7'
    : '0 10px 30px rgba(0, 0, 0, 0.08)'
  };
  transition: all 0.3s;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.premium 
      ? '0 25px 70px rgba(124, 58, 237, 0.25), 0 0 0 3px #a855f7'
      : '0 15px 40px rgba(0, 0, 0, 0.12)'
    };
  }
`;

const PremiumGlow = styled.div`
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
  pointer-events: none;
`;

const FreeBadge = styled.span`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
`;

const IconWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 24px;
  background: ${props => props.premium 
    ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
    : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: ${props => props.premium 
    ? '0 8px 24px rgba(124, 58, 237, 0.3)'
    : '0 4px 12px rgba(74, 222, 128, 0.2)'
  };
  transition: transform 0.3s;
  
  ${PlanCard}:hover & {
    transform: scale(1.05) rotate(5deg);
  }
`;

const PlanTitle = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  color: ${props => props.premium ? '#7c3aed' : '#1e3a8a'};
  margin-bottom: 0.75rem;
  text-align: center;
  letter-spacing: -0.5px;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: ${props => props.premium ? '#7c3aed' : '#64748b'};
  text-align: center;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
`;

const PriceUnit = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
`;

const PlanDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #64748b;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Divider = styled.hr`
  border: none;
  height: 2px;
  background: ${props => props.premium 
    ? 'linear-gradient(90deg, transparent, #a855f7, transparent)'
    : 'linear-gradient(90deg, transparent, #e5e7eb, transparent)'
  };
  margin: 1.5rem 0;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  opacity: ${props => props.disabled ? 0.4 : 1};
  transition: transform 0.2s;
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateX(4px)'};
  }
`;

const FeatureIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => {
    if (props.premium) return 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)';
    if (props.disabled) return '#fee2e2';
    return '#dcfce7';
  }};
  color: ${props => {
    if (props.premium) return 'white';
    if (props.disabled) return '#ef4444';
    return '#16a34a';
  }};
  flex-shrink: 0;
  box-shadow: ${props => props.premium 
    ? '0 4px 12px rgba(20, 184, 166, 0.3)'
    : 'none'
  };
`;

const FeatureText = styled.span`
  font-size: 0.95rem;
  color: ${props => props.disabled ? '#9ca3af' : '#374151'};
  font-weight: 500;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  
  ${props => props.primary && `
    background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
    color: white;
    box-shadow: 0 8px 20px rgba(20, 184, 166, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(20, 184, 166, 0.4);
    }
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }
    
    &:hover:before {
      left: 100%;
    }
  `}
  
  ${props => props.secondary && `
    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
    color: white;
    box-shadow: 0 6px 16px rgba(74, 222, 128, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(74, 222, 128, 0.4);
    }
  `}
  
  &:active {
    transform: translateY(0);
  }
`;
