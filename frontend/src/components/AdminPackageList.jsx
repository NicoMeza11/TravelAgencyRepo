import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Button, Alert, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem
} from '@mui/material';
import api from '../ApiConf';
import EditIcon from '@mui/icons-material/Edit';

const AdminPackageList = () => {

  const [packages, setPackages] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/tourpackage/list');
      setPackages(response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setErrorMsg("No se pudieron cargar los paquetes. Verifica que el servidor esté encendido.");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleCloseEdit = () => {
    setOpenEditModal(false);
    setEditFormData(null);
    setErrorMsg(null);
  };

  const handleOpenEdit = (pkg) => {
    setEditFormData({...pkg});
    setOpenEditModal(true);
  };

  const handleUpdateSubmit = async (id) => {

    try {
      await api.put(`/tourpackage/update/${editFormData.idPackage}`,{

        ...editFormData,
        price: parseFloat(editFormData.price),
        spotsAvailable: parseInt(editFormData.spotsAvailable)
      });

      setPackages(packages.map((pkg) =>
        pkg.idPackage === editFormData.idPackage ? editFormData : pkg
      ));

      setSuccessMsg("Paquete actualizado correctamente");
      handleCloseEdit();
      setTimeout(() => setSuccessMsg(null), 3000);
      
    } catch (error) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        setErrorMsg(`Error al cambiar estado: ${backendMessage}`);
      } else {
        setErrorMsg("Error inesperado al intentar cambiar el estado.");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()){
      case 'ACTIVE': return 'green';
      case 'SOLD_OUT': return '#ff9800';
      case 'INACTIVE': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'black';
    }
  };


  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Administrar Paquetes Turísticos
      </Typography>

      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Precio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cupos</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.idPackage} hover>
                <TableCell>{pkg.idPackage}</TableCell>
                <TableCell>{pkg.packageName}</TableCell>
                <TableCell>{pkg.destination}</TableCell>
                <TableCell>${pkg.price}</TableCell>
                <TableCell>{pkg.spotsAvailable}</TableCell>
                <TableCell>
                  <Typography 
                    sx={{ color: getStatusColor(pkg.packageStatus), fontWeight: 'bold'}}>
                      {pkg.packageStatus}
                  </Typography>
                </TableCell>
                <TableCell align="center">

                  <Button 
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenEdit(pkg)}
                    size="small"
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            
            {packages.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  No hay paquetes registrados aún
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Editar Paquete: {editFormData?.packageName}
        </DialogTitle>
        <DialogContent dividers>
          {editFormData && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nombre del paquete" name="packageName" value={editFormData.packageName} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Destino" name="destination" value={editFormData.destination} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Descripcion" name="description" value={editFormData.description} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Fecha de inicio" name="startDate" value={editFormData.startDate} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Fecha de término" name="finishDate" value={editFormData.finishDate || ''} onChange={handleEditChange} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Precio (USD)" name="price" value={editFormData.price} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Cupos disponibles" name="spotsAvailable" value={editFormData.spotsAvailable} onChange={handleEditChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="URL de imagen" name="urlImagen" value={editFormData.urlImagen} onChange={handleEditChange} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth select label="Estado" name="packageStatus" value={editFormData.packageStatus} onChange={handleEditChange}>
                  <MenuItem value="ACTIVE">Disponible</MenuItem>
                  <MenuItem value="SOLD_OUT">Agotado</MenuItem>
                  <MenuItem value="INACTIVE">No Vigente</MenuItem>
                  <MenuItem value="CANCELLED">Cancelado</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseEdit} color="error" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary" variant="contained">
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminPackageList;