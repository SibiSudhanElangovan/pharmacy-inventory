package com.example.pharmacyinventory.controller;

import com.example.pharmacyinventory.entity.Sale;
import com.example.pharmacyinventory.service.SaleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }


    // GET: http://localhost:8080/api/sales
    // Get all sales
    @GetMapping
    public ResponseEntity<List<Sale>> getAllSales() {

        return ResponseEntity.ok(
                saleService.getAllSales()
        );
    }


    // GET: http://localhost:8080/api/sales/{id}
    // Get sale by ID
    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(
            @PathVariable Long id) {

        Sale sale =
                saleService.getSaleById(id);

        if (sale != null) {
            return ResponseEntity.ok(sale);
        }

        return ResponseEntity.notFound().build();
    }


    // POST: http://localhost:8080/api/sales
    // Add sale directly
    @PostMapping
    public ResponseEntity<Sale> addSale(
            @Valid @RequestBody Sale sale) {

        Sale savedSale =
                saleService.addSale(sale);

        return ResponseEntity.ok(savedSale);
    }


    // PUT: http://localhost:8080/api/sales/{id}
    // Update sale
    @PutMapping("/{id}")
    public ResponseEntity<Sale> updateSale(
            @PathVariable Long id,
            @Valid @RequestBody Sale sale) {

        Sale updatedSale =
                saleService.updateSale(
                        id,
                        sale
                );

        if (updatedSale != null) {
            return ResponseEntity.ok(updatedSale);
        }

        return ResponseEntity.notFound().build();
    }


    // DELETE: http://localhost:8080/api/sales/{id}
    // Delete sale
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(
            @PathVariable Long id) {

        Sale sale =
                saleService.getSaleById(id);

        if (sale == null) {
            return ResponseEntity.notFound().build();
        }

        saleService.deleteSale(id);

        return ResponseEntity.noContent().build();
    }


    // POST:
    // http://localhost:8080/api/sales/record
    //
    // Records a medicine sale using the
    // MySQL stored procedure.
    @PostMapping("/record")
    public ResponseEntity<String> recordMedicineSale(
            @RequestParam Long medicineId,
            @RequestParam Integer quantity) {

        saleService.recordMedicineSale(
                medicineId,
                quantity
        );

        return ResponseEntity.ok(
                "Medicine sale recorded successfully"
        );
    }
}