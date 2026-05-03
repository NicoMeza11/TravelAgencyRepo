import React, { useState, useEffect } from 'react';
import api from '../ApiConf';
import { 
  Grid, Container, Typography, TextField, Box, Paper, 
  InputAdornment, Button 
} from '@mui/material';
import PackageCard from './PackageCard';

function ListPackages(){

    const [packages, setPackages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {

        const getAllPackages = async () =>{
            try{
                const response = await api.get('/tourpackage/list');

                const today = new Date()
                today.setHours(0,0,0,0); //set today date ignoring hour

                //we filter the package by his date, status and spots available
                const validPackages = response.data.filter((p) => {
                    const packageStartDate = new Date(p.startDate)

                    return( 
                        p.packageStatus === "ACTIVE" &&
                        p.spotsAvailable > 0 &&
                        packageStartDate >= today
                    );
                })

                setPackages(validPackages)
                console.log("Packages loaded correctly");
            }catch(error){
                console.error("Error loading the packages", error);
            }
        };
        
        getAllPackages();
    }, []);

    const filteredPackages = packages.filter((p) => {

        //filter by destination or name
        const matchSearch = p.destination.toLowerCase().includes(searchTerm.toLowerCase()) || p.packageName.toLowerCase().includes(searchTerm.toLowerCase());

        //filter by price
        const matchPrice = maxPrice === '' || p.price <= parseFloat(maxPrice);
        return matchSearch && matchPrice;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setMaxPrice('');
    };

    return(
        <Container sx={{ mt: 5, mb: 10 }}>
            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
                Descubre tu próximo destino
            </Typography>

            {/* filter panel */}
            <Paper elevation={3} sx={{ p: 3, mb: 5, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Filtrar Búsqueda
                </Typography>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={5}>
                        <TextField
                        fullWidth
                        label="¿A dónde quieres ir?"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                        fullWidth
                        label="Precio Máximo (USD)"
                        type="number"
                        variant="outlined"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button 
                        fullWidth 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleClearFilters}
                        sx={{ height: '56px' }} 
                        >
                            Limpiar Filtros
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Search result */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    Mostrando {filteredPackages.length} {filteredPackages.length === 1 ? 'paquete' : 'paquetes'}
                </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
                {filteredPackages.length > 0 ? (
                filteredPackages.map((p) => (
                    <Grid item key={p.idPackage} xs={12} sm={6} md={4}>
                        <PackageCard tourPackage={p} />
                    </Grid>
                ))
                ) : (
                <Grid item xs={12}>
                    <Typography variant="h6" align="center" sx={{ mt: 5, color: 'text.secondary' }}>
                        No se encontraron paquetes que coincidan con tu búsqueda.
                    </Typography>
                </Grid>
                )}
            </Grid>
        </Container>
    );

}
export default ListPackages;