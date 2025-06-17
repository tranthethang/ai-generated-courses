# Chapter 7: Configuration và Quản lý Môi trường

**Tên Chapter học:** Configuration và Quản lý Môi trường

**Mục tiêu bài học:**

* **Hiểu tầm quan trọng của quản lý cấu hình:** Nhận thức rõ sự cần thiết của việc tách biệt cấu hình khỏi code, quản lý cấu hình cho các môi trường khác nhau (development, staging, production) một cách hiệu quả.
* **Sử dụng `@nestjs/config`:**
    * Thành thạo module `@nestjs/config` để tải và truy cập các biến môi trường từ file `.env`.
    * Biết cách sử dụng `ConfigService` để lấy các giá trị cấu hình một cách an toàn kiểu (type-safe).
* **Quản lý file `.env`:**
    * Hiểu cách sử dụng các file `.env` khác nhau (ví dụ: `.env.development`, `.env.production`) và cách NestJS ưu tiên tải chúng.
    * Biết cách sử dụng các tùy chọn như `ignoreEnvFile`, `envFilePath`.
* **Custom Configuration Files:**
    * Học cách tạo các file cấu hình TypeScript/JavaScript riêng biệt để nhóm các cấu hình liên quan (ví dụ: `database.config.ts`, `jwt.config.ts`).
    * Sử dụng hàm `registerAs` để đăng ký các namespace cấu hình, giúp truy cập dễ dàng và có tổ chức.
* **Validation Cấu hình:**
    * Áp dụng các schema validation (sử dụng Joi hoặc `class-validator`) để đảm bảo rằng tất cả các biến môi trường/cấu hình cần thiết được cung cấp và có định dạng đúng khi ứng dụng khởi động.
* **Truy cập Cấu hình Type-Safe:** Đảm bảo rằng việc truy cập các giá trị cấu hình là an toàn kiểu, tận dụng lợi thế của TypeScript.

**Tóm tắt lý thuyết:**

1.  **Tại sao cần quản lý cấu hình?**
    * **Tránh hardcode:** Không nhúng các giá trị nhạy cảm (API keys, database credentials) hoặc các giá trị thay đổi theo môi trường (ports, URLs) trực tiếp vào code.
    * **Linh hoạt theo môi trường:** Dễ dàng thay đổi cấu hình khi deploy ứng dụng lên các môi trường khác nhau (development, testing, staging, production).
    * **Bảo mật:** Giữ các thông tin nhạy cảm tách biệt khỏi codebase, dễ dàng quản lý truy cập.
    * **Dễ bảo trì:** Cấu hình tập trung giúp việc cập nhật và quản lý trở nên đơn giản hơn.

2.  **Module `@nestjs/config`:**
    * Là giải pháp chính thức của NestJS để quản lý cấu hình.
    * **Cài đặt:** `npm install --save @nestjs/config`
    * **Cách hoạt động:**
        * Tải các biến môi trường từ file `.env` ở thư mục gốc của dự án.
        * Ưu tiên các biến môi trường đã được set ở cấp hệ điều hành so với file `.env`.
        * Cung cấp `ConfigService` để truy cập các biến cấu hình.
    * **Cấu hình cơ bản trong `AppModule`:**
        ```typescript
        // app.module.ts
        import { Module } from '@nestjs/common';
        import { ConfigModule } from '@nestjs/config';
        // ...
        @Module({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true, // Làm cho ConfigModule có sẵn toàn cục, không cần import ở module khác
              // envFilePath: '.development.env', // Chỉ định file .env cụ thể
              // ignoreEnvFile: process.env.NODE_ENV === 'production', // Bỏ qua file .env nếu là production
            }),
            // ... các module khác
          ],
          // ...
        })
        export class AppModule {}
        ```
    * **Truy cập cấu hình bằng `ConfigService`:**
        ```typescript
        // app.service.ts
        import { Injectable } from '@nestjs/common';
        import { ConfigService } from '@nestjs/config';

        @Injectable()
        export class AppService {
          private readonly port: number;
          constructor(private configService: ConfigService) {
            // Lấy giá trị với kiểu dữ liệu mong muốn
            this.port = this.configService.get<number>('PORT', 3000); // 3000 là giá trị mặc định nếu PORT không tìm thấy
            console.log(`Application Port from config: ${this.port}`);
            console.log(`Database URL: ${this.configService.get<string>('DATABASE_URL')}`);
          }
          // ...
        }
        ```

3.  **File `.env`:**
    * Tạo file `.env` ở thư mục gốc của dự án:
        ```env
        PORT=3001
        DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
        API_KEY="your_secret_api_key"
        NODE_ENV="development"
        JWT_SECRET="a_very_long_and_secure_jwt_secret_key"
        JWT_EXPIRES_IN="3600s" # 1 giờ
        ```
    * **Thứ tự ưu tiên của file `.env`:** NestJS sẽ tìm các file `.env` theo thứ tự: `.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, `.env.local`, `.env`. File đầu tiên tìm thấy sẽ được sử dụng.
    * Nên thêm `.env` và các file `.env.*.local` vào `.gitignore`. Chỉ commit các file `.env.example` hoặc các file `.env` không chứa thông tin nhạy cảm.

4.  **Custom Configuration Files (Typed Configuration):**
    * Giúp tổ chức cấu hình tốt hơn, đặc biệt cho các cấu hình phức tạp, và cung cấp type safety.
    * Sử dụng hàm `registerAs` để tạo các "namespace" cho cấu hình.
    * **Ví dụ: `src/config/database.config.ts`**
        ```typescript
        // src/config/database.config.ts
        import { registerAs } from '@nestjs/config';

        export default registerAs('database', () => ({
          type: process.env.DATABASE_TYPE || 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          synchronize: process.env.NODE_ENV !== 'production', // Hoặc false
        }));
        ```
    * **Ví dụ: `src/config/jwt.config.ts`**
        ```typescript
        // src/config/jwt.config.ts
        import { registerAs } from '@nestjs/config';

        export default registerAs('jwt', () => ({
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        }));
        ```
    * **Load custom config files trong `ConfigModule`:**
        ```typescript
        // app.module.ts
        import { Module } from '@nestjs/common';
        import { ConfigModule } from '@nestjs/config';
        import databaseConfig from './config/database.config'; // Import
        import jwtConfig from './config/jwt.config'; // Import

        @Module({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true,
              load: [databaseConfig, jwtConfig], // Load các file config đã đăng ký
            }),
            // ...
          ],
        })
        export class AppModule {}
        ```
    * **Truy cập typed configuration:**
        ```typescript
        // some.service.ts
        import { Injectable } from '@nestjs/common';
        import { ConfigService } from '@nestjs/config';

        @Injectable()
        export class SomeService {
          constructor(private configService: ConfigService) {
            const dbHost = this.configService.get<string>('database.host');
            const jwtSecret = this.configService.get<string>('jwt.secret');
            console.log(`Database Host: ${dbHost}, JWT Secret: ${jwtSecret}`);

            // Lấy toàn bộ object config cho một namespace
            const dbConfig = this.configService.get('database');
            console.log('DB Port from object:', dbConfig.port);
          }
        }
        ```
    * **Injecting namespaced configuration (type-safe):**
        Bạn có thể inject trực tiếp một phần của configuration đã được typed.
        ```typescript
        // src/config/app.config.ts
        import { registerAs } from '@nestjs/config';

        export interface AppConfig {
          port: number;
          env: string;
        }

        export default registerAs('app', (): AppConfig => ({
          port: parseInt(process.env.PORT, 10) || 3000,
          env: process.env.NODE_ENV || 'development',
        }));

        // some.service.ts
        import { Inject, Injectable } from '@nestjs/common';
        import { ConfigType } from '@nestjs/config';
        import appConfig, { AppConfig } from '../config/app.config'; // Import cả default và type

        @Injectable()
        export class AnotherService {
          constructor(
            @Inject(appConfig.KEY) // appConfig.KEY là 'app'
            private readonly currentAppConfig: ConfigType<typeof appConfig>, // ConfigType<typeof appConfig> sẽ là AppConfig
          ) {
            console.log('Injected App Port:', this.currentAppConfig.port);
            console.log('Injected App Env:', this.currentAppConfig.env);
          }
        }
        ```
        Để inject `appConfig.KEY`, `AppConfigModule` phải được import và `appConfig` phải được load.

5.  **Validation Cấu hình:**
    * Đảm bảo các biến môi trường cần thiết được cung cấp và đúng định dạng.
    * Sử dụng Joi (thư viện validation phổ biến) hoặc `class-validator`.
    * **Cài đặt Joi:** `npm install --save joi`
    * **Cấu hình validation schema trong `ConfigModule`:**
        ```typescript
        // app.module.ts
        import { Module } from '@nestjs/common';
        import { ConfigModule } from '@nestjs/config';
        import * as Joi from 'joi'; // Import Joi
        import databaseConfig from './config/database.config';
        import jwtConfig from './config/jwt.config';

        @Module({
          imports: [
            ConfigModule.forRoot({
              isGlobal: true,
              load: [databaseConfig, jwtConfig],
              validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                  .valid('development', 'production', 'test', 'provision')
                  .default('development'),
                PORT: Joi.number().default(3000),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().default(5432),
                DATABASE_USER: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required().min(32), // Yêu cầu secret dài ít nhất 32 ký tự
                JWT_EXPIRES_IN: Joi.string().default('1h'),
              }),
              validationOptions: {
                allowUnknown: true, // Cho phép các biến môi trường không được định nghĩa trong schema
                abortEarly: false, // Hiển thị tất cả các lỗi validation, không dừng ở lỗi đầu tiên
              },
            }),
            // ...
          ],
        })
        export class AppModule {}
        ```
        Nếu validation thất bại, ứng dụng sẽ không khởi động và báo lỗi.

**Code Example (Cập nhật ứng dụng với `@nestjs/config`):**

1.  **Cài đặt:** `npm install @nestjs/config joi`

2.  **Tạo file `.env` ở thư mục gốc:**
    ```env
    # Application
    NODE_ENV=development
    PORT=3001

    # Database (PostgreSQL example)
    DATABASE_TYPE=postgres
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=your_db_user
    DATABASE_PASSWORD=your_db_password
    DATABASE_NAME=your_db_name

    # JWT
    JWT_SECRET="ThisIsMySuperLongAndVerySecureSecretKeyForJWTGenerationAtLeast32Chars"
    JWT_EXPIRES_IN="3600s"
    ```

3.  **Tạo các file cấu hình custom:**
    * `src/config/app.config.ts`:
      ```typescript
      import { registerAs } from '@nestjs/config';
      export default registerAs('application', () => ({
        nodeEnv: process.env.NODE_ENV,
        port: parseInt(process.env.PORT, 10) || 3001,
      }));
      ```
    * `src/config/database.config.ts`:
      ```typescript
      import { registerAs } from '@nestjs/config';
      export default registerAs('database', () => ({
        type: process.env.DATABASE_TYPE,
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
        synchronize: process.env.NODE_ENV !== 'production',
      }));
      ```
    * `src/config/jwt.config.ts`:
      ```typescript
      import { registerAs } from '@nestjs/config';
      export default registerAs('jwt', () => ({
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
      }));
      ```

4.  **Cập nhật `AppModule` (`src/app.module.ts`):**
    ```typescript
    import { Module } from '@nestjs/common';
    import { ConfigModule, ConfigService } from '@nestjs/config';
    import * as Joi from 'joi';
    import { TypeOrmModule } from '@nestjs/typeorm'; // Nếu dùng TypeORM
    // import { MongooseModule } from '@nestjs/mongoose'; // Nếu dùng Mongoose
    import appConfig from './config/app.config';
    import databaseConfig from './config/database.config';
    import jwtConfig from './config/jwt.config';
    import { ProductsModule } from './products/products.module'; // Ví dụ
    import { AuthModule } from './auth/auth.module'; // Ví dụ

    @Module({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig, databaseConfig, jwtConfig],
          validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
            PORT: Joi.number().default(3001),
            DATABASE_TYPE: Joi.string().default('postgres'),
            DATABASE_HOST: Joi.string().required(),
            DATABASE_PORT: Joi.number().required(),
            DATABASE_USER: Joi.string().required(),
            DATABASE_PASSWORD: Joi.string().required(),
            DATABASE_NAME: Joi.string().required(),
            JWT_SECRET: Joi.string().required().min(32),
            JWT_EXPIRES_IN: Joi.string().required(),
          }),
          validationOptions: {
            abortEarly: false,
          },
        }),
        // Cấu hình TypeOrmModule hoặc MongooseModule sử dụng ConfigService
        TypeOrmModule.forRootAsync({ // Ví dụ cho TypeORM
          imports: [ConfigModule], // Cần thiết nếu ConfigModule không isGlobal
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: configService.get<any>('database.type'),
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.name'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Hoặc import trực tiếp
            synchronize: configService.get<boolean>('database.synchronize'),
            // autoLoadEntities: true, // Cân nhắc dùng nếu entities rõ ràng
          }),
        }),
        /* // Ví dụ cho Mongoose
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri: `mongodb://${configService.get<string>('database.username')}:${configService.get<string>('database.password')}@${configService.get<string>('database.host')}:${configService.get<number>('database.port')}/${configService.get<string>('database.name')}?authSource=admin`,
            // Các options khác nếu cần
          }),
        }),
        */
        ProductsModule,
        AuthModule,
      ],
      // ... controllers, providers
    })
    export class AppModule {}
    ```

5.  **Cập nhật `main.ts` để sử dụng port từ config:**
    ```typescript
    // src/main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ValidationPipe } from '@nestjs/common';
    import { ConfigService } from '@nestjs/config'; // Import ConfigService

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);
      const configService = app.get(ConfigService); // Lấy ConfigService instance
      const port = configService.get<number>('application.port'); // Sử dụng namespace 'application'

      app.useGlobalPipes(new ValidationPipe({ /* ... options ... */ }));
      // ... các cài đặt global khác ...

      await app.listen(port);
      console.log(`Application is running on: http://localhost:${port}`);
      console.log(`Current NODE_ENV: ${configService.get<string>('application.nodeEnv')}`);
    }
    bootstrap();
    ```

6.  **Cập nhật `AuthModule` để sử dụng JWT config từ `ConfigService` (đã làm ở Chapter 6, nhưng đảm bảo nó đúng):**
    ```typescript
    // src/auth/auth.module.ts
    // ...
    JwtModule.registerAsync({
      imports: [ConfigModule], // Quan trọng nếu AuthModule không phải global
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
    }),
    // ...
    ```
    Và trong `JwtStrategy`, cũng inject `ConfigService` để lấy `jwt.secret`.

**Bài tập thực hành:**

1.  **Tích hợp `@nestjs/config`:**
    * **Yêu cầu:** Cài đặt `@nestjs/config` và `joi`.
    * Trong `AppModule`, import và cấu hình `ConfigModule.forRoot()` với `isGlobal: true`.
2.  **Tạo file `.env` và các Typed Configurations:**
    * **Yêu cầu:** Tạo file `.env` với các biến cần thiết cho ứng dụng của bạn (PORT, DATABASE_*, JWT_*).
    * Tạo các file cấu hình typed (ví dụ: `app.config.ts`, `db.config.ts`, `jwt.config.ts`) sử dụng `registerAs`. Load chúng vào `ConfigModule`.
3.  **Schema Validation cho Cấu hình:**
    * **Yêu cầu:** Sử dụng Joi để định nghĩa một `validationSchema` trong `ConfigModule.forRoot()`. Đảm bảo các biến môi trường quan trọng được yêu cầu (`required()`) và có kiểu dữ liệu/giá trị hợp lệ.
    * Thử xóa một biến môi trường required khỏi `.env` và chạy ứng dụng để xem lỗi validation.
4.  **Sử dụng `ConfigService` trong ứng dụng:**
    * **Yêu cầu:**
        * Cập nhật `main.ts` để lấy `PORT` từ `ConfigService` (qua namespace `application.port`).
        * Cập nhật cấu hình `TypeOrmModule` (hoặc `MongooseModule`) trong `AppModule` để sử dụng `forRootAsync` và `ConfigService` để lấy thông tin kết nối CSDL từ namespace `database`.
        * Đảm bảo `AuthModule` (và `JwtStrategy`) sử dụng `ConfigService` để lấy thông tin `JWT_SECRET` và `JWT_EXPIRES_IN` từ namespace `jwt`.
5.  **Inject Typed Configuration (Nâng cao):**
    * **Yêu cầu:** Trong một service bất kỳ (ví dụ `ProductsService`), inject một phần của configuration (ví dụ: `appConfig`) sử dụng `@Inject(appConfig.KEY)` và `ConfigType`. Log ra một giá trị từ config đó trong constructor của service để kiểm tra.



