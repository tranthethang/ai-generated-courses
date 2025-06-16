## Chapter 11: Microservices và CQRS

**Tên Chapter học:** Microservices và CQRS

**Mục tiêu bài học:**

* **Hiểu kiến trúc Microservices:**
    * Nắm vững khái niệm, ưu điểm (tính độc lập, khả năng mở rộng riêng lẻ, đa dạng công nghệ) và nhược điểm (tính phức tạp, giao tiếp liên service, quản lý) của kiến trúc microservices.
* **Xây dựng Microservices với NestJS:**
    * Làm quen với các transport layer mà NestJS hỗ trợ cho giao tiếp microservice (TCP, Redis, gRPC, Kafka, NATS, RabbitMQ).
    * Học cách tạo một NestJS application hoạt động như một microservice (không có HTTP server).
    * Sử dụng `ClientProxy` để gửi message (request-response) hoặc emit event (event-based) từ một service (ví dụ: API Gateway) đến một microservice khác.
    * Sử dụng `@MessagePattern` (cho request-response) và `@EventPattern` (cho event-based) trong microservice để xử lý các message/event nhận được.
* **Giới thiệu CQRS (Command Query Responsibility Segregation):**
    * Hiểu rõ pattern CQRS: tách biệt các thao tác ghi (Commands) và đọc (Queries) dữ liệu.
    * Lợi ích: Tối ưu hóa riêng cho write model và read model, khả năng mở rộng tốt hơn, đơn giản hóa các model phức tạp.
* **Triển khai CQRS cơ bản với `@nestjs/cqrs`:**
    * Sử dụng các thành phần của module `@nestjs/cqrs`:
        * `CommandBus`, `QueryBus`, `EventBus`.
        * `ICommandHandler`, `IQueryHandler`, `IEventHandler`.
        * `Command`, `Query`, `Event`.
    * Thực hành tạo Command, Query, Handler và sử dụng Bus để dispatch chúng.
* **Event Sourcing (Giới thiệu):** Nắm bắt khái niệm Event Sourcing như một pattern thường đi kèm với CQRS, nơi trạng thái của ứng dụng được xác định bằng một chuỗi các event.

**Tóm tắt lý thuyết:**

1.  **Kiến trúc Microservices:**
    * Là một phương pháp phát triển phần mềm chia một ứng dụng lớn thành một tập hợp các service nhỏ, độc lập, mỗi service chạy trong tiến trình riêng và giao tiếp với nhau qua các cơ chế nhẹ (thường là HTTP API, message queues, gRPC).
    * **Ưu điểm:**
        * **Independent Deployment:** Mỗi service có thể được deploy độc lập.
        * **Scalability:** Scale riêng từng service theo nhu cầu.
        * **Technology Diversity:** Chọn công nghệ phù hợp cho từng service.
        * **Fault Isolation:** Lỗi ở một service ít ảnh hưởng đến các service khác.
        * **Smaller Codebases:** Dễ hiểu, dễ bảo trì hơn.
    * **Nhược điểm:**
        * **Complexity:** Quản lý nhiều service, giao tiếp liên service, distributed transactions.
        * **Testing:** Khó khăn hơn trong việc test toàn bộ hệ thống.
        * **Operational Overhead:** Cần công cụ giám sát, logging, deployment phức tạp hơn.

2.  **Microservices trong NestJS:**
    * NestJS cung cấp các module để dễ dàng xây dựng và giao tiếp giữa các microservices.
    * **Transport Layers:**
        * **TCP:** Giao tiếp qua socket TCP đơn giản.
        * **Redis:** Sử dụng Redis Pub/Sub.
        * **gRPC:** Framework RPC hiệu năng cao của Google, sử dụng Protocol Buffers.
        * **Kafka, NATS, RabbitMQ:** Các message broker mạnh mẽ cho event-driven architecture.
    * **Tạo một Microservice Application:**
        * Trong `main.ts`, sử dụng `NestFactory.createMicroservice()` thay vì `NestFactory.create()`.
        ```typescript
        // main.ts của một microservice (ví dụ: math-service)
        import { NestFactory } from '@nestjs/core';
        import { AppModule } from './app.module';
        import { Transport, MicroserviceOptions } from '@nestjs/microservices';

        async function bootstrap() {
          const app = await NestFactory.createMicroservice<MicroserviceOptions>(
            AppModule,
            {
              transport: Transport.TCP, // Chọn transport layer
              options: {
                host: 'localhost',
                port: 3002, // Port cho microservice này
              },
            },
          );
          await app.listen(); // Lắng nghe message, không phải HTTP request
          console.log('Math microservice is running on TCP port 3002');
        }
        bootstrap();
        ```
    * **Xử lý Message/Event trong Microservice:**
        * **`@MessagePattern(pattern)` (Request-Response):**
            * Dùng để xử lý các message được gửi theo kiểu request-response (client gửi và đợi kết quả).
            * `pattern` có thể là string hoặc object.
            ```typescript
            // math.controller.ts (trong math-service)
            import { Controller } from '@nestjs/common';
            import { MessagePattern, Payload } from '@nestjs/microservices';

            @Controller()
            export class MathController {
              @MessagePattern({ cmd: 'add' }) // Pattern để nhận diện message
              add(@Payload() data: number[]): number {
                return (data || []).reduce((a, b) => a + b, 0);
              }

              @MessagePattern('multiply') // Pattern đơn giản
              multiply(@Payload() data: { a: number, b: number }): number {
                return data.a * data.b;
              }
            }
            ```
        * **`@EventPattern(pattern)` (Event-based):**
            * Dùng để xử lý các event được emit (client chỉ gửi, không đợi kết quả).
            * Thường dùng với message brokers (Kafka, RabbitMQ, NATS) hoặc Redis Pub/Sub.
            ```typescript
            // notifications.controller.ts (trong notification-service)
            import { Controller } from '@nestjs/common';
            import { EventPattern, Payload } from '@nestjs/microservices';

            @Controller()
            export class NotificationsController {
              @EventPattern('order_created') // Lắng nghe event 'order_created'
              handleOrderCreated(@Payload() data: any) {
                console.log('Notification Service: Received order_created event:', data);
                // ... gửi email, sms, etc. ...
              }
            }
            ```
    * **Giao tiếp với Microservice từ Client (ví dụ: API Gateway):**
        * Sử dụng `ClientsModule` và `ClientProxy`.
        * **Đăng ký client trong module của API Gateway:**
            ```typescript
            // app.module.ts (của API Gateway)
            import { Module } from '@nestjs/common';
            import { ClientsModule, Transport } from '@nestjs/microservices';
            // ...

            @Module({
              imports: [
                ClientsModule.register([
                  {
                    name: 'MATH_SERVICE', // Token để inject ClientProxy
                    transport: Transport.TCP,
                    options: { host: 'localhost', port: 3002 },
                  },
                  {
                    name: 'NOTIFICATION_SERVICE',
                    transport: Transport.REDIS, // Ví dụ dùng Redis
                    options: {
                      host: 'localhost',
                      port: 6379,
                    },
                  },
                ]),
                // ...
              ],
              // ...
            })
            export class AppModule {}
            ```
        * **Inject `ClientProxy` và sử dụng:**
            ```typescript
            // app.controller.ts (của API Gateway)
            import { Controller, Get, Inject, Query, Post, Body } from '@nestjs/common';
            import { ClientProxy } from '@nestjs/microservices';
            import { Observable, firstValueFrom } from 'rxjs'; // Cần firstValueFrom để chuyển Observable thành Promise

            @Controller()
            export class AppController {
              constructor(
                @Inject('MATH_SERVICE') private mathClient: ClientProxy,
                @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
              ) {}

              @Get('sum')
              async getSum(@Query('numbers') numbersStr: string): Promise<number> {
                const numbers = numbersStr.split(',').map(Number);
                // send() trả về Observable, cần chuyển sang Promise nếu dùng async/await
                return firstValueFrom(this.mathClient.send<number>({ cmd: 'add' }, numbers));
              }

              @Post('create-order')
              async createOrder(@Body() orderData: any) {
                // ... logic tạo order ...
                console.log('API Gateway: Order created, emitting event...');
                this.notificationClient.emit('order_created', { orderId: orderData.id, ...orderData }); // Emit event
                return { message: 'Order created and notification event emitted.' };
              }
            }
            ```
            `ClientProxy.send<TResult = any, TInput = any>(pattern: any, data: TInput)`: Gửi message và đợi response.
            `ClientProxy.emit<TResult = any, TInput = any>(pattern: any, data: TInput)`: Gửi event, không đợi response.

3.  **CQRS (Command Query Responsibility Segregation):**
    * Một pattern kiến trúc tách biệt các thao tác thay đổi trạng thái (Commands) khỏi các thao tác truy vấn trạng thái (Queries).
    * **Command Side (Write Model):**
        * Xử lý các command (yêu cầu thay đổi trạng thái).
        * Thường tập trung vào validation, business logic, và tính nhất quán dữ liệu.
        * Có thể không trả về dữ liệu, hoặc chỉ trả về ID của resource đã tạo/thay đổi.
    * **Query Side (Read Model):**
        * Xử lý các query (yêu cầu lấy dữ liệu).
        * Thường được tối ưu cho việc đọc, có thể sử dụng các CSDL khác nhau hoặc các view đã được denormalize.
        * Không bao giờ thay đổi trạng thái hệ thống.
    * **Benefits:**
        * **Scalability:** Scale riêng write side và read side.
        * **Performance:** Tối ưu hóa riêng cho từng loại thao tác.
        * **Simplicity:** Các model đơn giản hơn, dễ hiểu hơn.
        * **Flexibility:** Có thể sử dụng các CSDL/công nghệ khác nhau cho write và read.
    * **Events:** Thường được sử dụng để đồng bộ hóa trạng thái từ write model sang read model. Khi một command thành công, nó có thể publish một event. Read model lắng nghe event này để cập nhật dữ liệu của nó.

4.  **CQRS với `@nestjs/cqrs`:**
    * **Cài đặt:** `npm install --save @nestjs/cqrs`
    * **Các thành phần chính:**
        * **Command:** Một object đại diện cho ý định thay đổi trạng thái (ví dụ: `CreateProductCommand`).
            ```typescript
            // src/products/commands/impl/create-product.command.ts
            export class CreateProductCommand {
              constructor(
                public readonly name: string,
                public readonly price: number,
                public readonly description?: string,
              ) {}
            }
            ```
        * **Query:** Một object đại diện cho ý định truy vấn dữ liệu (ví dụ: `GetProductByIdQuery`).
            ```typescript
            // src/products/queries/impl/get-product-by-id.query.ts
            export class GetProductByIdQuery {
              constructor(public readonly productId: string) {}
            }
            ```
        * **CommandHandler (`@CommandHandler(CommandType)`):** Một class implement `ICommandHandler<CommandType>` để xử lý một command cụ thể.
            ```typescript
            // src/products/commands/handlers/create-product.handler.ts
            import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
            import { CreateProductCommand } from '../impl/create-product.command';
            import { ProductsRepository } from '../../products.repository'; // Giả sử có repository
            // ...

            @CommandHandler(CreateProductCommand)
            export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
              constructor(private readonly repository: ProductsRepository /*, private readonly eventBus: EventBus */) {}

              async execute(command: CreateProductCommand): Promise<any> { // Trả về ID hoặc entity
                const { name, price, description } = command;
                const product = await this.repository.createAndSave({ name, price, description });
                // this.eventBus.publish(new ProductCreatedEvent(product.id, name)); // Publish event
                return product;
              }
            }
            ```
        * **QueryHandler (`@QueryHandler(QueryType)`):** Một class implement `IQueryHandler<QueryType>` để xử lý một query cụ thể.
            ```typescript
            // src/products/queries/handlers/get-product-by-id.handler.ts
            import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
            import { GetProductByIdQuery } from '../impl/get-product-by-id.query';
            import { ProductsRepository } from '../../products.repository';
            // ...

            @QueryHandler(GetProductByIdQuery)
            export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
              constructor(private readonly repository: ProductsRepository) {}

              async execute(query: GetProductByIdQuery): Promise<any> { // Trả về DTO hoặc entity
                return this.repository.findById(query.productId);
              }
            }
            ```
        * **Event:** Một object đại diện cho một sự kiện đã xảy ra trong hệ thống (ví dụ: `ProductCreatedEvent`).
        * **EventHandler (`@EventsHandler(EventType)`):** Một class implement `IEventHandler<EventType>` để xử lý một event cụ thể.
        * **`CommandBus`:** Dùng để dispatch commands đến các CommandHandlers tương ứng.
        * **`QueryBus`:** Dùng để dispatch queries đến các QueryHandlers tương ứng.
        * **`EventBus`:** Dùng để publish events đến các EventHandlers.
    * **Cấu hình `CqrsModule` và đăng ký Handlers:**
        ```typescript
        // src/products/products.module.ts
        import { Module } from '@nestjs/common';
        import { CqrsModule } from '@nestjs/cqrs';
        // ... import các CommandHandlers, QueryHandlers ...
        export const CommandHandlers = [CreateProductHandler, /* ... */];
        export const QueryHandlers = [GetProductByIdHandler, /* ... */];

        @Module({
          imports: [CqrsModule, /* ... */],
          providers: [ProductsService, ProductsResolver, ProductsRepository, ...CommandHandlers, ...QueryHandlers],
          // ...
        })
        export class ProductsModule {}
        ```
    * **Sử dụng `CommandBus` và `QueryBus` trong Service hoặc Controller/Resolver:**
        ```typescript
        // src/products/products.service.ts (hoặc controller/resolver)
        import { Injectable } from '@nestjs/common';
        import { CommandBus, QueryBus } from '@nestjs/cqrs';
        import { CreateProductCommand } from './commands/impl/create-product.command';
        import { GetProductByIdQuery } from './queries/impl/get-product-by-id.query';
        // ...

        @Injectable()
        export class ProductsService {
          constructor(
            private readonly commandBus: CommandBus,
            private readonly queryBus: QueryBus,
          ) {}

          async createProduct(name: string, price: number, description?: string) {
            return this.commandBus.execute(
              new CreateProductCommand(name, price, description),
            );
          }

          async getProduct(id: string) {
            return this.queryBus.execute(new GetProductByIdQuery(id));
          }
        }
        ```

5.  **Event Sourcing (Giới thiệu):**
    * Một pattern kiến trúc trong đó tất cả các thay đổi đối với trạng thái ứng dụng được lưu trữ dưới dạng một chuỗi các event.
    * Thay vì lưu trạng thái hiện tại của một entity, bạn lưu tất cả các event đã xảy ra với entity đó.
    * Trạng thái hiện tại có thể được tái tạo bằng cách replay các event.
    * **Lợi ích:** Audit log đầy đủ, debug dễ dàng, khả năng phân tích lịch sử.
    * Thường đi kèm với CQRS. Command handlers validate command và publish events. Event handlers cập nhật read models và/hoặc ghi events vào event store.

**Code Example:**

1.  **Tạo 2 Project NestJS: `api-gateway` (HTTP) và `notification-service` (Microservice TCP):**
    * `nest new api-gateway`
    * `nest new notification-service`
2.  **Trong `notification-service`:**
    * **`src/main.ts`:** Cấu hình `createMicroservice` với `Transport.TCP` (ví dụ port 3003).
    * **`src/app.controller.ts` (hoặc `notification.controller.ts`):**
        ```typescript
        import { Controller } from '@nestjs/common';
        import { EventPattern, Payload } from '@nestjs/microservices';

        @Controller()
        export class AppController {
          @EventPattern('user_registered') // Lắng nghe event này
          handleUserRegistered(@Payload() data: { email: string; username: string }) {
            console.log(`[NotificationService] Received user_registered event for ${data.username} <${data.email}>. Sending welcome email...`);
            // Logic gửi email ở đây
          }
        }
        ```
    * `AppModule` sẽ import `AppController`.
3.  **Trong `api-gateway`:**
    * **`src/app.module.ts`:** Cấu hình `ClientsModule.register` để kết nối đến `NOTIFICATION_SERVICE`.
        ```typescript
        // ...
        ClientsModule.register([
          {
            name: 'NOTIFICATION_SERVICE',
            transport: Transport.TCP,
            options: { host: 'localhost', port: 3003 },
          },
        ]),
        // ...
        ```
    * **`src/app.controller.ts` (hoặc `users.controller.ts`):**
        ```typescript
        import { Controller, Post, Body, Inject } from '@nestjs/common';
        import { ClientProxy } from '@nestjs/microservices';

        @Controller('users')
        export class AppController {
          constructor(
            @Inject('NOTIFICATION_SERVICE') private notificationClient: ClientProxy,
          ) {}

          @Post('register')
          async registerUser(@Body() userData: { email: string; username: string; password_dont_send_this: string }) {
            console.log(`[APIGateway] User ${userData.username} registering...`);
            // ... logic tạo user trong DB của API Gateway ...
            // Sau khi user được tạo thành công:
            this.notificationClient.emit('user_registered', {
              email: userData.email,
              username: userData.username,
            });
            return { message: `User ${userData.username} registered. Notification event emitted.` };
          }
        }
        ```
4.  **Triển khai CQRS cho `Products` trong `api-gateway` (ví dụ):**
    * Cài đặt `@nestjs/cqrs`.
    * Tạo thư mục `src/products/commands/impl`, `src/products/commands/handlers`, `src/products/queries/impl`, `src/products/queries/handlers`.
    * Tạo `CreateProductCommand`, `CreateProductHandler`, `GetProductByIdQuery`, `GetProductByIdHandler` như ví dụ lý thuyết.
    * Tạo một `ProductsRepository` giả lập (hoặc sử dụng TypeORM/Mongoose Repository đã có).
    * Cập nhật `ProductsModule` để import `CqrsModule` và đăng ký các handlers.
    * Sửa đổi `ProductsService` (hoặc `ProductsController`/`ProductsResolver`) để sử dụng `CommandBus` và `QueryBus`.

**Bài tập thực hành:**

1.  **Thiết lập Microservice Giao tiếp (Request-Response):**
    * **Yêu cầu:**
        * Tạo một project NestJS mới tên là `inventory-service` (microservice).
        * `inventory-service` sử dụng transport TCP (ví dụ port 3004).
        * Trong `inventory-service`, tạo một `@MessagePattern({ cmd: 'get_stock' })` handler nhận `productId: string` và trả về số lượng tồn kho (giả lập).
        * Trong `api-gateway` (project HTTP chính của bạn), tạo một endpoint `GET /products/:id/stock`. Endpoint này sẽ `send` message đến `inventory-service` để lấy thông tin tồn kho và trả về cho client.
2.  **Thiết lập Microservice Giao tiếp (Event-based):**
    * **Yêu cầu:**
        * Tạo một project NestJS mới tên là `logging-service` (microservice).
        * `logging-service` sử dụng transport Redis (cần cài đặt Redis và chạy server).
        * Trong `logging-service`, tạo một `@EventPattern('api_request_logged')` handler nhận payload (ví dụ: `{ method, url, timestamp }`) và log ra console.
        * Trong `api-gateway`, sử dụng một interceptor (ví dụ `LoggingInterceptor` đã tạo) để sau khi log request, nó cũng `emit` một event `api_request_logged` đến `logging-service` với thông tin request.
3.  **Áp dụng CQRS cho `UsersModule` (phần Command):**
    * **Yêu cầu:**
        * Cài đặt `@nestjs/cqrs` trong `api-gateway`.
        * Tạo `CreateUserCommand` và `CreateUserHandler`.
        * Trong `UsersController` (hoặc `AuthController` nếu logic tạo user ở đó), khi đăng ký user, thay vì gọi trực tiếp service, hãy dispatch `CreateUserCommand` qua `CommandBus`.
        * `CreateUserHandler` sẽ chứa logic tạo user (gọi `UsersService` hoặc repository).
4.  **Áp dụng CQRS cho `UsersModule` (phần Query):**
    * **Yêu cầu:**
        * Tạo `GetUserByUsernameQuery` và `GetUserByUsernameHandler`.
        * Trong `AuthService` (khi validate user lúc login), thay vì gọi trực tiếp `UsersService.findOneByUsername()`, hãy dispatch `GetUserByUsernameQuery` qua `QueryBus`.
        * `GetUserByUsernameHandler` sẽ chứa logic lấy user.
5.  **(Nâng cao) Event Publishing sau Command:**
    * **Yêu cầu:**
        * Tạo `UserCreatedEvent`.
        * Trong `CreateUserHandler`, sau khi user được tạo thành công, sử dụng `EventBus` để publish `UserCreatedEvent` với thông tin user.
        * Tạo `UserCreatedEventHandler` lắng nghe event này và log ra thông tin (ví dụ: "User X has been created!").
        * Đăng ký Event Handler trong `UsersModule`.



