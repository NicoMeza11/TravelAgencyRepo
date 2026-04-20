import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8081',        
    realm: 'spring-boot-realm-dev',                   
    clientId: 'spring-client-api-rest',           
});

export default keycloak;