# Chapter 8: Window Functions

* **Tên bài học:** Phân tích dữ liệu chuyên sâu và hiệu quả với Window Functions.
* **Tóm tắt lý thuyết:**
    * **Window Functions là gì?**
        * Window Functions thực hiện các phép tính trên một tập các dòng của bảng có liên quan (gọi là "window" hoặc "cửa sổ") đến dòng hiện tại.
        * Khác với các hàm tổng hợp (aggregate functions) thông thường kết hợp với `GROUP BY`:
            * `GROUP BY` gộp nhiều dòng thành một dòng kết quả duy nhất cho mỗi nhóm.
            * Window Functions không làm giảm số lượng dòng trả về; chúng trả về một giá trị cho mỗi dòng dựa trên "cửa sổ" các dòng liên quan đến nó.
    * **Cú pháp cơ bản:**
        ```sql
        function_name ([arguments]) OVER (
            [PARTITION BY expression_list]
            [ORDER BY expression_list [ASC | DESC] [NULLS FIRST | NULLS LAST]]
            [frame_clause]
        )
        ```
        * `function_name`: Tên của window function (ví dụ: `SUM()`, `RANK()`, `LAG()`).
        * `OVER (...)`: Mệnh đề xác định "cửa sổ".
        * **`PARTITION BY expression_list`**: (Tùy chọn) Chia các dòng của kết quả truy vấn thành các phân vùng (partitions). Window function được áp dụng riêng biệt cho mỗi phân vùng. Nếu bỏ qua, toàn bộ tập kết quả được coi là một phân vùng duy nhất.
        * **`ORDER BY expression_list`**: (Tùy chọn, nhưng thường cần thiết cho nhiều hàm) Sắp xếp các dòng bên trong mỗi phân vùng. Thứ tự này quan trọng cho các hàm xếp hạng và các hàm phụ thuộc vào vị trí tương đối của các dòng (như `LAG`, `LEAD`).
        * **`frame_clause`**: (Tùy chọn) Xác định một tập con các dòng (gọi là "window frame") bên trong phân vùng hiện tại để hàm tính toán. Nếu bỏ qua, frame mặc định phụ thuộc vào hàm và có `ORDER BY` hay không.
            * Cú pháp frame: `mode BETWEEN frame_start AND frame_end`
            * `mode`: `ROWS` (dựa trên số dòng offset), `RANGE` (dựa trên giá trị offset so với giá trị dòng hiện tại trong `ORDER BY`), `GROUPS` (PostgreSQL 11+, dựa trên nhóm các dòng có cùng giá trị `ORDER BY`).
            * `frame_start`, `frame_end`:
                * `UNBOUNDED PRECEDING`: Bắt đầu từ dòng đầu tiên của phân vùng.
                * `N PRECEDING`: N dòng trước dòng hiện tại.
                * `CURRENT ROW`: Dòng hiện tại.
                * `N FOLLOWING`: N dòng sau dòng hiện tại.
                * `UNBOUNDED FOLLOWING`: Kết thúc ở dòng cuối cùng của phân vùng.
            * Ví dụ frame phổ biến cho tổng lũy kế: `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`.
    * **Các loại Window Functions:**
        * **Hàm xếp hạng (Ranking Functions):**
            * `ROW_NUMBER()`: Gán một số thứ tự duy nhất cho mỗi dòng trong phân vùng, bắt đầu từ 1, theo thứ tự `ORDER BY`.
            * `RANK()`: Gán hạng cho mỗi dòng. Các dòng có cùng giá trị `ORDER BY` sẽ có cùng hạng. Hạng tiếp theo sẽ bị bỏ qua (ví dụ: 1, 1, 3).
            * `DENSE_RANK()`: Tương tự `RANK()`, nhưng không có khoảng trống trong dãy hạng (ví dụ: 1, 1, 2).
            * `NTILE(num_buckets)`: Chia các dòng trong mỗi phân vùng thành `num_buckets` nhóm (gọi là "tiles") và gán số thứ tự nhóm cho mỗi dòng.
        * **Hàm tổng hợp (Aggregate Window Functions):**
            * Các hàm tổng hợp quen thuộc (`SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()`) có thể được sử dụng như window functions khi có mệnh đề `OVER()`.
            * Ví dụ: `SUM(salary) OVER (PARTITION BY department_id)` sẽ tính tổng lương cho mỗi phòng ban và hiển thị giá trị đó cho mọi nhân viên trong phòng ban đó.
        * **Hàm giá trị (Value Window Functions) / Hàm điều hướng (Navigation Functions):**
            * `LAG(expression [, offset [, default_value]])`: Truy cập giá trị của `expression` từ dòng đứng *trước* dòng hiện tại `offset` vị trí trong phân vùng (mặc định `offset` là 1).
            * `LEAD(expression [, offset [, default_value]])`: Truy cập giá trị của `expression` từ dòng đứng *sau* dòng hiện tại `offset` vị trí trong phân vùng.
            * `FIRST_VALUE(expression)`: Trả về giá trị của `expression` từ dòng đầu tiên của window frame.
            * `LAST_VALUE(expression)`: Trả về giá trị của `expression` từ dòng cuối cùng của window frame. (Lưu ý: frame mặc định có thể không như bạn mong đợi, thường cần chỉ định frame rõ ràng như `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`).
            * `NTH_VALUE(expression, n)`: Trả về giá trị của `expression` từ dòng thứ `n` của window frame.
    * **Sử dụng tên cửa sổ (Named Windows):**
        * Nếu bạn sử dụng cùng một định nghĩa cửa sổ (`PARTITION BY`, `ORDER BY`, `frame_clause`) cho nhiều window functions, bạn có thể định nghĩa nó một lần bằng mệnh đề `WINDOW`.
        ```sql
        SELECT
            SUM(salary) OVER w,
            AVG(salary) OVER w
        FROM employees
        WINDOW w AS (PARTITION BY department_id ORDER BY hire_date);
        ```
* **Code ví dụ (SQL):**
    ```sql
    -- Giả sử bảng SalesByEmployee (employee_name TEXT, sale_month DATE, monthly_sales NUMERIC, department TEXT)
    /*
    CREATE TABLE SalesByEmployee (
        employee_name TEXT, sale_month DATE, monthly_sales NUMERIC, department TEXT,
        PRIMARY KEY (employee_name, sale_month)
    );
    INSERT INTO SalesByEmployee VALUES
    ('Alice', '2023-01-01', 5000, 'Electronics'), ('Alice', '2023-02-01', 5500, 'Electronics'),
    ('Alice', '2023-03-01', 4800, 'Electronics'), ('Bob', '2023-01-01', 7000, 'Electronics'),
    ('Bob', '2023-02-01', 7200, 'Electronics'), ('Charlie', '2023-01-01', 6000, 'Appliances'),
    ('Charlie', '2023-02-01', 6300, 'Appliances'), ('Charlie', '2023-03-01', 6100, 'Appliances');
    */

    -- 1. Xếp hạng nhân viên theo doanh số mỗi tháng trong từng phòng ban
    SELECT
        employee_name,
        department,
        sale_month,
        monthly_sales,
        RANK() OVER (PARTITION BY department, sale_month ORDER BY monthly_sales DESC) as rank_in_dept_month,
        DENSE_RANK() OVER (PARTITION BY department ORDER BY SUM(monthly_sales) DESC) as overall_dept_rank_by_total_sales -- Cần subquery hoặc CTE để tính tổng trước
    FROM SalesByEmployee;
    -- Để xếp hạng department theo tổng sales, cần một CTE:
    WITH DepartmentTotalSales AS (
        SELECT department, SUM(monthly_sales) as total_dept_sales
        FROM SalesByEmployee
        GROUP BY department
    )
    SELECT
        sbe.employee_name, sbe.department, sbe.sale_month, sbe.monthly_sales,
        RANK() OVER (PARTITION BY sbe.department, sbe.sale_month ORDER BY sbe.monthly_sales DESC) as rank_in_dept_month,
        DENSE_RANK() OVER (ORDER BY dts.total_dept_sales DESC) as department_rank_by_total
    FROM SalesByEmployee sbe
    JOIN DepartmentTotalSales dts ON sbe.department = dts.department;


    -- 2. Tính tổng doanh số lũy kế (running total) của mỗi nhân viên qua các tháng
    SELECT
        employee_name,
        department,
        sale_month,
        monthly_sales,
        SUM(monthly_sales) OVER (PARTITION BY employee_name ORDER BY sale_month
                                 ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total_sales
    FROM SalesByEmployee
    ORDER BY employee_name, sale_month;

    -- 3. So sánh doanh số tháng hiện tại với tháng trước của mỗi nhân viên
    SELECT
        employee_name,
        sale_month,
        monthly_sales,
        LAG(monthly_sales, 1, 0.0) OVER (PARTITION BY employee_name ORDER BY sale_month) AS previous_month_sales,
        monthly_sales - LAG(monthly_sales, 1, 0.0) OVER (PARTITION BY employee_name ORDER BY sale_month) AS sales_diff
    FROM SalesByEmployee
    ORDER BY employee_name, sale_month;

    -- 4. Tính tỷ lệ doanh số của mỗi nhân viên so với tổng doanh số phòng ban trong tháng đó
    SELECT
        employee_name,
        department,
        sale_month,
        monthly_sales,
        SUM(monthly_sales) OVER (PARTITION BY department, sale_month) AS total_sales_in_dept_month,
        (monthly_sales * 100.0 / SUM(monthly_sales) OVER (PARTITION BY department, sale_month)) AS percentage_of_dept_sales
    FROM SalesByEmployee
    ORDER BY department, sale_month, employee_name;

    -- 5. Tìm nhân viên có doanh số cao nhất và thấp nhất trong mỗi phòng ban (sử dụng FIRST_VALUE, LAST_VALUE với frame phù hợp)
    SELECT DISTINCT
        department,
        FIRST_VALUE(employee_name) OVER (PARTITION BY department ORDER BY monthly_sales DESC
                                         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS top_performer_this_month_any, -- Lấy 1 người bất kỳ nếu nhiều người cùng sales cao nhất
        LAST_VALUE(employee_name) OVER (PARTITION BY department ORDER BY monthly_sales DESC
                                        RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS bottom_performer_by_value_range -- (Cẩn thận với LAST_VALUE và frame mặc định)
    FROM SalesByEmployee;
    -- Cách tốt hơn để lấy top/bottom (ví dụ cho top):
    WITH RankedSales AS (
      SELECT employee_name, department, monthly_sales,
             RANK() OVER (PARTITION BY department ORDER BY monthly_sales DESC) as rn_desc,
             RANK() OVER (PARTITION BY department ORDER BY monthly_sales ASC) as rn_asc
      FROM SalesByEmployee
      -- WHERE sale_month = 'specific_month' -- Nếu xét theo tháng cụ thể
    )
    SELECT department, employee_name, monthly_sales, 'Top Performer' as category
    FROM RankedSales WHERE rn_desc = 1
    UNION ALL
    SELECT department, employee_name, monthly_sales, 'Bottom Performer' as category
    FROM RankedSales WHERE rn_asc = 1;

    ```
* **Bài tập ứng dụng:**
    Sử dụng bảng `EmployeeSalaries` (employee_id INT, full_name TEXT, department TEXT, hire_date DATE, salary NUMERIC).
    1.  **Xếp hạng lương:**
        * Xếp hạng tất cả nhân viên theo lương từ cao đến thấp (`ROW_NUMBER`, `RANK`, `DENSE_RANK`).
        * Xếp hạng nhân viên theo lương trong mỗi `department`.
    2.  **Phân nhóm lương (NTILE):** Chia nhân viên trong mỗi `department` thành 4 nhóm (quartiles) dựa trên mức lương của họ.
    3.  **Lương lũy kế và trung bình động:**
        * Tính tổng lương lũy kế cho mỗi `department` theo `hire_date`.
        * Tính mức lương trung bình động 3 tháng gần nhất (theo `hire_date`) cho mỗi nhân viên (nếu có đủ dữ liệu 3 tháng).
    4.  **So sánh lương:**
        * Đối với mỗi nhân viên, hiển thị mức lương của nhân viên được tuyển dụng ngay trước và ngay sau họ trong cùng một `department`.
        * Tính phần trăm chênh lệch lương của mỗi nhân viên so với mức lương trung bình của `department` của họ.
    5.  **Nhân viên đầu tiên và cuối cùng được tuyển:**
        * Đối với mỗi `department`, tìm nhân viên được tuyển dụng đầu tiên và cuối cùng.
        * Hiển thị mức lương của nhân viên có lương cao nhất và thấp nhất trong toàn công ty.

