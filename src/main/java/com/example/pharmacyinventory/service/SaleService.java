package com.example.pharmacyinventory.service;

import com.example.pharmacyinventory.entity.Sale;
import com.example.pharmacyinventory.repository.SaleRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final JdbcTemplate jdbcTemplate;

    public SaleService(
            SaleRepository saleRepository,
            JdbcTemplate jdbcTemplate) {

        this.saleRepository = saleRepository;
        this.jdbcTemplate = jdbcTemplate;
    }


    // Get all sales
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }


    // Get sale by ID
    public Sale getSaleById(Long id) {

        Optional<Sale> sale =
                saleRepository.findById(id);

        return sale.orElse(null);
    }


    // Add sale directly
    public Sale addSale(Sale sale) {
        return saleRepository.save(sale);
    }


    // Update sale
    public Sale updateSale(
            Long id,
            Sale saleDetails) {

        Optional<Sale> existingSale =
                saleRepository.findById(id);

        if (existingSale.isPresent()) {

            Sale sale =
                    existingSale.get();

            sale.setMedicine(
                    saleDetails.getMedicine()
            );

            sale.setQuantity(
                    saleDetails.getQuantity()
            );

            sale.setSalePrice(
                    saleDetails.getSalePrice()
            );

            sale.setSaleAmount(
                    saleDetails.getSaleAmount()
            );

            sale.setSaleDate(
                    saleDetails.getSaleDate()
            );

            return saleRepository.save(sale);
        }

        return null;
    }


    // Delete sale
    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }


    // Record medicine sale using MySQL stored procedure
    public void recordMedicineSale(
            Long medicineId,
            Integer quantity) {

        String sql =
                "CALL record_medicine_sale(?, ?)";

        jdbcTemplate.update(
                sql,
                medicineId,
                quantity
        );
    }
}