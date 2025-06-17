# Chapter 3: Câu Lệnh SELECT Nâng Cao và Các Hàm Thông Dụng

* **Tên bài học:** Tối ưu truy vấn SELECT, làm quen với các hàm PostgreSQL và biểu thức điều kiện.
* **Tóm tắt lý thuyết:**
    * **`LIMIT` và `OFFSET`:**
        * `LIMIT count`: Giới hạn số dòng trả về.
        * `OFFSET start`: Bỏ qua `start` dòng đầu tiên.
        * Thường dùng cho phân trang. Ví dụ: `LIMIT 10 OFFSET 20` (lấy 10 dòng, bắt đầu từ dòng thứ 21).
        * PostgreSQL cũng hỗ trợ cú pháp SQL standard: `FETCH FIRST N ROWS ONLY` (tương đương `LIMIT N`) và `OFFSET M ROWS FETCH NEXT N ROWS ONLY`.
    * **`DISTINCT` và `DISTINCT ON (expression)`:**
        * `SELECT DISTINCT column1, column2 FROM table;`: Trả về các dòng duy nhất dựa trên tất cả các cột được chọn.
        * `SELECT DISTINCT ON (expression1 [, expression2 ...]) column_list FROM table ORDER BY expression1 [, expression2 ...], order_expression;`:
            * Đây là một tính năng mạnh mẽ của PostgreSQL, không có trong MySQL.
            * Giữ lại dòng *đầu tiên* cho mỗi nhóm các dòng có cùng giá trị cho các `expression` trong `DISTINCT ON`.
            * "Dòng đầu tiên" được xác định bởi mệnh đề `ORDER BY`. Mệnh đề `ORDER BY` phải bắt đầu bằng các biểu thức trong `DISTINCT ON`.
    * **Các hàm xử lý chuỗi phổ biến:**
        * `LENGTH(string)`: Độ dài chuỗi.
        * `LOWER(string)`, `UPPER(string)`: Chuyển thành chữ thường/hoa.
        * `INITCAP(string)`: Viết hoa ký tự đầu mỗi từ.
        * `SUBSTRING(string FROM start [FOR length])`: Trích xuất chuỗi con. Cũng có thể dùng `SUBSTRING(string, start, length)`.
        * `POSITION(substring IN string)` hoặc `STRPOS(string, substring)`: Tìm vị trí chuỗi con.
        * `REPLACE(string, from_substring, to_substring)`: Thay thế chuỗi.
        * `CONCAT(str1, str2, ...)` hoặc toán tử `||`: Nối chuỗi. `CONCAT_WS(separator, str1, str2, ...)` nối với dấu phân cách.
        * `TRIM([LEADING | TRAILING | BOTH] [characters] FROM string)`: Cắt bỏ ký tự (mặc định là khoảng trắng) ở đầu/cuối/cả hai.
        * `LPAD(string, length [, fill])`, `RPAD(string, length [, fill])`: Đệm chuỗi.
        * `SPLIT_PART(string, delimiter, field_number)`: Tách chuỗi theo dấu phân cách và lấy phần tử thứ `field_number`.
        * `REGEXP_REPLACE(string, pattern, replacement [, flags])`: Thay thế dựa trên biểu thức chính quy.
        * `REGEXP_MATCHES(string, pattern [, flags])`: Trả về các nhóm con khớp với biểu thức chính quy.
        * `FORMAT(format_string [, format_arg ...])`: Định dạng chuỗi theo kiểu `printf`.
    * **Các hàm xử lý số học:**
        * `ROUND(numeric_val [, precision])`: Làm tròn.
        * `CEIL(numeric_val)` hoặc `CEILING(numeric_val)`: Làm tròn lên.
        * `FLOOR(numeric_val)`: Làm tròn xuống.
        * `ABS(numeric_val)`: Giá trị tuyệt đối.
        * `MOD(dividend, divisor)` hoặc toán tử `%`: Phép chia lấy dư.
        * `POWER(base, exponent)` hoặc toán tử `^`: Lũy thừa.
        * `SQRT(numeric_val)`: Căn bậc hai.
        * `random()`: Trả về số thực ngẫu nhiên giữa 0 và 1.
        * `width_bucket(operand, low, high, count)`: Chia một khoảng thành các "bucket" và xác định bucket của operand.
    * **Các hàm xử lý ngày giờ:**
        * `NOW()`, `CURRENT_TIMESTAMP`: Thời gian hiện tại (có timezone, kiểu `TIMESTAMPTZ`).
        * `CURRENT_DATE`, `CURRENT_TIME`: Ngày/giờ hiện tại.
        * `LOCALTIMESTAMP`, `LOCALTIME`: Thời gian hiện tại (không có timezone).
        * `AGE(timestamp_end, timestamp_start)`: Tính khoảng thời gian giữa hai thời điểm.
        * `EXTRACT(field FROM source)`: Trích xuất một phần của ngày/giờ (ví dụ: `YEAR`, `MONTH`, `DAY`, `HOUR`, `MINUTE`, `SECOND`, `DOW` (day of week), `DOY` (day of year), `EPOCH` (giây từ 1970-01-01 UTC)).
        * `DATE_PART(field, source)`: Tương tự `EXTRACT`.
        * `DATE_TRUNC(field, source)`: Làm tròn ngày/giờ xuống đơn vị `field` (ví dụ: `DATE_TRUNC('month', some_timestamp)` sẽ trả về ngày đầu tiên của tháng đó).
        * `TO_CHAR(timestamp_val, format_string)`: Chuyển ngày/giờ thành chuỗi theo định dạng.
        * `TO_TIMESTAMP(string, format_string)`, `TO_DATE(string, format_string)`: Chuyển chuỗi thành ngày/giờ.
        * Cộng trừ ngày giờ: `date_col + INTERVAL '1 day'`, `timestamp_col - INTERVAL '2 hours'`.
        * `MAKE_INTERVAL(years, months, weeks, days, hours, mins, secs)`: Tạo giá trị interval.
        * `JUSTIFY_INTERVAL(interval)`: Chuẩn hóa interval (ví dụ, 30 ngày thành 1 tháng).
        * `AT TIME ZONE zone`: Chuyển đổi giá trị `TIMESTAMP WITHOUT TIME ZONE` sang `TIMESTAMPTZ` tại một múi giờ cụ thể, hoặc chuyển đổi `TIMESTAMPTZ` sang `TIMESTAMP WITHOUT TIME ZONE` hiển thị theo giờ địa phương của `zone`.
    * **Biểu thức `CASE`:**
        * `CASE WHEN condition1 THEN result1 WHEN condition2 THEN result2 ... ELSE result_else END` (Searched CASE).
        * `CASE expression WHEN value1 THEN result1 WHEN value2 THEN result2 ... ELSE result_else END` (Simple CASE).
        * Dùng cho logic điều kiện trong câu lệnh SQL.
    * **Hàm `COALESCE(value1, value2, ...)`:** Trả về biểu thức không NULL đầu tiên trong danh sách. Hữu ích để cung cấp giá trị mặc định cho các cột NULL.
    * **Hàm `NULLIF(value1, value2)`:** Trả về NULL nếu `value1` bằng `value2`, ngược lại trả về `value1`. Hữu ích để tránh lỗi chia cho zero (`NULLIF(divisor, 0)`).
    * **Hàm `GREATEST(...)` và `LEAST(...)`:** Trả về giá trị lớn nhất/nhỏ nhất trong danh sách các biểu thức.
    * **Hàm `generate_series(start, stop [, step])`:** Tạo ra một chuỗi các giá trị số hoặc timestamp. Rất hữu ích cho việc tạo dữ liệu mẫu hoặc các báo cáo theo chuỗi thời gian.
* **Code ví dụ (SQL):**
    ```sql
    -- DISTINCT ON: Lấy đơn hàng gần nhất của mỗi khách hàng
    CREATE TABLE Orders (order_id SERIAL PRIMARY KEY, customer_id INT, order_date TIMESTAMPTZ, total_amount NUMERIC);
    INSERT INTO Orders (customer_id, order_date, total_amount) VALUES
    (1, '2023-01-10 10:00:00 UTC', 100), (2, '2023-01-10 11:00:00 UTC', 150),
    (1, '2023-01-15 14:00:00 UTC', 200), (3, '2023-01-15 16:00:00 UTC', 50),
    (2, '2023-01-20 09:00:00 UTC', 120);

    SELECT DISTINCT ON (customer_id) customer_id, order_id, order_date, total_amount
    FROM Orders
    ORDER BY customer_id, order_date DESC;

    -- Hàm chuỗi: Định dạng tên người dùng
    SELECT
        ho_ten,
        UPPER(SUBSTRING(ho_ten FROM 1 FOR 1)) || LOWER(SUBSTRING(ho_ten FROM 2)) AS ten_viet_hoa_ky_tu_dau,
        SPLIT_PART(email, '@', 1) AS ten_dang_nhap_email,
        FORMAT('User: %s (Email: %s)', ho_ten, email) AS thong_tin_user
    FROM NhanVien LIMIT 2;

    -- Hàm ngày giờ: Tính số ngày làm việc và tháng hiện tại
    SELECT
        ho_ten,
        ngay_vao_lam,
        AGE(CURRENT_DATE, ngay_vao_lam) AS thoi_gian_lam_viec,
        EXTRACT(DOW FROM NOW()) AS thu_trong_tuan, -- 0=Chủ nhật, 6=Thứ bảy
        TO_CHAR(NOW(), 'Month YYYY') AS thang_nam_hien_tai,
        DATE_TRUNC('quarter', NOW())::DATE AS ngay_dau_quy
    FROM NhanVien WHERE ngay_vao_lam IS NOT NULL LIMIT 2;

    -- Chuyển đổi múi giờ
    SELECT NOW() AS current_utc_timestamptz,
           NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh' AS hcm_time,
           (NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh')::TIMESTAMP WITHOUT TIME ZONE AT TIME ZONE 'America/New_York' AS ny_time_from_hcm;


    -- CASE và COALESCE: Phân loại lương và hiển thị phòng ban
    SELECT
        ho_ten,
        luong,
        CASE
            WHEN luong < 10000000 THEN 'Thấp'
            WHEN luong >= 10000000 AND luong < 25000000 THEN 'Trung bình'
            WHEN luong >= 25000000 THEN 'Cao'
            ELSE 'Chưa có thông tin lương'
        END AS muc_luong_chi_tiet,
        COALESCE(phong_ban_id::TEXT, 'Chưa phân công phòng ban') AS thong_tin_phong_ban
    FROM NhanVien LIMIT 5;

    -- generate_series: Tạo danh sách các ngày trong tháng hiện tại
    SELECT day::DATE
    FROM generate_series(
        DATE_TRUNC('month', CURRENT_DATE),
        DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day',
        INTERVAL '1 day'
    ) AS day;
    ```
* **Bài tập ứng dụng:**
    Giả sử có bảng `Log TruyCapWeb` (log_id SERIAL, ip_address VARCHAR, thoi_gian_ truy_cap TIMESTAMPTZ, url_path TEXT, http_status_code INT, user_agent TEXT).
    1.  **Phân trang log:** Viết câu lệnh lấy 20 log truy cập gần đây nhất, bỏ qua 10 log đầu tiên (tức là lấy log từ 11 đến 30).
    2.  **Truy cập cuối cùng:** Sử dụng `DISTINCT ON`, tìm lần truy cập cuối cùng (gần nhất) cho mỗi `ip_address`.
    3.  **Trích xuất thông tin:**
        * Lấy `url_path` và trích xuất phần domain chính từ URL (ví dụ, từ `/products/123?source=email` lấy `products`). (Gợi ý: dùng `SPLIT_PART` hoặc regex).
        * Hiển thị `user_agent` và phân loại thành 'Mobile', 'Desktop', 'Bot' dựa vào các từ khóa phổ biến trong `user_agent` (ví dụ: 'Mobi', 'Android', 'iPhone' là Mobile; 'Googlebot', 'Bingbot' là Bot; còn lại là Desktop). Dùng `CASE`.
    4.  **Thống kê theo giờ:**
        * Đếm số lượng truy cập theo từng giờ trong ngày (0-23h) cho một ngày cụ thể. (Gợi ý: `EXTRACT(HOUR FROM ...)` và `GROUP BY`).
        * Sử dụng `generate_series` để đảm bảo tất cả các giờ trong ngày đều xuất hiện trong kết quả, kể cả khi không có log nào trong giờ đó (điền 0).
    5.  **Định dạng output:** Hiển thị `thoi_gian_truy_cap` dưới dạng `Thứ X, ngày DD tháng MM năm YYYY, HH:MI:SS` (ví dụ: `Thứ Hai, ngày 28 tháng 05 năm 2024, 15:30:00`). Nếu `http_status_code` là 404, hiển thị thông báo 'Không tìm thấy trang', nếu là 200, hiển thị 'Thành công', các trường hợp khác hiển thị mã lỗi. Sử dụng `COALESCE` để xử lý `user_agent` bị NULL, hiển thị là 'Không rõ'.

