## Chapter 4: Xử lý bất đồng bộ & Giới thiệu Cơ sở dữ liệu (TypeORM/Mongoose)

**Tên Chapter học:** Xử lý bất đồng bộ & Giới thiệu Cơ sở dữ liệu (TypeORM/Mongoose)

**Mục tiêu bài học:**

* **Xử lý bất đồng bộ (Asynchronous Operations):**
    * Thành thạo việc sử dụng `async/await` trong controllers và services để làm việc với các tác vụ bất đồng bộ (ví dụ: tương tác CSDL, gọi API bên ngoài).
    * Hiểu cách NestJS xử lý `Promise` trả về từ các route handler.
* **Giới thiệu ORM/ODM:**
    * Hiểu khái niệm ORM (Object-Relational Mapper) cho cơ sở dữ liệu quan hệ (SQL) và ODM (Object-Document Mapper) cho cơ sở dữ liệu NoSQL dạng document (ví dụ: MongoDB).
    * Nắm được lợi ích của việc sử dụng ORM/ODM (trừu tượng hóa CSDL, giảm code boilerplate, type safety với TypeScript).
* **TypeORM (cho SQL):**
    * Giới thiệu về TypeORM, một ORM phổ biến cho TypeScript và JavaScript.
    * Cài đặt các package cần thiết: `@nestjs/typeorm`, `typeorm`, và database driver (ví dụ: `pg` cho PostgreSQL, `mysql2` cho MySQL).
    * Cấu hình `TypeOrmModule.forRoot()` để kết nối ứng dụng NestJS với một CSDL SQL (ví dụ: PostgreSQL).
    * Định nghĩa Entities (ánh xạ tới các bảng trong CSDL) sử dụng decorators của TypeORM.
    * Sử dụng Repositories (`Repository<Entity>`) để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với entities.
* **Mongoose (cho NoSQL - MongoDB):**
    * Giới thiệu về Mongoose, một ODM phổ biến cho MongoDB.
    * Cài đặt các package cần thiết: `@nestjs/mongoose`, `mongoose`.
    * Cấu hình `MongooseModule.forRoot()` để kết nối ứng dụng NestJS với MongoDB.
    * Định nghĩa Schemas và Models để mô tả cấu trúc của documents trong collections.
    * Sử dụng Mongoose Models (`Model<Document>`) để thực hiện các thao tác CRUD với documents.
* **Thực hành CRUD cơ bản:** Áp dụng kiến thức đã học để kết nối với một CSDL (học viên chọn TypeORM hoặc Mongoose) và thực hiện các thao tác tạo, đọc, cập nhật, xóa dữ liệu cho một entity/schema đơn giản.

**Tóm tắt lý thuyết:**

1.  **Xử lý bất đồng bộ trong NestJS:**
    * Hầu hết các tác vụ I/O (như truy vấn CSDL, gọi API) là bất đồng bộ. JavaScript sử dụng `Promise` để xử lý các tác vụ này.
    * `async/await` là cú pháp giúp viết code bất đồng bộ trông giống như code đồng bộ, dễ đọc và quản lý hơn.
    * Trong NestJS, các route handler và service method có thể là các `async` function trả về `Promise`. NestJS sẽ tự động xử lý (resolve) `Promise` đó trước khi gửi response.
        ```typescript
        // cats.service.ts
        @Injectable()
        export class CatsService {
          async findOne(id: number): Promise<Cat> {
            // Giả lập một tác vụ bất đồng bộ (ví dụ: query database)
            return new Promise(resolve => {
              setTimeout(() => {
                const cat = this.cats.find(c => c.id === id);
                resolve(cat);
              }, 100);
            });
          }
        }

        // cats.controller.ts
        @Controller('cats')
        export class CatsController {
          constructor(private catsService: CatsService) {}

          @Get(':id')
          async findOne(@Param('id', ParseIntPipe) id: number): Promise<Cat> {
            const cat = await this.catsService.findOne(id); // Sử dụng await
            if (!cat) {
              throw new NotFoundException(`Cat with ID ${id} not found`);
            }
            return cat;
          }
        }
        ```

2.  **ORM (Object-Relational Mapper) và ODM (Object-Document Mapper):**
    * **ORM (ví dụ: TypeORM, Sequelize, Prisma):**
        * Dùng cho cơ sở dữ liệu quan hệ (SQL) như PostgreSQL, MySQL, SQL Server, SQLite.
        * Cho phép bạn làm việc với CSDL bằng cách sử dụng các đối tượng và class trong ngôn ngữ lập trình của bạn (ví dụ: TypeScript) thay vì viết các câu lệnh SQL thuần.
        * Ánh xạ các class (entities) tới các bảng (tables) và các thuộc tính của class tới các cột (columns).
    * **ODM (ví dụ: Mongoose):**
        * Dùng cho cơ sở dữ liệu NoSQL dạng document (ví dụ: MongoDB).
        * Cung cấp một lớp trừu tượng để làm việc với các document và collection trong MongoDB bằng cách sử dụng các đối tượng và schema trong code.
    * **Lợi ích chung:**
        * **Tăng năng suất:** Giảm lượng code boilerplate phải viết cho các thao tác CSDL.
        * **Trừu tượng hóa CSDL:** Dễ dàng thay đổi CSDL nền tảng (ở một mức độ nhất định).
        * **Type Safety:** Với TypeScript, ORM/ODM giúp đảm bảo kiểu dữ liệu khi tương tác với CSDL.
        * **Tính năng nâng cao:** Thường cung cấp các tính năng như migrations, relations, transactions.

3.  **TypeORM với NestJS:**
    * **Cài đặt:**
        ```bash
        npm install --save @nestjs/typeorm typeorm pg # Cho PostgreSQL
        # hoặc
        npm install --save @nestjs/typeorm typeorm mysql2 # Cho MySQL
        ```
    * **Cấu hình `TypeOrmModule`:**
        * Trong `AppModule` (hoặc một module cấu hình CSDL riêng), import `TypeOrmModule.forRoot()` hoặc `TypeOrmModule.forRootAsync()` (để load cấu hình động, ví dụ từ `ConfigService`).
        ```typescript
        // app.module.ts (ví dụ cơ bản)
        import { Module } from '@nestjs/common';
        import { TypeOrmModule } from '@nestjs/typeorm';
        import { Cat } from './cats/entities/cat.entity'; // Entity sẽ tạo
        import { CatsModule } from './cats/cats.module';

        @Module({
          imports: [
            TypeOrmModule.forRoot({
              type: 'postgres', // hoặc 'mysql', 'sqlite', etc.
              host: 'localhost',
              port: 5432,
              username: 'your_db_user',
              password: 'your_db_password',
              database: 'your_db_name',
              entities: [Cat], // Danh sách các entity
              synchronize: true, // CHỈ DÙNG TRONG DEVELOPMENT: tự động tạo schema CSDL.
                                 // KHÔNG DÙNG TRONG PRODUCTION, sử dụng migrations thay thế.
            }),
            CatsModule,
          ],
        })
        export class AppModule {}
        ```
    * **Định nghĩa Entities:**
        * Entity là một class được đánh dấu bằng decorator `@Entity()` và các thuộc tính của nó được đánh dấu bằng các decorator như `@PrimaryGeneratedColumn()`, `@Column()`, `@ManyToOne()`, etc.
        ```typescript
        // src/cats/entities/cat.entity.ts
        import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

        @Entity() // Mặc định tên bảng sẽ là 'cat' (lowercase của tên class)
        // @Entity('my_cats_table') // Có thể tùy chỉnh tên bảng
        export class Cat {
          @PrimaryGeneratedColumn() // Khóa chính tự tăng
          id: number;

          @Column({ length: 100 })
          name: string;

          @Column()
          age: number;

          @Column()
          breed: string;

          @Column({ default: true }) // Giá trị mặc định
          isActive: boolean;
        }
        ```
    * **Đăng ký Entity trong Module Feature:**
        * Trong module cụ thể (ví dụ `CatsModule`), sử dụng `TypeOrmModule.forFeature([Cat])` để inject `Repository<Cat>`.
        ```typescript
        // src/cats/cats.module.ts
        import { Module } from '@nestjs/common';
        import { TypeOrmModule } from '@nestjs/typeorm';
        import { CatsController } from './cats.controller';
        import { CatsService } from './cats.service';
        import { Cat } from './entities/cat.entity'; // Import entity

        @Module({
          imports: [TypeOrmModule.forFeature([Cat])], // Đăng ký Cat entity cho module này
          controllers: [CatsController],
          providers: [CatsService],
        })
        export class CatsModule {}
        ```
    * **Sử dụng Repositories trong Services:**
        * Inject `Repository<EntityName>` vào service bằng `@InjectRepository(EntityName)`.
        * Repository cung cấp các method để tương tác với CSDL: `find()`, `findOne()`, `findOneBy()`, `save()`, `create()`, `update()`, `delete()`, `query()`, etc.
        ```typescript
        // src/cats/cats.service.ts
        import { Injectable, NotFoundException } from '@nestjs/common';
        import { InjectRepository } from '@nestjs/typeorm';
        import { Repository } from 'typeorm';
        import { Cat } from './entities/cat.entity';
        import { CreateCatDto } from './dto/create-cat.dto';
        import { UpdateCatDto } from './dto/update-cat.dto';

        @Injectable()
        export class CatsService {
          constructor(
            @InjectRepository(Cat) // Inject repository của Cat entity
            private catsRepository: Repository<Cat>,
          ) {}

          async create(createCatDto: CreateCatDto): Promise<Cat> {
            const newCat = this.catsRepository.create(createCatDto); // Tạo instance, chưa lưu DB
            return this.catsRepository.save(newCat); // Lưu vào DB
          }

          async findAll(breed?: string): Promise<Cat[]> {
            if (breed) {
              return this.catsRepository.find({ where: { breed } });
            }
            return this.catsRepository.find();
          }

          async findOne(id: number): Promise<Cat> {
            const cat = await this.catsRepository.findOneBy({ id });
            if (!cat) {
              throw new NotFoundException(`Cat with ID ${id} not found`);
            }
            return cat;
          }

          async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
            // preload tìm entity theo id, nếu có thì merge data mới vào, nếu không thì undefined
            const cat = await this.catsRepository.preload({
              id: id,
              ...updateCatDto,
            });
            if (!cat) {
              throw new NotFoundException(`Cat with ID ${id} not found for update`);
            }
            return this.catsRepository.save(cat); // Lưu thay đổi
          }

          async remove(id: number): Promise<void> {
            const result = await this.catsRepository.delete(id);
            if (result.affected === 0) {
              throw new NotFoundException(`Cat with ID ${id} not found for deletion`);
            }
          }
        }
        ```

4.  **Mongoose với NestJS:**
    * **Cài đặt:**
        ```bash
        npm install --save @nestjs/mongoose mongoose
        ```
    * **Cấu hình `MongooseModule`:**
        * Trong `AppModule` (hoặc module cấu hình), import `MongooseModule.forRoot()` hoặc `MongooseModule.forRootAsync()`.
        ```typescript
        // app.module.ts (ví dụ cơ bản)
        import { Module } from '@nestjs/common';
        import { MongooseModule } from '@nestjs/mongoose';
        import { CatsModule } from './cats/cats.module';

        @Module({
          imports: [
            MongooseModule.forRoot('mongodb://localhost:27017/nest_cats_db'), // Connection string
            CatsModule,
          ],
        })
        export class AppModule {}
        ```
    * **Định nghĩa Schemas và Interfaces (cho type-safety):**
        * Schema định nghĩa cấu trúc của document, default values, validators, etc.
        * Interface TypeScript thường được tạo để đại diện cho Document type.
        ```typescript
        // src/cats/schemas/cat.schema.ts
        import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
        import { Document } from 'mongoose';

        export type CatDocument = Cat & Document; // Kết hợp Cat interface với Mongoose Document

        @Schema({ timestamps: true }) // Tự động thêm createdAt, updatedAt
        export class Cat {
          // Bỏ @PrimaryGeneratedColumn() vì MongoDB tự tạo _id
          // id: number; // Không cần nếu dùng _id của MongoDB

          @Prop({ required: true, index: true }) // required, index
          name: string;

          @Prop({ required: true })
          age: number;

          @Prop()
          breed: string;

          @Prop({ default: true })
          isActive: boolean;
        }

        export const CatSchema = SchemaFactory.createForClass(Cat);
        ```
    * **Đăng ký Schema trong Module Feature:**
        * Trong module cụ thể (ví dụ `CatsModule`), sử dụng `MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])`.
        ```typescript
        // src/cats/cats.module.ts
        import { Module } from '@nestjs/common';
        import { MongooseModule } from '@nestjs/mongoose';
        import { CatsController } from './cats.controller';
        import { CatsService } from './cats.service';
        import { Cat, CatSchema } from './schemas/cat.schema'; // Import schema và class

        @Module({
          imports: [
            MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]), // Đăng ký schema
          ],
          controllers: [CatsController],
          providers: [CatsService],
        })
        export class CatsModule {}
        ```
    * **Sử dụng Models trong Services:**
        * Inject Model vào service bằng `@InjectModel(Cat.name)`.
        * Model cung cấp các method để tương tác với collection: `find()`, `findById()`, `create()`, `updateOne()`, `deleteOne()`, etc.
        ```typescript
        // src/cats/cats.service.ts
        import { Injectable, NotFoundException } from '@nestjs/common';
        import { InjectModel } from '@nestjs/mongoose';
        import { Model } from 'mongoose';
        import { Cat, CatDocument } from './schemas/cat.schema';
        import { CreateCatDto } from './dto/create-cat.dto';
        import { UpdateCatDto } from './dto/update-cat.dto';

        @Injectable()
        export class CatsService {
          constructor(
            @InjectModel(Cat.name) private catModel: Model<CatDocument>, // Inject model
          ) {}

          async create(createCatDto: CreateCatDto): Promise<Cat> {
            const createdCat = new this.catModel(createCatDto);
            return createdCat.save();
          }

          async findAll(breed?: string): Promise<Cat[]> {
            const filter = breed ? { breed } : {};
            return this.catModel.find(filter).exec(); // .exec() để trả về Promise
          }

          async findOne(id: string): Promise<Cat> { // ID của MongoDB là string
            const cat = await this.catModel.findById(id).exec();
            if (!cat) {
              throw new NotFoundException(`Cat with ID ${id} not found`);
            }
            return cat;
          }

          async update(id: string, updateCatDto: UpdateCatDto): Promise<Cat> {
            const updatedCat = await this.catModel
              .findByIdAndUpdate(id, updateCatDto, { new: true }) // {new: true} để trả về document đã update
              .exec();
            if (!updatedCat) {
              throw new NotFoundException(`Cat with ID ${id} not found for update`);
            }
            return updatedCat;
          }

          async remove(id: string): Promise<void> {
            const result = await this.catModel.deleteOne({ _id: id }).exec();
            if (result.deletedCount === 0) {
              throw new NotFoundException(`Cat with ID ${id} not found for deletion`);
            }
          }
        }
        ```
        Controller sẽ cần điều chỉnh `id` thành `string` và bỏ `ParseIntPipe` nếu dùng Mongoose.

**Code Example:**
*Học viên sẽ chọn một trong hai hướng: TypeORM hoặc Mongoose để làm theo.*

* **Chuẩn bị CSDL:**
    * **Docker (Khuyến khích):** Cách dễ nhất để chạy CSDL local.
        * **PostgreSQL:** `docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=myuser -e POSTGRES_DB=mydatabase -p 5432:5432 -d postgres`
        * **MongoDB:** `docker run --name my-mongo -p 27017:27017 -d mongo`
    * Hoặc cài đặt CSDL trực tiếp trên máy.

* **Code cho TypeORM đã được minh họa chi tiết ở phần lý thuyết TypeORM.**
* **Code cho Mongoose đã được minh họa chi tiết ở phần lý thuyết Mongoose.**

**Bài tập thực hành:**
*Học viên chọn một trong hai hệ CSDL (PostgreSQL với TypeORM hoặc MongoDB với Mongoose) để thực hiện các bài tập này cho `ProductsModule`.*

1.  **Cài đặt và Cấu hình CSDL:**
    * **Yêu cầu:** Chạy một instance PostgreSQL (nếu chọn TypeORM) hoặc MongoDB (nếu chọn Mongoose) trên máy local (sử dụng Docker hoặc cài đặt trực tiếp).
    * Cài đặt các package `@nestjs/typeorm typeorm pg` (hoặc `mysql2`) HOẶC `@nestjs/mongoose mongoose`.
    * Trong `AppModule`, cấu hình `TypeOrmModule.forRoot()` hoặc `MongooseModule.forRoot()` để kết nối đến CSDL của bạn. Đặt `synchronize: true` (cho TypeORM) hoặc không cần thiết cho Mongoose trong giai đoạn development.
2.  **Định nghĩa `Product` Entity/Schema:**
    * **Yêu cầu:**
        * **TypeORM:** Tạo file `src/products/entities/product.entity.ts`. Định nghĩa class `Product` với các trường: `id` (khóa chính, tự tăng), `name` (string), `description` (string, có thể null), `price` (number), `stock` (number, default 0), `createdAt` (timestamp, tự động tạo), `updatedAt` (timestamp, tự động cập nhật).
        * **Mongoose:** Tạo file `src/products/schemas/product.schema.ts`. Định nghĩa `ProductSchema` và `Product` class/interface với các trường tương tự (MongoDB tự quản lý `_id`, `createdAt`, `updatedAt` nếu `@Schema({ timestamps: true })`).
3.  **Cập nhật `ProductsModule`:**
    * **Yêu cầu:**
        * **TypeORM:** Import `TypeOrmModule.forFeature([Product])` vào `ProductsModule`.
        * **Mongoose:** Import `MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])` vào `ProductsModule`.
4.  **Cập nhật `ProductsService` để sử dụng Repository/Model:**
    * **Yêu cầu:**
        * Inject `Repository<Product>` (cho TypeORM) hoặc `Model<ProductDocument>` (cho Mongoose) vào `ProductsService`.
        * Viết lại các method CRUD (`create`, `findAll`, `findOne`, `update`, `remove`) trong `ProductsService` để sử dụng các method của repository/model tương ứng để tương tác với CSDL. Tất cả các method này nên là `async` và trả về `Promise`.
        * Xử lý trường hợp không tìm thấy product bằng cách ném `NotFoundException`.
5.  **Kiểm tra lại với Postman/Insomnia:**
    * **Yêu cầu:** Chạy ứng dụng NestJS. Sử dụng Postman để kiểm tra tất cả các endpoint CRUD của `ProductsController`.
        * Tạo một vài sản phẩm.
        * Lấy danh sách sản phẩm, lấy một sản phẩm theo ID.
        * Cập nhật một sản phẩm.
        * Xóa một sản phẩm.
    * Xác nhận rằng dữ liệu được lưu và truy xuất từ CSDL một cách chính xác. Kiểm tra CSDL trực tiếp nếu cần.



