import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../ApiConf'; 
import keycloak from '../keycloak';
import { Typography, Card, CardContent, CircularProgress, Button, Box } from '@mui/material';
const UserReservations = () => {

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const userId = keycloak.tokenParsed.sub; //we get the user id
            if(!userId) return;

            try{
                const response = await api.get(`/reservation/user/${userId}`);
                setReservations(response.data ? response.data : []); //get the reservations or []
            }catch(error){
                console.error("Error loading reservations", err);
                setError("Hubo un error al cargar sus reservas");
            }finally{
                setLoading(false);
            }
        };
        fetchReservations();

    }, []);
    
    const handleCancelClick = async (idReservation) => {
        const confirmCancel = window.confirm("¿Estas seguro que deseas cancelar esta reserva?");
        if(!confirmCancel) return;

        try{
            await api.put(`/reservation/cancel/${idReservation}`);

            setReservations(prevReservations =>
                prevReservations.map(res =>
                    res.idReservation === idReservation
                    ? {...res, reservationStatus: 'CANCELLED'} //change reservation status
                    : res
                )
            );
            
            alert("Reserva cancelada con éxito");
        }catch(error){
            console.error("Error cancelando la reserva: ", error);
            alert("Hubo un problema al cancelar la reserva. Intente nuevamente");
        }
    }
    
    if(loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Mis Reservas</Typography>
            
            {reservations.length === 0 ? (
                <Typography>Aún no tienes reservas realizadas.</Typography>
            ) : (
                reservations.map((res) => (
                    <Card key={res.idReservation} style={{ marginBottom: '15px' }}>
                        <CardContent
                            component={Box} 
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            <Box mb={{ xs: 2, sm: 0 }}> 
                                <Typography variant="h6" color="primary">
                                    Reserva #{res.idReservation}
                                </Typography>
                                <Typography><strong>Paquete ID:</strong> {res.idPackage}</Typography>
                                <Typography><strong>Pasajeros:</strong> {res.passengerQuantity}</Typography>                     
                                <Typography>
                                    <strong>Estado:</strong> {res.reservationStatus} 
                                </Typography>
                            </Box>

                            <Box display="flex" flexdirection="column" gap={1} minwidth="150px">        
                                <Button 
                                    variant="outlined" 
                                    color="info" 
                                    size="small"
                                    onClick={() => navigate('/home/packages', { state: { autoOpenPackageId: res.idPackage } })}
                                >
                                    Ver Paquete
                                </Button>

                                {(res.reservationStatus === 'PENDING_PAYMENT' || res.reservationStatus === 'CONFIRMED') && (
                                    <Button 
                                        variant="outlined" 
                                        color="error" 
                                        size="small"
                                        onClick={() => handleCancelClick(res.idReservation)}
                                    >
                                        Cancelar
                                    </Button>
                                )}

                                {res.reservationStatus === 'PENDING_PAYMENT' && (
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        size="small"
                                        onClick={() => console.log("Ir a pagar", res.idReservation)}
                                    >
                                        Pagar
                                    </Button>
                                )}
                            </Box>
                        
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};
export default UserReservations;