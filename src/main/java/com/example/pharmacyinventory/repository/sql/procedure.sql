USE pharmacy_inventory;

DROP PROCEDURE IF EXISTS record_medicine_sale;

DELIMITER $$

CREATE PROCEDURE record_medicine_sale(
    IN p_medicine_id BIGINT,
    IN p_quantity INT
)
BEGIN

    DECLARE v_price DECIMAL(10,2);

SELECT price
INTO v_price
FROM medicines
WHERE medicine_id = p_medicine_id;

IF v_price IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Medicine not found';
END IF;

INSERT INTO sales
(
    medicine_id,
    quantity,
    sale_price,
    sale_amount,
    sale_date
)
VALUES
    (
        p_medicine_id,
        p_quantity,
        v_price,
        calculate_sale_amount(p_quantity, v_price),
        CURDATE()
    );

END $$

DELIMITER ;