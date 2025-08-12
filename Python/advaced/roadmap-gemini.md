# Roadmap chi tiết: 25 bài học từ Python đến AI với FastAPI & Claude

#### **Phần 1: Python Foundations for PHP Veterans (6 bài)**

* **Bài 1: Môi trường & Cú pháp So sánh**
    * [ ] Cài đặt thành công Python, Pip và Venv.
    * [ ] Hiểu và giải thích được sự khác biệt giữa Venv và Composer.
    * [ ] Viết được script Python đầu tiên (`print`, khai báo biến).
    * [ ] So sánh và chỉ ra được 5 khác biệt cú pháp cơ bản giữa Python và PHP (dấu `$`, `;`, thụt đầu dòng, `->` vs `.`).

* **Bài 2: Cấu trúc Dữ liệu - Ánh xạ từ PHP Array**
    * [ ] Phân biệt rõ ràng chức năng của `List`, `Tuple`, `Dictionary`, `Set`.
    * [ ] Ánh xạ được `List` với mảng chỉ số và `Dictionary` với mảng kết hợp của PHP.
    * [ ] Sử dụng thành thạo các phương thức cơ bản (`append`, `pop`, `keys`, `values`).
    * [ ] Viết được 1 script sử dụng `Dictionary` để lưu thông tin người dùng.

* **Bài 3: Luồng điều khiển & Hàm**
    * [ ] Viết thành thạo các cấu trúc `if/elif/else` và vòng lặp `for`, `while`.
    * [ ] Định nghĩa hàm với `def`, tham số, giá trị trả về và type hints.
    * [ ] Hiểu và sử dụng được `*args` và `**kwargs`.
    * [ ] Viết được hàm nhận vào một `List` số và trả về `Dictionary` chứa tổng và trung bình cộng.

* **Bài 4: Pythonic Code - Sức mạnh của Comprehensions**
    * [ ] Giải thích được khái niệm "Pythonic Way".
    * [ ] Viết lại được vòng lặp `for` đơn giản bằng `List Comprehension`.
    * [ ] Xây dựng được `Dictionary` từ hai `List` bằng `Dict Comprehension`.
    * [ ] Sử dụng được biểu thức `lambda` cho các hàm đơn giản.

* **Bài 5: Modules, Packages & Xử lý File**
    * [ ] Tổ chức code thành các file (modules) và import chúng.
    * [ ] Hiểu cách `import` hoạt động so với `require`/`include` của PHP.
    * [ ] Đọc và ghi file text một cách an toàn bằng `with open(...)`.
    * [ ] Xử lý dữ liệu JSON (đọc từ file, ghi ra file) bằng thư viện `json`.

* **Bài 6: Lập trình Hướng đối tượng (OOP) trong Python**
    * [ ] Định nghĩa `class`, phương thức khởi tạo `__init__`, và `self`.
    * [ ] So sánh `__init__` với `__construct` và `self` với `$this`.
    * [ ] Triển khai được tính kế thừa giữa các class.
    * [ ] Xây dựng được class `User` và `Product` với các thuộc tính và phương thức cơ bản.

---
#### **Phần 2: Python nâng cao & Làm việc với dữ liệu (5 bài)**

* **Bài 7: Xử lý ngoại lệ & Debugging**
    * [ ] Sử dụng `try...except...finally` để xử lý lỗi.
    * [ ] So sánh được `try...except` với `try...catch` của PHP.
    * [ ] Tự tạo và `raise` một exception tùy chỉnh.
    * [ ] Sử dụng được `breakpoint()` hoặc debugger của IDE để kiểm tra giá trị biến.

* **Bài 8: Decorators & Generators**
    * [ ] Hiểu khái niệm Decorator và viết được một decorator đơn giản (ví dụ: đo thời gian chạy hàm).
    * [ ] Hiểu khái niệm Generator và lợi ích về bộ nhớ.
    * [ ] Viết được một generator function đơn giản bằng `yield`.
    * [ ] Phân biệt được khi nào nên dùng Decorator, khi nào dùng Generator.

* **Bài 9: Lập trình Bất đồng bộ - Async/Await**
    * [ ] Giải thích được khái niệm I/O-bound và tại sao cần async.
    * [ ] Viết được hàm bất đồng bộ với `async def` và gọi bằng `await`.
    * [ ] Sử dụng `asyncio.gather` để chạy nhiều tác vụ async song song.
    * [ ] Chuyển một hàm đọc file đồng bộ sang bất đồng bộ.

* **Bài 10: Giới thiệu SQLAlchemy Core & ORM**
    * [ ] Kết nối tới CSDL (SQLite/PostgreSQL) bằng SQLAlchemy.
    * [ ] Định nghĩa được một bảng bằng SQLAlchemy Core.
    * [ ] Định nghĩa được một model bằng SQLAlchemy ORM.
    * [ ] Thực hiện các truy vấn CRUD cơ bản bằng cả Core và ORM.

* **Bài 11: Alembic - Quản lý Database Migrations**
    * [ ] Cài đặt và cấu hình Alembic cho project.
    * [ ] So sánh được Alembic với Doctrine/Eloquent Migrations.
    * [ ] Tạo được một migration mới để thêm bảng hoặc cột.
    * [ ] Thực thi (`upgrade`) và hoàn tác (`downgrade`) migration.

---
#### **Phần 3: Xây dựng API với FastAPI (7 bài)**

* **Bài 12: Giới thiệu FastAPI & Routing cơ bản**
    * [ ] Cài đặt FastAPI và Uvicorn.
    * [ ] Tạo API "Hello World" và chạy thành công.
    * [ ] Hiểu và sử dụng được các HTTP method decorators (`@app.get`, `@app.post`, ...).
    * [ ] Xử lý được Path Parameters (tham số trên đường dẫn).

* **Bài 13: Request & Response**
    * [ ] Xử lý được Query Parameters (tham số truy vấn).
    * [ ] Nhận và xử lý được Request Body.
    * [ ] Tùy chỉnh được Status Code và Response Headers.
    * [ ] Trả về các loại Response khác nhau (ví dụ: `JSONResponse`).

* **Bài 14: Pydantic - Validation dữ liệu**
    * [ ] Định nghĩa được một Pydantic model để validate Request Body.
    * [ ] Xử lý và trả về lỗi validation một cách tường minh.
    * [ ] Sử dụng được các kiểu dữ liệu và validation nâng cao (email, url, ...).
    * [ ] Hiểu vai trò của Pydantic trong việc tạo tài liệu API tự động.

* **Bài 15: Dependency Injection**
    * [ ] Hiểu được khái niệm và lợi ích của Dependency Injection (DI).
    * [ ] Viết được một dependency đơn giản (ví dụ: hàm kiểm tra `User-Agent`).
    * [ ] Sử dụng `Depends` để inject dependency vào route.
    * [ ] Tạo được dependency dùng chung có `yield` (ví dụ: quản lý session DB).

* **Bài 16: Tích hợp SQLAlchemy với FastAPI**
    * [ ] Cấu trúc project FastAPI để làm việc với CSDL.
    * [ ] Tạo dependency để quản lý session DB cho mỗi request.
    * [ ] Xây dựng được API CRUD hoàn chỉnh cho một tài nguyên (ví dụ: `Product`).
    * [ ] Chuyển các endpoint CRUD sang dạng bất đồng bộ.

* **Bài 17: Xác thực & Phân quyền với JWT**
    * [ ] Hiểu quy trình hoạt động của JWT.
    * [ ] Tạo endpoint `/login` để sinh access token.
    * [ ] Viết dependency để xác thực token và lấy thông tin user hiện tại.
    * [ ] Bảo vệ được một route, chỉ cho phép user đã đăng nhập truy cập.

* **Bài 18: Testing & Deployment**
    * [ ] Cài đặt Pytest và viết unit test cho một hàm logic.
    * [ ] Sử dụng `TestClient` để viết integration test cho các API endpoint.
    * [ ] Viết được `Dockerfile` để đóng gói ứng dụng FastAPI.
    * [ ] Triển khai ứng dụng bằng Docker Compose.

---
#### **Phần 4: AI với Claude & Langchain (7 bài)**

* **Bài 19: Giao tiếp trực tiếp với Claude SDK**
    * [ ] Lấy được API key và cài đặt thư viện `anthropic`.
    * [ ] Gửi thành công một prompt tới Claude qua API `messages.create`.
    * [ ] Xử lý được phản hồi từ Claude (cả dạng thường và streaming).
    * [ ] Xây dựng một script hỏi-đáp dòng lệnh đơn giản với Claude.

* **Bài 20: Giới thiệu Langchain & Tích hợp Claude**
    * [ ] Hiểu vai trò của Langchain (abstraction layer).
    * [ ] Cài đặt Langchain và tích hợp Claude bằng `ChatAnthropic`.
    * [ ] Hiểu và sử dụng được `PromptTemplate` để chuẩn hóa đầu vào.
    * [ ] Xây dựng được `LLMChain` đầu tiên với Claude.

* **Bài 21: Langchain Chains & Memory**
    * [ ] Sử dụng `SequentialChain` để nối các bước xử lý.
    * [ ] Hiểu khái niệm Memory (bộ nhớ) trong chatbot.
    * [ ] Tích hợp `ConversationBufferMemory` để chatbot có thể nhớ ngữ cảnh.
    * [ ] Xây dựng một chatbot có khả năng trò chuyện nhiều lượt.

* **Bài 22: Retrieval-Augmented Generation (RAG) - Phần 1**
    * [ ] Hiểu được vấn đề mà RAG giải quyết (ảo giác, kiến thức giới hạn).
    * [ ] Sử dụng Document Loaders để đọc dữ liệu từ file (`.txt`, `.pdf`).
    * [ ] Sử dụng Text Splitters để chia nhỏ văn bản.
    * [ ] Hiểu khái niệm Embeddings và tạo được embeddings cho văn bản.

* **Bài 23: Retrieval-Augmented Generation (RAG) - Phần 2**
    * [ ] Hiểu vai trò của Vector Store (cơ sở dữ liệu vector).
    * [ ] Lưu trữ được embeddings vào một Vector Store (ví dụ: FAISS, ChromaDB).
    * [ ] Tạo được một `retriever` để tìm kiếm thông tin liên quan.
    * [ ] Xây dựng được một chuỗi RAG hoàn chỉnh (`RetrievalQA`).

* **Bài 24: Langchain Agents & Tools**
    * [ ] Hiểu khái niệm Agent (bộ não) và Tool (công cụ).
    * [ ] Cung cấp cho Agent một Tool (ví dụ: tool tìm kiếm trên Google).
    * [ ] Quan sát được quá trình suy nghĩ (thought process) của Agent.
    * [ ] Xây dựng được một Agent có thể trả lời các câu hỏi về sự kiện gần đây.

* **Bài 25: Project Cuối Khóa - Xây dựng API AI hoàn chỉnh**
    * [ ] Tạo một project FastAPI mới.
    * [ ] Xây dựng endpoint `/chat/rag` nhận câu hỏi và trả lời dựa trên một tài liệu cho trước bằng RAG.
    * [ ] Xây dựng endpoint `/chat/memory` để tạo một chatbot có nhớ ngữ cảnh.
    * [ ] Tích hợp thành công logic Langchain vào bên trong API FastAPI.