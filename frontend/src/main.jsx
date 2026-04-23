import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './keycloak';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';


const saveUserInDatabase = async () => {
    if (!keycloak.authenticated) return;

    try {
        await axios.post(
            'http://localhost:8080/api/user/sync',
            {
                id: keycloak.tokenParsed.sub,
                firstName: keycloak.tokenParsed.given_name,
                lastName: keycloak.tokenParsed.family_name,
                email: keycloak.tokenParsed.email,
            },
            {
                headers: { 
                    Authorization: `Bearer ${keycloak.token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('User synced with database');
    } catch (error) {
        console.error('Error syncing user:', error);
    }
};


keycloak.init({
    onLoad: 'check-sso', 
    checkLoginIframe: false,  
    pkceMethod: 'S256',
}).then((authenticated) => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
           <BrowserRouter>
               <App />
             </BrowserRouter>
         </React.StrictMode>
    );   
}).catch((err) => {
    console.error('Keycloak init error:', err);
    keycloak.clearToken();
});
