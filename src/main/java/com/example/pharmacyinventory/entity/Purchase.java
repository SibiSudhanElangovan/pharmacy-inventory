package com.example.pharmacyinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseId;

    @NotNull(message = "Medicine is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "medicine_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_purchase_medicine")
    )
    private Medicine medicine;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be greater than 0")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Purchase price is required")
    @DecimalMin(
            value = "0.01",
            message = "Purchase price must be greater than 0"
    )
    @Column(
            name = "purchase_price",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal purchasePrice;

    @NotNull(message = "Purchase date is required")
    @Column(
            name = "purchase_date",
            nullable = false
    )
    private LocalDate purchaseDate;


    // Default constructor
    public Purchase() {
    }


    // Parameterized constructor
    public Purchase(
            Medicine medicine,
            Integer quantity,
            BigDecimal purchasePrice,
            LocalDate purchaseDate
    ) {
        this.medicine = medicine;
        this.quantity = quantity;
        this.purchasePrice = purchasePrice;
        this.purchaseDate = purchaseDate;
    }


    // Getters and Setters

    public Long getPurchaseId() {
        return purchaseId;
    }

    public void setPurchaseId(Long purchaseId) {
        this.purchaseId = purchaseId;
    }


    public Medicine getMedicine() {
        return medicine;
    }

    public void setMedicine(Medicine medicine) {
        this.medicine = medicine;
    }


    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }


    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }


    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }
}