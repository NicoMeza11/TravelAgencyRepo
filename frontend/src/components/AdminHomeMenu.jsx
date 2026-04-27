import React, { useState } from 'react';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Para los reportes (Épica 7)
import LuggageIcon from '@mui/icons-material/Luggage'; // Para gestión de paquetes
import LogoutIcon from '@mui/icons-material/Logout';


const drawerWidth = 240 // Ancho del Drawer

function AdminHomeMenu({onLogout}) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorEl(null)
    }

    const handleLogout = () => {
        if(onLogout){
            onLogout();
        }
        handleCloseUserMenu();
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
                Admin Panel
            </Typography>
        </Box>
        <Divider />
        <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><LuggageIcon /></ListItemIcon>
            <ListItemText primary="Manage Packages" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><AssessmentIcon /></ListItemIcon>
            <ListItemText primary="Sales Reports" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
      
    </Box>
  );

    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleSidebar(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant='h6' component="div" sx={{ flexGrow: 1}}>
                        Travel Agency - Administration
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
                                horizontal: 'end',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'end',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleCloseUserMenu}>Profile</MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>My account</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>

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
            
            {/* Principal area of content of the Dashboard*/}
            <Box sx = {{p: 3}}>
                <Typography variant='h4'> Welcome, Admin</Typography>
                <Typography variant='body1' sx={{ mt: 2 }}>
                    Select an option from the sidebar to manage de system
                </Typography>
            </Box>

        </Box>
    );
}
export default AdminHomeMenu;