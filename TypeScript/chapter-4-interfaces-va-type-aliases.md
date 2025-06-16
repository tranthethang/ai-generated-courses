#### Chapter 4: Interfaces và Type Aliases

**Mô tả tổng quát Chapter học**

Chapter học này giới thiệu hai công cụ cực kỳ quan trọng trong TypeScript để định nghĩa "hình dạng" (shape) của dữ liệu: `Interface` và `Type Alias`. Chúng ta sẽ tìm hiểu cách sử dụng chúng để tạo ra các hợp đồng (contracts) cho đối tượng, hàm, và thậm chí là class. Chapter học cũng sẽ so sánh sự khác biệt và các trường hợp sử dụng phù hợp của từng loại, giúp bạn lựa chọn công cụ tốt nhất cho từng tình huống cụ thể.

**Tiêu đề Chapter học**

Định Hình Dữ Liệu: Interfaces và Type Aliases.

**Tóm tắt lý thuyết chính**

1.  **Interfaces:**
    

Interface trong TypeScript là một cách mạnh mẽ để định nghĩa một "hợp đồng" mà một đối tượng hoặc một class phải tuân theo. Nó mô tả hình dạng của một đối tượng, bao gồm tên và kiểu của các thuộc tính và phương thức.

**Định nghĩa Interface cho đối tượng**

    interface User {
        id: number;
        username: string;
        email: string;
        isActive: boolean;
    }
    
    let user1: User = {
        id: 1,
        username: "typescriptFan",
        email: "fan@example.com",
        isActive: true
    };
    // user1.id = 2; // OK, trừ khi id là readonly
    // let user2: User = { id: 2, username: "jsFan" }; // Lỗi: Property 'email' and 'isActive' is missing.

**Thuộc tính tùy chọn (`?`)**

    interface Profile {
        userId: number;
        bio?: string; // bio là tùy chọn
        websiteUrl?: string;
    }
    
    let profile1: Profile = { userId: 101 };
    let profile2: Profile = { userId: 102, bio: "Loves coding!", websiteUrl: "http://example.com" };

**Thuộc tính chỉ đọc (`readonly`)**

    interface Point {
        readonly x: number;
        readonly y: number;
    }
    
    let p1: Point = { x: 10, y: 20 };
    // p1.x = 5; // Lỗi: Cannot assign to 'x' because it is a read-only property.

**Index Signatures (Chữ ký chỉ mục)**

Cho phép định nghĩa kiểu cho các thuộc tính không được biết trước tên.

    interface StringDictionary {
        [key: string]: string; // Bất kỳ thuộc tính nào có key là string, value cũng phải là string
        length: number; // Có thể có các thuộc tính đã biết tên, nhưng kiểu phải tương thích
                        // Ví dụ này sẽ lỗi vì length là number, không phải string.
                        // Cần sửa: [key: string]: string | number; hoặc bỏ length.
    }
    /*
    // Sửa lại ví dụ StringDictionary cho đúng:
    interface StringValueDictionary {
        [key: string]: string;
    }
    let myDict: StringValueDictionary = {
        "prop1": "value1",
        "prop2": "value2"
    };
    // myDict.prop3 = 123; // Lỗi: Type 'number' is not assignable to type 'string'.
    
    interface MixedDictionary {
        [index: string]: string | number; // Key là string, value là string hoặc number
        length: number; // OK, length là number, tương thích với string | number
        name: string;   // OK, name là string, tương thích với string | number
    }
    let config: MixedDictionary = { length: 10, name: "AppConfig", "version": "1.0" };
    */

**Function Types trong Interfaces (Kiểu hàm trong Interface)**

Interface cũng có thể mô tả kiểu của một hàm.

    interface SearchFunction {
        (source: string, subString: string): boolean;
    }
    
    let mySearch: SearchFunction;
    mySearch = function(src, sub) { // TypeScript suy luận kiểu của src và sub
        return src.search(sub) > -1;
    };
    console.log(mySearch("hello world", "world")); // true

**Extending Interfaces (Kế thừa Interface)**

Interface có thể kế thừa từ một hoặc nhiều interface khác, giúp tái sử dụng và mở rộng các định nghĩa kiểu.

    interface Shape {
        color: string;
    }
    
    interface Square extends Shape { // Square kế thừa Shape
        sideLength: number;
    }
    
    let mySquare: Square = { color: "blue", sideLength: 10 };
    console.log(mySquare.color); // "blue"
    console.log(mySquare.sideLength); // 10

**Class Implementing Interface (Lớp triển khai Interface)**

Class có thể triển khai một interface, đảm bảo class đó có tất cả các thuộc tính và phương thức được định nghĩa trong interface.

    interface ClockInterface {
        currentTime: Date;
        setTime(d: Date): void;
    }
    
    class DigitalClock implements ClockInterface {
        currentTime: Date = new Date();
        setTime(d: Date) {
            this.currentTime = d;
        }
        constructor(h: number, m: number) { /* ... */ }
    }

1.  **Type Aliases (Bí danh kiểu):**
    
    Type alias cho phép bạn tạo một tên mới (bí danh) cho một kiểu hiện có. Type alias có thể được sử dụng cho các kiểu nguyên thủy, union types, intersection types, tuples, và bất kỳ kiểu nào khác mà bạn có thể định nghĩa.
    
    **Type Alias cho kiểu nguyên thủy**
    
        type MyString = string;
        let pageTitle: MyString = "Homepage";
    
    **Type Alias cho Union Types**
    
        type StringOrNumber = string | number;
        let input: StringOrNumber = "test";
        input = 123; // OK
    
    **Type Alias cho kiểu đối tượng**
    
    (Tương tự như interface)
    
        type Point2D = {
            x: number;
            y: number;
            label?: string; // Thuộc tính tùy chọn
        };
        
        let p2: Point2D = { x: 5, y: 15, label: "Center" };
    
    **Type Alias cho kiểu hàm**
    
        type GreetHandler = (name: string) => void;
        const greetUser: GreetHandler = (name) => console.log(`Hello, ${name}!`);
        greetUser("TypeScript User");
    
    **Type Alias với Generics**
    
    (Sẽ học kỹ hơn ở Chapter Generics)
    
        type Container<T> = { value: T };
        let numberContainer: Container<number> = { value: 100 };
    
2.  **Sự khác biệt giữa Interfaces và Type Aliases:**
    
    Cả interface và type alias đều có thể được sử dụng để mô tả hình dạng của đối tượng và có nhiều điểm tương đồng. Tuy nhiên, có một số khác biệt quan trọng:
    
    **Declaration Merging (Hợp nhất khai báo)**
    
    *   **Interfaces**: Có thể được hợp nhất. Nếu bạn định nghĩa một interface cùng tên nhiều lần, TypeScript sẽ hợp nhất các định nghĩa đó lại thành một.
        
    
        interface Box {
            height: number;
            width: number;
        }
        interface Box { // Hợp nhất với Box ở trên
            scale: number;
            // height: string; // Lỗi: Subsequent property declarations must have the same type.
        }
        let box: Box = { height: 5, width: 10, scale: 1 };
    
    *   **Type Aliases**: Không thể hợp nhất. Nếu bạn cố gắng định nghĩa một type alias cùng tên nhiều lần, TypeScript sẽ báo lỗi.
        
    
    // type Window = { title: string };
    // type Window = { ts: boolean }; // Lỗi: Duplicate identifier 'Window'.
    
    **Extending/Implementing**
    
    *   **Interfaces**: Có thể được `extends` bởi interface khác và `implements` bởi class. Cú pháp rõ ràng hơn cho lập trình hướng đối tượng.
        
    *   **Type Aliases**: Có thể mô phỏng kế thừa bằng cách sử dụng intersection types (`&`), nhưng cú pháp không trực quan bằng `extends`. Class không thể `implements` một type alias định nghĩa hình dạng đối tượng (nhưng có thể implements type alias định nghĩa union type hoặc intersection type của các class).
        
    
    **Khi nào dùng cái nào?**
    
    *   **Ưu tiên `interface`** khi định nghĩa hình dạng của đối tượng hoặc khi bạn muốn tận dụng declaration merging hoặc muốn class triển khai. Đây là khuyến nghị chung của cộng đồng và tài liệu TypeScript cho các trường hợp này.
        
    *   **Sử dụng `type alias`** khi bạn cần định nghĩa bí danh cho các kiểu nguyên thủy, union types, intersection types, tuples, hoặc các kiểu phức tạp khác mà interface không thể biểu diễn dễ dàng (ví dụ: mapped types, conditional types - sẽ học sau).
        
    *   Nhiều trường hợp, bạn có thể sử dụng cả hai. Ví dụ, để định nghĩa hình dạng của một đối tượng, cả interface và type alias đều làm được.
        
    
        // Dùng Interface
        interface AnimalInterface {
          name: string;
          makeSound(): void;
        }
        
        // Dùng Type Alias
        type AnimalType = {
          name: string;
          makeSound(): void;
        };
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // ---- Interfaces ----
    interface Vehicle {
        readonly id: string; // ID không thể thay đổi sau khi tạo
        brand: string;
        model: string;
        year: number;
        start(): void;
        stop(): void;
        getDetails(): string;
        serviceDate?: Date; // Ngày bảo dưỡng có thể không có
    }
    
    interface ElectricVehicle extends Vehicle {
        batteryLevel: number; // %
        charge(): void;
    }
    
    class Car implements Vehicle {
        readonly id: string;
        brand: string;
        model: string;
        year: number;
        serviceDate?: Date;
    
        constructor(id: string, brand: string, model: string, year: number) {
            this.id = id;
            this.brand = brand;
            this.model = model;
            this.year = year;
        }
    
        start(): void {
            console.log(`${this.brand} ${this.model} started.`);
        }
    
        stop(): void {
            console.log(`${this.brand} ${this.model} stopped.`);
        }
    
        getDetails(): string {
            return `ID: ${this.id}, Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`;
        }
    }
    
    let myCar = new Car("CAR-001", "Toyota", "Corolla", 2022);
    console.log(myCar.getDetails());
    myCar.start();
    
    let myTesla: ElectricVehicle = {
        id: "EV-002",
        brand: "Tesla",
        model: "Model S",
        year: 2023,
        batteryLevel: 85,
        start: () => console.log("Tesla Model S started silently."),
        stop: () => console.log("Tesla Model S stopped."),
        getDetails: function() { return `EV: ${this.brand} ${this.model}, Battery: ${this.batteryLevel}%`; },
        charge: () => console.log("Charging Tesla Model S...")
    };
    console.log(myTesla.getDetails());
    myTesla.charge();
    
    
    // ---- Type Aliases ----
    type UserID = string | number; // Union type
    type ProductStatus = "Available" | "OutOfStock" | "Discontinued"; // Literal union type
    
    type Product = {
        sku: string;
        name: string;
        price: number;
        status: ProductStatus;
        tags?: string[]; // Optional array of strings
    };
    
    let product1: Product = {
        sku: "SKU123",
        name: "Awesome Gadget",
        price: 99.99,
        status: "Available",
        tags: ["tech", "gadget"]
    };
    
    let product2: Product = {
        sku: "SKU456",
        name: "Old Gadget",
        price: 19.99,
        status: "Discontinued"
        // tags is optional
    };
    
    function displayProduct(product: Product): void {
        console.log(`Product: ${product.name} (SKU: ${product.sku})`);
        console.log(`Price: $${product.price}, Status: ${product.status}`);
        if (product.tags) {
            console.log(`Tags: ${product.tags.join(", ")}`);
        }
    }
    
    displayProduct(product1);
    displayProduct(product2);
    
    // Type alias for a function signature
    type DataFormatter<TInput, TOutput> = (data: TInput) => TOutput;
    
    const numberToStringFormatter: DataFormatter<number, string> = (num) => `Value: ${num}`;
    const stringToLengthFormatter: DataFormatter<string, number> = (str) => str.length;
    
    console.log(numberToStringFormatter(123)); // "Value: 123"
    console.log(stringToLengthFormatter("TypeScript")); // 10

**Danh sách bài tập**

1.  **Trắc nghiệm: Phát biểu nào sau đây là ĐÚNG về Interfaces trong TypeScript?**
    

**Tiêu đề**

Kiến thức về Interfaces.

**Mô tả**

Chọn phát biểu đúng nhất về đặc điểm của Interfaces.

**Câu hỏi**

Phát biểu nào sau đây là ĐÚNG về Interfaces trong TypeScript?

*   A. Interface chỉ có thể được sử dụng để mô tả hình dạng của đối tượng, không dùng cho class.
    
*   B. Interface có thể kế thừa từ nhiều interface khác.
    
*   C. Interface không hỗ trợ thuộc tính tùy chọn (`?`).
    
*   D. Interface không thể được hợp nhất (declaration merging).
    

**Đáp án**

B

1.  **Code: Tạo interface `Product`.**
    
    **Tiêu đề**
    
    Thực hành với Interface.
    
    **Mô tả**
    
    Tạo một `interface` tên là `Product` với các thuộc tính sau:
    
    *   `id` (kiểu `number`, chỉ đọc)
        
    *   `name` (kiểu `string`)
        
    *   `price` (kiểu `number`)
        
    *   `description` (kiểu `string`, tùy chọn)
        
    *   `inStock` (kiểu `boolean`) Sau đó, tạo một đối tượng `sampleProduct` tuân theo interface `Product`.
        
    
    **Giải pháp mẫu**
    
        interface Product {
            readonly id: number;
            name: string;
            price: number;
            description?: string;
            inStock: boolean;
        }
        
        let sampleProduct: Product = {
            id: 1,
            name: "Tai nghe Bluetooth XYZ",
            price: 1200000,
            description: "Tai nghe chống ồn, pin trâu",
            inStock: true
        };
        
        console.log("Sản phẩm mẫu:", sampleProduct);
        // sampleProduct.id = 2; // Lỗi: Cannot assign to 'id' because it is a read-only property.
        
        let anotherSample: Product = {
            id: 2,
            name: "Bàn phím cơ ABC",
            price: 2500000,
            // description không bắt buộc
            inStock: false
        };
        console.log("Sản phẩm khác:", anotherSample);
    
2.  **Code: Tạo type alias `StatusCode`.**
    
    **Tiêu đề**
    
    Thực hành với Type Alias.
    
    **Mô tả**
    
    Tạo một `type alias` tên là `HttpCode` cho kiểu `number`. Sau đó, khai báo một biến `responseStatus` với kiểu `HttpCode` và gán cho nó một giá trị mã HTTP (ví dụ: 200, 404, 500).
    
    **Giải pháp mẫu**
    
        type HttpCode = number;
        
        let responseStatus: HttpCode = 200; // OK
        console.log("Response Status:", responseStatus);
        
        responseStatus = 404; // OK
        // responseStatus = "404"; // Lỗi: Type 'string' is not assignable to type 'HttpCode'.
                                   // 'HttpCode' is an alias for 'number'.
        console.log("New Response Status:", responseStatus);
    
3.  **Code: Kế thừa interface.**
    
    **Tiêu đề**
    
    Thực hành kế thừa Interface.
    
    **Mô tả**
    
    Sử dụng `interface Product` đã tạo ở bài tập 2. Tạo một `interface` mới tên là `BookProduct` kế thừa từ `Product` và thêm các thuộc tính sau:
    
    *   `author` (kiểu `string`)
        
    *   `pages` (kiểu `number`) Tạo một đối tượng `programmingBook` tuân theo interface `BookProduct`.
        
    
    **Giải pháp mẫu**
    
        interface Product { // Định nghĩa lại Product nếu chưa có từ bài trước
            readonly id: number;
            name: string;
            price: number;
            description?: string;
            inStock: boolean;
        }
        
        interface BookProduct extends Product {
            author: string;
            pages: number;
        }
        
        let programmingBook: BookProduct = {
            id: 10,
            name: "Effective TypeScript",
            price: 750000,
            inStock: true,
            author: "Dan Vanderkam",
            pages: 322,
            description: "Learn to write better TypeScript code."
        };
        
        console.log("Sách lập trình:", programmingBook);
        console.log(`Tác giả: ${programmingBook.author}, Số trang: ${programmingBook.pages}`);
    
4.  **Code: Type alias cho API Response.**
    
    **Tiêu đề**
    
    Thực hành Type Alias phức tạp.
    
    **Mô tả**
    
    Tạo một `type alias` tên là `ApiResponse<TData>` (sử dụng generic, sẽ học kỹ hơn sau, tạm thời coi `TData` là `any` hoặc một kiểu cụ thể nếu muốn). Type alias này mô tả cấu trúc của một phản hồi API, bao gồm:
    
    *   `success` (kiểu `boolean`)
        
    *   `data` (kiểu `TData` - dữ liệu trả về, có thể là `any` cho bài tập này)
        
    *   `message` (kiểu `string`, tùy chọn)
        
    *   `errorCode` (kiểu `number`, tùy chọn, chỉ xuất hiện nếu `success` là `false`)
        
    
    Tạo hai đối tượng: một `successResponse` và một `errorResponse` dựa trên `ApiResponse`.
    
    **Giải pháp mẫu**
    
        type ApiResponse<TData> = {
            success: boolean;
            data: TData;
            message?: string;
            errorCode?: number;
        };
        
        // Ví dụ sử dụng với kiểu dữ liệu cụ thể cho data
        type UserData = { userId: string; username: string; };
        
        let successUserResponse: ApiResponse<UserData> = {
            success: true,
            data: { userId: "user123", username: "ts_pro" },
            message: "User data fetched successfully."
        };
        
        let errorUserResponse: ApiResponse<null> = { // data có thể là null khi lỗi
            success: false,
            data: null,
            message: "User not found.",
            errorCode: 404
        };
        
        console.log("Success Response:", successUserResponse);
        if (successUserResponse.success) {
            console.log("Username from success:", successUserResponse.data.username);
        }
        
        console.log("Error Response:", errorUserResponse);
        if (!errorUserResponse.success && errorUserResponse.errorCode) {
            console.log(`Error Code: ${errorUserResponse.errorCode}, Message: ${errorUserResponse.message}`);
        }