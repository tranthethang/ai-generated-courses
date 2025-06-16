#### Chapter 9: Decorators - Siêu Lập Trình (Meta-programming)

**Mô tả tổng quát Chapter học**

Chapter học này giới thiệu `Decorators`, một tính năng thử nghiệm (experimental) nhưng rất mạnh mẽ trong TypeScript, cho phép bạn thực hiện siêu lập trình (meta-programming). Decorators cung cấp một cách để thêm chú thích (annotations) và sửa đổi hành vi của class, method, property, accessor, hoặc parameter tại thời điểm thiết kế (design time) mà không cần thay đổi trực tiếp code của chúng. Chúng ta sẽ tìm hiểu cách kích hoạt, định nghĩa và áp dụng các loại decorator khác nhau.

**Lưu ý quan trọng**: Decorators là một tính năng thử nghiệm. Cú pháp và hành vi có thể thay đổi trong các phiên bản TypeScript tương lai. Cần bật cờ `experimentalDecorators` và `emitDecoratorMetadata` trong `tsconfig.json`.

**Tiêu đề Chapter học**

Decorators: Mở Rộng Chức Năng với Meta-programming.

**Tóm tắt lý thuyết chính**

1.  **Khái niệm Decorators và mục đích sử dụng:**
    

Decorator là một loại khai báo đặc biệt có thể được đính kèm vào khai báo class, method, accessor, property, hoặc parameter. Decorators sử dụng cú pháp `@expression`, trong đó `expression` phải là một hàm sẽ được gọi tại runtime với thông tin về khai báo được decorate.

**Mục đích sử dụng phổ biến:** **Logging và instrumentation: Ghi log khi một phương thức được gọi, đo thời gian thực thi.** Access control và authorization: Kiểm tra quyền trước khi thực thi một phương thức. **Data validation: Tự động kiểm tra tính hợp lệ của các thuộc tính hoặc tham số.** Dependency injection: Quản lý và tiêm các dependency vào class. \*\* Modification: Thay đổi hoặc mở rộng hành vi của class hoặc thành viên của nó.

1.  **Kích hoạt Decorators trong `tsconfig.json`:**
    
    Để sử dụng decorators, bạn cần bật hai tùy chọn sau trong phần `compilerOptions` của file `tsconfig.json`:
    
        {
          "compilerOptions": {
            "experimentalDecorators": true,
            "emitDecoratorMetadata": true // Thường cần thiết cho các thư viện sử dụng metadata reflection
            // ... các tùy chọn khác
          }
        }
    
2.  **Các loại Decorators:**
    
    TypeScript hỗ trợ 5 loại decorator:
    
    **Class Decorators (`@sealed`)**
    
    *   Áp dụng cho constructor của class.
        
    *   Có thể được sử dụng để quan sát, sửa đổi hoặc thay thế định nghĩa class.
        
    *   Nhận một tham số: constructor của class được decorate.
        
    *   Nếu class decorator trả về một giá trị, nó sẽ thay thế khai báo class gốc (phải là một constructor).
        
    
        function sealed(constructor: Function) {
            Object.seal(constructor);
            Object.seal(constructor.prototype);
            console.log(`Class ${constructor.name} is sealed.`);
        }
        
        @sealed
        class BugReport {
            type = "report";
            title: string;
            constructor(t: string) { this.title = t; }
        }
        // let bug = new BugReport("Crash on load");
        // BugReport.prototype.newMethod = () => {}; // Lỗi nếu sealed hoạt động đúng
    
    **Method Decorators (`@enumerable(false)`)**
    
    *   Áp dụng cho một phương thức của class.
        
    *   Có thể được sử dụng để quan sát, sửa đổi hoặc thay thế định nghĩa phương thức.
        
    *   Nhận ba tham số:
        
        *   `target`: Constructor của class (cho static method) hoặc prototype của class (cho instance method).
            
        *   `propertyKey`: Tên của phương thức (string hoặc symbol).
            
        *   `descriptor`: Property Descriptor của phương thức (kiểu `TypedPropertyDescriptor<T>`).
            
        
    *   Nếu method decorator trả về một giá trị, nó sẽ được sử dụng làm Property Descriptor cho phương thức đó.
        
    
        function enumerable(value: boolean) {
            return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                descriptor.enumerable = value; // Thay đổi tính enumerable của phương thức
                console.log(`Method ${propertyKey} enumerable set to ${value}`);
            };
        }
        
        class Person {
            name: string;
            constructor(name: string) { this.name = name; }
        
            @enumerable(false) // greet sẽ không xuất hiện trong for...in
            greet() { return "Hello, " + this.name; }
        }
        // let p = new Person("Test");
        // for (const key in p) { console.log(key); } // 'greet' sẽ không được log
    
    **Accessor Decorators (`@configurable(false)`)**
    
    *   Áp dụng cho một accessor (getter hoặc setter) của class.
        
    *   Tương tự như method decorators, nhận `target`, `propertyKey`, và `descriptor`.
        
    *   Có thể sửa đổi Property Descriptor của accessor.
        
    
        function configurable(value: boolean) {
            return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
                descriptor.configurable = value;
            };
        }
        class Point {
            private _x: number = 0;
            private _y: number = 0;
            @configurable(false)
            get x() { return this._x; }
            // set x(val: number) { this._x = val; } // Lỗi nếu áp dụng cho cả get và set
        }
    
    Lưu ý: Decorator không thể áp dụng cho cả getter và setter của cùng một accessor. Nếu có cả hai, decorator chỉ áp dụng cho cái được khai báo đầu tiên.
    
    **Property Decorators (`@format("Hello, %s")`)**
    
    *   Áp dụng cho một thuộc tính của class.
        
    *   Nhận hai tham số:
        
        *   `target`: Constructor của class (cho static property) hoặc prototype của class (cho instance property).
            
        *   `propertyKey`: Tên của thuộc tính (string hoặc symbol).
            
        
    *   **Không thể** trực tiếp sửa đổi giá trị của thuộc tính hoặc định nghĩa của nó thông qua Property Descriptor (vì descriptor không được cung cấp làm tham số). Thường được dùng để ghi metadata hoặc thực hiện các tác vụ khác liên quan đến thuộc tính.
        
    
        // (Cần thư viện reflect-metadata để ví dụ này hoạt động đầy đủ)
        // import "reflect-metadata";
        // const formatMetadataKey = Symbol("format");
        // function format(formatString: string) {
        //     return Reflect.metadata(formatMetadataKey, formatString);
        // }
        // function getFormat(target: any, propertyKey: string) {
        //     return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
        // }
        // class GreeterProp {
        //     @format("Hello, %s")
        //     greeting: string;
        //     constructor(message: string) { this.greeting = message; }
        //     greet() {
        //         let formatString = getFormat(this, "greeting");
        //         return formatString.replace("%s", this.greeting);
        //     }
        // }
        // console.log(new GreeterProp("World").greet()); // Sẽ là "Hello, World" nếu reflect-metadata hoạt động
    
    Ví dụ đơn giản hơn không dùng metadata:
    
        function LogProperty(target: any, propertyKey: string) {
            console.log(`Property Decorator called for: ${propertyKey} on target:`, target.constructor.name);
            // Không thể thay đổi giá trị trực tiếp ở đây
        }
        class UserWithLoggedProp {
            @LogProperty
            username: string;
            constructor(name: string) { this.username = name; }
        }
        // new UserWithLoggedProp("testuser"); // Sẽ log ra thông tin
    
    **Parameter Decorators (`@required`)**
    
    *   Áp dụng cho một tham số của constructor hoặc phương thức.
        
    *   Nhận ba tham số:
        
        *   `target`: Constructor của class (cho static method/constructor) hoặc prototype của class (cho instance method).
            
        *   `propertyKey`: Tên của phương thức (string hoặc symbol) mà tham số thuộc về (hoặc `undefined` nếu là tham số constructor).
            
        *   `parameterIndex`: Chỉ số (thứ tự) của tham số trong danh sách tham số của hàm (number).
            
        
    *   Thường được dùng để ghi metadata cho tham số, ví dụ cho mục đích validation hoặc dependency injection.
        
    
        // (Cần thư viện reflect-metadata)
        // import "reflect-metadata";
        // const requiredMetadataKey = Symbol("required");
        // function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        //     let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
        //     existingRequiredParameters.push(parameterIndex);
        //     Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
        // }
        // function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        //     let method = descriptor.value!;
        //     descriptor.value = function () {
        //         let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
        //         if (requiredParameters) {
        //             for (let parameterIndex of requiredParameters) {
        //                 if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
        //                     throw new Error("Missing required argument.");
        //                 }
        //             }
        //         }
        //         return method.apply(this, arguments);
        //     };
        // }
        // class BugReportService {
        //     @validate
        //     updateReport(id: number, @required title: string, @required description: string) {
        //         console.log(`Updating report ${id}: ${title} - ${description}`);
        //     }
        // }
        // const service = new BugReportService();
        // service.updateReport(1, "Crash", "App crashes on startup"); // OK
        // try { service.updateReport(2, "UI Bug", undefined); } catch(e:any) { console.error(e.message); } // Lỗi
    
3.  **Thứ tự thực thi của Decorators:**
    
    Decorators được áp dụng theo thứ tự từ dưới lên trên (bottom-up) cho các decorator trên cùng một khai báo, và từ trái sang phải cho các tham số. Tuy nhiên, bản thân các hàm decorator được đánh giá (evaluated) theo thứ tự chúng xuất hiện trong code (top-down, left-to-right).
    
        function First(): ClassDecorator {
          console.log("First(): factory evaluated");
          return function (constructor: Function): void {
            console.log("First(): decorator executed");
          };
        }
        
        function Second(): ClassDecorator {
          console.log("Second(): factory evaluated");
          return function (constructor: Function): void {
            console.log("Second(): decorator executed");
          };
        }
        
        @First()
        @Second()
        class ExampleClass {}
        // Output:
        // First(): factory evaluated
        // Second(): factory evaluated
        // Second(): decorator executed (vì @Second gần class hơn)
        // First(): decorator executed
    
4.  **Decorator Factories (Hàm nhà máy Decorator):**
    
    Decorator factory là một hàm trả về biểu thức mà decorator sẽ gọi. Điều này cho phép bạn tùy chỉnh decorator bằng cách truyền tham số vào factory.
    
        function Logger(logString: string) { // Đây là Decorator Factory
            console.log("Logger Factory: " + logString);
            return function(constructor: Function) { // Đây là Decorator thực sự
                console.log(logString);
                console.log(constructor);
            }
        }
        
        @Logger("LOGGING - USER")
        class UserClass {
            name = "Max";
            constructor() {
                console.log("Creating user object...");
            }
        }
        // Output:
        // Logger Factory: LOGGING - USER
        // LOGGING - USER
        // class UserClass { ... }
        // Creating user object... (khi tạo instance)
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // --- Class Decorator: Thêm thuộc tính vào class ---
    function Timestamped<T extends { new (...args: any[]): {} }>(originalConstructor: T) {
        return class extends originalConstructor {
            timestamp = new Date();
            constructor(...args: any[]) {
                super(...args);
                console.log(`[${originalConstructor.name}] Instance created at: ${this.timestamp.toISOString()}`);
            }
        };
    }
    
    // --- Method Decorator: Log lời gọi phương thức ---
    function LogMethodCall(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            console.log(`[Method Log] Calling: ${propertyKey} with arguments: ${JSON.stringify(args)}`);
            const result = originalMethod.apply(this, args);
            console.log(`[Method Log] ${propertyKey} returned: ${JSON.stringify(result)}`);
            return result;
        };
        return descriptor;
    }
    
    // --- Property Decorator: Giới hạn giá trị (ví dụ đơn giản) ---
    // (Property decorators không thể trực tiếp thay đổi giá trị, cần dùng getter/setter hoặc metadata)
    function MinLength(length: number) {
        return function(target: any, propertyKey: string) {
            let value: string = target[propertyKey]; // Lấy giá trị ban đầu (nếu có)
    
            const getter = function() {
                return value;
            };
            const setter = function(newValue: string) {
                if (newValue.length < length) {
                    console.warn(`[Validation] ${propertyKey} must be at least ${length} characters long. Received: "${newValue}"`);
                } else {
                    value = newValue;
                }
            };
    
            // Thay thế thuộc tính bằng getter/setter
            Object.defineProperty(target, propertyKey, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true,
            });
        };
    }
    
    
    // --- Parameter Decorator: Ghi nhận thông tin tham số (ví dụ) ---
    function LogParameter(target: any, propertyKey: string | symbol, parameterIndex: number) {
        console.log(`[Parameter Log] Decorator for parameter ${parameterIndex} of method ${String(propertyKey)} in class ${target.constructor.name}`);
    }
    
    
    @Timestamped // Class Decorator
    class TaskService {
        @MinLength(3) // Property Decorator
        defaultTaskName: string = "Untitled";
    
        constructor(private tasks: string[] = []) {}
    
        @LogMethodCall // Method Decorator
        addTask(@LogParameter taskName: string): string[] { // Parameter Decorator
            if(taskName.length === 0) { // Validation cơ bản trong phương thức
                console.error("Task name cannot be empty for addTask method.");
                return this.tasks;
            }
            this.tasks.push(taskName);
            console.log(`Task "${taskName}" added.`);
            return this.tasks;
        }
    
        @LogMethodCall
        getTasks(): string[] {
            return [...this.tasks];
        }
    }
    
    console.log("--- Creating TaskService Instance ---");
    const taskService = new TaskService(["Initial Task"]);
    // Output từ @Timestamped constructor sẽ xuất hiện ở đây
    
    console.log("\n--- Setting Default Task Name (Property Decorator Test) ---");
    taskService.defaultTaskName = "My"; // Sẽ có warning từ @MinLength
    console.log("Default task name after short set:", taskService.defaultTaskName); // Vẫn là "Untitled"
    taskService.defaultTaskName = "My Awesome Task";
    console.log("Default task name after valid set:", taskService.defaultTaskName);
    
    console.log("\n--- Calling AddTask (Method & Parameter Decorator Test) ---");
    taskService.addTask("Learn Decorators"); // Output từ @LogMethodCall và @LogParameter
    taskService.addTask(""); // Sẽ có lỗi từ logic trong addTask
    
    console.log("\n--- Calling GetTasks ---");
    const currentTasks = taskService.getTasks();
    console.log("Current tasks from service:", currentTasks);

**Danh sách bài tập**

1.  **Trắc nghiệm: Decorator nào được áp dụng cho một phương thức của class?**
    

**Tiêu đề**

Nhận biết loại Decorator.

**Mô tả**

Chọn loại decorator phù hợp với mô tả.

**Câu hỏi**

Loại decorator nào sau đây được áp dụng trực tiếp lên một phương thức của class trong TypeScript?

*   A. Class Decorator
    
*   B. Method Decorator
    
*   C. Property Decorator
    
*   D. Parameter Decorator
    

**Đáp án**

B

1.  **Code: Viết Class Decorator `@Version`.**
    
    **Tiêu đề**
    
    Thực hành Class Decorator.
    
    **Mô tả**
    
    Viết một Class Decorator factory tên là `@Version(version: string)`. Decorator này sẽ thêm một thuộc tính `static version` (kiểu `string`) vào class được decorate, với giá trị là chuỗi `version` được truyền vào factory.
    
    **Giải pháp mẫu**
    
        function Version(versionString: string): ClassDecorator {
            console.log(`Version factory called with: ${versionString}`);
            return function<TFunction extends Function>(targetConstructor: TFunction): TFunction | void {
                console.log(`Version decorator applied to: ${targetConstructor.name}`);
                // Thêm thuộc tính static 'version' vào constructor
                Object.defineProperty(targetConstructor, 'version', {
                    value: versionString,
                    writable: false, // Làm cho nó chỉ đọc nếu muốn
                    enumerable: true,
                    configurable: false
                });
                // Hoặc đơn giản hơn nếu targetConstructor là any:
                // (targetConstructor as any).version = versionString;
            }
        }
        
        @Version("1.0.2")
        class MyAppComponent {
            name: string;
            constructor(name: string) {
                this.name = name;
            }
            // static version: string; // TypeScript có thể yêu cầu khai báo nếu strict
        }
        
        // Để truy cập thuộc tính static, cần ép kiểu constructor sang một kiểu có thuộc tính version
        type ConstructorWithVersion = { new(...args: any[]): any; version: string; };
        
        console.log("App Version:", (MyAppComponent as ConstructorWithVersion).version); // Output: 1.0.2
        // console.log(MyAppComponent.version); // Có thể cần ép kiểu như trên
    
2.  **Code: Viết Method Decorator `@LogExecutionTime`.**
    
    **Tiêu đề**
    
    Thực hành Method Decorator.
    
    **Mô tả**
    
    Viết một Method Decorator tên là `@LogExecutionTime`. Decorator này sẽ đo thời gian thực thi (tính bằng mili giây) của phương thức được decorate và in ra console. Sử dụng `performance.now()` (nếu trong môi trường hỗ trợ) hoặc `Date.now()` để đo thời gian.
    
    **Giải pháp mẫu**
    
        function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value;
        
            descriptor.value = async function(...args: any[]) { // Hỗ trợ cả hàm async
                const start = performance.now(); // Hoặc Date.now()
                let result: any;
                if (originalMethod.constructor.name === "AsyncFunction") {
                    result = await originalMethod.apply(this, args);
                } else {
                    result = originalMethod.apply(this, args);
                }
                const end = performance.now(); // Hoặc Date.now()
                console.log(`[Execution Time] ${propertyKey}: ${(end - start).toFixed(2)} ms`);
                return result;
            };
        
            return descriptor;
        }
        
        class DataService {
            @LogExecutionTime
            fetchDataSync(id: number): string {
                // Giả lập công việc tốn thời gian
                let result = "";
                for (let i = 0; i < 1000000 * id; i++) {
                    result += String.fromCharCode((i % 26) + 65);
                }
                return `Data for ID ${id} (length: ${result.length})`;
            }
        
            @LogExecutionTime
            async fetchDataAsync(id: number): Promise<string> {
                // Giả lập công việc bất đồng bộ
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(`Async data for ID ${id}`);
                    }, 50 * id);
                });
            }
        }
        
        const service = new DataService();
        console.log("--- Sync Fetch ---");
        service.fetchDataSync(1); // Sẽ log thời gian thực thi
        service.fetchDataSync(2);
        
        async function testAsync() {
            console.log("\n--- Async Fetch ---");
            await service.fetchDataAsync(1); // Sẽ log thời gian thực thi
            await service.fetchDataAsync(3);
        }
        testAsync();
    
3.  **Code: Viết Property Decorator `@DefaultValue` (thử thách).**
    
    **Tiêu đề**
    
    Thực hành Property Decorator (Thử thách).
    
    **Mô tả**
    
    Viết một Property Decorator factory `@DefaultValue(value: any)`. Decorator này sẽ cố gắng gán giá trị `value` mặc định cho thuộc tính được decorate **nếu** thuộc tính đó là `undefined` khi đối tượng được khởi tạo. **Gợi ý**: Vì property decorator không thể trực tiếp thay đổi giá trị thuộc tính một cách dễ dàng, bạn có thể cần phải sử dụng `Object.defineProperty` để thay thế thuộc tính bằng một getter/setter, hoặc thực hiện logic này trong constructor của class (decorator có thể lưu trữ metadata để constructor đọc). Cách tiếp cận với `Object.defineProperty` trong decorator là khả thi.
    
    **Giải pháp mẫu (sử dụng `Object.defineProperty`)**
    
        function DefaultValue(defaultValue: any) {
            return function (target: any, propertyKey: string) {
                let _value: any = target[propertyKey]; // Lấy giá trị khởi tạo ban đầu (nếu có)
        
                // Nếu giá trị ban đầu là undefined, gán giá trị mặc định
                if (_value === undefined) {
                    _value = defaultValue;
                }
        
                const getter = function () {
                    return _value;
                };
                const setter = function (newValue: any) {
                    // Nếu muốn thuộc tính vẫn có thể được set sau khi có giá trị mặc định
                    _value = newValue;
                };
        
                // Xóa thuộc tính cũ (nếu có) và định nghĩa lại với getter/setter
                if (delete target[propertyKey]) {
                    Object.defineProperty(target, propertyKey, {
                        get: getter,
                        set: setter,
                        enumerable: true,
                        configurable: true
                    });
                }
            };
        }
        
        class AppConfig {
            @DefaultValue("light")
            theme: string; // Giá trị khởi tạo ban đầu là undefined
        
            @DefaultValue(100)
            maxUsers: number = 50; // Có giá trị khởi tạo ban đầu, DefaultValue sẽ không ghi đè
        
            @DefaultValue(true)
            notificationsEnabled?: boolean; // Tùy chọn, ban đầu là undefined
        
            constructor() {
                // Constructor được gọi sau khi property decorators đã chạy
                // (đối với việc thay thế bằng Object.defineProperty)
                console.log("AppConfig constructor called.");
                console.log(`Initial theme in constructor: ${this.theme}`); // Sẽ là "light"
                console.log(`Initial maxUsers in constructor: ${this.maxUsers}`); // Sẽ là 50
                console.log(`Initial notificationsEnabled in constructor: ${this.notificationsEnabled}`); // Sẽ là true
            }
        }
        
        let config = new AppConfig();
        console.log("--- Config Instance ---");
        console.log("Theme:", config.theme);                   // "light"
        console.log("Max Users:", config.maxUsers);             // 50
        console.log("Notifications:", config.notificationsEnabled); // true
        
        config.theme = "dark";
        console.log("Theme after change:", config.theme);       // "dark"
    
4.  **Code: Viết Parameter Decorator `@Required` (thử thách).**
    
    **Tiêu đề**
    
    Thực hành Parameter Decorator (Thử thách).
    
    **Mô tả**
    
    Viết một Parameter Decorator `@Required`. Decorator này sẽ được dùng để đánh dấu các tham số bắt buộc của một phương thức. Sau đó, viết một Method Decorator `@ValidateParams` để kiểm tra các tham số được đánh dấu `@Required`. Nếu khi gọi phương thức, một tham số `@Required` là `null` hoặc `undefined`, `@ValidateParams` sẽ throw một error. **Gợi ý**: `@Required` sẽ lưu trữ metadata (ví dụ: chỉ số của các tham số bắt buộc) bằng `Reflect.defineMetadata`. `@ValidateParams` sẽ đọc metadata này bằng `Reflect.getOwnMetadata` và thực hiện kiểm tra. Cần cài đặt `reflect-metadata`. `npm install reflect-metadata` và import `import "reflect-metadata";` ở đầu file.
    
    **Giải pháp mẫu (sử dụng `reflect-metadata`)**
    
        import "reflect-metadata"; // Import ở đầu file
        
        const requiredMetadataKey = Symbol("requiredParams");
        
        // Parameter Decorator: Đánh dấu tham số là bắt buộc
        function Required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
            let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
            existingRequiredParameters.push(parameterIndex);
            Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
            console.log(`[Required Decorator] Marked parameter ${parameterIndex} of ${String(propertyKey)} as required.`);
        }
        
        // Method Decorator: Kiểm tra các tham số bắt buộc
        function ValidateParams(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => any>) {
            let originalMethod = descriptor.value;
            if (!originalMethod) {
                return;
            }
        
            descriptor.value = function(...args: any[]) {
                console.log(`[ValidateParams] Validating parameters for ${propertyName}...`);
                let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
                if (requiredParameters) {
                    for (let parameterIndex of requiredParameters) {
                        if (parameterIndex >= args.length || args[parameterIndex] === undefined || args[parameterIndex] === null) {
                            throw new Error(`Missing required argument at index ${parameterIndex} for method ${propertyName}.`);
                        }
                    }
                }
                console.log(`[ValidateParams] All required parameters for ${propertyName} are present.`);
                return originalMethod.apply(this, args);
            };
        }
        
        class OrderService {
            @ValidateParams
            createOrder(@Required customerId: string, @Required items: string[], notes?: string) {
                console.log(`Creating order for customer ${customerId} with items: ${items.join(', ')}.`);
                if (notes) {
                    console.log(`Notes: ${notes}`);
                }
                return { orderId: Math.floor(Math.random() * 1000), status: "created" };
            }
        }
        
        const orderService = new OrderService();
        
        try {
            console.log("\n--- Valid Order ---");
            orderService.createOrder("cust123", ["itemA", "itemB"], "Urgent delivery");
        } catch (e: any) {
            console.error("Error:", e.message);
        }
        
        try {
            console.log("\n--- Invalid Order (missing items) ---");
            orderService.createOrder("cust456", undefined as any); // Ép kiểu để test, items là undefined
        } catch (e: any) {
            console.error("Error:", e.message); // "Missing required argument at index 1..."
        }
        
        try {
            console.log("\n--- Invalid Order (null customerId) ---");
            orderService.createOrder(null as any, ["itemC"]); // Ép kiểu để test, customerId là null
        } catch (e: any) {
            console.error("Error:", e.message); // "Missing required argument at index 0..."
        }