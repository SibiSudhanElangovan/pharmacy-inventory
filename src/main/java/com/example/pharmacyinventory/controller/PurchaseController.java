package com.example.pharmacyinventory.controller;

import com.example.pharmacyinventory.entity.Purchase;
import com.example.pharmacyinventory.service.PurchaseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }


    // GET: http://localhost:8080/api/purchases
    // Get all purchases
    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {

        return ResponseEntity.ok(
                purchaseService.getAllPurchases()
        );
    }


    // GET: http://localhost:8080/api/purchases/{id}
    // Get purchase by ID
    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(
            @PathVariable Long id) {

        Purchase purchase =
                purchaseService.getPurchaseById(id);

        if (purchase != null) {
            return ResponseEntity.ok(purchase);
        }

        return ResponseEntity.notFound().build();
    }


    // POST: http://localhost:8080/api/purchases
    // Add purchase
    @PostMapping
    public ResponseEntity<Purchase> addPurchase(
            @Valid @RequestBody Purchase purchase) {

        Purchase savedPurchase =
                purchaseService.addPurchase(purchase);

        return ResponseEntity.ok(savedPurchase);
    }


    // PUT: http://localhost:8080/api/purchases/{id}
    // Update purchase
    @PutMapping("/{id}")
    public ResponseEntity<Purchase> updatePurchase(
            @PathVariable Long id,
            @Valid @RequestBody Purchase purchase) {

        Purchase updatedPurchase =
                purchaseService.updatePurchase(
                        id,
                        purchase
                );

        if (updatedPurchase != null) {
            return ResponseEntity.ok(updatedPurchase);
        }

        return ResponseEntity.notFound().build();
    }


    // DELETE: http://localhost:8080/api/purchases/{id}
    // Delete purchase
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(
            @PathVariable Long id) {

        Purchase purchase =
                purchaseService.getPurchaseById(id);

        if (purchase == null) {
            return ResponseEntity.notFound().build();
        }

        purchaseService.deletePurchase(id);

        return ResponseEntity.noContent().build();
    }
}