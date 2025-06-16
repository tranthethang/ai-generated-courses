#### Chapter 11: Tích Hợp TypeScript với JavaScript Hiện Có và Declaration Files

**Mô tả tổng quát Chapter học**

Chapter học này tập trung vào việc làm thế nào để TypeScript có thể "sống chung" hòa bình với các dự án JavaScript hiện có và cách tương tác với các thư viện JavaScript từ bên trong code TypeScript. Chúng ta sẽ khám phá các chiến lược tích hợp, và quan trọng nhất là tìm hiểu về `Declaration Files` (`.d.ts`) - những file cung cấp thông tin kiểu cho code JavaScript, cho phép TypeScript hiểu và kiểm tra kiểu của các thư viện bên ngoài hoặc code JavaScript cũ.

**Tiêu đề Chapter học**

Làm Việc Chung: TypeScript với JavaScript và Declaration Files.

**Tóm tắt lý thuyết chính**

1.  **Chiến lược tích hợp TypeScript vào dự án JavaScript:**
    

Việc chuyển đổi một dự án JavaScript lớn sang TypeScript hoàn toàn có thể là một quá trình tốn nhiều công sức. Do đó, việc áp dụng TypeScript một cách từ từ (gradual adoption) thường là chiến lược tốt nhất.

**Dần dần (Gradual Adoption)**

*   Bắt đầu bằng cách thêm TypeScript vào các module mới.
    
*   Dần dần chuyển đổi các file JavaScript (`.js`) hiện có sang TypeScript (`.ts`).
    
*   Sử dụng các tùy chọn trong `tsconfig.json` để cho phép TypeScript làm việc cùng với JavaScript.
    

**Cấu hình `tsconfig.json` hỗ trợ JavaScript**

*   `allowJs: true`: Cho phép trình biên dịch TypeScript biên dịch cả các file JavaScript (`.js` và `.jsx`). TypeScript sẽ không kiểm tra kiểu cho các file này trừ khi có `checkJs`.
    
*   `checkJs: true`: Bật kiểm tra kiểu cho các file JavaScript. Bạn có thể sử dụng JSDoc annotations trong file `.js` để cung cấp thông tin kiểu cho TypeScript. \[source,typescript\] ---- // file: legacyUtils.js // /\*\* // \* Adds two numbers. // \* @param {number} a The first number. // \* @param {number} b The second number. // \* @returns {number} The sum of a and b. // \*/ // function add(a, b) { // return a + b; // } // module.exports = { add }; ----
    
*   `noEmit: true`: (Nếu bạn chỉ muốn dùng TypeScript để kiểm tra kiểu mà không tạo ra file output) Trình biên dịch sẽ thực hiện kiểm tra kiểu nhưng không tạo ra file JavaScript. Thường dùng khi bạn sử dụng một build tool khác (như Babel) để biên dịch TypeScript.
    
*   `outDir` và `rootDir`: Quan trọng để quản lý cấu trúc thư mục khi biên dịch cả file `.ts` và `.js`.
    

1.  **Sử dụng thư viện JavaScript trong TypeScript:**
    
    Khi bạn muốn sử dụng một thư viện JavaScript (ví dụ: jQuery, Lodash, Express) trong dự án TypeScript, trình biên dịch TypeScript cần biết về các kiểu dữ liệu mà thư viện đó cung cấp.
    
    **Vấn đề**: TypeScript không thể tự động suy luận kiểu từ code JavaScript của thư viện. Nếu bạn cố gắng sử dụng thư viện mà không có thông tin kiểu, TypeScript sẽ báo lỗi hoặc coi các thành phần của thư viện là kiểu `any`.
    
    **Declaration Files (`.d.ts`)**
    
    *   Đây là các file đặc biệt (có phần mở rộng `.d.ts`) chứa các khai báo kiểu (type declarations) cho code JavaScript. Chúng không chứa code thực thi, chỉ mô tả "hình dạng" của thư viện.
        
    *   Ví dụ, một file `lodash.d.ts` sẽ mô tả các hàm, kiểu dữ liệu của tham số và giá trị trả về của thư viện Lodash.
        
    
    **Tìm và cài đặt Declaration Files từ DefinitelyTyped**
    
    *   DefinitelyTyped (\[[https://definitelytyped.org/](https://definitelytyped.org/)\]([https://definitelytyped.org/](https://definitelytyped.org/))) là một kho lưu trữ khổng lồ chứa các file declaration chất lượng cao cho hàng ngàn thư viện JavaScript phổ biến, được duy trì bởi cộng đồng.
        
    *   Các file declaration này thường được xuất bản dưới dạng các package `@types` trên npm.
        
    *   Để cài đặt, bạn chạy lệnh: \[source,bash\] ---- npm install --save-dev @types/package-name # Ví dụ cho lodash: # npm install --save-dev @types/lodash ----
        
    *   Sau khi cài đặt, TypeScript sẽ tự động tìm và sử dụng các file `.d.ts` này từ thư mục `node_modules/@types`. \[source,typescript\] ---- // Giả sử đã cài @types/lodash import \_ from 'lodash'; // TypeScript hiểu \_ là gì
        
        const numbers = \[1, 2, 3, 4\];
        const shuffled = \_.shuffle(numbers); // OK, TypeScript biết kiểu của shuffle và shuffled
        console.log(shuffled);
        ----
        
    
2.  **Viết Declaration Files cơ bản:**
    
    Nếu một thư viện JavaScript không có sẵn file declaration trên DefinitelyTyped, hoặc bạn đang làm việc với code JavaScript nội bộ của riêng mình, bạn có thể tự viết file `.d.ts`.
    
    **Khai báo biến, hàm, class (Ambient Declarations)**
    
    Sử dụng từ khóa `declare` để thông báo cho TypeScript rằng các biến, hàm, class này tồn tại ở đâu đó (thường là trong code JavaScript) và cung cấp kiểu cho chúng. \[source,typescript\] ---- // --- File: my-legacy-library.d.ts --- declare const GLOBAL\_API\_KEY: string;
    
    declare function processData(data: any): { success: boolean; result?: any };
    
    declare class LegacyWidget {
        constructor(options: any);
        render(elementId: string): void;
        destroy(): void;
    }
    ----
    Sau đó, trong file \`.ts\`, bạn có thể sử dụng chúng mà không cần import (nếu chúng là global).
    
    **Khai báo Module (`declare module 'module-name' { …​ }`)**
    
    Nếu thư viện JavaScript của bạn được sử dụng như một module (ví dụ: CommonJS hoặc AMD), bạn cần khai báo module trong file `.d.ts`. \[source,typescript\] ---- // --- File: custom-module-lib.d.ts --- // Giả sử thư viện JS có tên 'custom-module-lib' và export một hàm và một hằng số declare module 'custom-module-lib' { export function greet(name: string): string; export const MAX\_USERS: number; // Có thể có default export // export default class MyModuleDefaultClass { /\* …​ \*/ } } ---- Trong file `.ts`: \[source,typescript\] ---- // import { greet, MAX\_USERS } from 'custom-module-lib'; // console.log(greet("Developer")); // console.log(MAX\_USERS); ---- Bạn có thể đặt file `.d.ts` này ở bất kỳ đâu trong dự án, TypeScript sẽ tìm thấy nó (thường là trong thư mục `src` hoặc một thư mục `types` riêng).
    
    **Shorthand ambient module declarations (Khai báo module rút gọn)**
    
    Nếu bạn chỉ muốn thông báo rằng một module tồn tại nhưng không muốn cung cấp chi tiết kiểu (để TypeScript coi nó là `any`), bạn có thể dùng: \[source,typescript\] ---- // declare module 'untyped-module'; // Tất cả import từ đây sẽ là any ---- Điều này hữu ích khi bạn muốn nhanh chóng bỏ qua lỗi import mà chưa có thời gian viết file `.d.ts` đầy đủ (nhưng nên tránh lạm dụng).
    
3.  **Tạo `.d.ts` file từ file `.ts` (Declaration Generation):**
    
    Khi bạn viết một thư viện bằng TypeScript và muốn xuất bản nó, bạn nên cung cấp cả file JavaScript đã biên dịch và file declaration (`.d.ts`) để người dùng thư viện của bạn (dù họ dùng TypeScript hay JavaScript với editor hỗ trợ) có thể tận dụng được thông tin kiểu.
    
    TypeScript có thể tự động tạo ra các file `.d.ts` từ các file `.ts` nguồn của bạn. **Bật tùy chọn `declaration` trong `tsconfig.json`**:: \[source,json\] ---- { "compilerOptions": { "target": "es5", "module": "commonjs", "declaration": true, // Bật tạo file .d.ts "outDir": "./dist", // Thư mục output cho .js và .d.ts // "declarationDir": "./types", // (Tùy chọn) Thư mục riêng cho file .d.ts // …​ } } ---- Khi bạn chạy `tsc`, bên cạnh các file `.js`, các file `.d.ts` tương ứng cũng sẽ được tạo ra trong `outDir` (hoặc `declarationDir` nếu được chỉ định).
    
        // --- File: src/math-lib.ts ---
        export function sum(a: number, b: number): number {
            return a + b;
        }
        export const VERSION = "1.0.0";
    
    Sau khi biên dịch, bạn sẽ có: \* `dist/math-lib.js` \* `dist/math-lib.d.ts` (Nội dung sẽ tương tự như: `export declare function sum(a: number, b: number): number; export declare const VERSION = "1.0.0";`)
    

**Code ví dụ chính (Tổng hợp và mở rộng)**

**1\. Sử dụng thư viện có `@types` (ví dụ: `date-fns`)** \[source,bash\] ---- # npm install date-fns # npm install --save-dev @types/date-fns ---- \[source,typescript\] ---- // --- File: dateExample.ts --- import { format, addDays } from 'date-fns'; // import viLocale from 'date-fns/locale/vi'; // Để format tiếng Việt

const today = new Date();
const threeDaysLater = addDays(today, 3);

// console.log("Hôm nay:", format(today, "PPP", { locale: viLocale }));
// console.log("3 ngày sau:", format(threeDaysLater, "dd/MM/yyyy HH:mm"));
console.log("Hôm nay (mặc định):", format(today, "PPP"));
console.log("3 ngày sau (mặc định):", format(threeDaysLater, "dd/MM/yyyy HH:mm"));
----

**2\. Viết file `.d.ts` cho một module JavaScript đơn giản** Giả sử có file `string-utils.js`: \[source,javascript\] ---- // --- File: string-utils.js (ví dụ: trong thư mục 'legacy-lib') --- // function reverseString(str) { // return str.split('').reverse().join(''); // } // const GREETING\_PREFIX = "Hello, "; // module.exports = { reverseString, GREETING\_PREFIX }; ---- Tạo file `string-utils.d.ts` (ví dụ: trong `src/types/string-utils.d.ts`): \[source,typescript\] ---- // --- File: src/types/string-utils.d.ts --- declare module 'legacy-lib/string-utils' { // Tên module phải khớp với cách bạn import export function reverseString(str: string): string; export const GREETING\_PREFIX: string; } ---- Trong `tsconfig.json`, bạn có thể cần cấu hình `paths` và `baseUrl` để TypeScript tìm thấy module này nếu nó không nằm trong `node_modules`. Hoặc đơn giản là đặt tên module trong `declare module` sao cho khớp với đường dẫn tương đối khi import. \[source,typescript\] ---- // --- File: appUsingLegacy.ts --- // Giả sử string-utils.js nằm ở ../legacy-lib/string-utils.js // import { reverseString, GREETING\_PREFIX } from '../legacy-lib/string-utils';

// // TypeScript sẽ sử dụng string-utils.d.ts để kiểm tra kiểu
// const original = "TypeScript";
// const reversed = reverseString(original);
// console.log(\`${GREETING\_PREFIX}${reversed}\`); // "Hello, tpircSepyT"
----
Lưu ý: Việc import module JavaScript local như trên cần cấu hình module resolution và có thể cần bundler để hoạt động đúng trong trình duyệt.

**3\. Tích hợp file JavaScript với `allowJs` và JSDoc** `tsconfig.json`: \[source,json\] ---- // { // "compilerOptions": { // "allowJs": true, // "checkJs": true, // Bật kiểm tra kiểu cho file JS // "outDir": "./dist", // "module": "commonjs", // // …​ // } // } ---- File `src/js-calculator.js`: \[source,javascript\] ---- // /\*\* // \* @param {number} x // \* @param {number} y // \* @returns {number} // \*/ // function multiply(x, y) { // return x \* y; // } // module.exports = { multiply }; ---- File `src/ts-consumer.ts`: \[source,typescript\] ---- // import { multiply } from './js-calculator'; // TypeScript sẽ đọc JSDoc

// const product = multiply(5, 7); // TypeScript hiểu kiểu là number
// console.log("Product from JS:", product);

// const errorProduct = multiply(5, "7"); // TypeScript sẽ báo lỗi nếu checkJs hoạt động đúng
----

**Danh sách bài tập**

1.  **Trắc nghiệm: File `.d.ts` dùng để làm gì?**
    

**Tiêu đề**

Mục đích của Declaration Files.

**Mô tả**

Chọn đáp án đúng nhất mô tả công dụng của file `.d.ts`.

**Câu hỏi**

Trong TypeScript, file có phần mở rộng `.d.ts` (Declaration File) chủ yếu được sử dụng để làm gì?

*   A. Chứa code JavaScript đã được biên dịch từ TypeScript.
    
*   B. Cung cấp thông tin kiểu (type definitions) cho code JavaScript hiện có, giúp TypeScript hiểu và làm việc với code đó.
    
*   C. Cấu hình các tùy chọn của trình biên dịch TypeScript cho một dự án.
    
*   D. Chứa các unit test cho code TypeScript.
    

**Đáp án**

B

1.  **Code: Viết file `.d.ts` cho hàm JavaScript đơn giản.**
    
    **Tiêu đề**
    
    Thực hành viết Declaration File.
    
    **Mô tả**
    
    Giả sử bạn có một file JavaScript `legacy-math.js` chứa hàm sau:
    
        // --- File: legacy-math.js ---
        // function calculateArea(shape, dimensions) {
        //   if (shape === "circle" && typeof dimensions === 'number') {
        //     return Math.PI * dimensions * dimensions;
        //   }
        //   if (shape === "rectangle" && typeof dimensions === 'object' && dimensions.width && dimensions.height) {
        //     return dimensions.width * dimensions.height;
        //   }
        //   return -1; // Error or unknown shape
        // }
        // module.exports = { calculateArea };
    
    Viết một file `legacy-math.d.ts` để cung cấp kiểu cho hàm `calculateArea`. Hàm này có thể nhận: **`shape: "circle"`, `dimensions: number` (bán kính)** `shape: "rectangle"`, `dimensions: { width: number, height: number }` Hàm trả về `number`.
    
    **Giải pháp mẫu (`legacy-math.d.ts`)**
    
        // --- File: src/types/legacy-math.d.ts ---
        declare module 'legacy-math' { // Giả sử module tên là 'legacy-math'
            // Sử dụng function overloads để mô tả các cách gọi khác nhau
            export function calculateArea(shape: "circle", radius: number): number;
            export function calculateArea(shape: "rectangle", dimensions: { width: number; height: number }): number;
            // Có thể thêm một overload chung hơn nếu cần, hoặc để TypeScript suy luận từ các overloads trên
            // export function calculateArea(shape: string, dimensions: any): number;
        }
    
2.  **Code: Tìm và cài đặt declaration file cho thư viện `axios`.**
    
    **Tiêu đề**
    
    Sử dụng DefinitelyTyped.
    
    **Mô tả**
    
    *   1\. Cài đặt thư viện `axios` (nếu chưa có): `npm install axios`.
        
    *   2\. Tìm và cài đặt file declaration tương ứng cho `axios` từ `@types`.
        
    *   3\. Viết một đoạn code TypeScript ngắn sử dụng `axios.get()` để gọi một API công khai (ví dụ: `[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)`) và log kết quả `data` ra console. Đảm bảo TypeScript không báo lỗi về kiểu của `axios`.
        
    
    **Giải pháp mẫu**
    
    Lệnh cài đặt:
    
        npm install axios
        npm install --save-dev @types/axios
    
    Code TypeScript:
    
        // --- File: apiCaller.ts ---
        import axios, { AxiosResponse } from 'axios';
        
        interface Todo {
            userId: number;
            id: number;
            title: string;
            completed: boolean;
        }
        
        async function fetchTodo(): Promise<void> {
            try {
                // TypeScript biết kiểu của response nhờ @types/axios
                const response: AxiosResponse<Todo> = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
                const todoData: Todo = response.data;
        
                console.log("Todo Fetched:");
                console.log(`ID: ${todoData.id}`);
                console.log(`Title: ${todoData.title}`);
                console.log(`Completed: ${todoData.completed}`);
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error:", error.message);
                    if (error.response) {
                        console.error("Status:", error.response.status);
                        console.error("Data:", error.response.data);
                    }
                } else {
                    console.error("An unexpected error occurred:", error);
                }
            }
        }
        
        fetchTodo();
    
3.  **Code: Tạo `.d.ts` từ file `.ts`.**
    
    **Tiêu đề**
    
    Thực hành Declaration Generation.
    
    **Mô tả**
    
    *   1\. Tạo một file TypeScript đơn giản, ví dụ `src/geometry.ts`, chứa một interface `ShapeInfo` và một hàm `getShapeDetails(info: ShapeInfo): string`.
        
    
        // --- File: src/geometry.ts ---
        // export interface ShapeInfo {
        //     name: string;
        //     sides: number;
        //     area?: number;
        // }
        //
        // export function getShapeDetails(info: ShapeInfo): string {
        //     let details = `Shape: ${info.name}, Sides: ${info.sides}`;
        //     if (info.area) {
        //         details += `, Area: ${info.area}`;
        //     }
        //     return details;
        // }
    
    *   2\. Cấu hình `tsconfig.json` để bật `declaration: true` và chỉ định `outDir`.
        
    *   3\. Chạy `tsc` và kiểm tra nội dung của file `.d.ts` được tạo ra trong `outDir`.
        
        **Giải pháp mẫu (`tsconfig.json`)**
        
    
    // {
    //   "compilerOptions": {
    //     "target": "es2016",
    //     "module": "commonjs",
    //     "declaration": true,
    //     "outDir": "./dist",
    //     "rootDir": "./src",
    //     "strict": true
    //   },
    //   "include": \["src"\]
    // }
    
    Nội dung `dist/geometry.d.ts` (mong đợi):
    
        // export interface ShapeInfo {
        //     name: string;
        //     sides: number;
        //     area?: number;
        // }
        // export declare function getShapeDetails(info: ShapeInfo): string;
    
4.  **Thảo luận: Khi nào nên tự viết file `.d.ts` và khi nào nên dựa vào `@types`?**
    
    **Tiêu đề**
    
    Chiến lược sử dụng Declaration Files.
    
    **Mô tả**
    
    Thảo luận về các tình huống nên ưu tiên tìm kiếm package `@types` từ DefinitelyTyped và các trường hợp bạn có thể cần hoặc muốn tự viết file declaration (`.d.ts`) cho riêng mình. **Gợi ý**:
    
    *   `@types`: Thư viện phổ biến, cộng đồng lớn, được kiểm thử, tiết kiệm thời gian.
        
    *   Tự viết: Thư viện nội bộ, thư viện JS nhỏ/ít phổ biến, muốn kiểm soát hoàn toàn định nghĩa kiểu, đóng góp cho DefinitelyTyped.