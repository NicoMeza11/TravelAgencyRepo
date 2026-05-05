import React from 'react';
import { 
  Typography, Button, Box, Dialog, DialogTitle, DialogContent, 
  Divider, Grid 
} from '@mui/material';
import ReservationForm from './ReservationForm';

function PackageDetailsModal({ open, onClose, tourPackage, hideReservationForm = false }) {
  if (!tourPackage) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {tourPackage.packageName || tourPackage.name}
        </Typography>
        <Button onClick={onClose} color="error" sx={{ minWidth: 'auto' }}>
          Cerrar
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={4}>
          
          <Grid item xs={12} md={7}>
            <Box
              component="img"
              src={tourPackage.urlImagen || "https://via.placeholder.com/800"}
              alt={tourPackage.packageName || "Paquete"}
              sx={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '400px',
                objectFit: 'cover', 
                borderRadius: 2 
              }}
            />
          </Grid>


          <Grid item xs={12} md={5}>
            
            {/* We hide the form if it goes from the reservations" */}
            {!hideReservationForm && (
                <ReservationForm 
                  packageId={tourPackage.idPackage} 
                  price={tourPackage.price} 
                  spotsAvailable={tourPackage.spotsAvailable} 
                />
            )}

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, mt: hideReservationForm ? 0 : 2 }}>
              Acerca de este viaje
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {tourPackage.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Servicios incluidos</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.includedServices}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Condiciones importantes</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.conditions}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Restricciones</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.restrictions}
            </Typography>

          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default PackageDetailsModal;