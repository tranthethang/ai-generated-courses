## Chapter 5: Pipes và Validation

**Tên Chapter học:** Pipes và Validation

**Mục tiêu bài học:**

* **Hiểu rõ về Pipes:** Nắm vững vai trò của Pipes trong NestJS như một cơ chế để chuyển đổi (transformation) và xác thực (validation) dữ liệu đầu vào (route parameters, query parameters, request body).
* **Sử dụng Built-in Pipes:**
    * Thành thạo cách sử dụng các pipes có sẵn của NestJS:
        * `ValidationPipe`: Tự động thực thi validation cho DTOs sử dụng `class-validator`.
        * `ParseIntPipe`, `ParseFloatPipe`, `ParseBoolPipe`, `ParseArrayPipe`, `ParseUUIDPipe`: Chuyển đổi chuỗi đầu vào thành kiểu dữ liệu mong muốn và báo lỗi nếu không hợp lệ.
        * `DefaultValuePipe`: Cung cấp giá trị mặc định nếu tham số không được truyền.
* **Validation với `class-validator` và `class-transformer`:**
    * Sử dụng thư viện `class-validator` để thêm các validation decorator (ví dụ: `@IsString()`, `@IsInt()`, `@IsEmail()`, `@MinLength()`, `@IsNotEmpty()`) vào các thuộc tính của DTOs.
    * Hiểu vai trò của `class-transformer` trong việc chuyển đổi plain JavaScript object thành instance của DTO class (thường được `ValidationPipe` sử dụng ngầm).
* **Áp dụng Pipes:** Biết cách áp dụng pipes ở các cấp độ khác nhau:
    * Parameter-scoped: Áp dụng cho một tham số cụ thể của route handler.
    * Handler-scoped: Áp dụng cho tất cả tham số của một route handler cụ thể (sử dụng `@UsePipes()`).
    * Controller-scoped: Áp dụng cho tất cả handler trong một controller (sử dụng `@UsePipes()` trên class controller).
    * Global-scoped: Áp dụng cho tất cả handler trong toàn bộ ứng dụng (sử dụng `app.useGlobalPipes()`).
* **Tạo Custom Pipes:** Học cách tạo ra các pipes tùy chỉnh bằng cách implement interface `PipeTransform` để đáp ứng các nhu cầu chuyển đổi hoặc xác thực đặc thù.

**Tóm tắt lý thuyết:**

1.  **Pipes là gì?**
    * Pipes là các class được đánh dấu bằng `@Injectable()` decorator và phải implement interface `PipeTransform<T, R>`.
    * Chúng có một method duy nhất là `transform(value: T, metadata: ArgumentMetadata): R | Promise<R>`.
    * `value`: Giá trị của tham số đầu vào đang được xử lý.
    * `metadata`: Một object chứa thông tin về tham số đang được xử lý (ví dụ: `metatype`, `type` ('body', 'query', 'param', 'custom'), `data` (tên decorator nếu có)).
    * Pipes được thực thi **trước khi** route handler được gọi.
    * **Hai mục đích chính của Pipes:**
        * **Transformation (Chuyển đổi):** Chuyển đổi dữ liệu đầu vào từ dạng này sang dạng khác (ví dụ: từ string sang number).
        * **Validation (Xác thực):** Kiểm tra xem dữ liệu đầu vào có hợp lệ hay không. Nếu không hợp lệ, pipe sẽ ném một exception (thường là `BadRequestException`).

2.  **Built-in Pipes:**
    * NestJS cung cấp một số pipes hữu ích có sẵn:
    * **`ValidationPipe`:**
        * Pipe mạnh mẽ nhất, thường được sử dụng để tự động validate DTOs.
        * Nó sử dụng hai thư viện mạnh mẽ: `class-validator` để định nghĩa các rule validation bằng decorators, và `class-transformer` để chuyển đổi plain object (từ JSON body) thành typed DTO instance.
        * Cần cài đặt: `npm install --save class-validator class-transformer`.
        * Có nhiều options cấu hình: `whitelist`, `forbidNonWhitelisted`, `transform`, `disableErrorMessages`, `exceptionFactory`, etc.
            * `whitelist: true`: Tự động loại bỏ các thuộc tính không được định nghĩa trong DTO.
            * `forbidNonWhitelisted: true`: Ném lỗi nếu request body chứa các thuộc tính không được định nghĩa trong DTO.
            * `transform: true`: Tự động chuyển đổi payload thành instance của DTO (quan trọng để các default values và type coercion hoạt động).
    * **`ParseIntPipe`:** Kiểm tra xem giá trị có phải là một chuỗi số nguyên hợp lệ không và chuyển đổi nó thành `number`.
    * **`ParseFloatPipe`:** Tương tự `ParseIntPipe` nhưng cho số thực.
    * **`ParseBoolPipe`:** Kiểm tra xem giá trị có phải là một chuỗi boolean ("true", "false") hợp lệ không và chuyển đổi nó thành `boolean`.
    * **`ParseArrayPipe`:** Kiểm tra xem giá trị có phải là mảng không và có thể tùy chọn validate từng item trong mảng.
    * **`ParseUUIDPipe`:** Kiểm tra xem giá trị có phải là một chuỗi UUID hợp lệ không. Có thể chỉ định phiên bản UUID.
    * **`DefaultValuePipe`:** Cung cấp một giá trị mặc định nếu tham số không được truyền hoặc là `undefined`. Pipe này phải được đặt trước các pipe parse khác.

3.  **Validation với `class-validator` và `class-transformer`:**
    * **`class-validator`:** Cho phép bạn thêm các validation decorator trực tiếp vào các thuộc tính của DTO class.
        ```typescript
        // src/cats/dto/create-cat.dto.ts
        import { IsString, IsInt, Min, Max, IsNotEmpty, Length, IsOptional, IsEnum } from 'class-validator';

        export enum CatBreed {
          PERSIAN = 'Persian',
          SIAMESE = 'Siamese',
          BENGAL = 'Bengal',
          OTHER = 'Other',
        }

        export class CreateCatDto {
          @IsString()
          @IsNotEmpty({ message: 'Name cannot be empty' }) // Custom message
          @Length(3, 50) // Min 3, Max 50 ký tự
          name: string;

          @IsInt()
          @Min(0)
          @Max(25)
          age: number;

          @IsEnum(CatBreed)
          @IsNotEmpty()
          breed: CatBreed;

          @IsString()
          @IsOptional() // Thuộc tính này có thể có hoặc không
          color?: string;
        }
        ```
        Một số decorators phổ biến: `@IsString()`, `@IsNumber()`, `@IsInt()`, `@IsBoolean()`, `@IsDate()`, `@IsEmail()`, `@IsUrl()`, `@IsNotEmpty()`, `@IsOptional()`, `@MinLength()`, `@MaxLength()`, `@Length()`, `@Min()`, `@Max()`, `@IsEnum()`, `@IsArray()`, `@ValidateNested()`, `@ArrayMinSize()`, `@ArrayMaxSize()`, etc.
    * **`class-transformer`:**
        * `ValidationPipe` với option `transform: true` sẽ sử dụng `class-transformer` để:
            * Chuyển đổi payload JSON (plain object) thành một instance thực sự của DTO class. Điều này quan trọng để các method của DTO (nếu có) hoặc các default value được khởi tạo.
            * Thực hiện type coercion ngầm (ví dụ: nếu DTO mong đợi `number` nhưng payload gửi string "123", nó có thể cố gắng chuyển đổi).

4.  **Cách áp dụng Pipes:**
    * **Parameter-scoped (cho một tham số cụ thể):**
        ```typescript
        @Get(':id')
        findOne(@Param('id', ParseIntPipe) id: number) { /* ... */ }

        @Post()
        create(@Body(ValidationPipe) createCatDto: CreateCatDto) { /* ... */ }
        // Hoặc nếu ValidationPipe được dùng global, thì không cần ở đây
        ```
    * **Handler-scoped (cho một route handler):**
        ```typescript
        @Post('special')
        @UsePipes(new ValidationPipe({ groups: ['special'] })) // Áp dụng ValidationPipe với options
        createSpecial(@Body() createDto: CreateSpecialDto) { /* ... */ }
        ```
    * **Controller-scoped (cho tất cả handler trong controller):**
        ```typescript
        @Controller('cats')
        @UsePipes(ValidationPipe) // Hoặc new ValidationPipe({ whitelist: true })
        export class CatsController { /* ... */ }
        ```
    * **Global-scoped (cho toàn bộ ứng dụng):**
        * Trong `src/main.ts`:
        ```typescript
        // src/main.ts
        import { NestFactory } from '@nestjs/core';
        import { AppModule } from './app.module';
        import { ValidationPipe } from '@nestjs/common';

        async function bootstrap() {
          const app = await NestFactory.create(AppModule);
          app.useGlobalPipes(
            new ValidationPipe({
              whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
              forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính thừa
              transform: true, // Tự động transform payload thành DTO instance
              transformOptions: {
                enableImplicitConversion: true, // Cho phép chuyển đổi kiểu ngầm (ví dụ string query param thành number)
              },
            }),
          );
          await app.listen(3000);
        }
        bootstrap();
        ```
        Khi `ValidationPipe` được áp dụng global, bạn không cần phải thêm nó vào từng controller hoặc handler nữa (trừ khi muốn override với options khác).

5.  **Tạo Custom Pipes:**
    * Implement interface `PipeTransform`.
    * Method `transform(value, metadata)` phải trả về giá trị đã được chuyển đổi hoặc ném exception nếu validation thất bại.
    * Ví dụ: Một pipe để parse một chuỗi query param dạng "item1,item2,item3" thành mảng `['item1', 'item2', 'item3']`.
        ```typescript
        // src/common/pipes/parse-comma-separated-array.pipe.ts
        import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

        @Injectable()
        export class ParseCommaSeparatedArrayPipe implements PipeTransform<string, string[]> {
          transform(value: string, metadata: ArgumentMetadata): string[] {
            if (value === undefined || value === null) {
              return undefined; // Hoặc trả về mảng rỗng, hoặc ném lỗi tùy logic
            }
            if (typeof value !== 'string') {
              throw new BadRequestException(`Validation failed (${metadata.type} ${metadata.data} must be a comma-separated string)`);
            }
            const array = value.split(',').map(item => item.trim()).filter(item => item.length > 0);
            if (array.length === 0 && value.length > 0) { // Nếu chuỗi không rỗng nhưng không parse ra được item nào
                throw new BadRequestException(`Validation failed (${metadata.type} ${metadata.data} must contain valid items)`);
            }
            return array;
          }
        }
        ```
        Sử dụng:
        ```typescript
        @Get('filter')
        filterByTags(@Query('tags', ParseCommaSeparatedArrayPipe) tags?: string[]) {
          // tags ở đây sẽ là string[] hoặc undefined
          return { receivedTags: tags };
        }
        // Request: /filter?tags=nest,typescript,node
        // tags sẽ là ['nest', 'typescript', 'node']
        ```

**Code Example:**

1.  **Cài đặt `class-validator` và `class-transformer`:**
    ```bash
    npm install --save class-validator class-transformer
    ```

2.  **Cập nhật `CreateCatDto` với validation decorators:**
    ```typescript
    // src/cats/dto/create-cat.dto.ts
    import { IsString, IsInt, Min, Max, IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator';

    export enum CatBreed {
      PERSIAN = 'Persian',
      SIAMESE = 'Siamese',
      BENGAL = 'Bengal',
      MAINE_COON = 'Maine Coon',
      OTHER = 'Other',
    }

    export class CreateCatDto {
      @IsString({ message: 'Name must be a string' })
      @IsNotEmpty({ message: 'Name should not be empty' })
      @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
      name: string;

      @IsInt({ message: 'Age must be an integer' })
      @Min(0, { message: 'Age must be at least 0' })
      @Max(30, { message: 'Age must be at most 30' })
      age: number;

      @IsEnum(CatBreed, { message: 'Breed must be a valid enum value' })
      @IsNotEmpty({ message: 'Breed should not be empty' })
      breed: CatBreed;

      @IsString()
      @IsOptional()
      @Length(3, 100)
      favoriteToy?: string;
    }
    ```

3.  **Cập nhật `UpdateCatDto` (sử dụng `PartialType` và các decorator nếu cần override):**
    * `PartialType` từ `@nestjs/mapped-types` (hoặc `@nestjs/swagger`) sẽ làm tất cả các thuộc tính của `CreateCatDto` thành optional và kế thừa các validation decorators.
    * Nếu bạn muốn validation khác cho update, bạn có thể định nghĩa lại hoặc thêm decorator trong `UpdateCatDto`.
    ```typescript
    // src/cats/dto/update-cat.dto.ts
    import { PartialType } from '@nestjs/mapped-types';
    import { CreateCatDto } from './create-cat.dto';
    import { IsString, IsOptional, Length } from 'class-validator';


    export class UpdateCatDto extends PartialType(CreateCatDto) {
      // Ví dụ, nếu muốn có validation riêng cho 'favoriteToy' khi update
      @IsString()
      @IsOptional()
      @Length(1, 50) // Có thể khác với CreateCatDto
      favoriteToy?: string;
    }
    ```

4.  **Áp dụng `ValidationPipe` global trong `main.ts`:**
    ```typescript
    // src/main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true, // Quan trọng cho query/param pipes
          },
          // disableErrorMessages: true, // Không hiển thị lỗi chi tiết trong production
        }),
      );
      await app.listen(3000);
      console.log(`Application is running on: ${await app.getUrl()}`);
    }
    bootstrap();
    ```

5.  **Sử dụng các Parse*Pipes trong `CatsController`:**
    ```typescript
    // src/cats/cats.controller.ts
    import { Controller, Get, Post, Body, Param, Query, Put, Delete, HttpCode, ParseIntPipe, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
    // ... imports khác ...

    @Controller('cats')
    // ValidationPipe đã được áp dụng global, không cần @UsePipes ở đây nữa
    export class CatsController {
      constructor(private readonly catsService: CatsService) {}

      // Ví dụ sử dụng DefaultValuePipe và ParseBoolPipe cho query param
      @Get()
      findAll(
        @Query('breed') breed?: string,
        @Query('isActive', new DefaultValuePipe(true), ParseBoolPipe) isActive?: boolean,
        // DefaultValuePipe phải đứng trước ParseIntPipe
        @Query('minAge', new DefaultValuePipe(0), ParseIntPipe) minAge?: number
      ): Promise<Cat[]> { // Giả sử service trả về Promise<Cat[]>
        console.log(`Filtering cats: breed=${breed}, isActive=${isActive}, minAge=${minAge}`);
        return this.catsService.findAllAdvanced({ breed, isActive, minAge }); // Cần cập nhật service
      }

      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id: number): Promise<Cat> { // ParseIntPipe vẫn cần thiết ở đây
        return this.catsService.findOne(id);
      }

      @Post()
      @HttpCode(201)
      create(@Body() createCatDto: CreateCatDto): Promise<Cat> { // ValidationPipe global sẽ xử lý createCatDto
        return this.catsService.create(createCatDto);
      }

      @Put(':id')
      update(@Param('id', ParseIntPipe) id: number, @Body() updateCatDto: UpdateCatDto): Promise<Cat> {
        return this.catsService.update(id, updateCatDto);
      }
      // ...
    }
    ```
    Cần cập nhật `CatsService` để xử lý `findAllAdvanced`.

**Bài tập thực hành:**

1.  **Cài đặt `class-validator` và `class-transformer`:**
    * **Yêu cầu:** Nếu chưa cài, hãy chạy `npm install --save class-validator class-transformer`.
2.  **Áp dụng Validation cho `Product` DTOs:**
    * **Yêu cầu:** Mở `src/products/dto/create-product.dto.ts` và `src/products/dto/update-product.dto.ts`.
    * Thêm các validation decorator (`class-validator`) phù hợp cho các thuộc tính:
        * `name`: Phải là string, không được rỗng, độ dài từ 3 đến 100 ký tự.
        * `description`: Phải là string, tùy chọn (có thể không có). Nếu có, độ dài tối đa 500 ký tự.
        * `price`: Phải là number, không âm (>= 0).
        * `stock`: Phải là integer, không âm.
    * Đảm bảo `UpdateProductDto` sử dụng `PartialType` và kế thừa/override validation nếu cần.
3.  **Cấu hình `ValidationPipe` Global:**
    * **Yêu cầu:** Trong file `src/main.ts`, sử dụng `app.useGlobalPipes()` để áp dụng `ValidationPipe` cho toàn bộ ứng dụng.
    * Cấu hình pipe với các options: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`, và `transformOptions: { enableImplicitConversion: true }`.
4.  **Sử dụng `ParseIntPipe` và `DefaultValuePipe`:**
    * **Yêu cầu:** Trong `ProductsController`:
        * Sử dụng `ParseIntPipe` cho route parameter `:productId` ở các endpoint `findOne`, `update`, `remove`.
        * Trong endpoint `GET /products`, thêm các query parameter tùy chọn:
            * `limit` (số lượng sản phẩm mỗi trang): Dùng `DefaultValuePipe` để đặt giá trị mặc định là 10, sau đó dùng `ParseIntPipe`.
            * `offset` (vị trí bắt đầu lấy sản phẩm): Dùng `DefaultValuePipe` để đặt giá trị mặc định là 0, sau đó dùng `ParseIntPipe`.
            * `minPrice`: Dùng `ParseFloatPipe` (hoặc `ParseIntPipe` nếu giá là số nguyên), có thể là optional (không cần `DefaultValuePipe` nếu `undefined` là chấp nhận được).
5.  **Tạo Custom Pipe `ValidateProductStatusPipe`:**
    * **Yêu cầu:** Giả sử sản phẩm có một trường `status` (ví dụ: 'available', 'out_of_stock', 'discontinued').
    * Tạo một custom pipe tên là `ValidateProductStatusPipe`. Pipe này nhận một string đầu vào và kiểm tra xem nó có phải là một trong các giá trị status hợp lệ không. Nếu không, ném `BadRequestException`. Nếu hợp lệ, trả về chính giá trị đó.
    * Áp dụng pipe này cho một query parameter `status` trong endpoint `GET /products` để lọc sản phẩm theo status.
    * **Gợi ý:**
        ```typescript
        // src/products/pipes/validate-product-status.pipe.ts
        import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

        export enum ProductStatus {
          AVAILABLE = 'available',
          OUT_OF_STOCK = 'out_of_stock',
          DISCONTINUED = 'discontinued',
        }

        @Injectable()
        export class ValidateProductStatusPipe implements PipeTransform<string, ProductStatus> {
          readonly allowedStatuses = Object.values(ProductStatus);

          transform(value: string, metadata: ArgumentMetadata): ProductStatus {
            if (!value) { // Nếu status là optional và không được cung cấp
              return undefined;
            }
            value = value.toLowerCase() as ProductStatus;
            if (!this.allowedStatuses.includes(value)) {
              throw new BadRequestException(`Invalid status "${value}". Allowed statuses are: ${this.allowedStatuses.join(', ')}`);
            }
            return value;
          }
        }
        ```
        Sử dụng trong controller: `@Query('status', ValidateProductStatusPipe) status?: ProductStatus`
