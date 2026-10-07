package com.example.pharmacyinventory.service;

import com.example.pharmacyinventory.entity.Medicine;
import com.example.pharmacyinventory.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }


    // Get all medicines
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }


    // Get medicine by ID
    public Medicine getMedicineById(Long id) {

        Optional<Medicine> medicine =
                medicineRepository.findById(id);

        return medicine.orElse(null);
    }


    // Add medicine
    public Medicine addMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }


    // Update medicine
    public Medicine updateMedicine(
            Long id,
            Medicine medicineDetails) {

        Optional<Medicine> existingMedicine =
                medicineRepository.findById(id);

        if (existingMedicine.isPresent()) {

            Medicine medicine =
                    existingMedicine.get();

            medicine.setMedicineName(
                    medicineDetails.getMedicineName()
            );

            medicine.setCategory(
                    medicineDetails.getCategory()
            );

            medicine.setPrice(
                    medicineDetails.getPrice()
            );

            medicine.setStock(
                    medicineDetails.getStock()
            );

            medicine.setExpiryDate(
                    medicineDetails.getExpiryDate()
            );

            medicine.setSupplier(
                    medicineDetails.getSupplier()
            );

            return medicineRepository.save(medicine);
        }

        return null;
    }


    // Delete medicine
    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }


    // JOIN:
    // Get medicines together with supplier information
    public List<Medicine> getMedicinesWithSuppliers() {
        return medicineRepository.findMedicinesWithSuppliers();
    }


    // SUBQUERY:
    // Get medicines whose price is above average
    public List<Medicine> getMedicinesAboveAveragePrice() {
        return medicineRepository.findMedicinesAboveAveragePrice();
    }
}