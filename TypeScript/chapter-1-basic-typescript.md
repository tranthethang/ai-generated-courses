### Chapter 1: Basic TypeScript

* * *

#### Chapter 1: Giới thiệu TypeScript và Các Kiểu Dữ Liệu Cơ Bản

**Mô tả tổng quát Chapter học**

Chapter học đầu tiên này sẽ là cánh cửa đưa bạn vào thế giới của TypeScript. Chúng ta sẽ cùng tìm hiểu TypeScript là gì, tại sao nó lại trở thành một công cụ mạnh mẽ và phổ biến trong phát triển web hiện đại, đặc biệt là đối với những lập trình viên đã quen thuộc với JavaScript. Bạn sẽ được hướng dẫn cách cài đặt môi trường TypeScript, cấu hình một dự án cơ bản, và quan trọng nhất là làm quen với hệ thống kiểu tĩnh thông qua các kiểu dữ liệu cơ bản nhất. Mục tiêu của Chapter học là giúp bạn hiểu rõ lợi ích của TypeScript và có thể bắt đầu viết những dòng code TypeScript đầu tiên một cách tự tin.

**Tiêu đề Chapter học**

TypeScript là gì? Tại sao nên dùng? Các kiểu dữ liệu cơ bản.

**Tóm tắt lý thuyết chính**

1.  **TypeScript là gì? So sánh với JavaScript.**
    

**Định nghĩa**

TypeScript là một ngôn ngữ lập trình mã nguồn mở được phát triển và bảo trì bởi Microsoft. Nó là một **tập hợp cha (superset) của JavaScript**, có nghĩa là mọi đoạn mã JavaScript hợp lệ cũng là mã TypeScript hợp lệ. TypeScript bổ sung vào JavaScript các tính năng tùy chọn về kiểu tĩnh (static types), cũng như các tính năng hướng đối tượng mạnh mẽ hơn như interfaces, enums, generics, và nhiều hơn nữa.

**Mối quan hệ với JavaScript**

*   TypeScript không thay thế JavaScript. Thay vào đó, nó xây dựng dựa trên JavaScript.
    
*   Code TypeScript (`.ts` hoặc `.tsx` cho React) sẽ được **biên dịch (transpiled)** thành code JavaScript thuần túy (`.js`). Code JavaScript này sau đó có thể chạy trên bất kỳ trình duyệt nào hoặc môi trường Node.js nào hỗ trợ JavaScript.
    
*   Bạn có thể dần dần tích hợp TypeScript vào một dự án JavaScript hiện có.
    

**So sánh nhanh**

**JavaScript**

*   Ngôn ngữ kịch bản (scripting language) động (dynamically typed).
    
*   Kiểu dữ liệu của biến được xác định và kiểm tra tại thời điểm chạy (runtime).
    
*   Linh hoạt, dễ bắt đầu, cộng đồng lớn.
    
*   Dễ gặp lỗi liên quan đến kiểu khi dự án lớn dần (ví dụ: truyền sai kiểu dữ liệu cho hàm, truy cập thuộc tính không tồn tại).
    

**TypeScript**

*   Thêm vào tính năng kiểu tĩnh tùy chọn (optional static typing).
    
*   Kiểu dữ liệu được kiểm tra tại thời điểm biên dịch (compile-time), trước khi chạy code.
    
*   Giúp phát hiện lỗi sớm, làm cho code dễ đọc, dễ hiểu và dễ bảo trì hơn.
    
*   Cung cấp công cụ hỗ trợ phát triển mạnh mẽ hơn (autocompletion, refactoring an toàn).
    

1.  **Ưu điểm của TypeScript:**
    
    **Kiểm tra kiểu tĩnh (Static Typing)**
    
    Đây là lợi ích cốt lõi. Bằng cách khai báo kiểu cho biến, tham số hàm, và giá trị trả về, TypeScript có thể kiểm tra xem bạn có sử dụng chúng một cách chính xác hay không.
    
    ```js
    function greet(name: string) {
        console.log("Hello, " + name.toUpperCase());
    }
    // greet(123); // Lỗi ngay tại đây! Argument of type 'number' is not assignable to parameter of type 'string'.
    greet("Alice"); // OK
    ```
    
    **Phát hiện lỗi sớm (Early Error Detection)**
    
    Việc phát hiện lỗi ở giai đoạn biên dịch giúp tiết kiệm rất nhiều thời gian.
    
    **Cải thiện khả năng đọc hiểu và bảo trì code (Improved Code Readability and Maintainability)**
    
    Kiểu dữ liệu rõ ràng giúp code dễ hiểu hơn.
    
    **Công cụ phát triển tốt hơn (Better Tooling)**
    
    VS Code, WebStorm,…​ tích hợp sâu với TypeScript, cung cấp:
    
    *   Tự động hoàn thành (Autocompletion).
        
    *   Gợi ý kiểu (Type Hinting).
        
    *   Phân tích lỗi trực tiếp (Live Error Reporting).
        
    *   Tái cấu trúc code an toàn (Safer Refactoring).
        
    
    **Hỗ trợ các tính năng JavaScript hiện đại**
    
    Luôn cập nhật với ECMAScript.
    
    **Khả năng mở rộng (Scalability)**
    
    Phù hợp cho các dự án lớn.
    
2.  **Cài đặt TypeScript và cấu hình `tsconfig.json` cơ bản:**
    
    **Yêu cầu**
    
    Node.js và npm/yarn.
    
    **Cài đặt TypeScript (toàn cục)**
    
    ```bash 
    npm install -g typescript
    tsc -v
    ```

    **Biên dịch file TypeScript đầu tiên**
    
    Tạo file `app.ts`:
    
    ```js
    let message: string = "Chào mừng bạn đến với TypeScript!";
    console.log(message);
    ```
    
    Biên dịch: `tsc app.ts` (tạo ra `app.js`) Chạy: `node app.js`
    
    **File cấu hình `tsconfig.json`**
    
    Tạo file: `tsc --init` Một số tùy chọn quan trọng trong `compilerOptions`:
    
    *   `target`: Phiên bản JavaScript output (ví dụ: `"ES2016"`, `"ES5"`).
        
    *   `module`: Hệ thống module output (ví dụ: `"commonjs"`, `"ES6"`).
        
    *   `outDir`: Thư mục chứa file JavaScript output (ví dụ: `"./dist"`).
        
    *   `rootDir`: Thư mục chứa file TypeScript nguồn (ví dụ: `"./src"`).
        
    *   `strict`: Bật tất cả các tùy chọn kiểm tra kiểu nghiêm ngặt (khuyến khích `true`). Bao gồm `noImplicitAny`, `strictNullChecks`.
        
    *   `esModuleInterop`: Cho phép tương tác tốt hơn giữa ES Modules và CommonJS (khuyến khích `true`).
        
    *   `sourceMap`: Tạo source map để debug (`true`). Sau khi có `tsconfig.json`, chạy `tsc` để biên dịch toàn bộ dự án, hoặc `tsc -w` để theo dõi thay đổi.
        
    
3.  **Các kiểu dữ liệu cơ bản (Primitive Types):**
    
    **`string`**
    
    Chuỗi ký tự.
    ```js
    let fullName: string = "Nguyễn Văn A";
    ```

    **`number`**
    
    Số (nguyên và thực).
    ```js
    let age: number = 30;
    ```

    **`boolean`**
    
    Logic (`true` hoặc `false`).
    ```js
    let isActive: boolean = true;
    ```

    **`null`**
    
    Biểu diễn sự vắng mặt cố ý của giá trị đối tượng.
    ```js
    let userAddress: string | null = null; // Cần union type với strictNullChecks
    ```

    **`undefined`**
    
    Biến chưa được gán giá trị.
    ```js
    let lastLoginDate: Date | undefined;
    ```

    **`any`**
    
    Kiểu "thoát hiểm", cho phép bất kỳ giá trị nào và vô hiệu hóa kiểm tra kiểu. **Hạn chế sử dụng.**
    ```js
    let anything: any = "Đây là một chuỗi";
    anything = 100;
    anything.doSomethingNonExistent(); // Không lỗi biên dịch, lỗi runtime
    ```

    **`unknown`**
    
    An toàn hơn `any`. Nhận bất kỳ giá trị nào, nhưng phải kiểm tra kiểu (type narrowing) hoặc ép kiểu trước khi thao tác.
    ```js
    let valueFromApi: unknown = "Dữ liệu";
    // console.log(valueFromApi.length); // Lỗi
    if (typeof valueFromApi === "string") {
        console.log(valueFromApi.toUpperCase()); // OK
    }
    ```

    **`void`**
    
    Kiểu trả về của hàm không trả về giá trị.
    ```js
    function logMessage(message: string): void {
        console.log(message);
    }
    ``` 

    **`never`**
    
    Kiểu của giá trị không bao giờ xảy ra (hàm luôn throw lỗi, vòng lặp vô tận).
    ```js
    function throwError(message: string): never {
        throw new Error(message);
    }
    ``` 

4.  **Khai báo biến với kiểu dữ liệu:**
    
    Sử dụng `let` và `const`.
    
    **Cú pháp khai báo kiểu tường minh**
    ```js
    let studentName: string = "Bùi Văn C";
    const studentAge: number = 22;
    ```
    
    **Suy luận kiểu (Type Inference)**
    
    TypeScript tự suy luận kiểu nếu gán giá trị ngay khi khai báo.
    ```js 
    let teacherName = "Trần Thị D"; // TypeScript suy luận là string
    // teacherName = 100; // Lỗi
    ```

    Khai báo tường minh vẫn được khuyến khích cho tham số hàm, giá trị trả về và các cấu trúc phức tạp.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**
```js 
    // 1. Khai báo biến với các kiểu cơ bản và Type Inference
    let frameworkName: string = "TypeScript";
    let version = 5.3; // Kiểu number được suy luận
    let isLearning: boolean = true;
    let projectDescription: string | undefined; // Khai báo tường minh nếu chưa gán giá trị
    
    console.log(`Chào mừng đến với ${frameworkName} phiên bản ${version}!`);
    console.log(`Bạn đang học? ${isLearning}`);
    
    // 2. Kiểu null và undefined (với strictNullChecks)
    let authorName: string | null = "Một tác giả";
    console.log(`Tác giả: ${authorName}`);
    authorName = null;
    console.log(`Tác giả sau khi gán null: ${authorName}`);
    
    let chapterCount: number | undefined;
    console.log(`Số chương: ${chapterCount}`); // undefined
    
    // 3. Kiểu any - Nên hạn chế
    let flexibleVar: any = "Có thể là bất cứ thứ gì";
    console.log(`flexibleVar (string): ${flexibleVar}`);
    flexibleVar = 2025;
    console.log(`flexibleVar (number): ${flexibleVar}`);
    flexibleVar = { topic: "TypeScript Basics" };
    console.log(`flexibleVar (object): ${flexibleVar.topic}`);
    
    // 4. Kiểu unknown - An toàn hơn any
    let userInput: unknown;
    userInput = "Đây là dữ liệu người dùng nhập";
    
    if (typeof userInput === "string") {
        console.log(`Độ dài chuỗi userInput: ${userInput.length}`);
    } else {
        console.log("userInput không phải là chuỗi.");
    }
    
    userInput = 12345;
    if (typeof userInput === "number") {
        console.log(`userInput nhân 2: ${userInput * 2}`);
    }
    
    // 5. Kiểu void cho hàm không trả về giá trị
    function displayCurrentTime(): void {
        const now = new Date();
        console.log(`Thời gian hiện tại: ${now.toLocaleTimeString()}`);
    }
    displayCurrentTime();
    
    // 6. Kiểu never cho hàm không bao giờ trả về bình thường
    function criticalError(message: string): never {
        console.error("Lỗi nghiêm trọng!");
        throw new Error(message);
    }
    
    // 7. Ví dụ về việc TypeScript phát hiện lỗi kiểu
    function calculateSum(a: number, b: number): number {
        return a + b;
    }
    let num1: number = 10;
    let num2: number = 5;
    // let textNum: string = "7";
    
    console.log(`Tổng ${num1} và ${num2} là: ${calculateSum(num1, num2)}`);
    // console.log(`Tổng ${num1} và ${textNum} là: ${calculateSum(num1, textNum)}`); // Sẽ báo lỗi
```

**Danh sách bài tập**

1.  **Trắc nghiệm: Mục đích chính của TypeScript?**
    

**Tiêu đề**

Câu hỏi về mục đích của TypeScript.

**Mô tả**

Chọn đáp án đúng nhất mô tả mục đích chính của việc sử dụng TypeScript.

**Câu hỏi**

Mục đích chính của TypeScript là gì?

*   A. Để viết code chạy nhanh hơn JavaScript.
    
*   B. Để thêm kiểu tĩnh vào JavaScript, giúp phát hiện lỗi sớm và cải thiện khảibility bảo trì code.
    
*   C. Để thay thế hoàn toàn JavaScript trong phát triển web.
    
*   D. Để giảm kích thước file JavaScript sau khi biên dịch.
    

**Đáp án**

B

1.  **Trắc nghiệm: Sự khác biệt giữa `any` và `unknown`?**
    
    **Tiêu đề**
    
    So sánh `any` và `unknown`.
    
    **Mô tả**
    
    Hiểu rõ sự khác biệt cơ bản về tính an toàn kiểu giữa `any` và `unknown`.
    
    **Câu hỏi**
    
    Phát biểu nào sau đây mô tả ĐÚNG NHẤT sự khác biệt chính giữa kiểu `any` và `unknown` trong TypeScript?
    
    *   A. Cả `any` và `unknown` đều không cho phép thực hiện bất kỳ thao tác nào trên biến nếu chưa kiểm tra kiểu.
        
    *   B. Biến kiểu `any` cho phép mọi thao tác mà không cần kiểm tra kiểu, trong khi biến kiểu `unknown` yêu cầu phải kiểm tra hoặc ép kiểu trước khi thực hiện thao tác.
        
    *   C. `unknown` là một bí danh (alias) của `any`.
        
    *   D. Biến kiểu `unknown` chỉ có thể nhận giá trị `null` hoặc `undefined`, trong khi `any` có thể nhận bất kỳ giá trị nào.
        
    
    **Đáp án**
    
    B
    
2.  **Code: Khai báo thông tin sản phẩm.**
    
    **Tiêu đề**
    
    Thực hành khai báo biến với kiểu dữ liệu cơ bản.
    
    **Mô tả**
    
    Khai báo một số biến để lưu trữ thông tin về một sản phẩm, sử dụng các kiểu dữ liệu cơ bản đã học (`string`, `number`, `boolean`). Hãy đảm bảo khai báo kiểu tường minh.
    
    **Yêu cầu**
    
    *   Khai báo biến `productName` kiểu `string` và gán giá trị là "Laptop XYZ".
        
    *   Khai báo biến `productPrice` kiểu `number` và gán giá trị là `25000000`.
        
    *   Khai báo biến `isAvailable` kiểu `boolean` và gán giá trị là `true`.
        
    *   In các giá trị này ra console.
        
    
    **Giải pháp mẫu**
    ```js
    let productName: string = "Laptop XYZ";
    let productPrice: number = 25000000;
    let isAvailable: boolean = true;
    
    console.log(`Tên sản phẩm: ${productName}`);
    console.log(`Giá: ${productPrice}`);
    console.log(`Còn hàng: ${isAvailable}`);
    ```
    
3.  **Code: Viết hàm chào hỏi với kiểu.**
    
    **Tiêu đề**
    
    Thực hành viết hàm với kiểu tham số và kiểu trả về.
    
    **Mô tả**
    
    Viết một hàm `sayHello` nhận vào một tham số `userName` kiểu `string` và không trả về giá trị nào (`void`). Hàm này sẽ in ra lời chào "Xin chào, \[userName\]!" lên console.
    
    **Giải pháp mẫu**
    ```js
    function sayHello(userName: string): void {
        console.log(`Xin chào, ${userName}!`);
    }
    
    sayHello("Mai");
    // sayHello(123); // Thử bỏ comment để xem lỗi
    ```

4.  **Code: Sửa lỗi kiểu trong đoạn code sau.**
    
    **Tiêu đề**
    
    Nhận biết và sửa lỗi kiểu.
    
    **Mô tả**
    
    Đoạn code JavaScript dưới đây có một lỗi tiềm ẩn liên quan đến kiểu dữ liệu. Hãy thêm các chú thích kiểu cần thiết và sửa lỗi.
    
    **Đoạn code gốc**
    ```js
    // function calculateTotalPrice(quantity, price) {
    //     return quantity * price;
    // }
    // let itemCount = "5";
    // let itemPrice = 10000;
    // let total = calculateTotalPrice(itemCount, itemPrice);
    // console.log("Tổng tiền:", total);
    ```
    **Giải pháp mẫu**
    ```js
    function calculateTotalPrice(quantity: number, price: number): number {
        return quantity * price;
    }
    
    let itemCount: number = 5; // Sửa thành number
    // Hoặc: let itemCountString: string = "5"; let itemCount: number = parseInt(itemCountString);
    let itemPrice: number = 10000;
    let total: number = calculateTotalPrice(itemCount, itemPrice);
    
    console.log("Tổng tiền:", total);
    ```
        