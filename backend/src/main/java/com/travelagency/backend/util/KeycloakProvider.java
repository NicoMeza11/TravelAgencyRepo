package com.travelagency.backend.util;

import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KeycloakProvider {

    @Value("${KCK_URL}")
    private String serverUrl;
    @Value("{KCK_REALM")
    private String realmName;
    private String ADMIN_CLI = "admin-cli";
    private String USER_CONSOLE = "admin";
    private String PASSWORD_CONSOLE = "admin";
    private String CLIENT_SECRET = "tJb69UqzuhW9fHcLNxYDILImpTGH4btE";

    public RealmResource getRealmResource(){
        Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username(USER_CONSOLE)
                .password(PASSWORD_CONSOLE)
                .clientSecret(CLIENT_SECRET)
                .resteasyClient(new ResteasyClientBuilderImpl()
                        .connectionPoolSize(10)
                        .build())
                .build();

        return keycloak.realm(realmName);
    }

    public static UsersResource getUserResource(){
        RealmResource realmResource = getRealmResource();
        return realmResource.users();
    }

}
