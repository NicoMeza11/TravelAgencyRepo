import { 
  Card, CardMedia, CardContent, Typography, Button, CardActions, Chip, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, List, ListItem, ListItemText, Grid,
  Paper 
} from '@mui/material';
import { useState } from 'react';

function PackageCard({ tourPackage }) {

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => {
    setOpenDialog(true);
  }

  const handleClose = () => {
    setOpenDialog(false);
  }

  
  return (
    <>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardMedia
          component="img"
          height="140"
          image={tourPackage.urlImagen || "https://via.placeholder.com/300"}
          alt={tourPackage.packageName}
        />
        <CardContent>
          <Typography gutterBottom variant="h5">{tourPackage.packageName}</Typography>
          <Typography variant="body2" color="text.secondary">{tourPackage.destination}</Typography>
          <Typography variant="h6" color="primary">${tourPackage.price}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" fullWidth onClick={handleOpen}>
            View Details
          </Button>
        </CardActions>
      </Card>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="lg" fullWidth>
      
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {tourPackage.packageName}
        </Typography>
        <Button onClick={handleClose} color="error" sx={{ minWidth: 'auto' }}>
          Close
        </Button>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: The Image (Takes 7 out of 12 columns on desktop) */}
          <Grid item xs={12} md={7}>
            <Box
              component="img"
              src={tourPackage.urlImagen || "https://via.placeholder.com/800"}
              alt={tourPackage.packageName}
              sx={{ 
                width: '100%', 
                height: '100%', 
                minHeight: '400px',
                objectFit: 'cover', 
                borderRadius: 2 
              }}
            />
          </Grid>

          {/* RIGHT COLUMN: The Information & Booking Widget (Takes 5 out of 12 columns) */}
          <Grid item xs={12} md={5}>
            
            {/* THE "FLOATING" BOOKING WIDGET */}
            <Paper elevation={4} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                ${tourPackage.price} <Typography component="span" variant="body1" color="text.secondary">USD</Typography>
              </Typography>
              <Typography variant="body2" color={tourPackage.spotsAvailable > 5 ? "success.main" : "error.main"} sx={{ mb: 2 }}>
                {tourPackage.spotsAvailable} spots available
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth 
                disabled={tourPackage.spotsAvailable <= 0}
              >
                Proceed to Booking
              </Button>
            </Paper>

            {/* THE DETAILS TEXT */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              About this trip
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {tourPackage.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>✅ Included Services</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.includedServices}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>⚠️ Important Conditions</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.conditions}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>🚫 Restrictions</Typography>
            <Typography variant="body2" paragraph color="text.secondary">
              {tourPackage.restrictions}
            </Typography>

          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
    
    </>



  );
}

export default PackageCard;