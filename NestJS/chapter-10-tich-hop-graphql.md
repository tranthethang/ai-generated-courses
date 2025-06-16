## Chapter 10: Tích hợp GraphQL

**Tên Chapter học:** Tích hợp GraphQL

**Mục tiêu bài học:**

* **Hiểu GraphQL cơ bản:** Nắm vững các khái niệm cốt lõi của GraphQL: Schema, Types (Scalar, Object, Input, Enum), Queries, Mutations, Subscriptions (giới thiệu), Resolvers. So sánh GraphQL với REST API.
* **Tích hợp GraphQL vào NestJS:**
    * Sử dụng module `@nestjs/graphql` (thường với Apollo Server driver).
    * Cấu hình `GraphQLModule.forRoot()` trong `AppModule`.
* **Code-First Approach:**
    * Học cách định nghĩa GraphQL schema bằng cách sử dụng decorators của NestJS (`@ObjectType()`, `@Field()`, `@Query()`, `@Mutation()`, `@Args()`, `@Resolver()`, etc.).
    * NestJS sẽ tự động sinh ra GraphQL schema (SDL) từ code TypeScript.
* **Schema-First Approach (Giới thiệu):** Biết về lựa chọn viết schema bằng SDL trước, sau đó liên kết với resolvers (ít phổ biến hơn trong NestJS).
* **Tạo Resolvers:**
    * Viết các resolver class để xử lý các query và mutation đã định nghĩa.
    * Resolver methods sẽ nhận arguments (sử dụng `@Args()`) và gọi các service để thực hiện logic nghiệp vụ.
* **Làm việc với Arguments và Input Types:**
    * Sử dụng `@Args()` để lấy các đối số cho query/mutation.
    * Định nghĩa `InputType` (`@InputType()`) để nhóm các đối số phức tạp.
* **DataLoaders (Giải quyết N+1 Problem):**
    * Hiểu vấn đề N+1 query khi fetching nested data trong GraphQL.
    * Giới thiệu và triển khai `DataLoader` pattern để tối ưu hóa việc truy vấn dữ liệu, gộp nhiều query con thành một batch query.
* **GraphQL Playground:** Sử dụng GraphQL Playground (hoặc công cụ tương tự) để gửi query và mutation, khám phá schema.

**Tóm tắt lý thuyết:**

1.  **GraphQL là gì?**
    * Một ngôn ngữ truy vấn (query language) cho API và một runtime phía server để thực thi các truy vấn đó.
    * Cho phép client yêu cầu chính xác dữ liệu mình cần, không thừa không thiếu.
    * Trả về dữ liệu có cấu trúc dễ đoán, thường là JSON.
    * **So với REST:**
        * **GraphQL:** Một endpoint duy nhất (thường `/graphql`). Client định nghĩa data shape. Không có over-fetching/under-fetching. Strongly typed.
        * **REST:** Nhiều endpoints. Server định nghĩa data shape cho mỗi endpoint. Có thể bị over/under-fetching. Typing phụ thuộc vào OpenAPI/Swagger.
    * **Các khái niệm cốt lõi:**
        * **Schema:** Định nghĩa "hợp đồng" giữa client và server. Mô tả các loại dữ liệu có thể truy vấn và các thao tác có thể thực hiện.
        * **Types:** Các khối xây dựng của schema.
            * **Scalar Types:** `Int`, `Float`, `String`, `Boolean`, `ID`.
            * **Object Types:** Các loại đối tượng bạn định nghĩa (ví dụ: `User`, `Product`).
            * **Input Types:** Dùng để truyền các đối tượng phức tạp làm argument cho mutations hoặc queries.
            * **Enum Types:** Tập hợp các giá trị cho phép.
            * **Query Type:** Định nghĩa các entry point để đọc dữ liệu.
            * **Mutation Type:** Định nghĩa các entry point để ghi/thay đổi dữ liệu.
            * **Subscription Type:** Định nghĩa các entry point để nhận dữ liệu real-time qua WebSockets.
        * **Resolvers:** Các function phía server chịu trách nhiệm fetch dữ liệu cho một field cụ thể trong schema. Mỗi field của mỗi type đều có một resolver tương ứng.

2.  **Tích hợp GraphQL với NestJS (`@nestjs/graphql`):**
    * NestJS cung cấp module `@nestjs/graphql` để dễ dàng xây dựng GraphQL server.
    * **Cài đặt:**
        ```bash
        npm install --save @nestjs/graphql @nestjs/apollo @apollo/server graphql graphql-tools
        # @nestjs/apollo là driver cho Apollo Server
        ```
    * **Cấu hình `GraphQLModule` (Code-First):**
        ```typescript
        // app.module.ts
        import { Module } from '@nestjs/common';
        import { GraphQLModule } from '@nestjs/graphql';
        import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
        import { join } from 'path'; // Để join path
        // ... import các module resolver của bạn ...

        @Module({
          imports: [
            GraphQLModule.forRoot<ApolloDriverConfig>({
              driver: ApolloDriver, // Sử dụng Apollo Server
              autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // Path để tự động sinh file schema.gql
                                                                    // Hoặc: autoSchemaFile: true (tạo schema trong memory)
              sortSchema: true, // Sắp xếp schema cho dễ đọc
              playground: true, // Bật GraphQL Playground (mặc định true nếu NODE_ENV !== 'production')
              // debug: true, // Bật debug mode
              // installSubscriptionHandlers: true, // Nếu dùng Subscriptions
            }),
            // ... Các module chứa resolvers (ví dụ ProductsModule) ...
          ],
        })
        export class AppModule {}
        ```
        Sau khi chạy, file `src/schema.gql` sẽ được tạo ra.

3.  **Code-First Approach:**
    * Định nghĩa schema bằng cách sử dụng TypeScript classes và decorators.
    * **`@ObjectType(name?)`:** Đánh dấu một class là một GraphQL object type.
    * **`@Field(typeFunc?, options?)`:** Đánh dấu một property của class là một field trong GraphQL type.
        * `typeFunc`: Một hàm trả về GraphQL type (ví dụ: `() => String`, `() => Int`, `() => [OtherType]`). Cần thiết cho circular dependencies hoặc khi type không thể suy luận.
        * `options`: `nullable: true/false`, `description`, `deprecationReason`.
    * **`@Resolver(typeFunc?)`:** Đánh dấu một class là một resolver. `typeFunc` (ví dụ: `() => ProductType`) chỉ định object type mà resolver này chịu trách nhiệm. Nếu bỏ qua, resolver sẽ là "root" resolver cho Queries/Mutations.
    * **`@Query(typeFunc?, options?)`:** Đánh dấu một method trong resolver là một GraphQL query.
    * **`@Mutation(typeFunc?, options?)`:** Đánh dấu một method trong resolver là một GraphQL mutation.
    * **`@Args(name, options?)`:** Inject một argument vào resolver method.
        * `@Args('id', { type: () => ID }) id: string`
    * **`@InputType(name?)`:** Đánh dấu một class là một GraphQL input type. Các field của nó cũng dùng `@Field()`.
    * **`@Subscription(typeFunc?, options?)`:** (Nâng cao) Cho real-time updates.
    * **`@ResolveField(typeFunc?, options?)`:** (Nâng cao) Tạo resolver cho một field cụ thể của một `ObjectType` (thường khi field đó không có sẵn trực tiếp trên object data và cần logic để lấy).

4.  **Ví dụ: Tạo GraphQL API cho Products (Code-First):**
    * **`src/products/graphql/product.type.ts` (Object Type):**
        ```typescript
        import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

        @ObjectType('Product') // Tên GraphQL type là 'Product'
        export class ProductType {
          @Field(() => ID) // GraphQL ID type (thường là string)
          id: string; // Giả sử ID trong DB của bạn là string (ví dụ MongoDB _id)
                      // Hoặc number nếu là TypeORM id (PrimaryGeneratedColumn)

          @Field()
          name: string;

          @Field({ nullable: true }) // description có thể null
          description?: string;

          @Field(() => Float)
          price: number;

          @Field(() => Int)
          stock: number;

          // Nếu bạn muốn thêm trường user (người tạo sản phẩm)
          // @Field(() => UserType, { nullable: true })
          // owner?: UserType; // Sẽ cần UserType và ResolveField nếu owner là ID
        }
        ```
    * **`src/products/graphql/create-product.input.ts` (Input Type):**
        ```typescript
        import { InputType, Field, Float, Int } from '@nestjs/graphql';
        import { IsString, IsNotEmpty, MinLength, IsNumber, Min, IsOptional } from 'class-validator'; // Có thể dùng validation

        @InputType()
        export class CreateProductInput {
          @Field()
          @IsString()
          @IsNotEmpty()
          @MinLength(3)
          name: string;

          @Field({ nullable: true })
          @IsString()
          @IsOptional()
          description?: string;

          @Field(() => Float)
          @IsNumber()
          @Min(0)
          price: number;

          @Field(() => Int, { defaultValue: 0 }) // Có thể có defaultValue
          @IsNumber()
          @Min(0)
          @IsOptional()
          stock?: number;
        }
        ```
    * **`src/products/products.resolver.ts` (Resolver):**
        ```typescript
        import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
        import { ProductsService } from '../products.service'; // Service REST API đã có
        import { ProductType } from './product.type';
        import { CreateProductInput } from './create-product.input';
        // import { UpdateProductInput } from './update-product.input'; // Tạo tương tự CreateProductInput

        @Resolver(() => ProductType) // Resolver này xử lý cho ProductType
        export class ProductsResolver {
          constructor(private productsService: ProductsService) {}

          @Query(() => [ProductType], { name: 'products' }) // Query tên là 'products', trả về mảng ProductType
          async getAllProducts() {
            // Chuyển đổi ID từ number (TypeORM) sang string nếu GraphQL ID là string
            // Hoặc giữ nguyên nếu ID đã là string (MongoDB)
            // const products = await this.productsService.findAll();
            // return products.map(p => ({ ...p, id: String(p.id) })); // Ví dụ chuyển đổi
            return this.productsService.findAll(); // Giả sử service trả về đúng kiểu
          }

          @Query(() => ProductType, { name: 'product', nullable: true })
          async getProductById(@Args('id', { type: () => ID }) id: string) { // Hoặc number nếu ID là number
            // const numericId = parseInt(id, 10); // Chuyển đổi nếu cần
            // return this.productsService.findOne(numericId);
            return this.productsService.findOne(id); // Giả sử service nhận string ID
          }

          @Mutation(() => ProductType, { name: 'createProduct' })
          async createProduct(@Args('createProductInput') createProductInput: CreateProductInput) {
            // this.productsService.create() có thể nhận DTO của REST, cần map field nếu khác
            // Hoặc sửa create() trong service để nhận CreateProductInput
            return this.productsService.create(createProductInput as any); // Cần cast hoặc map
          }

          // TODO: Implement updateProduct và deleteProduct mutations
          // @Mutation(() => ProductType, { name: 'updateProduct' })
          // async updateProduct(
          //   @Args('id', { type: () => ID }) id: string,
          //   @Args('updateProductInput') updateProductInput: UpdateProductInput,
          // ) { /* ... */ }

          // @Mutation(() => Boolean, { name: 'deleteProduct' }) // Trả về boolean cho biết thành công hay không
          // async deleteProduct(@Args('id', { type: () => ID }) id: string) { /* ... */ }

          // Ví dụ ResolveField nếu ProductType có trường ownerId nhưng muốn trả về UserType
          // @ResolveField('owner', () => UserType)
          // async getOwner(@Parent() product: ProductType) {
          //   const { ownerId } = product; // Giả sử ProductType có ownerId
          //   return this.usersService.findOneById(ownerId);
          // }
        }
        ```
    * **Cập nhật `ProductsModule`:**
        ```typescript
        // src/products/products.module.ts
        import { Module } from '@nestjs/common';
        import { ProductsController } from './products.controller';
        import { ProductsService } from './products.service';
        import { ProductsResolver } from './products.resolver'; // Import Resolver
        // ... TypeOrmModule hoặc MongooseModule ...

        @Module({
          // ... imports (TypeOrmModule.forFeature, etc.) ...
          controllers: [ProductsController], // Vẫn giữ REST controller nếu muốn
          providers: [ProductsService, ProductsResolver], // Thêm Resolver vào providers
        })
        export class ProductsModule {}
        ```

5.  **DataLoaders (Giải quyết N+1 Problem):**
    * **Vấn đề N+1:** Khi bạn có một query lồng nhau, ví dụ: lấy danh sách bài viết, và cho mỗi bài viết lấy thông tin tác giả. Nếu không cẩn thận, bạn sẽ chạy N query để lấy N tác giả, cộng với 1 query để lấy danh sách bài viết.
        ```graphql
        query {
          posts { # 1 query
            title
            author { # N queries (một cho mỗi post)
              name
            }
          }
        }
        ```
    * **DataLoader:** Một utility được cung cấp bởi Facebook, giúp gộp các yêu cầu lấy dữ liệu riêng lẻ cho cùng một loại resource thành một batch request duy nhất.
        * Hoạt động dựa trên việc thu thập các ID trong một tick của event loop, sau đó thực hiện một query duy nhất (ví dụ: `SELECT * FROM users WHERE id IN (id1, id2, ...)`).
    * **Tích hợp DataLoader trong NestJS:**
        * Thường tạo DataLoader instance cho mỗi request (request-scoped).
        * Tạo một service (ví dụ `AuthorsLoader`) để cung cấp DataLoader.
        * Inject DataLoader vào resolver.
        * **Cài đặt:** `npm install --save dataloader`
        * **Ví dụ `AuthorLoader`:**
            ```typescript
            // src/authors/authors.loader.ts
            import { Injectable, Scope } from '@nestjs/common';
            import * as DataLoader from 'dataloader';
            import { AuthorsService } from './authors.service'; // Service lấy dữ liệu tác giả
            import { Author } from './entities/author.entity'; // Entity tác giả

            @Injectable({ scope: Scope.REQUEST }) // Request-scoped quan trọng
            export class AuthorLoader {
              constructor(private authorsService: AuthorsService) {}

              public readonly batchAuthors = new DataLoader<number, Author>(
                async (authorIds: number[]) => {
                  console.log('DataLoader: Fetching authors with IDs:', authorIds);
                  const authors = await this.authorsService.findByIds(authorIds); // Method này cần lấy authors theo mảng IDs
                  // Đảm bảo kết quả trả về đúng thứ tự với mảng IDs đầu vào
                  const authorsMap = new Map(authors.map(author => [author.id, author]));
                  return authorIds.map(id => authorsMap.get(id) || null);
                },
              );
            }
            ```
            Trong `AuthorsService`, cần có method `findByIds(ids: number[]): Promise<Author[]>`.
        * **Sử dụng trong Resolver (ví dụ `PostsResolver` có field `author`):**
            ```typescript
            // src/posts/posts.resolver.ts
            // ...
            // Giả sử PostType có authorId
            // @Resolver(() => PostType)
            // export class PostsResolver {
            //   constructor(private postsService: PostsService, private authorLoader: AuthorLoader) {}

            //   @ResolveField('author', () => AuthorType)
            //   async getAuthorOfPost(@Parent() post: PostTypeHavingAuthorId) {
            //     return this.authorLoader.batchAuthors.load(post.authorId); // Sử dụng DataLoader
            //   }
            // }
            ```
            Cần cung cấp `AuthorLoader` trong module tương ứng.

6.  **GraphQL Playground:**
    * Khi `playground: true` trong `GraphQLModule`, truy cập endpoint `/graphql` trên trình duyệt sẽ mở GraphQL Playground.
    * Cho phép bạn:
        * Viết và thực thi Queries, Mutations, Subscriptions.
        * Xem schema (Docs, Schema tabs).
        * Xem lịch sử query.
        * Truyền HTTP Headers (ví dụ: `Authorization` header cho JWT).

**Code Example (Triển khai cơ bản cho Products):**
* Đã được minh họa từng phần ở trên. Hãy kết hợp chúng lại.
* Đảm bảo `ProductsModule` đã được import vào `AppModule`.
* Chạy ứng dụng, truy cập `http://localhost:<port>/graphql`.
* Thử các query:
    ```graphql
    query GetAllProducts {
      products {
        id
        name
        price
        stock
      }
    }

    query GetOneProduct {
      product(id: "your_product_id_string_or_number") { # Thay ID
        id
        name
        description
        price
      }
    }
    ```
* Thử mutation:
    ```graphql
    mutation CreateNewProduct {
      createProduct(createProductInput: {
        name: "Awesome GraphQL Product"
        description: "Created via GraphQL"
        price: 99.99
        stock: 10
      }) {
        id
        name
        description
      }
    }
    ```

**Bài tập thực hành:**

1.  **Cài đặt và Cấu hình GraphQL:**
    * **Yêu cầu:** Cài đặt các package `@nestjs/graphql @nestjs/apollo @apollo/server graphql graphql-tools`.
    * Cấu hình `GraphQLModule.forRootAsync` (sử dụng `ConfigService` nếu muốn lấy `autoSchemaFile` path từ config) trong `AppModule` với `ApolloDriver`. Đặt `autoSchemaFile: 'src/schema.gql'` và `playground: true`.
2.  **Tạo GraphQL Types và Inputs cho `Users`:**
    * **Yêu cầu:**
        * Tạo `UserType` (`src/users/graphql/user.type.ts`) với các field: `id (ID!)`, `username (String!)`, `email (String!)`, `isActive (Boolean)`.
        * Tạo `CreateUserInput` (`src/users/graphql/create-user.input.ts`) với các field: `username (String!)`, `email (String!)`, `password (String!)`. (Thêm validation nếu muốn).
3.  **Tạo `UsersResolver`:**
    * **Yêu cầu:**
        * Tạo `UsersResolver` (`src/users/users.resolver.ts`).
        * Inject `UsersService` (service REST API đã có).
        * Triển khai query `user(id: ID!): UserType` để lấy user theo ID.
        * Triển khai query `users: [UserType!]` để lấy tất cả users.
        * Triển khai mutation `createUser(createUserInput: CreateUserInput!): UserType` để tạo user mới.
        * (Nâng cao) Triển khai mutation `updateUser` và `deleteUser`.
    * Thêm `UsersResolver` vào `providers` của `UsersModule`.
4.  **Kết nối `ProductType` với `UserType` (Nâng cao - ResolveField):**
    * **Yêu cầu:** Giả sử `ProductEntity` có một trường `ownerId` (ID của user tạo sản phẩm).
    * Trong `ProductType`, thêm một field `owner: UserType`.
    * Trong `ProductsResolver`, tạo một `@ResolveField('owner', () => UserType)` method. Method này nhận `@Parent() product: ProductType` và sử dụng `product.ownerId` để gọi `UsersService.findOneById()` nhằm lấy thông tin user.
    * Test query lấy sản phẩm kèm thông tin owner.
5.  **Thực hành với DataLoader cho `Product.owner` (Nâng cao):**
    * **Yêu cầu:** Nếu ở bài 4, bạn đã triển khai `ResolveField` cho `owner` của `ProductType`, hãy tối ưu nó bằng `DataLoader`.
    * Tạo `UserLoader` service (request-scoped) tương tự như `AuthorLoader` ở ví dụ lý thuyết. Service này sẽ nhận mảng `userIds` và trả về mảng `Users` tương ứng.
    * Inject `UserLoader` vào `ProductsResolver` và sử dụng `userLoader.batchUsers.load(product.ownerId)` trong `ResolveField` của `owner`.
    * Thêm log vào `UserLoader` để thấy nó được gọi với batch IDs.
6.  **Khám phá GraphQL Playground:**
    * **Yêu cầu:** Chạy ứng dụng, mở GraphQL Playground.
    * Thực thi tất cả các query và mutation bạn đã tạo cho `Users` và `Products`.
    * Sử dụng tab "Docs" và "Schema" để xem cấu trúc API GraphQL của bạn.
    * Thử truyền sai arguments hoặc query field không tồn tại để xem lỗi GraphQL trả về.



