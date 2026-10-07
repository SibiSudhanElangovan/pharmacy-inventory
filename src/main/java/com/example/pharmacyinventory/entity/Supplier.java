package com.example.pharmacyinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(
        name = "suppliers",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "email")
        }
)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long supplierId;

    @NotBlank(message = "Supplier name is required")
    @Size(min = 2, max = 100, message = "Supplier name must be between 2 and 100 characters")
    @Pattern(
            regexp = "^[A-Za-z][A-Za-z .&'-]*$",
            message = "Supplier name must contain only letters, spaces and valid symbols"
    )
    @Column(name = "supplier_name", nullable = false, length = 100)
    private String supplierName;

    @NotBlank(message = "Contact number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Contact number must contain exactly 10 digits"
    )
    @Column(nullable = false, length = 10)
    private String contact;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Address is required")
    @Size(min = 2, max = 200, message = "Address must be between 2 and 200 characters")
    @Column(nullable = false, length = 200)
    private String address;

    // Default constructor
    public Supplier() {
    }

    // Parameterized constructor
    public Supplier(
            String supplierName,
            String contact,
            String email,
            String address
    ) {
        this.supplierName = supplierName;
        this.contact = contact;
        this.email = email;
        this.address = address;
    }

    // Getters and Setters

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}