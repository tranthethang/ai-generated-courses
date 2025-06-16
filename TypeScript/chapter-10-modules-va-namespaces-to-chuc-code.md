#### Chapter 10: Modules và Namespaces - Tổ Chức Code

**Mô tả tổng quát Chapter học**

Khi dự án TypeScript lớn dần, việc tổ chức code thành các phần nhỏ, dễ quản lý và tái sử dụng trở nên cực kỳ quan trọng. Chapter học này sẽ giới thiệu hai cơ chế chính để làm điều đó: `Modules` (theo chuẩn ES Modules) và `Namespaces` (còn gọi là internal modules trong các phiên bản TypeScript cũ). Chúng ta sẽ tìm hiểu cách sử dụng `export` và `import` để chia sẻ code giữa các file (modules), và khi nào nên sử dụng namespaces để tránh xung đột tên trong phạm vi cục bộ.

**Tiêu đề Chapter học**

Tổ Chức Code Hiệu Quả với Modules và Namespaces.

**Tóm tắt lý thuyết chính**

1.  **Tại sao cần tổ chức code? Global scope pollution.**
    

Trong JavaScript truyền thống (trước ES6 Modules), việc khai báo biến và hàm ở phạm vi toàn cục (global scope) rất phổ biến. Điều này dẫn đến các vấn đề: \* **Xung đột tên (Naming Collisions)**: Nếu nhiều phần của ứng dụng hoặc các thư viện khác nhau định nghĩa các biến/hàm cùng tên ở global scope, chúng sẽ ghi đè lên nhau, gây ra lỗi khó lường. \* **Khó quản lý dependency**: Khó theo dõi được phần code nào phụ thuộc vào phần code nào. \* **Khó bảo trì và mở rộng**: Code trở nên rối rắm khi tất cả nằm chung một nơi.

Modules và Namespaces giúp giải quyết các vấn đề này bằng cách tạo ra các phạm vi (scopes) riêng biệt cho code.

1.  **Modules trong TypeScript (Align với ES Modules):**
    
    TypeScript hoàn toàn hỗ trợ chuẩn ES Modules (ES6 modules). Bất kỳ file nào chứa `import` hoặc `export` ở cấp độ cao nhất đều được coi là một module. Các biến, hàm, class, interface, etc., được khai báo trong một module chỉ có phạm vi trong module đó, trừ khi chúng được `export` một cách tường minh.
    
    **`export` (Xuất)**
    
    *   **Named Export (Xuất theo tên)**: Bạn có thể export nhiều thành phần từ một module bằng cách đặt từ khóa `export` trước khai báo của chúng. \[source,typescript\] ---- // --- File: mathUtils.ts --- export const PI = 3.14159;
        
        export function add(a: number, b: number): number {
            return a + b;
        }
        
        export class Calculator {
            multiply(a: number, b: number) { return a \* b; }
        }
        ----
        Hoặc export một danh sách ở cuối file:
        \[source,typescript\]
        ----
        // --- File: stringUtils.ts ---
        function toUpperCase(str: string) { /\* ... \*/ }
        function toLowerCase(str: string) { /\* ... \*/ }
        // export { toUpperCase, toLowerCase }; // Bỏ comment nếu muốn dùng cách này
        ----
        
    *   **Default Export (Xuất mặc định)**: Mỗi module chỉ có thể có một default export. Nó thường được dùng cho thành phần chính của module. \[source,typescript\] ---- // --- File: logger.ts --- export default class Logger { log(message: string) { console.log(message); } } ----
        
    *   **Re-exporting (Xuất lại)**: Bạn có thể import một thành phần từ module khác và export lại nó, hoặc export trực tiếp từ module khác. \[source,typescript\] ---- // --- File: mainExporter.ts --- // export { add as sumNumbers } from './mathUtils'; // Export 'add' với tên mới 'sumNumbers' // export \* from './stringUtils'; // Export tất cả named exports từ stringUtils // export { default as MyLogger } from './logger'; // Export default export từ logger với tên MyLogger ----
        
    
    **`import` (Nhập)**
    
    *   **Named Import (Nhập theo tên)**: Import các thành phần đã được named export. \[source,typescript\] ---- // --- File: app.ts --- // import { PI, add, Calculator } from './mathUtils'; // import { toUpperCase } from './stringUtils';
        
        // console.log(PI);
        // let calc = new Calculator();
        ----
        
    *   **Default Import (Nhập mặc định)**: Import thành phần đã được default export. Tên import có thể tùy ý. \[source,typescript\] ---- // --- File: app.ts (tiếp) --- // import MyCustomLogger from './logger'; // MyCustomLogger là tên tùy chọn // const logger = new MyCustomLogger(); // logger.log("App started"); ----
        
    *   **Namespace Import (Nhập tất cả dưới dạng namespace)**: Import tất cả named exports của một module vào một đối tượng duy nhất. \[source,typescript\] ---- // --- File: app.ts (tiếp) --- // import \* as MathHelpers from './mathUtils'; // console.log(MathHelpers.PI); // console.log(MathHelpers.add(1,2)); ----
        
    *   **Import for side effects only (Chỉ nhập để chạy code)**: Đôi khi bạn chỉ muốn import một module để code trong đó được thực thi (ví dụ: polyfills, thiết lập global). \[source,typescript\] ---- // import './polyfills'; // Không gán vào biến nào ----
        
    
    **Module Resolution Strategies (Chiến lược phân giải Module)**
    
    TypeScript có các chiến lược để tìm file module khi bạn `import`. Hai chiến lược chính là:
    
    *   `classic`: (Ít dùng cho dự án mới) Tìm module tương đối và trong các thư mục cha.
        
    *   `node`: (Phổ biến nhất, mặc định khi `module` là `commonjs`, `umd`, `es2015` trở lên) Mô phỏng cách Node.js tìm module, bao gồm tìm trong `node_modules`. Cấu hình trong `tsconfig.json`:
        
    
        {
          "compilerOptions": {
            "moduleResolution": "node" // Hoặc "classic"
          }
        }
    
    **File là module**: Trong TypeScript, mỗi file `.ts` được coi là một module riêng biệt nếu nó có `import` hoặc `export` ở cấp độ cao nhất.
    
2.  **Namespaces:**
    
    Namespaces (trước đây gọi là "internal modules") là một cách của TypeScript để tổ chức code trong phạm vi toàn cục, giúp tránh xung đột tên mà không cần sử dụng hệ thống module dựa trên file (ES Modules). Namespaces đặc biệt hữu ích khi làm việc với code JavaScript cũ không sử dụng modules, hoặc khi bạn muốn nhóm các thành phần liên quan lại với nhau trong một đối tượng lớn.
    
    **Mục đích sử dụng**: **Tránh xung đột tên trong global scope.** Nhóm các class, interface, hàm, biến liên quan. \*\* Hữu ích cho các ứng dụng nhỏ hoặc khi làm việc với các file script được gộp lại (ví dụ: dùng thẻ `<script>` trong HTML).
    
    **Khai báo Namespace**:
    
        namespace Validation {
            export interface StringValidator {
                isAcceptable(s: string): boolean;
            }
        
            const lettersRegexp = /^[A-Za-z]+$/;
            const numberRegexp = /^[0-9]+$/;
        
            export class LettersOnlyValidator implements StringValidator {
                isAcceptable(s: string) {
                    return lettersRegexp.test(s);
                }
            }
        
            export class ZipCodeValidator implements StringValidator {
                isAcceptable(s: string) {
                    return s.length === 5 && numberRegexp.test(s);
                }
            }
        }
    
    Bên trong namespace, bạn cần `export` các thành phần mà bạn muốn truy cập từ bên ngoài namespace.
    
    **Sử dụng Namespace**:
    
        // Sử dụng trong cùng file hoặc file khác (nếu namespace được khai báo global hoặc được gộp file)
        let strings = ["Hello", "98052", "101"];
        
        // Validators to use
        let validators: { [s: string]: Validation.StringValidator; } = {};
        validators["ZIP code"] = new Validation.ZipCodeValidator();
        validators["Letters only"] = new Validation.LettersOnlyValidator();
        
        // Show whether each string passed each validator
        strings.forEach(s => {
            for (let name in validators) {
                console.log(`"${s}" - ${validators[name].isAcceptable(s) ? "matches" : "does not match"} ${name}`);
            }
        });
    
    **Nested Namespaces (Namespace lồng nhau)**:
    
        namespace Forms {
            export namespace Controls {
                export class Button { /* ... */ }
                export class TextBox { /* ... */ }
            }
        }
        let button = new Forms.Controls.Button();
    
    **Namespace Aliases (Bí danh Namespace)**:
    
        // import FCV = Forms.Controls.Validation; // Nếu có namespace lồng sâu
        // let validator = new FCV.EmailValidator();
    
    **Làm việc với nhiều file**: Nếu namespace được chia thành nhiều file, bạn cần sử dụng thẻ tham chiếu ba gạch chéo (`/// <reference path="…​" />`) để thông báo cho trình biên dịch về các dependency, và biên dịch tất cả các file thành một file output duy nhất (sử dụng tùy chọn `outFile` trong `tsconfig.json`, thường dùng với `module: "amd"` hoặc `module: "system"`).
    
        // --- File: ValidatorInterfaces.ts ---
        // namespace Validation {
        //     export interface StringValidator { /* ... */ }
        // }
        
        // --- File: LetterValidator.ts ---
        // /// <reference path="ValidatorInterfaces.ts" />
        // namespace Validation {
        //     export class LettersOnlyValidator implements StringValidator { /* ... */ }
        // }
        
        // Biên dịch: tsc --outFile all.js LetterValidator.ts (và các file khác)
    
3.  **So sánh Modules và Namespaces: Khi nào dùng cái nào?**
    
    **Modules (ES Modules)**: ****Ưu điểm**:** \* Chuẩn JavaScript hiện đại. **\* Mỗi file là một module, phạm vi được cô lập.** \* Quản lý dependency rõ ràng qua `import`/`export`. **\* Hỗ trợ tốt bởi các bundler (Webpack, Rollup, Parcel).** \* Tốt cho code splitting và lazy loading. ****Khi nào dùng**:** \* **Hầu hết các dự án TypeScript hiện đại nên ưu tiên sử dụng Modules.** **\* Khi xây dựng thư viện hoặc ứng dụng có thể tái sử dụng.** \* Khi làm việc với Node.js hoặc các môi trường hỗ trợ ES Modules.
    
    **Namespaces**: ****Ưu điểm**:** \* Đơn giản để nhóm code logic liên quan trong một phạm vi cục bộ. **\* Dễ dàng chuyển đổi từ code JavaScript cũ sử dụng IIFE (Immediately Invoked Function Expressions) hoặc các pattern namespace thủ công.** \* Có thể hữu ích khi bạn cần một file JavaScript output duy nhất mà không cần bundler phức tạp (dùng `outFile`). ****Khi nào dùng**:** \* Các ứng dụng nhỏ, đơn giản, nơi việc thiết lập module phức tạp là không cần thiết. **\* Khi làm việc với các script được nhúng trực tiếp vào HTML và bạn muốn tránh xung đột global scope.** \* Để mở rộng các đối tượng toàn cục hiện có (ví dụ: thêm phương thức vào `String.prototype` một cách an toàn, mặc dù không khuyến khích).
    
    **Khuyến nghị**: ****Nên ưu tiên Modules cho các dự án mới và lớn.**** Chỉ sử dụng Namespaces nếu bạn có lý do cụ thể, ví dụ như các trường hợp đã nêu ở trên. \*\* Không nên trộn lẫn Modules và Namespaces một cách tùy tiện trong cùng một dự án vì có thể gây nhầm lẫn. Nếu một file đã là module (có `import`/`export` cấp cao nhất), thì namespace bên trong nó sẽ không được export ra global scope theo cách truyền thống của namespace.
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

**Ví dụ về Modules:**

    // --- File: services/userService.ts ---
    export interface User {
        id: number;
        name: string;
        email: string;
    }
    
    export function getUserById(id: number): User | undefined {
        // Giả lập lấy user từ database
        const users: User[] = [
            { id: 1, name: "Alice", email: "alice@example.com" },
            { id: 2, name: "Bob", email: "bob@example.com" }
        ];
        return users.find(user => user.id === id);
    }
    
    export default class UserAPI {
        static fetchAllUsers(): Promise<User[]> {
            console.log("Fetching all users...");
            return Promise.resolve([
                { id: 1, name: "Alice", email: "alice@example.com" },
                { id: 2, name: "Bob", email: "bob@example.com" }
            ]);
        }
    }
    
    // --- File: utils/formatter.ts ---
    export function formatDate(date: Date): string {
        return date.toLocaleDateString("vi-VN");
    }
    
    export const DEFAULT_CURRENCY = "VND";
    
    // --- File: app.ts (Sử dụng các modules) ---
    import UserApiService, { getUserById as findUser, type User as UserType } from './services/userService';
    import *_ from 'lodash'; // Ví dụ import thư viện từ node_modules (cần @types/lodash)
    import { formatDate, DEFAULT_CURRENCY } from './utils/formatter';
    
    function displayUser(userId: number) {
        const user = findUser(userId);
        if (user) {
            console.log(`User Found: ${user.name} (${user.email}), Currency: ${DEFAULT_CURRENCY}`);
        } else {
            console.log(`User with ID ${userId} not found.`);
        }
    }
    
    displayUser(1);
    displayUser(3);
    
    UserApiService.fetchAllUsers().then(users => {
        console.log("All Users:", users.map(u => u.name).join(", "));
    });
    
    console.log("Today's date:", formatDate(new Date()));
    
    // Sử dụng lodash (ví dụ)
    const numbers = [1, 5, 2, 8, 3];
    console.log("Sorted numbers (lodash):", _.sortBy(numbers));

**Ví dụ về Namespaces (cho một file output duy nhất):** Giả sử chúng ta biên dịch với `tsc --outFile app.js app.ts` (và `module` trong `tsconfig.json` không phải là `commonjs` hoặc `es6`, ví dụ `system` hoặc `amd`, hoặc không có `module` nếu chỉ dùng namespace cho global).

    // --- File: app.ts (ví dụ namespace) ---
    namespace MyCompany.Utilities {
        export function isEmpty(str: string | null | undefined): boolean {
            return !str || str.trim().length === 0;
        }
    }
    
    namespace MyCompany.Models {
        export interface Item {
            id: string;
            value: any;
        }
    }
    
    // Sử dụng namespace
    // (Trong cùng file hoặc file khác nếu được gộp lại)
    function processItem(item: MyCompany.Models.Item): void {
        if (MyCompany.Utilities.isEmpty(item.id)) {
            console.error("Item ID cannot be empty.");
            return;
        }
        console.log(`Processing item ${item.id} with value:`, item.value);
    }
    
    let item1: MyCompany.Models.Item = { id: "item-001", value: { data: "sample" } };
    let item2: MyCompany.Models.Item = { id: " ", value: 123 }; // ID rỗng
    
    processItem(item1);
    processItem(item2); // Sẽ log lỗi
    
    // console.log(MyCompany.Utilities.isEmpty(null)); // true

**Danh sách bài tập**

1.  **Trắc nghiệm: Cách nào sau đây để export một giá trị mặc định từ một module?**
    

**Tiêu đề**

Hiểu về Default Export.

**Mô tả**

Chọn cú pháp đúng để export một giá trị mặc định.

**Câu hỏi**

Trong TypeScript modules, cú pháp nào sau đây được sử dụng để export một giá trị mặc định (default export) từ một module?

*   A. `export default const myValue = 10;`
    
*   B. `export { myValue as default };` (với `const myValue = 10;` được khai báo trước)
    
*   C. `default export const myValue = 10;`
    
*   D. Cả A và B đều đúng nếu `myValue` được khai báo phù hợp. (Thực ra A không đúng cú pháp, B đúng nếu `myValue` đã khai báo. Cách phổ biến là `export default myValue;` hoặc `export default function() {}` / `export default class {}`)
    

**Đáp án đúng nhất dựa trên các lựa chọn (và sửa lại cho rõ ràng)**: B (nếu `myValue` đã được khai báo). **Cách phổ biến và đúng nhất là**:

    // const myValue = 10;
    // export default myValue;
    // HOẶC
    // export default function myFunction() { /* ... */ }
    // HOẶC
    // export default class MyClass { /* ... */ }

Nếu phải chọn từ A, B, C, D và giả sử A có thể là `const myValue = 10; export default myValue;` thì D có thể đúng. Tuy nhiên, B là cú pháp hợp lệ.

**Đáp án chính xác hơn**: `export default value;` (sau khi `value` đã được khai báo) hoặc `export default class/function/expression…​` **Nếu chọn từ các đáp án trên, B là gần đúng nhất.**

1.  **Code: Tạo module `logger.ts`.**
    
    **Tiêu đề**
    
    Thực hành tạo và sử dụng Module.
    
    **Mô tả**
    
    *   1\. Tạo một file module tên là `logger.ts`.
        
    *   2\. Bên trong `logger.ts`, export một hàm `logInfo(message: string)` in ra `[INFO] message` và một hàm `logError(message: string)` in ra `[ERROR] message`. Sử dụng named exports.
        
    *   3\. Tạo một file `main.ts`.
        
    *   4\. Bên trong `main.ts`, import và sử dụng cả hai hàm `logInfo` và `logError` từ `logger.ts`.
        
    
    **Giải pháp mẫu**
    
    `logger.ts`:
    
        export function logInfo(message: string): void {
            console.log(`[INFO] ${message}`);
        }
        
        export function logError(message: string): void {
            console.error(`[ERROR] ${message}`); // Dùng console.error cho lỗi
        }
    
    `main.ts`:
    
        import { logInfo, logError } from './logger';
        
        logInfo("Application has started successfully.");
        logError("A minor issue occurred, but was handled.");
        // Để chạy: tsc logger.ts main.ts sau đó node main.js (nếu module là commonjs)
        // Hoặc dùng ts-node main.ts
    
2.  **Code: Tạo module `constants.ts` với default và named export.**
    
    **Tiêu đề**
    
    Thực hành Default và Named Exports.
    
    **Mô tả**
    
    *   1\. Tạo một file module `constants.ts`.
        
    *   2\. Bên trong `constants.ts`:
        
        *   Export một hằng số `MAX_RETRIES` (kiểu `number`, giá trị là `5`) bằng named export.
            
        *   Export một `enum UserRole { ADMIN, EDITOR, GUEST }` bằng default export.
            
        
    *   3\. Tạo một file `appConfig.ts`.
        
    *   4\. Bên trong `appConfig.ts`, import `MAX_RETRIES` và `UserRole`. Sử dụng chúng để in ra một vài thông tin.
        
    
    **Giải pháp mẫu**
    
    `constants.ts`:
    
        export const MAX_RETRIES: number = 5;
        
        enum UserRole {
            ADMIN = "ADMIN",
            EDITOR = "EDITOR",
            GUEST = "GUEST"
        }
        export default UserRole;
    
    `appConfig.ts`:
    
        import DefaultUserRole, { MAX_RETRIES } from './constants'; // DefaultUserRole là tên tùy chọn cho default import
        
        console.log("Maximum Retries Allowed:", MAX_RETRIES);
        console.log("Default Admin Role:", DefaultUserRole.ADMIN);
        console.log("Guest Role Value:", DefaultUserRole.GUEST);
        
        let currentUserRole: DefaultUserRole = DefaultUserRole.EDITOR;
        console.log("Current User Role:", currentUserRole);
    
3.  **Code: Tạo namespace `Utils.StringHelper`.**
    
    **Tiêu đề**
    
    Thực hành với Namespaces.
    
    **Mô tả**
    
    Tạo một namespace `Utils`. Bên trong `Utils`, tạo một namespace con `StringHelper`. Namespace `StringHelper` nên chứa các hàm sau (được export):
    
    *   `reverse(s: string): string` (đảo ngược chuỗi)
        
    *   `countWords(s: string): number` (đếm số từ trong chuỗi, từ được phân cách bởi khoảng trắng) Sử dụng namespace này trong cùng file để kiểm tra các hàm.
        
    
    **Giải pháp mẫu**
    
        namespace Utils {
            export namespace StringHelper {
                export function reverse(s: string): string {
                    return s.split("").reverse().join("");
                }
        
                export function countWords(s: string): number {
                    if (!s || s.trim().length === 0) {
                        return 0;
                    }
                    return s.trim().split(/\s+/).length;
                }
            }
        }
        
        // Sử dụng namespace
        let originalString = "Hello TypeScript World";
        let reversed = Utils.StringHelper.reverse(originalString);
        let wordCount = Utils.StringHelper.countWords(originalString);
        
        console.log(`Original: "${originalString}"`);
        console.log(`Reversed: "${reversed}"`);
        console.log(`Word Count: ${wordCount}`);
        
        let emptyStr = "   ";
        console.log(`Word Count for empty string: ${Utils.StringHelper.countWords(emptyStr)}`);
    
4.  **Code: Chuyển đổi namespace ở bài 4 thành modules.**
    
    **Tiêu đề**
    
    So sánh Namespace và Module.
    
    **Mô tả**
    
    Chuyển đổi ví dụ namespace `Utils.StringHelper` từ bài tập 4 thành cấu trúc sử dụng ES Modules.
    
    *   Tạo một file `stringUtilsModule.ts`.
        
    *   Bên trong `stringUtilsModule.ts`, export các hàm `reverse` và `countWords`.
        
    *   Tạo một file `mainApp.ts` import và sử dụng các hàm này từ `stringUtilsModule.ts`.
        
    
    **Giải pháp mẫu**
    
    `stringUtilsModule.ts`:
    
        export function reverse(s: string): string {
            return s.split("").reverse().join("");
        }
        
        export function countWords(s: string): number {
            if (!s || s.trim().length === 0) {
                return 0;
            }
            return s.trim().split(/\s+/).length;
        }
    
    `mainApp.ts`:
    
        import { reverse as reverseString, countWords as countStringWords } from './stringUtilsModule';
        // Hoặc: import * as StringHelpers from './stringUtilsModule';
        
        let textToProcess = "Learning modules in TypeScript";
        
        let reversedText = reverseString(textToProcess);
        // Hoặc: let reversedText = StringHelpers.reverse(textToProcess);
        
        let wordsInText = countStringWords(textToProcess);
        // Hoặc: let wordsInText = StringHelpers.countWords(textToProcess);
        
        console.log(`Original Text: "${textToProcess}"`);
        console.log(`Reversed Text: "${reversedText}"`);
        console.log(`Number of Words: ${wordsInText}`);