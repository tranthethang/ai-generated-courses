# Roadmap Học Python + FastAPI + Langchain (25 Bài)

### Module 1: Python Cơ Bản (5 bài)

**Bài 1: Giới thiệu Python và Cài Đặt Môi Trường**

- Cài đặt Python, pip, virtualenv
- So sánh môi trường Python với PHP
- Viết script đơn giản “Hello World”
**Target:**
- Hiểu cách thiết lập môi trường Python
- Hiểu sự khác biệt về môi trường với PHP

**Bài 2: Biến, Kiểu Dữ Liệu và Toán Tử Cơ Bản**

- Các kiểu dữ liệu numbers, strings, booleans
- Cách khai báo biến trong Python
- Toán tử số học, logic, so sánh
**Target:**
- Khai báo biến và sử dụng kiểu dữ liệu trong Python
- Thực hiện toán tử cơ bản và nhận biết khác biệt với PHP

**Bài 3: Cấu Trúc Điều Khiển và Hàm**

- Câu lệnh điều khiển if-elif-else
- Vòng lặp for/in, while
- Định nghĩa hàm, tham số, trả về, type hints
- Khái niệm *args, **kwargs, list comprehension
**Target:**
- Viết các cấu trúc điều khiển và vòng lặp trong Python
- Xây dựng hàm đa dạng, sử dụng type hints và args kwargs

**Bài 4: Danh Sách, Tuple, Dictionary và Set**

- Khai thác list, tuple, dict, set
- Các phương thức thao tác dữ liệu thường dùng
- So sánh với arrays trong PHP
**Target:**
- Sử dụng các cấu trúc dữ liệu chính trong Python hiệu quả
- Hiểu tính bất biến của tuple và ứng dụng set

**Bài 5: Xử Lý File và Exception Handling**

- Đọc/ghi file với `with open()`
- Xử lý ngoại lệ với try-except
- So sánh cách xử lý lỗi với PHP
**Target:**
- Đọc ghi file trong Python đảm bảo an toàn resource
- Bắt và xử lý ngoại lệ để tránh crash chương trình

***

### Module 2: Python Nâng Cao (5 bài)

**Bài 6: Lập Trình Hướng Đối Tượng (OOP) trong Python**

- Khai báo class, constructor `__init__`
- Thuộc tính, phương thức, kế thừa, đóng gói
- So sánh OOP Python và PHP
**Target:**
- Xây dựng class, kế thừa và sử dụng OOP trong Python
- Hiểu khác biệt cú pháp và cách dùng `self`

**Bài 7: Modules, Packages và Quản Lý Môi Trường**

- Cách import modules, packages
- Tạo cấu trúc dự án Python chuẩn
- Virtualenv, pip so với Composer PHP
**Target:**
- Quản lý code theo module, package rõ ràng
- Thiết lập môi trường isolated với virtualenv

**Bài 8: Lập Trình Bất Đồng Bộ (Async/Await) và Đa Luồng**

- Event loop, async def, await
- Threads, multiprocessing cơ bản
**Target:**
- Viết hàm bất đồng bộ để tối ưu IO-bound tasks
- Hiểu cơ bản đa luồng và đa tiến trình trong Python

**Bài 9: Xử Lý Dữ Liệu với NumPy và Pandas (Cơ Bản)**

- Giới thiệu thư viện NumPy, Pandas
- Thao tác dữ liệu cơ bản như đọc CSV, lọc, biến đổi
**Target:**
- Sử dụng Pandas để làm việc với dữ liệu bảng
- So sánh xử lý data so với PHP

**Bài 10: Testing và Debugging trong Python**

- Sử dụng pytest, viết unit test, integration test
- Kỹ thuật debug cơ bản
- So sánh PHPUnit và pytest
**Target:**
- Viết test cho code Python đảm bảo chất lượng
- Sử dụng công cụ debug để phát hiện lỗi nhanh

***

### Module 3: Xây Dựng API với FastAPI (7 bài)

**Bài 11: Giới Thiệu FastAPI \& Pydantic**

- Khái niệm FastAPI, cài đặt và chạy server
- Validation dữ liệu với Pydantic models
**Target:**
- Cài đặt và chạy FastAPI server đầu tiên
- Tạo request validation bằng Pydantic

**Bài 12: Routing, Request/Response, Path \& Query Parameters**

- Tạo endpoint với path, query params
- Trả response có status code và header
**Target:**
- Hiểu và xử lý tham số URL trên FastAPI
- Xây dựng response phù hợp với REST

**Bài 13: Request Body, Validation Nâng Cao và Response Tùy Chỉnh**

- JSON body request, nested models
- Custom response status code, headers
**Target:**
- Viết API nhận dữ liệu phức tạp, validate nghiêm ngặt
- Tùy chỉnh response với các trạng thái HTTP khác nhau

**Bài 14: Dependency Injection và Middleware**

- Sử dụng DI để quản lý dependency trong FastAPI
- Viết middleware xử lý log, CORS, xác thực
**Target:**
- Áp dụng DI cho code sạch và tái sử dụng
- Hiểu và viết middleware tùy chỉnh

**Bài 15: Database Integration \& Authentication**

- Kết nối database với SQLAlchemy và Alembic migrations
- Triển khai xác thực JWT, bảo vệ API
**Target:**
- Thực hiện CRUD database với ORM
- Tạo hệ thống đăng nhập, phân quyền cơ bản

**Bài 16: Testing API và Triển Khai**

- Viết test cho API bằng TestClient và pytest
- Container hóa với Docker, deploy server ASGI
**Target:**
- Viết test bảo đảm API hoạt động đúng
- Triển khai FastAPI lên môi trường thực tế

**Bài 17: Hiệu Năng và Nâng Cao trong FastAPI**

- Caching, tối ưu query, async nâng cao
- Quản lý phiên bản API, chuẩn hóa error handling
**Target:**
- Tăng hiệu suất API với caching và async đúng cách
- Xây dựng API chuẩn, dễ bảo trì

***

### Module 4: Ứng Dụng AI với Langchain (8 bài)

**Bài 18: Giới Thiệu Langchain và Mô Hình Ngôn Ngữ Lớn (LLMs)**

- Các thành phần: Chains, Agents, Prompt Templates
- Kết nối API LLM (OpenAI, v.v.)
**Target:**
- Hiểu cấu trúc Langchain và mô hình LLM cơ bản
- Kết nối API và gọi mô hình LLM thành công

**Bài 19: Xây Dựng Chains Phức Tạp với Langchain**

- SimpleSequentialChain, RouterChain, chaining logic
**Target:**
- Tạo các chuỗi xử lý NLP phức tạp và đa bước

**Bài 20: Retrieval Augmented Generation (RAG) \& Vector Stores**

- Embeddings, vector databases (FAISS, ChromaDB)
- Tạo ứng dụng hỏi đáp trên tài liệu riêng
**Target:**
- Áp dụng RAG để tăng hiệu quả trả lời câu hỏi
- Lưu và truy vấn embeddings từ vector store

**Bài 21: Tích Hợp Langchain với FastAPI**

- Xây dựng API AI tích hợp Langchain và FastAPI
**Target:**
- Xây dựng API AI real-time, giao tiếp giữa Langchain và FastAPI

**Bài 22: Memory và Agents Nâng Cao trong Langchain**

- Quản lý trạng thái, sử dụng Agents, tích hợp công cụ ngoài
**Target:**
- Xây dựng ứng dụng AI với trạng thái và agent linh hoạt

**Bài 23: Custom Chains và Ứng Dụng Thực Tế**

- Viết chain tùy chỉnh, áp dụng vào các use case cụ thể
**Target:**
- Tạo chain phù hợp cho bài toán phức tạp, mở rộng Langchain

**Bài 24: Testing và Triển Khai Ứng Dụng AI**

- Kiểm thử Langchain, triển khai dịch vụ AI production
**Target:**
- Đảm bảo chất lượng, deploy ứng dụng AI ổn định, an toàn

**Bài 25: Dự Án Cuối Khóa - Chatbot AI tích hợp Python + FastAPI + Langchain**

- Phân tích yêu cầu, kiến trúc, hiện thực chatbot đa chức năng
- Tích hợp xác thực, database, và các tính năng mở rộng
**Target:**
- Hoàn thiện một dự án thực tế, ứng dụng tổng thể kiến thức đã học
- Triển khai hệ thống chatbot AI hoàn chỉnh và vận hành được

