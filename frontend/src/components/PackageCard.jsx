import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import { useState } from 'react';
import PackageDetailsModal from './PackageDetailsModal'; 

function PackageCard({ tourPackage }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

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
            Ver Detalles
          </Button>
        </CardActions>
      </Card>

      <PackageDetailsModal 
        open={openDialog} 
        onClose={handleClose} 
        tourPackage={tourPackage} 
      />
    </>
  );
}

export default PackageCard;