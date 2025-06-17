# Chapter 4: Transactions và Concurrency Control (MVCC)

* **Tên bài học:** Đảm bảo toàn vẹn dữ liệu với Transactions, hiểu sâu về MVCC và các mức cô lập.
* **Tóm tắt lý thuyết:**
    * **Tính chất ACID trong PostgreSQL:**
        * **Atomicity (Tính nguyên tử):** Một transaction được thực thi hoàn toàn hoặc không được thực thi gì cả. Nếu bất kỳ phần nào của transaction thất bại, toàn bộ transaction sẽ được rollback. PostgreSQL đảm bảo điều này qua Write-Ahead Logging (WAL).
        * **Consistency (Tính nhất quán):** Một transaction chuyển CSDL từ một trạng thái hợp lệ này sang một trạng thái hợp lệ khác. Tất cả các ràng buộc (constraints), trigger phải được thỏa mãn.
        * **Isolation (Tính cô lập):** Các transaction đồng thời phải được thực thi một cách độc lập với nhau, như thể chúng được thực thi tuần tự. PostgreSQL đạt được điều này thông qua MVCC và các mức cô lập.
        * **Durability (Tính bền vững):** Một khi transaction đã được commit, các thay đổi của nó sẽ tồn tại vĩnh viễn, ngay cả khi hệ thống gặp sự cố (ví dụ: mất điện). PostgreSQL sử dụng WAL và checkpoint để đảm bảo tính bền vững.
    * **Câu lệnh quản lý transaction:**
        * `BEGIN;` hoặc `START TRANSACTION;`: Bắt đầu một transaction mới.
        * `COMMIT;` hoặc `END;`: Lưu tất cả các thay đổi của transaction vào CSDL.
        * `ROLLBACK;`: Hủy bỏ tất cả các thay đổi của transaction.
        * **`SAVEPOINT savepoint_name;`**: Tạo một điểm lưu tạm bên trong transaction hiện tại.
        * **`ROLLBACK TO SAVEPOINT savepoint_name;`**: Rollback transaction về một savepoint đã tạo trước đó. Các thay đổi sau savepoint đó sẽ bị hủy, nhưng các thay đổi trước đó và chính savepoint vẫn còn hiệu lực.
        * **`RELEASE SAVEPOINT savepoint_name;`**: Xóa một savepoint đã tạo (ít dùng, vì commit hoặc rollback to savepoint trước đó sẽ tự động xóa các savepoint sau).
    * **Các mức cô lập (Isolation Levels) trong PostgreSQL:**
        * **`READ UNCOMMITTED`**: Mức thấp nhất. PostgreSQL không thực sự triển khai mức này; nó được coi như `READ COMMITTED`.
        * **`READ COMMITTED` (Mặc định):**
            * Một câu lệnh chỉ thấy được dữ liệu đã được commit *trước khi câu lệnh đó bắt đầu*.
            * Trong cùng một transaction, hai câu lệnh `SELECT` giống hệt nhau có thể trả về kết quả khác nhau nếu một transaction khác commit thay đổi dữ liệu ở giữa hai câu lệnh đó (hiện tượng **Non-Repeatable Read**).
            * Một câu lệnh có thể thấy các dòng mới được chèn (hoặc các dòng bị xóa) bởi các transaction khác đã commit sau khi transaction hiện tại bắt đầu (hiện tượng **Phantom Read** có thể xảy ra).
        * **`REPEATABLE READ`**:
            * Tất cả các câu lệnh trong transaction hiện tại chỉ thấy được dữ liệu đã được commit *trước khi transaction đó bắt đầu*. Đảm bảo Non-Repeatable Read không xảy ra.
            * Tuy nhiên, Phantom Read vẫn có thể xảy ra. Nếu một transaction khác chèn dòng mới và commit, transaction hiện tại ở mức `REPEATABLE READ` sẽ không thấy dòng mới đó, nhưng nếu nó cố gắng `INSERT` một dòng có key trùng với dòng mới kia (mà nó không thấy), nó có thể bị lỗi serialization (serialization failure).
            * PostgreSQL có thể báo lỗi "could not serialize access due to concurrent update" và yêu cầu rollback và thử lại transaction.
        * **`SERIALIZABLE`**:
            * Mức cô lập cao nhất. Đảm bảo các transaction thực thi như thể chúng được chạy tuần tự, loại bỏ tất cả các hiện tượng bất thường (Dirty Read, Non-Repeatable Read, Phantom Read).
            * PostgreSQL triển khai mức này bằng cách sử dụng Snapshot Isolation và kiểm tra các pattern nguy hiểm (predicate locking "ảo"). Nếu phát hiện xung đột có thể dẫn đến kết quả không tuần tự hóa được, một trong các transaction sẽ bị rollback với lỗi serialization.
            * Yêu cầu ứng dụng phải có logic để thử lại các transaction bị thất bại.
    * **Giới thiệu về Multi-Version Concurrency Control (MVCC):**
        * Cơ chế PostgreSQL sử dụng để quản lý truy cập đồng thời.
        * Khi một dòng được cập nhật hoặc xóa, PostgreSQL không ghi đè lên dữ liệu cũ ngay lập tức. Thay vào đó, nó tạo ra một phiên bản mới của dòng (cho `UPDATE`) hoặc đánh dấu dòng là đã xóa (cho `DELETE`), trong khi vẫn giữ lại phiên bản cũ.
        * Mỗi transaction hoạt động trên một "snapshot" của CSDL tại một thời điểm nhất định. Snapshot này xác định phiên bản nào của mỗi dòng là "nhìn thấy được" (visible) đối với transaction đó.
        * Các cột hệ thống ẩn: `xmin` (ID transaction đã chèn dòng), `xmax` (ID transaction đã xóa/cập nhật dòng), `ctid` (vị trí vật lý của tuple).
        * **Ưu điểm:** "Readers never block writers, and writers never block readers." Tăng đáng kể khả năng đồng thời.
        * **Nhược điểm:**
            * **Bloat:** Các phiên bản dòng cũ (dead tuples) chiếm không gian đĩa.
            * **Wraparound:** Transaction ID có giới hạn, cần xử lý hiện tượng wraparound.
            * **VACUUM:** Cần tiến trình `VACUUM` (và `AUTOVACUUM`) để dọn dẹp các dead tuples và "đóng băng" các transaction ID cũ để tránh wraparound.
    * **Deadlocks:**
        * Xảy ra khi hai (hoặc nhiều) transaction chờ đợi lẫn nhau để giải phóng tài nguyên (lock).
        * PostgreSQL tự động phát hiện deadlock và rollback một trong các transaction (thường là transaction gây ra ít công việc hơn) để giải quyết. Ứng dụng cần sẵn sàng thử lại transaction bị rollback.
* **Code ví dụ (SQL):**
    ```sql
    -- Transaction với SAVEPOINT và ROLLBACK TO SAVEPOINT
    CREATE TABLE Accounts (account_id INT PRIMARY KEY, balance NUMERIC CHECK (balance >= 0));
    INSERT INTO Accounts VALUES (1, 1000), (2, 500);

    BEGIN;
    UPDATE Accounts SET balance = balance - 200 WHERE account_id = 1;
    SELECT * FROM Accounts; -- Thấy balance của account 1 là 800
    SAVEPOINT before_second_update;
    UPDATE Accounts SET balance = balance + 200 WHERE account_id = 2;
    SELECT * FROM Accounts; -- Thấy balance của account 2 là 700

    -- Giả sử có lỗi hoặc quyết định hủy một phần
    ROLLBACK TO SAVEPOINT before_second_update;
    SELECT * FROM Accounts; -- Account 1 vẫn là 800, Account 2 quay lại 500
    COMMIT;
    SELECT * FROM Accounts; -- Kết quả cuối: Account 1 là 800, Account 2 là 500

    -- Minh họa Non-Repeatable Read ở mức READ COMMITTED
    -- Session 1:
    BEGIN;
    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
    SELECT balance FROM Accounts WHERE account_id = 1; -- Giả sử trả về 800
    -- Session 2:
    -- BEGIN; UPDATE Accounts SET balance = 700 WHERE account_id = 1; COMMIT;
    -- Session 1 (tiếp tục):
    SELECT balance FROM Accounts WHERE account_id = 1; -- Có thể trả về 700 (khác lần đọc trước)
    COMMIT;

    -- Minh họa REPEATABLE READ
    -- Session 1:
    BEGIN;
    SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
    SELECT balance FROM Accounts WHERE account_id = 1; -- Giả sử trả về 800
    -- Session 2:
    -- BEGIN; UPDATE Accounts SET balance = 600 WHERE account_id = 1; COMMIT;
    -- Session 1 (tiếp tục):
    SELECT balance FROM Accounts WHERE account_id = 1; -- Vẫn trả về 800 (không thấy thay đổi từ Session 2)
    -- Nếu Session 1 cố gắng UPDATE account_id = 1:
    -- UPDATE Accounts SET balance = balance - 50 WHERE account_id = 1;
    -- Có thể bị lỗi: ERROR:  could not serialize access due to concurrent update
    COMMIT;
    ```
* **Bài tập ứng dụng:**
    Sử dụng bảng `Products` (product_id SERIAL, name TEXT, quantity_on_hand INT CHECK (quantity_on_hand >=0)) và `OrderItems` (order_item_id SERIAL, product_id INT, quantity_ordered INT).
    1.  **Transaction Chuyển Khoản An Toàn:**
        * Viết một transaction để thực hiện việc đặt hàng: Giảm `quantity_on_hand` trong `Products` và thêm một dòng vào `OrderItems`.
        * Đảm bảo rằng nếu `quantity_on_hand` không đủ, toàn bộ transaction sẽ được `ROLLBACK`.
        * Sử dụng `SAVEPOINT` sau khi kiểm tra số lượng tồn kho nhưng trước khi cập nhật. Nếu việc thêm vào `OrderItems` gặp lỗi (ví dụ, do ràng buộc), rollback về savepoint đó và thông báo lỗi thay vì rollback toàn bộ (tùy kịch bản).
    2.  **Mô phỏng Non-Repeatable Read:**
        * Mở hai session `psql`.
        * Session 1: Bắt đầu một transaction ở mức `READ COMMITTED`. Đọc số lượng tồn kho của một sản phẩm.
        * Session 2: Bắt đầu một transaction, cập nhật số lượng tồn kho của sản phẩm đó và `COMMIT`.
        * Session 1: Đọc lại số lượng tồn kho của sản phẩm đó. Quan sát sự thay đổi. `COMMIT` Session 1.
    3.  **Mô phỏng REPEATABLE READ:**
        * Lặp lại bài 2, nhưng Session 1 đặt mức cô lập là `REPEATABLE READ`. Quan sát xem Session 1 có thấy thay đổi từ Session 2 không.
        * Trong Session 1 (sau khi Session 2 đã commit), thử cập nhật chính sản phẩm đó. Quan sát xem có lỗi serialization xảy ra không.
    4.  **Xử lý Deadlock (Lý thuyết):**
        * Mô tả một kịch bản có thể gây deadlock giữa hai transaction khi chúng cùng cập nhật hai sản phẩm khác nhau nhưng theo thứ tự ngược nhau (ví dụ: Tx1 cập nhật P1 rồi P2, Tx2 cập nhật P2 rồi P1).
        * Nếu ứng dụng của bạn gặp lỗi deadlock từ PostgreSQL, bạn nên xử lý như thế nào? (Gợi ý: thử lại transaction).
    5.  **Thảo luận về VACUUM:**
        * Tại sao `VACUUM` lại cần thiết trong PostgreSQL do cơ chế MVCC?
        * `AUTOVACUUM` là gì và tại sao nó quan trọng?
        * Sự khác biệt giữa `VACUUM` và `VACUUM FULL` là gì? Khi nào nên dùng `VACUUM FULL` (và tại sao nên cẩn thận)?
