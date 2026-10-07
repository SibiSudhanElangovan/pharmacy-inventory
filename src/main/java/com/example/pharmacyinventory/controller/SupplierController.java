package com.example.pharmacyinventory.controller;

import com.example.pharmacyinventory.entity.Supplier;
import com.example.pharmacyinventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(
            SupplierService supplierService) {
        this.supplierService = supplierService;
    }


    // GET: http://localhost:8080/api/suppliers
    @GetMapping
    public ResponseEntity<List<Supplier>> getAllSuppliers() {

        return ResponseEntity.ok(
                supplierService.getAllSuppliers()
        );
    }


    // GET: http://localhost:8080/api/suppliers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getSupplierById(
            @PathVariable Long id) {

        Supplier supplier =
                supplierService.getSupplierById(id);

        if (supplier != null) {
            return ResponseEntity.ok(supplier);
        }

        return ResponseEntity.notFound().build();
    }


    // POST: http://localhost:8080/api/suppliers
    @PostMapping
    public ResponseEntity<Supplier> addSupplier(
            @Valid @RequestBody Supplier supplier) {

        Supplier savedSupplier =
                supplierService.addSupplier(supplier);

        return ResponseEntity.ok(savedSupplier);
    }


    // PUT: http://localhost:8080/api/suppliers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody Supplier supplier) {

        Supplier updatedSupplier =
                supplierService.updateSupplier(
                        id,
                        supplier
                );

        if (updatedSupplier != null) {
            return ResponseEntity.ok(updatedSupplier);
        }

        return ResponseEntity.notFound().build();
    }


    // DELETE: http://localhost:8080/api/suppliers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(
            @PathVariable Long id) {

        Supplier supplier =
                supplierService.getSupplierById(id);

        if (supplier == null) {
            return ResponseEntity.notFound().build();
        }

        supplierService.deleteSupplier(id);

        return ResponseEntity.noContent().build();
    }
}