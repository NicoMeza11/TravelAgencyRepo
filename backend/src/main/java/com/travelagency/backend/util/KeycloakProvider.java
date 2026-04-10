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
    @Value("${KCK_REALM}")
    private String realmName;
    @Value("${KCK_ADMIN_USER}")
    private String userConsole;
    @Value("${KCK_ADMIN_PASSWORD}")
    private String passwordConsole;

    public RealmResource getRealmResource(){
        Keycloak keycloak = KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .clientId("admin-cli")
                .username(userConsole)
                .password(passwordConsole)
                .clientSecret("**********")
                .resteasyClient(new ResteasyClientBuilderImpl()
                        .connectionPoolSize(10)
                        .build())
                .build();

        return keycloak.realm(realmName);
    }

    public UsersResource getUserResource(){
        RealmResource realmResource = getRealmResource();
        return realmResource.users();
    }

}
