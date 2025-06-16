## Chapter 6: Guards và Authentication Cơ bản (JWT)

**Tên Chapter học:** Guards và Authentication Cơ bản (JWT)

**Mục tiêu bài học:**

* **Hiểu rõ về Guards:** Nắm vững vai trò của Guards trong NestJS như một cơ chế để quyết định xem một request có được phép tiếp tục xử lý bởi route handler hay không, dựa trên các điều kiện nhất định (ví dụ: quyền truy cập, authentication).
* **Triển khai Authentication cơ bản:**
    * Hiểu khái niệm Authentication (xác thực danh tính người dùng).
    * Biết cách tạo một Guard đơn giản để thực hiện authentication dựa trên API Key.
* **JSON Web Tokens (JWT):**
    * Hiểu JWT là gì, cấu trúc của nó (Header, Payload, Signature).
    * Nắm được quy trình hoạt động của JWT trong authentication: server tạo token sau khi login thành công, client gửi token trong mỗi request tiếp theo, server xác thực token.
* **Tích hợp `@nestjs/jwt` và `@nestjs/passport`:**
    * Sử dụng module `@nestjs/jwt` để tạo và xác thực JWTs.
    * Giới thiệu `@nestjs/passport` và thư viện `passport-jwt` để triển khai một "strategy" (chiến lược) xác thực dựa trên JWT.
    * Tạo `AuthModule`, `AuthService` (để xử lý logic login và validate user), và `JwtStrategy`.
* **Bảo vệ Routes với JWT Guard:** Tạo một Guard tùy chỉnh (ví dụ: `JwtAuthGuard`) sử dụng `AuthGuard('jwt')` từ `@nestjs/passport` để bảo vệ các API endpoint, yêu cầu client phải cung cấp JWT hợp lệ.
* **Lấy thông tin User từ JWT:** Biết cách truy cập thông tin user (được giải mã từ payload của JWT) trong route handler sau khi đã qua `JwtAuthGuard`.

**Tóm tắt lý thuyết:**

1.  **Guards là gì?**
    * Guards là các class được đánh dấu bằng `@Injectable()` decorator và phải implement interface `CanActivate`.
    * Chúng có một method duy nhất là `canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>`.
    * `ExecutionContext` cung cấp thông tin về request hiện tại (tương tự `ArgumentMetadata` trong Pipes, nhưng rộng hơn, cho phép truy cập controller class, handler method, request object).
    * Nếu `canActivate` trả về `true` (hoặc một Promise/Observable resolve thành `true`), request sẽ được xử lý bởi route handler.
    * Nếu trả về `false` (hoặc một Promise/Observable resolve thành `false`), NestJS sẽ từ chối request (thường ném một `ForbiddenException`).
    * Guards được thực thi **sau tất cả middleware** nhưng **trước bất kỳ interceptor hoặc pipe nào**.
    * **Use cases:** Authentication (xác thực), Authorization (phân quyền - ví dụ: role-based access control).

2.  **Authentication vs. Authorization:**
    * **Authentication (Xác thực):** Quá trình xác định "bạn là ai?". Ví dụ: kiểm tra username/password, xác thực token.
    * **Authorization (Phân quyền):** Quá trình xác định "bạn được phép làm gì?" sau khi đã xác thực. Ví dụ: user A có quyền xem dữ liệu, user B có quyền sửa dữ liệu.

3.  **Guard đơn giản (Ví dụ: API Key Guard):**
    ```typescript
    // src/auth/guards/api-key.guard.ts
    import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
    import { Observable } from 'rxjs';
    // Giả sử bạn dùng ConfigService để lấy API Key
    // import { ConfigService } from '@nestjs/config';

    @Injectable()
    export class ApiKeyGuard implements CanActivate {
      // constructor(private configService: ConfigService) {}

      canActivate(
        context: ExecutionContext,
      ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKeyHeader = request.headers['x-api-key'];

        // const validApiKey = this.configService.get<string>('API_KEY');
        const validApiKey = 'YOUR_STATIC_API_KEY'; // Thay thế bằng cách lấy từ config

        if (apiKeyHeader === validApiKey) {
          return true;
        }
        throw new UnauthorizedException('Invalid API Key');
      }
    }
    ```
    Sử dụng: `@UseGuards(ApiKeyGuard)` trên controller hoặc handler.

4.  **JSON Web Tokens (JWT):**
    * Là một chuẩn mở (RFC 7519) định nghĩa một cách nhỏ gọn và khép kín để truyền thông tin giữa các bên dưới dạng một đối tượng JSON.
    * Thông tin này có thể được xác minh và tin cậy vì nó được ký điện tử (digitally signed).
    * **Cấu trúc (3 phần, ngăn cách bởi dấu chấm `.`):**
        * **Header:** Chứa thông tin về thuật toán ký (`alg`) và loại token (`typ`, thường là "JWT"). Được Base64Url encode.
            `{"alg": "HS256", "typ": "JWT"}`
        * **Payload:** Chứa các "claims" (thông tin về thực thể, ví dụ user ID, username, roles, và các metadata khác). Được Base64Url encode.
            * Registered claims: `iss` (issuer), `exp` (expiration time), `sub` (subject), `aud` (audience).
            * Public claims: Tự định nghĩa, nên tránh trùng lặp.
            * Private claims: Tự định nghĩa, dùng riêng giữa các bên đã thống nhất.
            `{"sub": "1234567890", "name": "John Doe", "admin": true, "iat": 1516239022, "exp": 1516242622}`
        * **Signature:** Để xác minh rằng người gửi token là chính họ và đảm bảo message không bị thay đổi. Được tạo bằng cách ký encoded header, encoded payload, một secret (bí mật), sử dụng thuật toán đã chỉ định trong header.
            `HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)`
    * **Luồng hoạt động:**
        1.  User đăng nhập bằng credentials (username/password).
        2.  Server xác thực credentials. Nếu thành công, server tạo một JWT (chứa user ID, có thể cả roles, và thời gian hết hạn `exp`) và ký nó bằng một `JWT_SECRET`.
        3.  Server gửi JWT về cho client.
        4.  Client lưu trữ JWT (thường trong localStorage, sessionStorage, hoặc HTTP-only cookie).
        5.  Với mỗi request tiếp theo đến các protected route, client gửi JWT trong `Authorization` header (thường là `Bearer <token>`).
        6.  Server nhận request, trích xuất token.
        7.  Server xác thực token:
            * Kiểm tra chữ ký (dùng cùng `JWT_SECRET`).
            * Kiểm tra thời gian hết hạn (`exp`).
            * Kiểm tra các claims khác nếu cần.
        8.  Nếu token hợp lệ, server xử lý request và có thể sử dụng thông tin từ payload (ví dụ `userId`) để thực hiện logic nghiệp vụ.

5.  **Tích hợp `@nestjs/jwt` và `@nestjs/passport`:**
    * **Cài đặt:**
        ```bash
        npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt
        npm install --save-dev @types/passport-jwt # Types
        ```
    * **`@nestjs/jwt` (`JwtModule`):**
        * Cung cấp `JwtService` để tạo (`sign()`, `signAsync()`) và xác thực (`verify()`, `verifyAsync()`) JWTs.
        * Cấu hình trong `AuthModule`:
            ```typescript
            // src/auth/auth.module.ts
            import { Module } from '@nestjs/common';
            import { JwtModule } from '@nestjs/jwt';
            import { PassportModule } from '@nestjs/passport';
            // ... imports khác ...

            @Module({
              imports: [
                PassportModule.register({ defaultStrategy: 'jwt' }), // Optional: set default strategy
                JwtModule.register({ // Hoặc registerAsync để lấy từ ConfigService
                  secret: 'YOUR_VERY_SECRET_KEY', // RẤT QUAN TRỌNG: Giữ bí mật và phức tạp, nên lấy từ biến môi trường
                  signOptions: { expiresIn: '1h' }, // Ví dụ: token hết hạn sau 1 giờ
                }),
                // UsersModule, // Nếu AuthService cần UsersService để tìm user
              ],
              // ... providers, controllers ...
            })
            export class AuthModule {}
            ```
    * **`@nestjs/passport` và `passport-jwt`:**
        * `PassportModule` là wrapper của thư viện Passport.js.
        * `passport-jwt` cung cấp một "strategy" (chiến lược) để xác thực JWT.
        * **Tạo `JwtStrategy`:**
            * Extend `PassportStrategy(Strategy)` (Strategy từ `passport-jwt`).
            * Trong constructor, gọi `super()` với các options:
                * `jwtFromRequest`: Cách trích xuất JWT từ request (ví dụ: `ExtractJwt.fromAuthHeaderAsBearerToken()`).
                * `ignoreExpiration`: `false` (mặc định) để kiểm tra `exp` claim.
                * `secretOrKey`: Cùng một secret đã dùng để ký token.
            * Implement method `validate(payload: any)`:
                * `payload` là đối tượng JSON đã được giải mã từ JWT.
                * Method này phải trả về thông tin user (hoặc `null`/`false` nếu user không hợp lệ). Giá trị trả về sẽ được Passport gắn vào `request.user`.
            ```typescript
            // src/auth/strategies/jwt.strategy.ts
            import { Injectable, UnauthorizedException } from '@nestjs/common';
            import { PassportStrategy } from '@nestjs/passport';
            import { Strategy, ExtractJwt } from 'passport-jwt';
            // import { ConfigService } from '@nestjs/config'; // Để lấy JWT_SECRET
            import { AuthService } from '../auth.service'; // Hoặc UsersService

            export interface JwtPayload {
              sub: number; // Hoặc string, tùy vào ID của user
              username: string;
              // ... các claim khác bạn thêm vào khi tạo token
            }

            @Injectable()
            export class JwtStrategy extends PassportStrategy(Strategy) { // Mặc định tên strategy là 'jwt'
              constructor(
                // private configService: ConfigService,
                private authService: AuthService, // Để validate user từ payload
              ) {
                super({
                  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                  ignoreExpiration: false,
                  // secretOrKey: configService.get<string>('JWT_SECRET'),
                  secretOrKey: 'YOUR_VERY_SECRET_KEY', // PHẢI GIỐNG VỚI KHI SIGN TOKEN
                });
              }

              // Method này được Passport gọi sau khi xác thực token thành công (chữ ký, exp)
              async validate(payload: JwtPayload): Promise<any> {
                // payload chứa các thông tin đã được sign trong token
                // Ví dụ: { sub: userId, username: 'john', iat: ..., exp: ... }
                // Ở đây, bạn có thể thực hiện thêm logic kiểm tra user trong DB nếu cần
                // Ví dụ: kiểm tra user có tồn tại, có bị ban không, etc.
                const user = await this.authService.validateUserFromJwt(payload);
                if (!user) {
                  throw new UnauthorizedException('User not found or invalid token.');
                }
                return user; // Giá trị này sẽ được gắn vào request.user
              }
            }
            ```

6.  **`AuthModule`, `AuthService`, `AuthController`:**
    * **`AuthService`:**
        * Chứa logic `login(userCredentials)`:
            * Xác thực credentials (ví dụ: so sánh password với hash trong DB - thường gọi `UsersService`).
            * Nếu thành công, tạo payload cho JWT (ví dụ: `{ sub: user.id, username: user.username }`).
            * Sử dụng `JwtService.sign(payload)` (hoặc `signAsync`) để tạo token.
            * Trả về `{ accessToken: token }`.
        * Chứa logic `validateUserFromJwt(payload: JwtPayload)` (được gọi bởi `JwtStrategy`):
            * Dựa vào `payload.sub` (user ID) để tìm user trong DB.
            * Trả về user object nếu hợp lệ, `null` nếu không.
    * **`AuthController`:**
        * Cung cấp endpoint `/auth/login` (thường là POST) nhận credentials, gọi `AuthService.login()`, trả về token.
        * Có thể có endpoint `/auth/profile` (được bảo vệ bằng `JwtAuthGuard`) để lấy thông tin user hiện tại từ `request.user`.

7.  **Bảo vệ Routes với `JwtAuthGuard`:**
    * NestJS cung cấp `AuthGuard` từ `@nestjs/passport`. `AuthGuard('jwt')` sẽ tự động sử dụng `JwtStrategy` bạn đã đăng ký.
    * Tạo một class `JwtAuthGuard` kế thừa `AuthGuard('jwt')` để dễ sử dụng và có thể override nếu cần.
        ```typescript
        // src/auth/guards/jwt-auth.guard.ts
        import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
        import { AuthGuard } from '@nestjs/passport';

        @Injectable()
        export class JwtAuthGuard extends AuthGuard('jwt') { // Sử dụng 'jwt' strategy
          // Có thể override handleRequest để tùy chỉnh lỗi hoặc hành vi
          handleRequest(err, user, info, context: ExecutionContext) {
            if (err || !user) {
              // info có thể là JsonWebTokenError, TokenExpiredError
              console.error('JWT Auth Error:', info?.message || err?.message);
              throw err || new UnauthorizedException(info?.message || 'User is not authenticated');
            }
            return user; // user này sẽ được gắn vào request.user
          }
        }
        ```
    * Áp dụng `@UseGuards(JwtAuthGuard)` cho controller hoặc handler cần bảo vệ.

8.  **Truy cập User trong Handler:**
    * Sau khi một route được bảo vệ bởi `JwtAuthGuard` và token hợp lệ, `request.user` sẽ chứa thông tin user trả về từ method `validate()` của `JwtStrategy`.
    * Tạo một custom decorator `@GetUser()` để tiện lấy thông tin user.
        ```typescript
        // src/auth/decorators/get-user.decorator.ts
        import { createParamDecorator, ExecutionContext } from '@nestjs/common';

        export const GetUser = createParamDecorator(
          (data: string | undefined, ctx: ExecutionContext) => {
            const request = ctx.switchToHttp().getRequest();
            if (!request.user) {
              return null; // Hoặc ném lỗi nếu user luôn phải có
            }
            if (data) {
              return request.user[data]; // Lấy một thuộc tính cụ thể của user
            }
            return request.user; // Lấy toàn bộ object user
          },
        );
        ```
        Sử dụng: `@Get('profile') @UseGuards(JwtAuthGuard) getProfile(@GetUser() user: UserEntity) { ... }`
        Hoặc: `@GetUser('username') username: string`

**Code Example (Triển khai JWT Authentication):**

1.  **Cài đặt packages:** (Đã làm ở trên)

2.  **Cấu hình `AuthModule`:**
    * Tạo `src/auth/auth.module.ts`, `src/auth/auth.service.ts`, `src/auth/auth.controller.ts`.
    * Tạo `src/auth/strategies/jwt.strategy.ts`.
    * Tạo `src/auth/guards/jwt-auth.guard.ts`.
    * Tạo `src/auth/decorators/get-user.decorator.ts`.
    * Giả sử bạn có `UsersModule` và `UsersService` để quản lý user (bao gồm cả việc hash và so sánh password). Nếu không, bạn có thể hardcode user trong `AuthService` để demo.

    ```typescript
    // src/auth/auth.module.ts
    import { Module } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { AuthController } from './auth.controller';
    import { JwtModule } from '@nestjs/jwt';
    import { PassportModule } from '@nestjs/passport';
    import { JwtStrategy } from './strategies/jwt.strategy';
    // import { UsersModule } from '../users/users.module'; // Nếu cần UsersService
    import { ConfigModule, ConfigService } from '@nestjs/config'; // Để dùng ConfigService

    @Module({
      imports: [
        // UsersModule, // Import UsersModule nếu AuthService cần UsersService
        ConfigModule, // Đảm bảo ConfigModule đã được import ở AppModule
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
          imports: [ConfigModule], // Import ConfigModule vào đây
          inject: [ConfigService],  // Inject ConfigService
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'), // Lấy secret từ .env
            signOptions: {
              expiresIn: configService.get<string | number>('JWT_EXPIRES_IN', '3600s'), // Lấy expiration từ .env
            },
          }),
        }),
      ],
      providers: [AuthService, JwtStrategy /*, UsersService nếu chỉ dùng ở đây */],
      controllers: [AuthController],
      exports: [JwtStrategy, PassportModule, JwtModule, AuthService], // Export để các module khác có thể dùng JwtAuthGuard
    })
    export class AuthModule {}
    ```
    **Lưu ý:** Thêm `JWT_SECRET` và `JWT_EXPIRES_IN` vào file `.env` của bạn.

3.  **`src/auth/auth.service.ts`:**
    ```typescript
    import { Injectable, UnauthorizedException } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt';
    // import { UsersService } from '../users/users.service'; // Nếu dùng UsersService
    import * as bcrypt from 'bcrypt'; // npm install bcrypt @types/bcrypt
    import { JwtPayload } from './strategies/jwt.strategy';
    import { LoginDto } from './dto/login.dto'; // Tạo DTO này

    // Giả lập User entity/interface
    export interface User {
      id: number;
      username: string;
      passwordHash: string; // Lưu hash của password
      // ... other fields
    }

    // Giả lập UsersService hoặc DB access
    const users: User[] = [
      { id: 1, username: 'john', passwordHash: '$2b$10$yourbcryptgeneratedhashforpassword123' }, // Thay bằng hash thật
      { id: 2, username: 'maria', passwordHash: '$2b$10$anotherbcryptgeneratedhashforpass456' },
    ];


    @Injectable()
    export class AuthService {
      constructor(
        // private usersService: UsersService, // Nếu dùng UsersService thật
        private jwtService: JwtService,
      ) {
        // Hash password khi khởi tạo (chỉ để demo, thực tế nên hash khi tạo user)
        if (users[0].passwordHash.startsWith('$2b$')) console.log("Passwords already hashed.");
        else {
            bcrypt.hash('password123', 10).then(hash => users[0].passwordHash = hash);
            bcrypt.hash('pass456', 10).then(hash => users[1].passwordHash = hash);
        }
      }

      async validateUserCredentials(loginDto: LoginDto): Promise<Omit<User, 'passwordHash'> | null> {
        const { username, password } = loginDto;
        // const user = await this.usersService.findOneByUsername(username); // Cách làm đúng
        const user = users.find(u => u.username === username); // Cách làm giả lập

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
          const { passwordHash, ...result } = user; // Loại bỏ passwordHash
          return result;
        }
        return null;
      }

      async login(user: Omit<User, 'passwordHash'>): Promise<{ accessToken: string }> {
        const payload: JwtPayload = { username: user.username, sub: user.id };
        return {
          accessToken: this.jwtService.sign(payload),
        };
      }

      // Được gọi bởi JwtStrategy.validate
      async validateUserFromJwt(payload: JwtPayload): Promise<Omit<User, 'passwordHash'> | null> {
        // const user = await this.usersService.findOneById(payload.sub); // Cách làm đúng
        const user = users.find(u => u.id === payload.sub); // Cách làm giả lập
        if (user) {
          const { passwordHash, ...result } = user;
          return result;
        }
        return null;
      }
    }
    ```
    * Tạo `src/auth/dto/login.dto.ts`:
        ```typescript
        import { IsString, IsNotEmpty, MinLength } from 'class-validator';
        export class LoginDto {
          @IsString() @IsNotEmpty() username: string;
          @IsString() @IsNotEmpty() @MinLength(6) password: string;
        }
        ```

4.  **`src/auth/strategies/jwt.strategy.ts`:** (Đã có ở phần lý thuyết)

5.  **`src/auth/auth.controller.ts`:**
    ```typescript
    import { Controller, Post, Body, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { LoginDto } from './dto/login.dto';
    import { JwtAuthGuard } from './guards/jwt-auth.guard';
    import { GetUser } from './decorators/get-user.decorator';
    import { User } from './auth.service'; // Hoặc User entity/interface của bạn

    @Controller('auth')
    export class AuthController {
      constructor(private authService: AuthService) {}

      @Post('login')
      @HttpCode(HttpStatus.OK) // Trả về 200 OK thay vì 201 Created
      async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
        const user = await this.authService.validateUserCredentials(loginDto);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
      }

      // Endpoint này được bảo vệ, cần JWT hợp lệ
      @UseGuards(JwtAuthGuard)
      @Get('profile')
      getProfile(@GetUser() user: Omit<User, 'passwordHash'>) {
        // user ở đây là object được trả về từ JwtStrategy.validate()
        // và đã được gắn vào request.user bởi JwtAuthGuard
        return user;
      }

      @UseGuards(JwtAuthGuard)
      @Get('user-id')
      getUserId(@GetUser('sub') userId: number) { // Lấy thuộc tính 'sub' (id) từ user
          return { userId };
      }
    }
    ```

6.  **Bảo vệ một route trong `CatsController` (ví dụ):**
    ```typescript
    // src/cats/cats.controller.ts
    import { Controller, Post, Body, UseGuards, /* ... */ } from '@nestjs/common';
    import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import guard
    import { CreateCatDto } from './dto/create-cat.dto';
    // ...

    @Controller('cats')
    export class CatsController {
      // ... constructor và các method khác ...

      @Post() // Endpoint này giờ cần authentication
      @UseGuards(JwtAuthGuard) // Áp dụng JWT Auth Guard
      create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
        // @GetUser() user: UserEntity có thể được thêm vào đây nếu cần biết ai tạo
        return this.catsService.create(createCatDto);
      }
    }
    ```

**Bài tập thực hành:**

1.  **Cài đặt các package cần thiết:**
    * **Yêu cầu:** Chạy `npm install --save @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt` và `npm install --save-dev @types/passport-jwt @types/bcrypt`.
2.  **Tạo `AuthModule`, `AuthService`, `AuthController`, `JwtStrategy`:**
    * **Yêu cầu:** Triển khai các file này như trong code example.
    * Trong `AuthModule`, cấu hình `JwtModule.registerAsync` để đọc `JWT_SECRET` và `JWT_EXPIRES_IN` từ `ConfigService` (đảm bảo đã có trong file `.env`).
    * Trong `AuthService`, hardcode một vài user với username và password đã được hash bằng `bcrypt` (hoặc tạo một `UsersModule` và `UsersService` cơ bản để quản lý user trong mảng nếu muốn).
3.  **Triển khai endpoint Login:**
    * **Yêu cầu:** Trong `AuthController`, tạo endpoint `POST /auth/login` nhận `LoginDto` (username, password).
    * Gọi `AuthService.validateUserCredentials()` để kiểm tra thông tin đăng nhập.
    * Nếu hợp lệ, gọi `AuthService.login()` để tạo và trả về `accessToken`.
    * Nếu không hợp lệ, ném `UnauthorizedException`.
4.  **Tạo `JwtAuthGuard` và bảo vệ Routes:**
    * **Yêu cầu:** Tạo `JwtAuthGuard` như trong ví dụ.
    * Áp dụng `JwtAuthGuard` cho endpoint `POST /products` và `PUT /products/:productId` trong `ProductsController` để yêu cầu authentication khi tạo hoặc cập nhật sản phẩm.
5.  **Kiểm tra với Postman/Insomnia:**
    * **Bước 1 (Login):** Gửi request POST đến `/auth/login` với username và password hợp lệ. Nhận `accessToken` từ response.
    * **Bước 2 (Truy cập Protected Route):**
        * Thử gửi request POST đến `/products` (để tạo sản phẩm) **mà không có** `Authorization` header. Bạn sẽ nhận được lỗi 401 Unauthorized.
        * Gửi lại request POST đến `/products`, lần này thêm `Authorization` header với giá trị `Bearer <your_access_token>` (thay `<your_access_token>` bằng token nhận được ở Bước 1). Request này sẽ thành công.
    * **Bước 3 (Test Profile):** Tạo endpoint `GET /auth/profile` được bảo vệ bởi `JwtAuthGuard` trong `AuthController`. Sử dụng `GetUser` decorator để trả về thông tin user. Gọi endpoint này với token hợp lệ.
6.  **(Nâng cao) Tạo `RolesGuard` và `Roles` Decorator:**
    * **Yêu cầu:** Giả sử user object trong JWT payload có một mảng `roles` (ví dụ: `['admin', 'user']`).
    * Tạo một decorator `@Roles(...roles: string[])` để gán metadata về roles cho route handler.
    * Tạo một `RolesGuard` đọc metadata này và kiểm tra xem user (từ `request.user.roles`) có role phù hợp không.
    * Áp dụng `RolesGuard` (sau `JwtAuthGuard`) cho một endpoint, ví dụ chỉ `admin` mới được xóa sản phẩm.
