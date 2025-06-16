#### Chapter 8: Advanced Types - Mapped Types, Conditional Types và Utility Types

**Mô tả tổng quát Chapter học**

Chapter học này sẽ đào sâu vào các tính năng kiểu nâng cao của TypeScript, cho phép bạn thực hiện các phép biến đổi và thao tác phức tạp trên các kiểu hiện có. Chúng ta sẽ tìm hiểu về `Mapped Types` để tạo ra các kiểu mới dựa trên việc lặp qua các thuộc tính của một kiểu khác, `Conditional Types` để chọn kiểu dựa trên một điều kiện logic, và khám phá thêm nhiều `Utility Types` hữu ích được TypeScript cung cấp sẵn. Nắm vững các khái niệm này sẽ giúp bạn viết code TypeScript linh hoạt, mạnh mẽ và an toàn hơn rất nhiều.

**Tiêu đề Chapter học**

Thao Tác Kiểu Nâng Cao: Mapped, Conditional Types và Utility Types.

**Tóm tắt lý thuyết chính**

1.  **`keyof` Type Operator:**
    

Toán tử `keyof` nhận vào một kiểu đối tượng và trả về một union type của các key (dưới dạng chuỗi literal hoặc symbol literal) của kiểu đó.

    interface UserProfile {
        id: number;
        username: string;
        email: string;
        lastLogin: Date;
    }
    
    type UserProfileKeys = keyof UserProfile;
    // UserProfileKeys sẽ là: "id" | "username" | "email" | "lastLogin"
    
    let userKey: UserProfileKeys = "username"; // OK
    // let invalidKey: UserProfileKeys = "password"; // Lỗi: Type '"password"' is not assignable to type 'UserProfileKeys'.

1.  **`typeof` Type Operator (trong ngữ cảnh type):**
    
    Toán tử `typeof` khi được sử dụng trong ngữ cảnh type (không phải trong biểu thức JavaScript) sẽ lấy ra kiểu của một giá trị (biến hoặc thuộc tính).
    
        let primaryColor = "blue"; // TypeScript suy luận primaryColor là string
        
        type ColorType = typeof primaryColor; // ColorType sẽ là string
        
        const appConfig = {
            version: "1.0.0",
            debugMode: false
        };
        type AppConfigType = typeof appConfig;
        // AppConfigType sẽ là: { version: string; debugMode: boolean; }
        
        let currentConfig: AppConfigType = { version: "1.1.0", debugMode: true };
    
2.  **Indexed Access Types (`T[K]`):**
    
    Indexed access types (hay còn gọi là lookup types) cho phép bạn lấy ra kiểu của một thuộc tính cụ thể trong một kiểu đối tượng.
    
        interface Product {
            id: number;
            name: string;
            price: number;
            tags: string[];
        }
        
        type ProductNameType = Product["name"];   // string
        type ProductTagsType = Product["tags"];   // string[]
        type ProductIdOrPrice = Product["id" | "price"]; // number (vì cả id và price đều là number)
        // type ProductNonExistent = Product["category"]; // Lỗi: Property 'category' does not exist on type 'Product'.
        
        type ProductKeys = keyof Product; // "id" | "name" | "price" | "tags"
        type ProductPropertyType<K extends ProductKeys> = Product[K]; // Generic indexed access
        
        let pName: ProductPropertyType<"name"> = "Laptop";
    
3.  **Mapped Types:**
    
    Mapped types cho phép bạn tạo ra các kiểu mới dựa trên một kiểu đối tượng hiện có bằng cách lặp qua các key của kiểu đó và áp dụng một phép biến đổi cho từng thuộc tính. Cú pháp thường là `[K in keyof T]: NewType`.
    
    **Ví dụ tạo Mapped Type tùy chỉnh**
    
        interface Options {
            width: number;
            height: number;
            color: string;
        }
        
        // Tạo một kiểu mới với tất cả thuộc tính của Options là boolean
        type FeatureFlags<T> = {
            [P in keyof T]: boolean; // P lặp qua các key của T (width, height, color)
        };
        type OptionFlags = FeatureFlags<Options>;
        // OptionFlags sẽ là: { width: boolean; height: boolean; color: boolean; }
        
        let currentFlags: OptionFlags = { width: true, height: false, color: true };
        
        // Tạo một kiểu mới với tất cả thuộc tính của Options là tùy chọn và kiểu là string
        type StringifiedOptionalOptions<T> = {
            [P in keyof T]?: string; // Thêm ? để làm tùy chọn
        };
        type ConfigStrings = StringifiedOptionalOptions<Options>;
        // ConfigStrings sẽ là: { width?: string; height?: string; color?: string; }
        let userConfig: ConfigStrings = { width: "100px", color: "blue" };
    
    **Các Utility Types dựa trên Mapped Types**
    
    *   `Readonly<T>`: Làm cho tất cả thuộc tính của `T` thành `readonly`. \[source,typescript\] ---- type ReadonlyOptions = Readonly<Options>; // ReadonlyOptions: { readonly width: number; readonly height: number; readonly color: string; } ----
        
    *   `Partial<T>`: Làm cho tất cả thuộc tính của `T` thành tùy chọn (`?`). \[source,typescript\] ---- type PartialOptions = Partial<Options>; // PartialOptions: { width?: number; height?: number; color?: string; } ----
        
    *   `Required<T>`: Làm cho tất cả thuộc tính của `T` (kể cả những thuộc tính tùy chọn) thành bắt buộc. \[source,typescript\] ---- interface MaybeOptions { width?: number; height?: number; } type ConcreteOptions = Required<MaybeOptions>; // ConcreteOptions: { width: number; height: number; } ----
        
    *   `Pick<T, K>`: Tạo một kiểu mới bằng cách chọn một tập hợp các thuộc tính `K` (K là union các key của T) từ `T`. \[source,typescript\] ---- type DimensionOptions = Pick<Options, "width" | "height">; // DimensionOptions: { width: number; height: number; } ----
        
    *   `Omit<T, K>`: Tạo một kiểu mới bằng cách bỏ đi một tập hợp các thuộc tính `K` từ `T`. \[source,typescript\] ---- type StyleOptions = Omit<Options, "width" | "height">; // StyleOptions: { color: string; } ----
        
    
4.  **Conditional Types (`T extends U ? X : Y`):**
    
    Conditional types cho phép bạn chọn một trong hai kiểu dựa trên một điều kiện logic liên quan đến kiểu. Cú pháp tương tự như toán tử ba ngôi trong JavaScript.
    
        type IsString<T> = T extends string ? true : false;
        
        type Result1 = IsString<string>;  // Result1 là true (literal type)
        type Result2 = IsString<number>;  // Result2 là false (literal type)
        
        // Ví dụ phức tạp hơn:
        type ElementType<T> = T extends (infer U)[] ? U : T;
        // Nếu T là một mảng (ví dụ U[]), thì ElementType<T> là U (kiểu của phần tử mảng).
        // Ngược lại, ElementType<T> là T.
        // 'infer U' cho phép "suy luận" kiểu U từ cấu trúc của T.
        
        type ItemType1 = ElementType<string[]>; // ItemType1 là string
        type ItemType2 = ElementType<number[]>; // ItemType2 là number
        type ItemType3 = ElementType<boolean>;  // ItemType3 là boolean (vì boolean không phải là mảng)
    
    **Từ khóa `infer`**
    
    `infer` được sử dụng trong conditional types để khai báo một biến kiểu sẽ được suy luận từ cấu trúc của kiểu đang được kiểm tra.
    
    **Các Utility Types dựa trên Conditional Types**
    
    *   `Exclude<T, U>`: Loại bỏ khỏi `T` tất cả các kiểu con có thể gán cho `U`. \[source,typescript\] ---- type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c" type T1 = Exclude<string | number | (() ⇒ void), Function>; // string | number ----
        
    *   `Extract<T, U>`: Trích xuất từ `T` tất cả các kiểu con có thể gán cho `U`. \[source,typescript\] ---- type T2 = Extract<"a" | "b" | "c", "a" | "f">; // "a" type T3 = Extract<string | number | (() ⇒ void), Function>; // () ⇒ void ----
        
    *   `NonNullable<T>`: Loại bỏ `null` và `undefined` khỏi `T`. \[source,typescript\] ---- type T4 = NonNullable<string | number | undefined | null>; // string | number ----
        
    *   `ReturnType<T>`: Lấy kiểu trả về của một kiểu hàm `T`. \[source,typescript\] ---- type T5 = ReturnType<() ⇒ string>; // string type T6 = ReturnType<(s: string) ⇒ void>; // void // type T7 = ReturnType<string>; // Lỗi: T phải là kiểu hàm ----
        
    *   `Parameters<T>`: Lấy kiểu của các tham số của một kiểu hàm `T` dưới dạng một tuple. \[source,typescript\] ---- type T8 = Parameters<() ⇒ string>; // \[\] (tuple rỗng) type T9 = Parameters<(s: string, n: number) ⇒ void>; // \[string, number\] ----
        
    *   `InstanceType<T>`: Lấy kiểu instance của một hàm constructor `T`. \[source,typescript\] ---- class MyClass { constructor(public x: number) {} } type T10 = InstanceType<typeof MyClass>; // MyClass (kiểu của instance) let instance: T10 = new MyClass(10); // type T11 = InstanceType<string>; // Lỗi: T phải là hàm constructor ----
        
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // ---- keyof, typeof, Indexed Access ----
    interface AppSettings {
        theme: "light" | "dark";
        fontSize: number;
        notifications: {
            enabled: boolean;
            sound: string;
        };
    }
    type SettingsKeys = keyof AppSettings; // "theme" | "fontSize" | "notifications"
    type NotificationSettingsType = AppSettings["notifications"]; // { enabled: boolean; sound: string; }
    
    const defaultSettings: AppSettings = {
        theme: "light",
        fontSize: 14,
        notifications: { enabled: true, sound: "default.mp3" }
    };
    type DefaultSettingsType = typeof defaultSettings; // Suy luận ra kiểu của defaultSettings
    
    // ---- Mapped Types ----
    // Tạo kiểu mới với tất cả thuộc tính là string và readonly
    type StringifiedReadonly<T> = {
        readonly [P in keyof T]: string;
    };
    type StringifiedAppSettings = StringifiedReadonly<AppSettings>;
    /*
    StringifiedAppSettings sẽ là:
    {
        readonly theme: string;
        readonly fontSize: string;
        readonly notifications: string; // Chú ý: notifications cũng thành string
    }
    */
    // Để giữ nguyên cấu trúc của notifications, cần Mapped Type đệ quy (phức tạp hơn)
    
    // ---- Conditional Types với infer ----
    // Lấy kiểu của thuộc tính 'data' nếu có, ngược lại là never
    type GetDataPropertyType<T> = T extends { data: infer D } ? D : never;
    
    type ResponseA = { status: string; data: number[] };
    type ResponseB = { status: string; message: string };
    
    type DataA = GetDataPropertyType<ResponseA>; // number[]
    type DataB = GetDataPropertyType<ResponseB>; // never
    
    // ---- Utility Types kết hợp ----
    interface User {
        id: number;
        name: string;
        email?: string;
        passwordHash: string;
        createdAt: Date;
        updatedAt?: Date;
    }
    
    // Tạo kiểu để cập nhật User: chỉ cần name, email. Tất cả đều optional.
    type UserUpdatePayload = Partial<Pick<User, "name" | "email">>;
    let updateUser: UserUpdatePayload = { name: "New Name" };
    // updateUser.id = 2; // Lỗi: id không có trong UserUpdatePayload
    
    // Tạo kiểu User public: bỏ passwordHash, createdAt, updatedAt.
    type PublicUser = Omit<User, "passwordHash" | "createdAt" | "updatedAt">;
    let publicProfile: PublicUser = {
        id: 1,
        name: "User One",
        email: "user@example.com"
        // passwordHash, createdAt, updatedAt không được phép
    };
    
    // Lấy kiểu của các tham số của một hàm cụ thể
    function createUser(name: string, email?: string): User {
        return {
            id: Math.random(),
            name,
            email,
            passwordHash: "hashed...",
            createdAt: new Date()
        };
    }
    type CreateUserParams = Parameters<typeof createUser>; // [string, (string | undefined)?]
    let params: CreateUserParams = ["Test User"];
    
    type CreatedUserType = ReturnType<typeof createUser>; // User

**Danh sách bài tập**

1.  **Trắc nghiệm: Utility type nào dùng để tạo một kiểu mới bằng cách chọn một tập hợp các thuộc tính từ một kiểu hiện có?**
    

**Tiêu đề**

Hiểu về Utility Type `Pick`.

**Mô tả**

Chọn utility type phù hợp với mô tả.

**Câu hỏi**

Utility type nào trong TypeScript được sử dụng để tạo một kiểu mới bằng cách chọn một tập hợp các thuộc tính cụ thể từ một kiểu đối tượng hiện có?

*   A. `Partial<T>`
    
*   B. `Readonly<T>`
    
*   C. `Pick<T, K>`
    
*   D. `Omit<T, K>`
    

**Đáp án**

C

1.  **Code: Tạo Mapped Type `NullableProps<T>`.**
    
    **Tiêu đề**
    
    Thực hành Mapped Type.
    
    **Mô tả**
    
    Sử dụng `keyof` và Mapped Type, tạo một kiểu generic `NullableProps<T>`. Kiểu này sẽ nhận vào một kiểu đối tượng `T` và tạo ra một kiểu mới mà tất cả các thuộc tính của `T` đều có thể là kiểu gốc của chúng hoặc `null`. Ví dụ: Nếu `T` là `{ name: string; age: number; }`, thì `NullableProps<T>` sẽ là `{ name: string | null; age: number | null; }`.
    
    **Giải pháp mẫu**
    
        type NullableProps<T> = {
            [P in keyof T]: T[P] | null;
        };
        
        interface UserDetails {
            username: string;
            email: string;
            lastLogin: Date;
        }
        
        type NullableUserDetails = NullableProps<UserDetails>;
        // NullableUserDetails sẽ là:
        // {
        //     username: string | null;
        //     email: string | null;
        //     lastLogin: Date | null;
        // }
        
        let userWithNulls: NullableUserDetails = {
            username: "testuser",
            email: null, // OK
            lastLogin: new Date()
        };
        
        let anotherUser: NullableUserDetails = {
            username: null,
            email: null,
            lastLogin: null
        };
        
        console.log(userWithNulls);
        console.log(anotherUser);
    
2.  **Code: Viết Conditional Type `UnwrapPromise<T>`.**
    
    **Tiêu đề**
    
    Thực hành Conditional Type với `infer`.
    
    **Mô tả**
    
    Viết một Conditional Type generic `UnwrapPromise<T>`.
    
    *   Nếu `T` là một `Promise<U>` (tức là một Promise chứa giá trị kiểu `U`), thì `UnwrapPromise<T>` sẽ trả về kiểu `U`.
        
    *   Ngược lại (nếu `T` không phải là Promise), `UnwrapPromise<T>` sẽ trả về chính kiểu `T`. Sử dụng từ khóa `infer` để suy luận kiểu `U`.
        
    
    **Giải pháp mẫu**
    
        type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
        
        type PromiseStringType = Promise<string>;
        type PromiseNumberType = Promise<number>;
        type RegularStringType = string;
        
        type UnwrappedString = UnwrapPromise<PromiseStringType>; // string
        type UnwrappedNumber = UnwrapPromise<PromiseNumberType>; // number
        type UnwrappedRegularString = UnwrapPromise<RegularStringType>; // string (vì không phải Promise)
        
        async function fetchData(): Promise<string> {
            return "Data from server";
        }
        
        // Ví dụ sử dụng (mặc dù ReturnType cũng làm được điều tương tự cho hàm async)
        type FetchedDataType = UnwrapPromise<ReturnType<typeof fetchData>>; // string
        // ReturnType<typeof fetchData> sẽ là Promise<string>
        // UnwrapPromise<Promise<string>> sẽ là string
        
        let result1: UnwrappedString = "hello";
        // let result1_error: UnwrappedString = 123; // Lỗi
        
        let result2: UnwrappedNumber = 123;
        let result3: UnwrappedRegularString = "world";
        
        console.log(result1, result2, result3);
    
3.  **Code: Sử dụng `Omit<T, K>`.**
    
    **Tiêu đề**
    
    Thực hành Utility Type `Omit`.
    
    **Mô tả**
    
    Cho interface `Todo` sau:
    
        interface Todo {
            id: number;
            text: string;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
        }
    
    Sử dụng `Omit<T, K>` để tạo một kiểu mới `TodoCreationPayload`. Kiểu này nên bao gồm tất cả các thuộc tính của `Todo` NGOẠI TRỪ `id`, `createdAt`, và `updatedAt` (vì các trường này thường được tạo tự động bởi server hoặc database). Thuộc tính `completed` có thể là tùy chọn trong payload tạo mới, hoặc có giá trị mặc định là `false`. (Để đơn giản, bài này chỉ cần omit, không cần xử lý optional/default cho `completed` bằng `Omit`).
    
    **Giải pháp mẫu**
    
        interface Todo {
            id: number;
            text: string;
            completed: boolean;
            createdAt: Date;
            updatedAt: Date;
        }
        
        // Bỏ đi id, createdAt, updatedAt
        type TodoCreationPayload = Omit<Todo, "id" | "createdAt" | "updatedAt">;
        
        // TodoCreationPayload sẽ là:
        // {
        //     text: string;
        //     completed: boolean;
        // }
        
        let newTodo: TodoCreationPayload = {
            text: "Học TypeScript nâng cao",
            completed: false
        };
        
        // newTodo.id = 1; // Lỗi: Property 'id' does not exist on type 'TodoCreationPayload'.
        
        console.log("Payload tạo Todo mới:", newTodo);
        
        // Nếu muốn completed là optional:
        type TodoCreationPayloadOptionalCompleted = Omit<Todo, "id" | "createdAt" | "updatedAt"> & { completed?: boolean };
        let newTodoOptional: TodoCreationPayloadOptionalCompleted = {
            text: "Mua sữa"
            // completed là optional
        };
        console.log("Payload với completed tùy chọn:", newTodoOptional);
    
4.  **Code: Lấy kiểu tham số và trả về của hàm.**
    
    **Tiêu đề**
    
    Thực hành `Parameters<T>` và `ReturnType<T>`.
    
    **Mô tả**
    
    Cho hàm sau:
    
        function processUserData(id: number, data: { name: string; age: number }, isActive?: boolean): { success: boolean; message?: string } {
            console.log(`Processing user ${id}, Active: ${isActive ?? false}`);
            if (data.age < 18) {
                return { success: false, message: "User is underage." };
            }
            return { success: true };
        }
    
    Sử dụng `Parameters<T>` để lấy kiểu của tất cả các tham số của hàm `processUserData` và gán cho một type alias `ProcessUserParams`. Sử dụng `ReturnType<T>` để lấy kiểu trả về của hàm `processUserData` và gán cho một type alias `ProcessUserReturn`. In ra console một ví dụ về giá trị của `ProcessUserParams` và `ProcessUserReturn` (chỉ cần khai báo biến với kiểu đó và gán giá trị hợp lệ).
    
    **Giải pháp mẫu**
    
        function processUserData(id: number, data: { name: string; age: number }, isActive?: boolean): { success: boolean; message?: string } {
            console.log(`Processing user ${id}, Active: ${isActive ?? false}`);
            if (data.age < 18) {
                return { success: false, message: "User is underage." };
            }
            return { success: true };
        }
        
        type ProcessUserParams = Parameters<typeof processUserData>;
        // ProcessUserParams sẽ là: [id: number, data: { name: string; age: number; }, isActive?: boolean | undefined]
        
        type ProcessUserReturn = ReturnType<typeof processUserData>;
        // ProcessUserReturn sẽ là: { success: boolean; message?: string | undefined; }
        
        let exampleParams: ProcessUserParams = [101, { name: "John Doe", age: 30 }, true];
        let exampleReturnSuccess: ProcessUserReturn = { success: true };
        let exampleReturnError: ProcessUserReturn = { success: false, message: "An error occurred." };
        
        console.log("Ví dụ tham số:", exampleParams);
        console.log("Ví dụ trả về (thành công):", exampleReturnSuccess);
        console.log("Ví dụ trả về (lỗi):", exampleReturnError);
        
        // Gọi hàm với exampleParams (sử dụng spread operator)
        let result = processUserData(...exampleParams);
        console.log("Kết quả gọi hàm:", result);