package com.example.pharmacyinventory.controller;

import com.example.pharmacyinventory.entity.Medicine;
import com.example.pharmacyinventory.service.MedicineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }


    // GET: http://localhost:8080/api/medicines
    // Get all medicines
    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {

        return ResponseEntity.ok(
                medicineService.getAllMedicines()
        );
    }


    // GET: http://localhost:8080/api/medicines/{id}
    // Get medicine by ID
    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(
            @PathVariable Long id) {

        Medicine medicine =
                medicineService.getMedicineById(id);

        if (medicine != null) {
            return ResponseEntity.ok(medicine);
        }

        return ResponseEntity.notFound().build();
    }


    // POST: http://localhost:8080/api/medicines
    // Add medicine
    @PostMapping
    public ResponseEntity<Medicine> addMedicine(
            @Valid @RequestBody Medicine medicine) {

        Medicine savedMedicine =
                medicineService.addMedicine(medicine);

        return ResponseEntity.ok(savedMedicine);
    }


    // PUT: http://localhost:8080/api/medicines/{id}
    // Update medicine
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(
            @PathVariable Long id,
            @Valid @RequestBody Medicine medicine) {

        Medicine updatedMedicine =
                medicineService.updateMedicine(
                        id,
                        medicine
                );

        if (updatedMedicine != null) {
            return ResponseEntity.ok(updatedMedicine);
        }

        return ResponseEntity.notFound().build();
    }


    // DELETE: http://localhost:8080/api/medicines/{id}
    // Delete medicine
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(
            @PathVariable Long id) {

        Medicine medicine =
                medicineService.getMedicineById(id);

        if (medicine == null) {
            return ResponseEntity.notFound().build();
        }

        medicineService.deleteMedicine(id);

        return ResponseEntity.noContent().build();
    }


    // JOIN:
    // GET: http://localhost:8080/api/medicines/with-suppliers
    //
    // Displays medicines together with supplier information.
    @GetMapping("/with-suppliers")
    public ResponseEntity<List<Medicine>> getMedicinesWithSuppliers() {

        return ResponseEntity.ok(
                medicineService.getMedicinesWithSuppliers()
        );
    }


    // SUBQUERY:
    // GET: http://localhost:8080/api/medicines/above-average-price
    //
    // Finds medicines whose price is greater than
    // the average price of all medicines.
    @GetMapping("/above-average-price")
    public ResponseEntity<List<Medicine>> getMedicinesAboveAveragePrice() {

        return ResponseEntity.ok(
                medicineService.getMedicinesAboveAveragePrice()
        );
    }
}