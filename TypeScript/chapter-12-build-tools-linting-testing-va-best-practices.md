#### Chapter 12: Build Tools, Linting, Testing và Best Practices

**Mô tả tổng quát Chapter học**

Chapter học cuối cùng này sẽ tổng kết các kiến thức đã học và tập trung vào các công cụ, quy trình giúp hoàn thiện một dự án TypeScript chuyên nghiệp. Chúng ta sẽ tìm hiểu về các công cụ xây dựng (build tools) nâng cao, cách thiết lập linting và formatting để đảm bảo chất lượng code đồng nhất, các phương pháp testing cơ bản cho code TypeScript, và cuối cùng là điểm qua các best practices quan trọng khi làm việc với TypeScript.

**Tiêu đề Chapter học**

Hoàn Thiện Dự Án: Build Tools, Linting, Testing và Best Practices.

**Tóm tắt lý thuyết chính**

1.  **Build Tools (Công cụ xây dựng):**
    

Ngoài việc sử dụng `tsc` trực tiếp, các dự án lớn thường cần các công cụ xây dựng mạnh mẽ hơn.

**`tsc` (TypeScript Compiler) và các tùy chọn nâng cao**

*   `--watch` (`-w`): Theo dõi thay đổi file và tự động biên dịch lại.
    
*   `--project <path>` (`-p <path>`): Chỉ định đường dẫn đến file `tsconfig.json`.
    
*   `--build` (`-b`): (Cho project references) Xây dựng một dự án và các dependency của nó.
    
*   `outFile`: (Ít dùng với module ES6/CommonJS, thường dùng với `amd` hoặc `system`) Gộp tất cả output thành một file JavaScript duy nhất.
    
*   `incremental: true`: (Trong `tsconfig.json`) Bật chế độ biên dịch tăng dần, giúp tăng tốc độ biên dịch cho các lần sau bằng cách chỉ biên dịch lại các file đã thay đổi.
    

**Sử dụng Webpack hoặc Parcel với TypeScript**

*   **Webpack**: Một module bundler mạnh mẽ và phổ biến.
    
    *   Cần loader như `ts-loader` hoặc `awesome-typescript-loader` để Webpack hiểu file `.ts`.
        
    *   `babel-loader` cũng có thể được dùng để biên dịch TypeScript (thường kết hợp với `@babel/preset-typescript`), cho phép tận dụng hệ sinh thái của Babel.
        
    *   Webpack giúp quản lý dependency, tối ưu code (minification, tree shaking), code splitting, xử lý các loại asset khác (CSS, images).
        
    
*   **Parcel**: Một module bundler không cần cấu hình (zero-configuration) hoặc ít cấu hình hơn Webpack.
    
    *   Tự động phát hiện và biên dịch TypeScript mà không cần cài đặt loader riêng.
        
    *   Dễ sử dụng cho các dự án nhỏ hoặc khi muốn bắt đầu nhanh.
        
    

**`nodemon`**: **Một công cụ giúp tự động khởi động lại ứng dụng Node.js của bạn mỗi khi phát hiện thay đổi trong file.** Rất hữu ích trong quá trình phát triển, thường được kết hợp với `tsc -w` hoặc build script của Webpack/Parcel. \[source,bash\] ---- # nodemon dist/server.js # Hoặc dùng với ts-node (chạy TS trực tiếp không cần biên dịch trước ra JS) # nodemon --exec ts-node src/server.ts ----

1.  **Linting và Formatting (Kiểm tra và Định dạng Code):**
    
    Đảm bảo code nhất quán, dễ đọc và tuân theo các quy tắc chung.
    
    **ESLint**: **Công cụ linting phổ biến nhất cho JavaScript và TypeScript.** Cần cài đặt parser và plugin cho TypeScript: **\* `@typescript-eslint/parser`: Cho phép ESLint hiểu cú pháp TypeScript.** \* `@typescript-eslint/eslint-plugin`: Cung cấp các rule linting dành riêng cho TypeScript. \*\* Cấu hình trong file `.eslintrc.js` (hoặc `.json`, `.yaml`). \[source,javascript\] ---- // --- File: .eslintrc.js (ví dụ cơ bản) --- // module.exports = { // parser: '@typescript-eslint/parser', // extends: \[ // 'eslint:recommended', // 'plugin:@typescript-eslint/recommended', // Rule khuyến nghị cho TS // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // Rule cần thông tin kiểu // 'prettier', // Tắt các rule xung đột với Prettier // \], // parserOptions: { // ecmaVersion: 2020, // sourceType: 'module', // project: './tsconfig.json', // Cần cho các rule yêu cầu thông tin kiểu // }, // rules: { // // Tùy chỉnh rule ở đây // // Ví dụ: "@typescript-eslint/no-explicit-any": "warn", // }, // ignorePatterns: \["dist/", "node\_modules/"\], // }; ----
    
    **Prettier**: **Công cụ tự động định dạng code (code formatter).** Giúp code có style nhất quán mà không cần tranh cãi về định dạng. **Tích hợp tốt với ESLint (dùng `eslint-config-prettier` để tắt các rule ESLint xung đột với Prettier, và `eslint-plugin-prettier` để chạy Prettier như một rule ESLint).** Cấu hình trong file `.prettierrc.js` (hoặc `.json`, `.yaml`).
    
    **Tích hợp vào Editor (VS Code)**
    
    *   Cài đặt extension ESLint và Prettier cho VS Code.
        
    *   Cấu hình VS Code để tự động format code khi lưu file (Format On Save).
        
    
2.  **Testing (Kiểm thử):**
    
    Viết test là một phần quan trọng để đảm bảo chất lượng và độ ổn định của code.
    
    **Unit Testing với Jest hoặc Mocha + Chai**
    
    *   **Jest**: Một testing framework phổ biến, "all-in-one", dễ cài đặt và sử dụng, đặc biệt mạnh cho React.
        
        *   Cần `ts-jest` để Jest có thể xử lý file TypeScript.
            
        
    *   **Mocha**: Một testing framework linh hoạt, thường được kết hợp với thư viện assertion như **Chai**.
        
        *   Cần `ts-node` để chạy test TypeScript với Mocha.
            
        
    
    **Cấu hình Jest/Mocha để làm việc với TypeScript**
    
    *   `jest.config.js` (cho Jest): \[source,javascript\] ---- // --- File: jest.config.js --- // module.exports = { // preset: 'ts-jest', // Sử dụng preset ts-jest // testEnvironment: 'node', // Môi trường test (node hoặc jsdom cho frontend) // roots: \['<rootDir>/src'\], // Thư mục chứa code và test // testMatch: \[ // Pattern để tìm file test // '**/_tests_/**/\*.(ts|tsx|js)', // '\*\*/?(\*.)(spec|test).(ts|tsx|js)' // \], // transform: { // '^.\\\\.(ts|tsx)$': \['ts-jest', { // Cấu hình ts-jest nếu cần // // tsconfig: 'tsconfig.test.json' // Sử dụng tsconfig riêng cho test nếu có // }\] // }, // // moduleNameMapper: { // Dùng để mock các module không phải JS // // "\\\\.(css|less|scss)$": "identity-obj-proxy" // // }, // // setupFilesAfterEnv: \['<rootDir>/src/setupTests.ts'\], // File chạy sau khi môi trường test được thiết lập // }; ----
        
    *   Cấu hình Mocha thường nằm trong `package.json` hoặc file `mocha.opts`.
        
    
    **Viết test case cơ bản cho hàm, class**
    
    \[source,typescript\] ---- // --- File: src/utils/math.ts --- // export function add(a: number, b: number): number { // return a + b; // }
    
    // --- File: src/utils/\_\_tests\_\_/math.test.ts (hoặc math.spec.ts) ---
    // import { add } from '../math';
    
    // describe('Math utility functions', () => {
    //     describe('add function', () => {
    //         it('should return the sum of two positive numbers', () => {
    //             expect(add(2, 3)).toBe(5);
    //         });
    
    //         it('should return the sum of a positive and a negative number', () => {
    //             expect(add(5, -2)).toBe(3);
    //         });
    
    //         it('should return zero when adding zero', () => {
    //             expect(add(7, 0)).toBe(7);
    //         });
    //     });
    // });
    ----
    
3.  **TypeScript Best Practices (Các thực hành tốt nhất):**
    
    *   **Bật `strict` mode**: Trong `tsconfig.json`, đặt `strict: true`. Điều này bật một loạt các cờ kiểm tra kiểu nghiêm ngặt (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, etc.), giúp phát hiện lỗi tốt hơn.
        
    *   **Ưu tiên `unknown` hơn `any`**: Khi bạn không biết kiểu của một giá trị, hãy dùng `unknown` thay vì `any` để buộc phải kiểm tra kiểu trước khi sử dụng, tăng tính an toàn.
        
    *   **Sử dụng kiểu tường minh cho API contracts**: Khi định nghĩa kiểu cho dữ liệu từ API hoặc ranh giới của module, hãy khai báo kiểu tường minh (ví dụ: dùng interface) thay vì để TypeScript suy luận.
        
    *   **Tận dụng Utility Types**: Sử dụng các utility type như `Partial`, `Readonly`, `Pick`, `Omit` để tạo các kiểu phức tạp một cách ngắn gọn và an toàn.
        
    *   **Viết code dễ đọc, dễ bảo trì**: Đặt tên biến, hàm, class rõ ràng. Chia nhỏ code thành các module, hàm có mục đích cụ thể.
        
    *   **Sử dụng `readonly` khi có thể**: Đánh dấu các thuộc tính không nên thay đổi sau khi khởi tạo là `readonly` để tăng tính bất biến và giảm lỗi.
        
    *   **Tránh lạm dụng type assertions (`as Type` hoặc `<Type>value`)**: Ép kiểu làm tắt đi sự kiểm tra của TypeScript. Chỉ sử dụng khi bạn chắc chắn về kiểu hơn trình biên dịch. Nếu phải dùng nhiều, có thể đó là dấu hiệu của việc định nghĩa kiểu chưa tốt.
        
    *   **Sử dụng `ESLint` và `Prettier`**: Để đảm bảo code nhất quán và tuân thủ các quy tắc.
        
    *   **Viết Unit Tests**: Để đảm bảo code hoạt động đúng và dễ dàng refactor.
        
    *   **Luôn cập nhật TypeScript và `@types` packages**: Để tận dụng các tính năng mới và bản vá lỗi.
        
    
4.  **Ôn tập kiến thức và Q&A.**
    
    Đây là thời điểm để học viên đặt câu hỏi về bất kỳ chủ đề nào trong khóa học, chia sẻ kinh nghiệm hoặc thảo luận về các tình huống thực tế khi áp dụng TypeScript.
    

**Code ví dụ chính (Tổng hợp)**

**Ví dụ `jest.config.js` (đã có ở trên)**

**Ví dụ file test đơn giản (đã có ở trên)**

**Ví dụ `.eslintrc.js` cơ bản (đã có ở trên)**

**Ví dụ script trong `package.json`**:

    // {
    //   "scripts": {
    //     "build": "tsc",
    //     "build:watch": "tsc -w",
    //     "start": "node dist/server.js", // Giả sử có server.js
    //     "dev": "nodemon --exec ts-node src/server.ts", // Chạy TS trực tiếp với nodemon
    //     "lint": "eslint . --ext .ts,.tsx",
    //     "lint:fix": "eslint . --ext .ts,.tsx --fix",
    //     "format": "prettier --write \"src/**/*.ts\"",
    //     "test": "jest",
    //     "test:watch": "jest --watch"
    //   }
    // }

**Danh sách bài tập**

1.  **Trắc nghiệm: Công cụ nào thường được sử dụng để phân tích tĩnh code TypeScript và tìm lỗi tiềm ẩn hoặc vấn đề về style?**
    

**Tiêu đề**

Hiểu về Linting.

**Mô tả**

Chọn công cụ phù hợp cho việc phân tích tĩnh code.

**Câu hỏi**

Công cụ nào sau đây thường được sử dụng để phân tích tĩnh code TypeScript, giúp tìm ra các lỗi tiềm ẩn, các đoạn code không tuân theo quy tắc (code smells), và các vấn đề về style?

*   A. Jest
    
*   B. Webpack
    
*   C. ESLint
    
*   D. Node.js
    

**Đáp án**

C

1.  **Thực hành: Cài đặt ESLint và Prettier.**
    
    **Tiêu đề**
    
    Thiết lập môi trường Linting và Formatting.
    
    **Mô tả**
    
    Cho một dự án TypeScript nhỏ (có thể tạo mới hoặc dùng dự án đã có):
    
    *   1\. Cài đặt ESLint, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`.
        
    *   2\. Cài đặt Prettier, `eslint-config-prettier`, `eslint-plugin-prettier`.
        
    *   3\. Tạo file cấu hình `.eslintrc.js` và `.prettierrc.js` cơ bản.
        
    *   4\. (Tùy chọn) Cấu hình VS Code (hoặc editor bạn dùng) để tự động format code khi lưu file và hiển thị cảnh báo ESLint.
        
    *   5\. Viết một vài đoạn code TypeScript có lỗi style hoặc lỗi linting tiềm ẩn và xem ESLint/Prettier hoạt động.
        
    
    **Gợi ý các bước cài đặt**:
    
        # npm init -y (nếu là dự án mới)
        # npm install typescript --save-dev
        # npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev
        # npm install prettier eslint-config-prettier eslint-plugin-prettier --save-dev
        # npx eslint --init (để tạo file cấu hình ESLint, chọn TypeScript, etc.)
    
2.  **Thực hành: Cài đặt Jest và viết Unit Test.**
    
    **Tiêu đề**
    
    Viết Unit Test cơ bản.
    
    **Mô tả**
    
    *   1\. Cài đặt Jest và `ts-jest`, `@types/jest`.
        
    *   2\. Tạo file `jest.config.js`.
        
    *   3\. Viết một hàm TypeScript đơn giản, ví dụ `capitalize(str: string): string` (viết hoa chữ cái đầu của chuỗi).
        
    *   4\. Viết một file test (ví dụ: `capitalize.test.ts`) cho hàm `capitalize` với ít nhất 2-3 test case (chuỗi rỗng, chuỗi thường, chuỗi đã viết hoa).
        
    *   5\. Chạy test bằng lệnh `npm test` (sau khi thêm script vào `package.json`).
        
    
    **Gợi ý hàm `capitalize`**:
    
        // export function capitalize(str: string): string {
        //     if (!str) return "";
        //     return str.charAt(0).toUpperCase() + str.slice(1);
        // }
    
3.  **Thảo luận: Tại sao nên bật cờ `strictNullChecks` trong `tsconfig.json`?**
    
    **Tiêu đề**
    
    Thảo luận về `strictNullChecks`.
    
    **Mô tả**
    
    Thảo luận về lợi ích và những thách thức (nếu có) khi bật tùy chọn `strictNullChecks: true` trong `tsconfig.json`. **Gợi ý**:
    
    *   Lợi ích: Giảm lỗi `Cannot read property '…​' of null/undefined`, code an toàn hơn, buộc phải xử lý các trường hợp `null`/`undefined` một cách tường minh.
        
    *   Thách thức: Có thể cần nhiều code hơn để kiểm tra `null`/`undefined`, đặc biệt khi làm việc với code JavaScript cũ hoặc API trả về nhiều giá trị `null`.
        
    
4.  **Code (Review): Best Practices.**
    
    **Tiêu đề**
    
    Áp dụng Best Practices.
    
    **Mô tả**
    
    Cho một đoạn code TypeScript nhỏ (ví dụ, một class hoặc một vài hàm do bạn tự viết hoặc lấy từ các bài trước). Hãy review đoạn code đó và chỉ ra các điểm có thể cải thiện dựa trên các best practices đã học trong Chapter này và các Chapter trước (ví dụ: sử dụng `readonly` khi thích hợp, tránh `any` nếu có thể, dùng utility type, khai báo kiểu rõ ràng cho API, đặt tên, etc.). **Ví dụ đoạn code để review (học viên có thể tự chọn)**:
    
        // // Đoạn code cần review:
        // function processData(data: any, options: any) {
        //     let result;
        //     if (options.type === 'string') {
        //         result = String(data).toUpperCase();
        //     } else if (options.type === 'number') {
        //         result = Number(data) * options.factor;
        //     }
        //     // ... nhiều logic khác
        //     return result;
        // }
        //
        // class UserProfile {
        //     id;
        //     name;
        //     email;
        //     constructor(id, name, email) {
        //         this.id = id;
        //         this.name = name;
        //         this.email = email;
        //     }
        //     updateProfile(newData) { // newData là any
        //         this.name = newData.name ? newData.name : this.name;
        //         this.email = newData.email ? newData.email : this.email;
        //     }
        // }
    
    **Yêu cầu**: Đề xuất các thay đổi để cải thiện đoạn code trên.