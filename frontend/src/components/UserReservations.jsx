import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../ApiConf'; 
import keycloak from '../keycloak';
import { 
    Typography, Card, CardContent, CircularProgress, Button, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import PackageDetailsModal from './PackageDetailsModal';

const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #printable-receipt, #printable-receipt * {
      visibility: visible;
    }
    #printable-receipt {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      padding: 20px;
    }
    /* Ocultamos los botones del modal al imprimir */
    .no-print {
      display: none !important;
    }
  }
`;

const UserReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para manejar el Modal del Comprobante
    const [openModal, setOpenModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState(null);

    const [openPackageModal, setOpenPackageModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loadingPackage, setLoadingPackage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            const userId = keycloak.tokenParsed.sub; 
            if(!userId) return;

            try{
                const response = await api.get(`/reservation/user/${userId}`);
                setReservations(response.data ? response.data : []); 
            }catch(error){
                console.error("Error loading reservations", error);
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
                    ? {...res, reservationStatus: 'CANCELLED'} 
                    : res
                )
            );
            alert("Reserva cancelada con éxito");
        }catch(error){
            console.error("Error cancelando la reserva: ", error);
            alert("Hubo un problema al cancelar la reserva. Intente nuevamente");
        }
    }

    // Funciones para el Modal
    const handleOpenReceipt = (res) => {
        setSelectedReceipt(res);
        setOpenModal(true);
    };

    const handleCloseReceipt = () => {
        setOpenModal(false);
        setSelectedReceipt(null);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleViewPackage = async (idPackage) => {
        setOpenPackageModal(true); 
        setLoadingPackage(true);
        try {
            const response = await api.get(`/tourpackage/${idPackage}`); 
            setSelectedPackage(response.data);
        } catch (error) {
            console.error("Error al obtener el paquete", error);
            alert("No se pudo cargar la información del paquete en este momento.");
            setOpenPackageModal(false);
        } finally {
            setLoadingPackage(false);
        }
    };

    const handleClosePackageModal = () => {
        setOpenPackageModal(false);
        setSelectedPackage(null); 
    };
    
    if(loading) return <CircularProgress />;
    if(error) return <Typography color="error">{error}</Typography>

    return (
        <div style={{ padding: '20px' }}>
            <style>{printStyles}</style>

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

                            <Box display="flex" flexDirection="column" gap={1} minWidth="150px">        
                                
                                {/* REEMPLAZO: Mostrar Comprobante en lugar de Ver Paquete si está Confirmada */}
                                {res.reservationStatus === 'CONFIRMED' && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small"
                                        onClick={() => handleOpenReceipt(res)}
                                    >
                                        Ver Comprobante
                                    </Button>
                                )}

                                <Button 
                                    variant="outlined" 
                                    color="info" 
                                    size="small"
                                    onClick={() => handleViewPackage(res.idPackage)}
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

            <PackageDetailsModal //the information of the package
                open={openPackageModal} 
                onClose={handleClosePackageModal} 
                tourPackage={selectedPackage} 
                hideReservationForm={true} 
            />
        </div>
    );
};

export default UserReservations;