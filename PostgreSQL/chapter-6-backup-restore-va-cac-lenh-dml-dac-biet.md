### Chapter 6: Backup, Restore và Các Lệnh DML Đặc Biệt

* **Tên bài học:** Bảo vệ dữ liệu với Backup/Restore và làm chủ các kỹ thuật DML nâng cao (UPSERT, RETURNING, DELETE USING).
* **Tóm tắt lý thuyết:**
    * **Backup và Restore (Logical Backup):**
        * **`pg_dump`**: Công cụ dòng lệnh để tạo bản sao lưu logic của một database PostgreSQL. Kết quả có thể là một file script SQL (plain format) hoặc một file archive (custom, directory, tar format).
            * Plain format (`-Fp` hoặc mặc định): File text chứa các lệnh SQL để tạo lại schema và dữ liệu. Khôi phục bằng `psql`.
            * Custom format (`-Fc`): Định dạng nén, linh hoạt, cho phép chọn lọc đối tượng khi khôi phục, khôi phục song song. Khôi phục bằng `pg_restore`. **Khuyến nghị sử dụng.**
            * Directory format (`-Fd`): Lưu mỗi bảng và đối tượng lớn vào một file riêng trong một thư mục. Hỗ trợ khôi phục song song. Khôi phục bằng `pg_restore`.
            * Tar format (`-Ft`): Tương tự custom nhưng không nén. Khôi phục bằng `pg_restore`.
            * Các tùy chọn quan trọng:
                * `-U username`, `-W` (prompt password), `-h host`, `-p port`.
                * `database_name`.
                * `-f filename` (output file).
                * `-n schema_name` (chỉ backup schema cụ thể).
                * `-t table_name` (chỉ backup bảng cụ thể, có thể dùng wildcard).
                * `--inserts` hoặc `--column-inserts` (dùng lệnh `INSERT` thay vì `COPY`, chậm hơn nhưng dễ port đi nơi khác).
                * `-j num_jobs` (backup song song, chỉ cho directory format).
        * **`pg_dumpall`**: Backup tất cả các database trong một cluster, bao gồm cả các đối tượng global (roles, tablespaces). Output luôn là plain SQL.
        * **`pg_restore`**: Công cụ để khôi phục database từ file archive được tạo bởi `pg_dump` (custom, directory, tar).
            * Cần tạo database rỗng trước khi khôi phục (trừ khi dùng `-C` với `pg_dump` để bao gồm lệnh tạo DB).
            * Các tùy chọn quan trọng:
                * `-d database_name` (database để khôi phục vào).
                * `-C` (tạo database trước khi khôi phục - database name lấy từ archive).
                * `-c` (clean - drop các đối tượng CSDL trước khi tạo lại).
                * `-j num_jobs` (khôi phục song song).
                * `-L filename` (list nội dung archive).
                * `-n schema_name`, `-t table_name` (chỉ khôi phục đối tượng cụ thể).
        * **`psql`**: Dùng để khôi phục từ file SQL script (plain format): `psql -U username -d database_name -f backup_file.sql`.
    * **Physical Backup (Giới thiệu sơ lược):**
        * Sao chép toàn bộ các file dữ liệu của database cluster.
        * Point-in-Time Recovery (PITR): Khả năng khôi phục database về bất kỳ thời điểm nào giữa hai lần backup, bằng cách sử dụng base backup và các file WAL (Write-Ahead Log).
        * Công cụ: `pg_basebackup`, các công cụ chuyên dụng như `pgBackRest`, `Barman`.
    * **`INSERT ... ON CONFLICT DO NOTHING / DO UPDATE` (UPSERT):**
        * Tính năng mạnh mẽ của PostgreSQL để xử lý xung đột khi chèn dữ liệu (thường là vi phạm ràng buộc `UNIQUE` hoặc `PRIMARY KEY`).
        * **`ON CONFLICT (conflict_target) DO NOTHING`**: Nếu có xung đột, không làm gì cả, bỏ qua việc chèn.
            * `conflict_target`: Có thể là tên cột (hoặc các cột) có ràng buộc `UNIQUE`, hoặc tên của một ràng buộc `UNIQUE` (`ON CONSTRAINT constraint_name`).
        * **`ON CONFLICT (conflict_target) DO UPDATE SET column1 = value1 [, ...]`**: Nếu có xung đột, cập nhật dòng hiện có.
            * Bên trong mệnh đề `SET`, bạn có thể tham chiếu đến các giá trị của dòng hiện có (ví dụ: `TableName.column_name`) và các giá trị đáng lẽ đã được chèn nếu không có xung đột thông qua bảng ảo `excluded` (ví dụ: `excluded.column_name`).
            * Có thể thêm mệnh đề `WHERE condition` vào `DO UPDATE` để chỉ cập nhật nếu điều kiện thỏa mãn.
    * **Mệnh đề `RETURNING`:**
        * Trả về các giá trị từ các dòng bị ảnh hưởng bởi câu lệnh `INSERT`, `UPDATE`, hoặc `DELETE`.
        * Rất hữu ích để lấy ID tự tăng, các giá trị mặc định, hoặc các giá trị vừa được thay đổi mà không cần thực hiện một câu lệnh `SELECT` riêng biệt.
        * Cú pháp: `... RETURNING expression [AS alias] [, ...] | *`
    * **`DELETE USING`:**
        * Xóa các dòng trong một bảng dựa trên điều kiện join với một hoặc nhiều bảng khác.
        * Cú pháp: `DELETE FROM target_table USING other_table1 [, other_table2 ...] WHERE join_condition AND other_conditions;`
        * Khác với subquery trong `DELETE FROM ... WHERE id IN (SELECT ...)`: `DELETE USING` thường hiệu quả hơn và linh hoạt hơn.
    * **`TRUNCATE TABLE table_name [, ...]`:**
        * Xóa nhanh tất cả các dòng khỏi một hoặc nhiều bảng.
        * Nhanh hơn `DELETE` không có `WHERE` vì nó không scan bảng và không ghi WAL cho từng dòng (trừ khi có trigger).
        * Không kích hoạt trigger `ON DELETE` cho từng dòng (chỉ trigger `ON TRUNCATE` ở mức statement).
        * Tùy chọn:
            * `RESTART IDENTITY`: Reset các sequence liên quan đến các cột `SERIAL` của bảng về giá trị ban đầu.
            * `CONTINUE IDENTITY` (mặc định): Không thay đổi sequence.
            * `CASCADE`: Tự động truncate cả các bảng có khóa ngoại tham chiếu đến bảng bị truncate.
            * `RESTRICT` (mặc định): Không cho truncate nếu có khóa ngoại tham chiếu đến, trừ khi các bảng đó cũng được liệt kê trong lệnh `TRUNCATE`.
* **Code ví dụ (SQL):**
    ```sql
    -- Backup database 'my_project_db' sang file custom format (dòng lệnh terminal)
    -- pg_dump -U postgres -Fc -f my_project_db_backup.dump my_project_db

    -- Tạo database mới và khôi phục (dòng lệnh terminal)
    -- createdb -U postgres my_project_db_restored
    -- pg_restore -U postgres -d my_project_db_restored my_project_db_backup.dump

    -- INSERT ON CONFLICT DO NOTHING
    CREATE TABLE EmailSubscribers (email VARCHAR(255) PRIMARY KEY, name VARCHAR(100), subscribed_at TIMESTAMPTZ DEFAULT NOW());
    INSERT INTO EmailSubscribers (email, name) VALUES ('user1@example.com', 'User One');
    INSERT INTO EmailSubscribers (email, name) VALUES ('user1@example.com', 'User One Again')
    ON CONFLICT (email) DO NOTHING; -- Sẽ không chèn dòng thứ hai

    -- INSERT ON CONFLICT DO UPDATE (cập nhật tên và thời gian nếu email đã tồn tại)
    INSERT INTO EmailSubscribers (email, name) VALUES ('user1@example.com', 'User One Updated Name')
    ON CONFLICT (email) DO UPDATE SET
        name = excluded.name,
        subscribed_at = NOW();

    -- INSERT với RETURNING
    CREATE TABLE ProductSales (sale_id SERIAL PRIMARY KEY, product_name TEXT, quantity INT, sale_time TIMESTAMPTZ);
    INSERT INTO ProductSales (product_name, quantity, sale_time)
    VALUES ('Laptop X200', 2, NOW())
    RETURNING sale_id, product_name, sale_time;

    -- UPDATE với RETURNING
    UPDATE ProductSales SET quantity = quantity + 1 WHERE product_name = 'Laptop X200'
    RETURNING product_name, quantity AS new_quantity;

    -- DELETE với RETURNING
    -- DELETE FROM ProductSales WHERE quantity < 2
    -- RETURNING *; -- Trả về tất cả các cột của các dòng đã xóa

    -- DELETE USING: Xóa các đơn hàng cũ (trước 2022) của các khách hàng không hoạt động
    CREATE TABLE Customers (customer_id INT PRIMARY KEY, name TEXT, status VARCHAR(10) DEFAULT 'active'); -- 'active' or 'inactive'
    -- INSERT INTO Customers VALUES (1, 'Alice', 'active'), (2, 'Bob', 'inactive'), (3, 'Charlie', 'active');
    -- INSERT INTO Orders (customer_id, order_date, total_amount) VALUES
    -- (1, '2021-05-10 UTC', 100), (2, '2021-11-20 UTC', 150), (3, '2023-01-01 UTC', 200);

    DELETE FROM Orders o
    USING Customers c
    WHERE o.customer_id = c.customer_id
      AND c.status = 'inactive'
      AND EXTRACT(YEAR FROM o.order_date) < 2022;

    -- TRUNCATE
    CREATE TABLE TempLogs (log_entry TEXT);
    INSERT INTO TempLogs VALUES ('Log 1'), ('Log 2');
    TRUNCATE TABLE TempLogs RESTART IDENTITY; -- Nếu TempLogs có cột SERIAL, sequence sẽ reset
    -- (Lưu ý: RESTART IDENTITY không có ý nghĩa nếu không có cột SERIAL/IDENTITY)
    ```
* **Bài tập ứng dụng:**
    1.  **Backup và Restore Toàn diện:**
        * Sử dụng `pg_dump` để backup database `my_project_db` của bạn với định dạng `custom` (`-Fc`).
        * Xóa database `my_project_db` (cẩn thận!).
        * Tạo lại database `my_project_db` rỗng.
        * Sử dụng `pg_restore` để khôi phục toàn bộ dữ liệu vào `my_project_db`.
    2.  **Backup Chọn lọc:**
        * Backup chỉ schema `engineering` từ `my_project_db` ra một file archive riêng.
        * Backup chỉ bảng `Products` (nếu có, hoặc một bảng bất kỳ bạn chọn) ra một file SQL (plain format).
    3.  **Thực hành `ON CONFLICT`:**
        * Tạo bảng `ProductInventory` (product_sku VARCHAR(50) PRIMARY KEY, product_name TEXT, stock_level INT, last_updated TIMESTAMPTZ).
        * Viết câu lệnh `INSERT` để thêm sản phẩm mới.
        * Viết câu lệnh `INSERT ... ON CONFLICT (product_sku) DO UPDATE SET ...` để:
            * Nếu `product_sku` đã tồn tại, cộng `stock_level` từ `excluded` vào `stock_level` hiện tại và cập nhật `last_updated`.
            * Thử chèn một sản phẩm mới, sau đó chèn lại sản phẩm đó với `stock_level` khác để kiểm tra logic cập nhật.
    4.  **Sử dụng `RETURNING`:**
        * Khi thêm một nhân viên mới vào bảng `human_resources.Employees` (từ bài tập Chapter 5), sử dụng `RETURNING` để lấy `employee_id` và `hire_date` (nếu `hire_date` có giá trị default là `CURRENT_DATE`).
        * Viết câu lệnh `UPDATE` để tăng `stock_level` của tất cả sản phẩm trong `ProductInventory` có `stock_level < 10` lên thêm 5 đơn vị, và dùng `RETURNING` để trả về `product_sku` và `stock_level` mới.
    5.  **`DELETE USING` và `TRUNCATE`:**
        * Giả sử bạn có bảng `ArchivedOrders` và `ActiveOrders`. Viết câu lệnh `DELETE USING` để xóa các đơn hàng trong `ActiveOrders` mà đã tồn tại (cùng `order_id`) trong `ArchivedOrders`.
        * Tạo một bảng log tạm `DailyActionLog`. Sau khi xử lý xong log trong ngày, bạn muốn xóa sạch bảng này và reset sequence (nếu có). Sử dụng `TRUNCATE TABLE ... RESTART IDENTITY;`. Thảo luận khi nào nên dùng `TRUNCATE` thay vì `DELETE`.

