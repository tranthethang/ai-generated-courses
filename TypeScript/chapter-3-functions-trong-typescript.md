#### Chapter 3: Functions trong TypeScript

**Mô tả tổng quát Chapter học**

Chapter học này tập trung vào cách TypeScript nâng cao khả năng làm việc với hàm so với JavaScript. Chúng ta sẽ tìm hiểu cách định nghĩa kiểu cho tham số và giá trị trả về của hàm, khám phá các loại tham số đặc biệt như tham số tùy chọn, tham số mặc định, và rest parameters. Ngoài ra, khái niệm về kiểu hàm (function types) và nạp chồng hàm (function overloads) cũng sẽ được giới thiệu, giúp bạn viết code hàm linh hoạt và an toàn hơn.

**Tiêu đề Chapter học**

Functions Nâng Cao: Kiểu Trả Về, Tham Số và Overloads.

**Tóm tắt lý thuyết chính**

1.  **Định nghĩa kiểu cho tham số và giá trị trả về:**
    

TypeScript cho phép bạn chỉ định rõ ràng kiểu dữ liệu cho từng tham số của hàm và kiểu dữ liệu mà hàm đó sẽ trả về. Điều này giúp bắt lỗi sớm và làm cho ý định của hàm trở nên rõ ràng hơn.

    function add(x: number, y: number): number {
        return x + y;
    }
    
    let sum: number = add(5, 10); // sum sẽ là 15
    // add(5, "10"); // Lỗi: Argument of type 'string' is not assignable to parameter of type 'number'.

1.  **Kiểu `void` cho hàm không trả về giá trị:**
    
    Nếu một hàm không trả về bất kỳ giá trị nào (hoặc trả về `undefined` một cách ngầm định), bạn nên sử dụng kiểu `void` cho giá trị trả về của nó.
    
        function logMessage(message: string): void {
            console.log(message);
            // Không có lệnh return hoặc chỉ có return;
        }
        logMessage("Đây là một thông báo.");
    
2.  **Tham số tùy chọn (`?`) và tham số mặc định:**
    
    **Tham số tùy chọn**
    
    Bạn có thể đánh dấu một tham số là tùy chọn bằng cách thêm dấu `?` sau tên tham số. Tham số tùy chọn phải đứng sau các tham số bắt buộc. Bên trong hàm, giá trị của tham số tùy chọn sẽ là `undefined` nếu nó không được truyền vào khi gọi hàm.
    
        function greetOptional(name: string, greeting?: string): string {
            if (greeting) {
                return `${greeting}, ${name}!`;
            } else {
                return `Hello, ${name}!`;
            }
        }
        console.log(greetOptional("Alice")); // "Hello, Alice!"
        console.log(greetOptional("Bob", "Hi")); // "Hi, Bob!"
    
    **Tham số mặc định**
    
    Bạn có thể gán giá trị mặc định cho một tham số. Nếu khi gọi hàm, tham số đó không được truyền giá trị (hoặc truyền `undefined`), nó sẽ nhận giá trị mặc định. Tham số có giá trị mặc định được coi là tùy chọn.
    
        function greetDefault(name: string, greeting: string = "Hello"): string {
            return `${greeting}, ${name}!`;
        }
        console.log(greetDefault("Charlie")); // "Hello, Charlie!"
        console.log(greetDefault("David", "Good morning")); // "Good morning, David!"
    
3.  **Rest Parameters (`…​`):**
    
    Rest parameters cho phép một hàm chấp nhận một số lượng không xác định các tham số dưới dạng một mảng. Rest parameter phải là tham số cuối cùng trong danh sách tham số và được khai báo với kiểu là một mảng.
    
        function sumAllNumbers(...numbers: number[]): number {
            let total = 0;
            for (const num of numbers) {
                total += num;
            }
            return total;
        }
        console.log(sumAllNumbers(1, 2, 3)); // 6
        console.log(sumAllNumbers(10, 20, 30, 40, 50)); // 150
    
4.  **Function Types (Kiểu hàm):**
    
    Bạn có thể định nghĩa một "kiểu hàm" để mô tả chữ ký (signature) của một hàm, bao gồm kiểu của các tham số và kiểu trả về. Điều này rất hữu ích khi truyền hàm như một callback hoặc gán hàm cho biến.
    
        let multiply: (a: number, b: number) => number;
        
        multiply = function(x: number, y: number): number {
            return x * y;
        };
        // Hoặc dùng arrow function
        // multiply = (x, y) => x * y;
        
        console.log(multiply(5, 4)); // 20
        
        // multiply = function(message: string): void { console.log(message); }; // Lỗi: Kiểu không tương thích
    
5.  **Arrow Functions và kiểu:**
    
    Arrow functions trong TypeScript vẫn giữ nguyên cú pháp như JavaScript ES6. TypeScript có thể suy luận kiểu cho arrow functions dựa trên ngữ cảnh, hoặc bạn có thể khai báo kiểu tường minh.
    
        const subtract = (x: number, y: number): number => {
            return x - y;
        };
        
        // TypeScript có thể suy luận kiểu nếu gán cho biến đã có kiểu hàm
        let divide: (a: number, b: number) => number;
        divide = (n1, n2) => n1 / n2; // n1, n2 tự động được suy luận là number
    
6.  **Function Overloads (Nạp chồng hàm):**
    
    Nạp chồng hàm cho phép bạn định nghĩa nhiều chữ ký hàm cho cùng một tên hàm. Hàm thực thi (implementation signature) phải tương thích với tất cả các chữ ký nạp chồng. Trình biên dịch sẽ chọn chữ ký nạp chồng phù hợp nhất dựa trên các đối số được truyền vào khi gọi hàm.
    
        // Chữ ký nạp chồng (Overload signatures)
        function processInput(input: string): string;
        function processInput(input: number): number;
        function processInput(input: string[]): string[];
        
        // Chữ ký thực thi (Implementation signature) - phải bao quát tất cả overload
        function processInput(input: string | number | string[]): string | number | string[] {
            if (typeof input === "string") {
                return input.toUpperCase();
            } else if (typeof input === "number") {
                return input * 2;
            } else if (Array.isArray(input)) {
                return input.map(item => item.trim());
            }
            // Trường hợp này không nên xảy ra nếu các overload được định nghĩa đúng
            throw new Error("Invalid input type");
        }
        
        console.log(processInput("hello"));   // "HELLO"
        console.log(processInput(10));      // 20
        console.log(processInput([" one ", " two"])); // ["one", "two"]
        
        // console.log(processInput(true)); // Lỗi: No overload matches this call.
    
    Chữ ký thực thi không được gọi trực tiếp từ bên ngoài. Nó chỉ được dùng để TypeScript kiểm tra tính hợp lệ của các chữ ký nạp chồng.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // Hàm cơ bản với kiểu tham số và trả về
    function createGreeting(name: string, age: number): string {
        return `Hello, my name is ${name} and I am ${age} years old.`;
    }
    console.log(createGreeting("Elena", 28));
    
    // Hàm với tham số tùy chọn và mặc định
    function displayProfile(username: string, bio?: string, theme: string = "light"): void {
        console.log(`Username: ${username}`);
        if (bio) {
            console.log(`Bio: ${bio}`);
        }
        console.log(`Theme: ${theme}`);
    }
    displayProfile("tsDev");
    displayProfile("jsFan", "Loves JavaScript and learning TypeScript.");
    displayProfile("coderX", "Full-stack developer.", "dark");
    
    // Hàm sử dụng rest parameters
    function gatherSkills(primarySkill: string, ...otherSkills: string[]): void {
        console.log(`Primary Skill: ${primarySkill}`);
        if (otherSkills.length > 0) {
            console.log(`Other Skills: ${otherSkills.join(", ")}`);
        }
    }
    gatherSkills("TypeScript", "JavaScript", "React", "Node.js");
    gatherSkills("Problem Solving");
    
    // Định nghĩa kiểu hàm và sử dụng
    type StringManipulator = (input: string) => string;
    
    const toUpperCaseConverter: StringManipulator = (text) => text.toUpperCase();
    const toLowerCaseConverter: StringManipulator = (text) => text.toLowerCase();
    
    function applyStringOperation(text: string, manipulator: StringManipulator): string {
        return manipulator(text);
    }
    console.log(applyStringOperation("Hello World", toUpperCaseConverter)); // "HELLO WORLD"
    console.log(applyStringOperation("Hello World", toLowerCaseConverter)); // "hello world"
    
    // Function Overloads ví dụ phức tạp hơn
    interface Coordinate { x: number; y: number; }
    
    function parseCoordinate(obj: Coordinate): Coordinate;
    function parseCoordinate(x: number, y: number): Coordinate;
    function parseCoordinate(arg1: unknown, arg2?: unknown): Coordinate {
        let coord: Coordinate = { x: 0, y: 0 };
    
        if (typeof arg1 === 'object' && arg1 !== null) {
            coord = { ...(arg1 as Coordinate) }; // Ép kiểu (type assertion)
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
            coord = { x: arg1, y: arg2 };
        } else {
            throw new Error("Invalid arguments for parseCoordinate");
        }
        return coord;
    }
    
    console.log(parseCoordinate({ x: 10, y: 20 })); // { x: 10, y: 20 }
    console.log(parseCoordinate(5, 15));           // { x: 5, y: 15 }
    // console.log(parseCoordinate("5", "15")); // Lỗi: No overload matches this call.

**Danh sách bài tập**

1.  **Trắc nghiệm: Tham số `…​args: string[]` trong một hàm có ý nghĩa gì?**
    

**Tiêu đề**

Hiểu về Rest Parameters.

**Mô tả**

Chọn mô tả đúng nhất cho cú pháp rest parameters.

**Câu hỏi**

Trong một hàm TypeScript, khai báo tham số `…​args: string[]` có ý nghĩa gì?

*   A. Hàm chỉ chấp nhận một tham số duy nhất là một mảng các chuỗi.
    
*   B. Hàm chấp nhận một số lượng bất kỳ các tham số kiểu chuỗi, và chúng được gom lại thành một mảng tên là `args`.
    
*   C. `args` là một tham số tùy chọn kiểu mảng chuỗi.
    
*   D. Hàm yêu cầu ít nhất một tham số kiểu chuỗi, các tham số sau đó có thể là bất kỳ kiểu gì.
    

**Đáp án**

B

1.  **Code: Viết hàm tính diện tích hình chữ nhật.**
    
    **Tiêu đề**
    
    Thực hành định nghĩa kiểu cho hàm.
    
    **Mô tả**
    
    Viết một hàm `calculateRectangleArea` nhận vào hai tham số `width` và `height` (cả hai đều là kiểu `number`), và trả về diện tích của hình chữ nhật (kiểu `number`).
    
    **Yêu cầu**
    
    *   Định nghĩa hàm `calculateRectangleArea` với kiểu tham số và kiểu trả về rõ ràng.
        
    *   Gọi hàm với một vài giá trị và in kết quả.
        
    
    **Giải pháp mẫu**
    
        function calculateRectangleArea(width: number, height: number): number {
            if (width <= 0 || height <= 0) {
                // Có thể throw error hoặc trả về một giá trị đặc biệt như 0 hoặc NaN
                console.warn("Width and height must be positive numbers.");
                return 0;
            }
            return width * height;
        }
        
        console.log("Diện tích (5x10):", calculateRectangleArea(5, 10));    // 50
        console.log("Diện tích (7x3):", calculateRectangleArea(7, 3));      // 21
        console.log("Diện tích (-2x5):", calculateRectangleArea(-2, 5));   // Cảnh báo và trả về 0
    
2.  **Code: Viết hàm tạo thông tin người dùng với tham số mặc định.**
    
    **Tiêu đề**
    
    Thực hành với tham số mặc định.
    
    **Mô tả**
    
    Viết một hàm `createUserInfo` nhận vào `userId` (number, bắt buộc), `username` (string, bắt buộc) và `role` (string, có giá trị mặc định là "user"). Hàm này trả về một chuỗi mô tả thông tin người dùng.
    
    **Yêu cầu**
    
    *   Định nghĩa hàm `createUserInfo` với các tham số và kiểu như mô tả.
        
    *   Gọi hàm với đủ tham số và gọi hàm không truyền `role` để kiểm tra giá trị mặc định.
        
    
    **Giải pháp mẫu**
    
        function createUserInfo(userId: number, username: string, role: string = "user"): string {
            return `User ID: ${userId}, Username: ${username}, Role: ${role}`;
        }
        
        console.log(createUserInfo(1, "john.doe")); // Role sẽ là "user"
        console.log(createUserInfo(2, "jane.admin", "administrator"));
    
3.  **Code: Định nghĩa kiểu hàm và sử dụng.**
    
    **Tiêu đề**
    
    Thực hành với Function Types.
    
    **Mô tả**
    
    *   1\. Định nghĩa một kiểu hàm tên là `NumberOperation` nhận vào hai số và trả về một số.
        
    *   2\. Tạo hai biến kiểu `NumberOperation`: một biến `addOperation` gán cho nó một arrow function thực hiện phép cộng, và một biến `subtractOperation` gán cho nó một arrow function thực hiện phép trừ.
        
    *   3\. Gọi và in kết quả của hai biến hàm này.
        
    
    **Giải pháp mẫu**
    
        type NumberOperation = (a: number, b: number) => number;
        
        const addOperation: NumberOperation = (x, y) => x + y;
        const subtractOperation: NumberOperation = (x, y) => x - y;
        
        console.log("5 + 3 =", addOperation(5, 3));       // 8
        console.log("10 - 4 =", subtractOperation(10, 4)); // 6
    
4.  **Code: Viết hàm với Function Overloads.**
    
    **Tiêu đề**
    
    Thực hành với Function Overloads.
    
    **Mô tả**
    
    Viết hàm `formatData` sử dụng function overloads.
    
    *   Nếu đầu vào là `string`, trả về chuỗi đó viết hoa.
        
    *   Nếu đầu vào là `number`, trả về chuỗi "Number: \[số đó\]".
        
    *   Nếu đầu vào là `boolean`, trả về chuỗi "Boolean: \[true/false\]".
        
    
    **Yêu cầu**
    
    *   Viết 3 chữ ký nạp chồng cho các trường hợp trên.
        
    *   Viết một chữ ký thực thi bao quát tất cả.
        
    *   Gọi hàm với các kiểu đầu vào khác nhau và in kết quả.
        
    
    **Giải pháp mẫu**
    
        // Overload signatures
        function formatData(input: string): string;
        function formatData(input: number): string;
        function formatData(input: boolean): string;
        
        // Implementation signature
        function formatData(input: string | number | boolean): string {
            if (typeof input === "string") {
                return input.toUpperCase();
            } else if (typeof input === "number") {
                return `Number: ${input}`;
            } else if (typeof input === "boolean") {
                return `Boolean: ${input}`;
            }
            // Fallback, không nên xảy ra nếu overload đúng
            const exhaustiveCheck: never = input;
            return `Unknown type: ${exhaustiveCheck}`;
        }
        
        console.log(formatData("typescript")); // "TYPESCRIPT"
        console.log(formatData(2024));        // "Number: 2024"
        console.log(formatData(true));         // "Boolean: true"
        // console.log(formatData({})); // Lỗi: No overload matches this call.