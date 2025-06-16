## Chapter 3: Providers và Dependency Injection (DI)

**Tên Chapter học:** Providers và Dependency Injection (DI)

**Mục tiêu bài học:**

* **Hiểu rõ Providers:** Nắm vững vai trò của Providers (thường là Services) như là nơi chứa logic nghiệp vụ, tách biệt khỏi Controllers. Biết cách tạo một Provider sử dụng decorator `@Injectable()`.
* **Dependency Injection (DI):**
    * Hiểu sâu khái niệm Dependency Injection và lợi ích của nó (loosely coupled, testability, reusability).
    * Nắm vững cách NestJS thực hiện DI thông qua constructor injection.
    * Biết cách đăng ký providers trong một module và inject chúng vào controllers hoặc các providers khác.
* **Scopes của Provider:**
    * Hiểu rõ ba loại scope: `Singleton` (mặc định), `Request`, và `Transient`.
    * Biết khi nào nên sử dụng từng loại scope và cách cấu hình chúng.
* **Custom Providers:**
    * Giới thiệu về các cách tạo provider nâng cao hơn:
        * `useValue`: Cung cấp một giá trị tĩnh làm provider.
        * `useClass`: Sử dụng một class khác làm provider.
        * `useFactory`: Sử dụng một factory function để tạo và trả về một provider (có thể inject các dependency khác vào factory).
        * `useExisting`: Tạo một alias cho một provider đã tồn tại.
* **Module `exports`:** Hiểu cách export một provider từ một module để các module khác có thể import và sử dụng provider đó.

**Tóm tắt lý thuyết:**

1.  **Providers (`@Injectable()`):**
    * Trong NestJS, provider là một khái niệm rộng, bao gồm services, repositories, factories, helpers, etc. Về cơ bản, bất kỳ class nào được đánh dấu bằng `@Injectable()` decorator đều có thể được quản lý bởi NestJS IoC (Inversion of Control) container và được inject làm dependency.
    * **Services** là loại provider phổ biến nhất, chúng thường đóng gói logic nghiệp vụ của ứng dụng. Ví dụ: `UsersService` có thể chứa logic để tạo người dùng, lấy thông tin người dùng, v.v.
    * Việc tách logic nghiệp vụ ra khỏi controllers giúp controllers giữ vai trò mỏng (thin), chỉ tập trung vào việc xử lý request/response và ủy thác công việc cho services.

2.  **Dependency Injection (DI):**
    * DI là một design pattern mà ở đó một đối tượng (client) không tự tạo ra các đối tượng phụ thuộc (dependencies/services) của nó. Thay vào đó, các dependencies này được "tiêm" (inject) vào client từ bên ngoài (thường bởi một IoC container).
    * **Lợi ích của DI:**
        * **Loose Coupling (Liên kết lỏng lẻo):** Client không cần biết cách tạo ra dependency, chỉ cần biết interface của nó. Điều này giúp dễ dàng thay thế implementation của dependency.
        * **Increased Testability (Tăng khả năng kiểm thử):** Dễ dàng mock (giả lập) các dependencies khi viết unit test cho client.
        * **Improved Reusability and Maintainability (Cải thiện khả năng tái sử dụng và bảo trì):** Code rõ ràng, dễ hiểu và quản lý hơn.
    * **DI trong NestJS:**
        * NestJS có một IoC container mạnh mẽ để quản lý các dependencies.
        * Cách phổ biến nhất để inject dependency là thông qua **constructor injection**:
            ```typescript
            // cats.controller.ts
            import { Controller } from '@nestjs/common';
            import { CatsService } from './cats.service';

            @Controller('cats')
            export class CatsController {
              constructor(private readonly catsService: CatsService) {
                // NestJS sẽ tự động tạo và inject một instance của CatsService vào đây
                // 'private readonly catsService' là một shorthand của TypeScript
                // để khai báo và khởi tạo một class member.
              }
              // ...
            }
            ```
        * Để một class có thể được inject, nó phải được đăng ký làm provider trong một module, và class nhận injection (ví dụ `CatsController`) cũng phải thuộc về một module (hoặc được import vào module đó).

3.  **Đăng ký Providers:**
    * Providers được đăng ký trong mảng `providers` của một `@Module()` decorator.
        ```typescript
        // cats.module.ts
        import { Module } from '@nestjs/common';
        import { CatsController } from './cats.controller';
        import { CatsService } from './cats.service'; // Import service

        @Module({
          controllers: [CatsController],
          providers: [CatsService], // Đăng ký CatsService làm provider
        })
        export class CatsModule {}
        ```
    * Khi `CatsService` được đăng ký, NestJS IoC container sẽ biết cách tạo (instantiate) và quản lý lifecycle của nó.

4.  **Provider Scopes:**
    * Scope của provider quyết định lifecycle và cách NestJS tạo instance của provider đó.
    * **`Scope.DEFAULT` (hoặc `Scope.SINGLETON`):** Mặc định. Một instance duy nhất của provider được tạo và chia sẻ trong toàn bộ ứng dụng. Hầu hết các trường hợp sử dụng scope này.
    * **`Scope.REQUEST`:** Một instance mới của provider được tạo cho mỗi incoming request. Instance này sẽ được garbage collected sau khi request hoàn thành. Hữu ích khi bạn cần trạng thái riêng cho mỗi request (ví dụ: lưu trữ thông tin user từ request, quản lý transaction cho request). Performance có thể bị ảnh hưởng.
        ```typescript
        import { Injectable, Scope } from '@nestjs/common';

        @Injectable({ scope: Scope.REQUEST })
        export class RequestScopedService { /* ... */ }
        ```
    * **`Scope.TRANSIENT`:** Một instance mới của provider được tạo mỗi khi nó được inject vào một consumer khác. Nếu nhiều consumer inject cùng một transient provider, mỗi consumer sẽ nhận một instance riêng.
        ```typescript
        import { Injectable, Scope } from '@nestjs/common';

        @Injectable({ scope: Scope.TRANSIENT })
        export class TransientService { /* ... */ }
        ```
    * Việc inject một request-scoped hoặc transient provider vào một singleton provider có thể gây ra vấn đề, vì singleton provider chỉ được tạo một lần. NestJS có cơ chế để xử lý việc này (ví dụ: inject `REQUEST` object).

5.  **Custom Providers:**
    * NestJS cho phép bạn đăng ký providers theo nhiều cách linh hoạt hơn là chỉ cung cấp tên class.
    * Cú pháp đầy đủ cho một provider object:
        ```typescript
        {
          provide: 'TOKEN_OR_CLASS_NAME', // Token định danh provider
          // một trong các cách sau để cung cấp giá trị:
          useClass?: Type<any>,
          useValue?: any,
          useFactory?: (...args: any[]) => any,
          inject?: any[], // Dependencies cho useFactory
          scope?: Scope,
        }
        ```
    * **`useValue`:** Cung cấp một giá trị tĩnh (object, array, string, number, function đã được tạo sẵn).
        ```typescript
        // app.module.ts
        const mockCatsService = { findAll: () => ['Test Cat'], create: (cat) => cat };
        @Module({
          providers: [
            {
              provide: 'CONFIG_OPTIONS', // Sử dụng string token
              useValue: { apiKey: 'YOUR_API_KEY', timeout: 5000 },
            },
            {
              provide: CatsService, // Sử dụng class name làm token
              useValue: mockCatsService, // Cung cấp một object giả lập
            }
          ],
        })
        export class AppModule {}
        ```
        Inject: `@Inject('CONFIG_OPTIONS') private configOptions: Record<string, any>`
    * **`useClass`:** Chỉ định một class khác sẽ được instantiate và cung cấp khi token được yêu cầu.
        ```typescript
        // logger.service.ts
        @Injectable() export class LoggerService { log(message: string) { console.log(message); } }
        @Injectable() export class BetterLoggerService extends LoggerService { /* ... */ }

        // app.module.ts
        @Module({
          providers: [
            {
              provide: LoggerService, // Token là LoggerService
              useClass: BetterLoggerService, // Nhưng sẽ dùng BetterLoggerService
            }
          ],
        })
        export class AppModule {}
        ```
    * **`useFactory`:** Cách linh hoạt nhất. Một factory function sẽ được thực thi để tạo ra provider instance. Factory function có thể inject các provider khác.
        ```typescript
        // connection.provider.ts
        export const connectionProvider = {
          provide: 'CONNECTION',
          useFactory: (optionsProvider: OptionsProvider, otherProvider: OtherProvider) => {
            const options = optionsProvider.get();
            return new Connection(options, otherProvider);
          },
          inject: [OptionsProvider, OtherProvider], // Dependencies cho factory
        };

        // app.module.ts
        @Module({
          providers: [connectionProvider, OptionsProvider, OtherProvider],
        })
        export class AppModule {}
        ```
    * **`useExisting` (Aliasing):** Tạo một alias (tên khác) cho một provider đã được đăng ký.
        ```typescript
        // logger.service.ts
        @Injectable() export class OldLogger { log(msg: string) { /* ... */ } }
        @Injectable() export class NewLogger implements OldLogger { log(msg: string) { /* ... */ } }

        // app.module.ts
        @Module({
          providers: [
            NewLogger,
            {
              provide: OldLogger, // Khi ai đó inject OldLogger
              useExisting: NewLogger, // Họ sẽ nhận được instance của NewLogger
            }
          ]
        })
        export class AppModule {}
        ```
    * **Non-class-based provider tokens:** Có thể sử dụng string hoặc `Symbol` làm token cho `provide` thay vì tên class. Khi inject, sử dụng `@Inject('TOKEN_NAME')`.

6.  **Module `exports`:**
    * Mặc định, các provider được đăng ký trong một module chỉ có sẵn trong phạm vi module đó.
    * Để cho phép các module khác sử dụng provider từ một module, module đó phải `export` provider đó.
        ```typescript
        // cats.module.ts
        import { Module } from '@nestjs/common';
        import { CatsController } from './cats.controller';
        import { CatsService } from './cats.service';

        @Module({
          controllers: [CatsController],
          providers: [CatsService],
          exports: [CatsService], // Export CatsService để module khác có thể dùng
        })
        export class CatsModule {}

        // app.module.ts
        import { Module } from '@nestjs/common';
        import { CatsModule } from './cats/cats.module'; // Import CatsModule
        // Giờ đây, các component trong AppModule (hoặc các module import CatsModule)
        // có thể inject CatsService.
        @Module({
          imports: [CatsModule],
        })
        export class AppModule {}
        ```

**Code Example (Tạo `CatsService` và inject vào `CatsController`):**

1.  **Tạo `CatsService` bằng Nest CLI:**
    ```bash
    nest generate service cats --no-spec
    ```
    Lệnh này sẽ:
    * Tạo `src/cats/cats.service.ts`.
    * Tự động cập nhật `src/cats/cats.module.ts` để thêm `CatsService` vào mảng `providers`.

2.  **`src/cats/cats.service.ts`:**
    ```typescript
    import { Injectable, NotFoundException } from '@nestjs/common';
    import { CreateCatDto } from './dto/create-cat.dto'; // Import DTO
    import { UpdateCatDto } from './dto/update-cat.dto'; // Tạo DTO này

    export interface Cat { // Định nghĩa interface Cat
      id: number;
      name: string;
      age: number;
      breed: string;
    }

    @Injectable() // Đánh dấu là một provider
    export class CatsService {
      private cats: Cat[] = [ // Dữ liệu giả lập, private để chỉ service này quản lý
        { id: 1, name: 'Miu', age: 2, breed: 'Persian' },
        { id: 2, name: 'Tom', age: 3, breed: 'Siamese' },
      ];
      private nextId = 3;

      findAll(breed?: string): Cat[] {
        if (breed) {
          return this.cats.filter(cat => cat.breed.toLowerCase() === breed.toLowerCase());
        }
        return this.cats;
      }

      findOne(id: number): Cat {
        const cat = this.cats.find(c => c.id === id);
        if (!cat) {
          throw new NotFoundException(`Cat with ID ${id} not found`); // Sử dụng built-in exception
        }
        return cat;
      }

      create(createCatDto: CreateCatDto): Cat {
        const newCat: Cat = {
          id: this.nextId++,
          ...createCatDto,
        };
        this.cats.push(newCat);
        return newCat;
      }

      update(id: number, updateCatDto: UpdateCatDto): Cat {
        const cat = this.findOne(id); // Tái sử dụng findOne để kiểm tra tồn tại và lấy cat
        const catIndex = this.cats.findIndex(c => c.id === id);
        // Cập nhật các trường được cung cấp trong DTO
        const updatedCat = { ...cat, ...updateCatDto };
        this.cats[catIndex] = updatedCat;
        return updatedCat;
      }

      remove(id: number): void {
        const catIndex = this.cats.findIndex(c => c.id === id);
        if (catIndex === -1) {
          throw new NotFoundException(`Cat with ID ${id} not found for deletion`);
        }
        this.cats.splice(catIndex, 1);
      }
    }
    ```
    * Tạo `src/cats/dto/update-cat.dto.ts`:
        ```typescript
        import { PartialType } from '@nestjs/mapped-types'; // Hoặc @nestjs/swagger
        import { CreateCatDto } from './create-cat.dto';

        // PartialType làm cho tất cả các thuộc tính của CreateCatDto trở thành optional
        export class UpdateCatDto extends PartialType(CreateCatDto) {}
        ```
        (Cần cài đặt: `npm install @nestjs/mapped-types`)

3.  **Cập nhật `src/cats/cats.controller.ts` để inject và sử dụng `CatsService`:**
    ```typescript
    import { Controller, Get, Post, Body, Param, Query, Put, Delete, HttpCode, ParseIntPipe } from '@nestjs/common';
    import { CreateCatDto } from './dto/create-cat.dto';
    import { UpdateCatDto } from './dto/update-cat.dto';
    import { CatsService, Cat } from './cats.service'; // Import CatsService và interface Cat

    @Controller('cats')
    export class CatsController {
      // Constructor injection
      constructor(private readonly catsService: CatsService) {}

      @Get()
      findAll(@Query('breed') breed?: string): Cat[] {
        return this.catsService.findAll(breed);
      }

      // ParseIntPipe sẽ chuyển đổi string 'id' thành number và validate
      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id: number): Cat {
        return this.catsService.findOne(id);
      }

      @Post()
      @HttpCode(201)
      create(@Body() createCatDto: CreateCatDto): Cat {
        return this.catsService.create(createCatDto);
      }

      @Put(':id')
      update(@Param('id', ParseIntPipe) id: number, @Body() updateCatDto: UpdateCatDto): Cat {
        return this.catsService.update(id, updateCatDto);
      }

      @Delete(':id')
      @HttpCode(204)
      remove(@Param('id', ParseIntPipe) id: number): void {
        this.catsService.remove(id);
      }
    }
    ```
    * Lưu ý sử dụng `ParseIntPipe` để chuyển đổi và validate `id` từ string sang number.

4.  **Cập nhật `src/cats/cats.module.ts` (Nest CLI thường tự làm):**
    ```typescript
    import { Module } from '@nestjs/common';
    import { CatsController } from './cats.controller';
    import { CatsService } from './cats.service'; // Đảm bảo đã import

    @Module({
      controllers: [CatsController],
      providers: [CatsService], // Đảm bảo CatsService đã được thêm vào providers
      exports: [CatsService] // Export nếu muốn module khác sử dụng
    })
    export class CatsModule {}
    ```

**Bài tập thực hành:**

1.  **Tạo `ProductsService`:**
    * **Yêu cầu:** Trong `ProductsModule` đã tạo ở Chapter 2, sử dụng Nest CLI để tạo `ProductsService`.
    * **Lệnh:** `nest g service products --no-spec` (chọn products module).
2.  **Chuyển logic nghiệp vụ sang `ProductsService`:**
    * **Yêu cầu:** Di chuyển toàn bộ logic xử lý dữ liệu sản phẩm (mảng dữ liệu giả lập, các hàm thêm, sửa, xóa, tìm kiếm) từ `ProductsController` sang `ProductsService`.
    * `ProductsService` nên có các method tương ứng: `findAll()`, `findOne(id: number)`, `create(createProductDto: CreateProductDto)`, `update(id: number, updateProductDto: UpdateProductDto)`, `remove(id: number)`.
    * Sử dụng `NotFoundException` trong service khi không tìm thấy sản phẩm.
3.  **Inject `ProductsService` vào `ProductsController`:**
    * **Yêu cầu:** Sử dụng constructor injection để inject `ProductsService` vào `ProductsController`.
    * Gọi các method tương ứng của `ProductsService` từ các action handler trong `ProductsController`.
    * Sử dụng `ParseIntPipe` cho các route parameter `productId`.
4.  **Tạo một `ConfigService` đơn giản sử dụng `useValue`:**
    * **Yêu cầu:** Trong `AppModule`, tạo một custom provider có token là `'APP_CONFIG'` và `useValue` để cung cấp một object cấu hình đơn giản, ví dụ: `{ appName: 'My Nest Store', version: '1.0.0', port: 3001 }`.
    * Inject provider này vào `AppService` (hoặc `ProductsService`) và log ra `appName` khi service được khởi tạo (trong constructor của service).
5.  **Tạo `LoggerService` với scope `REQUEST` (Nâng cao):**
    * **Yêu cầu:** Tạo một `LoggerService` đơn giản (ví dụ: có method `log(context: string, message: string)`).
    * Cấu hình `LoggerService` này với `scope: Scope.REQUEST`.
    * Trong constructor của `LoggerService`, inject `REQUEST` object (sử dụng `@Inject(REQUEST)`) và log ra một ID duy nhất cho mỗi request (ví dụ: `req.id` nếu bạn dùng middleware để gán ID, hoặc một timestamp).
    * Inject `LoggerService` vào `ProductsController`. Mỗi khi một endpoint của `ProductsController` được gọi, hãy gọi method `log` của `LoggerService` để ghi lại thông tin về request đó. Quan sát xem ID của logger có thay đổi với mỗi request không.
    * (Cần import `REQUEST` từ `@nestjs/core` hoặc `@nestjs/common` tùy phiên bản).

