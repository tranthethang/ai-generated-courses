### Chapter 12: Extensions, Full-Text Search và Các Tính Năng Nâng Cao Khác

* **Tên bài học:** Mở rộng khả năng của PostgreSQL với Extensions, tìm kiếm văn bản mạnh mẽ, và khám phá các tính năng nâng cao khác.
* **Tóm tắt lý thuyết:**
    * **Extensions (Tiện ích mở rộng):**
        * Là các module phần mềm có thể được tải vào PostgreSQL server đang chạy để cung cấp thêm chức năng, kiểu dữ liệu, toán tử, hàm, phương thức index, ngôn ngữ thủ tục...
        * PostgreSQL có một hệ sinh thái extension phong phú.
        * Lệnh quản lý:
            * `CREATE EXTENSION extension_name [IF NOT EXISTS] [SCHEMA schema_name] [VERSION version_number];`
            * `DROP EXTENSION extension_name [IF EXISTS] [CASCADE | RESTRICT];`
            * `ALTER EXTENSION extension_name UPDATE [TO new_version];`
            * `\dx` trong `psql` để liệt kê các extension đã cài đặt.
        * **Một số extension phổ biến:**
            * `uuid-ossp`: Cung cấp các hàm tạo UUID (ví dụ: `uuid_generate_v1()`, `uuid_generate_v4()`).
            * `pgcrypto`: Các hàm mã hóa (hashing, PGP encryption). Ví dụ: `crypt()`, `digest()`, `pgp_sym_encrypt()`.
            * `hstore`: Kiểu dữ liệu key-value đơn giản (ít dùng hơn JSONB hiện nay nhưng vẫn hữu ích trong một số trường hợp).
            * `pg_trgm` (Trigram Matching): Hỗ trợ tìm kiếm mờ (fuzzy string matching) dựa trên so khớp trigram. Cung cấp toán tử `%` (similarity) và `<->` (distance), hỗ trợ index GIN/GiST.
            * `PostGIS`: Extension mạnh mẽ nhất cho dữ liệu không gian địa lý (GIS), cung cấp kiểu dữ liệu hình học, hàm và toán tử không gian, hỗ trợ index R-Tree qua GiST.
            * `tablefunc`: Cung cấp các hàm tạo bảng pivot (ví dụ: `crosstab`).
            * `btree_gin`, `btree_gist`: Cho phép tạo index GIN/GiST trên các kiểu dữ liệu B-tree chuẩn, hữu ích khi muốn kết hợp nhiều loại index.
            * `postgres_fdw`: Một Foreign Data Wrapper cho phép truy cập dữ liệu từ các server PostgreSQL khác.
    * **Full-Text Search (FTS):**
        * Khả năng tìm kiếm văn bản tự nhiên, có xếp hạng mức độ liên quan (relevancy) của kết quả.
        * **Các thành phần chính:**
            * **`tsvector`**: Kiểu dữ liệu biểu diễn một tài liệu (document) đã được xử lý cho FTS. Nó là một danh sách các *lexemes* (từ đã được chuẩn hóa, ví dụ: stemming) cùng với vị trí của chúng.
            * **`tsquery`**: Kiểu dữ liệu biểu diễn một câu truy vấn tìm kiếm, bao gồm các lexemes và các toán tử logic (`&` AND, `|` OR, `!` NOT, `<->` PHRASE).
            * **Hàm chuyển đổi:**
                * `to_tsvector([config regconfig,] document text)`: Chuyển text thành `tsvector`. `config` (tùy chọn) chỉ định cấu hình ngôn ngữ (ví dụ: `'english'`, `'simple'`, `'vietnamese'` nếu có). Cấu hình này quyết định cách parser tách từ, loại bỏ stop words, và stemming.
                * `to_tsquery([config regconfig,] querytext text)`: Chuyển text thành `tsquery`.
                * `plainto_tsquery([config regconfig,] querytext text)`: Tương tự `to_tsquery` nhưng coi tất cả các từ trong `querytext` là AND với nhau.
                * `phraseto_tsquery([config regconfig,] querytext text)`: Tìm kiếm cụm từ chính xác.
                * `websearch_to_tsquery([config regconfig,] querytext text)`: Chuyển đổi query theo kiểu Google search.
            * **Toán tử khớp (`@@`):** `tsvector_column @@ tsquery_value` -> trả về TRUE nếu vector khớp với query.
            * **Ranking (Xếp hạng):**
                * `ts_rank(tsvector, tsquery [, normalization_option])`: Tính điểm relevancy dựa trên tần suất xuất hiện của từ.
                * `ts_rank_cd(tsvector, tsquery [, normalization_option])`: Tương tự `ts_rank` nhưng xem xét cả mật độ (cover density).
            * **Highlighting:** `ts_headline([config regconfig,] document text, query tsquery [, options])`: Hiển thị một đoạn trích từ tài liệu với các từ khóa khớp được làm nổi bật.
            * **Indexing FTS:** Sử dụng GIN hoặc GiST index trên cột `tsvector` để tăng tốc độ tìm kiếm. GIN thường nhanh hơn cho FTS.
    * **Foreign Data Wrappers (FDW):**
        * Cho phép PostgreSQL truy cập dữ liệu từ các nguồn dữ liệu bên ngoài (gọi là "foreign servers") như thể chúng là các bảng cục bộ trong PostgreSQL.
        * Các bước thiết lập:
            1.  `CREATE EXTENSION fdw_name;` (ví dụ: `postgres_fdw`, `mysql_fdw`, `file_fdw`).
            2.  `CREATE SERVER foreign_server_name FOREIGN DATA WRAPPER fdw_name OPTIONS (host '...', port '...', dbname '...');`
            3.  `CREATE USER MAPPING FOR local_user SERVER foreign_server_name OPTIONS (user 'remote_user', password 'remote_pass');`
            4.  `CREATE FOREIGN TABLE local_table_name (...) SERVER foreign_server_name OPTIONS (schema_name 'remote_schema', table_name 'remote_table');`
            Hoặc `IMPORT FOREIGN SCHEMA remote_schema [LIMIT TO (table1, table2)] FROM SERVER foreign_server_name INTO local_schema;`
        * Sau đó có thể truy vấn `local_table_name` như bảng bình thường.
    * **Materialized Views:**
        * Lưu trữ kết quả vật lý của một câu truy vấn. Khác với view thông thường (là truy vấn ảo, chạy lại mỗi khi gọi), materialized view lưu dữ liệu thực tế.
        * Hữu ích cho các truy vấn phức tạp, tốn thời gian chạy, mà dữ liệu nguồn không thay đổi quá thường xuyên.
        * `CREATE MATERIALIZED VIEW view_name AS SELECT ...;`
        * `REFRESH MATERIALIZED VIEW view_name;` (Để cập nhật dữ liệu. Có thể `CONCURRENTLY` để không block truy vấn đọc).
        * Có thể tạo index trên materialized view.
    * **Các tính năng khác (Sơ lược):**
        * **Table Partitioning:** Chia một bảng lớn thành các bảng con (partitions) nhỏ hơn dựa trên một key (ví dụ: theo dải ngày, theo danh sách giá trị). Cải thiện hiệu năng quản lý và truy vấn.
        * **Row Level Security (RLS):** Định nghĩa các policy để kiểm soát những dòng nào user có thể xem hoặc sửa đổi trong một bảng.
        * **Parallel Query:** PostgreSQL có thể tự động song song hóa một số phần của truy vấn phức tạp để tận dụng nhiều CPU core.
* **Code ví dụ (SQL):**
    ```sql
    -- Sử dụng Extension uuid-ossp (nếu chưa có từ Chapter trước)
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    SELECT uuid_generate_v4();

    -- Sử dụng Extension pg_trgm cho tìm kiếm mờ
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    SELECT similarity('PostgreSQL', 'Postgres'); -- Độ tương đồng
    -- CREATE INDEX idx_product_name_trgm ON Products USING GIN (product_name gin_trgm_ops);
    -- SELECT product_name FROM Products WHERE product_name % 'Laptap Pro'; -- Tìm kiếm mờ

    -- Full-Text Search cơ bản
    -- Giả sử bảng Articles (id SERIAL, title TEXT, body TEXT, body_tsvector TSVECTOR)
    /*
    ALTER TABLE Articles ADD COLUMN body_tsvector TSVECTOR;
    CREATE OR REPLACE FUNCTION update_articles_tsvector() RETURNS TRIGGER AS $$
    BEGIN
        NEW.body_tsvector = to_tsvector('pg_catalog.english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.body, ''));
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    CREATE TRIGGER trg_articles_tsvector_update
    BEFORE INSERT OR UPDATE ON Articles
    FOR EACH ROW EXECUTE FUNCTION update_articles_tsvector();
    CREATE INDEX idx_articles_fts ON Articles USING GIN(body_tsvector);
    */

    -- INSERT INTO Articles (title, body) VALUES ('PostgreSQL Performance Tips', 'Indexing and query optimization are key for PostgreSQL performance.');
    -- INSERT INTO Articles (title, body) VALUES ('Learning SQL Basics', 'SQL is a powerful language for databases.');

    SELECT title, body
    FROM Articles
    WHERE body_tsvector @@ plainto_tsquery('english', 'performance optimization');

    SELECT title, ts_rank_cd(body_tsvector, query) AS rank,
           ts_headline('english', body, query, 'StartSel = <mark>, StopSel = </mark>') AS highlighted_body
    FROM Articles, plainto_tsquery('english', 'PostgreSQL performance') query
    WHERE query @@ body_tsvector
    ORDER BY rank DESC;

    -- Materialized View: Tổng hợp số lượng sản phẩm theo brand
    CREATE MATERIALIZED VIEW ProductCountByBrand AS
    SELECT product_attributes ->> 'brand' AS brand, COUNT(*) as num_products
    FROM Products
    WHERE product_attributes ? 'brand'
    GROUP BY product_attributes ->> 'brand';

    SELECT * FROM ProductCountByBrand ORDER BY num_products DESC;
    -- Sau khi dữ liệu Products thay đổi:
    REFRESH MATERIALIZED VIEW CONCURRENTLY ProductCountByBrand; -- Cần UNIQUE index trên MV để chạy CONCURRENTLY

    -- Foreign Data Wrapper (ví dụ với file_fdw - truy cập file CSV)
    /*
    CREATE EXTENSION IF NOT EXISTS file_fdw;
    CREATE SERVER csv_server FOREIGN DATA WRAPPER file_fdw;
    CREATE FOREIGN TABLE my_csv_data (
        col1 TEXT,
        col2 INT,
        col3 DATE
    ) SERVER csv_server OPTIONS (filename '/path/to/your/data.csv', format 'csv', header 'true');
    SELECT * FROM my_csv_data;
    */
    ```
* **Bài tập ứng dụng:**
    1.  **`pgcrypto` và Mật khẩu:**
        * Cài đặt extension `pgcrypto`.
        * Tạo bảng `AppUsers` (username TEXT PRIMARY KEY, password_hash TEXT).
        * Viết một function PL/pgSQL `register_user(p_username TEXT, p_password TEXT)` sử dụng `crypt(p_password, gen_salt('bf'))` để hash mật khẩu và lưu vào bảng.
        * Viết một function `check_user_password(p_username TEXT, p_password TEXT)` trả về `BOOLEAN` bằng cách so sánh `crypt(p_password, password_hash)` với `password_hash` đã lưu.
    2.  **Full-Text Search cho Blog:**
        * Tạo bảng `BlogPosts` (post_id SERIAL, title TEXT, content TEXT, published_date DATE, tags TEXT[]).
        * Thêm cột `content_tsvector TSVECTOR`.
        * Tạo trigger để tự động cập nhật `content_tsvector` từ `title` và `content` mỗi khi có `INSERT` hoặc `UPDATE`. Sử dụng cấu hình `'english'`.
        * Tạo GIN index trên `content_tsvector`.
        * Viết các truy vấn:
            * Tìm các bài blog chứa từ "database" VÀ "performance".
            * Tìm các bài blog chứa cụm từ "best practices".
            * Hiển thị kết quả tìm kiếm có xếp hạng và highlight.
    3.  **`pg_trgm` cho Tìm kiếm Tên Sản phẩm Gần đúng:**
        * Sử dụng bảng `Products` từ các Chapter trước. Cài đặt `pg_trgm`.
        * Tạo GIN index sử dụng `gin_trgm_ops` trên cột `product_name`.
        * Viết truy vấn tìm các sản phẩm có tên gần giống với "Smatphone Lite X" (ví dụ, người dùng gõ sai). Hiển thị độ tương đồng.
    4.  **Materialized View cho Báo cáo:**
        * Tạo một Materialized View tên `MonthlySalesSummary` từ bảng `Sales` (từ bài tập Chapter 7) để tính tổng số lượng bán (`total_quantity_sold`) và tổng doanh thu (`total_revenue`) cho mỗi tháng (`sale_month` được `DATE_TRUNC` về tháng).
        * Tạo index trên `sale_month` của Materialized View.
        * Viết lệnh để làm mới Materialized View. Thảo luận khi nào nên làm mới (ví dụ: cuối ngày, theo cron job).
    5.  **(Nâng cao/Tự nghiên cứu) `tablefunc` với `crosstab`:**
        * Cài đặt extension `tablefunc`.
        * Giả sử có bảng `QuarterlySales` (product_name TEXT, quarter TEXT, sales_amount NUMERIC) (ví dụ: quarter là 'Q1 2023', 'Q2 2023',...).
        * Sử dụng hàm `crosstab` để tạo một báo cáo pivot table hiển thị `product_name` làm dòng, mỗi quý làm một cột, và `sales_amount` là giá trị. (Đây là bài tập khó, cần đọc kỹ tài liệu `crosstab`).
