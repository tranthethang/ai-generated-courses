#### Chapter 7: Generics - Tổng Quát Hóa Code

**Mô tả tổng quát Chapter học**

Chapter học này giới thiệu `Generics`, một trong những tính năng mạnh mẽ nhất của TypeScript. Generics cho phép bạn viết các thành phần (hàm, class, interface) có thể làm việc với nhiều kiểu dữ liệu khác nhau một cách linh hoạt và an toàn kiểu, thay vì phải giới hạn ở một kiểu cụ thể hoặc sử dụng kiểu `any` không an toàn. Chúng ta sẽ khám phá cách tạo và sử dụng generic functions, generic interfaces, generic classes, và cách áp dụng các ràng buộc (constraints) cho generics.

**Tiêu đề Chapter học**

Generics: Viết Code Linh Hoạt và Tái Sử Dụng.

**Tóm tắt lý thuyết chính**

1.  **Vấn đề với kiểu `any` và tại sao cần Generics:**
    

Khi muốn viết một hàm có thể chấp nhận nhiều kiểu dữ liệu, một giải pháp đơn giản là sử dụng `any`. Tuy nhiên, `any` làm mất đi sự an toàn kiểu mà TypeScript cung cấp.

    function identityAny(arg: any): any {
        return arg;
    }
    let outputAny = identityAny("myString"); // outputAny là any
    // console.log(outputAny.length); // OK lúc biên dịch, nhưng nếu arg là number thì sẽ lỗi runtime
    let outputNumAny = identityAny(100);
    // outputNumAny.toFixed(); // OK lúc biên dịch, nhưng nếu arg là string thì sẽ lỗi runtime

Generics giải quyết vấn đề này bằng cách cho phép chúng ta khai báo một "biến kiểu" (type variable) mà có thể đại diện cho bất kỳ kiểu nào, nhưng vẫn duy trì sự nhất quán về kiểu trong suốt quá trình sử dụng.

1.  **Generic Functions (Hàm Generic):**
    
    Hàm generic sử dụng một hoặc nhiều biến kiểu, được khai báo trong dấu ngoặc nhọn `<>` sau tên hàm. Biến kiểu này sau đó có thể được sử dụng trong danh sách tham số và kiểu trả về.
    
        function identity<T>(arg: T): T { // T là biến kiểu (type variable)
            return arg;
        }
        
        // Cách gọi hàm generic:
        // 1. Tường minh chỉ định kiểu:
        let outputString = identity<string>("myString"); // T được thay thế bằng string
        let outputNumber = identity<number>(100);       // T được thay thế bằng number
        
        console.log(outputString.toUpperCase()); // OK, outputString là string
        console.log(outputNumber.toFixed(2));    // OK, outputNumber là number
        
        // 2. TypeScript tự suy luận kiểu (type argument inference):
        let inferredString = identity("anotherString"); // TypeScript suy luận T là string
        let inferredNumber = identity(200);         // TypeScript suy luận T là number
    
    Ví dụ khác:
    
        function getFirstElement<T>(arr: T[]): T | undefined {
            return arr.length > 0 ? arr[0] : undefined;
        }
        let numbers = [1, 2, 3];
        let firstNum = getFirstElement(numbers); // firstNum là number | undefined
        
        let strings = ["a", "b", "c"];
        let firstStr = getFirstElement(strings); // firstStr là string | undefined
    
2.  **Generic Interfaces (Interface Generic):**
    
    Interface cũng có thể là generic, cho phép chúng ta định nghĩa hình dạng của một đối tượng với các kiểu có thể thay đổi.
    
        interface KeyValuePair<K, V> {
            key: K;
            value: V;
        }
        
        let entry1: KeyValuePair<string, number> = { key: "age", value: 30 };
        let entry2: KeyValuePair<number, boolean> = { key: 101, value: true };
        // let entry3: KeyValuePair<string, number> = { key: "name", value: "Alice" }; // Lỗi: value phải là number
    
    Interface generic cũng có thể mô tả kiểu hàm generic:
    
        interface GenericIdentityFn<T> {
            (arg: T): T;
        }
        
        function identityFn<T>(arg: T): T {
            return arg;
        }
        
        let myIdentity: GenericIdentityFn<number> = identityFn;
        console.log(myIdentity(123)); // 123
        // console.log(myIdentity("hello")); // Lỗi: Argument of type 'string' is not assignable to parameter of type 'number'.
    
3.  **Generic Classes (Lớp Generic):**
    
    Tương tự như interface, class cũng có thể là generic. Biến kiểu được khai báo sau tên class.
    
        class DataStorage<T> {
            private data: T[] = [];
        
            addItem(item: T): void {
                this.data.push(item);
            }
        
            getItem(index: number): T | undefined {
                if (index >= 0 && index < this.data.length) {
                    return this.data[index];
                }
                return undefined;
            }
        
            getAllItems(): T[] {
                return [...this.data];
            }
        }
        
        let stringStorage = new DataStorage<string>();
        stringStorage.addItem("Hello");
        stringStorage.addItem("TypeScript");
        // stringStorage.addItem(123); // Lỗi: Argument of type 'number' is not assignable to parameter of type 'string'.
        console.log(stringStorage.getItem(0)?.toUpperCase()); // HELLO
        
        let numberStorage = new DataStorage<number>();
        numberStorage.addItem(10);
        numberStorage.addItem(20);
        console.log(numberStorage.getAllItems().reduce((sum, val) => sum + val, 0)); // 30
    
4.  **Generic Constraints (Ràng buộc Generic):**
    
    Đôi khi, bạn muốn giới hạn các kiểu mà biến kiểu có thể nhận. Ví dụ, bạn muốn một hàm generic chỉ làm việc với các kiểu có thuộc tính `length`. Điều này được thực hiện bằng cách sử dụng `extends` keyword với một interface hoặc một kiểu khác.
    
        interface Lengthwise {
            length: number;
        }
        
        // T phải là một kiểu có thuộc tính length (ví dụ: string, array)
        function logLength<T extends Lengthwise>(arg: T): void {
            console.log(`Length: ${arg.length}`);
        }
        
        logLength("Hello world");    // OK, string có length
        logLength([1, 2, 3, 4]);   // OK, array có length
        logLength({ length: 10, value: 3 }); // OK, đối tượng có length
        // logLength(10);          // Lỗi: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
        // logLength({});            // Lỗi: Property 'length' is missing in type '{}'
    
5.  **Sử dụng Type Parameters trong Generic Constraints:**
    
    Bạn có thể sử dụng một biến kiểu để ràng buộc một biến kiểu khác.
    
        // K phải là một key của đối tượng T
        function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
            return obj[key];
        }
        
        let x = { a: 1, b: "hello", c: true };
        
        let valA = getProperty(x, "a"); // valA là number
        let valB = getProperty(x, "b"); // valB là string
        // let valD = getProperty(x, "d"); // Lỗi: Argument of type '"d"' is not assignable to parameter of type '"a" | "b" | "c"'.
    
    `keyof T` trả về một union type của các key (dưới dạng chuỗi literal) của `T`. `T[K]` là một indexed access type, trả về kiểu của thuộc tính `K` trong `T`.
    
6.  **Generic Utility Types cơ bản:**
    
    TypeScript cung cấp một số utility type được xây dựng sẵn, nhiều trong số đó là generic. Chúng ta sẽ tìm hiểu kỹ hơn ở Chapter sau, nhưng đây là một vài ví dụ: **`Partial<T>`**: Tạo một kiểu mới với tất cả các thuộc tính của `T` là tùy chọn. **`Readonly<T>`**: Tạo một kiểu mới với tất cả các thuộc tính của `T` là chỉ đọc. **`Pick<T, K>`**: Tạo một kiểu mới bằng cách chọn một tập hợp các thuộc tính `K` từ `T`. **`Omit<T, K>`**: Tạo một kiểu mới bằng cách bỏ đi một tập hợp các thuộc tính `K` từ `T`.
    
        interface Todo {
            title: string;
            description: string;
            completed: boolean;
        }
        
        // Làm cho tất cả thuộc tính của Todo thành tùy chọn
        type PartialTodo = Partial<Todo>;
        let todoToUpdate: PartialTodo = { description: "New description" };
        
        // Làm cho tất cả thuộc tính của Todo thành chỉ đọc
        type ReadonlyTodo = Readonly<Todo>;
        let completedTodo: ReadonlyTodo = { title: "Finish report", description: "...", completed: true };
        // completedTodo.title = "New title"; // Lỗi: Cannot assign to 'title' because it is a read-only property.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    // 1. Generic Function với nhiều biến kiểu và ràng buộc
    interface Nameable { name: string; }
    interface Ageable { age: number; }
    
    function combineObjects<T extends Nameable, U extends Ageable>(obj1: T, obj2: U): T & U {
        return { ...obj1, ...obj2 }; // Kết hợp hai đối tượng
    }
    
    const personWithName = { name: "Alice" };
    const personWithAge = { age: 30, city: "Wonderland" }; // city sẽ không được đảm bảo trong kiểu trả về nếu U chỉ là Ageable
    
    // TypeScript suy luận kiểu trả về là Nameable & Ageable (hoặc cụ thể hơn nếu có thể)
    const combinedPerson = combineObjects(personWithName, personWithAge);
    console.log(combinedPerson.name); // Alice
    console.log(combinedPerson.age);  // 30
    // console.log(combinedPerson.city); // Lỗi: Property 'city' does not exist on type 'Nameable & Ageable'.
                                      // Để có city, U cần phải rộng hơn, ví dụ U extends Ageable & { city: string }
                                      // Hoặc kiểu trả về là T & U và U có city.
    
    // 2. Generic Class với phương thức generic
    class Collection<T> {
        private items: T[] = [];
    
        add(item: T): void {
            this.items.push(item);
        }
    
        // Phương thức generic bên trong một class generic
        // U có thể khác với T của class
        findFirst<U extends T>(predicate: (item: T) => item is U): U | undefined; // Overload cho type guard
        findFirst(predicate: (item: T) => boolean): T | undefined;
        findFirst(predicate: (item: T) => boolean): T | undefined {
            for (const item of this.items) {
                if (predicate(item)) {
                    return item;
                }
            }
            return undefined;
        }
    
        getAll(): T[] {
            return this.items;
        }
    }
    
    interface Product { id: number; name: string; price: number; }
    interface Book extends Product { author: string; }
    
    let productCollection = new Collection<Product>();
    productCollection.add({ id: 1, name: "Laptop", price: 1200 });
    productCollection.add({ id: 2, name: "TypeScript Programming", price: 45, author: "Some Author" } as Book); // Ép kiểu Book
    productCollection.add({ id: 3, name: "Mouse", price: 25 });
    
    // Tìm sản phẩm có giá > 100
    let expensiveProduct = productCollection.findFirst(p => p.price > 100);
    console.log("Expensive product:", expensiveProduct);
    
    // Sử dụng type guard với phương thức generic để tìm Book
    function isBook(product: Product): product is Book {
        return (product as Book).author !== undefined;
    }
    let firstBook = productCollection.findFirst(isBook);
    if (firstBook) {
        console.log(`First book found: ${firstBook.name} by ${firstBook.author}`);
    } else {
        console.log("No book found in the collection.");
    }
    
    
    // 3. Generic Interface cho một Factory Function
    interface Factory<T> {
        create(...args: any[]): T;
    }
    
    class User {
        constructor(public id: number, public username: string) {}
    }
    
    class Item {
        constructor(public sku: string, public name: string) {}
    }
    
    // Triển khai Factory cho User
    const userFactory: Factory<User> = {
        create: (id: number, username: string) => new User(id, username)
    };
    
    // Triển khai Factory cho Item
    const itemFactory: Factory<Item> = {
        create: (sku: string, name: string) => new Item(sku, name)
    };
    
    let userFromFactory = userFactory.create(1, "admin");
    let itemFromFactory = itemFactory.create("TS-001", "TypeScript Handbook");
    
    console.log(userFromFactory);
    console.log(itemFromFactory);

**Danh sách bài tập**

1.  **Trắc nghiệm: Mục đích chính của Generics trong TypeScript là gì?**
    

**Tiêu đề**

Hiểu về mục đích của Generics.

**Mô tả**

Chọn đáp án đúng nhất mô tả mục đích chính của Generics.

**Câu hỏi**

Mục đích chính của việc sử dụng Generics trong TypeScript là gì?

*   A. Để tăng tốc độ biên dịch của code TypeScript.
    
*   B. Để tạo ra các thành phần (hàm, class, interface) có thể tái sử dụng với nhiều kiểu dữ liệu khác nhau mà vẫn đảm bảo an toàn kiểu.
    
*   C. Để giảm kích thước của file JavaScript được biên dịch ra.
    
*   D. Để cho phép sử dụng kiểu `any` một cách an toàn hơn.
    

**Đáp án**

B

1.  **Code: Viết generic function `reverseArray`.**
    
    **Tiêu đề**
    
    Thực hành Generic Function.
    
    **Mô tả**
    
    Viết một generic function tên là `reverseArray<T>(arr: T[]): T[]`. Hàm này nhận vào một mảng các phần tử kiểu `T` và trả về một mảng mới chứa các phần tử của mảng đầu vào theo thứ tự đảo ngược. Không được thay đổi mảng gốc.
    
    **Giải pháp mẫu**
    
        function reverseArray<T>(arr: T[]): T[] {
            return [...arr].reverse(); // Tạo một bản sao của mảng rồi đảo ngược
        }
        
        let originalNumbers = [1, 2, 3, 4, 5];
        let reversedNumbers = reverseArray(originalNumbers);
        console.log("Original Numbers:", originalNumbers);   // [1, 2, 3, 4, 5]
        console.log("Reversed Numbers:", reversedNumbers);   // [5, 4, 3, 2, 1]
        
        let originalStrings = ["a", "b", "c"];
        let reversedStrings = reverseArray(originalStrings);
        console.log("Original Strings:", originalStrings);   // ["a", "b", "c"]
        console.log("Reversed Strings:", reversedStrings);   // ["c", "b", "a"]
    
2.  **Code: Tạo generic interface `ResponseData`.**
    
    **Tiêu đề**
    
    Thực hành Generic Interface.
    
    **Mô tả**
    
    Tạo một generic interface tên là `ResponseData<T>` dùng để mô tả cấu trúc của một phản hồi từ API. Interface này nên có các thuộc tính:
    
    *   `success` (kiểu `boolean`)
        
    *   `data` (kiểu `T` - đây là phần dữ liệu chính, có thể là bất kỳ kiểu gì)
        
    *   `timestamp` (kiểu `Date`) Tạo một vài đối tượng ví dụ sử dụng interface này với các kiểu khác nhau cho `T`.
        
    
    **Giải pháp mẫu**
    
        interface ResponseData<T> {
            success: boolean;
            data: T;
            timestamp: Date;
        }
        
        type UserProfile = {
            id: string;
            name: string;
            email: string;
        };
        
        let userResponse: ResponseData<UserProfile> = {
            success: true,
            data: { id: "user001", name: "Alice Johnson", email: "alice@example.com" },
            timestamp: new Date()
        };
        
        let productListResponse: ResponseData<string[]> = {
            success: true,
            data: ["Laptop", "Mouse", "Keyboard"],
            timestamp: new Date()
        };
        
        let errorResponse: ResponseData<null> = { // Data có thể là null khi có lỗi
            success: false,
            data: null,
            timestamp: new Date()
        };
        
        console.log("User Response Data:", userResponse.data.name);
        console.log("Product List:", productListResponse.data.join(", "));
        console.log("Error Response Success Status:", errorResponse.success);
    
3.  **Code: Viết generic class `Stack<T>`.**
    
    **Tiêu đề**
    
    Thực hành Generic Class.
    
    **Mô tả**
    
    Viết một generic class tên là `Stack<T>` (ngăn xếp). Class này nên có các phương thức sau:
    
    *   `push(item: T): void`: Thêm một phần tử vào đỉnh stack.
        
    *   `pop(): T | undefined`: Loại bỏ và trả về phần tử ở đỉnh stack. Trả về `undefined` nếu stack rỗng.
        
    *   `peek(): T | undefined`: Trả về phần tử ở đỉnh stack mà không loại bỏ nó. Trả về `undefined` nếu stack rỗng.
        
    *   `isEmpty(): boolean`: Kiểm tra xem stack có rỗng không.
        
    *   `size(): number`: Trả về số lượng phần tử trong stack.
        
    
    **Giải pháp mẫu**
    
        class Stack<T> {
            private items: T[] = [];
        
            push(item: T): void {
                this.items.push(item);
            }
        
            pop(): T | undefined {
                return this.items.pop();
            }
        
            peek(): T | undefined {
                if (this.isEmpty()) {
                    return undefined;
                }
                return this.items[this.items.length - 1];
            }
        
            isEmpty(): boolean {
                return this.items.length === 0;
            }
        
            size(): number {
                return this.items.length;
            }
        }
        
        let numberStack = new Stack<number>();
        numberStack.push(10);
        numberStack.push(20);
        numberStack.push(30);
        console.log("Top of number stack:", numberStack.peek()); // 30
        console.log("Size of number stack:", numberStack.size()); // 3
        console.log("Popped from number stack:", numberStack.pop()); // 30
        console.log("Is number stack empty?", numberStack.isEmpty()); // false
        
        let stringStack = new Stack<string>();
        stringStack.push("Hello");
        stringStack.push("TypeScript");
        console.log("Popped from string stack:", stringStack.pop()); // "TypeScript"
        console.log("Top of string stack:", stringStack.peek());     // "Hello"
    
4.  **Code: Viết generic function `getProperty` với ràng buộc.**
    
    **Tiêu đề**
    
    Thực hành Generic Constraints.
    
    **Mô tả**
    
    Viết một generic function `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]`. Hàm này nhận vào một đối tượng `obj` kiểu `T` và một `key` kiểu `K`. Ràng buộc `K` phải là một trong các key của `T` (sử dụng `extends keyof T`). Hàm trả về giá trị của thuộc tính `key` trong `obj`. Thử nghiệm hàm với một đối tượng và các key hợp lệ/không hợp lệ.
    
    **Giải pháp mẫu**
    
        function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
            return obj[key];
        }
        
        let sampleObject = {
            id: 1,
            name: "Sample Item",
            price: 99.99,
            isActive: true
        };
        
        let itemName = getProperty(sampleObject, "name"); // OK, itemName là string
        console.log("Item Name:", itemName);
        
        let itemPrice = getProperty(sampleObject, "price"); // OK, itemPrice là number
        console.log("Item Price:", itemPrice);
        
        // let itemDescription = getProperty(sampleObject, "description");
        // Lỗi: Argument of type '"description"' is not assignable to parameter of type '"id" | "name" | "price" | "isActive"'.
        
        let itemIsActive = getProperty(sampleObject, "isActive"); // OK, itemIsActive là boolean
        console.log("Is Active:", itemIsActive);