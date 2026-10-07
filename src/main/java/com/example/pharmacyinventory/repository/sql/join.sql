USE pharmacy_inventory;

SELECT
    m.medicine_id,
    m.medicine_name,
    m.category,
    m.price,
    m.stock,
    m.expiry_date,
    s.supplier_id,
    s.supplier_name,
    s.contact,
    s.email,
    s.address
FROM medicines m
         INNER JOIN suppliers s
                    ON m.supplier_id = s.supplier_id;