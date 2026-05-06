import React, { useState, useEffect } from 'react';
import { 
  Container, Paper, Typography, TextField, Button, Grid, Box, Alert, CircularProgress 
} from '@mui/material';
import api from '../ApiConf';
import keycloak from '../keycloak';

function UserProfile(){
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    documentId: '',
    nationality: ''
  });

  const userId = keycloak.tokenParsed.sub;

  useEffect(() => {
    const fetchUserData = async () => {
        try{
            const response = await api.get(`/user/${userId}`);
            setFormData({
                firstName: response.data.firstName || '',
                lastName: response.data.lastName || '',
                email: response.data.email || '',
                phoneNumber: response.data.phoneNumber || '',
                documentId: response.data.documentId || '',
                nationality: response.data.nationality || ''
            });
        }catch(error){
            console.error("Error loading profile:",error);
            setMessage({ type: 'error', text: 'Profile data could not be loaded'})
        }finally{
            setLoading(false);
        }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put(`/user/update/${userId}`, formData);
      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMessage({ type: 'error', text: 'Error al actualizar el perfil. Intenta de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Mi Perfil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Gestiona tu información personal para tus futuras reservas.
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Nombre" name="firstName"
                value={formData.firstName} onChange={handleChange} required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Apellido" name="lastName"
                value={formData.lastName} onChange={handleChange} required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Correo Electrónico" name="email"
                value={formData.email} disabled
                helperText="El correo no puede ser modificado por seguridad."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Teléfono" name="phoneNumber"
                value={formData.phoneNumber} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Documento de Identidad" name="documentId"
                value={formData.documentId} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Nacionalidad" name="nationality"
                value={formData.nationality} onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button 
                  type="submit" variant="contained" color="primary" 
                  size="large" disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );

}
export default UserProfile;