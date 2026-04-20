import { Button, Box, Typography, Paper, Container } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import keycloak from '../keycloak'; 
const LoginPage = () => {

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a237e 0%, #0288d1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={10}
                    sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}
                >
                    <FlightTakeoffIcon sx={{ fontSize: 60, color: '#0288d1', mb: 2 }} />

                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        TravelAgency
                    </Typography>

                    <Typography variant="body1" color="text.secondary" mb={4}>
                        Inicia sesión para explorar nuestros paquetes turísticos
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={() => keycloak.login()}
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            backgroundColor: '#0288d1',
                            '&:hover': { backgroundColor: '#0277bd' },
                        }}
                    >
                        Iniciar Sesión
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginPage;