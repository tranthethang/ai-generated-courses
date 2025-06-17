# Chapter 11: Stored Procedures, Functions và Triggers

* **Tên bài học:** Đóng gói logic nghiệp vụ, tự động hóa tác vụ với Stored Procedures, Functions và Triggers sử dụng PL/pgSQL.
* **Tóm tắt lý thuyết:**
    * **Functions (Hàm) trong PostgreSQL:**
        * Một khối code được đặt tên, có thể nhận các tham số đầu vào, thực thi logic và trả về một giá trị đơn lẻ hoặc một tập các dòng (table functions).
        * **Ngôn ngữ:** PostgreSQL hỗ trợ nhiều ngôn ngữ để viết function:
            * `SQL`: Viết function bằng các câu lệnh SQL chuẩn. Thích hợp cho các function đơn giản.
            * `PL/pgSQL` (Procedural Language/PostgreSQL SQL): Ngôn ngữ thủ tục mạnh mẽ, được tích hợp sẵn, có biến, cấu trúc điều khiển (IF, CASE), vòng lặp (LOOP, WHILE, FOR), xử lý ngoại lệ. Phổ biến nhất.
            * Các ngôn ngữ khác: `PL/Python`, `PL/Perl`, `PL/Tcl`, `PL/Java` (cần cài đặt extension).
        * **Cú pháp `CREATE FUNCTION`:**
            ```sql
            CREATE [OR REPLACE] FUNCTION function_name (param_name1 param_type1, ...)
            RETURNS return_type -- Hoặc RETURNS TABLE (col1 type1, ...) hoặc RETURNS SETOF type
            AS $$ -- Hoặc AS '...'
            BEGIN -- Chỉ cho PL/pgSQL và các ngôn ngữ thủ tục khác
                -- Logic của function
                RETURN expression; -- Hoặc RETURN QUERY SELECT ... cho SETOF
            END; -- Chỉ cho PL/pgSQL
            $$ LANGUAGE language_name
            [IMMUTABLE | STABLE | VOLATILE] -- Tính chất của function
            [SECURITY DEFINER | SECURITY INVOKER] -- Ngữ cảnh bảo mật
            [COST execution_cost]
            [ROWS result_rows] -- Cho SETOF
            [SET configuration_parameter = value];
            ```
        * **Tính chất của function (Volatility):**
            * `VOLATILE` (Mặc định): Function có thể thay đổi CSDL và/hoặc trả về kết quả khác nhau ngay cả với cùng tham số đầu vào (ví dụ: `NOW()`, `random()`). Bộ tối ưu hóa không thể giả định gì về nó.
            * `STABLE`: Function không thay đổi CSDL và đảm bảo trả về cùng kết quả cho cùng tham số đầu vào *trong phạm vi một lần scan bảng*. Có thể phụ thuộc vào các tham số CSDL, dữ liệu hiện tại.
            * `IMMUTABLE`: Function không thay đổi CSDL và *luôn luôn* trả về cùng kết quả cho cùng tham số đầu vào, không phụ thuộc vào bất cứ điều gì khác. Hữu ích cho việc sử dụng trong index.
        * **Ngữ cảnh bảo mật:**
            * `SECURITY INVOKER` (Mặc định): Function thực thi với quyền của user gọi nó.
            * `SECURITY DEFINER`: Function thực thi với quyền của user tạo (owner) ra nó. Cần cẩn thận khi dùng để tránh leo thang đặc quyền.
    * **Stored Procedures (Thủ tục lưu trữ - PostgreSQL 11+):**
        * Tương tự functions nhưng được thiết kế để thực hiện các hành động và không bắt buộc trả về giá trị.
        * Quan trọng nhất: Stored Procedures có thể quản lý transaction bên trong nó (`COMMIT`, `ROLLBACK`). Functions không thể.
        * Cú pháp `CREATE PROCEDURE`:
            ```sql
            CREATE [OR REPLACE] PROCEDURE procedure_name (param_name1 param_type1, ...)
            AS $$
            BEGIN
                -- Logic của procedure
                -- Có thể chứa COMMIT, ROLLBACK
            END;
            $$ LANGUAGE plpgsql; -- Hoặc ngôn ngữ khác
            ```
        * Gọi bằng `CALL procedure_name(...);`.
    * **Giới thiệu PL/pgSQL:**
        * Ngôn ngữ khối lệnh (block-structured). Mỗi khối có `DECLARE` (khai báo biến), `BEGIN` (thân khối lệnh), `EXCEPTION` (xử lý lỗi), `END`.
        * **Khai báo biến:** `variable_name [CONSTANT] type [NOT NULL] [DEFAULT | := | = expression];`
        * **Gán giá trị:** `variable := expression;` hoặc `variable = expression;`.
        * **Lệnh `SELECT INTO variable ...`**: Gán kết quả của câu `SELECT` vào biến.
        * **Cấu trúc điều khiển:**
            * `IF condition THEN ... ELSIF condition THEN ... ELSE ... END IF;`
            * `CASE ... WHEN ... THEN ... ELSE ... END CASE;`
        * **Vòng lặp:**
            * `LOOP ... EXIT [WHEN condition]; ... END LOOP;`
            * `WHILE condition LOOP ... END LOOP;`
            * `FOR target IN query LOOP ... END LOOP;` (target có thể là record hoặc rowtype)
            * `FOR target IN [REVERSE] expression .. expression LOOP ... END LOOP;` (vòng lặp số)
        * **`RETURN`**: Trong function, dùng để trả về giá trị.
        * **`RAISE [level] 'format' [, expression ...];`**: Đưa ra thông báo hoặc lỗi (ví dụ: `RAISE NOTICE ...`, `RAISE EXCEPTION ...`).
        * **Xử lý ngoại lệ:**
            ```sql
            BEGIN
                -- statements
            EXCEPTION
                WHEN condition [OR condition ...] THEN
                    -- handler_statements
                WHEN OTHERS THEN -- Bắt tất cả các lỗi khác
                    -- handler_statements
            END;
            ```SQLSTATE` và `SQLERRM` là các biến đặc biệt chứa mã lỗi và thông điệp lỗi.
    * **Triggers:**
        * Một trigger là một function đặc biệt được PostgreSQL tự động thực thi khi có một sự kiện DML (`INSERT`, `UPDATE`, `DELETE`) hoặc `TRUNCATE` xảy ra trên một bảng hoặc view cụ thể.
        * **Trigger Function:** Là một function PL/pgSQL (hoặc ngôn ngữ khác) không nhận tham số và phải trả về kiểu `TRIGGER`.
        * **Cú pháp `CREATE TRIGGER`:**
            ```sql
            CREATE [CONSTRAINT] TRIGGER trigger_name
            {BEFORE | AFTER | INSTEAD OF} {event [OR ...]}
            ON table_name
            [FROM referenced_table_name]
            [NOT DEFERRABLE | [DEFERRABLE] [INITIALLY IMMEDIATE | INITIALLY DEFERRED]]
            [REFERENCING {OLD TABLE AS old_table_name | NEW TABLE AS new_table_name} [...]]
            [FOR [EACH] {ROW | STATEMENT}]
            [WHEN (condition)]
            EXECUTE {FUNCTION | PROCEDURE} function_name (arguments);
            ```
        * `BEFORE | AFTER | INSTEAD OF`: Thời điểm trigger kích hoạt. `INSTEAD OF` chỉ dùng cho view.
        * `event`: `INSERT`, `UPDATE [OF column_name [, ...]]`, `DELETE`, `TRUNCATE`.
        * `FOR EACH ROW`: Trigger thực thi một lần cho mỗi dòng bị ảnh hưởng.
        * `FOR EACH STATEMENT`: Trigger thực thi một lần cho mỗi câu lệnh, bất kể bao nhiêu dòng bị ảnh hưởng.
        * **Biến đặc biệt trong Trigger Function (cho `FOR EACH ROW`):**
            * `NEW`: Một biến kiểu `RECORD` chứa dòng mới (cho `INSERT` và `UPDATE`).
            * `OLD`: Một biến kiểu `RECORD` chứa dòng cũ (cho `UPDATE` và `DELETE`).
            * `TG_OP`: TEXT, thao tác gây ra trigger (`'INSERT'`, `'UPDATE'`, `'DELETE'`, `'TRUNCATE'`).
            * `TG_TABLE_NAME`, `TG_TABLE_SCHEMA`: Tên bảng và schema.
            * `TG_WHEN`: `'BEFORE'`, `'AFTER'`, `'INSTEAD OF'`.
            * `TG_LEVEL`: `'ROW'`, `'STATEMENT'`.
        * Trong trigger `BEFORE FOR EACH ROW`, function có thể trả về `NULL` để bỏ qua thao tác trên dòng đó, hoặc trả về `NEW` (có thể đã được sửa đổi) để tiếp tục.
* **Code ví dụ (SQL):**
    ```sql
    -- Function PL/pgSQL: Tính tổng doanh thu cho một khách hàng
    -- CREATE TABLE Invoices (invoice_id SERIAL, customer_id INT, total_amount NUMERIC);
    CREATE OR REPLACE FUNCTION get_customer_total_revenue(p_customer_id INT)
    RETURNS NUMERIC AS $$
    DECLARE
        v_total_revenue NUMERIC := 0;
    BEGIN
        SELECT SUM(total_amount) INTO v_total_revenue
        FROM Invoices
        WHERE customer_id = p_customer_id;

        RETURN COALESCE(v_total_revenue, 0);
    END;
    $$ LANGUAGE plpgsql STABLE;
    -- SELECT get_customer_total_revenue(1);

    -- Stored Procedure PL/pgSQL: Chuyển tiền giữa hai tài khoản (đã có ở Chapter 4, đây là ví dụ khác)
    -- CREATE TABLE BankAccounts (acc_no TEXT PRIMARY KEY, balance NUMERIC);
    CREATE OR REPLACE PROCEDURE transfer_money(
        from_account TEXT,
        to_account TEXT,
        amount NUMERIC
    ) AS $$
    BEGIN
        -- Giảm số dư tài khoản gửi
        UPDATE BankAccounts SET balance = balance - amount WHERE acc_no = from_account;
        -- Tăng số dư tài khoản nhận
        UPDATE BankAccounts SET balance = balance + amount WHERE acc_no = to_account;

        -- Kiểm tra nếu số dư tài khoản gửi bị âm (ví dụ đơn giản, thực tế cần check trước)
        IF (SELECT balance FROM BankAccounts WHERE acc_no = from_account) < 0 THEN
            RAISE EXCEPTION 'Insufficient funds in account %', from_account;
            -- Lưu ý: RAISE EXCEPTION sẽ tự động rollback transaction nếu procedure không tự quản lý
        END IF;
        -- COMMIT; -- Có thể COMMIT trong procedure nếu không chạy trong transaction lớn hơn
        RAISE NOTICE 'Transferred % from % to % successfully.', amount, from_account, to_account;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Transfer failed: % - %', SQLSTATE, SQLERRM;
            -- ROLLBACK; -- Có thể ROLLBACK trong procedure
            RAISE; -- Ném lại lỗi
    END;
    $$ LANGUAGE plpgsql;
    -- CALL transfer_money('ACC001', 'ACC002', 100.00);

    -- Trigger function và Trigger: Tự động cập nhật last_modified_timestamp
    -- ALTER TABLE Products ADD COLUMN last_modified TIMESTAMPTZ;
    CREATE OR REPLACE FUNCTION update_last_modified_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.last_modified = NOW(); -- Gán giá trị cho cột trong dòng SẮP được INSERT/UPDATE
        RETURN NEW; -- Trả về dòng (có thể đã sửa đổi) để thao tác tiếp tục
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER trg_products_last_modified
    BEFORE INSERT OR UPDATE ON Products
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified_column();

    -- Thử INSERT hoặc UPDATE vào Products, cột last_modified sẽ tự cập nhật.
    -- INSERT INTO Products (product_name, product_attributes) VALUES ('New Gadget', '{"color":"blue"}');
    -- UPDATE Products SET product_name = 'New Gadget Pro' WHERE product_name = 'New Gadget';
    ```
* **Bài tập ứng dụng:**
    1.  **Function kiểm tra tồn kho:**
        * Viết một function PL/pgSQL tên `check_product_availability` nhận vào `p_product_id INT` và `p_quantity_needed INT`.
        * Function này truy vấn bảng `Products` (giả sử có cột `stock_on_hand INT`).
        * Trả về `BOOLEAN`: `TRUE` nếu `stock_on_hand >= p_quantity_needed`, ngược lại `FALSE`.
    2.  **Stored Procedure xử lý đơn hàng:**
        * Viết một Stored Procedure PL/pgSQL tên `process_new_order` nhận vào `p_customer_id INT`, `p_product_id INT`, `p_quantity_ordered INT`.
        * Bên trong procedure:
            * Bắt đầu một transaction (nếu cần, hoặc giả định nó chạy trong transaction riêng).
            * Gọi function `check_product_availability` từ bài 1.
            * Nếu có đủ hàng:
                * Giảm `stock_on_hand` trong bảng `Products`.
                * Thêm một dòng mới vào bảng `Orders` (giả sử có bảng này).
                * `COMMIT` (nếu procedure tự quản lý transaction).
                * `RAISE NOTICE` thông báo thành công.
            * Nếu không đủ hàng:
                * `RAISE EXCEPTION` thông báo không đủ hàng.
                * `ROLLBACK` (nếu procedure tự quản lý transaction).
    3.  **Trigger ghi log thay đổi giá sản phẩm:**
        * Tạo bảng `ProductPriceLog` (log_id SERIAL, product_id INT, old_price NUMERIC, new_price NUMERIC, changed_by TEXT DEFAULT CURRENT_USER, changed_at TIMESTAMPTZ DEFAULT NOW()).
        * Viết một trigger function PL/pgSQL.
        * Tạo một trigger `AFTER UPDATE OF unit_price ON Products` (giả sử `Products` có cột `unit_price`).
        * Trigger này sẽ ghi một dòng vào `ProductPriceLog` mỗi khi `unit_price` của một sản phẩm thay đổi, lưu giá cũ và giá mới.
    4.  **Function tính tuổi nhân viên (sử dụng `AGE` và `EXTRACT`):**
        * Viết một function PL/pgSQL nhận vào `date_of_birth DATE` và trả về tuổi (INTEGER) của người đó.
    5.  **Trigger ngăn xóa phòng ban có nhân viên:**
        * Giả sử có bảng `Departments` (dept_id, dept_name) và `Employees` (emp_id, dept_id).
        * Viết một trigger function.
        * Tạo một trigger `BEFORE DELETE ON Departments FOR EACH ROW`.
        * Trigger này kiểm tra xem có nhân viên nào còn thuộc phòng ban sắp bị xóa không. Nếu có, `RAISE EXCEPTION` và ngăn chặn việc xóa.

