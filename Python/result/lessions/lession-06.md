# Bài 6: Lập Trình Hướng Đối Tượng (OOP) trong Python

## 📋 Thông tin Bài học

- **Module:** Module 1: Python Foundations for PHP Veterans
- **Thời gian:** 4 giờ
- **Độ khó:** ⭐⭐⭐⭐
- **Prerequisites:** Bài 1-5 (Cú pháp, cấu trúc dữ liệu, luồng điều khiển, hàm, modules)

---

## 🎯 Mục tiêu Bài học

### Sau khi hoàn thành bài này, học viên sẽ:

- [ ] So sánh và ánh xạ các khái niệm OOP cốt lõi từ PHP sang Python
- [ ] Định nghĩa class, khởi tạo đối tượng, và sử dụng các thuộc tính (attributes) cùng phương thức (methods)
- [ ] Áp dụng các nguyên lý OOP như kế thừa (inheritance), đa hình (polymorphism), và đóng gói (encapsulation) trong Python
- [ ] Nắm vững cách sử dụng các decorator quan trọng như `@property`, `@classmethod`, và `@staticmethod`
- [ ] Chuyển đổi và refactor các class trong PHP sang cấu trúc OOP chuẩn của Python
- [ ] Thiết kế và xây dựng một hệ thống class hierarchy phức tạp cho ứng dụng web thực tế

---

## 🔑 Key Points (Khái niệm Quan trọng)

### 1\. Class & Objects

**PHP Comparison:** Tương tự `class` và `new` trong PHP. Python sử dụng cú pháp `class ClassName:` và không cần `()` khi khởi tạo đối tượng nếu không có tham số, ví dụ `my_object = ClassName()`.
**Python Implementation:** - Định nghĩa class bằng từ khóa `class`.

- Phương thức khởi tạo là `__init__(self, ...)` thay vì `__construct(..)` trong PHP.
- `self` là tham chiếu tới instance hiện tại, tương đương với `$this` trong PHP.
  **Example:**

<!-- end list -->

```python
# Ví dụ đơn giản về một class "User"
class User:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def get_info(self) -> str:
        return f"User name: {self.name}, Email: {self.email}"
```

### 2\. Properties & Methods

**PHP Comparison:** Thuộc tính (property) của class trong PHP được khai báo với các scope như `public`, `protected`, `private`. Trong Python, thuộc tính thường được đặt công khai theo quy ước. Các phương thức (method) trong Python cũng tương tự functions trong class PHP.
**Python Implementation:** - Thuộc tính được tạo trong phương thức `__init__` bằng cách gán giá trị cho `self.attribute_name`.

- Các phương thức là các hàm được định nghĩa trong class.
- Python không có các từ khóa `public`, `protected`, `private` rõ ràng như PHP. Thay vào đó, chúng ta sử dụng quy ước:
  - `_attribute_name`: quy ước là `protected` (không nên truy cập từ bên ngoài class).
  - `__attribute_name`: Python tự động "name mangling" thành `_ClassName__attribute_name` để ngăn truy cập trực tiếp từ bên ngoài.
    **Example:**

<!-- end list -->

```python
class Account:
    def __init__(self, owner: str, __balance: float):
        self.owner = owner
        self.__balance = __balance # Quy ước private

    def get_balance(self):
        return self.__balance
```

### 3\. Kế thừa (Inheritance) & Đa hình (Polymorphism)

**PHP Comparison:** Tương tự `class Child extends Parent`. Python sử dụng cú pháp `class Child(Parent):`. Đa hình trong Python cũng hoạt động tương tự PHP, cho phép các đối tượng của các class khác nhau phản ứng với cùng một phương thức.
**Python Implementation:** - Class con được định nghĩa với class cha trong ngoặc đơn: `class Child(Parent):`.

- Gọi phương thức của class cha bằng `super().__init__()` thay vì `parent::__construct()` trong PHP.
- Đa hình thể hiện ở việc các class con có thể override (ghi đè) phương thức của class cha.
  **Example:**

<!-- end list -->

```python
class Employee(User):
    def __init__(self, name: str, email: str, role: str):
        super().__init__(name, email)
        self.role = role

    def get_info(self) -> str: # Override method
        return f"Employee: {self.name}, Role: {self.role}"
```

### 4\. `@property` Decorator

**PHP Comparison:** `@property` decorator cho phép bạn tạo ra các "thuộc tính ảo" (virtual properties) tương tự việc sử dụng `__get()` và `__set()` magic methods trong PHP. Nó giúp bạn truy cập phương thức như thể đó là một thuộc tính của đối tượng.
**Python Implementation:** - Dùng `@property` để định nghĩa getter cho một thuộc tính.

- Dùng `@attribute_name.setter` để định nghĩa setter.
- Giúp code sạch sẽ, dễ đọc hơn, ẩn đi logic phức tạp đằng sau việc truy cập thuộc tính.
  **Example:**

<!-- end list -->

```python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius

    @property
    def diameter(self):
        return self._radius * 2

    @diameter.setter
    def diameter(self, value):
        if value < 0:
            raise ValueError("Diameter cannot be negative")
        self._radius = value / 2
```

### 5\. Class Methods & Static Methods

**PHP Comparison:** Tương tự `static function` trong PHP, nhưng Python có hai loại riêng biệt với ý nghĩa khác nhau.
**Python Implementation:**

- **`@classmethod`:** Phương thức này nhận `cls` (tham chiếu tới class) làm tham số đầu tiên, thay vì `self` (tham chiếu tới instance). Nó thường được dùng để tạo các **constructor thay thế** (alternative constructors) hoặc thao tác với thuộc tính của class.
- **`@staticmethod`:** Phương thức này không nhận `self` hay `cls` làm tham số đầu tiên. Nó giống như một hàm độc lập được đặt trong class chỉ để nhóm logic lại với nhau một cách hợp lý.
  **Example:**

<!-- end list -->

```python
class UserAccount:
    ROLE_MEMBER = 'member'

    @classmethod
    def create_member(cls, name: str):
        # Đây là một alternative constructor
        return cls(name, cls.ROLE_MEMBER)

    @staticmethod
    def is_valid_email(email: str):
        # Không cần truy cập instance hay class
        return "@" in email
```

---

## 📚 Lý thuyết Chi tiết

### Class & Object: Chuyển đổi từ PHP sang Python

Trong PHP, bạn đã quen thuộc với việc định nghĩa một class và sử dụng `new` để tạo một đối tượng. Các thuộc tính được khai báo với `$this->` và các phương thức được gọi với `->`.

| PHP                                               | Python                                                        | Ghi chú                                             |
| ------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| `class User { public function __construct() {} }` | `class User:`                                                 | Python sử dụng indentation thay `{}`                |
| `class User { public string $name; }`             | `class User: def __init__(self, name: str): self.name = name` | Thuộc tính được khởi tạo trong `__init__`           |
| `$this->name`                                     | `self.name`                                                   | `$this` của PHP tương đương với `self` trong Python |
| `parent::__construct()`                           | `super().__init__()`                                          | Cách gọi constructor của class cha                  |
| `User::$variable`                                 | `User.variable`                                               | Truy cập thuộc tính static của class                |

**Best Practices:**

- ✅ **Sử dụng `__init__` để khởi tạo đối tượng:** `__init__` là phương thức "dunder" (double underscore) được gọi tự động khi một đối tượng được tạo, giúp bạn thiết lập trạng thái ban đầu của đối tượng.
- ✅ **Sử dụng `self`:** Luôn luôn đặt `self` làm tham số đầu tiên cho tất cả các phương thức của instance. `self` là quy ước, bạn có thể đặt tên khác nhưng điều đó không được khuyến khích.
- ❌ **Tránh khởi tạo thuộc tính ngoài `__init__`:** Mặc dù Python cho phép bạn thêm thuộc tính vào đối tượng bất cứ lúc nào, nhưng tốt nhất nên định nghĩa tất cả các thuộc tính cần thiết trong `__init__` để code dễ đọc và dễ bảo trì hơn.

### Kế thừa (Inheritance) & Đa hình (Polymorphism): Xây dựng hệ thống class hierarchy

Kế thừa là một trong những trụ cột của OOP, cho phép bạn tạo một class mới (child class) kế thừa thuộc tính và phương thức từ một class hiện có (parent class). Điều này giúp giảm thiểu code lặp lại và tạo ra một cấu trúc logic hơn cho ứng dụng của bạn.

Trong PHP, bạn thường làm như thế này:

```php
<?php
class Vehicle {
    protected string $brand;
    public function __construct(string $brand) {
        $this->brand = $brand;
    }
    public function getBrand() {
        return $this->brand;
    }
}
class Car extends Vehicle {
    private int $doors;
    public function __construct(string $brand, int $doors) {
        parent::__construct($brand);
        $this->doors = $doors;
    }
}
```

Và trong Python:

```python
class Vehicle:
    def __init__(self, brand: str):
        self.brand = brand

    def get_brand(self) -> str:
        return self.brand

class Car(Vehicle):
    def __init__(self, brand: str, doors: int):
        super().__init__(brand) # Gọi constructor của class cha
        self.doors = doors
```

Lưu ý cách Python sử dụng `super().__init__()` để gọi constructor của class cha một cách tường minh, giúp code dễ hiểu hơn.

### Encapsulation, Properties & Decorators: Điều khiển truy cập và logic

**Encapsulation** (đóng gói) là nguyên lý ẩn đi các chi tiết triển khai và chỉ lộ ra các interface cần thiết. Trong PHP, bạn có các từ khóa `public`, `protected`, `private`. Python không có các từ khóa này một cách cứng nhắc.

- **`_` (single underscore):** Quy ước thuộc tính/phương thức này là `protected`, chỉ nên được truy cập trong class đó và các class con.
- **`__` (double underscore):** Python sẽ "name mangling" (biến đổi tên) thuộc tính/phương thức này thành `_ClassName__attribute` để ngăn truy cập trực tiếp từ bên ngoài.
- **`@property`:** Đây là cách "Pythonic" nhất để đóng gói. Thay vì viết getter/setter thủ công như trong PHP, bạn dùng `@property` để biến một phương thức thành một thuộc tính, giúp code của bạn trông sạch sẽ hơn rất nhiều. Điều này đặc biệt hữu ích khi bạn cần thêm logic vào việc đọc/ghi thuộc tính (ví dụ: validation, transformation).

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `private $data;` | `self.__data` | Python không có từ khóa `private` |
| `public function getData() { return $this->data; }` | `@property def data(self): return self.__data` | `@property` là cách elegant để tạo getter |
| `public function setData($value) { $this->data = $value; }` | `@data.setter def data(self, value): self.__data = value` | `@attribute.setter` định nghĩa setter một cách rõ ràng |

**Best Practices:**

- ✅ **Sử dụng `__` cho các thuộc tính cần được bảo vệ nghiêm ngặt:** Name mangling là một cơ chế mạnh mẽ để ngăn việc vô tình thay đổi trạng thái của đối tượng từ bên ngoài.
- ✅ **Sử dụng `@property` khi cần logic phức tạp:** Nếu việc truy cập một thuộc tính chỉ đơn giản là trả về giá trị, bạn không cần dùng `@property`. Nhưng nếu bạn cần validation, tính toán, hoặc logic khác, `@property` là lựa chọn hoàn hảo.
- ❌ **Tránh truy cập trực tiếp các thuộc tính "private":** Tránh làm `my_object._Circle__radius` (mặc dù vẫn có thể) vì điều này phá vỡ nguyên tắc đóng gói và khiến code khó bảo trì.

---

## 💻 Code Examples & Demos

### Demo 1: Class `User` & Kế thừa

**Scenario:** Xây dựng một hệ thống quản lý user cơ bản với các class `User`, `Admin` và `Guest`.

```python
# class cha
class User:
    """Base class for all users in the system."""

    def __init__(self, username: str, email: str, role: str = 'user'):
        self.username = username
        self.email = email
        self.role = role
        print(f"User {self.username} created with role {self.role}.")

    def get_profile(self) -> dict:
        """Returns the user's profile information."""
        return {
            'username': self.username,
            'email': self.email,
            'role': self.role
        }

    def __str__(self):
        return f"User(username='{self.username}', role='{self.role}')"

# class con kế thừa từ User
class Admin(User):
    """Admin class with special privileges."""

    def __init__(self, username: str, email: str):
        # Gọi constructor của class cha với role 'admin'
        super().__init__(username, email, role='admin')

    def ban_user(self, other_user: User):
        """Allows an admin to ban another user."""
        print(f"Admin {self.username} has banned user {other_user.username}.")

# Một class con khác
class Guest(User):
    """Guest class with limited permissions."""

    def __init__(self, username: str = 'anonymous'):
        super().__init__(username, email='guest@example.com', role='guest')

    def get_profile(self) -> dict:
        # Override phương thức của class cha để ẩn thông tin nhạy cảm
        return {
            'username': self.username,
            'role': self.role
        }

# Sử dụng các class
user1 = User("john_doe", "john@example.com")
admin1 = Admin("admin_user", "admin@example.com")
guest1 = Guest()

print(user1.get_profile())
print(admin1.get_profile())
print(guest1.get_profile())
admin1.ban_user(user1)

# Đa hình trong thực tế
users = [user1, admin1, guest1]
for u in users:
    print(u) # Dùng phương thức __str__ đã override
```

**PHP Equivalent:**

```php
<?php
class User {
    protected string $username;
    protected string $email;
    protected string $role;

    public function __construct(string $username, string $email, string $role = 'user') {
        $this->username = $username;
        $this->email = $email;
        $this->role = $role;
    }
    public function getProfile(): array {
        return ['username' => $this->username, 'role' => $this->role];
    }
}
class Admin extends User {
    public function __construct(string $username, string $email) {
        parent::__construct($username, $email, 'admin');
    }
}
$user = new User('john_doe', 'john@example.com');
$admin = new Admin('admin_user', 'admin@example.com');
```

### Demo 2: Sử dụng `@property` cho Validation

**Scenario:** Xây dựng một class `Product` trong một hệ thống thương mại điện tử, trong đó giá và số lượng phải luôn dương.

```python
class Product:
    def __init__(self, name: str, price: float, quantity: int):
        # Gán giá trị thông qua setter để đảm bảo validation
        self.name = name
        self.price = price
        self.quantity = quantity

    @property
    def price(self) -> float:
        """The price of the product."""
        return self._price

    @price.setter
    def price(self, value: float):
        if value < 0:
            raise ValueError("Price cannot be negative.")
        # Dùng convention _price để tránh lặp vô hạn
        self._price = value

    @property
    def quantity(self) -> int:
        """The number of items in stock."""
        return self._quantity

    @quantity.setter
    def quantity(self, value: int):
        if value < 0:
            raise ValueError("Quantity cannot be negative.")
        self._quantity = value

    @property
    def total_value(self) -> float:
        """Calculates the total value of the inventory."""
        return self.price * self.quantity

# Sử dụng class
try:
    product1 = Product("Laptop", 1200.50, 10)
    print(f"Product: {product1.name}, Total value: ${product1.total_value}")

    # Thay đổi giá trị thông qua property setter
    product1.price = 1150.00
    print(f"New price: ${product1.price}")

    # Thử gán giá trị không hợp lệ
    product1.quantity = -5
except ValueError as e:
    print(f"Error: {e}")
```

### Demo 3: `@classmethod` & `@staticmethod`

**Scenario:** Class `Request` để mô phỏng HTTP request, có thể được tạo từ các nguồn khác nhau.

```python
from typing import Dict, Any

class Request:
    def __init__(self, method: str, path: str, body: Dict[str, Any] = None):
        self.method = method
        self.path = path
        self.body = body or {}

    def __repr__(self):
        return f"Request(method='{self.method}', path='{self.path}')"

    # @classmethod: Alternative constructor
    @classmethod
    def from_json(cls, json_data: Dict[str, Any]):
        """
        Creates a Request instance from a JSON dictionary.
        This is a great use case for class methods.
        """
        method = json_data.get('method')
        path = json_data.get('path')
        body = json_data.get('body')
        if not method or not path:
            raise ValueError("JSON data must contain 'method' and 'path'")

        # Gọi constructor chính của class để tạo instance
        return cls(method, path, body)

    # @staticmethod: Utility function related to the class
    @staticmethod
    def is_valid_method(method: str) -> bool:
        """
        Checks if a given HTTP method is valid.
        Doesn't need access to instance or class state.
        """
        valid_methods = {'GET', 'POST', 'PUT', 'DELETE', 'PATCH'}
        return method.upper() in valid_methods

# Sử dụng classmethod để tạo instance
json_payload = {
    'method': 'POST',
    'path': '/api/products',
    'body': {'name': 'New Product', 'price': 99.99}
}
request_from_json = Request.from_json(json_payload)
print(request_from_json)

# Sử dụng staticmethod
print(f"Is 'POST' a valid method? {Request.is_valid_method('POST')}")
print(f"Is 'HEAD' a valid method? {Request.is_valid_method('HEAD')}")
```

### Demo 4: Xây dựng một ORM-like Model

**Scenario:** Tái tạo một phiên bản đơn giản của Eloquent ORM từ Laravel.

```python
import uuid
import json

class BaseModel:
    """A basic ORM-like model."""

    # Static property, shared across all instances
    table_name = "BaseModel"

    def __init__(self, **kwargs):
        self.id = kwargs.get('id', str(uuid.uuid4()))
        self._data = kwargs
        print(f"New model instance created with id: {self.id}")

    def save(self):
        """Saves the model to a mock database."""
        print(f"Saving model with ID {self.id} to table '{self.table_name}'")
        # In a real app, this would write to a DB
        with open(f"{self.table_name}.json", "a") as f:
            json.dump({**self._data, 'id': self.id}, f)
            f.write("\n")

    # Class method to create a model from database data
    @classmethod
    def from_db_data(cls, data: dict):
        """Creates an instance from a dictionary of database fields."""
        print(f"Creating a '{cls.table_name}' instance from DB data.")
        return cls(**data)

    @staticmethod
    def find(model_id: str):
        """Finds a model by ID (mock implementation)."""
        print(f"Searching for model with ID {model_id}...")
        # Mocking a database lookup
        return BaseModel(id=model_id, name="Found Item")

# Kế thừa BaseModel để tạo một model cụ thể
class ProductModel(BaseModel):
    table_name = "products"

    def __init__(self, name: str, price: float, **kwargs):
        # Validate data before calling parent constructor
        if price <= 0:
            raise ValueError("Price must be positive.")
        super().__init__(**kwargs)
        self.name = name
        self.price = price

    def __repr__(self):
        return f"ProductModel(id='{self.id}', name='{self.name}', price={self.price})"

# Sử dụng các model
p1 = ProductModel(name="Keyboard", price=75.50)
p1.save()

# Tạo model từ dữ liệu giả lập từ database
db_record = {'id': '123-abc', 'name': 'Mouse', 'price': 30.00}
p2 = ProductModel.from_db_data(db_record)
print(p2)

# Ví dụ về static method
found_item = ProductModel.find('456-def')
print(found_item)
```

---

## 🔨 Hands-on Exercises (3 Bài tập)

### 🥉 Bài tập 1: Xây dựng class `User` và `Role` (Cơ bản - 30 phút)

**Mô tả:** Tạo một hệ thống quản lý user và role đơn giản. Class `User` sẽ có thuộc tính `name` và `email`. Class `Role` sẽ có thuộc tính `name` và `permissions`. Một `User` có thể có nhiều `Role`.

**Yêu cầu:**

- [ ] Định nghĩa class `Role` với `name` và một list `permissions`
- [ ] Định nghĩa class `User` với `name`, `email` và một list `roles`
- [ ] Implement một phương thức `add_role()` cho class `User` để thêm một đối tượng `Role` vào danh sách `roles`
- [ ] Implement một phương thức `has_permission(permission_name)` để kiểm tra user có quyền cụ thể hay không

**PHP Context:** Tương tự việc bạn xây dựng các Eloquent Model `User` và `Role` cùng với relationship `many-to-many`. Bạn sẽ viết một phương thức `hasPermission()` trong model `User`.

**Starter Code:**

```python
class Role:
    def __init__(self, name: str, permissions: list[str]):
        # TODO: Implement this constructor
        pass

class User:
    def __init__(self, name: str, email: str):
        # TODO: Implement this constructor
        self.roles = []

    def add_role(self, role: Role):
        # TODO: Implement this method
        pass

    def has_permission(self, permission_name: str) -> bool:
        # TODO: Implement this method to check all roles
        return False

# --- Testing code ---
# admin_role = Role("admin", ["create", "edit", "delete"])
# user = User("john_doe", "john@example.com")
# user.add_role(admin_role)
# print(user.has_permission("create")) # Should be True
# print(user.has_permission("read")) # Should be False
```

**Expected Output:**

```
True
False
```

**Hints:**

- 💡 Trong phương thức `has_permission`, bạn cần lặp qua danh sách `roles` của user và kiểm tra từng `role` có chứa `permission_name` hay không.
- 💡 Sử dụng `in` operator để kiểm tra một phần tử có tồn tại trong list hay không.

### 🥈 Bài tập 2: Quản lý Thư viện sách (Trung bình - 45 phút)

**Mô tả:** Xây dựng một hệ thống quản lý thư viện sách đơn giản, sử dụng các khái niệm kế thừa và `@property`.

**Yêu cầu:**

- [ ] Tạo class cha `Book` với các thuộc tính `title`, `author`, và `isbn`.
- [ ] Tạo class con `EBook` kế thừa `Book` và có thêm thuộc tính `file_size` (kilobytes).
- [ ] Tạo class con `PrintedBook` kế thừa `Book` và có thêm thuộc tính `weight` (grams).
- [ ] Trong tất cả các class, đảm bảo các thuộc tính `title`, `author`, `isbn` không thể là chuỗi rỗng.
- [ ] Sử dụng `@property` và `@setter` để đảm bảo `file_size` và `weight` phải là số dương.
- [ ] Viết một hàm `display_book_info(book: Book)` có thể nhận cả đối tượng `EBook` và `PrintedBook` và in ra thông tin của chúng.

**PHP Context:** Trong PHP, bạn sẽ dùng `extends` và khai báo các property `private`. Để validation, bạn sẽ dùng magic method `__set()` hoặc viết setter thủ công. Trong bài này, hãy sử dụng cách tiếp cận "Pythonic" hơn với `@property`.

**Architecture Diagram:**

```
     +-----------+
     |   Book    |
     +-----------+
         ^     ^
        /       \
       /         \
+----------+   +--------------+
|  EBook   |   | PrintedBook  |
+----------+   +--------------+
```

**Implementation Steps:**

1.  Định nghĩa class `Book` với các validation đơn giản trong `__init__`.
2.  Định nghĩa hai class con `EBook` và `PrintedBook`, sử dụng `super().__init__()` để gọi constructor cha.
3.  Trong hai class con, dùng `@property` và `@setter` để validate các thuộc tính mới.
4.  Viết hàm `display_book_info` và dùng đa hình để in ra thông tin của cả hai loại sách.

**Testing:**

```python
# Create an EBook and a PrintedBook
ebook = EBook(title="Python For PHP Devs", author="Alice", isbn="978-3-16-148410-0", file_size=1024)
printed_book = PrintedBook(title="Clean Code", author="Robert C. Martin", isbn="978-0132350884", weight=500)

# The function should work for both types of books due to polymorphism
display_book_info(ebook)
display_book_info(printed_book)

# Try to create a book with an invalid weight
try:
    invalid_book = PrintedBook(title="Invalid Book", author="Test", isbn="123", weight=-100)
except ValueError as e:
    print(f"Error caught: {e}")
```

### 🥇 Bài tập 3: Xây dựng Framework HTTP Request (Nâng cao - 60 phút)

**Mô tả:** Xây dựng một phần lõi của một micro-framework HTTP bằng cách sử dụng `@classmethod` và `@staticmethod`. Bạn sẽ tạo một class `Request` và một class `Response`.

**Yêu cầu:**

- [ ] Class `Request` có các thuộc tính `method`, `path`, `headers`, và `body`.
- [ ] Class `Response` có các thuộc tính `status_code`, `headers`, và `body`.
- [ ] Trong class `Request`, hãy tạo một `@classmethod` tên là `from_raw_http_string` để phân tích một chuỗi HTTP request thô và tạo ra một đối tượng `Request` hợp lệ.
- [ ] Trong class `Response`, tạo một `@staticmethod` tên là `generate_status_message(status_code)` để trả về chuỗi mô tả của một mã trạng thái (ví dụ: `200 -> "OK"`, `404 -> "Not Found"`).
- [ ] Tạo một `@classmethod` trong `Response` tên là `json_response(data: dict, status_code: int = 200)` để tạo một đối tượng `Response` với body là JSON và header `Content-Type` phù hợp.

**Real-world Scenario:** Bạn đã quen thuộc với cách Laravel nhận một `Illuminate\Http\Request` object, hoặc cách bạn tạo một `Response` object. Bài tập này mô phỏng lại cách các framework như FastAPI, Django, hoặc Laravel làm điều đó ở level thấp hơn. `classmethod` giúp tạo các constructor thay thế cho các loại request khác nhau, còn `staticmethod` là các utility độc lập.

**Technical Requirements:**

- [ ] Phân tích header và body từ chuỗi HTTP thô
- [ ] Xử lý các lỗi nếu chuỗi request không hợp lệ
- [ ] Đảm bảo `json_response` trả về header `Content-Type: application/json`
- [ ] Xử lý các mã lỗi phổ biến như 200, 404, 500

**Solution Architecture:**

```
+---------------------------------+
|          Request class          |
+---------------------------------+
| - method: str                   |
| - path: str                     |
| - headers: dict                 |
| - body: str                     |
|                                 |
| @classmethod from_raw_http_string |
+---------------------------------+

+---------------------------------+
|         Response class          |
+---------------------------------+
| - status_code: int              |
| - headers: dict                 |
| - body: str                     |
|                                 |
| @staticmethod generate_status_message |
| @classmethod json_response       |
+---------------------------------+
```

**Bonus Challenges:**

- 🌟 Thêm một `@property` vào class `Request` để trả về `is_json` (kiểm tra xem header `Content-Type` có phải là `application/json` hay không).
- 🌟 Xây dựng một `@classmethod` khác để tạo `Request` từ một dictionary (giả lập request từ một framework test).

---

## ✅ Self-Assessment Checklist

**Trước khi chuyển sang bài tiếp theo, hãy đảm bảo bạn có thể:**

- [ ] Giải thích sự khác biệt giữa `__init__` và `__construct` (PHP)
- [ ] Chuyển đổi một class PHP đơn giản với kế thừa sang Python
- [ ] Phân biệt được khi nào sử dụng `@property`, `@classmethod`, và `@staticmethod`
- [ ] Viết một class sử dụng `super()` để gọi constructor của class cha
- [ ] Đọc và hiểu các class trong các framework Python (như Django Models, FastAPI Pydantic Models)
- [ ] Thiết kế một class hierarchy đơn giản cho một bài toán thực tế

---

## 🔗 Resources & Further Reading

### Essential Resources:

- 📖 **The Python `class` statement documentation:** [https://docs.python.org/3/tutorial/classes.html](https://docs.python.org/3/tutorial/classes.html)
- 🎥 **Video tutorial on Python OOP:** Tìm kiếm "Python Object-Oriented Programming" trên YouTube để có các hướng dẫn trực quan.
- 📝 **Real Python's OOP course:** [https://realpython.com/python3-object-oriented-programming/](https://realpython.com/python3-object-oriented-programming/) - Một nguồn tài liệu rất chi tiết và dễ hiểu.

### For PHP Developers:

- 🔄 **From PHP to Python: A Cheat Sheet:** [https://www.php-to-python.com/](https://www.google.com/search?q=https://www.php-to-python.com/) - Trang web này cung cấp các so sánh trực quan giữa cú pháp PHP và Python, rất hữu ích cho việc chuyển đổi.
- ⚖️ **Comparison of PHP and Python OOP:** [https://docs.python.org/3/faq/design.html\#why-is-there-no-public-private-protected-data-in-python](https://www.google.com/search?q=https://docs.python.org/3/faq/design.html%23why-is-there-no-public-private-protected-data-in-python) - Giải thích lý do Python không có các từ khóa này một cách tường minh.
- 🛠️ **Python OOP: 15-minute quick start for PHP devs:** Tìm các bài viết blog trên Medium hoặc dev.to với tiêu đề tương tự để có góc nhìn từ các lập trình viên đã chuyển đổi.

### Advanced Topics:

- 🚀 **`dataclasses` & `Pydantic`:** Tìm hiểu về các thư viện này để tạo các class model một cách nhanh chóng và hiệu quả hơn, đặc biệt hữu ích trong các framework như FastAPI.
- 📊 **Metaclasses:** Khám phá khái niệm nâng cao này nếu bạn muốn hiểu sâu hơn về cách class được tạo ra trong Python.

---

## 🐛 Common Pitfalls & Solutions

### Pitfall 1: Quên `self` và `__init__`

**Problem:** Lập trình viên PHP có thể quen với việc khai báo thuộc tính ngay trong class hoặc quên `$this` trong phương thức.
**PHP Background:** Trong PHP, bạn có thể viết `public $name;` và sau đó `$this->name = $value;` trong `__construct()`.
**Solution:** Luôn nhớ rằng tất cả các phương thức của instance trong Python phải có `self` làm tham số đầu tiên. `__init__` là nơi duy nhất và tốt nhất để khởi tạo các thuộc tính của đối tượng.
**Prevention:** Luôn khởi tạo class của bạn bằng một phương thức `__init__` và gán tất cả các thuộc tính cần thiết vào `self` ngay tại đó.

### Pitfall 2: Hiểu sai về `private`

**Problem:** Dùng `__private_attr` và nghĩ rằng nó hoàn toàn không thể truy cập được từ bên ngoài, tương tự như `private` trong PHP.
**PHP Background:** `$this->private_var` chỉ có thể được truy cập trong class đó, không có cách nào khác.
**Solution:** Hiểu rằng `__private_attr` chỉ là một quy ước "name mangling". Nó không thực sự ngăn cản bạn truy cập từ bên ngoài nếu bạn biết cách gọi `_ClassName__private_attr`. Thay vào đó, hãy xem nó như một tín hiệu mạnh mẽ rằng "thuộc tính này không nên được đụng tới".
**Prevention:** Đối với các thuộc tính cần bảo vệ, hãy sử dụng `@property` và không cung cấp setter nếu bạn muốn nó là read-only.

### Pitfall 3: Sử dụng `staticmethod` sai mục đích

**Problem:** Dùng `@staticmethod` cho một hàm cần truy cập vào trạng thái của instance hoặc class, dẫn đến lỗi.
**PHP Background:** `static function` trong PHP không thể truy cập `$this`, nhưng không có khái niệm `classmethod` riêng biệt.
**Solution:** Dùng `@staticmethod` chỉ khi logic đó hoàn toàn độc lập và không cần bất kỳ thông tin nào từ `self` hoặc `cls`. Dùng `@classmethod` khi bạn muốn một phương thức hoạt động trên class đó (ví dụ, tạo một instance mới theo một cách khác).
**Prevention:** Trước khi dùng `staticmethod`, hãy tự hỏi: "Hàm này có cần truy cập vào `self` hoặc `cls` không?". Nếu câu trả lời là "Không", thì `staticmethod` là đúng. Nếu "Có", hãy dùng phương thức bình thường hoặc `classmethod`.

---

## 🎉 Summary & Next Steps

### Key Takeaways:

1.  **Class & Objects:** Python sử dụng `class ClassName:` và `__init__(self, ...)` thay cho `__construct(..)` của PHP. `self` tương đương với `$this`.
2.  **Inheritance & Polymorphism:** Kế thừa được thực hiện với `class Child(Parent):` và gọi constructor cha bằng `super().__init__()`. Đa hình hoạt động tương tự PHP.
3.  **Encapsulation & Decorators:** Python dùng quy ước `_` và `__` để đóng gói, nhưng cách tiếp cận "Pythonic" nhất là sử dụng `@property` để tạo các thuộc tính ảo với logic phức tạp.

### How this connects to your PHP experience:

Bài học này đã giúp bạn dịch các khái niệm OOP cốt lõi mà bạn đã thành thạo trong PHP (như class, extends, constructor, magic methods) sang Python. Bạn đã thấy Python có cách tiếp cận khác (ví dụ: indentation thay cho `{}`), nhưng các nguyên lý cơ bản vẫn nhất quán. Bạn có thể áp dụng ngay kinh nghiệm với các design patterns như Singleton, Factory từ PHP sang Python.

### Preparation for next lesson:

- [ ] **Thực hành:** Viết lại một vài class PHP đơn giản từ các dự án cũ của bạn sang Python để củng cố kiến thức.
- [ ] **Đọc trước:** Tìm hiểu sơ bộ về các thư viện xử lý ngoại lệ và logging trong Python.
- [ ] **Cài đặt:** Cài đặt một IDE debugger như VS Code hoặc PyCharm để chuẩn bị cho bài học về debugging.

### Quick Win:

💡 **Thử thách nhỏ trước bài học tiếp theo:** Tạo một class `BankAccount` với thuộc tính `balance`. Sử dụng `@property` để đảm bảo `balance` không bao giờ âm. Tạo một `@classmethod` để tạo tài khoản với số dư ban đầu là 0.

````
## My Notes - Bài 6

### Key Insights:
- `__init__` is the constructor, `self` is `$this`.
- `super().__init__` is key for inheritance.
- `@property` is a powerful and clean way to handle getters/setters and validation.

### Code Snippets I want to remember:
```python
# A good example of a property with a setter
class Person:
    def __init__(self, age):
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if value < 0:
            raise ValueError("Age cannot be negative.")
        self._age = value
````

### Questions for review:

1.  How does Python's `__slots__` relate to memory optimization for many objects?
2.  When should I use `__init__` vs `__new__`?

### Personal action items:

- [ ] Refactor a simple PHP CRUD class to a Python equivalent.
- [ ] Explore the `dataclasses` module to see a simpler way to create models.
