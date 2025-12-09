import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Edit2,
  Trash2,
  PlusCircle,
  FileText,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Plus,
  X,
  Crown
} from 'lucide-react';

const API_URL = 'http://localhost:8000/api/asignaturas';
const CATEGORIAS_API = 'http://localhost:8000/api/categorias';

const Gestion = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);        // agregar
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // editar
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // eliminar

  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

  // 🔄 Cargar asignaturas y categorías
  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const res = await fetch(API_URL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = await res.json();

        const mapeados = data.map(a => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion || '',
          Grado: a.grado || '',
          Nivel: a.nivel || '',
          categoria_id: a.categoria_id ?? null,
          isPremium: a.tipo === 'premium', // 👈 se convierte a booleano
        }));


        setDatos(mapeados);
      } catch (err) {
        console.error('Error cargando asignaturas:', err);
        setApiError(err.message || 'Error al cargar asignaturas');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategorias = async () => {
      try {
        const res = await fetch(CATEGORIAS_API, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = await res.json();

        // Solo categorías activas
        const activas = data.filter(c => c.estatus === 'activo');
        setCategorias(activas);
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };

    fetchAsignaturas();
    fetchCategorias();
  }, []);

  const getCategoriaNombre = (id) => {
    if (!id) return 'Sin categoría';
    const cat = categorias.find(c => Number(c.id) === Number(id));
    return cat ? cat.nombre : 'Sin categoría';
  };

  // 🔹 Agregar asignatura
  const agregarAsignatura = async (nuevaAsignatura) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevaAsignatura.nombre,
          descripcion: nuevaAsignatura.descripcion,
          grado: nuevaAsignatura.Grado,
          nivel: nuevaAsignatura.Nivel,
          categoria_id: nuevaAsignatura.categoria_id || null,
          isPremium: nuevaAsignatura.isPremium ?? false, // 👈 esto es lo que el backend convierte a tipo
        }),

      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(`Error al crear asignatura: ${raw}`);
      }

      const creada = await res.json();

      const asignaturaCompleta = {
        id: creada.id,
        nombre: creada.nombre,
        descripcion: creada.descripcion || '',
        Grado: creada.grado || '',
        Nivel: creada.nivel || '',
        categoria_id: creada.categoria_id ?? nuevaAsignatura.categoria_id ?? null,
        isPremium: nuevaAsignatura.isPremium ?? false,
      };

      setDatos(prevDatos => [...prevDatos, asignaturaCompleta]);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al guardar la asignatura');
    }
  };

  // ✏️ Actualizar asignatura
  const actualizarAsignatura = async (id, dataActualizada) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: dataActualizada.nombre,
          descripcion: dataActualizada.descripcion,
          grado: dataActualizada.Grado,
          nivel: dataActualizada.Nivel,
          categoria_id: dataActualizada.categoria_id || null,
          isPremium: dataActualizada.isPremium ?? false,
        }),
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(`Error al actualizar asignatura: ${raw}`);
      }

      const actualizada = await res.json();

      setDatos(prev =>
        prev.map(item =>
          item.id === id
            ? {
                ...item,
                nombre: actualizada.nombre,
                descripcion: actualizada.descripcion || '',
                Grado: actualizada.grado || '',
                Nivel: actualizada.nivel || '',
                categoria_id: actualizada.categoria_id ?? dataActualizada.categoria_id ?? null,
              }
            : item
        )
      );

      setIsEditModalOpen(false);
      setAsignaturaSeleccionada(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al actualizar la asignatura');
    }
  };

  // 🗑️ Eliminar asignatura
  const eliminarAsignatura = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const raw = await res.text();
        throw new Error(`Error al eliminar asignatura: ${raw}`);
      }

      setDatos(prev => prev.filter(item => item.id !== id));
      setIsDeleteModalOpen(false);
      setAsignaturaSeleccionada(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al eliminar la asignatura');
    }
  };

  const togglePremium = async (item) => {
  try {
    const res = await fetch(`${API_URL}/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        isPremium: !item.isPremium,
      }),
    });

    if (!res.ok) {
      const raw = await res.text();
      throw new Error(`Error al actualizar premium: ${raw}`);
    }

    const actualizada = await res.json();

    setDatos(prev =>
      prev.map(i =>
        i.id === item.id
          ? { ...i, isPremium: actualizada.tipo === 'premium' }
          : i
      )
    );
  } catch (err) {
    console.error(err);
    alert(err.message || 'Error al cambiar el tipo de asignatura');
  }
};


  const abrirEditar = (item) => {
    setAsignaturaSeleccionada(item);
    setIsEditModalOpen(true);
  };

  const abrirEliminar = (item) => {
    setAsignaturaSeleccionada(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <MainContent>
      <TableContainer>
        <TableHeader>
          <HeaderTitle>ASIGNATURAS</HeaderTitle>
          <AddButton onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} />
            <span>Agregar</span>
          </AddButton>
        </TableHeader>

        {loading && (
          <p style={{ padding: '1rem 2rem' }}>Cargando asignaturas...</p>
        )}

        {apiError && !loading && (
          <p style={{ padding: '1rem 2rem', color: 'red' }}>
            Error: {apiError}
          </p>
        )}

        {!loading && !apiError && (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableCell as="th">Nombre</TableCell>
                  <TableCell as="th">Descripción</TableCell>
                  <TableCell as="th">Categoría</TableCell>
                  <TableCell as="th">Grado</TableCell>
                  <TableCell as="th">Nivel</TableCell>
                  <TableCell as="th">Tipo</TableCell>
                  <TableCell as="th" align="right">
                    Acciones
                  </TableCell>
                </tr>
              </thead>
              <tbody>
                {datos.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <SubjectName>{item.nombre}</SubjectName>
                    </TableCell>
                    <TableCell>
                      <Description>{item.descripcion}</Description>
                    </TableCell>
                    <TableCell>
                      <Badge color="#6366f1">
                        {getCategoriaNombre(item.categoria_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color="#7c3aed">{item.Grado}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge color="#10b981">{item.Nivel}</Badge>
                    </TableCell>
                    <TableCell>
                      <SwitchContainer>
                        <SwitchLabel $isPremium={item.isPremium}>
                          {item.isPremium ? (
                            <>
                              <Crown size={14} />
                              Premium
                            </>
                          ) : (
                            'Gratuito'
                          )}
                        </SwitchLabel>
                        <Switch
                          $isOn={item.isPremium}
                          onClick={() => togglePremium(item)}
                        >
                          <SwitchToggle $isOn={item.isPremium} />
                        </Switch>
                      </SwitchContainer>
                    </TableCell>
                    <TableCell align="right">
                      <ActionButtons>
                        <ActionButton
                          color="#10b981"
                          onClick={() => abrirEditar(item)}
                        >
                          <Edit2 size={18} />
                        </ActionButton>
                        <ActionButton
                          color="#ef4444"
                          onClick={() => abrirEliminar(item)}
                        >
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

      {/* Modal AGREGAR */}
      <PanelAgregar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={agregarAsignatura}
        categorias={categorias}
      />

      {/* Modal EDITAR */}
      <PanelEditar
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setAsignaturaSeleccionada(null);
        }}
        onSave={(data) =>
          asignaturaSeleccionada &&
          actualizarAsignatura(asignaturaSeleccionada.id, data)
        }
        categorias={categorias}
        asignatura={asignaturaSeleccionada}
      />

      {/* Modal ELIMINAR */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAsignaturaSeleccionada(null);
        }}
        onConfirm={() =>
          asignaturaSeleccionada &&
          eliminarAsignatura(asignaturaSeleccionada.id)
        }
        asignatura={asignaturaSeleccionada}
      />
    </MainContent>
  );
};

/* =============== PANEL AGREGAR =============== */
const PanelAgregar = ({ isOpen, onClose, onSave, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    descripcion: '',
    Grado: '',
    Nivel: '',
    categoria_id: '',
    isPremium: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.nombre.trim() ||
      !formData.descripcion.trim() ||
      !formData.Grado ||
      !formData.Nivel ||
      !formData.categoria_id
    ) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    onSave(formData);

    setFormData({
      nombre: '',
      imagen: '',
      descripcion: '',
      Grado: '',
      Nivel: '',
      categoria_id: '',
      isPremium: false,
    });
  };

  const handleCancel = () => {
    onClose();
    setFormData({
      nombre: '',
      imagen: '',
      descripcion: '',
      Grado: '',
      Nivel: '',
      categoria_id: '',
      isPremium: false,
    });
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleCancel}>
      <Modal $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <BookOpen size={24} />
            Nueva Asignatura
          </ModalTitle>
          <CloseButton onClick={handleCancel}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <FormContainer>
          <FormGroup>
            <Label>
              <FileText size={16} />
              Nombre *
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Ej: Matemáticas Avanzadas"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FileText size={16} />
              Descripción *
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe brevemente el contenido de la asignatura..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <BookOpen size={16} />
              Categoría *
            </Label>
            <Select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias &&
                categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <GraduationCap size={16} />
              Grado *
            </Label>
            <Select
              name="Grado"
              value={formData.Grado}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un grado</option>
              <option value="Primero">Primero</option>
              <option value="Segundo">Segundo</option>
              <option value="Tercero">Tercero</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <TrendingUp size={16} />
              Nivel *
            </Label>
            <Select
              name="Nivel"
              value={formData.Nivel}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <Crown size={16} />
              Tipo de Asignatura
            </Label>
            <SwitchContainer>
              <SwitchLabel $isPremium={formData.isPremium}>
                {formData.isPremium ? (
                  <>
                    <Crown size={14} />
                    Premium
                  </>
                ) : (
                  'Gratuito'
                )}
              </SwitchLabel>
              <Switch
                $isOn={formData.isPremium}
                onClick={() =>
                  setFormData(prev => ({ ...prev, isPremium: !prev.isPremium }))
                }
              >
                <SwitchToggle $isOn={formData.isPremium} />
              </Switch>
            </SwitchContainer>
          </FormGroup>
        </FormContainer>

        <ButtonGroup>
          <SecondaryButton type="button" onClick={handleCancel}>
            <X size={16} />
            Cancelar
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>
            <Plus size={16} />
            Guardar Asignatura
          </PrimaryButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

/* =============== PANEL EDITAR =============== */
const PanelEditar = ({ isOpen, onClose, onSave, categorias, asignatura }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    Grado: '',
    Nivel: '',
    categoria_id: '',
    isPremium: false,
  });

  useEffect(() => {
    if (asignatura) {
      setFormData({
        nombre: asignatura.nombre || '',
        descripcion: asignatura.descripcion || '',
        Grado: asignatura.Grado || '',
        Nivel: asignatura.Nivel || '',
        categoria_id: asignatura.categoria_id || '',
        isPremium: asignatura.isPremium || false,
      });
    }
  }, [asignatura, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.nombre.trim() ||
      !formData.descripcion.trim() ||
      !formData.Grado ||
      !formData.Nivel ||
      !formData.categoria_id
    ) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleCancel}>
      <Modal $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <BookOpen size={24} />
            Editar Asignatura
          </ModalTitle>
          <CloseButton onClick={handleCancel}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <FormContainer>
          <FormGroup>
            <Label>
              <FileText size={16} />
              Nombre *
            </Label>
            <Input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la asignatura"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <FileText size={16} />
              Descripción *
            </Label>
            <TextArea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Describe brevemente el contenido de la asignatura..."
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>
              <BookOpen size={16} />
              Categoría *
            </Label>
            <Select
              name="categoria_id"
              value={formData.categoria_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias &&
                categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <GraduationCap size={16} />
              Grado *
            </Label>
            <Select
              name="Grado"
              value={formData.Grado}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un grado</option>
              <option value="Primero">Primero</option>
              <option value="Segundo">Segundo</option>
              <option value="Tercero">Tercero</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <TrendingUp size={16} />
              Nivel *
            </Label>
            <Select
              name="Nivel"
              value={formData.Nivel}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un nivel</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <Crown size={16} />
              Tipo de Asignatura
            </Label>
            <SwitchContainer>
              <SwitchLabel $isPremium={formData.isPremium}>
                {formData.isPremium ? (
                  <>
                    <Crown size={14} />
                    Premium
                  </>
                ) : (
                  'Gratuito'
                )}
              </SwitchLabel>
              <Switch
                $isOn={formData.isPremium}
                onClick={() =>
                  setFormData(prev => ({ ...prev, isPremium: !prev.isPremium }))
                }
              >
                <SwitchToggle $isOn={formData.isPremium} />
              </Switch>
            </SwitchContainer>
          </FormGroup>
        </FormContainer>

        <ButtonGroup>
          <SecondaryButton type="button" onClick={handleCancel}>
            <X size={16} />
            Cancelar
          </SecondaryButton>
          <PrimaryButton onClick={handleSubmit}>
            <SaveIconWrapper>
              <Plus size={16} style={{ transform: 'rotate(90deg)' }} />
            </SaveIconWrapper>
            Guardar Cambios
          </PrimaryButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

/* =============== MODAL ELIMINAR =============== */
const DeleteModal = ({ isOpen, onClose, onConfirm, asignatura }) => {
  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleCancel}>
      <Modal $isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Trash2 size={24} />
            Eliminar Asignatura
          </ModalTitle>
          <CloseButton onClick={handleCancel}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <FormContainer>
          <p style={{ color: '#334155', fontSize: '0.95rem', marginBottom: '1rem' }}>
            ¿Estás seguro de que deseas eliminar la asignatura{' '}
            <strong>{asignatura?.nombre}</strong>?
          </p>
          <p style={{ color: '#ef4444', fontSize: '0.85rem' }}>
            Esta acción no se puede deshacer.
          </p>
        </FormContainer>

        <ButtonGroup>
          <SecondaryButton type="button" onClick={handleCancel}>
            <X size={16} />
            Cancelar
          </SecondaryButton>
          <PrimaryButton
            onClick={handleConfirm}
            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
          >
            <Trash2 size={16} />
            Eliminar
          </PrimaryButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

const SaveIconWrapper = styled.span`
  display: flex;
  align-items: center;
`;

/* =============== STYLED COMPONENTS =============== */
/* (aquí puedes dejar los mismos que ya tenías: MainContent, TableContainer, TableHeader, etc.) */
/* Copio los que son necesarios para que funcione tal cual */

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
`;

const HeaderTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
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
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  max-height: 600px;
  overflow-y: auto;
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
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: ${props => props.align || 'left'};
  color: #64748b;
  font-size: 0.9rem;
  vertical-align: middle;
`;

const SubjectName = styled.span`
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
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
  transition: all 0.3s.ease;
`;

const SwitchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const SwitchLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => (props.$isPremium ? '#f59e0b' : '#64748b')};
`;

const Switch = styled.div`
  width: 56px;
  height: 28px;
  background: ${props =>
    props.$isOn
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      : '#cbd5e1'};
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SwitchToggle = styled.div`
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${props => (props.$isOn ? '31px' : '3px')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Modal
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
  transition: all 0.3s ease;
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
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  color: white;
`;

const FormContainer = styled.div`
  padding: 2rem;
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
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
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
`;

const PrimaryButton = styled(ButtonBase)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
`;

const SecondaryButton = styled(ButtonBase)`
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #e2e8f0;
`;

export default Gestion;
