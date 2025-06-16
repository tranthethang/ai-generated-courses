## Chapter 12: Testing, Deployment và Best Practices

**Tên Chapter học:** Testing, Deployment và Best Practices

**Mục tiêu bài học:**

* **Testing trong NestJS:**
    * Hiểu các loại testing: Unit Test, Integration Test, E2E (End-to-End) Test.
    * Sử dụng Jest (framework testing mặc định của NestJS) và `@nestjs/testing` để viết test.
    * Thực hành viết unit test cho services, controllers, pipes, guards. Mock dependencies.
    * Thực hành viết E2E test cho các API endpoint sử dụng `supertest`.
* **Deployment Strategies:**
    * Giới thiệu các chiến lược deployment phổ biến cho ứng dụng Node.js/NestJS.
    * **Docker:** Containerize ứng dụng NestJS. Viết `Dockerfile` cơ bản và `docker-compose.yml` để chạy ứng dụng cùng với CSDL.
    * **Serverless (Giới thiệu):** Khái niệm triển khai NestJS trên các nền tảng serverless (AWS Lambda, Google Cloud Functions) sử dụng các adapter.
    * **PM2:** Giới thiệu PM2 như một process manager mạnh mẽ cho Node.js trong môi trường production.
* **Best Practices:**
    * **Code Organization:** Tái khẳng định tầm quan trọng của feature modules, cấu trúc thư mục rõ ràng.
    * **Performance:** Caching, lazy loading modules, tối ưu query CSDL, sử dụng Fastify (nếu cần).
    * **Security:** Helmet, CORS, rate limiting, input validation, bảo vệ khỏi các lỗ hổng phổ biến (XSS, SQL Injection - thông qua ORM), quản lý secret.
    * **API Documentation:** Sử dụng `@nestjs/swagger` để tự động tạo tài liệu API tương tác (OpenAPI/Swagger UI).
* **Ôn tập và Q&A:** Tổng kết kiến thức toàn khóa, giải đáp các thắc mắc còn lại.

**Tóm tắt lý thuyết:**

1.  **Testing trong NestJS:**
    * NestJS được thiết kế để dễ dàng testing. CLI tự động tạo file test spec.
    * **Jest:** Framework testing mặc định.
    * **`@nestjs/testing`:** Cung cấp các utility để test, đặc biệt là `Test.createTestingModule()`.
    * **Các loại Test:**
        * **Unit Tests:**
            * Test các đơn vị code nhỏ nhất một cách cô lập (class, method, function).
            * Dependencies thường được mock (giả lập).
            * Nhanh, tập trung vào logic của đơn vị đó.
            * Ví dụ: Test một method của service, test một pipe, một guard.
        * **Integration Tests:**
            * Test sự tương tác giữa nhiều components (ví dụ: controller với service, service với module CSDL).
            * Có thể sử dụng CSDL test hoặc mock một phần.
            * Đảm bảo các phần của ứng dụng làm việc cùng nhau đúng cách.
        * **E2E (End-to-End) Tests:**
            * Test toàn bộ flow của ứng dụng từ góc độ người dùng (HTTP request -> HTTP response).
            * Mô phỏng môi trường thực tế nhất có thể.
            * Thường chậm hơn unit/integration test.
            * Sử dụng `supertest` để gửi HTTP request đến ứng dụng đang chạy.
    * **Viết Unit Test (Ví dụ Service):**
        ```typescript
        // products.service.spec.ts
        import { Test, TestingModule } from '@nestjs/testing';
        import { ProductsService } from './products.service';
        import { getRepositoryToken } from '@nestjs/typeorm'; // Nếu dùng TypeORM
        import { Product } from './entities/product.entity';
        import { Repository } from 'typeorm';
        import { NotFoundException } from '@nestjs/common';

        // Tạo mock repository
        const mockProductRepository = {
          find: jest.fn(),
          findOneBy: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
          // ... các method khác cần mock
        };

        describe('ProductsService', () => {
          let service: ProductsService;
          let repository: Repository<Product>;

          beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
              providers: [
                ProductsService,
                {
                  provide: getRepositoryToken(Product), // Cung cấp token của repository
                  useValue: mockProductRepository,    // Sử dụng mock object
                },
              ],
            }).compile();

            service = module.get<ProductsService>(ProductsService);
            repository = module.get<Repository<Product>>(getRepositoryToken(Product));
          });

          it('should be defined', () => {
            expect(service).toBeDefined();
          });

          describe('findAll', () => {
            it('should return an array of products', async () => {
              const mockProducts = [{ id: 1, name: 'Test Product', price: 100 }];
              mockProductRepository.find.mockResolvedValue(mockProducts); // Giả lập find() trả về
              expect(await service.findAll()).toEqual(mockProducts);
              expect(repository.find).toHaveBeenCalledTimes(1);
            });
          });

          describe('findOne', () => {
            it('should return a single product if found', async () => {
              const mockProduct = { id: 1, name: 'Test Product', price: 100 };
              mockProductRepository.findOneBy.mockResolvedValue(mockProduct);
              expect(await service.findOne(1)).toEqual(mockProduct);
              expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
            });

            it('should throw NotFoundException if product not found', async () => {
              mockProductRepository.findOneBy.mockResolvedValue(null);
              await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
            });
          });
          // ... Các test khác cho create, update, remove
        });
        ```
    * **Viết E2E Test:**
        * Thường đặt trong thư mục `test/`.
        * Sử dụng `supertest` để gửi request.
        ```typescript
        // test/products.e2e-spec.ts
        import { Test, TestingModule } from '@nestjs/testing';
        import { INestApplication, ValidationPipe } from '@nestjs/common';
        import * as request from 'supertest';
        import { AppModule } from '../src/app.module'; // Import AppModule chính

        describe('ProductsController (e2e)', () => {
          let app: INestApplication;

          beforeAll(async () => { // beforeAll để khởi tạo app một lần
            const moduleFixture: TestingModule = await Test.createTestingModule({
              imports: [AppModule], // Sử dụng AppModule thật
            }).compile();

            app = moduleFixture.createNestApplication();
            app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Áp dụng global pipes nếu có
            await app.init();
          });

          afterAll(async () => {
            await app.close();
          });

          it('/products (GET) - should get all products', () => {
            return request(app.getHttpServer()) // Lấy HTTP server của app
              .get('/products')
              .expect(200) // Mong đợi status code 200
              .expect((res) => { // Mong đợi response body
                expect(Array.isArray(res.body.data)).toBe(true); // Nếu có TransformResponseInterceptor
                // expect(Array.isArray(res.body)).toBe(true); // Nếu không có interceptor đó
              });
          });

          it('/products (POST) - should create a product', async () => {
            const createProductDto = { name: 'E2E Test Product', price: 99, stock: 10 };
            const response = await request(app.getHttpServer())
              .post('/products')
              // .set('Authorization', 'Bearer your_jwt_token') // Nếu endpoint cần auth
              .send(createProductDto)
              .expect(201); // Hoặc 200 nếu TransformResponseInterceptor thay đổi status

            // expect(response.body.data.name).toEqual(createProductDto.name);
            expect(response.body.data).toMatchObject(createProductDto);
            // Thêm các assertions khác
          });

          // ... Các test E2E khác cho GET :id, PUT, DELETE ...
        });
        ```

2.  **Deployment Strategies:**
    * **Docker:**
        * **`Dockerfile`:** Định nghĩa cách build image cho ứng dụng.
            ```dockerfile
            # Stage 1: Build the application
            FROM node:18-alpine As builder
            WORKDIR /usr/src/app
            COPY package*.json ./
            RUN npm install --only=production # Chỉ cài đặt production dependencies
            COPY . .
            RUN npm run build # Build ứng dụng NestJS (tạo thư mục /dist)

            # Stage 2: Setup a production-ready image
            FROM node:18-alpine
            WORKDIR /usr/src/app
            # Copy production dependencies and built application from builder stage
            COPY --from=builder /usr/src/app/node_modules ./node_modules
            COPY --from=builder /usr/src/app/dist ./dist
            COPY package.json . # package.json có thể cần cho một số trường hợp

            # Mở port mà ứng dụng chạy (từ .env hoặc config)
            EXPOSE 3000
            # Lệnh để chạy ứng dụng
            CMD ["node", "dist/main.js"]
            ```
        * **`.dockerignore`:** Liệt kê các file/thư mục không cần copy vào image.
            ```
            node_modules
            npm-debug.log
            Dockerfile
            .dockerignore
            dist
            .git
            .env
            ```
        * **`docker-compose.yml`:** Định nghĩa và chạy multi-container applications (ví dụ: app + database).
            ```yaml
            version: '3.8'
            services:
              nest-app:
                build:
                  context: .
                  dockerfile: Dockerfile
                container_name: my_nest_app
                ports:
                  - "3000:3000" # Map port host:container (port container là port app chạy)
                depends_on:
                  - postgres_db # Đảm bảo DB khởi động trước app
                environment: # Truyền biến môi trường vào container
                  - NODE_ENV=production
                  - PORT=3000
                  - DATABASE_HOST=postgres_db # Tên service của DB trong docker-compose
                  - DATABASE_PORT=5432
                  - DATABASE_USER=youruser
                  - DATABASE_PASSWORD=yourpassword
                  - DATABASE_NAME=yourdb
                  - JWT_SECRET=yourproductionjwtsecret
                  - JWT_EXPIRES_IN=1h
                # volumes: # Nếu cần mount code local vào dev (không khuyến khích cho production build)
                #   - .:/usr/src/app
                #   - /usr/src/app/node_modules
                networks:
                  - app_network

              postgres_db:
                image: postgres:14-alpine
                container_name: my_postgres_db
                environment:
                  - POSTGRES_USER=youruser
                  - POSTGRES_PASSWORD=yourpassword
                  - POSTGRES_DB=yourdb
                ports:
                  - "5432:5432"
                volumes:
                  - postgres_data:/var/lib/postgresql/data # Persist data
                networks:
                  - app_network

            volumes:
              postgres_data: # Define a named volume

            networks:
              app_network:
                driver: bridge
            ```
        * **Lệnh:** `docker build -t my-nest-app-image .`, `docker-compose up -d`.
    * **Serverless (AWS Lambda, Google Cloud Functions, Azure Functions):**
        * NestJS có thể chạy trên môi trường serverless với các adapter như `@vendia/serverless-express` hoặc `@nestjs/platform-fastify` với `aws-lambda-fastify`.
        * Ưu điểm: Tự động scale, trả tiền theo_mức_độ_sử_dụng.
        * Nhược điểm: Cold starts, giới hạn thời gian thực thi.
    * **PM2 (Process Manager 2):**
        * Một process manager mạnh mẽ cho Node.js trong production.
        * Giúp:
            * Giữ ứng dụng chạy mãi (auto-restart khi crash).
            * Load balancing (cluster mode).
            * Monitoring.
            * Log management.
        * **Cài đặt:** `npm install pm2 -g`
        * **Chạy app:** `pm2 start dist/main.js --name my-app -i max` (`-i max` để chạy cluster mode với số core CPU tối đa).
        * **Lệnh hữu ích:** `pm2 list`, `pm2 logs my-app`, `pm2 stop my-app`, `pm2 restart my-app`, `pm2 delete my-app`.
        * Tạo file `ecosystem.config.js` để cấu hình chi tiết.

3.  **Best Practices:**
    * **Code Organization:**
        * Feature modules (mỗi module cho một domain/feature).
        * Shared module (cho các components dùng chung).
        * Core module (cho các services, providers dùng một lần khi app khởi tạo, ví dụ `ConfigModule`).
        * Cấu trúc thư mục rõ ràng trong từng module (ví dụ: `controllers`, `services`, `dto`, `entities`, `guards`, `pipes`, `resolvers`, `graphql`).
    * **Performance:**
        * **Caching:** Sử dụng `@nestjs/cache-manager` cho các dữ liệu ít thay đổi.
        * **Lazy Loading Modules:** Cho các module không cần thiết ngay khi khởi động (sử dụng `LazyModuleLoader`).
        * **Database Query Optimization:** Tránh N+1 (dùng DataLoader cho GraphQL, eager/lazy loading cho TypeORM), sử dụng index, tối ưu câu query.
        * **Chọn Transport phù hợp cho Microservices:** gRPC thường nhanh hơn TCP/Redis cho request-response.
        * **Sử dụng Fastify:** `NestFastifyApplication` có thể cho performance tốt hơn `NestExpressApplication` trong một số trường hợp.
            ```typescript
            // main.ts
            import { NestFactory } from '@nestjs/core';
            import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
            // ...
            const app = await NestFactory.create<NestFastifyApplication>(
              AppModule,
              new FastifyAdapter(),
            );
            ```
    * **Security:**
        * **Helmet:** Middleware giúp bảo vệ khỏi các lỗ hổng web phổ biến bằng cách set các HTTP header (cài đặt `helmet`).
            `app.use(helmet());`
        * **CORS (Cross-Origin Resource Sharing):** Cấu hình `app.enableCors()` cho phép request từ các domain khác.
        * **Rate Limiting:** Chống brute-force, DoS (sử dụng `nestjs-rate-limiter` hoặc `express-rate-limit`).
        * **Input Validation:** Luôn sử dụng `ValidationPipe` và DTOs.
        * **ORM/ODM Security:** Sử dụng ORM/ODM giúp chống SQL/NoSQL Injection (nhưng vẫn cần cẩn thận với raw queries).
        * **Quản lý Secrets:** Dùng `@nestjs/config` và biến môi trường, không hardcode secrets.
        * **HTTPS:** Luôn sử dụng HTTPS trong production.
        * **Authentication & Authorization:** Triển khai JWT, Passport, Guards một cách cẩn thận.
    * **API Documentation (`@nestjs/swagger`):**
        * Tự động tạo tài liệu API tương tác dựa trên OpenAPI Specification.
        * **Cài đặt:** `npm install --save @nestjs/swagger swagger-ui-express`
        * **Cấu hình trong `main.ts`:**
            ```typescript
            // src/main.ts
            import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
            // ...
            async function bootstrap() {
              const app = await NestFactory.create(AppModule);
              // ...
              const config = new DocumentBuilder()
                .setTitle('My API Documentation')
                .setDescription('The API description for my awesome NestJS app')
                .setVersion('1.0')
                .addTag('cats', 'Everything about your cats') // Thêm tag cho các group API
                .addTag('products')
                .addBearerAuth() // Nếu dùng JWT Bearer token
                .build();
              const document = SwaggerModule.createDocument(app, config);
              SwaggerModule.setup('api-docs', app, document); // Endpoint là /api-docs
              // ...
              await app.listen(port);
            }
            ```
        * **Sử dụng Decorators trong DTOs và Controllers:**
            * `@ApiProperty()`, `@ApiPropertyOptional()` trong DTOs.
            * `@ApiOperation()`, `@ApiResponse()`, `@ApiParam()`, `@ApiQuery()`, `@ApiBody()`, `@ApiTags()`, `@ApiBearerAuth()` trong Controllers.
            ```typescript
            // products.controller.ts
            import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
            // ...
            @ApiTags('products') // Gắn controller này vào tag 'products'
            @Controller('products')
            export class ProductsController {
              // ...
              @Post()
              @ApiOperation({ summary: 'Create a new product' }) // Mô tả operation
              @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: ProductTypeGQL }) // Mô tả response, ProductTypeGQL là class đại diện cho schema response
              @ApiResponse({ status: 400, description: 'Bad Request.' })
              @ApiBody({ type: CreateProductDto }) // Mô tả request body
              @ApiBearerAuth() // Yêu cầu Bearer token
              @UseGuards(JwtAuthGuard)
              create(@Body() createProductDto: CreateProductDto) {
                return this.productsService.create(createProductDto);
              }
            }
            ```

**Code Example (Testing và Swagger):**

1.  **Viết Unit Test cho `ProductsService.create()`:**
    * Giả sử `create` method trong `ProductsService` gọi `this.productsRepository.create(dto)` và `this.productsRepository.save(entity)`.
    * Mock `productsRepository.create` và `productsRepository.save`.
    * Kiểm tra xem các method mock có được gọi với đúng tham số không và service trả về kết quả mong đợi.
2.  **Viết E2E Test cho `POST /products`:**
    * Khởi tạo app trong `beforeAll`.
    * Gửi request POST đến `/products` với payload hợp lệ.
    * Expect status code 201 (hoặc 200 nếu có transform).
    * Expect response body chứa thông tin sản phẩm đã tạo.
    * (Nâng cao) Nếu endpoint cần auth, set `Authorization` header trong request.
3.  **Tích hợp Swagger:**
    * Cài đặt `@nestjs/swagger swagger-ui-express`.
    * Cấu hình `SwaggerModule` trong `main.ts`.
    * Thêm các decorator `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody` vào `ProductsController` và `CreateProductDto`.
    * Chạy app và truy cập `/api-docs` để xem UI Swagger.

**Bài tập thực hành:**

1.  **Viết Unit Tests:**
    * **Yêu cầu:** Viết unit test cho ít nhất 2 method trong `AuthService` (ví dụ: `validateUserCredentials` và `login`). Mock các dependency nếu có (ví dụ `UsersService`, `JwtService`).
    * Viết unit test cho một custom `Pipe` hoặc `Guard` bạn đã tạo ở các Chapter trước.
2.  **Viết E2E Tests:**
    * **Yêu cầu:** Viết E2E test cho ít nhất 2 endpoint quan trọng của ứng dụng (ví dụ: `POST /auth/login` và `GET /products/:id`).
    * Đảm bảo xử lý trường hợp thành công và trường hợp lỗi (ví dụ: sai credentials cho login, không tìm thấy product).
3.  **Tạo `Dockerfile` và `docker-compose.yml`:**
    * **Yêu cầu:**
        * Viết `Dockerfile` cho ứng dụng NestJS của bạn (sử dụng multi-stage build).
        * Viết `docker-compose.yml` để chạy ứng dụng NestJS cùng với một CSDL (PostgreSQL hoặc MongoDB) mà ứng dụng của bạn đang sử dụng.
        * Build và chạy ứng dụng bằng Docker Compose. Test xem API có hoạt động không.
4.  **Tích hợp `@nestjs/swagger`:**
    * **Yêu cầu:**
        * Cài đặt và cấu hình `@nestjs/swagger`.
        * Thêm các decorator cần thiết (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody`, `@ApiProperty`, `@ApiBearerAuth` nếu có) cho `AuthController`, `ProductsController`, và các DTOs liên quan.
        * Chạy ứng dụng và khám phá tài liệu API trên `/api-docs`. Thử "Try it out" một vài endpoint.
5.  **Nghiên cứu và trình bày một Best Practice:**
    * **Yêu cầu:** Chọn một trong các best practices được đề cập (ví dụ: Rate Limiting, Helmet, Lazy Loading Modules).
    * Nghiên cứu sâu hơn về nó trong ngữ cảnh NestJS.
    * Trình bày (ngắn gọn) cách triển khai và lợi ích của nó.
6.  **(Tự chọn) Triển khai ứng dụng lên một Platform:**
    * **Yêu cầu:** Nếu có thời gian và kinh nghiệm, thử triển khai ứng dụng NestJS của bạn (đã Dockerize) lên một platform cloud nhỏ (ví dụ: Heroku, Fly.io, Railway, hoặc một free tier của AWS/GCP/Azure).
