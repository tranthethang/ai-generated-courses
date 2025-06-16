### Chapter 1: Giới thiệu PostgreSQL và Chuyển đổi từ MySQL

* **Tên bài học:** Khởi đầu với PostgreSQL: Những điểm khác biệt chính, cài đặt và cấu hình cơ bản.
* **Tóm tắt lý thuyết:**
    * **PostgreSQL là gì?**
        * Lịch sử phát triển: Nguồn gốc từ dự án Ingres tại Đại học California, Berkeley. Sự phát triển qua các phiên bản và cộng đồng mã nguồn mở mạnh mẽ.
        * Kiến trúc tổng quan: Mô hình client-server. Các tiến trình chính (Postmaster, Backend Processes, WAL Writer, Checkpointer, Background Writer). Cơ chế lưu trữ dữ liệu (Tablespaces, Databases, Schemas, Tables, Heap, Indexes).
        * Đặc điểm nổi bật: Tuân thủ ACID đầy đủ, hỗ trợ MVCC (Multi-Version Concurrency Control) cho phép đọc ghi đồng thời hiệu quả, tính mở rộng cao (custom types, functions, operators, index methods, procedural languages), hệ thống kiểu dữ liệu phong phú, tính năng SQL nâng cao.
    * **So sánh PostgreSQL và MySQL:**
        * **Kiểu dữ liệu:** PostgreSQL có hệ thống kiểu dữ liệu đa dạng hơn (ARRAY, JSONB, UUID, ENUM, Geometric types, Network address types, TIMESTAMPTZ). MySQL gần đây đã cải thiện (JSON), nhưng PostgreSQL vẫn mạnh hơn về tính nhất quán và tuân thủ chuẩn SQL.
        * **Tuân thủ SQL Standard:** PostgreSQL nổi tiếng với việc tuân thủ chặt chẽ chuẩn SQL. MySQL có một số cú pháp hoặc hành vi riêng.
        * **JSON Support:** Cả hai đều hỗ trợ JSON. PostgreSQL `JSONB` (binary JSON) thường được coi là mạnh mẽ hơn cho việc truy vấn và indexing so với JSON của MySQL.
        * **Transactions & MVCC:** Cả hai đều hỗ trợ ACID. PostgreSQL sử dụng MVCC từ rất sớm và được coi là triển khai rất tốt. InnoDB của MySQL cũng sử dụng MVCC.
        * **Extensibility:** PostgreSQL vượt trội với khả năng tạo extensions, custom data types, functions, operators.
        * **Replication:** Cả hai đều có các giải pháp replication mạnh mẽ. PostgreSQL có streaming replication (physical) và logical replication.
        * **Performance:** Hiệu năng phụ thuộc vào workload cụ thể, cấu hình và tuning. PostgreSQL thường được đánh giá cao cho các workload phức tạp, OLAP, và các ứng dụng đòi hỏi tính toàn vẹn dữ liệu cao. MySQL thường nhanh cho các workload OLTP đơn giản, read-heavy.
        * **Licensing:** PostgreSQL (BSD-like license) hoàn toàn miễn phí và mã nguồn mở. MySQL có phiên bản Community (GPL) và các phiên bản thương mại.
        * **Trường hợp sử dụng:** PostgreSQL phù hợp cho các hệ thống yêu cầu tính toàn vẹn dữ liệu cao, truy vấn phức tạp, ứng dụng GIS, kho dữ liệu. MySQL phổ biến cho các ứng dụng web, CMS, các hệ thống read-heavy.
    * **Các thuật ngữ PostgreSQL quan trọng:**
        * **Database Cluster:** Một tập hợp các database được quản lý bởi một instance PostgreSQL server duy nhất.
        * **Database:** Một tập hợp các schema, bảng, view, function và các đối tượng SQL khác. Trong PostgreSQL, một database là một đơn vị cô lập hoàn toàn (không thể join chéo database trực tiếp như trong MySQL trừ khi dùng FDW).
        * **Schema:** Một không gian tên (namespace) bên trong một database. Chứa các bảng, view, function... Một database có thể có nhiều schema. Schema `public` là mặc định. Giúp tổ chức CSDL, tránh xung đột tên, quản lý quyền truy cập chi tiết. Khác với MySQL nơi "database" gần tương đương với "schema" của PostgreSQL.
        * **Role:** Trong PostgreSQL, không có sự phân biệt rõ ràng giữa "user" và "group" như một số CSDL khác. Tất cả đều là "roles". Một role có thể có các thuộc tính như `LOGIN` (cho phép đăng nhập), `SUPERUSER`, `CREATEDB`, `CREATEROLE`, và có thể là thành viên của các role khác.
    * **Công cụ dòng lệnh `psql`:**
        * Giao diện dòng lệnh tương tác mạnh mẽ cho PostgreSQL.
        * Các lệnh meta-commands thường dùng: `\l` (list databases), `\c <db_name>` (connect to database), `\dt` (list tables in current schema), `\d <table_name>` (describe table), `\dn` (list schemas), `\df` (list functions), `\dv` (list views), `\du` (list roles), `\timing` (toggle timing for queries), `\e` (edit current query in editor), `\i <filename>` (execute commands from file), `\q` (quit).
    * **Giới thiệu pgAdmin:**
        * Công cụ quản trị và phát triển PostgreSQL mã nguồn mở phổ biến, có giao diện đồ họa.
        * Tính năng chính: Object browser, SQL query tool với syntax highlighting, execution plan visualization, schema diff, backup/restore GUI, server status monitoring.
    * **Hướng dẫn cài đặt PostgreSQL:**
        * Windows: Sử dụng trình cài đặt từ EnterpriseDB.
        * Linux: Sử dụng package manager của distro (apt, yum, dnf). Thêm repository chính thức của PostgreSQL để có phiên bản mới nhất.
        * macOS: Sử dụng Homebrew hoặc Postgres.app.
        * Docker: Cách phổ biến để chạy PostgreSQL trong môi trường cô lập.
        * Cấu hình cơ bản sau cài đặt:
            * `postgresql.conf`: File cấu hình chính (ví dụ: `listen_addresses`, `max_connections`, `shared_buffers`).
            * `pg_hba.conf` (Host-Based Authentication): File cấu hình xác thực client.
* **Code ví dụ (SQL):**
    ```sql
    -- Kết nối tới server PostgreSQL bằng psql (từ terminal)
    -- psql -U postgres -h localhost 
    -- (Mật khẩu có thể được hỏi hoặc cấu hình trong .pgpass)

    -- Liệt kê các database hiện có
    \l

    -- Tạo một database mới
    CREATE DATABASE quan_ly_nhan_su;

    -- Kết nối tới database vừa tạo
    \c quan_ly_nhan_su;

    -- Tạo một role mới cho phép đăng nhập
    CREATE ROLE dev_user LOGIN PASSWORD 'securepassword123';

    -- Tạo một role khác không cho phép đăng nhập (dùng làm group)
    CREATE ROLE developers_group;

    -- Gán dev_user vào group developers_group
    GRANT developers_group TO dev_user;

    -- Gán quyền cho role dev_user trên database quan_ly_nhan_su
    GRANT ALL PRIVILEGES ON DATABASE quan_ly_nhan_su TO dev_user;
    -- Hoặc chi tiết hơn:
    GRANT CONNECT ON DATABASE quan_ly_nhan_su TO dev_user;
    -- (Quyền trên các object bên trong database sẽ được gán sau)

    -- Xem danh sách các role
    \du

    -- Xem cấu trúc một bảng (nếu có)
    -- \d ten_bang;
    ```
* **Bài tập ứng dụng:**
    1.  **Cài đặt:** Cài đặt thành công phiên bản PostgreSQL mới nhất trên máy cá nhân của bạn (Windows, macOS, hoặc Linux).
    2.  **Kết nối và Khám phá:**
        * Sử dụng `psql` để kết nối tới PostgreSQL server với user `postgres` (hoặc user admin mặc định).
        * Liệt kê tất cả các database mặc định.
        * Tạo một database mới tên là `my_project_db`.
        * Kết nối vào `my_project_db`.
    3.  **Quản lý Roles:**
        * Tạo một role mới tên `project_admin` với mật khẩu tự chọn và quyền `LOGIN`, `CREATEDB`.
        * Tạo một role khác tên `project_user` với mật khẩu tự chọn và quyền `LOGIN`.
        * Gán toàn bộ quyền trên database `my_project_db` cho role `project_admin`.
        * Gán quyền `CONNECT` vào `my_project_db` cho role `project_user`.
    4.  **pgAdmin:**
        * Cài đặt pgAdmin.
        * Kết nối tới PostgreSQL server của bạn bằng pgAdmin.
        * Sử dụng pgAdmin để xem các database và roles bạn vừa tạo.
    5.  **Tìm hiểu file cấu hình:**
        * Xác định vị trí file `postgresql.conf` và `pg_hba.conf` trên hệ thống của bạn.
        * Mở và xem qua nội dung của chúng (không cần thay đổi gì). Tìm hiểu xem `listen_addresses` đang được đặt là gì và các rule mặc định trong `pg_hba.conf`.

