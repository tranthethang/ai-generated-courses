## Chapter 8: Error Handling & Logging Nâng Cao

**Tên Chapter học:** Error Handling & Logging Nâng Cao

**Mục tiêu bài học:**

* **Hiểu cơ chế Exception Filters:** Nắm vững cách NestJS xử lý lỗi thông qua Exception Filters. Hiểu về built-in global exception filter.
* **Sử dụng Built-in HTTP Exceptions:** Thành thạo việc sử dụng các exceptions có sẵn như `HttpException`, `BadRequestException`, `NotFoundException`, `UnauthorizedException`, `ForbiddenException`, etc.
* **Tạo Custom Exception Filters:**
    * Học cách tạo các exception filter tùy chỉnh bằng cách implement interface `ExceptionFilter`.
    * Biết cách bắt các loại exception cụ thể hoặc tất cả các exception.
    * Tùy chỉnh cấu trúc response lỗi trả về cho client (ví dụ: chuẩn hóa JSON error response).
* **Binding Filters:** Áp dụng exception filters ở các cấp độ khác nhau (global, controller, method).
* **Logging với NestJS `Logger`:**
    * Sử dụng `Logger` service tích hợp sẵn của NestJS để ghi log ở các mức độ khác nhau (`log`, `error`, `warn`, `debug`, `verbose`).
    * Biết cách tạo instance `Logger` với context (tên class) để dễ dàng theo dõi nguồn gốc log.
* **Custom Logger và Tích hợp Thư viện Logging:**
    * Hiểu cách tạo một custom logger service bằng cách implement `LoggerService` interface.
    * Giới thiệu và thực hành tích hợp các thư viện logging bên thứ ba mạnh mẽ như Winston hoặc Pino (ví dụ với `nest-winston`).
    * Cấu hình logging transports (console, file), formatting, và log levels.

**Tóm tắt lý thuyết:**

1.  **Exceptions Layer trong NestJS:**
    * NestJS có một lớp xử lý exception tích hợp sẵn, chịu trách nhiệm xử lý tất cả các unhandled exceptions trong ứng dụng.
    * Khi một exception không được bắt ở đâu đó trong code của bạn, nó sẽ được lớp này bắt giữ.
    * **Global Exception Filter (Built-in):** Mặc định, NestJS cung cấp một global exception filter.
        * Nếu exception là một instance của `HttpException` (hoặc kế thừa từ nó), filter sẽ trích xuất status code và message từ exception đó để tạo response JSON.
        * Nếu exception không phải là `HttpException` (ví dụ, một Error thông thường), filter sẽ trả về một response JSON mặc định với status code 500 (Internal Server Error).
            ```json
            {
              "statusCode": 500,
              "message": "Internal server error"
            }
            ```

2.  **Built-in HTTP Exceptions (`@nestjs/common`):**
    * NestJS cung cấp một tập hợp các standard exceptions kế thừa từ `HttpException`.
    * `HttpException(response: string | object, status: number, options?: HttpExceptionOptions)`: Base class.
        * `response`: Nội dung message lỗi (string) hoặc một object JSON.
        * `status`: HTTP status code.
    * Các exceptions phổ biến:
        * `BadRequestException(message?, error?)` (400)
        * `UnauthorizedException(message?, error?)` (401)
        * `NotFoundException(message?, error?)` (404)
        * `ForbiddenException(message?, error?)` (403)
        * `NotAcceptableException(message?, error?)` (406)
        * `RequestTimeoutException(message?, error?)` (408)
        * `ConflictException(message?, error?)` (409)
        * `GoneException(message?, error?)` (410)
        * `PayloadTooLargeException(message?, error?)` (413)
        * `UnsupportedMediaTypeException(message?, error?)` (415)
        * `UnprocessableEntityException(message?, error?)` (422)
        * `InternalServerErrorException(message?, error?)` (500)
        * `NotImplementedException(message?, error?)` (501)
        * `BadGatewayException(message?, error?)` (502)
        * `ServiceUnavailableException(message?, error?)` (503)
        * `GatewayTimeoutException(message?, error?)` (504)
    * Ví dụ: `throw new NotFoundException('User with ID 123 not found');`

3.  **Custom Exception Filters:**
    * Cho phép bạn kiểm soát hoàn toàn flow xử lý lỗi và nội dung response trả về.
    * Implement interface `ExceptionFilter`.
    * Decorator `@Catch(exceptionType1, exceptionType2, ...)`: Chỉ định các loại exception mà filter này sẽ bắt. Nếu không có argument, nó sẽ bắt tất cả các exception (`@Catch()`).
    * Method `catch(exception: T, host: ArgumentsHost)`:
        * `exception`: Đối tượng exception đã được ném.
        * `host`: Một `ArgumentsHost` object, cung cấp các method để lấy thông tin request, response (tương tự `ExecutionContext`).
    * **Ví dụ: `HttpExceptionFilter` để chuẩn hóa response lỗi HTTP:**
        ```typescript
        // src/common/filters/http-exception.filter.ts
        import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
        import { Request, Response } from 'express';

        @Catch(HttpException) // Chỉ bắt các HttpException và các class kế thừa từ nó
        export class HttpExceptionFilter implements ExceptionFilter {
          catch(exception: HttpException, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse(); // Có thể là string hoặc object

            // Chuẩn hóa response lỗi
            const errorResponse = {
              statusCode: status,
              timestamp: new Date().toISOString(),
              path: request.url,
              method: request.method,
              message: typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message || exception.message || 'Unhandled HTTP exception',
              // Nếu exceptionResponse là object, có thể có các trường error, details, etc.
              ...(typeof exceptionResponse === 'object' && exceptionResponse !== null && { errorDetails: exceptionResponse }),
            };

            response.status(status).json(errorResponse);
          }
        }
        ```
    * **Ví dụ: `AllExceptionsFilter` để bắt tất cả lỗi (cả HTTP và non-HTTP):**
        ```typescript
        // src/common/filters/all-exceptions.filter.ts
        import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
        import { Request, Response } from 'express';

        @Catch() // Bắt tất cả các loại exception
        export class AllExceptionsFilter implements ExceptionFilter {
          private readonly logger = new Logger(AllExceptionsFilter.name);

          catch(exception: unknown, host: ArgumentsHost) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<Response>();
            const request = ctx.getRequest<Request>();

            const status = exception instanceof HttpException
              ? exception.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;

            const message = exception instanceof HttpException
              ? exception.message
              : (exception instanceof Error ? exception.message : 'Internal server error');

            // Log lỗi (đặc biệt là lỗi không phải HTTP)
            if (!(exception instanceof HttpException)) {
              this.logger.error(`Unhandled Exception: ${message}`, (exception as Error).stack, `${request.method} ${request.url}`);
            } else {
                this.logger.warn(`HTTP Exception: ${status} ${message}`, (exception as Error).stack, `${request.method} ${request.url}`);
            }

            response.status(status).json({
              statusCode: status,
              timestamp: new Date().toISOString(),
              path: request.url,
              message: message,
            });
          }
        }
        ```

4.  **Binding Filters:**
    * **Global-scoped:** Áp dụng cho toàn bộ ứng dụng.
        ```typescript
        // src/main.ts
        async function bootstrap() {
          const app = await NestFactory.create(AppModule);
          // app.useGlobalFilters(new HttpExceptionFilter()); // Áp dụng sau global pipes
          app.useGlobalFilters(new AllExceptionsFilter()); // Nên có một filter bắt tất cả
          // ...
          await app.listen(3000);
        }
        ```
    * **Controller-scoped:**
        ```typescript
        @Controller('cats')
        @UseFilters(new HttpExceptionFilter())
        export class CatsController { /* ... */ }
        ```
    * **Method-scoped:**
        ```typescript
        @Post()
        @UseFilters(new SpecialExceptionFilter())
        async create(@Body() createCatDto: CreateCatDto) { /* ... */ }
        ```
    * **Kế thừa `BaseExceptionFilter`:** Nếu bạn muốn xử lý một số exception tùy chỉnh và để các exception khác được xử lý bởi global filter mặc định, bạn có thể `extend BaseExceptionFilter` (cần inject `HttpAdapterHost`).

5.  **Logging với NestJS `Logger`:**
    * NestJS cung cấp một `Logger` class (`@nestjs/common`) có thể sử dụng để log message.
    * **Sử dụng:**
        ```typescript
        import { Injectable, Logger } from '@nestjs/common';

        @Injectable()
        export class AppService {
          private readonly logger = new Logger(AppService.name); // Context là tên class

          getHello(): string {
            this.logger.log('getHello method called');
            this.logger.warn('This is a warning message.');
            try {
              throw new Error('Something went wrong!');
            } catch (error) {
              this.logger.error('An error occurred', error.stack);
            }
            this.logger.debug('Debugging information...', { data: { id: 1 }}); // Có thể truyền context object
            this.logger.verbose('Verbose details...');
            return 'Hello World!';
          }
        }
        ```
    * **Log Levels:** `log`, `error`, `warn`, `debug`, `verbose`.
    * **Cấu hình Log Levels:**
        * Trong `NestFactory.create()`:
            ```typescript
            // src/main.ts
            const app = await NestFactory.create(AppModule, {
              // logger: false, // Tắt logger mặc định
              logger: ['error', 'warn', 'log'], // Chỉ log các level này
            });
            ```
        * Hoặc set tĩnh: `Logger.overrideLogger(['error', 'warn']);`
    * **Custom Logger:**
        * Implement interface `LoggerService`.
        * Pass instance của custom logger vào `NestFactory.create(AppModule, { logger: new MyCustomLogger() })`.

6.  **Tích hợp Thư viện Logging Bên Thứ Ba (Ví dụ: `nest-winston`):**
    * **Tại sao?** Các thư viện như Winston, Pino cung cấp nhiều tính năng mạnh mẽ hơn: multiple transports (console, file, HTTP, database), formatting, log rotation, filtering, etc.
    * **`nest-winston`:**
        * **Cài đặt:** `npm install --save nest-winston winston`
        * **Sử dụng:**
            ```typescript
            // app.module.ts
            import { Module } from '@nestjs/common';
            import { WinstonModule } from 'nest-winston';
            import * as winston from 'winston';
            // ...

            @Module({
              imports: [
                WinstonModule.forRoot({
                  // options (same as Winston LoggerOptions)
                  transports: [
                    new winston.transports.Console({
                      format: winston.format.combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.ms(), // Thời gian xử lý
                        winston.format.colorize({ all: true }), // Màu sắc
                        winston.format.printf(
                          (info) => `${info.timestamp} ${info.level} [${info.context || 'Application'}]: ${info.message} ${info.ms || ''}`,
                        ),
                      ),
                    }),
                    new winston.transports.File({
                      filename: 'logs/error.log',
                      level: 'error',
                      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                    new winston.transports.File({
                      filename: 'logs/combined.log',
                      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                  ],
                  // defaultMeta: { service: 'user-service' }, // Meta mặc định
                }),
                // ...
              ],
            })
            export class AppModule {}
            ```
        * **Inject logger:**
            ```typescript
            import { Injectable, Inject } from '@nestjs/common';
            import { WINSTON_MODULE_PROVIDER } from 'nest-winston'; // Hoặc WINSTON_MODULE_NEST_PROVIDER cho NestLoggerService interface
            import { Logger } from 'winston'; // Hoặc LoggerService từ @nestjs/common

            @Injectable()
            export class MyService {
              constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

              doSomething() {
                this.logger.info('Doing something...', { context: MyService.name });
              }
            }
            ```
        * **Sử dụng làm logger mặc định của NestJS:**
            ```typescript
            // main.ts
            import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
            // ...
            async function bootstrap() {
              const app = await NestFactory.create(AppModule);
              app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // Set Winston làm logger mặc định
              // ...
            }
            ```

**Code Example:**

1.  **Tạo `AllExceptionsFilter` (nếu chưa có):**
    * `src/common/filters/all-exceptions.filter.ts` (như ví dụ ở trên).
2.  **Áp dụng global filter trong `main.ts`:**
    ```typescript
    // src/main.ts
    import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
    // ...
    app.useGlobalFilters(new AllExceptionsFilter());
    // ...
    ```
3.  **Sử dụng `Logger` trong một service:**
    ```typescript
    // src/products/products.service.ts
    import { Injectable, Logger, NotFoundException } from '@nestjs/common';
    // ...

    @Injectable()
    export class ProductsService {
      private readonly logger = new Logger(ProductsService.name);
      // ...
      async findOne(id: number): Promise<Product> {
        this.logger.log(`Attempting to find product with id: ${id}`);
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
          this.logger.warn(`Product with id ${id} not found.`);
          throw new NotFoundException(`Product with id #${id} not found`);
        }
        this.logger.log(`Found product: ${product.name}`);
        return product;
      }
      // ...
    }
    ```
4.  **Tích hợp `nest-winston` (ví dụ):**
    * Cài đặt: `npm install nest-winston winston`
    * Cấu hình `WinstonModule.forRoot()` trong `AppModule` (như ví dụ trên).
    * Set Winston làm logger mặc định trong `main.ts`.
    * Các `Logger` instance của NestJS sẽ tự động sử dụng Winston.

**Bài tập thực hành:**

1.  **Tạo `HttpExceptionFilter`:**
    * **Yêu cầu:** Tạo một custom filter tên là `CustomHttpExceptionFilter` trong thư mục `src/common/filters/`.
    * Filter này chỉ bắt các `HttpException`.
    * Response lỗi trả về phải có cấu trúc JSON: `{ statusCode: number, timestamp: string, path: string, method: string, errorName: string, message: any }`. `errorName` là tên của exception (ví dụ: 'NotFoundException').
    * Áp dụng filter này ở cấp global trong `main.ts`.
2.  **Ném các Built-in Exceptions:**
    * **Yêu cầu:** Trong `ProductsService`:
        * Khi `findOne` không tìm thấy sản phẩm, ném `NotFoundException`.
        * Khi `create` nhận DTO không hợp lệ (ví dụ sau khi `ValidationPipe` đã chạy nhưng bạn muốn thêm logic kiểm tra nghiệp vụ), ném `BadRequestException` hoặc `UnprocessableEntityException` với message cụ thể.
        * (Giả lập) Trong method `update`, nếu user không có quyền cập nhật sản phẩm đó, ném `ForbiddenException`.
    * Kiểm tra response lỗi trên Postman, đảm bảo nó theo format của `CustomHttpExceptionFilter`.
3.  **Sử dụng NestJS `Logger`:**
    * **Yêu cầu:**
        * Trong `ProductsService`, tạo một instance `Logger` với context là `ProductsService.name`.
        * Thêm các log ở các mức độ khác nhau:
            * `log()`: Khi một method public được gọi (ví dụ: "findAll products requested").
            * `warn()`: Khi có một tình huống không mong muốn nhưng không phải lỗi nghiêm trọng (ví dụ: "Attempting to update non-existing product ID: X").
            * `error()`: Khi bắt được một lỗi trong `try...catch` (ví dụ: lỗi kết nối CSDL giả lập).
            * `debug()`: Log các thông tin chi tiết hơn cho việc debug (ví dụ: payload của request tạo sản phẩm).
        * Cấu hình trong `main.ts` để chỉ hiển thị log từ `log`, `warn`, `error` level.
4.  **Tích hợp `nest-winston`:**
    * **Yêu cầu:**
        * Cài đặt `nest-winston` và `winston`.
        * Cấu hình `WinstonModule.forRoot()` trong `AppModule` với ít nhất hai transport:
            * Console transport: Format log đẹp, có màu sắc, timestamp, context, message.
            * File transport: Ghi tất cả log (hoặc từ level `info`) vào file `logs/app.log` dưới dạng JSON.
        * Set Winston làm logger mặc định cho ứng dụng NestJS trong `main.ts`.
        * Chạy ứng dụng và thực hiện vài request để xem log trên console và trong file.
5.  **(Nâng cao) Filter bắt lỗi CSDL (ví dụ TypeORM):**
    * **Yêu cầu:** Tạo một filter mới (ví dụ `TypeOrmExceptionFilter`) bắt các lỗi cụ thể từ TypeORM (ví dụ: `EntityNotFoundError`, `QueryFailedError`).
    * Chuyển đổi các lỗi này thành các `HttpException` phù hợp (ví dụ: `EntityNotFoundError` -> `NotFoundException`).
    * Áp dụng filter này (có thể global hoặc cho các controller tương tác CSDL). Mục đích là để che giấu chi tiết lỗi CSDL khỏi client và trả về lỗi HTTP thân thiện hơn.



