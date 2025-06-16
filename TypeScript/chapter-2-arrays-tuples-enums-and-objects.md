#### Chapter 2: Arrays, Tuples, Enums and Objects

**Mô tả tổng quát Chapter học**

Chapter học này sẽ đi sâu vào các cấu trúc dữ liệu phức tạp hơn mà TypeScript cung cấp để quản lý tập hợp dữ liệu và các hằng số một cách hiệu quả. Chúng ta sẽ khám phá cách làm việc với Mảng (Arrays) với kiểu dữ liệu rõ ràng, tìm hiểu về Tuples cho các mảng có số lượng phần tử cố định và kiểu cụ thể cho từng phần tử. Bên cạnh đó, Enums sẽ được giới thiệu như một cách để tạo ra các nhóm hằng số có tên, giúp code dễ đọc và dễ quản lý hơn. Cuối cùng, chúng ta sẽ bắt đầu định nghĩa kiểu cho các đối tượng (Objects), bao gồm cả các thuộc tính tùy chọn và chỉ đọc.

**Tiêu đề Chapter học**

Làm việc với Mảng, Tuples, Enums và Kiểu Đối Tượng.

**Tóm tắt lý thuyết chính**

1.  **Mảng (Arrays):**
    

Mảng trong TypeScript cho phép bạn lưu trữ một tập hợp các giá trị cùng kiểu. TypeScript cung cấp hai cách chính để khai báo kiểu cho mảng:

**Sử dụng `[]`**

Đặt `[]` sau kiểu dữ liệu của phần tử.

    let numbers: number[] = [1, 2, 3, 4, 5];
    let names: string[] = ["Alice", "Bob", "Charlie"];
    // numbers.push("six"); // Lỗi: Argument of type 'string' is not assignable to parameter of type 'number'.

**Sử dụng kiểu Generic `Array<elementType>`**

    let scores: Array<number> = [100, 90, 85];
    let flags: Array<boolean> = [true, false, true];

Cả hai cách khai báo đều tương đương nhau. Mảng trong TypeScript vẫn giữ nguyên các phương thức của mảng JavaScript như `push`, `pop`, `slice`, `map`, `filter`, etc., và TypeScript sẽ kiểm tra kiểu cho các thao tác này.

1.  **Tuples:**
    
    Tuple là một kiểu mảng đặc biệt cho phép bạn biểu diễn một mảng có số lượng phần tử cố định và kiểu dữ liệu của từng phần tử đã được biết trước. Thứ tự các kiểu trong khai báo tuple rất quan trọng.
    
    **Khai báo Tuple**
    
        // Khai báo một tuple chứa string và number
        let userProfile: [string, number, boolean];
        userProfile = ["John Doe", 30, true]; // OK
        
        // userProfile = [30, "John Doe", true]; // Lỗi: Type 'number' is not assignable to type 'string'.
        // userProfile = ["Jane Doe", 25]; // Lỗi: Tuple type '[string, number, boolean]' of length '3' has no element at index '2'.
    
    **Truy cập phần tử Tuple**
    
    Bạn có thể truy cập các phần tử của tuple bằng chỉ số (index) giống như mảng.
    
        console.log(userProfile[0]); // "John Doe"
        console.log(userProfile[1]); // 30
        // userProfile[3] = "test"; // Lỗi: Tuple type '[string, number, boolean]' of length '3' has no element at index '3'.
    
    Tuple rất hữu ích khi bạn muốn trả về nhiều giá trị từ một hàm và muốn đảm bảo cấu trúc của các giá trị đó.
    
2.  **Enums (Liệt kê):**
    
    Enum là một cách để tạo ra một nhóm các hằng số có tên. Enums giúp làm cho code dễ đọc và dễ hiểu hơn bằng cách sử dụng các tên mô tả thay vì các giá trị số hoặc chuỗi "magic".
    
    **Numeric Enums (Enum số)**
    
    Mặc định, enum là kiểu số. Phần tử đầu tiên có giá trị là `0`, và các phần tử tiếp theo tăng dần.
    
        enum Direction {
            Up,    // 0
            Down,  // 1
            Left,  // 2
            Right  // 3
        }
        
        let currentDirection: Direction = Direction.Up;
        console.log(currentDirection); // Output: 0
        
        if (currentDirection === Direction.Up) {
            console.log("Moving Up!");
        }
    
    Bạn cũng có thể gán giá trị khởi tạo cho phần tử đầu tiên hoặc bất kỳ phần tử nào.
    
        enum HttpStatus {
            OK = 200,
            CREATED = 201,
            BAD_REQUEST = 400,
            NOT_FOUND = 404,
            INTERNAL_SERVER_ERROR // Sẽ là 405 nếu không gán
        }
        console.log(HttpStatus.OK); // Output: 200
        console.log(HttpStatus.NOT_FOUND); // Output: 404
    
    **String Enums (Enum chuỗi)**
    
    Mỗi thành viên của enum chuỗi phải được khởi tạo bằng một giá trị chuỗi hằng.
    
        enum LogLevel {
            INFO = "INFO",
            WARNING = "WARNING",
            ERROR = "ERROR",
            DEBUG = "DEBUG"
        }
        
        function logMessage(level: LogLevel, message: string): void {
            console.log(`[${level}] - ${message}`);
        }
        logMessage(LogLevel.INFO, "User logged in."); // [INFO] - User logged in.
    
    String enums không có tính năng auto-incrementing, nhưng chúng dễ debug hơn vì giá trị của chúng là chuỗi có thể đọc được.
    
3.  **Objects (Kiểu đối tượng ẩn danh):**
    
    TypeScript cho phép bạn định nghĩa "hình dạng" của một đối tượng bằng cách sử dụng kiểu đối tượng ẩn danh (anonymous object types) trực tiếp khi khai báo biến hoặc tham số hàm.
    
    **Khai báo kiểu đối tượng**
    
        let product: { name: string; price: number; inStock: boolean };
        
        product = { name: "Laptop Pro", price: 30000000, inStock: true };
        // product = { name: "Mouse", price: "500000" }; // Lỗi: Type 'string' is not assignable to type 'number' for price.
        // product = { name: "Keyboard" }; // Lỗi: Property 'price' is missing.
    
    **Thuộc tính tùy chọn (`?`)**
    
    Bạn có thể đánh dấu một thuộc tính là tùy chọn bằng cách thêm dấu `?` sau tên thuộc tính.
    
        let employee: {
            id: number;
            name: string;
            department?: string; // department là tùy chọn
        };
        
        employee = { id: 1, name: "Alice" }; // OK
        employee = { id: 2, name: "Bob", department: "Engineering" }; // OK
        console.log(employee.department?.toUpperCase()); // Sử dụng optional chaining '?' để truy cập an toàn
    
    **Thuộc tính chỉ đọc (`readonly`)**
    
    Bạn có thể đánh dấu một thuộc tính là chỉ đọc bằng từ khóa `readonly`. Giá trị của thuộc tính này chỉ có thể được gán khi đối tượng được khởi tạo.
    
        let book: {
            readonly isbn: string;
            title: string;
            author: string;
        };
        
        book = { isbn: "978-3-16-148410-0", title: "TypeScript Deep Dive", author: "Basarat Ali Syed" };
        // book.isbn = "123-4-56-789012-3"; // Lỗi: Cannot assign to 'isbn' because it is a read-only property.
        book.title = "Learning TypeScript"; // OK
    
    Trong các Chapter sau, chúng ta sẽ học về `interface` và `type alias` là những cách mạnh mẽ hơn để định nghĩa kiểu cho đối tượng.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // --- Arrays ---
    let favoriteFruits: string[] = ["Apple", "Banana", "Cherry"];
    let luckyNumbers: Array<number> = [7, 13, 21];
    
    console.log("Favorite Fruits:", favoriteFruits);
    favoriteFruits.push("Orange");
    console.log("Added Orange:", favoriteFruits);
    
    // --- Tuples ---
    type RGBColor = [number, number, number]; // Sử dụng type alias cho tuple (sẽ học kỹ hơn)
    let primaryRed: RGBColor = [255, 0, 0];
    // let invalidColor: RGBColor = [255, 0]; // Lỗi: Độ dài không đúng
    
    console.log("Primary Red (RGB):", primaryRed);
    console.log("Red component:", primaryRed[0]);
    
    // --- Enums ---
    enum OrderStatus {
        PENDING,        // 0
        PROCESSING,     // 1
        SHIPPED,        // 2
        DELIVERED,      // 3
        CANCELLED       // 4
    }
    
    let myOrder: OrderStatus = OrderStatus.PROCESSING;
    console.log("My Order Status (numeric):", myOrder); // Output: 1
    
    if (myOrder === OrderStatus.PROCESSING) {
        console.log("Your order is being processed.");
    }
    
    enum FileAccess {
        Read = "READ",
        Write = "WRITE",
        Execute = "EXECUTE"
    }
    let userAccess: FileAccess = FileAccess.Read;
    console.log("User Access:", userAccess); // Output: "READ"
    
    // --- Objects ---
    let car: {
        readonly make: string;
        model: string;
        year: number;
        color?: string; // Thuộc tính màu là tùy chọn
        startEngine: () => void; // Một phương thức
    };
    
    car = {
        make: "Toyota",
        model: "Camry",
        year: 2023,
        startEngine: function() {
            console.log(`${this.make} ${this.model} engine started!`);
        }
    };
    
    console.log("Car Details:", car);
    car.startEngine();
    // car.make = "Honda"; // Lỗi: 'make' is read-only.
    
    car.color = "Silver";
    console.log("Car with color:", car);
    
    let anotherCar: typeof car = { // Sử dụng typeof để lấy kiểu của car
        make: "Honda",
        model: "Civic",
        year: 2022,
        color: "Black",
        startEngine: () => console.log("Honda Civic engine started!")
    };
    anotherCar.startEngine();

**Danh sách bài tập**

1.  **Trắc nghiệm: Sự khác biệt chính giữa Array và Tuple?**
    

**Tiêu đề**

So sánh Array và Tuple.

**Mô tả**

Hiểu rõ sự khác biệt cơ bản giữa Array và Tuple trong TypeScript.

**Câu hỏi**

Phát biểu nào sau đây mô tả ĐÚNG NHẤT sự khác biệt chính giữa Array và Tuple trong TypeScript?

*   A. Array có thể chứa các phần tử khác kiểu, Tuple chỉ chứa các phần tử cùng kiểu.
    
*   B. Tuple có số lượng phần tử cố định và kiểu của từng phần tử được xác định trước, trong khi Array linh hoạt hơn về kích thước và thường chứa các phần tử cùng kiểu.
    
*   C. Array không thể thay đổi kích thước sau khi tạo, Tuple có thể.
    
*   D. Tuple là một bí danh (alias) cho Array.
    

**Đáp án**

B

1.  **Code: Khai báo mảng và thêm phần tử.**
    
    **Tiêu đề**
    
    Thực hành với Mảng.
    
    **Mô tả**
    
    Khai báo một mảng `studentNames` chứa tên các sinh viên (kiểu `string`). Sau đó, thêm một tên sinh viên mới vào mảng và in ra mảng sau khi thêm.
    
    **Yêu cầu**
    
    *   Khai báo mảng `studentNames` kiểu `string[]` và khởi tạo với ít nhất 2 tên.
        
    *   Sử dụng phương thức `push()` để thêm một tên mới.
        
    *   In mảng `studentNames` ra console.
        
    
    **Giải pháp mẫu**
    
        let studentNames: string[] = ["Lan Anh", "Minh Khôi"];
        console.log("Danh sách sinh viên ban đầu:", studentNames);
        
        studentNames.push("Hoàng Nam");
        console.log("Danh sách sinh viên sau khi thêm:", studentNames);
        // Output:
        // Danh sách sinh viên ban đầu: [ 'Lan Anh', 'Minh Khôi' ]
        // Danh sách sinh viên sau khi thêm: [ 'Lan Anh', 'Minh Khôi', 'Hoàng Nam' ]
    
2.  **Code: Định nghĩa Enum cho trạng thái đơn hàng.**
    
    **Tiêu đề**
    
    Thực hành với Enums.
    
    **Mô tả**
    
    Định nghĩa một `enum` tên là `PaymentStatus` với các giá trị: `UNPAID`, `PAID`, `REFUNDED`, `FAILED`. Gán giá trị số cụ thể cho từng trạng thái nếu muốn (ví dụ: `UNPAID = 10`, `PAID = 20`, …​).
    
    **Yêu cầu**
    
    *   Định nghĩa `enum PaymentStatus`.
        
    *   Khai báo một biến `currentPaymentStatus` kiểu `PaymentStatus` và gán cho nó một giá trị từ enum.
        
    *   In giá trị của `currentPaymentStatus` ra console.
        
    
    **Giải pháp mẫu**
    
        enum PaymentStatus {
            UNPAID = 10,
            PAID = 20,
            REFUNDED = 30,
            FAILED = 40
        }
        
        let currentPaymentStatus: PaymentStatus = PaymentStatus.PAID;
        console.log("Trạng thái thanh toán hiện tại (giá trị số):", currentPaymentStatus); // Output: 20
        
        // Để lấy tên của enum member từ giá trị số:
        console.log("Trạng thái thanh toán hiện tại (tên):", PaymentStatus[currentPaymentStatus]); // Output: PAID
    
3.  **Code: Khai báo Tuple cho thông tin sách.**
    
    **Tiêu đề**
    
    Thực hành với Tuples.
    
    **Mô tả**
    
    Khai báo một `tuple` `bookInfo` để lưu trữ thông tin sách gồm: tiêu đề (string), tác giả (string), và năm xuất bản (number).
    
    **Yêu cầu**
    
    *   Khai báo kiểu cho `bookInfo` là một tuple `[string, string, number]`.
        
    *   Tạo một biến `myBook` kiểu `bookInfo` và gán giá trị cho nó.
        
    *   In ra từng thông tin của sách từ tuple.
        
    
    **Giải pháp mẫu**
    
        type BookInfoTuple = [string, string, number];
        
        let myBook: BookInfoTuple = ["Lập Trình Với TypeScript", "John Doe", 2024];
        
        console.log("Tiêu đề sách:", myBook[0]);
        console.log("Tác giả:", myBook[1]);
        console.log("Năm xuất bản:", myBook[2]);
        
        // myBook[3] = "Something"; // Lỗi: Index out of bounds
        // myBook[0] = 123; // Lỗi: Type 'number' is not assignable to type 'string'.
    
4.  **Code: Định nghĩa kiểu cho đối tượng bài viết.**
    
    **Tiêu đề**
    
    Thực hành với Kiểu Đối Tượng.
    
    **Mô tả**
    
    Định nghĩa kiểu cho một đối tượng `article` có các thuộc tính: `id` (number, chỉ đọc), `title` (string, bắt buộc), `content` (string, bắt buộc), `author` (string, bắt buộc), và `tags` (mảng string, tùy chọn). Tạo một đối tượng `article` dựa trên kiểu đã định nghĩa.
    
    **Yêu cầu**
    
    *   Sử dụng kiểu đối tượng ẩn danh để định nghĩa kiểu cho `article`.
        
    *   Đảm bảo `id` là `readonly`.
        
    *   Đảm bảo `tags` là tùy chọn.
        
    *   Tạo một đối tượng `myArticle` phù hợp với kiểu này.
        
    *   Thử thay đổi `id` của `myArticle` để xem lỗi.
        
    *   Tạo một đối tượng khác không có `tags`.
        
    
    **Giải pháp mẫu**
    
        let myArticle: {
            readonly id: number;
            title: string;
            content: string;
            author: string;
            tags?: string[];
        };
        
        myArticle = {
            id: 101,
            title: "TypeScript là gì?",
            content: "TypeScript là một superset của JavaScript...",
            author: "Dev A",
            tags: ["typescript", "javascript", "programming"]
        };
        
        console.log("Bài viết:", myArticle);
        // myArticle.id = 102; // Lỗi: Cannot assign to 'id' because it is a read-only property.
        myArticle.title = "Giới thiệu TypeScript"; // OK
        
        let anotherArticle: typeof myArticle = {
            id: 102,
            title: "Ưu điểm của TypeScript",
            content: "Kiểm tra kiểu tĩnh, phát hiện lỗi sớm...",
            author: "Dev B"
            // tags không bắt buộc
        };
        console.log("Bài viết khác:", anotherArticle);
        console.log("Tags bài viết khác:", anotherArticle.tags?.join(", ")); // undefined nếu không có tags