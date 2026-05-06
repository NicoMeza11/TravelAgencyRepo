import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Chip, CircularProgress, Box 
} from '@mui/material';
import api from '../ApiConf';

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => { //we get all reservations
        try {
            const response = await api.get('/reservation/allreservation');
            setReservations(response.data);
        } catch (error) {
            console.error("Error cargando todas las reservas:", error);
            alert("Error al cargar las reservas del sistema.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = async (idReservation) => { //to cancel a reservation
        console.log("ID de la reserva a cancelar: ", idReservation);

        const confirmCancel = window.confirm("ADMIN: ¿Estás seguro de cancelar esta reserva para el usuario?");
        if(!confirmCancel) return;

        try {
            await api.put(`/reservation/cancel/${idReservation}`);
            
            setReservations(prevReservations =>
                prevReservations.map(res =>
                    res.idReservation === idReservation
                    ? {...res, reservationStatus: 'CANCELLED'} 
                    : res
                )
            );
            alert("Reserva cancelada exitosamente.");
        } catch(error) {
            console.error("Error cancelando la reserva: ", error);
            alert("Hubo un problema al cancelar la reserva.");
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'CONFIRMED': return 'success';
            case 'PENDING_PAYMENT': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Panel de Administración: Todas las Reservas
            </Typography>
            
            <TableContainer component={Paper} elevation={3}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Reserva</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID Paquete</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Pasajeros</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Precio Total</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((res) => (
                            <TableRow key={res.idReservation} hover>
                                <TableCell>{res.idReservation}</TableCell>
                                <TableCell>{res.idPackage}</TableCell>
                                <TableCell>{res.passengerQuantity}</TableCell>
                                <TableCell>${res.finalAmount.toLocaleString()} USD</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={res.reservationStatus || res.status} 
                                        color={getStatusColor(res.reservationStatus || res.status)} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {(res.reservationStatus !== 'CANCELLED' && res.status !== 'CANCELLED') && (
                                        <Button 
                                            variant="outlined" 
                                            color="error" 
                                            size="small"
                                            onClick={() => handleCancelClick(res.idReservation)}
                                        >
                                            Cancelar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {reservations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No hay reservas en el sistema.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminReservations;