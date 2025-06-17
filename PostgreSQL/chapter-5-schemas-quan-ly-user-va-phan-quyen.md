# Chapter 5: Schemas, Quản Lý User và Phân Quyền

* **Tên bài học:** Tổ chức và bảo mật cơ sở dữ liệu hiệu quả với Schemas, Roles và cơ chế phân quyền chi tiết.
* **Tóm tắt lý thuyết:**
    * **Khái niệm Schema trong PostgreSQL:**
        * Schema là một không gian tên (namespace) bên trong một database. Nó chứa các đối tượng CSDL như bảng, view, index, sequence, function, operator.
        * Mỗi database khi được tạo sẽ có một schema mặc định là `public`.
        * **Lợi ích của việc sử dụng schema:**
            * **Tổ chức CSDL logic:** Nhóm các đối tượng liên quan với nhau (ví dụ: schema `sales`, `hr`, `inventory`).
            * **Tránh xung đột tên:** Các đối tượng cùng tên có thể tồn tại ở các schema khác nhau.
            * **Quản lý quyền truy cập chi tiết:** Quyền có thể được gán trên từng schema.
            * **Hỗ trợ multi-tenancy:** Mỗi tenant (khách hàng) có thể có schema riêng trong cùng một database.
        * Cú pháp:
            * `CREATE SCHEMA schema_name;`
            * `CREATE SCHEMA IF NOT EXISTS schema_name;`
            * `CREATE SCHEMA schema_name AUTHORIZATION role_name;` (Tạo schema và gán chủ sở hữu).
            * `DROP SCHEMA schema_name [CASCADE | RESTRICT];` (`CASCADE` xóa cả các đối tượng bên trong, `RESTRICT` (mặc định) chỉ xóa nếu schema rỗng).
        * Truy cập đối tượng trong schema: `schema_name.object_name`.
    * **`search_path`:**
        * Biến môi trường của session, xác định thứ tự các schema được tìm kiếm khi một đối tượng được tham chiếu mà không có tên schema rõ ràng.
        * `SHOW search_path;` (Mặc định thường là `"$user", public`). `$user` nghĩa là tìm schema có tên trùng với user hiện tại trước.
        * `SET search_path TO schema1, schema2, public;` (Thiết lập cho session hiện tại).
        * `SET LOCAL search_path TO ...;` (Thiết lập chỉ cho transaction hiện tại).
        * Quan trọng cho việc bảo mật và tránh nhầm lẫn: nếu `search_path` không được quản lý cẩn thận, user có thể vô tình thực thi code từ schema không mong muốn.
    * **Quản lý User và Roles:**
        * Trong PostgreSQL, user và group đều là "roles". Một role là một thực thể có thể sở hữu đối tượng CSDL và có các quyền truy cập.
        * **Thuộc tính của Role:**
            * `LOGIN`: Cho phép role đăng nhập. Role có thuộc tính này thường được gọi là "user".
            * `NOLOGIN`: Không cho phép đăng nhập. Role có thuộc tính này thường được dùng làm "group".
            * `SUPERUSER`: Có tất cả các quyền, bỏ qua mọi kiểm tra quyền. Rất nguy hiểm, chỉ dùng cho quản trị viên cấp cao nhất.
            * `CREATEDB`: Cho phép tạo database mới.
            * `CREATEROLE`: Cho phép tạo, sửa, xóa các role khác (không phải superuser).
            * `PASSWORD 'secret'` / `PASSWORD NULL`: Đặt mật khẩu.
            * `ENCRYPTED PASSWORD 'md5...'`: Đặt mật khẩu đã mã hóa (ít dùng trực tiếp).
            * `VALID UNTIL 'timestamp'`: Mật khẩu hết hạn.
            * `IN ROLE role1, role2, ...`: Kế thừa quyền từ các role được liệt kê (role này là thành viên của các role kia).
            * `ROLE role_member1, role_member2, ...`: Các role khác là thành viên của role này.
            * `CONNECTION LIMIT count`: Giới hạn số kết nối đồng thời.
            * `BYPASSRLS`: Bỏ qua Row Level Security policies (sẽ học sau).
        * Cú pháp:
            * `CREATE ROLE role_name [WITH option ...];`
            * `ALTER ROLE role_name [WITH option ...];`
            * `DROP ROLE role_name;`
    * **Phân quyền (Privileges):**
        * `GRANT privilege_type [, ...] ON object_type object_name [, ...] TO role_specification [, ...] [WITH GRANT OPTION];`
            * `privilege_type`: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES` (cho foreign key), `TRIGGER` (cho bảng); `USAGE` (cho schema, sequence, type, domain); `EXECUTE` (cho function, procedure); `CREATE` (cho database, schema, tablespace); `CONNECT` (cho database); `TEMPORARY` (cho database để tạo bảng tạm).
            * `object_type`: `TABLE`, `SCHEMA`, `DATABASE`, `SEQUENCE`, `FUNCTION`, `PROCEDURE`, `LANGUAGE`, `FOREIGN DATA WRAPPER`, `FOREIGN SERVER`, `TABLESPACE`, `TYPE`, `DOMAIN`, `LARGE OBJECT`.
            * `role_specification`: Tên role, `PUBLIC` (tất cả các role), `CURRENT_USER`, `SESSION_USER`.
            * `WITH GRANT OPTION`: Cho phép role được cấp quyền này tiếp tục cấp quyền đó cho role khác.
        * `REVOKE [GRANT OPTION FOR] privilege_type [, ...] ON object_type object_name [, ...] FROM role_specification [, ...] [CASCADE | RESTRICT];`
            * `GRANT OPTION FOR`: Chỉ thu hồi `WITH GRANT OPTION`.
            * `CASCADE`: Thu hồi cả các quyền phụ thuộc (ví dụ, nếu A cấp cho B, B cấp cho C, thu hồi từ B với CASCADE sẽ thu hồi cả từ C).
            * `RESTRICT` (mặc định): Chỉ thu hồi nếu không có quyền phụ thuộc.
        * **Quyền mặc định (Default Privileges):**
            * `ALTER DEFAULT PRIVILEGES [FOR ROLE target_role] [IN SCHEMA schema_name] GRANT ... ON TABLES TO ...;`
            * Cho phép định nghĩa các quyền sẽ tự động được gán cho các đối tượng mới được tạo trong tương lai bởi một role cụ thể hoặc trong một schema cụ thể. Rất hữu ích để quản lý quyền cho các ứng dụng.
* **Code ví dụ (SQL):**
    ```sql
    -- Tạo schema cho các bộ phận
    CREATE SCHEMA IF NOT EXISTS human_resources;
    CREATE SCHEMA IF NOT EXISTS finance;
    CREATE SCHEMA IF NOT EXISTS sales;

    -- Tạo bảng trong schema cụ thể
    CREATE TABLE human_resources.Employees (
        employee_id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        hire_date DATE,
        department VARCHAR(50)
    );
    CREATE TABLE finance.Transactions (
        transaction_id SERIAL PRIMARY KEY,
        description TEXT,
        amount NUMERIC(10,2),
        transaction_date TIMESTAMPTZ DEFAULT NOW()
    );

    -- Thiết lập search_path cho session
    SET search_path TO human_resources, finance, sales, public;
    -- Bây giờ có thể gọi Employees thay vì human_resources.Employees

    -- Tạo roles
    CREATE ROLE hr_manager LOGIN PASSWORD 'hrpass1' CREATEROLE; -- Có thể tạo role khác
    CREATE ROLE finance_analyst LOGIN PASSWORD 'finpass1';
    CREATE ROLE sales_team NOLOGIN; -- Role group
    CREATE ROLE sales_rep1 LOGIN PASSWORD 'salespass1' IN ROLE sales_team;
    CREATE ROLE sales_rep2 LOGIN PASSWORD 'salespass2' IN ROLE sales_team;

    -- Gán quyền
    -- hr_manager có toàn quyền trên schema human_resources
    GRANT ALL PRIVILEGES ON SCHEMA human_resources TO hr_manager;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA human_resources TO hr_manager;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA human_resources TO hr_manager;

    -- finance_analyst chỉ được đọc và thêm dữ liệu vào schema finance
    GRANT CONNECT ON DATABASE quan_ly_nhan_su TO finance_analyst; -- (Giả sử tên DB là quan_ly_nhan_su)
    GRANT USAGE ON SCHEMA finance TO finance_analyst;
    GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA finance TO finance_analyst;
    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA finance TO finance_analyst;

    -- sales_team (và các thành viên) có quyền đọc trên bảng Products (giả sử ở public)
    -- CREATE TABLE public.Products (product_id SERIAL PRIMARY KEY, name TEXT, price NUMERIC);
    -- GRANT SELECT ON public.Products TO sales_team;

    -- Thu hồi một số quyền
    REVOKE INSERT ON finance.Transactions FROM finance_analyst;

    -- Alter Default Privileges: Các bảng mới trong schema 'sales' sẽ tự động cấp quyền SELECT cho 'sales_team'
    ALTER DEFAULT PRIVILEGES IN SCHEMA sales
    GRANT SELECT ON TABLES TO sales_team;

    -- Tạo bảng mới trong sales, sales_team sẽ tự động có quyền SELECT
    -- CREATE TABLE sales.Leads (lead_id SERIAL PRIMARY KEY, lead_name TEXT);
    -- (sales_rep1 có thể SELECT từ sales.Leads)
    ```
* **Bài tập ứng dụng:**
    1.  **Thiết lập môi trường:**
        * Trong database `my_project_db` đã tạo, tạo 3 schema: `engineering`, `marketing`, `support`.
    2.  **Tạo Roles và Users:**
        * Tạo role `engineering_lead` (LOGIN, PASSWORD, có thể tạo role khác).
        * Tạo role `developer` (NOLOGIN, dùng làm group).
        * Tạo 2 user `dev_user1` và `dev_user2` (LOGIN, PASSWORD), gán họ vào group `developer`.
        * Tạo role `marketing_specialist` (LOGIN, PASSWORD).
        * Tạo role `support_agent` (LOGIN, PASSWORD).
    3.  **Phân quyền cơ bản:**
        * `engineering_lead`: Toàn quyền trên schema `engineering` (bao gồm tạo bảng, sequence).
        * `developer` (group): Quyền `SELECT`, `INSERT`, `UPDATE`, `DELETE` trên tất cả các bảng trong schema `engineering`. Quyền `USAGE` trên schema `engineering` và `USAGE, SELECT` trên các sequence trong schema `engineering`.
        * `marketing_specialist`: Quyền `SELECT`, `INSERT` trên các bảng trong schema `marketing`.
        * `support_agent`: Quyền `SELECT` trên các bảng trong schema `engineering` và `marketing`, quyền `SELECT`, `INSERT`, `UPDATE` trên các bảng trong schema `support`.
        * Tất cả các user trên đều cần quyền `CONNECT` vào database `my_project_db`.
    4.  **Kiểm tra quyền (Lý thuyết hoặc thực hành nếu có thể):**
        * Nếu `dev_user1` cố gắng `CREATE TABLE` trong schema `engineering`, điều gì sẽ xảy ra? Tại sao?
        * Nếu `marketing_specialist` cố gắng `DELETE` từ một bảng trong schema `marketing`, điều gì sẽ xảy ra?
        * Làm thế nào để `engineering_lead` có thể cấp quyền `SELECT` trên một bảng cụ thể trong `engineering` cho `support_agent`?
    5.  **Sử dụng `ALTER DEFAULT PRIVILEGES`:**
        * Thiết lập sao cho bất kỳ bảng nào được tạo mới trong schema `engineering` bởi `engineering_lead` sẽ tự động cấp quyền `SELECT` cho group `developer`.
        * Tạo một bảng mới trong `engineering` bởi `engineering_lead` và kiểm tra (lý thuyết) xem `dev_user1` có quyền `SELECT` không.
