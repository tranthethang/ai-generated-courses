# Chapter 2: Kiểu Dữ Liệu Đặc Trưng và Cấu Trúc Bảng trong PostgreSQL

* **Tên bài học:** Khám phá hệ thống kiểu dữ liệu phong phú và thiết kế cấu trúc bảng hiệu quả trong PostgreSQL.
* **Tóm tắt lý thuyết:**
    * **So sánh kiểu dữ liệu giữa MySQL và PostgreSQL (chi tiết hơn):**
        * **Số nguyên:**
            * PostgreSQL: `SMALLINT` (2 bytes), `INTEGER` (4 bytes), `BIGINT` (8 bytes). `SERIAL`, `SMALLSERIAL`, `BIGSERIAL` là các kiểu tự tăng, thực chất là `INTEGER` hoặc `BIGINT` với giá trị mặc định lấy từ một sequence.
            * MySQL: `TINYINT`, `SMALLINT`, `MEDIUMINT`, `INT`, `BIGINT`. `AUTO_INCREMENT` là thuộc tính của cột.
            * Khác biệt `SERIAL` vs `AUTO_INCREMENT`: `SERIAL` trong PostgreSQL tạo ra một đối tượng `SEQUENCE` riêng biệt, có thể được quản lý và sử dụng độc lập. `AUTO_INCREMENT` của MySQL gắn liền với bảng. Việc lấy giá trị cuối cùng được chèn cũng khác nhau (`LASTVAL()` hoặc `CURRVAL('sequence_name')` trong PostgreSQL so với `LAST_INSERT_ID()` trong MySQL).
        * **Số thực:**
            * PostgreSQL: `REAL` (4 bytes, độ chính xác động), `DOUBLE PRECISION` (8 bytes, độ chính xác động). `NUMERIC(precision, scale)` hoặc `DECIMAL(precision, scale)` (độ chính xác cố định, dùng cho tiền tệ).
            * MySQL: `FLOAT`, `DOUBLE`, `DECIMAL`. Tương tự PostgreSQL.
        * **Chuỗi:**
            * PostgreSQL: `VARCHAR(n)` (giới hạn độ dài), `CHAR(n)` (cố định độ dài, đệm khoảng trắng), `TEXT` (không giới hạn độ dài thực tế, hiệu quả cho chuỗi dài).
            * MySQL: `VARCHAR(n)`, `CHAR(n)`, `TINYTEXT`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`. MySQL `TEXT` có giới hạn cụ thể cho từng loại. PostgreSQL `TEXT` linh hoạt hơn.
        * **Ngày giờ:**
            * PostgreSQL: `DATE` (chỉ ngày), `TIME [WITHOUT TIME ZONE]` (chỉ giờ), `TIME WITH TIME ZONE` (`TIMETZ`), `TIMESTAMP [WITHOUT TIME ZONE]`, `TIMESTAMP WITH TIME ZONE` (`TIMESTAMPTZ`), `INTERVAL` (khoảng thời gian).
            * `TIMESTAMPTZ` là điểm cực kỳ quan trọng: PostgreSQL lưu trữ `TIMESTAMPTZ` dưới dạng UTC và tự động chuyển đổi sang múi giờ của client khi truy vấn (dựa trên thiết lập `timezone` của session). Điều này giúp quản lý dữ liệu thời gian toàn cầu dễ dàng hơn nhiều so với `TIMESTAMP` của MySQL (thường lưu UTC và client tự xử lý hoặc có hành vi phụ thuộc vào `@@session.time_zone`).
            * MySQL: `DATE`, `TIME`, `DATETIME`, `TIMESTAMP`, `YEAR`. `TIMESTAMP` của MySQL có hành vi đặc biệt liên quan đến múi giờ và phiên bản.
        * **Boolean:**
            * PostgreSQL: `BOOLEAN` (true, false, null). Chấp nhận các giá trị như `TRUE`, `FALSE`, `'t'`, `'f'`, `'true'`, `'false'`, `'y'`, `'n'`, `'yes'`, `'no'`, `1`, `0`.
            * MySQL: `BOOL` hoặc `BOOLEAN` là alias của `TINYINT(1)`.
    * **Kiểu dữ liệu đặc trưng của PostgreSQL:**
        * **`ARRAY`:**
            * Cho phép một cột lưu trữ mảng các giá trị cùng kiểu. Ví dụ: `INTEGER[]`, `TEXT[]`.
            * Mảng một chiều hoặc đa chiều.
            * Cú pháp khai báo: `data_type[]` hoặc `ARRAY[data_type]`.
            * Nhập liệu: `ARRAY['apple', 'banana']`, `'{apple,banana}'::TEXT[]`.
            * Toán tử và hàm: `ANY()`, `ALL()`, toán tử chứa `@>`, `<@`, `&&` (giao nhau), `array_append()`, `array_prepend()`, `array_remove()`, `array_cat()`, `unnest()` (mở rộng mảng thành các dòng).
        * **`JSON` / `JSONB`:**
            * `JSON`: Lưu trữ bản sao chính xác của văn bản JSON đầu vào (bao gồm khoảng trắng, thứ tự key, key trùng lặp). Truy vấn chậm hơn.
            * `JSONB` (JSON Binary): Lưu trữ ở định dạng nhị phân đã được phân tích cú pháp, tối ưu hóa. Loại bỏ khoảng trắng không cần thiết, key trùng lặp cuối cùng được giữ, thứ tự key không được đảm bảo. Truy vấn và indexing hiệu quả hơn nhiều. **Thường ưu tiên sử dụng `JSONB`**.
            * Các toán tử và hàm sẽ được học kỹ ở Chapter sau.
        * **`UUID`:**
            * Kiểu định danh duy nhất toàn cầu (Universally Unique Identifier). Dài 128-bit.
            * Ưu điểm: Hữu ích trong các hệ thống phân tán, tránh xung đột ID khi merge dữ liệu từ nhiều nguồn.
            * Tạo giá trị: Cần extension `uuid-ossp` (hàm `uuid_generate_v1()`, `uuid_generate_v4()`) hoặc `gen_random_uuid()` (từ PostgreSQL 13+).
        * **`ENUM` (Enumerated Types):**
            * Kiểu dữ liệu tự định nghĩa bao gồm một danh sách tĩnh, có thứ tự các nhãn chuỗi.
            * Cú pháp: `CREATE TYPE mood AS ENUM ('sad', 'ok', 'happy');`
            * Ưu điểm: Đảm bảo tính nhất quán dữ liệu, tiết kiệm không gian so với `VARCHAR`.
            * Thao tác: `ALTER TYPE mood ADD VALUE 'ecstatic' AFTER 'happy';` (Thêm giá trị mới).
        * **Các kiểu khác:** `CIDR`, `INET` (địa chỉ mạng), `MACADDR` (địa chỉ MAC), các kiểu hình học (`POINT`, `LINE`, `LSEG`, `BOX`, `PATH`, `POLYGON`, `CIRCLE`).
    * **Ràng buộc (Constraints):**
        * `PRIMARY KEY`: Duy nhất, không NULL.
        * `FOREIGN KEY`: Tham chiếu đến `PRIMARY KEY` hoặc `UNIQUE` của bảng khác. Các hành động `ON DELETE` / `ON UPDATE` (`NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL`, `SET DEFAULT`).
        * `UNIQUE`: Đảm bảo tất cả giá trị trong cột (hoặc nhóm cột) là duy nhất (cho phép nhiều NULL).
        * `CHECK (condition)`: Đảm bảo giá trị thỏa mãn một điều kiện logic.
        * `NOT NULL`: Cột không được phép chứa giá trị NULL.
        * **`DEFERRABLE` Constraints:** PostgreSQL cho phép trì hoãn việc kiểm tra ràng buộc đến cuối transaction.
            * `INITIALLY IMMEDIATE` (mặc định): Kiểm tra ngay khi câu lệnh thực thi.
            * `INITIALLY DEFERRED`: Chỉ kiểm tra khi `COMMIT` transaction (hoặc khi `SET CONSTRAINTS ... IMMEDIATE`).
            * Hữu ích cho các trường hợp cần chèn dữ liệu theo thứ tự cụ thể mà tạm thời vi phạm ràng buộc.
    * **Sequence và cách hoạt động của `SERIAL`:**
        * `SEQUENCE` là một đối tượng đặc biệt tạo ra các số nguyên theo thứ tự.
        * `CREATE SEQUENCE my_sequence START 101 INCREMENT 1;`
        * Hàm: `nextval('my_sequence')`, `currval('my_sequence')`, `lastval()`, `setval('my_sequence', new_value)`.
        * Kiểu `SERIAL` tự động tạo một sequence và đặt giá trị mặc định của cột là `nextval()` từ sequence đó. Tên sequence thường là `<table_name>_<column_name>_seq`.
* **Code ví dụ (SQL):**
    ```sql
    -- Tạo bảng với các kiểu dữ liệu PostgreSQL đa dạng
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- Cần cho uuid_generate_v4() nếu dùng PG < 13

    CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

    CREATE TABLE Projects (
        project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        project_name VARCHAR(255) NOT NULL UNIQUE,
        start_date DATE,
        end_date DATE,
        budget NUMERIC(12, 2) CHECK (budget > 0),
        CONSTRAINT check_dates CHECK (end_date IS NULL OR start_date <= end_date)
    );

    CREATE TABLE Tasks (
        task_id SERIAL PRIMARY KEY,
        project_id UUID REFERENCES Projects(project_id) ON DELETE CASCADE,
        task_name VARCHAR(200) NOT NULL,
        assignees TEXT[], -- Mảng tên người thực hiện
        details JSONB, -- Chi tiết công việc dạng JSON
        status task_status DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        priority INTEGER DEFAULT 0
    );

    -- Thêm dữ liệu ví dụ
    INSERT INTO Projects (project_name, start_date, budget) VALUES
    ('New Website Launch', '2024-06-01', 50000.00);

    INSERT INTO Tasks (project_id, task_name, assignees, details, status)
    SELECT
        p.project_id,
        'Design Homepage',
        ARRAY['Alice', 'Bob'],
        '{"description": "Create a modern homepage design", "estimated_hours": 20}',
        'in_progress'
    FROM Projects p WHERE p.project_name = 'New Website Launch';

    INSERT INTO Tasks (project_id, task_name, assignees, details)
    SELECT
        p.project_id,
        'Develop API',
        ARRAY['Charlie'],
        '{"endpoints": ["/users", "/products"], "auth_required": true}'
    FROM Projects p WHERE p.project_name = 'New Website Launch';

    -- Truy vấn dữ liệu ARRAY
    SELECT task_name, assignees FROM Tasks WHERE 'Alice' = ANY(assignees);

    -- Truy vấn dữ liệu JSONB (sẽ học kỹ hơn)
    SELECT task_name, details ->> 'description' AS task_description
    FROM Tasks
    WHERE details ->> 'estimated_hours' = '20'; -- Lưu ý: giá trị trong JSONB là text

    -- Sử dụng sequence trực tiếp
    CREATE SEQUENCE global_event_id_seq START 1000;
    CREATE TABLE GlobalEvents (
        event_id INTEGER PRIMARY KEY DEFAULT nextval('global_event_id_seq'),
        event_name VARCHAR(100),
        event_time TIMESTAMPTZ
    );
    INSERT INTO GlobalEvents (event_name, event_time) VALUES ('System Maintenance', NOW());
    SELECT currval('global_event_id_seq');
    ```
* **Bài tập ứng dụng:**
    1.  **Thiết kế bảng `Courses` và `Enrollments`:**
        * Bảng `Courses`:
            * `course_id` (UUID, khóa chính, tự sinh).
            * `course_name` (VARCHAR(150), không null, duy nhất).
            * `description` (TEXT).
            * `credits` (SMALLINT, check > 0).
            * `instructor_names` (Mảng TEXT, chứa tên các giảng viên).
            * `syllabus_details` (JSONB, chứa thông tin như `{"topics": ["topic1", "topic2"], "textbook": "Book Name"}`).
            * `start_timestamp` (TIMESTAMPTZ).
        * Tạo kiểu `ENUM` tên `enrollment_grade` với các giá trị: `A`, `B`, `C`, `D`, `F`, `In Progress`.
        * Bảng `Enrollments`:
            * `enrollment_id` (SERIAL, khóa chính).
            * `course_id` (UUID, khóa ngoại tham chiếu đến `Courses`, xóa cascade).
            * `student_id` (INTEGER, giả sử có bảng Students).
            * `enrollment_date` (DATE, mặc định ngày hiện tại).
            * `grade` (sử dụng ENUM `enrollment_grade`, mặc định `In Progress`).
    2.  **Thêm dữ liệu:** Thêm ít nhất 2 khóa học vào bảng `Courses` và 3 lượt đăng ký vào bảng `Enrollments` với dữ liệu đa dạng cho các cột mảng và JSONB.
    3.  **Truy vấn `ARRAY`:** Viết câu lệnh tìm các khóa học được dạy bởi một giảng viên cụ thể (ví dụ: 'Prof. Smith').
    4.  **Truy vấn `JSONB`:** Viết câu lệnh tìm các khóa học có chủ đề (topic) là 'Database Systems' trong `syllabus_details`.
    5.  **Thao tác với `ENUM`:**
        * Thử thêm một giá trị mới vào `enrollment_grade` (ví dụ: `Withdrawn`).
        * Cập nhật một lượt đăng ký để sử dụng giá trị `ENUM` mới này.
    6.  **Sequence:** Tạo một sequence tên `student_registration_number_seq` bắt đầu từ 10000. Thiết kế một bảng `Students` đơn giản với cột `registration_number` sử dụng sequence này làm giá trị mặc định.
