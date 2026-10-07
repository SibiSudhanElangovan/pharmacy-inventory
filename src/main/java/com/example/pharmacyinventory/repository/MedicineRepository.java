package com.example.pharmacyinventory.repository;

import com.example.pharmacyinventory.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    @Query("""
            SELECT m
            FROM Medicine m
            JOIN FETCH m.supplier
            """)
    List<Medicine> findMedicinesWithSuppliers();

    @Query("""
            SELECT m
            FROM Medicine m
            WHERE m.price > (
                SELECT AVG(m2.price)
                FROM Medicine m2
            )
            """)
    List<Medicine> findMedicinesAboveAveragePrice();
}