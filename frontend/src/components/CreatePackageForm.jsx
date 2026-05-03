import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Grid, Paper, Alert, MenuItem 
} from '@mui/material';
import api from '../ApiConf'; 

const CreatePackageForm = () => {
  const [formData, setFormData] = useState({
    packageName: '',
    destination: '',
    description: '',
    startDate: '',
    finishDate: '',
    price: '',
    packageDiscount:'',
    urlImagen: '',
    includedServices: '',
    conditions: '',
    restrictions: '',
    spotsAvailable: '',
    travelType: '',
    season: '',
    packageStatus: 'ACTIVE' 
  });

  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
        const response = await api.post('/tourpackage/save', {
            ...formData,
            price: parseFloat(formData.price),
            packageDiscount: parseFloat(formData.packageDiscount),
            spotsAvailable: parseInt(formData.spotsAvailable)
        });

        setSuccessMsg('Package created successfully');
        
        setFormData({ //we clean de form
            packageName: '', destination: '', description: '', startDate: '', finishDate: '',
            price: '', packageDiscount: '', urlImagen: '', includedServices: '', conditions: '', restrictions: '',
            spotsAvailable: '', travelType: '', season: '', packageStatus: 'ACTIVE'
        });

    } catch(error) {

        const mensajeBackend = error.response?.data?.message;

      if (mensajeBackend) {
        setErrorMsg(mensajeBackend);
      } else {
        setErrorMsg('Unexpected error when trying to save de packageS');
        }
      }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 5, borderRadius: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Crear nuevo Paquete
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nombre del paquete" name="packageName" value={formData.packageName} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Destino" name="destination" value={formData.destination} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth multiline rows={3} label="Descripcion" name="description" value={formData.description} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Fecha de inicio" name="startDate" value={formData.startDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Fecha de termino" name="finishDate" value={formData.finishDate} onChange={handleChange} InputLabelProps={{ shrink: true }} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" inputProps={{ step: "0.01" }} label="Precio (USD)" name="price" value={formData.price} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" inputProps={{ step: "0.01"}} label="Descuento (Decimales)" name="packageDiscount" value={FormData.packageDiscount} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="number" label="Cupos disponibles" name="spotsAvailable" value={formData.spotsAvailable} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12}>
            <TextField fullWidth label="Servicios incluidos (separados por coma)" name="includedServices" value={formData.includedServices} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Condiciones" name="conditions" value={formData.conditions} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Restricciones" name="restrictions" value={formData.restrictions} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Tipo de viaje" name="travelType" value={formData.travelType} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Estación" name="season" value={formData.season} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="URL Imagen" name="urlImagen" value={formData.urlImagen} onChange={handleChange} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Estado" name="packageStatus" value={formData.packageStatus} onChange={handleChange}>
              <MenuItem value="ACTIVE">Active (Visible)</MenuItem>
              <MenuItem value="INACTIVE">Inactive (Hidden)</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ mt: 2, py: 1.5, fontSize: '1.1rem' }}>
              Guardar Paquete
            </Button>
          </Grid>

        </Grid>
      </Box>
    </Paper>
  );
};

export default CreatePackageForm;