import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit2, Trash2, PlusCircle, X, Save, AlertTriangle } from 'lucide-react';

const API_URL = "https://knowly-vkbg.onrender.com/api/categorias";

const Categorias = () => {

    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // Estados para modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [current, setCurrent] = useState(null);

    const [formData, setFormData] = useState({
        nombre: "",
        estatus: "activo",
    });

    // ================================
    // Cargar datos API
    // ================================
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true);
                setApiError(null);

                const res = await fetch(API_URL);
                const raw = await res.text();

                if (!res.ok) {
                    throw new Error("Error cargando categorías: " + raw);
                }

                setCategorias(JSON.parse(raw));
            } catch (error) {
                setApiError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);


    // ================================
    // Manejo de formularios
    // ================================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // ================================
    // Crear categoría
    // ================================
    const handleAdd = async () => {
        if (!formData.nombre.trim()) {
            alert("El nombre es obligatorio.");
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("No se pudo crear la categoría");

            const categoria = await res.json();

            setCategorias(prev => [...prev, categoria]);

            setFormData({ nombre: "", estatus: "activo" });
            setShowAddModal(false);
        } catch (error) {
            alert(error.message);
        }
    };


    // ================================
    // Editar categoría
    // ================================
    const openEdit = (categoria) => {
        setCurrent(categoria);
        setFormData({
            nombre: categoria.nombre,
            estatus: categoria.estatus,
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const res = await fetch(`${API_URL}/${current.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("No se pudo actualizar");

            const updated = await res.json();

            setCategorias(prev =>
                prev.map(c => (c.id === current.id ? updated : c))
            );

            setShowEditModal(false);
            setCurrent(null);
        } catch (error) {
            alert(error.message);
        }
    };


    // ================================
    // Eliminar categoría
    // ================================
    const openDelete = (cat) => {
        setCurrent(cat);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await fetch(`${API_URL}/${current.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("No se pudo eliminar");

            setCategorias(prev => prev.filter(c => c.id !== current.id));

            setShowDeleteModal(false);
            setCurrent(null);
        } catch (error) {
            alert(error.message);
        }
    };


    // ================================
    // Render del componente
    // ================================
    return (
        <MainContent>
            <TableContainer>
                <TableHeader>
                    <h2>CATEGORÍAS</h2>

                    <AddButton onClick={() => setShowAddModal(true)}>
                        <PlusCircle style={{ marginRight: "8px" }} />
                        Agregar
                    </AddButton>
                </TableHeader>

                {loading && <p>Cargando...</p>}
                {apiError && <p style={{ color: "red" }}>{apiError}</p>}

                {!loading && !apiError && (
                    <TableWrapper>
                        <Table>
                            <thead>
                                <tr>
                                    <TableCell as="th">#</TableCell>
                                    <TableCell as="th">Nombre</TableCell>
                                    <TableCell as="th">Estatus</TableCell>
                                    <TableCell as="th" align="right">Acciones</TableCell>
                                </tr>
                            </thead>

                            <tbody>
                                {categorias.map(cat => (
                                    <TableRow key={cat.id}>
                                        <TableCell>{cat.id}</TableCell>
                                        <TableCell>{cat.nombre}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={cat.estatus}>
                                                {cat.estatus}
                                            </StatusBadge>
                                        </TableCell>

                                        <TableCell align="right">
                                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <ActionButton color="#2ecc71" onClick={() => openEdit(cat)}>
                                                    <Edit2 size={18} />
                                                </ActionButton>

                                                <ActionButton color="#e74c3c" onClick={() => openDelete(cat)}>
                                                    <Trash2 size={18} />
                                                </ActionButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </TableContainer>



            {/* ==================== MODAL AGREGAR ==================== */}
            {showAddModal && (
                <ModalOverlay onClick={() => setShowAddModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>Nueva Categoría</h3>
                            <CloseButton onClick={() => setShowAddModal(false)}>
                                <X size={24} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <FormGroup>
                                <Label>Nombre</Label>
                                <Input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Ej. Productos"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Estatus</Label>
                                <Select
                                    name="estatus"
                                    value={formData.estatus}
                                    onChange={handleInputChange}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </Select>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <SecondaryButton onClick={() => setShowAddModal(false)}>
                                Cancelar
                            </SecondaryButton>

                            <PrimaryButton onClick={handleAdd}>
                                <Save size={18} style={{ marginRight: "8px" }} />
                                Guardar
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}



            {/* ==================== MODAL EDITAR ==================== */}
            {showEditModal && (
                <ModalOverlay onClick={() => setShowEditModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <h3>Editar Categoría</h3>
                            <CloseButton onClick={() => setShowEditModal(false)}>
                                <X size={24} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <FormGroup>
                                <Label>Nombre</Label>
                                <Input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Estatus</Label>
                                <Select
                                    name="estatus"
                                    value={formData.estatus}
                                    onChange={handleInputChange}
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </Select>
                            </FormGroup>
                        </ModalBody>

                        <ModalFooter>
                            <SecondaryButton onClick={() => setShowEditModal(false)}>
                                Cancelar
                            </SecondaryButton>

                            <PrimaryButton onClick={handleSaveEdit}>
                                <Save size={18} style={{ marginRight: "8px" }} />
                                Guardar Cambios
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            )}



            {/* ==================== MODAL ELIMINAR ==================== */}
            {showDeleteModal && (
                <ModalOverlay onClick={() => setShowDeleteModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <div style={{ display: "flex", alignItems: "center", color: "#e74c3c" }}>
                                <AlertTriangle size={26} style={{ marginRight: "12px" }} />
                                <h3>Eliminar Categoría</h3>
                            </div>

                            <CloseButton onClick={() => setShowDeleteModal(false)}>
                                <X size={24} />
                            </CloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <p>
                                ¿Seguro que deseas eliminar la categoría{" "}
                                <strong>{current?.nombre}</strong>?
                            </p>
                        </ModalBody>

                        <ModalFooter>
                            <SecondaryButton onClick={() => setShowDeleteModal(false)}>
                                Cancelar
                            </SecondaryButton>

                            <DangerButton onClick={confirmDelete}>
                                <Trash2 size={18} style={{ marginRight: "8px" }} />
                                Eliminar
                            </DangerButton>
                        </ModalFooter>

                    </ModalContent>
                </ModalOverlay>
            )}

        </MainContent>
    );
};

export default Categorias;



/* ================================
   STYLED COMPONENTS  
================================ */

const MainContent = styled.div`
    flex-grow: 1;
    padding: 20px;
`;

const TableContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 20px;
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #3498db;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #2980b9;
    }
`;

const TableWrapper = styled.div`
    margin-top: 15px;
    max-height: 400px;
    overflow-y: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
`;

const TableRow = styled.tr`
    background: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);

    &:hover {
        transform: scale(1.01);
        transition: 0.2s;
    }
`;

const TableCell = styled.td`
    padding: 12px;
    text-align: ${props => props.align || "left"};
`;

const ActionButton = styled.button`
    background-color: ${props => props.color};
    color: white;
    border: none;
    padding: 8px;
    border-radius: 6px;
    margin-left: 6px;
    cursor: pointer;
`;

const StatusBadge = styled.span`
    background-color: ${props => props.status === "activo" ? "#2ecc71" : "#e74c3c"};
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
`;

const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    width: 90%;
    max-width: 500px;
    border-radius: 12px;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const CloseButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
`;

const ModalBody = styled.div`
    margin-bottom: 20px;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #e1e5e9;

    &:focus {
        border-color: #3498db;
        outline: none;
    }
`;

const Select = styled.select`
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #e1e5e9;

    &:focus {
        border-color: #3498db;
        outline: none;
    }
`;

const PrimaryButton = styled.button`
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;

    &:hover {
        background: #2980b9;
    }
`;

const SecondaryButton = styled.button`
    background: #f1f1f1;
    border: 2px solid #dcdcdc;
    padding: 10px 15px;
    border-radius: 8px;

    &:hover {
        background: #e9e9e9;
    }
`;

const DangerButton = styled.button`
    background: #e74c3c;
    border: none;
    padding: 10px 15px;
    color: white;
    border-radius: 8px;

    &:hover {
        background: #c0392b;
    }
`;
