USE pharmacy_inventory;

SELECT
    medicine_id,
    medicine_name,
    category,
    price,
    stock
FROM medicines
WHERE price > (
    SELECT AVG(price)
    FROM medicines
);