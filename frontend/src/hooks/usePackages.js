import { useState, useEffect } from 'react';
import api from '../apiConfig';

const usePackages = () => {

    const [packages, setPackages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPackages = async () => {

            try{
                setIsLoading(true);
    
                const response = await api.get("/packages");
                setPackages(response.data);
                setError(null);
            } catch(err){
                console.error("Error fetching packages:",err);
                setError("Error occured while loading tour packages")
            } finally{
                setIsLoading(false);
            }
            
        };

        fetchPackages();
    }, []);
    return {packages, isLoading, error};
}