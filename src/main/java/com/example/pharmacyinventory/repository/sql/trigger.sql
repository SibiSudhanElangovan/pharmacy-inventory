USE pharmacy_inventory;

DROP TRIGGER IF EXISTS reduce_medicine_stock;

DELIMITER $$

CREATE TRIGGER reduce_medicine_stock
    BEFORE INSERT ON sales
    FOR EACH ROW
BEGIN

    IF NEW.quantity <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sale quantity must be greater than zero';
END IF;

IF (
SELECT stock
FROM medicines
WHERE medicine_id = NEW.medicine_id
    ) < NEW.quantity THEN
        SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = 'Insufficient medicine stock';
END IF;

UPDATE medicines
SET stock = stock - NEW.quantity

WHERE medicine_id = NEW.medicine_id;

END $$

DELIMITER ;