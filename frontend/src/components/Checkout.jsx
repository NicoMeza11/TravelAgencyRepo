import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Typography, Paper, TextField, Button, 
  Box, Divider, Card, CardContent, Alert, Stepper, Step, StepLabel 
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import api from '../ApiConf';

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { reservationSummary } = location.state || {}; // Recibimos los datos del paso anterior

    // Estados para el formulario de tarjeta
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        paymentMethod: 'CREDIT_CARD',
    });
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!reservationSummary) {
        return <Alert severity="warning">No hay una reserva activa para pagar.</Alert>;
    }

    const handleChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        const paymentRequestDTO = {
            idReservation: reservationSummary.idReservation,
            ...paymentData
        };

        try {
            await api.post('/payment/save', paymentRequestDTO);
            setSuccess(true);
            setTimeout(() => {
                navigate('/my-reservations'); // Redirect after 3 seconds
            }, 3000);
        } catch (error) {
            console.error("Error en el pago", error);
            alert("Error al procesar el pago simulado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 5, mb: 10 }}>
            <Stepper activeStep={1} sx={{ mb: 5 }}>
                <Step><StepLabel>Reserva</StepLabel></Step>
                <Step><StepLabel>Pago</StepLabel></Step>
                <Step><StepLabel>Confirmación</StepLabel></Step>
            </Stepper>

            {success ? (
                <Box textAlign="center" sx={{ mt: 10 }}>
                    <Alert severity="success" sx={{ fontSize: '1.2rem', py: 3 }}>
                        ¡Pago Exitoso! Tu reserva ha sido confirmada. Redirigiendo a tus viajes...
                    </Alert>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {/* Purchase Summary */}
                    <Grid item xs={12} md={5}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Resumen de tu Reserva
                        </Typography>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body1">Pasajeros: <strong>{reservationSummary.passengerQuantity}</strong></Typography>
                                <Typography variant="body1">Fecha: <strong>{new Date(reservationSummary.reservationDate).toLocaleDateString()}</strong></Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Precio Base:</Typography>
                                <Typography>${reservationSummary.basePrice.toLocaleString()} USD</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'success.main' }}>
                                <Typography>Descuentos Aplicados:</Typography>
                                <Typography> ${reservationSummary.discount * 100} %</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total a Pagar:</Typography>
                                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                    ${reservationSummary.finalAmount.toLocaleString()} USD
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Payment Form */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Información de Pago
                        </Typography>
                        <Card elevation={4} sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box component="form" onSubmit={handlePayment}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Número de Tarjeta"
                                                name="cardNumber"
                                                placeholder="0000 0000 0000 0000"
                                                value={paymentData.cardNumber}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="Fecha de Expiración"
                                                name="expirationDate"
                                                placeholder="MM/YY"
                                                value={paymentData.expirationDate}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                label="CVV"
                                                name="cvv"
                                                type="password"
                                                placeholder="123"
                                                value={paymentData.cvv}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                size="large"
                                                startIcon={<PaymentIcon />}
                                                disabled={loading}
                                                sx={{ py: 1.5, fontSize: '1.1rem' }}
                                            >
                                                {loading ? 'Procesando Pago...' : `Pagar $${reservationSummary.finalAmount.toLocaleString()} USD`}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
}

export default Checkout;