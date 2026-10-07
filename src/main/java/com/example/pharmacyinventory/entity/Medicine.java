package com.example.pharmacyinventory.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineId;

    @NotBlank(message = "Medicine name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Medicine name must be between 2 and 100 characters"
    )
    @Column(
            name = "medicine_name",
            nullable = false,
            length = 100
    )
    private String medicineName;

    @NotBlank(message = "Category is required")
    @Size(
            min = 2,
            max = 50,
            message = "Category must be between 2 and 50 characters"
    )
    @Column(
            nullable = false,
            length = 50
    )
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(
            value = "0.01",
            message = "Price must be greater than 0"
    )
    @Column(
            nullable = false,
            precision = 10,
            scale = 2
    )
    private BigDecimal price;

    @NotNull(message = "Stock is required")
    @PositiveOrZero(message = "Stock cannot be negative")
    @Column(nullable = false)
    private Integer stock;

    @NotNull(message = "Expiry date is required")
    @Column(
            name = "expiry_date",
            nullable = false
    )
    private LocalDate expiryDate;

    @NotNull(message = "Supplier is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
            name = "supplier_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_medicine_supplier")
    )
    private Supplier supplier;

    public Medicine() {
    }

    public Medicine(
            String medicineName,
            String category,
            BigDecimal price,
            Integer stock,
            LocalDate expiryDate,
            Supplier supplier
    ) {
        this.medicineName = medicineName;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.expiryDate = expiryDate;
        this.supplier = supplier;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }
}