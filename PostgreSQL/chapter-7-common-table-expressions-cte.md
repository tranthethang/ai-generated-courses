# Chapter 7: Common Table Expressions (CTE)

* **Tên bài học:** Viết truy vấn SQL rõ ràng, module hóa và mạnh mẽ hơn với Common Table Expressions (CTE), bao gồm cả CTE đệ quy.
* **Tóm tắt lý thuyết:**
    * **Common Table Expressions (CTE) là gì?**
        * CTE, hay còn gọi là mệnh đề `WITH`, cho phép bạn định nghĩa một hoặc nhiều tập kết quả tạm thời, được đặt tên, mà bạn có thể tham chiếu đến trong một câu lệnh SQL chính (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
        * CTE chỉ tồn tại trong phạm vi của câu lệnh SQL mà nó được định nghĩa.
    * **Cú pháp:**
        ```sql
        WITH 
            ten_cte_1 AS (
                -- Câu lệnh SELECT định nghĩa ten_cte_1
            ),
            ten_cte_2 AS (
                -- Câu lệnh SELECT định nghĩa ten_cte_2
                -- (Có thể tham chiếu đến ten_cte_1)
            )
            -- ... có thể có nhiều CTE khác
        SELECT ... FROM ten_cte_1 JOIN ten_cte_2 ON ... -- Câu lệnh chính sử dụng các CTE
        -- Hoặc INSERT/UPDATE/DELETE ...
        ```
    * **Lợi ích của CTE:**
        * **Cải thiện tính dễ đọc và bảo trì:** Chia nhỏ các câu lệnh SQL phức tạp thành các khối logic nhỏ hơn, dễ hiểu hơn.
        * **Module hóa logic:** Tái sử dụng một tập kết quả tạm thời nhiều lần trong cùng một câu lệnh chính (tuy nhiên, PostgreSQL thường tính toán lại CTE mỗi lần tham chiếu, trừ khi nó là `MATERIALIZED` - xem thêm).
        * **Cho phép truy vấn đệ quy:** Xử lý dữ liệu phân cấp (cây tổ chức, danh mục sản phẩm) hoặc dạng đồ thị.
        * **Tổ chức các bước tính toán:** Thực hiện các phép tính trung gian trước khi đến câu lệnh cuối cùng.
    * **CTE không đệ quy (Non-recursive CTEs):**
        * Là loại CTE phổ biến nhất, được định nghĩa bằng một câu lệnh `SELECT` đơn giản.
        * Có thể được dùng để thay thế các subquery phức tạp hoặc view tạm thời.
    * **CTE đệ quy (Recursive CTEs):**
        * Được sử dụng để thực hiện các truy vấn lặp đi lặp lại trên một tập dữ liệu cho đến khi một điều kiện dừng được thỏa mãn.
        * Cấu trúc:
            ```sql
            WITH RECURSIVE ten_cte_de_quy (cot1, cot2, ...) AS (
                -- Phần neo (Non-recursive term / Anchor member)
                SELECT ... 
                FROM ...
                WHERE ... -- Điều kiện khởi tạo cho đệ quy

                UNION ALL -- Hoặc UNION

                -- Phần đệ quy (Recursive term / Recursive member)
                SELECT ...
                FROM ... JOIN ten_cte_de_quy ON ... -- Tham chiếu lại chính CTE đó
                WHERE ... -- Điều kiện dừng hoặc điều kiện cho bước lặp tiếp theo
            )
            SELECT ... FROM ten_cte_de_quy;
            ```
        * **Phần neo:** Thực thi một lần, tạo ra tập kết quả ban đầu.
        * **Phần đệ quy:** Thực thi lặp đi lặp lại, mỗi lần lấy kết quả của lần lặp trước đó làm đầu vào, cho đến khi phần đệ quy không trả về thêm dòng nào nữa.
        * `UNION ALL` thường được sử dụng để kết hợp kết quả từ phần neo và các bước đệ quy. `UNION` (loại bỏ trùng lặp) có thể được dùng nhưng thường kém hiệu quả hơn và có thể gây ra vòng lặp vô hạn nếu không cẩn thận.
        * Cẩn thận với điều kiện dừng để tránh vòng lặp vô hạn.
    * **CTE có thể ghi dữ liệu (Data-Modifying CTEs):**
        * Một CTE có thể chứa các câu lệnh `INSERT`, `UPDATE`, hoặc `DELETE`.
        * Mệnh đề `RETURNING` trong CTE ghi dữ liệu là bắt buộc nếu CTE đó được tham chiếu bởi các CTE khác hoặc câu lệnh chính.
        ```sql
        WITH moved_rows AS (
            DELETE FROM old_table WHERE condition
            RETURNING *
        )
        INSERT INTO new_table (SELECT * FROM moved_rows);
        ```
    * **`MATERIALIZED` / `NOT MATERIALIZED` (PostgreSQL 12+):**
        * `WITH my_cte AS MATERIALIZED (...)`: Buộc PostgreSQL tính toán CTE một lần và lưu kết quả vào một bảng tạm thời. Hữu ích nếu CTE được tham chiếu nhiều lần và chi phí tính toán lại cao.
        * `WITH my_cte AS NOT MATERIALIZED (...)`: Buộc PostgreSQL inline (gộp) định nghĩa CTE vào câu lệnh chính. Có thể hữu ích nếu CTE đơn giản và việc materialization không cần thiết.
        * Mặc định, PostgreSQL tự quyết định dựa trên chi phí.
* **Code ví dụ (SQL):**
    ```sql
    -- CTE không đệ quy: Lấy danh sách nhân viên và tên phòng ban của họ
    -- Giả sử có bảng Employees(emp_id, emp_name, dept_id) và Departments(dept_id, dept_name)
    /*
    CREATE TABLE Departments (dept_id INT PRIMARY KEY, dept_name VARCHAR(50));
    CREATE TABLE Employees (emp_id INT PRIMARY KEY, emp_name VARCHAR(50), dept_id INT REFERENCES Departments(dept_id));
    INSERT INTO Departments VALUES (1, 'Engineering'), (2, 'Sales'), (3, 'HR');
    INSERT INTO Employees VALUES (101, 'Alice', 1), (102, 'Bob', 2), (103, 'Charlie', 1), (104, 'David', NULL);
    */
    WITH EmployeeDetails AS (
        SELECT e.emp_name, d.dept_name
        FROM Employees e
        LEFT JOIN Departments d ON e.dept_id = d.dept_id
    ),
    DepartmentSummary AS (
        SELECT dept_name, COUNT(*) as num_employees
        FROM EmployeeDetails
        WHERE dept_name IS NOT NULL
        GROUP BY dept_name
    )
    SELECT ed.emp_name, COALESCE(ed.dept_name, 'N/A') AS department, ds.num_employees AS employees_in_dept
    FROM EmployeeDetails ed
    LEFT JOIN DepartmentSummary ds ON ed.dept_name = ds.dept_name
    ORDER BY ed.dept_name, ed.emp_name;

    -- CTE đệ quy: Liệt kê cây quản lý nhân viên
    -- Giả sử bảng NhanVien (id INT PRIMARY KEY, ho_ten VARCHAR, id_nguoi_quan_ly INT REFERENCES NhanVien(id))
    /*
    CREATE TABLE NhanVien (id INT PRIMARY KEY, ho_ten VARCHAR(50), id_nguoi_quan_ly INT REFERENCES NhanVien(id));
    INSERT INTO NhanVien VALUES (1, 'CEO', NULL), (2, 'Manager A', 1), (3, 'Manager B', 1),
                               (4, 'Dev A1', 2), (5, 'Dev A2', 2), (6, 'Sales B1', 3);
    */
    WITH RECURSIVE EmployeeHierarchy (employee_id, employee_name, manager_id, level, path_string) AS (
        -- Phần neo: Nhân viên cấp cao nhất (không có quản lý)
        SELECT id, ho_ten, id_nguoi_quan_ly, 0, ho_ten::TEXT
        FROM NhanVien
        WHERE id_nguoi_quan_ly IS NULL

        UNION ALL

        -- Phần đệ quy: Tìm nhân viên báo cáo cho các nhân viên ở cấp trước đó
        SELECT nv.id, nv.ho_ten, nv.id_nguoi_quan_ly, eh.level + 1, eh.path_string || ' -> ' || nv.ho_ten
        FROM NhanVien nv
        JOIN EmployeeHierarchy eh ON nv.id_nguoi_quan_ly = eh.employee_id
    )
    SELECT employee_id, REPEAT('  ', level) || employee_name AS display_name, manager_id, level, path_string
    FROM EmployeeHierarchy
    ORDER BY path_string;

    -- CTE ghi dữ liệu: Di chuyển các đơn hàng cũ sang bảng lưu trữ
    /*
    CREATE TABLE ActiveOrders (order_id INT PRIMARY KEY, order_date DATE, amount NUMERIC);
    CREATE TABLE ArchivedOrders (order_id INT PRIMARY KEY, order_date DATE, amount NUMERIC, archived_at TIMESTAMPTZ);
    INSERT INTO ActiveOrders VALUES (1, '2022-01-15', 100), (2, '2023-05-20', 200), (3, '2022-06-10', 150);
    */
    WITH MovedOrders AS (
        DELETE FROM ActiveOrders
        WHERE order_date < '2023-01-01'
        RETURNING order_id, order_date, amount
    )
    INSERT INTO ArchivedOrders (order_id, order_date, amount, archived_at)
    SELECT order_id, order_date, amount, NOW()
    FROM MovedOrders;

    SELECT * FROM ActiveOrders;
    SELECT * FROM ArchivedOrders;
    ```
* **Bài tập ứng dụng:**
    Giả sử có các bảng:
    * `Categories` (category_id SERIAL PRIMARY KEY, category_name VARCHAR, parent_category_id INT REFERENCES Categories(category_id))
    * `Products` (product_id SERIAL PRIMARY KEY, product_name VARCHAR, category_id INT REFERENCES Categories(category_id), unit_price NUMERIC)
    * `Sales` (sale_id SERIAL PRIMARY KEY, product_id INT REFERENCES Products(product_id), quantity_sold INT, sale_date DATE)
    1.  **Doanh thu theo danh mục:** Sử dụng CTE, tính tổng doanh thu (`unit_price * quantity_sold`) cho mỗi `category_name`. CTE đầu tiên có thể join `Products` và `Sales`, CTE thứ hai join kết quả đó với `Categories` và tính tổng.
    2.  **Sản phẩm bán chạy nhất mỗi danh mục:**
        * CTE 1: Tính tổng số lượng bán được (`total_quantity_sold`) cho mỗi `product_id`.
        * CTE 2: Join kết quả trên với `Products` và `Categories`. Sau đó, sử dụng Window Function (sẽ học ở Chapter sau, hoặc `DISTINCT ON` nếu đã quen) bên trong CTE này để tìm sản phẩm có `total_quantity_sold` cao nhất cho mỗi `category_id`.
        * Câu lệnh chính: Hiển thị `category_name`, `product_name` bán chạy nhất, và `total_quantity_sold` của sản phẩm đó.
    3.  **Hiển thị cây danh mục sản phẩm:** Sử dụng CTE đệ quy, hiển thị tất cả các danh mục theo cấu trúc cây, thụt lề tên danh mục con dựa trên cấp độ của chúng. Hiển thị `category_id`, `category_name` (đã thụt lề), `parent_category_id`, và `level`.
    4.  **Tìm đường dẫn đầy đủ của danh mục:** Mở rộng bài tập 3, hiển thị thêm một cột `full_path` là chuỗi các tên danh mục từ gốc đến danh mục hiện tại (ví dụ: "Electronics -> Computers -> Laptops").
    5.  **CTE ghi dữ liệu - Tăng giá sản phẩm:**
        * Sử dụng CTE, chọn ra các sản phẩm thuộc một danh mục cụ thể (ví dụ: 'Laptops') mà chưa được bán trong 6 tháng qua (dựa vào `sale_date` trong bảng `Sales`).
        * Trong câu lệnh chính, `UPDATE` giá (`unit_price`) của các sản phẩm này lên 5% (sử dụng `product_id` từ CTE). Dùng `RETURNING` để xem các sản phẩm đã được cập nhật giá.

---
(Các Chapter tiếp theo sẽ được mở rộng tương tự để đảm bảo độ dài và chi tiết)

... (Nội dung chi tiết cho Chapter 8 đến Chapter 12 sẽ được thêm vào đây, theo cấu trúc và mức độ chi tiết tương tự như các Chapter trên. Mỗi Chapter sẽ được mở rộng phần lý thuyết, thêm nhiều ví dụ code hơn và bài tập phức tạp hơn.)

