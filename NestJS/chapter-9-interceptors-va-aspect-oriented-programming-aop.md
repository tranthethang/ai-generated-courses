## Chapter 9: Interceptors và Aspect-Oriented Programming (AOP)

**Tên Chapter học:** Interceptors và Aspect-Oriented Programming (AOP)

**Mục tiêu bài học:**

* **Hiểu rõ Interceptors:** Nắm vững vai trò và cách hoạt động của Interceptors trong NestJS. Biết chúng được thực thi ở đâu trong request lifecycle.
* **Các khả năng của Interceptors:**
    * Bind extra logic trước và sau khi route handler thực thi.
    * Transform kết quả trả về từ route handler.
    * Transform exception được ném từ route handler.
    * Override hoàn toàn việc thực thi của route handler (ít phổ biến hơn).
* **Sử dụng Interceptors cho các tác vụ phổ biến:**
    * **Logging:** Ghi log chi tiết về request và response (ví dụ: thời gian xử lý, method, URL, status code).
    * **Response Mapping/Transformation:** Chuẩn hóa cấu trúc response JSON trả về cho client (ví dụ: luôn wrap data trong một object `{ "data": ..., "statusCode": ... }`).
    * **Caching:** Triển khai cơ chế caching đơn giản cho các response của API.
    * **Timeout:** Xử lý timeout cho các request kéo dài.
* **Aspect-Oriented Programming (AOP):** Hiểu khái niệm AOP và cách Interceptors là một công cụ để áp dụng AOP trong NestJS để xử lý các "cross-cutting concerns".
* **Tạo Custom Interceptors:** Học cách tạo interceptor tùy chỉnh bằng cách implement interface `NestInterceptor`.
* **Binding Interceptors:** Áp dụng interceptors ở các cấp độ khác nhau (global, controller, method).

**Tóm tắt lý thuyết:**

1.  **Interceptors là gì?**
    * Interceptors là các class được đánh dấu bằng `@Injectable()` decorator và phải implement interface `NestInterceptor`.
    * Chúng có một method duy nhất là `intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>>`.
    * **`ExecutionContext`**: Tương tự như trong Guards và Filters, cung cấp thông tin về request.
    * **`CallHandler`**:
        * Interface có một method `handle(): Observable<any>`.
        * Gọi `next.handle()` sẽ thực thi route handler tương ứng.
        * Giá trị trả về từ `next.handle()` là một `Observable` chứa response từ route handler.
    * **Request Lifecycle với Interceptor:**
        `Client Request` -> `Middleware` -> `Guards` -> **`Interceptor (pre-controller)`** -> `Pipes` -> `Controller Handler` -> **`Interceptor (post-controller)`** -> `Exception Filters (if error)` -> `Server Response`
    * Interceptors có thể chạy code **trước khi** `next.handle()` được gọi và **sau khi** `Observable` từ `next.handle()` trả về kết quả (sử dụng các RxJS operators như `tap`, `map`).

2.  **Khả năng của Interceptors:**
    * **Bind extra logic:** Thực hiện các tác vụ phụ trợ.
    * **Transform result (`map` operator):** Thay đổi dữ liệu trả về từ handler.
        ```typescript
        import { map } from 'rxjs/operators';
        // ...
        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
          return next
            .handle()
            .pipe(map(data => ({ data }))); // Wrap data trong { data: ... }
        }
        ```
    * **Transform exception (`catchError` operator):** Thay đổi hoặc xử lý lỗi được ném từ handler.
        ```typescript
        import { catchError } from 'rxjs/operators';
        import { throwError } from 'rxjs';
        // ...
        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
          return next
            .handle()
            .pipe(catchError(err => throwError(() => new MyCustomException(err))));
        }
        ```
    * **Handle timeout (`timeout` operator):**
    * **Caching (`tap` và logic cache):**
    * **Logging (`tap` operator):**
        ```typescript
        import { tap } from 'rxjs/operators';
        // ...
        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
          console.log('Before handler...');
          const now = Date.now();
          return next
            .handle()
            .pipe(tap(() => console.log(`After handler... ${Date.now() - now}ms`)));
        }
        ```

3.  **Aspect-Oriented Programming (AOP):**
    * AOP là một mô hình lập trình nhằm tăng tính module hóa bằng cách cho phép tách biệt các **cross-cutting concerns**.
    * **Cross-cutting concerns** là các khía cạnh của chương trình ảnh hưởng đến nhiều phần khác nhau của hệ thống (ví dụ: logging, security, caching, transaction management, error handling).
    * Interceptors trong NestJS là một cách để implement AOP. Chúng cho phép bạn "chèn" logic (advice) vào các điểm cụ thể (join points - ở đây là trước/sau route handler) mà không cần sửa đổi trực tiếp code của handler đó.

4.  **Tạo Custom Interceptors:**
    * Implement `NestInterceptor` interface.
    * Sử dụng các RxJS operators để thao tác với stream dữ liệu (response).
    * **Ví dụ: `TransformResponseInterceptor` để chuẩn hóa response:**
        ```typescript
        // src/common/interceptors/transform-response.interceptor.ts
        import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
        import { Observable } from 'rxjs';
        import { map } from 'rxjs/operators';

        export interface StandardResponse<T> {
          statusCode: number;
          message?: string; // Tùy chọn, có thể thêm message thành công
          data: T;
        }

        @Injectable()
        export class TransformResponseInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
          intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
            const httpContext = context.switchToHttp();
            const response = httpContext.getResponse();
            const statusCode = response.statusCode || HttpStatus.OK; // Lấy status code thực tế

            return next.handle().pipe(
              map(data => ({
                statusCode: statusCode,
                // message: 'Success', // Có thể thêm message nếu muốn
                data: data,
              })),
            );
          }
        }
        ```
    * **Ví dụ: `LoggingInterceptor` đơn giản:**
        ```typescript
        // src/common/interceptors/logging.interceptor.ts
        import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
        import { Observable } from 'rxjs';
        import { tap } from 'rxjs/operators';
        import { Request } from 'express';

        @Injectable()
        export class LoggingInterceptor implements NestInterceptor {
          private readonly logger = new Logger(LoggingInterceptor.name);

          intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
            const request = context.switchToHttp().getRequest<Request>();
            const { method, url, ip } = request;
            const now = Date.now();

            this.logger.log(`Incoming Request: ${method} ${url} from IP: ${ip}`);

            return next.handle().pipe(
              tap((data) => { // data là response data
                const response = context.switchToHttp().getResponse();
                this.logger.log(
                  `Outgoing Response: ${method} ${url} Status: ${response.statusCode} - ${Date.now() - now}ms`,
                );
                // Để log data response, cẩn thận với dữ liệu lớn hoặc nhạy cảm
                // this.logger.debug('Response data:', data);
              }),
            );
          }
        }
        ```

5.  **Binding Interceptors:**
    * Tương tự như Pipes và Guards.
    * **Global-scoped:**
        ```typescript
        // src/main.ts
        app.useGlobalInterceptors(new LoggingInterceptor());
        app.useGlobalInterceptors(new TransformResponseInterceptor()); // Thứ tự quan trọng
        ```
    * **Controller-scoped:** `@UseInterceptors(LoggingInterceptor)`
    * **Method-scoped:** `@UseInterceptors(new CustomCacheInterceptor())`
    * **Thứ tự thực thi:** Interceptor được bind global chạy trước, sau đó đến controller-scoped, rồi đến method-scoped. Khi response quay trở lại, thứ tự sẽ ngược lại.

6.  **Caching với Interceptors (`@nestjs/cache-manager`):**
    * NestJS cung cấp module `@nestjs/cache-manager` để dễ dàng tích hợp caching.
    * **Cài đặt:** `npm install @nestjs/cache-manager cache-manager`
    * **Cấu hình `CacheModule`:**
        ```typescript
        // app.module.ts
        import { CacheModule, Module } from '@nestjs/common';
        // import * as redisStore from 'cache-manager-redis-store'; // Nếu dùng Redis

        @Module({
          imports: [
            CacheModule.register({
              isGlobal: true, // Làm CacheModule global
              ttl: 5, // Time to live in seconds (mặc định 5s)
              max: 100, // Max number of items in cache (mặc định 100)
              // store: redisStore, // Nếu dùng Redis
              // host: 'localhost',
              // port: 6379,
            }),
            // ...
          ],
        })
        export class AppModule {}
        ```
    * **Sử dụng `CacheInterceptor` có sẵn:**
        ```typescript
        import { Controller, Get, UseInterceptors, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/common';

        @Controller('cats')
        @UseInterceptors(CacheInterceptor) // Áp dụng cho tất cả route trong controller này
        export class CatsController {
          @Get()
          @CacheKey('all_cats') // Key cho cache
          @CacheTTL(60) // Override TTL thành 60s cho route này
          async findAll(): Promise<any[]> {
            console.log('Fetching all cats from service/DB...');
            // ... logic lấy cats ...
            return [{ name: 'Miu', age: 2 }];
          }

          @Get(':id')
          // Sẽ tự động tạo key dựa trên URL, hoặc có thể custom với @CacheKey
          async findOne(@Param('id') id: string): Promise<any> {
            console.log(`Fetching cat ${id} from service/DB...`);
            // ... logic lấy cat ...
            return { name: `Miu ${id}`, age: 3 };
          }
        }
        ```
    * **Tương tác trực tiếp với Cache Manager:** Inject `CACHE_MANAGER`.
        ```typescript
        import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
        import { Cache } from 'cache-manager';

        @Injectable()
        export class AppService {
          constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

          async getCachedData(key: string): Promise<any> {
            const value = await this.cacheManager.get(key);
            if (value) {
              return value;
            }
            // ... logic lấy data từ nguồn ...
            // await this.cacheManager.set(key, dataToCache, { ttl: 60 });
            return dataToCache;
          }
        }
        ```

**Code Example:**

1.  **Tạo `LoggingInterceptor` và `TransformResponseInterceptor`:**
    * (Như code ví dụ ở phần lý thuyết)
    * `src/common/interceptors/logging.interceptor.ts`
    * `src/common/interceptors/transform-response.interceptor.ts`

2.  **Áp dụng global trong `main.ts`:**
    ```typescript
    // src/main.ts
    import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
    import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
    // ...
    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      // ...
      app.useGlobalInterceptors(new LoggingInterceptor()); // Logging nên chạy trước
      app.useGlobalInterceptors(new TransformResponseInterceptor()); // Transform response sau cùng
      // ...
      await app.listen(port);
    }
    ```

3.  **Thực hành với Caching:**
    * **Cài đặt:** `npm install @nestjs/cache-manager cache-manager`
    * **Cấu hình `CacheModule.register({ isGlobal: true, ttl: 10 })` trong `AppModule`.**
    * **Trong `ProductsController`, áp dụng `CacheInterceptor` cho endpoint `GET /products`:**
        ```typescript
        // src/products/products.controller.ts
        import { Controller, Get, UseInterceptors, CacheInterceptor, CacheKey } from '@nestjs/common';
        import { ProductsService } from './products.service';
        // ...

        @Controller('products')
        export class ProductsController {
          constructor(private readonly productsService: ProductsService) {}

          @Get()
          @UseInterceptors(CacheInterceptor) // Sử dụng CacheInterceptor mặc định
          @CacheKey('all_products_cache') // Đặt một key cố định cho cache này
          // @CacheTTL(30) // Override TTL nếu cần (ví dụ 30 giây)
          async findAll() {
            this.productsService.getLogger().log('Controller: Finding all products (might be cached)');
            return this.productsService.findAll();
          }

          @Get(':id')
          @UseInterceptors(CacheInterceptor) // Cache sẽ tự động dựa trên URL
          async findOne(@Param('id', ParseIntPipe) id: number) {
            this.productsService.getLogger().log(`Controller: Finding product ${id} (might be cached)`);
            return this.productsService.findOne(id);
          }
          // ...
        }
        ```
    * Trong `ProductsService`, thêm log để biết khi nào hàm thực sự được gọi (không phải từ cache).
        ```typescript
        // src/products/products.service.ts
        // ...
        async findAll(): Promise<Product[]> {
          this.logger.log('Service: Actually fetching all products from DB'); // Log này chỉ xuất hiện khi không có cache hit
          return this.productsRepository.find();
        }
        async findOne(id: number): Promise<Product> {
          this.logger.log(`Service: Actually fetching product ${id} from DB`); // Log này chỉ xuất hiện khi không có cache hit
          // ...
        }
        // ...
        public getLogger() { return this.logger; } // Helper để controller log
        ```

**Bài tập thực hành:**

1.  **Tạo `ResponseTimingInterceptor`:**
    * **Yêu cầu:** Viết một interceptor tên là `ResponseTimingInterceptor` để đo và log thời gian xử lý của mỗi request.
    * Interceptor này cũng nên thêm một header tùy chỉnh vào response, ví dụ `X-Response-Time: <thời gian xử lý>ms`.
    * Áp dụng interceptor này ở global scope.
2.  **Tạo `ExcludeNullInterceptor`:**
    * **Yêu cầu:** Viết một interceptor tên là `ExcludeNullInterceptor` để tự động loại bỏ tất cả các trường có giá trị `null` (không phải `undefined`) khỏi đối tượng response data trước khi gửi về client.
    * Áp dụng global. Test với một endpoint trả về object có một vài trường `null`.
3.  **Triển khai `CacheInterceptor` cho `ProductsController`:**
    * **Yêu cầu:**
        * Cài đặt `@nestjs/cache-manager` và `cache-manager`.
        * Cấu hình `CacheModule.register({ isGlobal: true, ttl: 20 })` trong `AppModule` (TTL 20 giây).
        * Áp dụng `CacheInterceptor` (từ `@nestjs/common`) cho endpoint `GET /products` và `GET /products/:id` trong `ProductsController`.
        * Sử dụng `@CacheKey()` và `@CacheTTL()` nếu cần.
        * Thêm log vào service methods để xác nhận khi nào dữ liệu được lấy từ DB và khi nào từ cache. Test bằng cách gọi API nhiều lần.
4.  **Tạo `AddOwnerInfoInterceptor` (Nâng cao, giả sử có Authentication):**
    * **Yêu cầu:** Giả sử bạn đã có hệ thống authentication và `request.user` chứa thông tin user đã đăng nhập (ví dụ `user.id`).
    * Viết một interceptor `AddOwnerInfoInterceptor` chỉ áp dụng cho các request `POST` đến một endpoint tạo resource (ví dụ `POST /products`).
    * Interceptor này sẽ tự động thêm `ownerId: request.user.id` vào `request.body` trước khi DTO validation và handler được gọi.
    * **Lưu ý:** Cẩn thận khi sửa đổi `request.body`. Đảm bảo DTO của bạn có trường `ownerId` (có thể là optional và được validate).
    * **Gợi ý:**
        ```typescript
        // ...
        intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
            const request = context.switchToHttp().getRequest();
            if (request.method === 'POST' && request.user && request.user.id) {
                request.body.ownerId = request.user.id; // Thêm thông tin owner
            }
            return next.handle();
        }
        // ...
        ```
5.  **Nghiên cứu và giải thích:**
    * **Yêu cầu:** RxJS operators (`map`, `tap`, `catchError`, `finalize`) thường được sử dụng trong interceptors. Hãy chọn 2 operator, giải thích cách chúng hoạt động và cung cấp một ví dụ nhỏ về cách chúng có thể được sử dụng trong một interceptor của NestJS.



