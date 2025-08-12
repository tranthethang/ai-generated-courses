# Roadmap Khóa Học Python + FastAPI + Langchain (25 Bài Học)

Dưới đây là roadmap được tạo lại với đúng 25 bài học, được chia thành 5 module. Mỗi bài học bao gồm tên rõ ràng và checklist các target (mục tiêu học tập), được thiết kế để tận dụng kinh nghiệm PHP senior của bạn (so sánh syntax, concepts như OOP, API routing). Các target được trình bày dưới dạng checklist để dễ theo dõi và kiểm tra tiến độ. Roadmap từ đơn giản (cơ bản Python) đến nâng cao (tích hợp AI), với mỗi bài tập trung vào kỹ năng thực hành.

#### Module 1: Python Cơ Bản (Bài 1-6)
- **Bài 1: Giới thiệu Python và Cài Đặt Môi Trường**
  - [ ] Hiểu lịch sử và ưu điểm Python so với PHP (ví dụ: readability cao hơn).
  - [ ] Cài đặt Python, venv (tương tự Composer), và pip cho quản lý packages.
  - [ ] Chạy script đầu tiên và thiết lập IDE (VS Code hoặc PyCharm).
  - [ ] So sánh môi trường phát triển Python với PHP (không cần server như Apache).

- **Bài 2: Biến, Kiểu Dữ Liệu và Cấu Trúc Dữ Liệu Cơ Bản**
  - [ ] Khai báo biến động (không cần $ như PHP) và kiểu dữ liệu cơ bản (int, str, bool).
  - [ ] Sử dụng list, dict, set, tuple (so sánh với arrays PHP: associative vs indexed).
  - [ ] Thực hành operations như slicing, adding/removing elements.
  - [ ] Hiểu mutable vs immutable (ví dụ: tuple bất biến như const array).

- **Bài 3: Cấu Trúc Điều Khiển và Hàm**
  - [ ] Viết if-elif-else, for/while loops (indentation thay vì {} như PHP).
  - [ ] Định nghĩa hàm với def, parameters, return values, *args/**kwargs.
  - [ ] So sánh hàm Python với PHP functions (type hints tương tự PHP 7+).
  - [ ] Áp dụng comprehensions cho loops ngắn gọn (Pythonic way).

- **Bài 4: Modules, Packages và Xử Lý File**
  - [ ] Import modules và tạo packages (tương tự include/require PHP).
  - [ ] Đọc/ghi file với open(), with statement (an toàn hơn PHP fopen).
  - [ ] Xử lý JSON và CSV (json module so với json_encode/decode PHP).
  - [ ] Tổ chức code thành modules cho dự án lớn.

- **Bài 5: Xử Lý Lỗi và Ngoại Lệ**
  - [ ] Sử dụng try-except-finally-else (so sánh với try-catch PHP).
  - [ ] Raise custom exceptions và xử lý lỗi cụ thể (ZeroDivisionError, etc.).
  - [ ] Debug cơ bản với print và pdb (tương tự var_dump/debug_backtrace PHP).
  - [ ] Áp dụng trong script thực tế để tránh crash.

- **Bài 6: Lập Trình Hướng Đối Tượng**
  - [ ] Tạo class với __init__, methods, self (so sánh với $this PHP).
  - [ ] Kế thừa, polymorphism, encapsulation (public/private so với PHP traits).
  - [ ] So sánh OOP Python với PHP (dunder methods như __str__).
  - [ ] Xây dựng class đơn giản như User hoặc Product.

#### Module 2: Python Nâng Cao (Bài 7-11)
- **Bài 7: Decorators, Generators, Lambda và List Comprehensions**
  - [ ] Viết decorators (@syntax) cho functions (tương tự PHP closures với attributes).
  - [ ] Sử dụng generators (yield) cho lazy evaluation (tiết kiệm memory).
  - [ ] Lambda functions và comprehensions (shortcuts so với PHP array_map).
  - [ ] Áp dụng trong code thực tế để tối ưu (ví dụ: filter data).

- **Bài 8: Quản Lý Môi Trường và Packages**
  - [ ] Sử dụng virtualenv, pipenv cho isolation (so với Composer dependencies).
  - [ ] Install và manage third-party packages (requests, etc.).
  - [ ] Tạo requirements.txt và setup.py cho dự án.
  - [ ] So sánh với PHP vendor management.

- **Bài 9: Lập Trình Bất Đồng Bộ và Multithreading**
  - [ ] Hiểu async/await với asyncio (so với PHP async extensions như Swoole).
  - [ ] Sử dụng threading/multiprocessing cho parallel tasks.
  - [ ] Xử lý I/O-bound vs CPU-bound (ví dụ: API calls async).
  - [ ] Áp dụng trong script để tăng tốc độ.

- **Bài 10: Xử Lý Dữ Liệu Cơ Bản**
  - [ ] Giới thiệu NumPy cho arrays và operations (math nhanh hơn PHP).
  - [ ] Pandas cho dataframes và manipulation (so với PHP arrays for data).
  - [ ] Đọc/analyze CSV/Excel files đơn giản.
  - [ ] Visualize cơ bản với Matplotlib.

- **Bài 11: Testing và Debugging**
  - [ ] Viết unit tests với pytest (so sánh với PHPUnit).
  - [ ] Mock objects và integration tests.
  - [ ] Debug nâng cao với breakpoints và logging.
  - [ ] Đảm bảo code coverage cơ bản.

#### Module 3: FastAPI Cơ Bản đến Nâng Cao (Bài 12-17)
- **Bài 12: Giới thiệu FastAPI, Cài Đặt và Pydantic**
  - [ ] Hiểu FastAPI advantages (async, auto-docs so với Laravel routing).
  - [ ] Cài đặt và chạy app đầu tiên với uvicorn.
  - [ ] Sử dụng Pydantic cho models và validation (so với PHP form requests).
  - [ ] Tạo endpoint cơ bản.

- **Bài 13: Routing, Request/Response, Parameters và Body Data**
  - [ ] Định nghĩa routes với path/query params (so với PHP routes).
  - [ ] Xử lý request body và responses (JSON, status codes).
  - [ ] Validate data với Pydantic schemas.
  - [ ] Build simple CRUD endpoints.

- **Bài 14: Dependency Injection, Middleware và Async Endpoints**
  - [ ] Sử dụng dependencies cho reusable code (so với PHP middleware).
  - [ ] Viết middleware cho logging/CORS.
  - [ ] Chuyển endpoints sang async cho performance.
  - [ ] Áp dụng trong API thực tế.

- **Bài 15: Xác Thực và Phân Quyền**
  - [ ] Triển khai JWT/OAuth (so với PHP auth libraries).
  - [ ] Endpoint login/register và protect routes.
  - [ ] Role-based access (admin/user).
  - [ ] Integrate với dependencies.

- **Bài 16: Kết Nối Cơ Sở Dữ Liệu**
  - [ ] Sử dụng SQLAlchemy ORM cho DB (so với Eloquent PHP).
  - [ ] Migrations với Alembic.
  - [ ] CRUD operations async với DB (PostgreSQL/MySQL).
  - [ ] Handle relationships (one-to-many).

- **Bài 17: Testing API và Tài Liệu Tự Động**
  - [ ] Test endpoints với TestClient và pytest.
  - [ ] Sử dụng Swagger/OpenAPI docs tự động.
  - [ ] Mock DB và dependencies cho tests.
  - [ ] Đảm bảo API robust.

#### Module 4: Triển Khai và Tối Ưu FastAPI (Bài 18-21)
- **Bài 18: Triển Khai Ứng Dụng FastAPI**
  - [ ] Deploy với Docker và Uvicorn/Gunicorn.
  - [ ] Set up production server (Heroku/AWS).
  - [ ] Handle environment variables (.env).
  - [ ] Monitor và logging cơ bản.

- **Bài 19: Tối Ưu Hiệu Suất và Bảo Mật**
  - [ ] Caching với Redis (so với PHP Memcached).
  - [ ] Rate limiting và security headers.
  - [ ] Optimize queries và async performance.
  - [ ] Scan vulnerabilities (OWASP).

- **Bài 20: Tích Hợp Các Thành Phần Khác**
  - [ ] Handle file uploads/downloads (so với PHP file handling).
  - [ ] Integrate email sending (SMTP).
  - [ ] WebSockets cho real-time (so với PHP WebSockets).
  - [ ] Background tasks với Celery.

- **Bài 21: Dự Án Nhỏ: Xây Dựng API CRUD Đầy Đủ**
  - [ ] Kết hợp tất cả: DB, auth, async, testing.
  - [ ] Xây API cho app như todo list hoặc e-commerce basic.
  - [ ] Deploy và test end-to-end.
  - [ ] Review code for best practices.

#### Module 5: Langchain và Tích Hợp AI (Bài 22-25)
- **Bài 22: Giới thiệu Langchain, LLMs và Cài Đặt**
  - [ ] Hiểu Langchain framework và LLMs (OpenAI/Gemini).
  - [ ] Cài đặt và gọi API đầu tiên (prompts cơ bản).
  - [ ] So sánh với PHP AI integrations (nếu có).
  - [ ] Build simple chain.

- **Bài 23: Agents, Tools và Chains Phức Tạp**
  - [ ] Tạo agents với tools (external APIs).
  - [ ] SequentialChain và RouterChain.
  - [ ] Handle multi-step reasoning.
  - [ ] Áp dụng trong task như data extraction.

- **Bài 24: Memory, Embeddings và Retrieval-Augmented Generation**
  - [ ] Thêm memory cho conversations.
  - [ ] Embeddings và vector stores (FAISS/Chroma).
  - [ ] Build RAG system cho Q&A trên documents.
  - [ ] Optimize retrieval accuracy.

- **Bài 25: Tích Hợp Langchain với FastAPI và Dự Án Cuối**
  - [ ] Xây API AI với FastAPI + Langchain (chatbot endpoint).
  - [ ] Deploy full app (AI-powered API).
  - [ ] Handle errors và scaling.
  - [ ] Dự án cuối: Chatbot RAG cho knowledge base.