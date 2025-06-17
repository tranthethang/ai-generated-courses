# Chapter 2: Modules, Controllers và Routing

**Tên Chapter học:** Modules, Controllers và Routing

**Mục tiêu bài học:**

* **Hiểu sâu về Modules:** Nắm vững cách sử dụng `@Module()` decorator để đóng gói và tổ chức các thành phần liên quan của ứng dụng (controllers, providers). Hiểu về `imports`, `exports`, `controllers`, `providers` trong module definition.
* **Tạo và sử dụng Controllers:** Thành thạo cách tạo controllers với `@Controller()` decorator để xử lý các incoming HTTP requests. Biết cách đặt prefix cho routes ở cấp controller.
* **Routing nâng cao:**
    * Sử dụng các HTTP method decorators: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()`, `@Options()`, `@Head()`, `@All()`.
    * Làm việc với Route Parameters (`@Param()`): Trích xuất các tham số động từ URL.
    * Làm việc với Query Parameters (`@Query()`): Trích xuất các tham số từ query string của URL.
    * Xử lý Request Body (`@Body()`): Nhận dữ liệu gửi lên từ client trong body của request (thường là JSON).
* **Đối tượng Request và Response:**
    * Hiểu cách truy cập đối tượng `Request` gốc (từ Express/Fastify) bằng `@Req()` decorator để lấy thông tin chi tiết (headers, IP address, etc.).
    * Hiểu cách truy cập đối tượng `Response` gốc bằng `@Res()` decorator để tùy chỉnh response một cách linh hoạt (cẩn trọng khi sử dụng vì nó bỏ qua các cơ chế chuẩn của NestJS như interceptors, `HttpCode` decorator).
* **DTOs (Data Transfer Objects):** Giới thiệu khái niệm DTOs như một cách để định hình cấu trúc dữ liệu cho request body và response payload, giúp code rõ ràng và dễ dàng validation sau này.

**Tóm tắt lý thuyết:**

1.  **Modules (`@Module()`):**
    * Như đã giới thiệu, modules là cách để cấu trúc ứng dụng NestJS.
    * **`imports`**: Một mảng các module khác mà module hiện tại cần sử dụng các providers đã được export từ chúng.
    * **`controllers`**: Một mảng các controller được định nghĩa trong module này. NestJS sẽ instantiate chúng.
    * **`providers`**: Một mảng các provider (services, factories, etc.) sẽ được NestJS injector instantiate và có thể được inject vào các thành phần khác trong module này (hoặc được export để sử dụng ở module khác).
    * **`exports`**: Một subset của các `providers` mà module này muốn cung cấp cho các module khác import nó.
    * **Global Modules (`@Global()`):** Các provider của một global module sẽ có sẵn ở mọi nơi mà không cần import module đó vào từng module con. Sử dụng cẩn thận để tránh làm ô nhiễm global scope.
    * **Dynamic Modules:** Cho phép tạo các module có thể tùy chỉnh (configurable) khi chúng được import. Sẽ tìm hiểu kỹ hơn ở các Chapter nâng cao.

2.  **Controllers (`@Controller()`):**
    * Controllers chịu trách nhiệm định tuyến các request đến các handler phù hợp.
    * Decorator `@Controller('prefix')` cho phép bạn nhóm các route liên quan dưới một path prefix chung. Ví dụ, `@Controller('cats')` sẽ khiến tất cả các route trong controller đó bắt đầu bằng `/cats`.
    * Mỗi method trong controller xử lý một request cụ thể được đánh dấu bằng các HTTP method decorator.

3.  **Routing và Request Handling:**
    * **HTTP Method Decorators:**
        * `@Get(path?)`: Xử lý GET request.
        * `@Post(path?)`: Xử lý POST request.
        * `@Put(path?)`: Xử lý PUT request.
        * `@Delete(path?)`: Xử lý DELETE request.
        * `@Patch(path?)`: Xử lý PATCH request.
        * `@Options(path?)`: Xử lý OPTIONS request.
        * `@Head(path?)`: Xử lý HEAD request.
        * `@All(path?)`: Xử lý tất cả các HTTP method.
        * `path` là một tham số tùy chọn, nếu bỏ qua, nó sẽ là path của controller (nếu có prefix) hoặc `/` (nếu không có prefix controller).
    * **Route Parameters (`@Param(name?, pipe?)`):**
        * Dùng để lấy các phần động của URL. Ví dụ: `/cats/:id`.
        * `@Param('id') id: string` sẽ lấy giá trị của `id`.
        * Nếu không có `name`, `@Param()` sẽ trả về một object chứa tất cả các route params.
    * **Query Parameters (`@Query(name?, pipe?)`):**
        * Dùng để lấy các tham số từ query string. Ví dụ: `/cats/search?breed=Persian&age=2`.
        * `@Query('breed') breed: string` sẽ lấy giá trị của `breed`.
        * Nếu không có `name`, `@Query()` sẽ trả về một object chứa tất cả các query params.
    * **Request Body (`@Body(property?, pipe?)`):**
        * Dùng để lấy dữ liệu được gửi trong body của request (thường là JSON cho POST, PUT, PATCH).
        * `@Body() createCatDto: CreateCatDto` sẽ lấy toàn bộ body và (nếu có pipe) chuyển đổi/validate nó thành `CreateCatDto`.
        * `@Body('name') name: string` sẽ chỉ lấy thuộc tính `name` từ body.
    * **Headers (`@Headers(name?)`):**
        * Dùng để lấy giá trị của một header cụ thể hoặc tất cả headers.
        * `@Headers('user-agent') userAgent: string`.
    * **Status Codes (`@HttpCode(statusCode)`):**
        * Mặc định, NestJS trả về status `200 OK` cho hầu hết các request thành công và `201 Created` cho POST request.
        * Decorator `@HttpCode()` cho phép bạn thay đổi status code mặc định cho một handler. Ví dụ: `@HttpCode(204)`.
    * **Redirects (`@Redirect(url, statusCode?)`):**
        * Cho phép chuyển hướng request đến một URL khác.

4.  **Request & Response Objects:**
    * **`@Req()` hoặc `@Request()`:** Cung cấp quyền truy cập vào đối tượng request gốc của framework HTTP nền tảng (Express hoặc Fastify).
        ```typescript
        import { Controller, Get, Req } from '@nestjs/common';
        import { Request } from 'express'; // Hoặc từ 'fastify'

        @Controller('cats')
        export class CatsController {
          @Get('profile')
          getProfile(@Req() req: Request) {
            console.log(req.headers);
            // ... làm gì đó với req
            return 'This action returns your profile based on request';
          }
        }
        ```
    * **`@Res()` hoặc `@Response()`:** Cung cấp quyền truy cập vào đối tượng response gốc. **LƯU Ý QUAN TRỌNG:** Khi bạn inject `@Res()` vào một method handler, bạn sẽ chịu trách nhiệm hoàn toàn cho việc quản lý response (ví dụ: gọi `res.json(...)` hoặc `res.send(...)`). NestJS sẽ không còn tự động xử lý response cho handler đó nữa. Điều này có nghĩa là các tính năng như interceptors và `@HttpCode()` sẽ không hoạt động như mong đợi. Nên sử dụng cẩn thận và chỉ khi thực sự cần thiết.
        ```typescript
        import { Controller, Get, Res } from '@nestjs/common';
        import { Response } from 'express';

        @Controller('cats')
        export class CatsController {
          @Get('custom-response')
          getCustomResponse(@Res() res: Response) {
            res.status(200).json({ message: 'This is a custom response!' });
          }
        }
        ```
    * **Thư viện cụ thể (`@Res({ passthrough: true })`):** Để vẫn sử dụng được các tính năng của NestJS (như interceptors) trong khi vẫn có thể set cookie hoặc header tùy chỉnh, bạn có thể dùng `passthrough: true`. NestJS sẽ vẫn gửi response dựa trên giá trị return của handler, nhưng bạn có thể thao tác với đối tượng `res` trước đó.

5.  **DTOs (Data Transfer Objects):**
    * DTO là một object đơn giản dùng để truyền dữ liệu giữa các lớp hoặc qua mạng.
    * Trong NestJS, DTOs thường được sử dụng để định nghĩa hình dạng (shape) của request body hoặc response payload.
    * Chúng thường là các class TypeScript với các thuộc tính.
    * Việc sử dụng DTOs giúp:
        * **Strong Typing:** Cung cấp type safety cho dữ liệu request/response.
        * **Validation:** Dễ dàng tích hợp với các thư viện validation (sẽ học ở Chapter 5) để kiểm tra tính hợp lệ của dữ liệu đầu vào.
        * **Clear Contracts:** Định nghĩa rõ ràng "hợp đồng" dữ liệu giữa client và server.
    * Ví dụ một DTO đơn giản:
        ```typescript
        // src/cats/dto/create-cat.dto.ts
        export class CreateCatDto {
          name: string;
          age: number;
          breed: string;
        }
        ```
        Sử dụng trong controller:
        ```typescript
        // src/cats/cats.controller.ts
        import { Controller, Post, Body } from '@nestjs/common';
        import { CreateCatDto } from './dto/create-cat.dto';

        @Controller('cats')
        export class CatsController {
          @Post()
          async create(@Body() createCatDto: CreateCatDto) {
            console.log(createCatDto); // createCatDto sẽ là một instance của CreateCatDto
            return 'This action adds a new cat';
          }
        }
        ```

**Code Example (Tạo `CatsModule` và `CatsController`):**

1.  **Tạo module và controller bằng Nest CLI:**
    ```bash
    nest generate module cats
    nest generate controller cats --no-spec # --no-spec để không tạo file test
    ```
    Lệnh này sẽ:
    * Tạo thư mục `src/cats`.
    * Tạo `src/cats/cats.module.ts`.
    * Tạo `src/cats/cats.controller.ts`.
    * Tự động cập nhật `src/app.module.ts` để import `CatsModule`.

2.  **`src/cats/cats.module.ts`:**
    ```typescript
    import { Module } from '@nestjs/common';
    import { CatsController } from './cats.controller';
    // import { CatsService } from './cats.service'; // Sẽ thêm ở Chapter sau

    @Module({
      controllers: [CatsController],
      // providers: [CatsService] // Sẽ thêm ở Chapter sau
    })
    export class CatsModule {}
    ```

3.  **`src/cats/dto/create-cat.dto.ts` (Tạo file này thủ công):**
    ```typescript
    export class CreateCatDto {
      readonly name: string; // readonly khuyến khích tính bất biến
      readonly age: number;
      readonly breed: string;
    }
    ```

4.  **`src/cats/cats.controller.ts`:**
    ```typescript
    import { Controller, Get, Post, Body, Param, Query, Put, Delete, HttpCode } from '@nestjs/common';
    import { CreateCatDto } from './dto/create-cat.dto'; // Import DTO

    interface Cat {
      id: number;
      name: string;
      age: number;
      breed: string;
    }

    // Dữ liệu giả lập tạm thời
    let cats: Cat[] = [
      { id: 1, name: 'Miu', age: 2, breed: 'Persian' },
      { id: 2, name: 'Tom', age: 3, breed: 'Siamese' },
    ];
    let nextId = 3;

    @Controller('cats') // Prefix cho tất cả các route trong controller này là /cats
    export class CatsController {
      // GET /cats
      @Get()
      findAll(@Query('breed') breed?: string): Cat[] {
        if (breed) {
          return cats.filter(cat => cat.breed.toLowerCase() === breed.toLowerCase());
        }
        return cats;
      }

      // GET /cats/search?limit=10&offset=0
      @Get('search')
      searchCats(@Query('limit') limit: string, @Query('offset') offset: string) {
        return `Searching cats with limit: ${limit}, offset: ${offset}`;
      }

      // GET /cats/:id
      // Ví dụ: /cats/1
      @Get(':id')
      findOne(@Param('id') id: string): Cat | { message: string } {
        const catId = parseInt(id, 10);
        const cat = cats.find(c => c.id === catId);
        if (!cat) {
          return { message: `Cat with ID ${id} not found` };
        }
        return cat;
      }

      // POST /cats
      @Post()
      @HttpCode(201) // Set default status code to 201 Created
      create(@Body() createCatDto: CreateCatDto): Cat {
        const newCat: Cat = {
          id: nextId++,
          ...createCatDto,
        };
        cats.push(newCat);
        return newCat;
      }

      // PUT /cats/:id
      @Put(':id')
      update(@Param('id') id: string, @Body() updateCatDto: Partial<CreateCatDto>): Cat | { message: string } {
        const catId = parseInt(id, 10);
        const catIndex = cats.findIndex(c => c.id === catId);
        if (catIndex === -1) {
          return { message: `Cat with ID ${id} not found for update` };
        }
        cats[catIndex] = { ...cats[catIndex], ...updateCatDto };
        return cats[catIndex];
      }

      // DELETE /cats/:id
      @Delete(':id')
      @HttpCode(204) // No Content
      remove(@Param('id') id: string): void | { message: string } {
        const catId = parseInt(id, 10);
        const catIndex = cats.findIndex(c => c.id === catId);
        if (catIndex === -1) {
          // Thực tế nên throw NotFoundException, sẽ học sau
          console.log(`Cat with ID ${id} not found for deletion`);
          return { message: `Cat with ID ${id} not found for deletion` };
        }
        cats.splice(catIndex, 1);
        // Không trả về gì cho 204
      }
    }
    ```

**Bài tập thực hành:**

1.  **Tạo `ProductsModule` và `ProductsController`:**
    * **Yêu cầu:** Sử dụng Nest CLI để tạo một module mới tên là `ProductsModule` và `ProductsController` bên trong module đó.
    * **Lệnh:** `nest g module products`, `nest g controller products --no-spec` (nhớ chọn products module khi CLI hỏi).
    * **Kiểm tra:** Đảm bảo `ProductsModule` được tự động import vào `AppModule`.
2.  **Triển khai các endpoints CRUD cơ bản cho Products:**
    * **Yêu cầu:** Trong `ProductsController`, triển khai các handler cho các route sau (sử dụng mảng dữ liệu giả lập tương tự như ví dụ `CatsController`):
        * `GET /products`: Trả về danh sách tất cả sản phẩm.
        * `GET /products/:productId`: Trả về thông tin sản phẩm theo `productId`.
        * `POST /products`: Nhận thông tin sản phẩm từ `request body` và thêm vào danh sách.
        * `PUT /products/:productId`: Cập nhật thông tin sản phẩm theo `productId`.
        * `DELETE /products/:productId`: Xóa sản phẩm theo `productId`.
    * **DTO:** Tạo `CreateProductDto.ts` và `UpdateProductDto.ts` trong thư mục `src/products/dto/` để định nghĩa cấu trúc dữ liệu cho request body. Ví dụ: `Product` có thể có `id`, `name`, `price`, `description`.
3.  **Sử dụng Query Parameters để lọc sản phẩm:**
    * **Yêu cầu:** Mở rộng endpoint `GET /products` để chấp nhận một query parameter tùy chọn, ví dụ `maxPrice`. Nếu `maxPrice` được cung cấp, chỉ trả về các sản phẩm có giá nhỏ hơn hoặc bằng `maxPrice`.
    * **Ví dụ URL:** `GET /products?maxPrice=100`.
4.  **Truy cập Request Headers:**
    * **Yêu cầu:** Trong một trong các handler của `ProductsController` (ví dụ `GET /products/:productId`), sử dụng `@Req()` decorator để lấy đối tượng request và log ra `user-agent` từ headers của request đó.
5.  **Kiểm tra bằng Postman/Insomnia:**
    * **Yêu cầu:** Sử dụng một công cụ API client như Postman hoặc Insomnia để gửi request đến tất cả các endpoint bạn vừa tạo trong `ProductsController`. Kiểm tra xem chúng có hoạt động đúng như mong đợi không (status codes, request body, response body, route params, query params).

