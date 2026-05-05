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
import AssessmentIcon from '@mui/icons-material/Assessment'; 
import AddCircleIcon from '@mui/icons-material/AddCircle'; 
import LuggageIcon from '@mui/icons-material/Luggage'; 
import LogoutIcon from '@mui/icons-material/Logout';

import UserProfile from '../components/UserProfile';
import { Outlet, useNavigate } from 'react-router-dom';


const drawerWidth = 240

function AdminHomeMenu({onLogout}) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate();

    const handleViewDashboard = () => {
        navigate('/admin/dashboard');
        setIsSidebarOpen(false);
    }

    const handleViewPackageList = () => {
        navigate('/admin/packages');
        setIsSidebarOpen(false);
    }

    const handleViewCreatePackage = () => {
        navigate('/admin/create/package');
        setIsSidebarOpen(false);
    }

    const handleViewReservations = () => {
        navigate('/admin/reservations');
        setIsSidebarOpen(false);
    }

    const handleViewProfile = () => {
        navigate('/admin/profile');
        setIsSideBarOpen(false);
    }

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
                <ListItemButton onClick={handleViewDashboard}>
                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
                <ListItemButton onClick={handleViewPackageList}>
                    <ListItemIcon><LuggageIcon /></ListItemIcon>
                    <ListItemText primary="Administrar Paquetes" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleViewCreatePackage}>
                    <ListItemIcon><AddCircleIcon /></ListItemIcon>
                    <ListItemText primary="Crear Paquete" />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton onClick={handleViewReservations}>
                    <ListItemIcon><AssessmentIcon /></ListItemIcon>
                    <ListItemText primary="Administrar Reservas" />
                </ListItemButton>
            </ListItem>
        </List>

        <Divider />
        
        <List>
            <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
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
                        Travel Agency - Administración
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
                            <MenuItem onClick={() => {handleCloseUserMenu(); navigate('/admin/profile')}}>Perfil</MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>Mi cuenta</MenuItem>
                            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>

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
                <Outlet />
            </Box>

        </Box>
    );
}
export default AdminHomeMenu;