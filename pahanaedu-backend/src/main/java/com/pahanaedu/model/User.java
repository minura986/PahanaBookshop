package com.pahanaedu.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String defaultAddressLine1;
    private String defaultAddressLine2;
    private String defaultCity;
    private String defaultPostalCode;
    private String defaultCountry;
    private boolean hasPlacedOrder = false;
    private String profileImageUrl;

    /**
     * A no-argument constructor is required for Spring Data MongoDB to instantiate
     * objects.
     */
    public User() {
    }

    /**
     * Constructor for creating a new user with essential details.
     */
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // --- GETTERS AND SETTERS FOR ALL FIELDS ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDefaultAddressLine1() {
        return defaultAddressLine1;
    }

    public void setDefaultAddressLine1(String defaultAddressLine1) {
        this.defaultAddressLine1 = defaultAddressLine1;
    }

    public String getDefaultAddressLine2() {
        return defaultAddressLine2;
    }

    public void setDefaultAddressLine2(String defaultAddressLine2) {
        this.defaultAddressLine2 = defaultAddressLine2;
    }

    public String getDefaultCity() {
        return defaultCity;
    }

    public void setDefaultCity(String defaultCity) {
        this.defaultCity = defaultCity;
    }

    public String getDefaultPostalCode() {
        return defaultPostalCode;
    }

    public void setDefaultPostalCode(String defaultPostalCode) {
        this.defaultPostalCode = defaultPostalCode;
    }

    public String getDefaultCountry() {
        return defaultCountry;
    }

    public void setDefaultCountry(String defaultCountry) {
        this.defaultCountry = defaultCountry;
    }

    public boolean isHasPlacedOrder() {
        return hasPlacedOrder;
    }

    public void setHasPlacedOrder(boolean hasPlacedOrder) {
        this.hasPlacedOrder = hasPlacedOrder;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}