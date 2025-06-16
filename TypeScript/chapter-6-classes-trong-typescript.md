#### Chapter 6: Classes trong TypeScript

**Mô tả tổng quát Chapter học**

Chapter học này sẽ đưa bạn vào thế giới lập trình hướng đối tượng (OOP) với TypeScript. Chúng ta sẽ tìm hiểu cách TypeScript mở rộng khái niệm `class` của JavaScript ES6, bổ sung các tính năng mạnh mẽ như access modifiers (`public`, `private`, `protected`), thuộc tính và phương thức `readonly`, `static members`, cũng như kế thừa (`inheritance`) và các lớp trừu tượng (`abstract classes`). Mục tiêu là giúp bạn xây dựng các cấu trúc code có tổ chức, dễ tái sử dụng và bảo trì hơn.

**Tiêu đề Chapter học**

Lập Trình Hướng Đối Tượng với Classes.

**Tóm tắt lý thuyết chính**

1.  **Khai báo Class, Properties, Methods và Constructors:**
    

Class là một bản thiết kế để tạo ra các đối tượng (instances). **Properties (Thuộc tính)**:: Là các biến thuộc về class, lưu trữ trạng thái của đối tượng. **Methods (Phương thức)**:: Là các hàm thuộc về class, định nghĩa hành vi của đối tượng. **Constructor**:: Là một phương thức đặc biệt được gọi tự động khi một đối tượng mới của class được tạo ra (sử dụng từ khóa `new`). Nó thường được dùng để khởi tạo các thuộc tính của đối tượng.

    class Greeter {
        // Property
        greeting: string;
    
        // Constructor
        constructor(message: string) {
            this.greeting = message;
            console.log("Greeter object created!");
        }
    
        // Method
        greet(): string {
            return "Hello, " + this.greeting;
        }
    }
    
    let greeterInstance = new Greeter("world"); // "Greeter object created!" được in ra
    console.log(greeterInstance.greet());      // "Hello, world"

1.  **Access Modifiers (Bộ điều chỉnh truy cập):**
    
    TypeScript cung cấp các access modifier để kiểm soát khả năng truy cập vào các thành viên (properties và methods) của class từ bên ngoài class đó. **`public`**:: (Mặc định) Thành viên có thể được truy cập từ bất kỳ đâu. **`private`**:: Thành viên chỉ có thể được truy cập từ bên trong class khai báo nó. Không thể truy cập từ instance bên ngoài hoặc từ class con. **`protected`**:: Thành viên có thể được truy cập từ bên trong class khai báo nó và từ các class con kế thừa nó. Không thể truy cập từ instance bên ngoài.
    
        class Animal {
            public name: string;        // Truy cập tự do
            private age: number;        // Chỉ truy cập trong class Animal
            protected sound: string;    // Truy cập trong Animal và class con
        
            constructor(name: string, age: number, sound: string) {
                this.name = name;
                this.age = age;
                this.sound = sound;
            }
        
            public makeSound(): void {
                console.log(`${this.name} makes a ${this.sound} sound.`);
            }
        
            private getAnimalAge(): number { // Phương thức private
                return this.age;
            }
        
            public displayAge(): void {
                console.log(`${this.name} is ${this.getAnimalAge()} years old.`);
            }
        }
        
        let myPet = new Animal("Doggy", 5, "Woof");
        console.log(myPet.name); // OK, name là public
        myPet.makeSound();       // OK
        // console.log(myPet.age); // Lỗi: Property 'age' is private.
        // myPet.getAnimalAge();   // Lỗi: Property 'getAnimalAge' is private.
        myPet.displayAge();      // OK, gọi phương thức public, bên trong nó gọi phương thức private
        
        class Cat extends Animal {
            constructor(name: string, age: number) {
                super(name, age, "Meow");
            }
        
            public purr(): void {
                console.log(`${this.name} is purring. It says ${this.sound}.`); // OK, sound là protected
                // console.log(this.age); // Lỗi: Property 'age' is private and only accessible within class 'Animal'.
            }
        }
        let myCat = new Cat("Whiskers", 3);
        myCat.purr();
    
2.  **Readonly Properties (Thuộc tính chỉ đọc):**
    
    Sử dụng từ khóa `readonly` trước tên thuộc tính để làm cho nó chỉ có thể được gán giá trị một lần, thường là trong constructor hoặc tại thời điểm khai báo.
    
        class Configuration {
            readonly apiKey: string;
            readonly apiVersion: string = "v1"; // Gán tại thời điểm khai báo
        
            constructor(key: string) {
                this.apiKey = key; // Gán trong constructor
            }
        
            updateKey(newKey: string) {
                // this.apiKey = newKey; // Lỗi: Cannot assign to 'apiKey' because it is a read-only property.
            }
        }
        let appConfig = new Configuration("XYZ123");
        console.log(appConfig.apiKey); // "XYZ123"
        // appConfig.apiVersion = "v2"; // Lỗi
    
3.  **Getters và Setters (Phương thức truy cập):**
    
    Getters và setters cho phép bạn kiểm soát cách truy cập và thay đổi giá trị của một thuộc tính, thường là các thuộc tính `private`. Chúng được định nghĩa giống như phương thức nhưng được truy cập như thuộc tính.
    
        class Employee {
            private _fullName: string = ""; // Thường dùng dấu gạch dưới cho thuộc tính private được quản lý bởi getter/setter
        
            get fullName(): string {
                console.log("Getter for fullName called.");
                return this._fullName;
            }
        
            set fullName(newName: string) {
                console.log("Setter for fullName called.");
                if (newName && newName.length > 0) {
                    this._fullName = newName;
                } else {
                    console.error("Full name cannot be empty.");
                }
            }
        }
        
        let emp = new Employee();
        emp.fullName = "John Smith";      // Gọi setter
        console.log(emp.fullName);        // Gọi getter (Output: John Smith)
        emp.fullName = "";                // Gọi setter, sẽ in lỗi
        console.log(emp.fullName);        // Vẫn là "John Smith"
    
4.  **Static Members (Thành viên tĩnh):**
    
    Thành viên tĩnh (properties và methods) thuộc về chính class đó, chứ không phải thuộc về một instance cụ thể của class. Bạn truy cập thành viên tĩnh bằng tên class.
    
        class MathHelper {
            static readonly PI: number = 3.1415926535; // Thuộc tính static readonly
        
            static E: number = 2.71828; // Thuộc tính static
        
            static add(x: number, y: number): number { // Phương thức static
                return x + y;
            }
        }
        console.log(MathHelper.PI);        // 3.1415926535
        // MathHelper.PI = 3.14; // Lỗi: PI là readonly
        MathHelper.E = 2.718;
        console.log(MathHelper.add(5, 7)); // 12
        
        // let helperInstance = new MathHelper();
        // console.log(helperInstance.PI); // Lỗi: PI là static member
    
5.  **Inheritance (Kế thừa):**
    
    Kế thừa cho phép một class (class con, derived class) kế thừa các thuộc tính và phương thức từ một class khác (class cha, base class). Sử dụng từ khóa `extends`. Class con có thể override (ghi đè) các phương thức của class cha và gọi phương thức của class cha bằng từ khóa `super`.
    
        class Shape {
            color: string;
            constructor(color: string) {
                this.color = color;
            }
            draw(): void {
                console.log(`Drawing a shape with color ${this.color}`);
            }
        }
        
        class Circle extends Shape {
            radius: number;
            constructor(color: string, radius: number) {
                super(color); // Gọi constructor của class cha (Shape)
                this.radius = radius;
            }
        
            // Override phương thức draw của class cha
            draw(): void {
                super.draw(); // Gọi phương thức draw của class cha
                console.log(`Specifically, drawing a circle with radius ${this.radius}.`);
            }
        
            calculateArea(): number {
                return Math.PI * this.radius * this.radius;
            }
        }
        
        let redCircle = new Circle("red", 5);
        redCircle.draw();
        // Output:
        // Drawing a shape with color red
        // Specifically, drawing a circle with radius 5.
        console.log("Area:", redCircle.calculateArea());
    
6.  **Abstract Classes và Abstract Methods (Lớp và Phương thức trừu tượng):**
    
    **Abstract Class**
    
    Là một class không thể tạo instance trực tiếp. Nó được dùng làm class cha cho các class khác kế thừa. Một abstract class có thể chứa các abstract methods.
    
    **Abstract Method**
    
    Là một phương thức được khai báo trong abstract class nhưng không có phần thân (implementation). Các class con không phải abstract bắt buộc phải triển khai (implement) tất cả các abstract methods của class cha.
    
        abstract class Logger {
            abstract log(message: string): void; // Phương thức trừu tượng
        
            printDate(): void { // Phương thức thông thường, có thể được kế thừa
                console.log(new Date().toLocaleTimeString());
            }
        }
        
        // let myLogger = new Logger(); // Lỗi: Cannot create an instance of an abstract class.
        
        class ConsoleLogger extends Logger {
            // Bắt buộc phải implement phương thức log
            log(message: string): void {
                console.log(`[CONSOLE] ${message}`);
            }
        
            extraMethod() {
                console.log("This is an extra method in ConsoleLogger.");
            }
        }
        
        class FileLogger extends Logger {
            log(message: string): void {
                // Giả lập ghi ra file
                console.log(`[FILE] Writing to file: ${message}`);
            }
        }
        
        let consoleLogger: Logger = new ConsoleLogger(); // OK
        consoleLogger.printDate();
        consoleLogger.log("User action performed.");
        // consoleLogger.extraMethod(); // Lỗi: Property 'extraMethod' does not exist on type 'Logger'.
                                       // Cần ép kiểu hoặc khai báo biến là ConsoleLogger
        
        let fileLogger: FileLogger = new FileLogger();
        fileLogger.printDate();
        fileLogger.log("System event occurred.");
    
7.  **Shorthand Constructor Initialization (Khởi tạo constructor rút gọn):**
    
    TypeScript cung cấp một cú pháp rút gọn để khai báo và khởi tạo các thuộc tính của class ngay trong danh sách tham số của constructor, bằng cách sử dụng access modifiers (`public`, `private`, `protected`) hoặc `readonly` trước tên tham số.
    
        class Person {
            // Không cần khai báo thuộc tính ở đây nữa
            // public name: string;
            // private age: number;
        
            constructor(public readonly id: number, public name: string, private age: number) {
                // TypeScript tự động tạo các thuộc tính this.id, this.name, this.age
                // và gán giá trị từ tham số.
            }
        
            displayInfo(): void {
                console.log(`ID: ${this.id}, Name: ${this.name}, Age: ${this.age}`);
                // this.id = 2; // Lỗi: id là readonly
            }
        }
        
        let person1 = new Person(1, "Alice Smith", 30);
        person1.displayInfo(); // ID: 1, Name: Alice Smith, Age: 30
        console.log(person1.name); // Alice Smith
        // console.log(person1.age); // Lỗi: Property 'age' is private.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

    abstract class MediaItem {
        // Shorthand constructor với readonly và protected
        constructor(public readonly title: string, protected duration: number) {}
    
        abstract play(): void; // Mỗi loại media sẽ có cách play khác nhau
    
        getDetails(): string {
            return `Title: ${this.title}, Duration: ${this.duration} seconds`;
        }
    
        static getLibraryName(): string {
            return "My Awesome Media Library";
        }
    }
    
    class Song extends MediaItem {
        // Thêm thuộc tính riêng cho Song
        constructor(title: string, duration: number, public artist: string, private album?: string) {
            super(title, duration); // Gọi constructor của MediaItem
        }
    
        play(): void {
            console.log(`Playing song: ${this.title} by ${this.artist} (Duration: ${this.duration}s)`);
            if (this.album) {
                console.log(`Album: ${this.album}`);
            }
        }
    
        // Getter cho album (ví dụ)
        get songAlbum(): string | undefined {
            return this.album;
        }
    }
    
    class Movie extends MediaItem {
        constructor(title: string, duration: number, public director: string, private _rating: number = 0) {
            super(title, duration);
        }
    
        play(): void {
            console.log(`Playing movie: ${this.title}, Directed by: ${this.director} (Duration: ${this.duration / 60} mins)`);
        }
    
        get rating(): number {
            return this._rating;
        }
    
        set rating(newRating: number) {
            if (newRating >= 0 && newRating <= 10) {
                this._rating = newRating;
            } else {
                console.warn("Rating must be between 0 and 10.");
            }
        }
    }
    
    console.log("Library Name:", MediaItem.getLibraryName());
    
    const song1 = new Song("Bohemian Rhapsody", 354, "Queen", "A Night at the Opera");
    const movie1 = new Movie("Inception", 8880, "Christopher Nolan"); // 8880 seconds = 148 minutes
    
    song1.play();
    console.log(song1.getDetails());
    console.log("Song Album:", song1.songAlbum);
    
    movie1.play();
    console.log(movie1.getDetails());
    movie1.rating = 9.5;
    console.log("Movie Rating:", movie1.rating);
    movie1.rating = 11; // Sẽ có warning
    
    // let genericMedia = new MediaItem("Generic", 120); // Lỗi: Cannot create an instance of an abstract class.
    
    let playlist: MediaItem[] = [song1, movie1];
    console.log("\n--- Playlist ---");
    playlist.forEach(item => {
        item.play();
        // Để truy cập thuộc tính/phương thức riêng của Song hoặc Movie, cần type guard
        if (item instanceof Song) {
            console.log(`Artist of this song: ${item.artist}`);
        } else if (item instanceof Movie) {
            console.log(`Director of this movie: ${item.director}`);
        }
    });

**Danh sách bài tập**

1.  **Trắc nghiệm: Access modifier nào cho phép một thuộc tính chỉ được truy cập từ bên trong class đó và các class con của nó?**
    

**Tiêu đề**

Hiểu về Access Modifiers.

**Mô tả**

Chọn access modifier đúng với mô tả.

**Câu hỏi**

Trong TypeScript, access modifier nào cho phép một thuộc tính hoặc phương thức chỉ được truy cập từ bên trong class khai báo nó và từ các class con kế thừa nó, nhưng không thể truy cập từ instance bên ngoài?

*   A. `public`
    
*   B. `private`
    
*   C. `protected`
    
*   D. `readonly` (Đây không phải là access modifier)
    

**Đáp án**

C

1.  **Code: Tạo class `Vehicle`.**
    
    **Tiêu đề**
    
    Thực hành tạo Class cơ bản.
    
    **Mô tả**
    
    Tạo một class `Vehicle` với các thuộc tính sau (sử dụng shorthand constructor nếu có thể):
    
    *   `make` (kiểu `string`, public)
        
    *   `model` (kiểu `string`, public)
        
    *   `year` (kiểu `number`, public)
        
    *   `_vin` (kiểu `string`, private, là Vehicle Identification Number) Thêm một phương thức `displayInfo()` để in ra thông tin `make`, `model`, và `year`. Thêm một constructor nhận các giá trị cho `make`, `model`, `year`, và `_vin`.
        
    
    **Giải pháp mẫu**
    
        class Vehicle {
            private _vin: string; // Không thể dùng shorthand nếu cần logic trong constructor cho nó
        
            constructor(public make: string, public model: string, public year: number, vin: string) {
                if (vin.length !== 17) {
                    throw new Error("VIN must be 17 characters long.");
                }
                this._vin = vin;
            }
        
            displayInfo(): void {
                console.log(`Vehicle: ${this.year} ${this.make} ${this.model}`);
            }
        
            getVIN(): string { // Cần một cách để truy cập VIN nếu cần thiết (ví dụ: cho mục đích hiển thị có kiểm soát)
                return this._vin;
            }
        }
        
        try {
            let myCar = new Vehicle("Honda", "CRV", 2021, "1234567890ABCDEFG");
            myCar.displayInfo();
            console.log("VIN:", myCar.getVIN());
        
            // let invalidCar = new Vehicle("Toyota", "Camry", 2020, "123"); // Sẽ throw error
        } catch (e: any) {
            console.error("Error creating vehicle:", e.message);
        }
    
2.  **Code: Kế thừa class `Vehicle`.**
    
    **Tiêu đề**
    
    Thực hành Kế thừa Class.
    
    **Mô tả**
    
    Mở rộng class `Vehicle` đã tạo ở bài 2. Tạo một class `Car` kế thừa từ `Vehicle`. Class `Car` có thêm một thuộc tính:
    
    *   `numberOfDoors` (kiểu `number`, public) Constructor của `Car` nhận tất cả các tham số cần thiết cho `Vehicle` và `numberOfDoors`. Override phương thức `displayInfo()` trong class `Car` để bao gồm cả thông tin `numberOfDoors`.
        
    
    **Giải pháp mẫu**
    
        class Vehicle {
            private _vin: string;
            constructor(public make: string, public model: string, public year: number, vin: string) {
                if (vin.length !== 17) { throw new Error("VIN must be 17 characters long."); }
                this._vin = vin;
            }
            displayInfo(): void {
                console.log(`Vehicle: ${this.year} ${this.make} ${this.model}`);
            }
            getVIN(): string { return this._vin; }
        }
        
        class Car extends Vehicle {
            constructor(
                make: string,
                model: string,
                year: number,
                vin: string,
                public numberOfDoors: number
            ) {
                super(make, model, year, vin); // Gọi constructor của Vehicle
            }
        
            // Override displayInfo
            displayInfo(): void {
                super.displayInfo(); // Gọi displayInfo của class cha
                console.log(`Number of Doors: ${this.numberOfDoors}`);
            }
        }
        
        try {
            let sedan = new Car("Toyota", "Camry", 2023, "ABC123DEF456GHI789", 4);
            sedan.displayInfo();
            console.log("VIN:", sedan.getVIN());
        } catch (e: any) {
            console.error("Error creating car:", e.message);
        }
    
3.  **Code: Getters và Setters cho `_vin`.**
    
    **Tiêu đề**
    
    Thực hành Getters và Setters.
    
    **Mô tả**
    
    Trong class `Vehicle` (hoặc `Car` nếu bạn muốn), thay vì phương thức `getVIN()`, hãy tạo một getter `vin` để trả về `_vin`. Tạo một setter `vin` cho `_vin`. Setter này chỉ cho phép gán giá trị mới nếu VIN được cung cấp có độ dài đúng 17 ký tự; nếu không, in ra một cảnh báo và không thay đổi giá trị.
    
    **Giải pháp mẫu**
    
        class VehicleWithVinAccessors {
            private _vin: string;
        
            constructor(public make: string, public model: string, public year: number, initialVin: string) {
                this.vin = initialVin; // Sử dụng setter ngay trong constructor để validate
            }
        
            displayInfo(): void {
                console.log(`Vehicle: ${this.year} ${this.make} ${this.model}`);
            }
        
            get vin(): string {
                console.log("Getter for VIN accessed.");
                return this._vin;
            }
        
            set vin(newVin: string) {
                console.log("Setter for VIN attempting to set:", newVin);
                if (newVin && newVin.length === 17) {
                    this._vin = newVin;
                    console.log("VIN updated successfully.");
                } else {
                    console.warn("Invalid VIN format. VIN not updated. Must be 17 characters.");
                    // Nếu _vin chưa được khởi tạo, cần xử lý trường hợp này
                    if (this._vin === undefined) {
                         throw new Error("Initial VIN is invalid and _vin was not set.");
                    }
                }
            }
        }
        
        try {
            let truck = new VehicleWithVinAccessors("Ford", "F-150", 2022, "TRUCK123456789000");
            truck.displayInfo();
            console.log("Current VIN:", truck.vin); // Gọi getter
        
            truck.vin = "NEWVIN12345678900"; // Gọi setter - hợp lệ
            console.log("Updated VIN:", truck.vin);
        
            truck.vin = "SHORTVIN"; // Gọi setter - không hợp lệ
            console.log("VIN after invalid attempt:", truck.vin); // Vẫn là giá trị hợp lệ trước đó
        
            // let badInitialVin = new VehicleWithVinAccessors("Dodge", "Ram", 2020, "BAD"); // Sẽ throw error từ constructor
        } catch (e: any) {
            console.error("Error:", e.message);
        }
    
4.  **Code: Abstract class `DataProcessor`.**
    
    **Tiêu đề**
    
    Thực hành Abstract Class.
    
    **Mô tả**
    
    *   1\. Tạo một `abstract class` tên là `DataProcessor<TInput, TOutput>`.
        
    *   2\. Class này có một phương thức `abstract process(data: TInput): TOutput`.
        
    *   3\. Class này cũng có một phương thức thông thường `logStart()` in ra "Data processing started." và `logEnd()` in ra "Data processing finished.".
        
    *   4\. Tạo hai class con:
        
        *   `StringToNumberProcessor` kế thừa `DataProcessor<string, number>`, triển khai `process` để chuyển một chuỗi số thành số (dùng `parseInt`).
            
        *   `ArraySumProcessor` kế thừa `DataProcessor<number[], number>`, triển khai `process` để tính tổng các số trong mảng.
            
        
    *   5\. Tạo instance của hai class con và gọi các phương thức của chúng.
        
    
    **Giải pháp mẫu**
    
        abstract class DataProcessor<TInput, TOutput> {
            abstract process(data: TInput): TOutput; // Phương thức trừu tượng
        
            logStart(): void {
                console.log("Data processing started.");
            }
        
            logEnd(): void {
                console.log("Data processing finished.");
            }
        
            // Phương thức template có thể gọi các phương thức trừu tượng và cụ thể
            execute(data: TInput): TOutput {
                this.logStart();
                const result = this.process(data);
                this.logEnd();
                return result;
            }
        }
        
        class StringToNumberProcessor extends DataProcessor<string, number> {
            process(data: string): number {
                const num = parseInt(data, 10);
                if (isNaN(num)) {
                    console.error(`'${data}' is not a valid number string.`);
                    return 0; // Hoặc throw error
                }
                return num;
            }
        }
        
        class ArraySumProcessor extends DataProcessor<number[], number> {
            process(data: number[]): number {
                return data.reduce((sum, current) => sum + current, 0);
            }
        }
        
        let stringParser = new StringToNumberProcessor();
        let numResult = stringParser.execute("12345");
        console.log("Parsed number:", numResult); // Parsed number: 12345
        stringParser.execute("abc"); // Sẽ có lỗi từ process
        
        let arraySummer = new ArraySumProcessor();
        let sumResult = arraySummer.execute([10, 20, 30, 40]);
        console.log("Sum of array:", sumResult); // Sum of array: 100