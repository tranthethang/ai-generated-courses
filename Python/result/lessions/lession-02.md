# Bài 2: Cấu Trúc Dữ Liệu - Ánh Xạ từ PHP Array

## 📋 Thông tin Bài học

  - **Module:** Module 1: Python Foundations for PHP Veterans
  - **Thời gian:** 6 giờ
  - **Độ khó:** ⭐⭐⭐ (3/5 sao)
  - **Prerequisites:** Bài 1 (Môi trường và cú pháp cơ bản)

## 🎯 Mục tiêu Bài học

### Sau khi hoàn thành bài này, học viên sẽ:

  - [ ] Phân biệt và sử dụng thành thạo các cấu trúc dữ liệu cơ bản của Python: `List`, `Dict`, `Tuple`, `Set`.
  - [ ] Ánh xạ (map) các khái niệm về mảng (array) trong PHP sang các cấu trúc dữ liệu tương đương trong Python một cách chính xác.
  - [ ] Viết code hiệu quả hơn bằng cách sử dụng `list/dict comprehension` thay thế cho các vòng lặp truyền thống (`foreach`) của PHP.
  - [ ] Áp dụng các cấu trúc dữ liệu phức tạp (`List` of `Dicts`, `Dict` of `Lists`) để giải quyết các bài toán quản lý dữ liệu thực tế.
  - [ ] So sánh và hiểu được sự khác biệt về tính chất (mutable vs immutable) và hiệu suất giữa các cấu trúc dữ liệu của Python.
  - [ ] Sử dụng các phương thức (methods) và hàm (functions) tích hợp sẵn để thao tác với dữ liệu một cách Pythonic và tối ưu.

## 🔑 Key Points (Khái niệm Quan trọng)

### 1\. List (Mảng có chỉ số)

**PHP Comparison:** `List` trong Python gần như tương đương với mảng có chỉ số (indexed array) trong PHP. Tuy nhiên, `List` của Python linh hoạt hơn vì có thể chứa nhiều kiểu dữ liệu khác nhau.
**Python Implementation:** Được khai báo bằng dấu ngoặc vuông `[]`. Các phần tử được truy cập bằng chỉ số từ 0.
**Example:**

```python
# PHP
$fruits = ["apple", "banana", "cherry"];
echo $fruits[0]; // apple

// Python
fruits = ["apple", "banana", "cherry"]
print(fruits[0]) # apple
```

### 2\. Dict (Mảng kết hợp)

**PHP Comparison:** `Dict` (viết tắt của Dictionary) trong Python là khái niệm tương đương và mạnh mẽ hơn mảng kết hợp (associative array) của PHP. Nó lưu trữ dữ liệu dưới dạng cặp `key: value`.
**Python Implementation:** Được khai báo bằng dấu ngoặc nhọn `{}` với các cặp `key: value` được phân cách bởi dấu hai chấm `:`.
**Example:**

```python
# PHP
$user = ["name" => "John Doe", "age" => 30];
echo $user["name"]; // John Doe

# Python
user = {"name": "John Doe", "age": 30}
print(user["name"]) # John Doe
```

### 3\. Tuple (Mảng bất biến)

**PHP Comparison:** `Tuple` là một cấu trúc dữ liệu không có trong PHP. Nó là một phiên bản bất biến (immutable) của `List`, nghĩa là bạn không thể thay đổi, thêm, hoặc xóa phần tử sau khi đã tạo. Nó giống như một `const array` hoặc một đối tượng dữ liệu đơn giản chỉ để đọc.
**Python Implementation:** Được khai báo bằng dấu ngoặc đơn `()`. `Tuple` thường được dùng để trả về nhiều giá trị từ một hàm hoặc để đảm bảo tính toàn vẹn của dữ liệu.
**Example:**

```python
# Python
coordinates = (10, 20)
print(coordinates[0]) # 10
# coordinates[0] = 5 # Lỗi: TypeError vì tuple là immutable
```

### 4\. Set (Tập hợp)

**PHP Comparison:** `Set` trong Python là một cấu trúc dữ liệu không có thứ tự và không cho phép các phần tử trùng lặp. Nó có chức năng tương tự như `array_unique()` trong PHP nhưng hiệu quả hơn rất nhiều, đặc biệt khi cần thực hiện các phép toán tập hợp (union, intersection, difference).
**Python Implementation:** Được khai báo bằng dấu ngoặc nhọn `{}` hoặc hàm `set()`. Tương tự `Dict` nhưng chỉ chứa các giá trị, không có key.
**Example:**

```python
# PHP
$numbers = [1, 2, 2, 3];
$unique_numbers = array_unique($numbers);
// [1, 2, 3]

# Python
numbers = {1, 2, 2, 3}
print(numbers) # {1, 2, 3}
```

### 5\. List/Dict Comprehension

**PHP Comparison:** Khái niệm này không có trong PHP core mà chỉ có thể thực hiện thông qua các hàm như `array_map()`, `array_filter()`, hoặc các vòng lặp truyền thống. `Comprehension` cho phép tạo một `List` hoặc `Dict` mới từ một `iterable` khác một cách ngắn gọn, biểu cảm và rất hiệu quả.
**Python Implementation:** Là một cú pháp ngắn gọn để tạo các cấu trúc dữ liệu mới.
**Example:**

```python
# PHP
$numbers = [1, 2, 3, 4];
$squares = array_map(function($n) { return $n * $n; }, $numbers);
// [1, 4, 9, 16]

# Python
numbers = [1, 2, 3, 4]
squares = [n * n for n in numbers] # List comprehension
# [1, 4, 9, 16]
```

-----

## 📚 Lý thuyết Chi tiết

### Section 1: List, Tuple - Mảng có chỉ số & Bất biến

`List` là cấu trúc dữ liệu linh hoạt nhất trong Python, tương tự như mảng có chỉ số trong PHP. Bạn có thể thêm, xóa, sửa đổi các phần tử một cách dễ dàng.

**So sánh với PHP:**
| PHP (Array) | Python (List) | Ghi chú |
|-------------|---------------|---------|
| `$names = ["Alice", "Bob"];` | `names = ["Alice", "Bob"]` | Khai báo cơ bản |
| `echo $names[0];` | `print(names[0])` | Truy cập phần tử |
| `$names[] = "Charlie";` | `names.append("Charlie")` | Thêm phần tử vào cuối |
| `array_push($names, "David");` | `names.extend(["David", "Eve"])` | Thêm nhiều phần tử |
| `unset($names[1]);` | `names.pop(1)` hoặc `del names[1]` | Xóa phần tử |
| `sort($names);` | `names.sort()` | Sắp xếp tại chỗ |

`Tuple` là phiên bản "chỉ đọc" của `List`. Một khi đã được tạo, các phần tử của nó không thể thay đổi. Điều này giúp `Tuple` an toàn hơn khi truyền dữ liệu giữa các phần, đặc biệt là khi dữ liệu đó không nên bị thay đổi.

  - **Khi nào dùng Tuple?** Khi bạn muốn đảm bảo tính toàn vẹn của dữ liệu (ví dụ: tọa độ, hằng số).
  - **Khi nào dùng List?** Khi bạn cần một bộ sưu tập dữ liệu có thể thay đổi liên tục.

**Ví dụ về tính bất biến của Tuple:**

```python
# Python
person_info = ("John Doe", 30, "Software Engineer")
print(person_info[0])
# Output: John Doe

# person_info[1] = 31 # Lỗi: TypeError: 'tuple' object does not support item assignment
```

**Best Practices:**

  - ✅ Sử dụng `append()` để thêm một phần tử duy nhất vào `List`.
  - ✅ Sử dụng `extend()` hoặc phép cộng `+` để nối hai `List`.
  - ✅ Dùng `Tuple` cho các tập dữ liệu không cần thay đổi. `Tuple` cũng có thể được dùng làm key trong `Dict` (không giống `List` vì `List` là mutable).
  - ❌ Tránh sử dụng `+` để thêm từng phần tử vào `List` trong vòng lặp vì nó tạo ra `List` mới mỗi lần, không hiệu quả.

### Section 2: Dict, Set - Mảng kết hợp & Tập hợp

`Dict` trong Python là một cấu trúc dữ liệu vô cùng mạnh mẽ và được sử dụng rộng rãi, là xương sống của nhiều ứng dụng. Nó tương đương với mảng kết hợp của PHP nhưng có nhiều phương thức tiện lợi hơn.

**So sánh với PHP:**
| PHP (Associative Array) | Python (Dict) | Ghi chú |
|-------------------------|---------------|---------|
| `$user = ["name" => "Alice"];` | `user = {"name": "Alice"}` | Khai báo |
| `echo $user["name"];` | `print(user["name"])` | Truy cập giá trị |
| `$user["age"] = 30;` | `user["age"] = 30` | Thêm/cập nhật cặp key-value |
| `isset($user["name"]);` | `'name' in user` | Kiểm tra sự tồn tại của key |
| `array_keys($user);` | `user.keys()` | Lấy danh sách keys |
| `array_values($user);` | `user.values()` | Lấy danh sách values |

`Set` là một khái niệm không có trong PHP core (phải tự implement hoặc dùng các hàm hỗ trợ). Chức năng chính của `Set` là lưu trữ các phần tử duy nhất và thực hiện các phép toán tập hợp với hiệu suất cao.

**Ví dụ về các phép toán của Set:**

```python
# PHP
$A = [1, 2, 3];
$B = [3, 4, 5];
$union = array_unique(array_merge($A, $B)); // [1, 2, 3, 4, 5]
$intersection = array_intersect($A, $B); // [3]

# Python
A = {1, 2, 3}
B = {3, 4, 5}
union = A.union(B) # hoặc A | B -> {1, 2, 3, 4, 5}
intersection = A.intersection(B) # hoặc A & B -> {3}
difference = A.difference(B) # hoặc A - B -> {1, 2}
```

**Best Practices:**

  - ✅ Dùng `Dict` để lưu trữ dữ liệu có cấu trúc, nơi mỗi phần tử có một `key` duy nhất.
  - ✅ Sử dụng `Dict` method như `get('key', default_value)` để tránh lỗi `KeyError` khi key không tồn tại, thay vì dùng `if 'key' in dict`.
  - ✅ Dùng `Set` khi bạn cần xử lý các tập hợp dữ liệu không trùng lặp hoặc thực hiện các phép toán tập hợp.
  - ❌ Không dùng `List` hoặc `Dict` làm key trong một `Dict` hoặc phần tử trong một `Set` vì chúng là mutable. Chỉ các kiểu dữ liệu immutable như `Tuple`, `string`, `int`, `float` mới có thể làm key.

### Section 3: List/Dict Comprehension - Sức mạnh của vòng lặp biểu cảm

`Comprehension` là một trong những tính năng "đặc trưng" (idiomatic) và mạnh mẽ nhất của Python. Nó cho phép bạn tạo một `List` hoặc `Dict` mới từ một `iterable` (ví dụ: `List`, `Tuple`, `string`) hiện có trong một dòng code duy nhất. Điều này giúp code của bạn ngắn gọn, dễ đọc hơn và thường nhanh hơn so với vòng lặp truyền thống.

**So sánh với PHP:**

**Tạo List mới:**

```php
<?php
// PHP style
$numbers = [1, 2, 3, 4, 5];
$squares = [];
foreach ($numbers as $n) {
    $squares[] = $n * $n;
}
// $squares = [1, 4, 9, 16, 25];

// Hoặc dùng array_map
$squares = array_map(fn($n) => $n * $n, $numbers);
?>
```

```python
# Python list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n * n for n in numbers]
# squares = [1, 4, 9, 16, 25]
```

**Tạo Dict mới:**

```php
<?php
// PHP style
$users = ['john', 'jane', 'peter'];
$user_ids = [];
foreach ($users as $index => $user) {
    $user_ids[$user] = $index + 1;
}
// ['john' => 1, 'jane' => 2, 'peter' => 3]
?>
```

```python
# Python dict comprehension
users = ['john', 'jane', 'peter']
user_ids = {user: index + 1 for index, user in enumerate(users)}
# user_ids = {'john': 1, 'jane': 2, 'peter': 3}
```

**`enumerate()`** là một built-in function của Python trả về một tuple (index, value) cho mỗi lần lặp, rất hữu ích khi bạn cần truy cập cả chỉ số và giá trị.

**Best Practices:**

  - ✅ Dùng `comprehension` cho các thao tác đơn giản và ngắn gọn, không nên lạm dụng để tránh làm code khó đọc.
  - ✅ Kết hợp `comprehension` với câu điều kiện `if` để lọc dữ liệu.
  - ✅ Dùng `comprehension` lồng nhau (nested comprehension) để xử lý các `List` lồng nhau.
  - ❌ Không dùng `comprehension` cho các tác vụ phức tạp có nhiều logic, hãy dùng vòng lặp `for` truyền thống để code dễ hiểu hơn.

-----

## 💻 Code Examples & Demos

### Demo 1: Xử lý dữ liệu User

**Scenario:** Bạn cần xây dựng một hệ thống quản lý user đơn giản. Dữ liệu user được lưu trữ dưới dạng một `List` các `Dict`.

```python
# Demo 1: User Management with List of Dicts
# Scenario: A simple user management system, similar to a database table.

# PHP Equivalent:
# $users = [
#     ["id" => 1, "name" => "Alice", "active" => true],
#     ["id" => 2, "name" => "Bob", "active" => false],
#     ["id" => 3, "name" => "Charlie", "active" => true],
# ];

# Initial list of users
users = [
    {"id": 1, "name": "Alice", "active": True},
    {"id": 2, "name": "Bob", "active": False},
    {"id": 3, "name": "Charlie", "active": True},
]

def get_user_by_id(user_list: list, user_id: int) -> dict | None:
    """Finds a user by their ID."""
    # This is a common pattern in Python, a generator expression
    # it's memory-efficient and returns the first match.
    for user in user_list:
        if user["id"] == user_id:
            return user
    return None

def add_user(user_list: list, new_user: dict):
    """Adds a new user to the list."""
    user_list.append(new_user)
    print(f"User {new_user['name']} added.")

def get_active_users(user_list: list) -> list:
    """Returns a list of all active users using list comprehension."""
    # PHP equivalent: array_filter($user_list, fn($u) => $u['active']);
    return [user for user in user_list if user["active"]]

# --- Main execution ---
# Get user with ID 2
bob = get_user_by_id(users, 2)
print(f"Found user: {bob}")

# Add a new user
new_user = {"id": 4, "name": "David", "active": True}
add_user(users, new_user)

# Get all active users
active_users = get_active_users(users)
print("Active users:")
for user in active_users:
    print(user)

# Update a user's status
if bob:
    bob["active"] = True
    print(f"Updated Bob's status: {bob}")

# Final list of all users
print("\nFinal list of all users:")
print(users)
```

### Demo 2: Data Transformation với Comprehensions

**Scenario:** Bạn nhận được một danh sách các sản phẩm từ một API và cần chuyển đổi nó thành một từ điển, nơi `product_id` là key và toàn bộ đối tượng sản phẩm là value. Sau đó, bạn cần lọc ra các sản phẩm có giá cao hơn một mức nhất định.

```python
# Demo 2: Data Transformation with Comprehensions
# Scenario: Processing a list of products from an API, a very common task.

from typing import List, Dict

# PHP equivalent:
# $products_api = [
#     (object)["id" => 101, "name" => "Laptop", "price" => 1200],
#     (object)["id" => 102, "name" => "Mouse", "price" => 50],
#     (object)["id" => 103, "name" => "Keyboard", "price" => 150],
# ];

products_api = [
    {"id": 101, "name": "Laptop", "price": 1200},
    {"id": 102, "name": "Mouse", "price": 50},
    {"id": 103, "name": "Keyboard", "price": 150},
    {"id": 104, "name": "Monitor", "price": 400},
]

def list_to_dict_by_key(data_list: List[Dict], key_name: str) -> Dict:
    """
    Transforms a list of dictionaries into a dictionary indexed by a specified key.
    
    Args:
        data_list: A list of dictionaries.
        key_name: The key to use for indexing the new dictionary.
        
    Returns:
        A new dictionary with items from the list indexed by the key.
    """
    # PHP equivalent: a foreach loop to build a new associative array
    # $result = [];
    # foreach ($data_list as $item) {
    #     $result[$item[$key_name]] = $item;
    # }
    
    # Pythonic way using dict comprehension
    return {item[key_name]: item for item in data_list}


def get_expensive_products(products: Dict, min_price: float) -> List[Dict]:
    """
    Filters products from a dictionary based on a minimum price.
    
    Args:
        products: A dictionary of products.
        min_price: The minimum price for filtering.
        
    Returns:
        A list of products that meet the price criteria.
    """
    # PHP equivalent: array_filter() on the values of the associative array
    return [product for product in products.values() if product["price"] >= min_price]

# --- Main execution ---
# 1. Transform list of products into a dictionary for quick lookup
products_dict = list_to_dict_by_key(products_api, "id")
print("Products dictionary (for quick lookup by ID):")
print(products_dict)

# 2. Get the product with ID 103 instantly
keyboard_product = products_dict.get(103)
print(f"\nFound product with ID 103: {keyboard_product}")

# 3. Get products with price >= 200
expensive_products = get_expensive_products(products_dict, 200)
print("\nExpensive products (price >= 200):")
print(expensive_products)
```

### Demo 3: Xử lý dữ liệu lồng nhau (Nested data)

**Scenario:** Bạn có một `Dict` lồng nhau chứa thông tin về các cửa hàng và các sản phẩm của từng cửa hàng. Bạn cần tìm tất cả các sản phẩm có tên "Keyboard" từ tất cả các cửa hàng.

```python
# Demo 3: Working with Nested Data Structures
# Scenario: Processing a complex data structure from a system like e-commerce.

# PHP Equivalent:
# $stores = [
#     "store_a" => ["name" => "Tech Gadgets", "products" => [["name" => "Mouse"], ["name" => "Keyboard"]]],
#     "store_b" => ["name" => "Office Supplies", "products" => [["name" => "Monitor"], ["name" => "Keyboard"]]]
# ];

stores = {
    "store_a": {
        "name": "Tech Gadgets",
        "products": [
            {"name": "Mouse", "price": 50},
            {"name": "Keyboard", "price": 150}
        ]
    },
    "store_b": {
        "name": "Office Supplies",
        "products": [
            {"name": "Monitor", "price": 400},
            {"name": "Keyboard", "price": 120},
            {"name": "Laptop", "price": 1100}
        ]
    }
}

def find_product_in_stores(stores_data: Dict, product_name: str) -> List[Dict]:
    """
    Finds a specific product across all stores.
    
    Args:
        stores_data: A dictionary of stores with their products.
        product_name: The name of the product to find.
        
    Returns:
        A list of all product dictionaries that match the name.
    """
    found_products = []
    # PHP equivalent: nested foreach loops
    # foreach ($stores_data as $store_id => $store) {
    #     foreach ($store['products'] as $product) {
    #         if ($product['name'] === $product_name) {
    #             $found_products[] = $product;
    #         }
    #     }
    # }
    
    # Pythonic way using nested list comprehension
    # This reads like a sentence: "for each store in stores_data.values(), for each product in store['products'], if the product name matches, add the product to the list."
    return [
        product
        for store in stores_data.values()
        for product in store["products"]
        if product["name"] == product_name
    ]

# --- Main execution ---
keyboard_products = find_product_in_stores(stores, "Keyboard")
print(f"Found {len(keyboard_products)} Keyboard products:")
for product in keyboard_products:
    print(product)
```

-----

## 🔨 Hands-on Exercises (3 Bài tập)

### 🥉 Bài tập 1: Xây dựng Danh sách Công việc (Cơ bản - 30 phút)

**Mô tả:** Tạo một ứng dụng quản lý danh sách công việc (to-do list) đơn giản. Học viên sẽ sử dụng `List` và các phương thức cơ bản để thêm, xóa và hiển thị công việc.

**Yêu cầu:**

  - [ ] Tạo một `List` ban đầu có tên `tasks` với 3 công việc.
  - [ ] Viết hàm `add_task(tasks, new_task)` để thêm một công việc mới.
  - [ ] Viết hàm `remove_task(tasks, task_name)` để xóa một công việc dựa trên tên (nếu có).
  - [ ] Viết hàm `display_tasks(tasks)` để in ra tất cả công việc trong danh sách.

**Starter Code:**

```python
# to_do_list.py

tasks = ["Learn Python", "Build a FastAPI app", "Read a book"]

def add_task(tasks_list, new_task):
    """Adds a new task to the list."""
    # Your code here
    pass

def remove_task(tasks_list, task_name):
    """Removes a task from the list if it exists."""
    # Your code here
    pass

def display_tasks(tasks_list):
    """Prints all tasks in the list."""
    # Your code here
    pass

# --- Main execution ---
# Add a new task: "Write a blog post"
# Remove the task: "Read a book"
# Display the final list
```

**Expected Output:**

```
Task 'Write a blog post' added.
Task 'Read a book' removed.
Current tasks:
1. Learn Python
2. Build a FastAPI app
3. Write a blog post
```

**Hints:**

  - 💡 Sử dụng phương thức `append()` của `List` để thêm công việc.
  - 💡 Sử dụng `if task_name in tasks_list` để kiểm tra sự tồn tại trước khi xóa. Sau đó, dùng `tasks_list.remove(task_name)`.
  - 💡 Dùng vòng lặp `for` với `enumerate()` để hiển thị danh sách với số thứ tự.

### 🥈 Bài tập 2: Xử lý Đơn hàng E-commerce (Trung bình - 45 phút)

**Mô tả:** Bạn cần xử lý dữ liệu đơn hàng từ một cửa hàng trực tuyến. Mỗi đơn hàng là một `Dict`, và bạn có một `List` chứa tất cả các đơn hàng. Hãy sử dụng `comprehension` để giải quyết các yêu cầu sau.

**Yêu cầu:**

  - [ ] Từ `List` đơn hàng ban đầu, tạo một `Dict` mới nơi key là `order_id` và value là toàn bộ đối tượng đơn hàng.
  - [ ] Sử dụng `list comprehension` để tìm tất cả các đơn hàng có trạng thái là `"pending"`.
  - [ ] Sử dụng `dict comprehension` để tạo một `Dict` mới chỉ chứa `order_id` và `total_amount` của tất cả các đơn hàng.

**PHP Context:** Trong PHP, bạn sẽ phải dùng các vòng lặp `foreach` lồng nhau hoặc các hàm như `array_map()` và `array_filter()` để xử lý các yêu cầu này. Bài tập này sẽ giúp bạn thấy được sự gọn gàng và hiệu quả của `comprehension` trong Python.

**Starter Code:**

```python
# e_commerce_processor.py

orders = [
    {"order_id": "ORD001", "status": "completed", "total_amount": 150.75},
    {"order_id": "ORD002", "status": "pending", "total_amount": 25.50},
    {"order_id": "ORD003", "status": "completed", "total_amount": 500.00},
    {"order_id": "ORD004", "status": "pending", "total_amount": 75.20},
    {"order_id": "ORD005", "status": "completed", "total_amount": 10.00},
]

def process_orders(orders_list):
    # Requirement 1: Create a dictionary indexed by order_id
    orders_by_id = {} # Your code here with dict comprehension
    
    # Requirement 2: Find all pending orders
    pending_orders = [] # Your code here with list comprehension
    
    # Requirement 3: Create a new dict with order_id and total_amount
    summary = {} # Your code here with dict comprehension
    
    return orders_by_id, pending_orders, summary

orders_by_id, pending_orders, summary = process_orders(orders)

print("Orders Dictionary:")
print(orders_by_id)
print("\nPending Orders:")
print(pending_orders)
print("\nOrder Summary:")
print(summary)
```

**Expected Output:**

```
Orders Dictionary:
{'ORD001': {'order_id': 'ORD001', 'status': 'completed', 'total_amount': 150.75}, 'ORD002': {'order_id': 'ORD002', 'status': 'pending', 'total_amount': 25.5}, 'ORD003': {'order_id': 'ORD003', 'status': 'completed', 'total_amount': 500.0}, 'ORD004': {'order_id': 'ORD004', 'status': 'pending', 'total_amount': 75.2}, 'ORD005': {'order_id': 'ORD005', 'status': 'completed', 'total_amount': 10.0}}

Pending Orders:
[{'order_id': 'ORD002', 'status': 'pending', 'total_amount': 25.5}, {'order_id': 'ORD004', 'status': 'pending', 'total_amount': 75.2}]

Order Summary:
{'ORD001': 150.75, 'ORD002': 25.5, 'ORD003': 500.0, 'ORD004': 75.2, 'ORD005': 10.0}
```

### 🥇 Bài tập 3: Quản lý Hệ thống Inventory (Nâng cao - 60 phút)

**Mô tả:** Xây dựng một hệ thống quản lý inventory đơn giản cho một cửa hàng. Dữ liệu inventory được lưu trữ dưới dạng một `Dict` của các `Dict`, nơi key là `product_sku` và value là thông tin chi tiết về sản phẩm.

**Yêu cầu:**

  - [ ] Khai báo `inventory` dưới dạng một `Dict` với ít nhất 3 sản phẩm. Mỗi sản phẩm là một `Dict` có các key: `name`, `price`, `stock_quantity`, `tags` (là một `List` of `string`).
  - [ ] Viết hàm `update_stock(inventory, sku, quantity)` để cập nhật số lượng tồn kho. Hàm này nên kiểm tra `sku` có tồn tại hay không và xử lý lỗi nếu không tìm thấy.
  - [ ] Viết hàm `get_products_by_tag(inventory, tag)` trả về một `List` các sản phẩm có chứa một tag cụ thể.
  - [ ] Viết hàm `find_out_of_stock_products(inventory)` sử dụng `list comprehension` để tìm tất cả các sản phẩm có `stock_quantity` bằng 0.

**PHP Context:** Trong một ứng dụng Laravel, bạn có thể đã quen thuộc với việc sử dụng `Eloquent` models hoặc `Collection` để thực hiện các truy vấn và lọc dữ liệu tương tự. Bài tập này mô phỏng cách bạn có thể xử lý dữ liệu thô (in-memory) bằng các cấu trúc dữ liệu cơ bản của Python.

**Starter Code:**

```python
# inventory_manager.py

from typing import Dict, List, Any

inventory = {
    "SKU-001": {
        "name": "Wireless Mouse",
        "price": 25.00,
        "stock_quantity": 50,
        "tags": ["peripherals", "wireless"]
    },
    "SKU-002": {
        "name": "Mechanical Keyboard",
        "price": 85.50,
        "stock_quantity": 0,
        "tags": ["peripherals", "gaming"]
    },
    "SKU-003": {
        "name": "27-inch Monitor",
        "price": 250.00,
        "stock_quantity": 10,
        "tags": ["monitors"]
    }
}

def update_stock(inventory_data: Dict[str, Any], sku: str, quantity: int):
    """
    Updates the stock quantity of a product.
    
    Args:
        inventory_data: The inventory dictionary.
        sku: The SKU of the product.
        quantity: The new stock quantity.
    """
    # Your code here. Remember to handle cases where the SKU does not exist.
    pass

def get_products_by_tag(inventory_data: Dict[str, Any], tag: str) -> List[Dict[str, Any]]:
    """
    Returns a list of products that have a specific tag.
    
    Args:
        inventory_data: The inventory dictionary.
        tag: The tag to search for.
        
    Returns:
        A list of product dictionaries.
    """
    # Use list comprehension here
    # Your code here
    return []

def find_out_of_stock_products(inventory_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Finds all products with a stock quantity of 0.
    
    Args:
        inventory_data: The inventory dictionary.
        
    Returns:
        A list of out-of-stock products.
    """
    # Use list comprehension here
    # Your code here
    return []

# --- Main execution ---
# 1. Update stock for SKU-001 to 45
update_stock(inventory, "SKU-001", 45)

# 2. Try to update a non-existent SKU
update_stock(inventory, "SKU-999", 100)

# 3. Find products with the "peripherals" tag
peripheral_products = get_products_by_tag(inventory, "peripherals")
print("\nProducts with 'peripherals' tag:")
for product in peripheral_products:
    print(product)

# 4. Find all out-of-stock products
out_of_stock = find_out_of_stock_products(inventory)
print("\nOut of stock products:")
for product in out_of_stock:
    print(product)
```

**Bonus Challenges:**

  - 🌟 Viết một hàm `calculate_total_value(inventory)` sử dụng `comprehension` để tính tổng giá trị của tất cả sản phẩm đang có trong kho (`price * stock_quantity`).
  - 🌟 Chuyển đổi `update_stock` thành một class với các phương thức quản lý inventory.

-----

## ✅ Self-Assessment Checklist

**Trước khi chuyển sang bài tiếp theo, hãy đảm bảo bạn có thể:**

  - [ ] Phân biệt rõ ràng khi nào nên dùng `List`, `Dict`, `Tuple`, và `Set`.
  - [ ] Ánh xạ được `array` có chỉ số và `associative array` trong PHP sang `List` và `Dict` trong Python.
  - [ ] Viết được một `list comprehension` và một `dict comprehension` đơn giản để thay thế vòng lặp `foreach`.
  - [ ] Thao tác cơ bản (thêm, xóa, sửa, truy cập) với `List` và `Dict` bằng các phương thức của chúng.
  - [ ] Xử lý được các cấu trúc dữ liệu lồng nhau (nested data) như `List` of `Dicts` hoặc `Dict` of `Lists`.
  - [ ] Giải thích được tại sao `Tuple` là `immutable` và `List` là `mutable`.
  - [ ] Code và debug được 3 bài tập trên một cách độc lập.

-----

## 🔗 Resources & Further Reading

### Essential Resources:

  - 📖 **[Python Data Structures Documentation]**: `https://docs.python.org/3/tutorial/datastructures.html`
  - 📖 **[List Comprehension in Python]**: `https://www.pythonforbeginners.com/basics/list-comprehensions-in-python`
  - 🎥 **[Python Dictionaries Explained]**: `https://www.youtube.com/watch?v=da_83c162uQ`
  - 📝 **[Real Python's Guide to Dictionaries]**: `https://realpython.com/python-dicts/`

### For PHP Developers:

  - 🔄 **[PHP to Python Array Comparison]**: `https://www.php-to-python.com/arrays-lists-dictionaries-and-tuples`
  - ⚖️ **[Python vs PHP - Data Structures]**: `https://www.geeksforgeeks.org/data-structures-in-python-and-php-a-comparison/`

### Advanced Topics:

  - 🚀 **[Generators vs List Comprehensions]**: `https://towardsdatascience.com/list-comprehension-vs-for-loop-vs-map-a-performance-comparison-54157120a160` (Bài này sẽ giúp bạn hiểu sâu hơn về hiệu suất)
  - 📊 **[Python Collections Module]**: `https://docs.python.org/3/library/collections.html` (Khám phá các cấu trúc dữ liệu nâng cao hơn như `defaultdict`, `Counter`)

-----

## 🐛 Common Pitfalls & Solutions

### Pitfall 1: Mảng lồng nhau với `Dict` thay vì `List`

**Problem:** PHP developer thường quen với việc chỉ dùng mảng (`array`) cho cả mảng có chỉ số và mảng kết hợp. Khi chuyển sang Python, họ có thể nhầm lẫn giữa `List` (mảng có thứ tự) và `Dict` (mảng kết hợp), dẫn đến việc dùng `Dict` với các key là số nguyên thay vì dùng `List`.
**PHP Background:** Trong PHP, `$arr = [1, 2, 3]` và `$arr[0] = 10` đều là `array`.
**Solution:** Hãy nhớ rằng `List` được dùng cho các tập hợp dữ liệu có thứ tự, còn `Dict` dùng cho các cặp `key-value` không có thứ tự. Nếu bạn chỉ cần lưu trữ một danh sách các mục và truy cập bằng chỉ số, `List` là lựa chọn đúng và hiệu quả hơn.
**Prevention:** Luôn tự hỏi: "Mình có cần truy cập dữ liệu bằng một cái tên (key) hay chỉ cần bằng một chỉ số (index)?"

### Pitfall 2: Hiểu lầm về `pass-by-reference`

**Problem:** Trong PHP, đối tượng (objects) được truyền theo tham chiếu (pass-by-reference) một cách mặc định. Khi gán một `List` hoặc `Dict` (là mutable objects) cho một biến khác, cả hai biến sẽ trỏ đến cùng một đối tượng. Việc sửa đổi một biến sẽ ảnh hưởng đến biến còn lại, gây ra các lỗi bất ngờ.
**PHP Background:** Khi bạn làm việc với mảng trong PHP, `array_slice()` sẽ trả về một bản sao. Khi bạn gán `$arr2 = $arr1;`, PHP sẽ tạo một bản sao (copy-on-write) khi bạn thay đổi `$arr2`.
**Solution:** Để tạo một bản sao độc lập của `List` hoặc `Dict` trong Python, bạn cần sử dụng các phương thức `copy()` hoặc toán tử slicing.
**Prevention:** Khi cần một bản sao, hãy chủ động tạo nó bằng cách dùng `my_list.copy()` hoặc `my_list[:]` cho `List`, và `my_dict.copy()` cho `Dict`.

```python
# Ví dụ về lỗi thường gặp
list_a = [1, 2, 3]
list_b = list_a
list_b.append(4)
print(list_a) # Output: [1, 2, 3, 4] -> Lỗi!

# Cách sửa: Tạo một bản sao độc lập
list_a = [1, 2, 3]
list_c = list_a.copy() # Hoặc list_c = list_a[:]
list_c.append(4)
print(list_a) # Output: [1, 2, 3] -> Đúng
```

### Pitfall 3: Lạm dụng `comprehension`

**Problem:** `Comprehension` rất mạnh nhưng có thể gây khó đọc nếu bị lạm dụng với logic quá phức tạp (nhiều `if/else`, `comprehension` lồng nhau sâu).
**PHP Background:** Với PHP, bạn có thể dễ dàng viết một vòng lặp `foreach` với nhiều dòng code bên trong.
**Solution:** Hãy giữ `comprehension` đơn giản. Nếu bạn thấy mình cần hơn một câu điều kiện `if` hoặc logic phức tạp, hãy chuyển sang vòng lặp `for` truyền thống.
**Prevention:** Đặt ra quy tắc: `comprehension` không được vượt quá một dòng code.

-----

## 🎉 Summary & Next Steps

### Key Takeaways:

1.  **List & Dict:** `List` là mảng có chỉ số (PHP indexed array), `Dict` là mảng kết hợp (PHP associative array).
2.  **Tuple & Set:** `Tuple` là `List` bất biến (immutable), `Set` là tập hợp không có thứ tự và không trùng lặp (tương tự `array_unique`).
3.  **Comprehension:** Là cách thức `Pythonic` để tạo các cấu trúc dữ liệu mới từ một `iterable` hiện có, giúp code ngắn gọn, hiệu quả và dễ đọc hơn.

### How this connects to your PHP experience:

Bài học này đã giúp bạn "phiên dịch" những kiến thức nền tảng về cấu trúc dữ liệu từ PHP sang Python. Bạn đã thấy rằng các khái niệm `array` đa năng của PHP được tách thành các cấu trúc chuyên biệt và tối ưu hơn trong Python. Việc nắm vững cách ánh xạ này là bước đệm quan trọng để bạn tiếp cận các thư viện và framework của Python sau này.

### Preparation for next lesson:

  - [ ] Thực hành các bài tập và đảm bảo bạn có thể giải quyết chúng một cách độc lập.
  - [ ] Thử viết lại một đoạn code PHP nhỏ của bạn (đã dùng mảng) sang Python bằng các cấu trúc dữ liệu đã học.
  - [ ] Đọc qua về cách Python xử lý các luồng điều khiển như `if/elif/else` và `for/while` để chuẩn bị cho bài học tiếp theo.

### Quick Win:

💡 **Try this before next lesson:** Tạo một `List` gồm các số từ 1 đến 10. Sau đó, dùng `comprehension` để tạo một `List` mới chỉ chứa các số chẵn.

```python
# Start with this list
numbers = list(range(1, 11))
# Your comprehension goes here
even_numbers = [...]
print(even_numbers)
# Expected: [2, 4, 6, 8, 10]
```

-----

## 📝 Lesson Notes Template (For learners)

````markdown
## My Notes - Bài 2

### Key Insights:
- 

### Code Snippets I want to remember:
```python

````

### Questions for review:

1\.
2\.

### Personal action items:

  - [ ]
  - [ ]
