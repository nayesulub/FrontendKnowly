import styled from 'styled-components';
import { Edit2, Trash2, PlusCircle } from 'lucide-react';

const Historial = () => {
    // Datos de ejemplo para historial de compras
    const compras = [
        { idCompra: 1, fecha: '2024-03-25', idCliente: 'C001', estado: 'Completado', precio: '$0', paquete: 'Básico' },
        { idCompra: 2, fecha: '2024-03-26', idCliente: 'C002', estado: 'Pendiente', precio: '$69.99', paquete: 'Premium' },
        { idCompra: 3, fecha: '2024-03-27', idCliente: 'C003', estado: 'Cancelado', precio: '$69.66', paquete: 'Premium' },
        { idCompra: 4, fecha: '2024-03-28', idCliente: 'C004', estado: 'Cancelado', precio: '$69.99', paquete: 'Premium' },
    ];

    return (
        <MainContent>
            <TableContainer>
                <TableHeader>
                    <h2>HISTORIAL DE COMPRAS</h2>
                    <AddButton>
                        <PlusCircle style={{ marginRight: '8px' }} />
                        Agregar
                    </AddButton>
                </TableHeader>
                <TableWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <TableCell as="th">#</TableCell>
                                <TableCell as="th">Fecha</TableCell>
                                <TableCell as="th">ID Cliente</TableCell>
                                <TableCell as="th">Estado</TableCell>
                                <TableCell as="th">Precio</TableCell>
                                <TableCell as="th">Paquete</TableCell>
                                <TableCell as="th" align="right">Acciones</TableCell>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map((compra) => (
                                <TableRow key={compra.idCompra}>
                                    <TableCell>{compra.idCompra}</TableCell>
                                    <TableCell>{compra.fecha}</TableCell>
                                    <TableCell>{compra.idCliente}</TableCell>
                                    <TableCell>{compra.estado}</TableCell>
                                    <TableCell>{compra.precio}</TableCell>
                                    <TableCell>{compra.paquete}</TableCell>
                                    <TableCell align="right">
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <ActionButton color="#2ecc71">
                                                <Edit2 size={18} />
                                            </ActionButton>
                                            <ActionButton color="#e74c3c">
                                                <Trash2 size={18} />
                                            </ActionButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableWrapper>
            </TableContainer>
        </MainContent>
    );
};

export default Historial;

// Styled Components
const MainContent = styled.div`
    flex-grow: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

const TableContainer = styled.div`
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 20px;
    display: flex;
    flex-direction: column;
`;

const TableHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
    padding-bottom: 10px;
`;

const AddButton = styled.button`
    display: flex;
    align-items: center;
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #2980b9;
    }
`;

const TableWrapper = styled.div`
    max-height: 400px;
    overflow-y: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
`;

const TableRow = styled.tr`
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.01);
    }
`;

const TableCell = styled.td`
    padding: 12px;
    text-align: ${props => props.align || 'left'};
`;

const ActionButton = styled.button`
    background-color: ${props => props.color};
    border: none;
    color: white;
    padding: 8px;
    margin: 0 5px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.8;
    }
`;