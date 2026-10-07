package com.example.pharmacyinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saleId;

    @NotNull(message = "Medicine is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "medicine_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_sale_medicine")
    )
    private Medicine medicine;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Sale quantity must be greater than 0")
    @Column(nullable = false)
    private Integer quantity;

    @NotNull(message = "Sale price is required")
    @DecimalMin(
            value = "0.01",
            message = "Sale price must be greater than 0"
    )
    @Column(
            name = "sale_price",
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal salePrice;

    @DecimalMin(
            value = "0.00",
            message = "Sale amount cannot be negative"
    )
    @Column(
            name = "sale_amount",
            precision = 10,
            scale = 2
    )
    private BigDecimal saleAmount;

    @NotNull(message = "Sale date is required")
    @Column(
            name = "sale_date",
            nullable = false
    )
    private LocalDate saleDate;


    // Default constructor
    public Sale() {
    }


    // Parameterized constructor
    public Sale(
            Medicine medicine,
            Integer quantity,
            BigDecimal salePrice,
            BigDecimal saleAmount,
            LocalDate saleDate
    ) {
        this.medicine = medicine;
        this.quantity = quantity;
        this.salePrice = salePrice;
        this.saleAmount = saleAmount;
        this.saleDate = saleDate;
    }


    // Getters and Setters

    public Long getSaleId() {
        return saleId;
    }

    public void setSaleId(Long saleId) {
        this.saleId = saleId;
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


    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }


    public BigDecimal getSaleAmount() {
        return saleAmount;
    }

    public void setSaleAmount(BigDecimal saleAmount) {
        this.saleAmount = saleAmount;
    }


    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }
}