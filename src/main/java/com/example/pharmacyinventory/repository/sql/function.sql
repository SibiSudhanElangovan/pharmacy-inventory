USE pharmacy_inventory;

DROP FUNCTION IF EXISTS calculate_sale_amount;

DELIMITER $$

CREATE FUNCTION calculate_sale_amount(
    p_quantity INT,
    p_price DECIMAL(10,2)
)
    RETURNS DECIMAL(10,2)
    DETERMINISTIC
BEGIN
RETURN p_quantity * p_price;
END $$

DELIMITER ;