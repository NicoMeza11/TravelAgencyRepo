import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import keycloak from './keycloak';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';


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
