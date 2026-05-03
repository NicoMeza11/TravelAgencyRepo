import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LuggageIcon from '@mui/icons-material/Luggage';
import AccountCircle from '@mui/icons-material/AccountCircle';
import './Menu.css';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';


const drawerWidth = 240

function HomeMenu({onLogout}) { 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showFigure, setShowFigure] = useState(false);

  const navigate = useNavigate();

  const handleViewPackages = () => {
    navigate('/home/packages');
    setIsSidebarOpen(false);
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    if(onLogout){
        onLogout();
    }
  }

  const toggleSidebar = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setIsSidebarOpen(open)
  }

  const SidebarContent = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleSidebar(false)}
      onKeyDown={toggleSidebar(false)}
    >
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Menu de usuario
            </Typography>
        </Box>
        <Divider />
        <List>
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleViewPackages}>
            <ListItemIcon><LuggageIcon /></ListItemIcon>
            <ListItemText primary="Explorar Paquetes" />
          </ListItemButton>
        </ListItem>

      </List>
      
    </Box>
  );

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
            onClick = {toggleSidebar(true)}
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
              <MenuItem onClick={() => {handleClose(); navigate('/home/profile');}}>Mi Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Mis Reservas</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
            </Menu>

          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={isSidebarOpen}
        onClose={toggleSidebar(false)}
      >
        <SidebarContent />
      </Drawer>

      <Box sx={{ p: 3 }}>
        <Outlet /> 
      </Box>
    
    </Box>
  );
}

export default HomeMenu;