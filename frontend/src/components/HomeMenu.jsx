import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LuggageIcon from '@mui/icons-material/Luggage';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu'; 
import './Menu.css';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';

const testFigure = (
  <Paper sx={{ m: 1, width: 100, height: 100 }} elevation={4}>
    <svg width="100" height="100">
      <Box
        component="polygon"
        points="0,100 50,00, 100,100"
        sx={(theme) => ({
          fill: theme.palette.common.white,
          stroke: theme.palette.divider,
          strokeWidth: 1,
        })}
      />
    </svg>
  </Paper>
)

function HomeMenu({onLogout}) { 
  const [anchorEl, setAnchorEl] = useState(null);

  const [showFigure, setShowFigure] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const saySomething = () => {
    console.log("something");
  };

  const handleLogout = () => {
    handleClose();
    if(onLogout){
        onLogout();
    }
  }

  const toggleFigure = () => {
    setShowFigure((prev) => !prev);
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick = {toggleFigure}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TravelAgency
          </Typography>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Mi Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Mis Reservas</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>

            <IconButton
              aria-label="packages"
              sx={{position: 'absolute', bottom: 10, left: 650}}
              color= "white"
            >
              <LuggageIcon/>
            </IconButton>

          </div>
        </Toolbar>
      </AppBar>

      <div id="menu" style={{ textAlign: 'center', marginTop: '40px' }}>
        <h1 onClick={saySomething} style={{ cursor: 'pointer' }}>
          Bienvenido a travelAgency
        </h1>
        <h2>¿A dónde desea viajar hoy?</h2>
      </div>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Grow in={showFigure}>{testFigure}</Grow>

        <Grow
          in={showFigure}
          style={{ transformOrigin: '0 0 0' }}
          {...(testFigure ? { timeout: 1000 } : {})}
        >
          {testFigure}
        </Grow>
      </Box>
    
    </Box>
  );
}

export default HomeMenu;