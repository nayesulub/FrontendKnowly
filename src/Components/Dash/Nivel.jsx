import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  PlusCircle,
  Edit2,
  Trash2,
  X,
  Save,
  User,
  Mail,
  MapPin,
  Calendar,
  Image,
  Tag,
} from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/config';

const Nivel = () => {
  const [niveles, setNiveles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'Gratis',
    edad: '',
    correo: '',
    pais: '',
    imagen: 'https://via.placeholder.com/50',
  });

  // 🔄 Cargar usuarios desde la API al montar
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const res = await fetch(API_ENDPOINTS.USUARIOS, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const raw = await res.text();
        console.log('STATUS /api/usuarios =>', res.status);
        console.log('RAW RESPONSE /api/usuarios =>', raw);

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}: ${raw}`);
        }

        let data;
        try {
          data = JSON.parse(raw);
        } catch (e) {
          throw new Error(
            'La API no está devolviendo JSON válido. Revisa el backend o errores de Laravel.'
          );
        }

        const mapeados = data.map(u => ({
          id: u.id,
          nombre: u.name,
          correo: u.email,
          estado: u.estado || 'Gratis',
          edad: u.age ?? '',
          pais: u.country || '',
          imagen: u.imagen || 'https://via.placeholder.com/50',
        }));

        setNiveles(mapeados);
      } catch (err) {
        console.error('Error cargando usuarios:', err);
        setApiError(err.message || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Agregar nuevo usuario (solo front por ahora)
  const handleAddUser = () => {
    if (
      formData.nombre.trim() &&
      formData.edad.trim() &&
      formData.correo.trim() &&
      formData.pais.trim()
    ) {
      const newUser = {
        id: niveles.length > 0 ? Math.max(...niveles.map(n => n.id)) + 1 : 1,
        ...formData,
      };
      setNiveles(prev => [...prev, newUser]);
      setFormData({
        nombre: '',
        estado: 'Gratis',
        edad: '',
        correo: '',
        pais: '',
        imagen: 'https://via.placeholder.com/50',
      });
      setShowAddModal(false);
    } else {
      alert(
        'Por favor, complete todos los campos obligatorios (Nombre, Edad, Correo, País).'
      );
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({
      nombre: '',
      estado: 'Gratis',
      edad: '',
      correo: '',
      pais: '',
      imagen: 'https://via.placeholder.com/50',
    });
  };

  return (
    <MainContent>
      <TableContainer>
        <TableHeader>
          <HeaderTitle>USUARIOS</HeaderTitle>
          <AddButton onClick={() => setShowAddModal(true)}>
            <PlusCircle size={20} />
            <span>Agregar</span>
          </AddButton>
        </TableHeader>

        {loading && (
          <p style={{ padding: '1rem 2rem' }}>Cargando usuarios...</p>
        )}
        {apiError && !loading && (
          <p style={{ padding: '1rem 2rem', color: 'red' }}>
            Error al cargar usuarios: {apiError}
          </p>
        )}

        {!loading && !apiError && (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableCell as="th">#</TableCell>
                  <TableCell as="th">Estado</TableCell>
                  <TableCell as="th">Nombre</TableCell>
                  <TableCell as="th">Correo</TableCell>
                  <TableCell as="th">País</TableCell>
                  <TableCell as="th">Imagen</TableCell>
                  <TableCell as="th">Edad</TableCell>
                  <TableCell as="th" align="right">
                    Acciones
                  </TableCell>
                </tr>
              </thead>
              <tbody>
                {niveles.map(nivel => (
                  <TableRow key={nivel.id}>
                    <TableCell>{nivel.id}</TableCell>
                    <TableCell>
                      <Badge
                        color={
                          nivel.estado === 'Premium' ? '#f59e0b' : '#10b981'
                        }
                      >
                        {nivel.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <SubjectName>{nivel.nombre}</SubjectName>
                    </TableCell>
                    <TableCell>{nivel.correo}</TableCell>
                    <TableCell>{nivel.pais}</TableCell>
                    <TableCell>
                      <SubjectImageWrapper>
                        <SubjectImage src={nivel.imagen} alt="Usuario" />
                      </SubjectImageWrapper>
                    </TableCell>
                    <TableCell>{nivel.edad}</TableCell>
                    <TableCell align="right">
                      <ActionButtons>
                        <ActionButton color="#10b981">
                          <Edit2 size={18} />
                        </ActionButton>
                        <ActionButton color="#ef4444">
                          <Trash2 size={18} />
                        </ActionButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </TableContainer>

      {/* Modal de Agregar Nuevo Usuario con el mismo estilo que el otro */}
      <Overlay $isOpen={showAddModal} onClick={closeAddModal}>
        <Modal $isOpen={showAddModal} onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              <User size={24} />
              Agregar Nuevo Usuario
            </ModalTitle>
            <CloseButton onClick={closeAddModal}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <FormContainer>
            <FormGroup>
              <Label>
                <User size={16} />
                Nombre *
              </Label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Pérez"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Tag size={16} />
                Estado
              </Label>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <option value="Gratis">Gratis</option>
                <option value="Premium">Premium</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                <Calendar size={16} />
                Edad *
              </Label>
              <Input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                placeholder="Ej: 30"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Mail size={16} />
                Correo *
              </Label>
              <Input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleInputChange}
                placeholder="Ej: usuario@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <MapPin size={16} />
                País *
              </Label>
              <Input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleInputChange}
                placeholder="Ej: México"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <Image size={16} />
                URL de la Imagen
              </Label>
              <Input
                type="text"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="https://via.placeholder.com/50"
              />
            </FormGroup>
          </FormContainer>

          <ButtonGroup>
            <SecondaryButton type="button" onClick={closeAddModal}>
              <X size={16} />
              Cancelar
            </SecondaryButton>
            <PrimaryButton onClick={handleAddUser}>
              <Save size={16} />
              Guardar Usuario
            </PrimaryButton>
          </ButtonGroup>
        </Modal>
      </Overlay>
    </MainContent>
  );
};

export default Nivel;

/* ================= ESTILOS (mismo diseño que ASIGNATURAS) ================= */

const MainContent = styled.div`
  width: 100%;
  padding: 0;
  overflow-y: auto;
  background: transparent;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.4s ease;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    border-color: #7c3aed;
  }
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-bottom: 3px solid #6d28d9;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #7c3aed;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background: #f8fafc;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;

  thead {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    position: sticky;
    top: 0;
    z-index: 10;

    th {
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      font-size: 0.85rem;
      letter-spacing: 0.5px;
      padding: 1rem;
      border-bottom: 2px solid #cbd5e1;
    }
  }
`;

const TableRow = styled.tr`
  background: white;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;

  &:hover {
    background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: ${props => props.align || 'left'};
  color: #64748b;
  font-size: 0.9rem;
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 0.8rem 0.5rem;
    font-size: 0.85rem;
  }
`;

const SubjectName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
`;

const SubjectImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const SubjectImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.15);
    border-color: #7c3aed;
    box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  }
`;

const Description = styled.span`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  background: ${props => props.color}15;
  color: ${props => props.color};
  font-weight: 600;
  font-size: 0.8rem;
  border: 2px solid ${props => props.color};
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
    transform: scale(1.05);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${props => props.color}15;
  border: 2px solid ${props => props.color};
  color: ${props => props.color};
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.color};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.color}40;
  }

  &:active {
    transform: translateY(0);
  }
`;

/* Modal mismo estilo que en ASIGNATURAS */

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s.ease;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 550px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: ${props => (props.$isOpen ? 'scale(1)' : 'scale(0.95)')};
  transition: transform 0.3s ease;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
  border-bottom: 3px solid #6d28d9;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const FormContainer = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const ButtonBase = styled.button`
  padding: 0.9rem 1.8rem;
  border-radius: 25px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 0.7rem 1.3rem;
    font-size: 0.85rem;
  }
`;

const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled(ButtonBase)`
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;

  &:hover {
    background: #e2e8f0;
    color: #475569;
    border-color: #cbd5e1;
  }
`;
