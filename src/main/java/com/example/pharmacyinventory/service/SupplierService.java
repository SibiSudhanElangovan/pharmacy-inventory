package com.example.pharmacyinventory.service;

import com.example.pharmacyinventory.entity.Supplier;
import com.example.pharmacyinventory.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }


    // Get all suppliers
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }


    // Get supplier by ID
    public Supplier getSupplierById(Long id) {

        Optional<Supplier> supplier =
                supplierRepository.findById(id);

        return supplier.orElse(null);
    }


    // Add supplier
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }


    // Update supplier
    public Supplier updateSupplier(
            Long id,
            Supplier supplierDetails) {

        Optional<Supplier> existingSupplier =
                supplierRepository.findById(id);

        if (existingSupplier.isPresent()) {

            Supplier supplier =
                    existingSupplier.get();

            supplier.setSupplierName(
                    supplierDetails.getSupplierName()
            );

            supplier.setContact(
                    supplierDetails.getContact()
            );

            supplier.setEmail(
                    supplierDetails.getEmail()
            );

            supplier.setAddress(
                    supplierDetails.getAddress()
            );

            return supplierRepository.save(supplier);
        }

        return null;
    }


    // Delete supplier
    public void deleteSupplier(Long id) {
        supplierRepository.deleteById(id);
    }
}