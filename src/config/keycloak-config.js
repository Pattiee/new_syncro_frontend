import Keycloak from 'keycloak-js';

const keycloakConfig = {
    url: 'http://localhost:8180/',
    realm: 'syncro',
    clientId: 'syncro-frontend-client',
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = (onAuthenticatedCallback) => {
    keycloak.init({ 
        onLoad: 'check-sso', pkceMethod: 'S256',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    }).then(authenticated => {
        if (authenticated) {
            console.log(`Auth state: ${authenticated}`)
            onAuthenticatedCallback();
        }
    }).catch(err => {
        console.error(err);
    });
};

export default keycloak;