#### Chapter 5: Union Types, Intersection Types và Type Guards

**Mô tả tổng quát Chapter học**

Chapter học này sẽ trang bị cho bạn các công cụ mạnh mẽ để làm việc với các kiểu dữ liệu kết hợp và kiểm tra kiểu một cách an toàn trong TypeScript. Chúng ta sẽ khám phá `Union Types` để cho phép một biến có thể thuộc một trong nhiều kiểu, `Intersection Types` để kết hợp nhiều kiểu thành một, và các kỹ thuật `Type Guards` (bao gồm `typeof`, `instanceof`, `in`, và user-defined type guards) để thu hẹp kiểu và xử lý dữ liệu một cách chính xác trong runtime.

**Tiêu đề Chapter học**

Kết Hợp Kiểu: Union, Intersection và Type Guards.

**Tóm tắt lý thuyết chính**

1.  **Union Types (`|`):**
    

Union Type cho phép một biến, tham số hoặc giá trị trả về có thể là một trong nhiều kiểu được chỉ định. Toán tử `|` được sử dụng để tạo union type.

    let identifier: string | number;
    
    identifier = "user-123"; // OK
    console.log(identifier.toUpperCase()); // OK, TypeScript biết identifier là string ở đây (sau khi gán)
    
    identifier = 404; // OK
    // console.log(identifier.toUpperCase()); // Lỗi: Property 'toUpperCase' does not exist on type 'number'.
                                           // Cần type guard để xử lý.

Khi làm việc với union type, TypeScript chỉ cho phép bạn truy cập các thuộc tính hoặc phương thức chung cho tất cả các kiểu trong union. Để truy cập các thành viên cụ thể của một kiểu, bạn cần sử dụng type guards.

1.  **Làm việc với Union Types: Thu hẹp kiểu (Narrowing):**
    
    Thu hẹp kiểu là quá trình TypeScript xác định một kiểu cụ thể hơn cho một biến trong một phạm vi code nhất định, dựa trên các kiểm tra điều kiện.
    
    **Sử dụng `typeof`**
    
    Hữu ích cho các kiểu nguyên thủy (`string`, `number`, `boolean`, `symbol`, `bigint`, `function`, `undefined`, `object`).
    
        function printId(id: string | number): void {
            if (typeof id === "string") {
                // Trong block này, id được coi là string
                console.log("ID (string):", id.toUpperCase());
            } else {
                // Trong block này, id được coi là number
                console.log("ID (number):", id.toFixed(0));
            }
        }
        printId("abc-123"); // ID (string): ABC-123
        printId(101.56);   // ID (number): 102
    
    **Sử dụng `instanceof`**
    
    Hữu ích khi làm việc với các instance của class hoặc các kiểu đối tượng có constructor.
    
        class Dog { bark() { console.log("Woof!"); } }
        class Cat { meow() { console.log("Meow!"); } }
        
        function makeSound(animal: Dog | Cat): void {
            if (animal instanceof Dog) {
                animal.bark(); // animal là Dog
            } else {
                animal.meow(); // animal là Cat
            }
        }
        makeSound(new Dog()); // Woof!
        makeSound(new Cat()); // Meow!
    
    **Sử dụng toán tử `in`**
    
    Kiểm tra xem một thuộc tính có tồn tại trong một đối tượng hay không.
    
        interface Admin {
            isAdmin: true;
            manageUsers(): void;
        }
        interface RegularUser {
            isUser: true;
            viewContent(): void;
        }
        
        function performAction(user: Admin | RegularUser): void {
            if ("manageUsers" in user) {
                // user ở đây được thu hẹp thành Admin
                user.manageUsers();
            } else {
                // user ở đây được thu hẹp thành RegularUser
                user.viewContent();
            }
        }
    
2.  **Discriminated Unions (Tagged Unions):**
    
    Đây là một pattern mạnh mẽ và phổ biến để làm việc với union types của các đối tượng. Mỗi interface trong union có một thuộc tính chung (discriminant hoặc tag) với kiểu là một literal type (ví dụ: một chuỗi cụ thể). TypeScript có thể sử dụng thuộc tính này để thu hẹp kiểu một cách chính xác.
    
        interface Circle {
            kind: "circle"; // Discriminant
            radius: number;
        }
        interface Square {
            kind: "square"; // Discriminant
            sideLength: number;
        }
        interface Rectangle {
            kind: "rectangle"; // Discriminant
            width: number;
            height: number;
        }
        
        type Shape = Circle | Square | Rectangle;
        
        function getArea(shape: Shape): number {
            switch (shape.kind) {
                case "circle":
                    // shape ở đây là Circle
                    return Math.PI * shape.radius ** 2;
                case "square":
                    // shape ở đây là Square
                    return shape.sideLength ** 2;
                case "rectangle":
                    // shape ở đây là Rectangle
                    return shape.width * shape.height;
                default:
                    // Giúp đảm bảo tất cả các case đã được xử lý
                    const _exhaustiveCheck: never = shape;
                    return _exhaustiveCheck;
            }
        }
        console.log(getArea({ kind: "circle", radius: 5 }));
        console.log(getArea({ kind: "square", sideLength: 4 }));
        console.log(getArea({ kind: "rectangle", width: 3, height: 6 }));
    
3.  **Intersection Types (`&`):**
    
    Intersection Type cho phép bạn kết hợp nhiều kiểu lại với nhau để tạo thành một kiểu mới có tất cả các thành viên của các kiểu gốc. Toán tử `&` được sử dụng để tạo intersection type.
    
        interface Draggable {
            drag(): void;
        }
        interface Resizable {
            resize(): void;
        }
        
        type UIWidget = Draggable & Resizable; // UIWidget có cả drag() và resize()
        
        let widget: UIWidget = {
            drag: () => console.log("Dragging..."),
            resize: () => console.log("Resizing...")
        };
        widget.drag();
        widget.resize();
    
    Nếu các kiểu giao nhau có các thuộc tính cùng tên nhưng khác kiểu, kết quả có thể là kiểu `never` nếu không có kiểu nào thỏa mãn cả hai.
    
4.  **Type Guards (Người bảo vệ kiểu):**
    
    Ngoài `typeof`, `instanceof`, và `in` đã đề cập, bạn có thể tự định nghĩa các type guard.
    
    **User-defined type guards (Sử dụng `is` keyword)**
    
    Đây là các hàm trả về một boolean và có một "type predicate" (ví dụ: `pet is Bird`). Nếu hàm trả về `true`, TypeScript sẽ thu hẹp kiểu của biến được kiểm tra thành kiểu được chỉ định trong type predicate trong phạm vi đó.
    
        interface Bird {
            fly(): void;
            layEggs(): void;
        }
        interface Fish {
            swim(): void;
            layEggs(): void;
        }
        
        // User-defined type guard
        function isBird(pet: Fish | Bird): pet is Bird {
            return (pet as Bird).fly !== undefined; // Ép kiểu để kiểm tra thuộc tính 'fly'
        }
        
        function moveAnimal(pet: Fish | Bird) {
            if (isBird(pet)) {
                pet.fly(); // pet là Bird ở đây
            } else {
                pet.swim(); // pet là Fish ở đây (sau khi loại trừ Bird)
            }
            pet.layEggs(); // layEggs là thuộc tính chung, có thể gọi trực tiếp
        }
        
        let sparrow: Bird = { fly: () => console.log("Sparrow flying"), layEggs: () => console.log("Sparrow laying eggs") };
        let salmon: Fish = { swim: () => console.log("Salmon swimming"), layEggs: () => console.log("Salmon laying eggs") };
        
        moveAnimal(sparrow);
        moveAnimal(salmon);
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // ---- Union Types and typeof ----
    function processValue(value: string | number | boolean): void {
        if (typeof value === "string") {
            console.log(`String value: ${value.toUpperCase()}`);
        } else if (typeof value === "number") {
            console.log(`Number value: ${value.toFixed(2)}`);
        } else {
            console.log(`Boolean value: ${value}`);
        }
    }
    processValue("Hello TypeScript");
    processValue(3.14159);
    processValue(true);
    
    // ---- Discriminated Unions ----
    type NetworkResponse =
        | { status: "success"; data: { userId: string; items: string[] } }
        | { status: "error"; errorCode: number; errorMessage: string };
    
    function handleNetworkResponse(response: NetworkResponse): void {
        if (response.status === "success") {
            console.log("Data received:", response.data.items);
        } else {
            console.error(`Error ${response.errorCode}: ${response.errorMessage}`);
        }
    }
    handleNetworkResponse({ status: "success", data: { userId: "u1", items: ["item1", "item2"] } });
    handleNetworkResponse({ status: "error", errorCode: 500, errorMessage: "Internal Server Error" });
    
    // ---- Intersection Types ----
    type Person = {
        name: string;
        age: number;
    };
    type Employee = {
        employeeId: string;
        department: string;
    };
    
    type EmployeeProfile = Person & Employee; // Kết hợp Person và Employee
    
    let employee1: EmployeeProfile = {
        name: "Alice Wonderland",
        age: 30,
        employeeId: "E123",
        department: "Engineering"
    };
    console.log(`${employee1.name} (ID: ${employee1.employeeId}) works in ${employee1.department}.`);
    
    // ---- User-defined Type Guard with 'in' operator ----
    interface Car {
        drive(): void;
        fuelType: "gasoline" | "diesel" | "electric";
    }
    interface Bicycle {
        pedal(): void;
        gearCount: number;
    }
    
    function isCar(vehicle: Car | Bicycle): vehicle is Car {
        return "drive" in vehicle; // Kiểm tra sự tồn tại của phương thức 'drive'
    }
    
    function operateVehicle(vehicle: Car | Bicycle): void {
        if (isCar(vehicle)) {
            vehicle.drive();
            console.log(`This car uses ${vehicle.fuelType}.`);
        } else {
            vehicle.pedal();
            console.log(`This bicycle has ${vehicle.gearCount} gears.`);
        }
    }
    
    let myCarInstance: Car = { drive: () => console.log("Car driving..."), fuelType: "electric" };
    let myBikeInstance: Bicycle = { pedal: () => console.log("Bicycle pedaling..."), gearCount: 18 };
    
    operateVehicle(myCarInstance);
    operateVehicle(myBikeInstance);

**Danh sách bài tập**

1.  **Trắc nghiệm: Toán tử nào dùng để kiểm tra một thuộc tính có tồn tại trong đối tượng không?**
    

**Tiêu đề**

Type Guard với `in`.

**Mô tả**

Chọn toán tử phù hợp để kiểm tra sự tồn tại của thuộc tính trong một đối tượng, thường dùng trong type guards.

**Câu hỏi**

Để kiểm tra xem một đối tượng `obj` có thuộc tính `propName` hay không trong TypeScript (thường dùng cho type narrowing), bạn sẽ sử dụng toán tử nào?

*   A. `typeof obj.propName !== "undefined"`
    
*   B. `obj instanceof propName`
    
*   C. `"propName" in obj`
    
*   D. `obj.hasOwnProperty(propName)` (Mặc dù có thể dùng, `in` thường được ưu tiên cho type guards)
    

**Đáp án**

C

**Giải thích**

Toán tử `in` là cách phổ biến và hiệu quả để kiểm tra sự tồn tại của một thuộc tính (kể cả thuộc tính kế thừa) và được TypeScript hỗ trợ tốt cho việc thu hẹp kiểu. `hasOwnProperty` chỉ kiểm tra thuộc tính trực tiếp của đối tượng. `typeof` dùng cho kiểu, `instanceof` dùng cho constructor.

1.  **Code: Hàm xử lý giá trị `string` hoặc `string[]`.**
    
    **Tiêu đề**
    
    Thực hành với Union Type và `typeof`/`Array.isArray`.
    
    **Mô tả**
    
    Viết một hàm `logItems` nhận vào một tham số `items` có thể là một chuỗi đơn (`string`) hoặc một mảng các chuỗi (`string[]`).
    
    *   Nếu `items` là một chuỗi, in ra chuỗi đó.
        
    *   Nếu `items` là một mảng chuỗi, in ra từng phần tử trong mảng, mỗi phần tử trên một dòng.
        
    
    **Giải pháp mẫu**
    
        function logItems(items: string | string[]): void {
            if (typeof items === "string") {
                console.log("Item:", items);
            } else if (Array.isArray(items)) { // Array.isArray là một type guard tốt cho mảng
                console.log("Items in array:");
                items.forEach(item => console.log("- " + item));
            } else {
                // Trường hợp này không nên xảy ra với union type đã cho
                console.log("Unknown item type");
            }
        }
        
        logItems("Một mục duy nhất");
        logItems(["Táo", "Chuối", "Cam"]);
    
2.  **Code: Intersection Type cho `FullStackDeveloper`.**
    
    **Tiêu đề**
    
    Thực hành với Intersection Type.
    
    **Mô tả**
    
    *   1\. Tạo hai `interface`:
        
        *   `FrontendDeveloper` với thuộc tính `frontendTech: string[]` (ví dụ: `["React", "CSS"]`).
            
        *   `BackendDeveloper` với thuộc tính `backendTech: string[]` (ví dụ: `["Node.js", "Express"]`).
            
        
    *   2\. Tạo một `type alias` tên là `FullStackDeveloper` là `intersection type` của `FrontendDeveloper` và `BackendDeveloper`.
        
    *   3\. Tạo một đối tượng `devProfile` kiểu `FullStackDeveloper` và gán giá trị cho các thuộc tính.
        
    
    **Giải pháp mẫu**
    
        interface FrontendDeveloper {
            frontendTech: string[];
            buildUI(): void;
        }
        
        interface BackendDeveloper {
            backendTech: string[];
            setupServer(): void;
        }
        
        type FullStackDeveloper = FrontendDeveloper & BackendDeveloper;
        
        let devProfile: FullStackDeveloper = {
            frontendTech: ["React", "TailwindCSS", "TypeScript"],
            backendTech: ["Node.js", "Express", "PostgreSQL"],
            buildUI: () => console.log("Building user interface..."),
            setupServer: () => console.log("Setting up server environment...")
        };
        
        console.log("Full-stack Developer Profile:");
        console.log("Frontend Technologies:", devProfile.frontendTech.join(", "));
        console.log("Backend Technologies:", devProfile.backendTech.join(", "));
        devProfile.buildUI();
        devProfile.setupServer();
    
3.  **Code: Discriminated Unions cho API Response.**
    
    **Tiêu đề**
    
    Thực hành với Discriminated Unions.
    
    **Mô tả**
    
    Sử dụng Discriminated Unions, tạo các `interface` sau:
    
    *   `ApiSuccessResponse<T>`: có thuộc tính `status: "success"`, `data: T`.
        
    *   `ApiErrorResponse`: có thuộc tính `status: "error"`, `message: string`, `code: number`. Tạo một `type alias` `ApiResponse<T>` là union của `ApiSuccessResponse<T>` và `ApiErrorResponse`. Viết hàm `handleApiResponse<T>(response: ApiResponse<T>)` nhận vào một `ApiResponse` và xử lý tương ứng:
        
    *   Nếu `status` là `"success"`, in ra `response.data`.
        
    *   Nếu `status` là `"error"`, in ra `response.message` và `response.code`.
        
    
    **Giải pháp mẫu**
    
        interface ApiSuccessResponse<T> {
            status: "success"; // Discriminant
            data: T;
        }
        
        interface ApiErrorResponse {
            status: "error"; // Discriminant
            message: string;
            code: number;
        }
        
        type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
        
        function handleApiResponse<T>(response: ApiResponse<T>): void {
            switch (response.status) {
                case "success":
                    console.log("API Success! Data:", response.data);
                    break;
                case "error":
                    console.error(`API Error (Code: ${response.code}): ${response.message}`);
                    break;
                default:
                    // Should not happen with a well-defined discriminated union
                    const _exhaustiveCheck: never = response;
                    console.error("Unknown response status:", _exhaustiveCheck);
            }
        }
        
        type User = { id: number; name: string };
        let successfulUserData: ApiResponse<User> = {
            status: "success",
            data: { id: 1, name: "Alice" }
        };
        
        let failedAuthResponse: ApiResponse<User> = { // T có thể là bất kỳ kiểu gì, nhưng data sẽ không được dùng khi lỗi
            status: "error",
            message: "Authentication Failed",
            code: 401
        };
        
        handleApiResponse(successfulUserData);
        handleApiResponse(failedAuthResponse);
    
4.  **Code: User-defined type guard `isStringArray`.**
    
    **Tiêu đề**
    
    Thực hành với User-defined Type Guard.
    
    **Mô tả**
    
    Viết một user-defined type guard tên là `isStringArray` để kiểm tra xem một biến có kiểu `unknown` có phải là một mảng các chuỗi (`string[]`) hay không. Hàm này nên trả về `value is string[]`. Bên trong hàm, bạn cần kiểm tra:
    
    1.  `value` có phải là một mảng không (`Array.isArray(value)`).
        
    2.  Nếu là mảng, tất cả các phần tử trong mảng có phải là `string` không (`value.every(item ⇒ typeof item === "string")`).
        
    
    Sau đó, thử nghiệm type guard này với các giá trị khác nhau.
    
    **Giải pháp mẫu**
    
        function isStringArray(value: unknown): value is string[] {
            return Array.isArray(value) && value.every(item => typeof item === "string");
        }
        
        let testValue1: unknown = ["hello", "world", "typescript"];
        let testValue2: unknown = ["hello", 123, "world"]; // Contains a number
        let testValue3: unknown = "this is a string";
        let testValue4: unknown = [1, 2, 3];
        let testValue5: unknown = null;
        
        function processStringArray(data: unknown): void {
            if (isStringArray(data)) {
                // data ở đây được TypeScript hiểu là string[]
                console.log("Processing string array:", data.map(s => s.toUpperCase()));
            } else {
                console.log("Input is not a string array:", data);
            }
        }
        
        processStringArray(testValue1); // Output: Processing string array: [ 'HELLO', 'WORLD', 'TYPESCRIPT' ]
        processStringArray(testValue2); // Output: Input is not a string array: [ 'hello', 123, 'world' ]
        processStringArray(testValue3); // Output: Input is not a string array: this is a string
        processStringArray(testValue4); // Output: Input is not a string array: [ 1, 2, 3 ]
        processStringArray(testValue5); // Output: Input is not a string array: null