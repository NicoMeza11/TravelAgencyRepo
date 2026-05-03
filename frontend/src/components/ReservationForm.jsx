import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../ApiConf';
import keycloak from '../keycloak';

const ReservationForm = ({ packageId, price, spotsAvailable }) => {
    const [passengers, setPassengers] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleReserveClick = async () => {
        if (passengers > spotsAvailable) {
            setError('No hay suficientes cupos disponibles.');
            return;
        }
        if (passengers < 1) {
            setError('Debe viajar al menos 1 pasajero.');
            return;
        }

        setLoading(true);
        setError('');

        const userId = keycloak.tokenParsed?.sub;

        const requestDTO = {
            idCustomer: userId,
            idPackage: packageId,
            passengerQuantity: passengers
        };

        try {
            const response = await api.post('/reservation/save', requestDTO);
            
            console.log("Reserva creada con éxito", response.data);
            

            navigate('/home/checkout', { state: { reservationSummary: response.data } });
            
        } catch (err) {
            console.error("Error creando la reserva:", err);
            setError('Hubo un problema al crear la reserva. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Reserva este paquete
            </Typography>
            
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Precio por persona: ${price} USD
            </Typography>

            <Typography variant="body2" color={spotsAvailable < 5 ? "error" : "success.main"} gutterBottom>
                Cupos disponibles: {spotsAvailable}
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Cantidad de pasajeros"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: spotsAvailable } }}
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                    fullWidth
                />

                {error && <Alert severity="error">{error}</Alert>}

                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleReserveClick}
                    disabled={loading || spotsAvailable === 0}
                >
                    {loading ? 'Procesando...' : 'Ir al Pago'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ReservationForm;