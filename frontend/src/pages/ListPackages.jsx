import React, { useState, useEffect } from 'react';
import api from '../ApiConf';
import { Grid, Container, Typography } from '@mui/material';
import PackageCard from '../components/PackageCard';

function ListPackages(){

    const [packages, setPackages] = useState([]);

    useEffect(() => {

        const getAllPackages = async () =>{
            try{
                const response = await api.get('/tourpackage');
                setPackages(response.data)

                console.log("Packages loaded correctly");
            }catch(error){
                console.error("Error loading the packages", error);
            }
        };
        
        getAllPackages();
    }, []);

    return(
        <Container sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom align="center">
                Our Tour Packages
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {packages
                    .filter((p) => p.packageStatus === "ACTIVE")
                    .map((p) => (
                <Grid item key={p.idPackage} xs={12} sm={6} md={4}>
                    <PackageCard tourPackage={p} />
                </Grid>
                ))}
            </Grid>
    </Container>
    );

}
export default ListPackages;