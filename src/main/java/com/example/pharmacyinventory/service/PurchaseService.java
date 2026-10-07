package com.example.pharmacyinventory.service;

import com.example.pharmacyinventory.entity.Purchase;
import com.example.pharmacyinventory.repository.PurchaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    public PurchaseService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }


    // Get all purchases
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }


    // Get purchase by ID
    public Purchase getPurchaseById(Long id) {

        Optional<Purchase> purchase =
                purchaseRepository.findById(id);

        return purchase.orElse(null);
    }


    // Add purchase
    public Purchase addPurchase(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }


    // Update purchase
    public Purchase updatePurchase(
            Long id,
            Purchase purchaseDetails) {

        Optional<Purchase> existingPurchase =
                purchaseRepository.findById(id);

        if (existingPurchase.isPresent()) {

            Purchase purchase =
                    existingPurchase.get();

            purchase.setMedicine(
                    purchaseDetails.getMedicine()
            );

            purchase.setQuantity(
                    purchaseDetails.getQuantity()
            );

            purchase.setPurchasePrice(
                    purchaseDetails.getPurchasePrice()
            );

            purchase.setPurchaseDate(
                    purchaseDetails.getPurchaseDate()
            );

            return purchaseRepository.save(purchase);
        }

        return null;
    }


    // Delete purchase
    public void deletePurchase(Long id) {
        purchaseRepository.deleteById(id);
    }
}