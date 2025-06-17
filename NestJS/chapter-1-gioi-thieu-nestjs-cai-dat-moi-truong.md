# Chapter 1: Giới thiệu NestJS & Cài đặt Môi trường

**Tên Chapter học:** Giới thiệu NestJS & Cài đặt Môi trường

**Mục tiêu bài học:**

* **Hiểu rõ NestJS là gì:** Nắm bắt được định nghĩa, triết lý thiết kế, và những ưu điểm vượt trội mà NestJS mang lại so với các framework Node.js khác (ví dụ: Express.js, Koa.js).
* **Kiến trúc cốt lõi:** Làm quen với ba thành phần chính của NestJS: Modules (Mô-đun), Controllers (Bộ điều khiển), và Providers (Nhà cung cấp). Hiểu vai trò và mối quan hệ giữa chúng.
* **Lợi ích chính:** Nhận diện được các lợi ích khi sử dụng NestJS như: cấu trúc rõ ràng, hỗ trợ TypeScript mạnh mẽ, Dependency Injection, tính module hóa cao, dễ dàng mở rộng và test.
* **Cài đặt môi trường:** Thực hiện thành công việc cài đặt Node.js, npm (hoặc yarn), và NestJS CLI (Command Line Interface) trên máy tính cá nhân.
* **Tạo dự án đầu tiên:** Sử dụng Nest CLI để khởi tạo một dự án NestJS mới, hiểu rõ cấu trúc thư mục và các tệp tin quan trọng được tạo ra.
* **Chạy ứng dụng cơ bản:** Khởi động ứng dụng NestJS và truy cập endpoint mặc định để kiểm tra.

**Tóm tắt lý thuyết:**

1.  **NestJS là gì?**
    * NestJS là một framework Node.js mã nguồn mở, được xây dựng trên nền tảng TypeScript, lấy cảm hứng từ Angular.
    * Nó cung cấp một kiến trúc ứng dụng out-of-the-box, cho phép các nhà phát triển tạo ra các ứng dụng server-side có tính tổ chức cao, dễ kiểm thử và có khả năng mở rộng tốt.
    * NestJS kết hợp các yếu tố của Lập trình hướng đối tượng (OOP), Lập trình hàm (FP), và Lập trình phản ứng hàm (FRP).
    * Nó sử dụng Express.js làm HTTP server framework mặc định, nhưng cũng có thể cấu hình để hoạt động với Fastify.

2.  **Tại sao chọn NestJS?**
    * **TypeScript:** Hỗ trợ đầy đủ TypeScript, giúp phát hiện lỗi sớm, cải thiện khả năng đọc hiểu và bảo trì code.
    * **Kiến trúc rõ ràng:** Áp dụng các design pattern như Dependency Injection, Modules, Decorators giúp code có cấu trúc mạch lạc.
    * **Module hóa:** Cho phép chia nhỏ ứng dụng thành các module độc lập, dễ quản lý và tái sử dụng.
    * **Khả năng test:** Kiến trúc của NestJS giúp việc viết unit test và E2E test trở nên dễ dàng hơn.
    * **Cộng đồng và hệ sinh thái:** Cộng đồng phát triển mạnh mẽ, cung cấp nhiều thư viện và công cụ hỗ trợ.
    * **Tích hợp:** Dễ dàng tích hợp với các công nghệ phổ biến khác như TypeORM, Mongoose, GraphQL, WebSockets, Microservices.

3.  **Các khái niệm cốt lõi:**
    * **Modules (`@Module()`):** Là các khối xây dựng cơ bản trong NestJS. Mỗi ứng dụng có ít nhất một module gốc (root module), thường là `AppModule`. Modules giúp tổ chức code thành các phần có liên quan logic với nhau. Một module có thể import các module khác, export providers, và khai báo controllers, providers của riêng nó.
        ```typescript
        // app.module.ts
        import { Module } from '@nestjs/common';
        import { AppController } from './app.controller';
        import { AppService } from './app.service';

        @Module({
          imports: [], // Các module khác được import vào đây
          controllers: [AppController], // Danh sách các controller thuộc module này
          providers: [AppService], // Danh sách các provider thuộc module này
        })
        export class AppModule {}
        ```
    * **Controllers (`@Controller()`):** Chịu trách nhiệm xử lý các HTTP request đến và trả về response cho client. Chúng được định nghĩa bằng decorator `@Controller()` và các method handler được định nghĩa bằng các decorator HTTP method như `@Get()`, `@Post()`, `@Put()`, `@Delete()`.
        ```typescript
        // app.controller.ts
        import { Controller, Get } from '@nestjs/common';
        import { AppService } from './app.service';

        @Controller() // Có thể truyền vào một path prefix, ví dụ: @Controller('cats')
        export class AppController {
          constructor(private readonly appService: AppService) {}

          @Get() // Xử lý GET request đến path của controller
          getHello(): string {
            return this.appService.getHello();
          }
        }
        ```
    * **Providers (`@Injectable()`):** Là các class có thể được inject (tiêm) vào các class khác (thường là controllers hoặc các providers khác) dưới dạng dependency. Services, repositories, factories, helpers thường là providers. Chúng được đánh dấu bằng decorator `@Injectable()`.
        ```typescript
        // app.service.ts
        import { Injectable } from '@nestjs/common';

        @Injectable()
        export class AppService {
          getHello(): string {
            return 'Hello World from NestJS!';
          }
        }
        ```

4.  **Cài đặt môi trường:**
    * **Node.js và npm/yarn:** Đảm bảo bạn đã cài đặt phiên bản Node.js LTS (Long Term Support) mới nhất. npm (Node Package Manager) đi kèm với Node.js. Yarn là một trình quản lý package thay thế.
        * Kiểm tra phiên bản: `node -v`, `npm -v` (hoặc `yarn -v`).
    * **NestJS CLI:** Công cụ dòng lệnh giúp tạo dự án, generate các thành phần (modules, controllers, services), và quản lý dự án.
        * Cài đặt global: `npm install -g @nestjs/cli` (hoặc `yarn global add @nestjs/cli`).
        * Kiểm tra cài đặt: `nest --version`.

5.  **Tạo dự án NestJS đầu tiên:**
    * Sử dụng lệnh: `nest new ten-du-an` (ví dụ: `nest new hello-nest`).
    * CLI sẽ hỏi bạn chọn trình quản lý package (npm hoặc yarn).
    * Sau khi hoàn tất, di chuyển vào thư mục dự án: `cd ten-du-an`.
    * **Cấu trúc thư mục chính:**
        * `node_modules/`: Chứa các thư viện dependencies.
        * `src/`: Chứa mã nguồn của ứng dụng.
            * `app.controller.ts`: Controller mặc định.
            * `app.controller.spec.ts`: File unit test cho controller.
            * `app.module.ts`: Module gốc của ứng dụng.
            * `app.service.ts`: Service mặc định.
            * `main.ts`: Điểm khởi đầu của ứng dụng, nơi khởi tạo Nest application instance và lắng nghe request.
        * `test/`: Chứa các file E2E test.
        * `.eslintrc.js`, `.prettierrc`, `nest-cli.json`, `package.json`, `tsconfig.build.json`, `tsconfig.json`: Các file cấu hình.

6.  **Chạy ứng dụng:**
    * Lệnh chạy ở chế độ development (có hot-reloading): `npm run start:dev` (hoặc `yarn start:dev`).
    * Ứng dụng mặc định sẽ chạy ở port `3000`. Mở trình duyệt và truy cập `http://localhost:3000`. Bạn sẽ thấy message "Hello World!".

**Code Example (Minh họa các file chính):**

* **`src/main.ts` (Điểm khởi đầu):**
    ```typescript
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule); // Tạo instance của Nest application
      await app.listen(3000); // Lắng nghe trên port 3000
      console.log(`Application is running on: ${await app.getUrl()}`);
    }
    bootstrap();
    ```

* **`src/app.module.ts` (Module gốc):**
    ```typescript
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';

    @Module({
      imports: [], // Nơi import các module khác
      controllers: [AppController], // Khai báo controller cho module này
      providers: [AppService], // Khai báo provider cho module này
    })
    export class AppModule {}
    ```

* **`src/app.controller.ts` (Controller xử lý request):**
    ```typescript
    import { Controller, Get } from '@nestjs/common';
    import { AppService } from './app.service';

    @Controller() // Đường dẫn gốc cho controller này
    export class AppController {
      constructor(private readonly appService: AppService) {} // Dependency Injection AppService

      @Get() // Xử lý HTTP GET request đến đường dẫn gốc
      getHello(): string {
        return this.appService.getHello(); // Gọi method từ service
      }
    }
    ```

* **`src/app.service.ts` (Provider chứa logic nghiệp vụ):**
    ```typescript
    import { Injectable } from '@nestjs/common';

    @Injectable() // Đánh dấu class này là một provider có thể được inject
    export class AppService {
      getHello(): string {
        return 'Hello World from NestJS Service!'; // Logic nghiệp vụ đơn giản
      }
    }
    ```

**Bài tập thực hành:**

1.  **Cài đặt môi trường:**
    * **Yêu cầu:** Cài đặt Node.js (phiên bản LTS mới nhất) và npm (hoặc yarn) trên máy tính của bạn.
    * **Kiểm tra:** Mở terminal/command prompt, chạy lệnh `node -v` và `npm -v` (hoặc `yarn -v`) để xác nhận cài đặt thành công.
2.  **Cài đặt NestJS CLI:**
    * **Yêu cầu:** Sử dụng npm (hoặc yarn) để cài đặt NestJS CLI toàn cục.
    * **Lệnh:** `npm install -g @nestjs/cli`
    * **Kiểm tra:** Chạy lệnh `nest --version` để xem phiên bản CLI.
3.  **Tạo dự án NestJS đầu tiên:**
    * **Yêu cầu:** Sử dụng Nest CLI để tạo một dự án mới tên là `my-nest-journey`.
    * **Lệnh:** `nest new my-nest-journey` (chọn npm hoặc yarn khi được hỏi).
    * **Kết quả:** Một thư mục `my-nest-journey` được tạo với cấu trúc dự án NestJS.
4.  **Khám phá cấu trúc dự án:**
    * **Yêu cầu:** Mở thư mục `my-nest-journey` bằng một code editor (ví dụ: VS Code). Dành thời gian xem qua các file và thư mục chính trong `src/` (đặc biệt là `main.ts`, `app.module.ts`, `app.controller.ts`, `app.service.ts`).
    * **Mục tiêu:** Hiểu sơ bộ vai trò của từng file.
5.  **Chạy ứng dụng và tùy chỉnh message:**
    * **Yêu cầu:** Di chuyển vào thư mục dự án (`cd my-nest-journey`). Chạy ứng dụng ở chế độ development.
    * **Lệnh:** `npm run start:dev`
    * **Kiểm tra:** Mở trình duyệt, truy cập `http://localhost:3000`. Bạn sẽ thấy "Hello World!".
    * **Tùy chỉnh:** Mở file `src/app.service.ts`, thay đổi chuỗi trả về của method `getHello()` thành "Xin chào thế giới cùng NestJS!". Lưu file và xem trình duyệt tự động cập nhật (do hot-reloading).
