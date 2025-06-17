# Chapter 9: Làm việc với Dữ liệu JSON và JSONB

* **Tên bài học:** Khai thác sức mạnh và tính linh hoạt của kiểu dữ liệu JSON/JSONB trong PostgreSQL.
* **Tóm tắt lý thuyết:**
    * **Tổng quan về `JSON` và `JSONB`:**
        * `JSON`: Lưu trữ bản sao chính xác của văn bản JSON đầu vào. Điều này có nghĩa là nó giữ lại khoảng trắng, thứ tự các key trong object, và cả các key bị trùng lặp (phiên bản cuối cùng của key trùng được giữ khi xử lý). Quá trình xử lý (parse) JSON diễn ra mỗi khi truy vấn.
        * `JSONB` (JSON Binary): Lưu trữ dữ liệu JSON ở định dạng nhị phân đã được phân tích cú pháp (parsed) và tối ưu hóa. Nó loại bỏ khoảng trắng không cần thiết, không đảm bảo thứ tự key của object, và chỉ giữ lại giá trị cuối cùng cho các key trùng lặp. `JSONB` thường hiệu quả hơn đáng kể cho việc truy vấn và thao tác, đồng thời hỗ trợ indexing tốt hơn. **Khuyến nghị sử dụng `JSONB` trong hầu hết các trường hợp.**
        * Chuyển đổi: `::jsonb`, `::json`.
    * **Toán tử truy cập (Operators):**
        * `->`: Lấy phần tử mảng JSON theo index (0-based) hoặc giá trị object JSON theo key. Trả về kiểu `JSON` (nếu input là `JSON`) hoặc `JSONB` (nếu input là `JSONB`).
            * `json_column -> index` (cho mảng)
            * `json_column -> 'key_name'` (cho object)
        * `->>`: Tương tự `->` nhưng trả về giá trị dưới dạng `TEXT`. Hữu ích khi bạn muốn lấy giá trị cuối cùng là chuỗi.
            * `json_column ->> index`
            * `json_column ->> 'key_name'`
        * `#>`: Lấy giá trị JSON tại một đường dẫn (path) cụ thể, được chỉ định bằng một mảng text. Trả về `JSON`/`JSONB`.
            * `json_column #> '{path,to,element}'` (ví dụ: `'{address,city}'` hoặc `'{tags,0}'` để lấy phần tử đầu tiên của mảng 'tags').
        * `#>>`: Tương tự `#>` nhưng trả về giá trị dưới dạng `TEXT`.
            * `json_column #>> '{path,to,element}'`
    * **Các hàm và toán tử tạo và xử lý JSON/JSONB:**
        * `jsonb_build_object(key1, value1, key2, value2, ...)`: Tạo một object JSONB.
        * `jsonb_build_array(value1, value2, ...)`: Tạo một mảng JSONB.
        * `to_jsonb(anyelement)`: Chuyển đổi một giá trị SQL (ví dụ: một dòng, một mảng SQL) thành JSONB.
        * `jsonb_array_elements(jsonb_array)`: Mở rộng một mảng JSONB thành một tập các giá trị JSONB (mỗi phần tử mảng thành một dòng).
        * `jsonb_array_elements_text(jsonb_array)`: Tương tự nhưng trả về TEXT.
        * `jsonb_object_keys(jsonb_object)`: Trả về tất cả các key của một object JSONB dưới dạng một tập các TEXT.
        * `jsonb_each(jsonb_object)`: Mở rộng một object JSONB thành một tập các cặp (key TEXT, value JSONB).
        * `jsonb_each_text(jsonb_object)`: Tương tự nhưng value trả về là TEXT.
        * `jsonb_extract_path(from_json jsonb, VARIADIC path_elems text[])`: Tương đương toán tử `#>`.
        * `jsonb_extract_path_text(...)`: Tương đương toán tử `#>>`.
        * `jsonb_pretty(jsonb)`: In JSONB ra dạng text dễ đọc, có thụt lề.
        * `jsonb_typeof(jsonb)`: Trả về kiểu của giá trị JSONB ngoài cùng (`'object'`, `'array'`, `'string'`, `'number'`, `'boolean'`, `'null'`).
        * `jsonb_strip_nulls(from_json jsonb)`: Xóa tất cả các cặp key-value mà value là null từ object.
    * **Toán tử kiểm tra sự tồn tại và chứa (Existence and Containment Operators - chủ yếu cho JSONB):**
        * `@>` (contains): `jsonb_A @> jsonb_B` -> `jsonb_A` có chứa `jsonb_B` không?
            * Ví dụ: `'{"a":1, "b":2}'::jsonb @> '{"a":1}'::jsonb` là TRUE.
            * `'["a", "b", "c"]'::jsonb @> '["a", "c"]'::jsonb` là TRUE.
        * `<@` (is contained by): `jsonb_A <@ jsonb_B` -> `jsonb_A` có được chứa bởi `jsonb_B` không?
        * `?` (key exists): `jsonb_object ? 'key_name'` -> `jsonb_object` có chứa `key_name` không?
        * `?|` (any key exists): `jsonb_object ?| ARRAY['key1', 'key2']` -> `jsonb_object` có chứa bất kỳ key nào trong mảng không?
        * `?&` (all keys exist): `jsonb_object ?& ARRAY['key1', 'key2']` -> `jsonb_object` có chứa tất cả các key trong mảng không?
    * **Cập nhật và xóa trong JSONB:**
        * `jsonb_set(target jsonb, path text[], new_value jsonb [, create_missing boolean])`: Cập nhật hoặc chèn giá trị tại một path.
        * Toán tử `||` (concatenate): Nối hai object JSONB (các key trùng ở object bên phải sẽ ghi đè) hoặc hai mảng JSONB.
        * Toán tử `-` (delete):
            * `jsonb_object - 'key_name'`: Xóa key khỏi object.
            * `jsonb_object - ARRAY['key1', 'key2']`: Xóa nhiều key.
            * `jsonb_array - integer_index`: Xóa phần tử tại index khỏi mảng (index âm tính từ cuối).
        * Toán tử `#-`: `jsonb_value #- '{path,to,element}'`: Xóa phần tử tại path.
    * **Indexing JSONB:**
        * **GIN (Generalized Inverted Index)** là loại index hiệu quả nhất cho JSONB.
        * `CREATE INDEX idx_gin_my_table_json_col ON my_table USING GIN (jsonb_column);` (Index toàn bộ cột JSONB, hỗ trợ các toán tử `@>`, `?`, `?|`, `?&`).
        * `CREATE INDEX idx_gin_my_table_json_col_path_ops ON my_table USING GIN (jsonb_column jsonb_path_ops);` (Hỗ trợ thêm toán tử `@>` cho các path cụ thể, thường hiệu quả hơn GIN mặc định nếu bạn chỉ query containment ở path nông).
        * Index trên một biểu thức (expression index) trích xuất một phần của JSONB:
            `CREATE INDEX idx_my_table_specific_key ON my_table USING GIN ((jsonb_column -> 'specific_key'));`
            Hoặc B-tree index nếu giá trị trích xuất là kiểu có thể index B-tree:
            `CREATE INDEX idx_my_table_specific_value ON my_table ((jsonb_column ->> 'numeric_key')::numeric);`
* **Code ví dụ (SQL):**
    ```sql
    -- Giả sử bảng Products có cột product_attributes JSONB
    /*
    CREATE TABLE Products (
        product_id SERIAL PRIMARY KEY,
        product_name TEXT NOT NULL,
        product_attributes JSONB
    );
    INSERT INTO Products (product_name, product_attributes) VALUES
    ('Laptop Pro', '{"brand": "TechCorp", "screen_size": 15.6, "ram_gb": 16, "tags": ["powerful", "business"], "specs": {"cpu": "i7", "storage_type": "SSD"}}'),
    ('Smartphone Lite', '{"brand": "MobileInc", "screen_size": 6.1, "ram_gb": 8, "tags": ["compact", "budget"], "color_options": ["black", "white"] }'),
    ('Wireless Mouse', '{"brand": "AccessoriesCo", "connectivity": "bluetooth", "tags": ["ergonomic"]}');
    */

    -- Truy cập thuộc tính
    SELECT
        product_name,
        product_attributes ->> 'brand' AS brand,
        (product_attributes ->> 'screen_size')::NUMERIC AS screen,
        product_attributes #>> '{specs,cpu}' AS cpu_model,
        product_attributes -> 'tags' ->> 0 AS first_tag -- Lấy tag đầu tiên
    FROM Products;

    -- Kiểm tra sự tồn tại của key và containment
    SELECT product_name FROM Products WHERE product_attributes ? 'ram_gb';
    SELECT product_name FROM Products WHERE product_attributes @> '{"brand": "TechCorp"}'::jsonb;
    SELECT product_name FROM Products WHERE product_attributes -> 'tags' @> '["budget"]'::jsonb; -- Kiểm tra tag 'budget'

    -- Mở rộng mảng và object
    SELECT p.product_name, t.tag
    FROM Products p, jsonb_array_elements_text(p.product_attributes -> 'tags') AS t(tag)
    WHERE p.product_attributes ? 'tags';

    SELECT p.product_name, kv.key, kv.value
    FROM Products p, jsonb_each(p.product_attributes) AS kv(key, value)
    WHERE p.product_name = 'Laptop Pro';

    -- Cập nhật JSONB
    UPDATE Products
    SET product_attributes = product_attributes || '{"status": "new_arrival"}'::jsonb -- Thêm/cập nhật key status
    WHERE product_name = 'Laptop Pro';

    UPDATE Products
    SET product_attributes = jsonb_set(
                                product_attributes,
                                '{specs,storage_gb}', -- Path
                                '512'::jsonb,        -- New value (phải là jsonb)
                                true                 -- Create if missing
                            )
    WHERE product_name = 'Laptop Pro';

    UPDATE Products
    SET product_attributes = product_attributes #- '{ram_gb}' -- Xóa key ram_gb
    WHERE product_name = 'Smartphone Lite';

    SELECT product_name, jsonb_pretty(product_attributes) FROM Products;

    -- Tạo GIN index
    CREATE INDEX idx_gin_products_attributes ON Products USING GIN (product_attributes);
    -- Query sử dụng index:
    EXPLAIN ANALYZE SELECT product_name FROM Products WHERE product_attributes @> '{"brand":"MobileInc"}'::jsonb;
    ```
* **Bài tập ứng dụng:**
    Tạo bảng `UserProfiles` (user_id SERIAL PRIMARY KEY, username VARCHAR(50) UNIQUE, profile_data JSONB). Cột `profile_data` có thể chứa:
    `{"full_name": "John Doe", "email_verified": true, "preferences": {"theme": "dark", "notifications": {"email": true, "sms": false}}, "login_history": [{"timestamp": "2023-01-15T10:00:00Z", "ip_address": "192.168.1.10"}, {"timestamp": "2023-01-20T12:30:00Z", "ip_address": "10.0.0.5"}]}`
    1.  **Thêm dữ liệu:** Thêm ít nhất 3 user profiles với các `profile_data` khác nhau, bao gồm cả mảng và object lồng nhau.
    2.  **Truy vấn cơ bản:**
        * Lấy `username` và `full_name` của tất cả user.
        * Tìm các user có `email_verified` là `true`.
        * Tìm các user có preference `theme` là `'dark'`.
    3.  **Truy vấn mảng:**
        * Tìm các user đã đăng nhập từ một `ip_address` cụ thể.
        * Lấy `username` và thời điểm đăng nhập cuối cùng của mỗi user.
    4.  **Cập nhật dữ liệu:**
        * Viết câu lệnh để cập nhật `theme` preference của một user thành `'light'`.
        * Thêm một entry mới vào `login_history` cho một user.
        * Xóa key `sms` notifications khỏi `preferences` của một user.
    5.  **Indexing và Tối ưu:**
        * Tạo GIN index trên cột `profile_data`.
        * Viết một truy vấn tìm user dựa trên một key trong `preferences` (ví dụ: `preferences -> notifications ->> 'email' = 'true'`) và xem `EXPLAIN ANALYZE` để kiểm tra việc sử dụng index.
        * Thảo luận khi nào nên tạo index trên một path cụ thể trong JSONB thay vì toàn bộ cột.

