# Chapter 10: Các Loại Index và Tối Ưu Hóa Truy Vấn

* **Tên bài học:** Tăng tốc độ truy vấn với các loại Index hiệu quả và kỹ thuật tối ưu hóa cơ bản.
* **Tóm tắt lý thuyết:**
    * **Tầm quan trọng của Indexing:**
        * Index là một cấu trúc dữ liệu đặc biệt giúp tăng tốc độ truy xuất dữ liệu từ các bảng. Nó hoạt động tương tự như mục lục của một cuốn sách.
        * Khi không có index, PostgreSQL phải thực hiện quét toàn bộ bảng (sequential scan) để tìm các dòng thỏa mãn điều kiện truy vấn, điều này rất chậm với bảng lớn.
        * Index làm tăng tốc độ `SELECT` nhưng có thể làm chậm các thao tác `INSERT`, `UPDATE`, `DELETE` vì index cũng cần được cập nhật. Do đó, cần cân nhắc tạo index cho các cột thường xuyên được dùng trong mệnh đề `WHERE`, `JOIN ON`, `ORDER BY`, `GROUP BY`.
    * **Các loại Index chính trong PostgreSQL:**
        * **B-tree (Mặc định):**
            * Cấu trúc cây cân bằng. Phù hợp nhất cho các toán tử so sánh: `=`, `>`, `>=`, `<`, `<=`, `BETWEEN`, `IN`, `IS NULL`, `IS NOT NULL`.
            * Hỗ trợ sắp xếp (`ORDER BY`) và tìm kiếm theo dải (range queries).
            * Mặc định được tạo cho `PRIMARY KEY` và `UNIQUE` constraints.
        * **Hash:**
            * Chỉ hỗ trợ toán tử bằng (`=`).
            * Có thể nhanh hơn B-tree cho các phép so sánh bằng đơn giản trong một số trường hợp, nhưng ít linh hoạt hơn.
            * Không được ghi vào WAL trước PostgreSQL 10, có thể cần rebuild sau crash. Ít được sử dụng hơn B-tree.
        * **GIN (Generalized Inverted Index):**
            * Được thiết kế cho việc index các kiểu dữ liệu phức hợp chứa nhiều "item" trong một giá trị cột (ví dụ: một mảng chứa nhiều phần tử, một tài liệu text chứa nhiều từ, một JSONB chứa nhiều key/value).
            * Hữu ích cho: `ARRAY` (toán tử `@>`, `<@`, `&&`), `JSONB` (toán tử `@>`, `?`, `?|`, `?&`), `tsvector` (Full-Text Search).
            * Tạo index chậm hơn B-tree nhưng truy vấn rất nhanh cho các toán tử được hỗ trợ.
        * **GiST (Generalized Search Tree):**
            * Một framework để xây dựng các cấu trúc index tùy chỉnh cho nhiều loại dữ liệu và toán tử phức tạp.
            * Có thể index dữ liệu hình học (PostGIS extension dùng GiST), dữ liệu không gian, full-text search (thay thế cho GIN trong một số trường hợp), dữ liệu khoảng (range types).
            * Linh hoạt nhưng có thể phức tạp hơn để hiểu và tune.
        * **SP-GiST (Space-Partitioned GiST):**
            * Hỗ trợ các cấu trúc dữ liệu phân vùng không gian (ví dụ: k-d trees, quadtrees, radix trees).
            * Hiệu quả cho các loại dữ liệu không đều (non-uniformly distributed data) mà GiST không xử lý tốt. Ví dụ: số điện thoại, địa chỉ IP.
        * **BRIN (Block Range Index):**
            * Hiệu quả cho các bảng rất lớn có dữ liệu được sắp xếp tự nhiên hoặc có sự tương quan mạnh giữa giá trị cột và vị trí vật lý của dòng trên đĩa (ví dụ: cột timestamp trong bảng log được chèn theo thứ tự thời gian).
            * Lưu trữ thông tin tóm tắt (min, max, sum, count, etc.) cho mỗi *dải các block* (block range) trên đĩa.
            * Index rất nhỏ và tạo rất nhanh. Truy vấn có thể bỏ qua việc đọc nhiều block nếu giá trị tìm kiếm nằm ngoài dải min/max của block range đó.
    * **Các kỹ thuật Indexing nâng cao:**
        * **Index đa cột (Multi-column / Composite Indexes):**
            * `CREATE INDEX idx_name ON table_name (column1, column2, ...);`
            * Thứ tự các cột trong index rất quan trọng. Index có thể được sử dụng hiệu quả nếu điều kiện truy vấn sử dụng tiền tố của các cột trong index (ví dụ: `WHERE column1 = ? AND column2 = ?` hoặc `WHERE column1 = ?`).
        * **Covering Indexes (Sử dụng mệnh đề `INCLUDE` - PostgreSQL 11+):**
            * `CREATE INDEX idx_name ON table_name (indexed_column1, indexed_column2) INCLUDE (non_indexed_column1, non_indexed_column2);`
            * Cho phép lưu trữ thêm các cột không phải là phần của key index nhưng thường được truy vấn cùng.
            * Nếu tất cả các cột cần thiết cho một truy vấn đều có trong index (kể cả phần `INCLUDE`), PostgreSQL có thể thực hiện "index-only scan", không cần truy cập vào bảng chính, rất nhanh.
        * **Partial Indexes (Index một phần):**
            * `CREATE INDEX idx_name ON table_name (column_name) WHERE condition;`
            * Index chỉ một tập con các dòng của bảng thỏa mãn điều kiện `WHERE`.
            * Tiết kiệm không gian và thời gian cập nhật index nếu chỉ một phần nhỏ của bảng thường xuyên được truy vấn với điều kiện đó. Ví dụ: `WHERE processed = false`.
        * **Expression Indexes (Functional Indexes / Index trên biểu thức):**
            * `CREATE INDEX idx_name ON table_name (LOWER(column_name));`
            * Index dựa trên kết quả của một hàm hoặc biểu thức.
            * Hữu ích khi truy vấn thường xuyên sử dụng hàm đó trong mệnh đề `WHERE` (ví dụ: `WHERE LOWER(email) = '...'`).
    * **Tối ưu hóa truy vấn cơ bản:**
        * **Câu lệnh `EXPLAIN` và `EXPLAIN ANALYZE`:**
            * `EXPLAIN SELECT ...`: Hiển thị kế hoạch thực thi (execution plan) mà PostgreSQL dự định sử dụng, bao gồm các bước (nodes) như Sequential Scan, Index Scan, Nested Loop Join, Hash Join, Sort, Aggregate. Ước tính chi phí (cost), số dòng (rows), độ rộng (width).
            * `EXPLAIN ANALYZE SELECT ...`: Thực thi câu lệnh và hiển thị kế hoạch thực tế cùng với thời gian thực thi thực tế và số dòng thực tế cho mỗi node. **Rất quan trọng để chẩn đoán hiệu năng.**
            * Các thông số cần chú ý: `cost` (start-up cost..total cost), `rows` (ước tính vs thực tế), `actual time` (thời gian thực thi node), loại scan (Index Scan tốt hơn Seq Scan cho query chọn lọc), loại join.
        * **`VACUUM` và `ANALYZE`:**
            * `VACUUM`: Dọn dẹp các "dead tuples" (phiên bản dòng cũ không còn nhìn thấy được bởi bất kỳ transaction nào).
            * `ANALYZE`: Thu thập thống kê về sự phân bố dữ liệu trong các bảng và cột. Thống kê này được bộ tối ưu hóa truy vấn (query planner) sử dụng để đưa ra kế hoạch thực thi tốt nhất.
            * `AUTOVACUUM` daemon thường tự động chạy cả hai, nhưng đôi khi cần chạy thủ công sau khi có thay đổi dữ liệu lớn.
        * **Tránh `SELECT *`**: Chỉ chọn các cột bạn thực sự cần. Giảm I/O, có thể giúp sử dụng index-only scan.
        * **Viết điều kiện `WHERE` hiệu quả (SARGable - Search ARGument Able):** Điều kiện cho phép sử dụng index. Tránh dùng hàm trên cột được index trong `WHERE` (trừ khi có expression index).
* **Code ví dụ (SQL):**
    ```sql
    -- B-tree index (thường tự động tạo cho PRIMARY KEY và UNIQUE)
    CREATE INDEX idx_employees_lastname ON Employees (last_name); -- Giả sử có cột last_name
    CREATE INDEX idx_orders_customer_date ON Orders (customer_id, order_date DESC); -- Index đa cột

    -- GIN index cho JSONB (đã ví dụ ở Chapter 9)
    -- CREATE INDEX idx_products_attributes ON Products USING GIN (product_attributes);

    -- GIN index cho ARRAY (ví dụ: bảng NhanVien có cột ky_nang TEXT[])
    -- CREATE INDEX idx_nhanvien_kynang ON NhanVien USING GIN (ky_nang);
    -- Query sử dụng: SELECT * FROM NhanVien WHERE ky_nang @> ARRAY['Java'];

    -- Partial Index: Chỉ index các đơn hàng chưa được giao
    -- CREATE TABLE Shipments (shipment_id SERIAL PRIMARY KEY, order_id INT, status TEXT DEFAULT 'pending');
    CREATE INDEX idx_shipments_pending ON Shipments (order_id)
    WHERE status = 'pending' OR status = 'processing';

    -- Expression Index: Index trên email viết thường để tìm kiếm không phân biệt hoa thường
    -- CREATE TABLE Users (user_id SERIAL, email TEXT UNIQUE);
    CREATE INDEX idx_users_email_lower ON Users (LOWER(email));
    -- Query sử dụng: SELECT * FROM Users WHERE LOWER(email) = 'test@example.com';

    -- Covering Index (PostgreSQL 11+)
    -- CREATE INDEX idx_orders_customer_include_amount ON Orders (customer_id) INCLUDE (total_amount, order_date);
    -- Query có thể dùng index-only scan: SELECT total_amount, order_date FROM Orders WHERE customer_id = 123;

    -- Xem kế hoạch thực thi
    EXPLAIN SELECT * FROM Employees WHERE last_name = 'Smith';
    EXPLAIN ANALYZE SELECT * FROM Users WHERE LOWER(email) = 'test@example.com';

    -- Chạy ANALYZE để cập nhật thống kê (thường autovacuum làm, nhưng có thể chạy thủ công)
    ANALYZE Employees;
    ```
* **Bài tập ứng dụng:**
    Giả sử có bảng `FlightBookings` (booking_id SERIAL PRIMARY KEY, passenger_name TEXT, flight_number VARCHAR(10), departure_city TEXT, arrival_city TEXT, booking_date TIMESTAMPTZ, seat_class VARCHAR(20) CHECK (seat_class IN ('Economy', 'Business', 'First')), status VARCHAR(15) DEFAULT 'CONFIRMED').
    1.  **Phân tích truy vấn và đề xuất Index:**
        * Cho các truy vấn sau, hãy phân tích và đề xuất các B-tree index (đơn cột hoặc đa cột) phù hợp:
            * `SELECT * FROM FlightBookings WHERE flight_number = 'VN123' AND booking_date >= '2024-01-01';`
            * `SELECT passenger_name, flight_number FROM FlightBookings WHERE departure_city = 'Hanoi' ORDER BY booking_date DESC;`
            * `SELECT COUNT(*) FROM FlightBookings WHERE status = 'CANCELLED';`
        * Tạo các index bạn đã đề xuất.
    2.  **Sử dụng `EXPLAIN ANALYZE`:**
        * Chạy `EXPLAIN ANALYZE` cho các truy vấn ở câu 1 trước và sau khi tạo index. So sánh kế hoạch thực thi và thời gian.
    3.  **Partial Index:**
        * Giả sử 95% các booking có status là 'CONFIRMED'. Tạo một Partial Index cho các booking *không* phải là 'CONFIRMED' (ví dụ: 'CANCELLED', 'PENDING').
        * Viết truy vấn tìm tất cả các booking có status 'CANCELLED' và xem `EXPLAIN ANALYZE`.
    4.  **Expression Index:**
        * Nếu thường xuyên tìm kiếm `passenger_name` không phân biệt hoa thường, hãy tạo một Expression Index phù hợp.
        * Viết truy vấn tìm kiếm và kiểm tra với `EXPLAIN ANALYZE`.
    5.  **BRIN Index (Thảo luận):**
        * Nếu bảng `FlightBookings` rất lớn và các booking được chèn gần như theo thứ tự `booking_date`, BRIN index trên `booking_date` có thể hữu ích không? Tại sao? So sánh với B-tree trong trường hợp này.
    6.  **Covering Index (Nếu dùng PostgreSQL 11+):**
        * Giả sử có truy vấn thường xuyên: `SELECT flight_number, seat_class FROM FlightBookings WHERE passenger_name = 'Nguyen Van A';`
        * Đề xuất một covering index để tối ưu truy vấn này thành index-only scan.
