import React, { useState } from "react";
import {Box, TextField, Button, Typography, Paper} from "@mui/material";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try{
            // 2. Keycloak exige formato 'application/x-www-form-urlencoded'
            const params = new URLSearchParams();
            params.append('client_id', 'spring-client-api-rest'); // Pon el nombre del cliente que creaste en Keycloak
            params.append('grant_type', 'password');
            params.append('username', email); // Keycloak lo llama username, aunque le pases el correo
            params.append('password', password);

            // 3. Hacemos la petición a Keycloak
            const response = await axios.post(
                "http://localhost:8081/realms/spring-boot-realm-dev/protocol/openid-connect/token",
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
        }catch{

        }
    }
    return(
        <Box sx = {{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#e3f2fd'
        }}>
            <Paper elevation={3} sx={{ padding: 4, width: '400px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                
                <Typography variant="h4" align="center" fontWeight="bold">
                    Agencia de Viajes
                </Typography>
                <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 2 }}>
                    Ingresa tus credenciales para continuar
                </Typography>

                <TextField label="Correo Electrónico" variant="outlined" fullWidth />
                <TextField label="Contraseña" type="password" variant="outlined" fullWidth />

                <Button variant="contained" color="primary" size="large" fullWidth>
                    Iniciar Sesión
                </Button>

                <Button variant="text" color="primary" fullWidth>
                    ¿No tienes cuenta? Regístrate aqui
                </Button>
                
            </Paper>
        </Box>
    );
};

export default Login;