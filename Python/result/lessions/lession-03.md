# Bài 3: Luồng Điều Khiển & Hàm

## 📋 Thông tin Bài học

  - **Module:** Module 1: Python Foundations for PHP Veterans
  - **Thời gian:** 4 giờ
  - **Độ khó:** ⭐⭐
  - **Prerequisites:** Bài 1: Môi trường & Cú pháp so sánh, Bài 2: Cấu trúc Dữ liệu

## 🎯 Mục tiêu Bài học

### Sau khi hoàn thành bài này, học viên sẽ:

  - [ ] Hiểu và viết được các cấu trúc điều khiển luồng cơ bản như `if/elif/else`, `for`, và `while` trong Python.
  - [ ] Định nghĩa và gọi hàm một cách hiệu quả, sử dụng `def` và type hints.
  - [ ] Nắm vững cách sử dụng các đối số linh hoạt như `*args` và `**kwargs`, tương tự variadic functions của PHP.
  - [ ] Hiểu khái niệm first-class functions và cách áp dụng chúng trong các trường hợp thực tế.
  - [ ] Chuyển đổi thành công logic điều khiển luồng và các hàm từ PHP sang Python.
  - [ ] Áp dụng best practices trong việc đặt tên và viết hàm để tạo ra code dễ đọc và bảo trì.

-----

## 🔑 Key Points (Khái niệm Quan trọng)

### 1\. Luồng Điều Khiển: `if/elif/else`

**PHP Comparison:** Tương tự `if/elseif/else` của PHP, nhưng Python sử dụng **indentation (lùi đầu dòng)** thay vì dấu ngoặc nhọn `{}` để xác định khối code. Điều này là một sự thay đổi lớn từ PHP. `elif` là viết tắt của "else if".
**Python Implementation:**

```python
# Python
score = 85
if score > 90:
    print("Excellent!")
elif score > 80:
    print("Good job!")
else:
    print("Keep trying.")
```

**Example:**

```python
# Cùng logic trong PHP để so sánh
<?php
$score = 85;
if ($score > 90) {
    echo "Excellent!";
} elseif ($score > 80) {
    echo "Good job!";
} else {
    echo "Keep trying.";
}
?>
```

### 2\. Định nghĩa Hàm: `def`

**PHP Comparison:** Hàm trong Python được định nghĩa bằng từ khóa `def`, tương tự `function` trong PHP. Python có hỗ trợ **type hints** mạnh mẽ để khai báo kiểu dữ liệu của đối số và giá trị trả về, giống như PHP 7+. Tuy nhiên, type hints trong Python mang tính gợi ý (`hinting`) và không bắt buộc như một số trường hợp của PHP, nhưng rất được khuyến khích sử dụng.
**Python Implementation:**

```python
# Định nghĩa hàm với type hints
def greet(name: str) -> str:
    """A function that greets a user by name."""
    return f"Hello, {name}!"

# Gọi hàm
message = greet("PHP Developer")
print(message)
```

**Example:**

```python
<?php
// PHP 7+ equivalent
function greet(string $name): string {
    return "Hello, {$name}!";
}

$message = greet("PHP Developer");
echo $message;
?>
```

### 3\. Đối số linh hoạt: `*args` và `**kwargs`

**PHP Comparison:** Đây là một trong những tính năng mạnh mẽ của Python, tương đương với **variadic functions** và **named arguments** trong PHP.

  - `*args`: Thu thập tất cả các đối số không tên thành một **tuple**, tương tự cú pháp `...$arguments` trong PHP.
  - `**kwargs`: Thu thập tất cả các đối số có tên (keyword arguments) thành một **dictionary**, không có cú pháp tương đương trực tiếp trong PHP nhưng có thể đạt được bằng cách xử lý một mảng.

**Python Implementation:**

```python
# *args example
def sum_numbers(*args):
    # args is a tuple of all positional arguments
    return sum(args)

# **kwargs example
def print_user_info(**kwargs):
    # kwargs is a dictionary of all keyword arguments
    for key, value in kwargs.items():
        print(f"{key}: {value}")

# Sử dụng
print(sum_numbers(1, 2, 3, 4))  # Output: 10
print_user_info(name="Alice", city="Hanoi", job="Developer")
```

### 4\. First-Class Functions

**PHP Comparison:** Tương tự như **anonymous functions** (closures) trong PHP, hàm trong Python là "first-class citizens". Điều này có nghĩa là bạn có thể gán một hàm cho một biến, truyền nó như một đối số cho hàm khác, hoặc trả về nó từ một hàm. Đây là nền tảng của nhiều design patterns và lập trình chức năng (functional programming).

**Python Implementation:**

```python
def say_hello(name):
    return f"Hello, {name}!"

# Gán hàm cho một biến
greeting = say_hello

# Truyền hàm như một đối số
def execute_function(func, argument):
    return func(argument)

result = execute_function(greeting, "Bob")
print(result) # Output: Hello, Bob!
```

-----

## 📚 Lý thuyết Chi tiết

### 1\. Luồng Điều Khiển: Vòng lặp `for` và `while`

Đối với các lập trình viên PHP, bạn đã quá quen thuộc với `for`, `foreach`, và `while`. Trong Python, mọi thứ được đơn giản hóa hơn một chút nhưng vẫn rất mạnh mẽ.

**Vòng lặp `for` (Tương tự `foreach` của PHP):**
Vòng lặp `for` trong Python được sử dụng để lặp qua bất kỳ đối tượng nào có thể lặp (iterable), như list, tuple, dictionary, string, v.v. Điều này tương đương với `foreach` trong PHP. Nó không có cú pháp `for ($i=0; $i<count($array); $i++)` truyền thống mà bạn thường thấy trong PHP.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|---|---|---|
| `foreach ($names as $name)` | `for name in names:` | Lặp qua các giá trị trong mảng/list. |
| `foreach ($dict as $key => $value)` | `for key, value in dict.items():` | Lặp qua cả key và value. |
| `for ($i = 0; $i < 5; $i++)` | `for i in range(5):` | Sử dụng hàm `range()` để tạo ra một chuỗi số. |

**Code Example:**

```python
# Vòng lặp for cơ bản
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Lặp qua dictionary (tương tự PHP associative array)
user_data = {"name": "Alice", "job": "Developer", "city": "Hanoi"}
for key, value in user_data.items():
    print(f"Key: {key}, Value: {value}")

# Lặp với chỉ số (index), tương đương `for ($i = 0; $i < count($arr); $i++)`
for index, fruit in enumerate(fruits):
    print(f"Fruit at index {index}: {fruit}")
```

**`enumerate()`** là một hàm tích hợp sẵn rất "Pythonic" để lặp qua cả giá trị và chỉ số cùng lúc, rất tiện lợi và hiệu quả hơn so với việc tự quản lý biến đếm.

**Vòng lặp `while`:**
Cú pháp `while` trong Python tương tự như trong PHP, được sử dụng để lặp cho đến khi một điều kiện trở thành `False`.

```python
count = 0
while count < 5:
    print(f"Count is {count}")
    count += 1 # Tương tự $count++; trong PHP
```

**Best Practices:**

  - ✅ **Luôn sử dụng `for` khi có thể** để lặp qua một collection. Nó an toàn và dễ đọc hơn `while`.
  - ✅ **Sử dụng `range()`** cho các vòng lặp cần lặp số lần xác định.
  - ✅ **Sử dụng `enumerate()`** khi bạn cần cả chỉ số và giá trị.
  - ❌ **Tránh sử dụng `while True`** mà không có điều kiện `break` rõ ràng, có thể dẫn đến vòng lặp vô hạn.

### 2\. Định nghĩa và Gọi Hàm

Hàm là một khối code có thể tái sử dụng. Cú pháp `def` trong Python rất đơn giản.

```python
def add(a, b):
    return a + b
```

Điều quan trọng cần chú ý là cách Python xử lý các đối số.

  - **Đối số bắt buộc (Positional arguments):** Cần được truyền vào theo đúng thứ tự.
  - **Đối số có tên (Keyword arguments):** Có thể được truyền vào với tên, không cần quan tâm đến thứ tự.

<!-- end list -->

```python
def profile(name, age, city):
    print(f"Name: {name}, Age: {age}, City: {city}")

# Đối số bắt buộc
profile("Alice", 30, "Hanoi")

# Đối số có tên (dễ đọc hơn)
profile(city="Ho Chi Minh", name="Bob", age=25)
```

Đối với PHP Senior Developers, cách sử dụng keyword arguments này có thể gợi nhớ đến cách bạn truyền một mảng cấu hình vào một hàm `(new User(['name' => 'Alice']))`, nhưng trong Python, nó là một tính năng ngôn ngữ được hỗ trợ trực tiếp và rất mạnh mẽ.

### 3\. Type Hints (PHP 7+ Migration)

Nếu bạn đã quen với việc sử dụng `string`, `int`, `array` trong khai báo hàm của PHP 7+, bạn sẽ thấy type hints của Python rất quen thuộc.

```python
from typing import List, Dict

def process_users(users: List[Dict[str, str]]) -> int:
    """
    Process a list of user dictionaries.
    
    Args:
        users (List[Dict[str, str]]): A list where each item is a user dictionary.
    
    Returns:
        int: The number of users processed.
    """
    for user in users:
        print(f"Processing user: {user['name']}")
    return len(users)

# Hàm này mong đợi một list của dictionaries, mỗi dictionary có key là string và value là string.
user_list = [
    {"name": "Alice", "email": "alice@example.com"},
    {"name": "Bob", "email": "bob@example.com"}
]

count = process_users(user_list)
print(f"Processed {count} users.")
```

**So sánh với PHP:** Type hints của Python không bắt buộc về mặt thực thi (runtime) nhưng các công cụ tĩnh (static analysis tools) như MyPy sẽ kiểm tra và báo lỗi, giúp code của bạn an toàn và dễ bảo trì hơn, tương tự như các IDE kiểm tra lỗi type hint trong PHP.

### 4\. `*args`, `**kwargs` và First-Class Functions (PHP & Functional Programming)

**`*args` và `**kwargs`:**
Đây là các đối số đặc biệt cho phép hàm chấp nhận một số lượng đối số không xác định.

  - **`*args` (positional arguments):** Thu thập các đối số không có tên vào một **tuple**.
      - **Tương đương PHP:** `function my_func(...$params) { ... }`
  - **`**kwargs` (keyword arguments):** Thu thập các đối số có tên vào một **dictionary**.
      - **Tương đương PHP:** Không có cú pháp trực tiếp, thường được mô phỏng bằng cách xử lý một mảng `$options` được truyền vào.

<!-- end list -->

```python
# Ví dụ tổng hợp cả hai
def create_profile(name, *args, **kwargs):
    print(f"Creating profile for {name}")
    print("--- Positional Arguments ---")
    for arg in args:
        print(f"-> Extra data: {arg}")
    
    print("--- Keyword Arguments ---")
    for key, value in kwargs.items():
        print(f"-> {key}: {value}")

# Gọi hàm
create_profile("Charlie", "Software Engineer", "From a workshop", city="Paris", hobbies=["coding", "reading"])
```

Bạn sẽ thấy `*args` và `**kwargs` được sử dụng rất nhiều trong các framework Python như FastAPI, Django để tạo ra các hàm linh hoạt, chẳng hạn như để nhận các tham số tùy chọn hoặc các cài đặt middleware.

**First-Class Functions:**
Một trong những điểm mạnh của Python là khả năng coi hàm như một biến. Điều này mở ra nhiều khả năng, đặc biệt là trong việc viết code linh hoạt và tái sử dụng cao.

  - **Tương đương PHP:** Việc gán một closure cho một biến (`$myFunc = function($x){...}`) hoặc sử dụng các hàm callback trong `array_map()`, `usort()`...

<!-- end list -->

```python
# Gán hàm cho một biến
def add(x, y):
    return x + y

my_operation = add
result = my_operation(5, 3) # result = 8
print(result)

# Truyền hàm làm đối số (tương tự array_map trong PHP)
numbers = [1, 2, 3, 4]
def square(n):
    return n * n

# `map()` là một hàm tích hợp sẵn trong Python
# Nó áp dụng hàm `square` cho từng phần tử của `numbers`
squared_numbers = list(map(square, numbers))
print(squared_numbers) # Output: [1, 4, 9, 16]
```

Sự khác biệt chính là trong Python, đây là một tính năng cốt lõi của ngôn ngữ, trong khi trong PHP, nó được thêm vào sau này.

-----

## 💻 Code Examples & Demos

### Demo 1: Chuyển đổi một PHP Function Library

**Scenario:** Bạn có một file `helpers.php` chứa các hàm tiện ích mà bạn muốn chuyển đổi sang Python. Hãy chuyển đổi hàm `is_email()` và `array_get()` từ PHP sang Python.

**PHP Equivalent:**

```php
<?php
// helpers.php

function is_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function array_get(array $array, string $key, $default = null)
{
    return $array[$key] ?? $default;
}

$user = ['name' => 'Alice', 'email' => 'alice@example.com'];
echo array_get($user, 'name'); // Alice
echo array_get($user, 'phone', 'N/A'); // N/A
?>
```

**Python Implementation:**

```python
import re
from typing import Any, Dict, List, Union

def is_email(email: str) -> bool:
    """
    Checks if a string is a valid email address.
    
    Args:
        email: The string to check.
        
    Returns:
        True if the email is valid, False otherwise.
    """
    # Using regex for a more robust check, similar to PHP's filter_var
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None

def dict_get(data: Dict[str, Any], key: str, default: Any = None) -> Any:
    """
    Gets a value from a dictionary by key, with a default value if not found.
    
    Args:
        data: The dictionary to search in.
        key: The key to look for.
        default: The default value to return if the key is not found.
        
    Returns:
        The value associated with the key, or the default value.
    """
    return data.get(key, default)

# Sử dụng các hàm trong Python
user = {'name': 'Alice', 'email': 'alice@example.com'}
print(f"Is 'alice@example.com' a valid email? {is_email('alice@example.com')}")
print(f"User name: {dict_get(user, 'name')}")
print(f"User phone: {dict_get(user, 'phone', 'N/A')}")
```

**Nhận xét:** Trong Python, `dict.get(key, default_value)` là một phương thức tích hợp sẵn, làm cho hàm `dict_get` trên thực tế không cần thiết, nhưng nó minh họa cách bạn chuyển đổi logic từ PHP.

### Demo 2: Cài đặt Decorator Pattern (Tương tự PHP Attributes/Annotations)

**Scenario:** Bạn muốn viết một hàm "wrapper" để thêm chức năng logging vào một hàm khác mà không cần thay đổi code gốc. Trong PHP, bạn có thể sử dụng attributes (`#[MyAttribute]`) hoặc annotations (`@MyAnnotation`) để đạt được điều này. Trong Python, chúng ta sử dụng **decorators**.

**PHP `#[Route('/api/v1/users')]` equivalent:**

```php
<?php
// Tương tự Symfony/Laravel attributes

#[Route('/api/v1/users', methods: ['GET'])]
public function listUsers(Request $request): JsonResponse
{
    // Logic to list users...
    return new JsonResponse(['users' => []]);
}
```

**Python Implementation với Decorators:**

```python
import functools

# Đây là một decorator
def log_execution(func):
    """
    A decorator that logs the execution of a function.
    """
    @functools.wraps(func) # Use this to preserve original function's metadata
    def wrapper(*args, **kwargs):
        print(f"Executing function: {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"Function {func.__name__} finished with result: {result}")
        return result
    return wrapper

# Áp dụng decorator cho hàm
@log_execution
def greet_user(name: str):
    return f"Hello, {name}!"

# Gọi hàm, decorator sẽ tự động chạy
greet_user("Dave")
# Output:
# Executing function: greet_user with args: ('Dave',), kwargs: {}
# Function greet_user finished with result: Hello, Dave!
```

Decorators là một tính năng rất mạnh mẽ của Python, và bạn sẽ thấy nó được sử dụng rộng rãi trong FastAPI để xử lý routing (`@app.get("/items/{item_id}")`), dependency injection, và nhiều thứ khác.

### Demo 3: Xây dựng một Calculator với `*args` và Type Hints

**Scenario:** Viết một hàm `calculate` có thể thực hiện nhiều phép tính khác nhau trên một danh sách các số. Hàm này cần hỗ trợ các phép tính như `sum`, `avg`, `product` và có thể mở rộng dễ dàng.

```python
from typing import Callable, List, Union

# Define type alias for readability
Operation = Callable[[List[Union[int, float]]], Union[int, float]]

def calculate(numbers: List[Union[int, float]], operation: Operation) -> Union[int, float]:
    """
    Performs a given operation on a list of numbers.

    Args:
        numbers: The list of numbers to operate on.
        operation: A function that takes a list of numbers and returns a single value.

    Returns:
        The result of the operation.
    """
    if not isinstance(numbers, list):
        raise TypeError("Input 'numbers' must be a list.")
    
    # Check for empty list to prevent errors
    if not numbers and operation.__name__ in ['average', 'product']:
        # Special handling for average and product to avoid division by zero
        return 0
    
    return operation(numbers)

# Định nghĩa các hàm phép tính
def calculate_sum(numbers: List[Union[int, float]]) -> Union[int, float]:
    return sum(numbers)

def calculate_average(numbers: List[Union[int, float]]) -> Union[int, float]:
    return sum(numbers) / len(numbers) if numbers else 0

def calculate_product(numbers: List[Union[int, float]]) -> Union[int, float]:
    result = 1
    for num in numbers:
        result *= num
    return result

# Sử dụng hàm `calculate` với các hàm khác nhau làm đối số
my_numbers = [10, 20, 30, 40]

total_sum = calculate(my_numbers, calculate_sum)
print(f"The sum is: {total_sum}")

average_value = calculate(my_numbers, calculate_average)
print(f"The average is: {average_value}")

product_value = calculate(my_numbers, calculate_product)
print(f"The product is: {product_value}")
```

**Nhận xét:** Đây là một ví dụ tuyệt vời về cách tận dụng **first-class functions** và **type hints** trong Python để tạo ra code linh hoạt, dễ mở rộng và dễ đọc.

-----

## 🔨 Hands-on Exercises (3 Bài tập)

### 🥉 Bài tập 1: Xây dựng Thư viện Tiện ích (Cơ bản - 30 phút)

**Mô tả:** Viết một script Python chứa các hàm tiện ích cơ bản. Bài tập này giúp bạn làm quen với cú pháp hàm và luồng điều khiển.

**Yêu cầu:**

  - [ ] Viết một hàm `is_palindrome(text: str) -> bool` kiểm tra xem một chuỗi có phải là chuỗi palindrome không (đọc xuôi và ngược đều giống nhau).
  - [ ] Viết một hàm `fizzbuzz(n: int) -> List[Union[int, str]]` in ra một list các số từ 1 đến `n`. Nếu số chia hết cho 3, thay thế bằng 'Fizz'. Nếu chia hết cho 5, thay thế bằng 'Buzz'. Nếu chia hết cho cả 3 và 5, thay thế bằng 'FizzBuzz'.
  - [ ] Sử dụng một vòng lặp `for` để gọi hàm `fizzbuzz` và in kết quả ra màn hình.

**PHP Context:** Bài tập này tương tự việc bạn tạo các hàm tiện ích đơn giản trong PHP và sử dụng `for` loop để lặp qua một mảng kết quả.
**Starter Code:**

```python
from typing import List, Union

def is_palindrome(text: str) -> bool:
    # Your code here
    pass

def fizzbuzz(n: int) -> List[Union[int, str]]:
    # Your code here
    pass

if __name__ == "__main__":
    # Test cases
    print(f"'racecar' is a palindrome: {is_palindrome('racecar')}")
    print(f"'hello' is a palindrome: {is_palindrome('hello')}")

    fizzbuzz_list = fizzbuzz(15)
    print("FizzBuzz result for n=15:", fizzbuzz_list)
```

**Expected Output:**

```
'racecar' is a palindrome: True
'hello' is a palindrome: False
FizzBuzz result for n=15: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz']
```

**Hints:**

  - 💡 Với `is_palindrome`, bạn có thể so sánh chuỗi gốc với chuỗi đảo ngược. Trong Python, chuỗi có thể được đảo ngược bằng cách sử dụng slicing: `text[::-1]`.
  - 💡 Với `fizzbuzz`, sử dụng `if/elif/else` bên trong một vòng lặp `for i in range(1, n+1):`.

### 🥈 Bài tập 2: Hệ thống Lọc User (Trung bình - 45 phút)

**Mô tả:** Xây dựng một hệ thống lọc user đơn giản. Bài tập này yêu cầu bạn kết hợp các cấu trúc điều khiển luồng, hàm, và đối số linh hoạt.

**Yêu cầu:**

  - [ ] Viết một hàm `filter_users(users: list, **kwargs) -> list` nhận vào một list user (mỗi user là một dictionary) và một số đối số có tên `kwargs` (ví dụ: `city='Hanoi'`, `active=True`).
  - [ ] Hàm này sẽ trả về một list user mới chỉ chứa những user thỏa mãn tất cả các tiêu chí trong `kwargs`.
  - [ ] Bên trong hàm, sử dụng vòng lặp `for` để duyệt qua từng user và một vòng lặp `for` khác để kiểm tra từng điều kiện.

**PHP Context:** Trong PHP, bạn thường làm điều này bằng cách duyệt qua một mảng user và kiểm tra các điều kiện với `if` statement, nhưng việc truyền các điều kiện lọc linh hoạt với `**kwargs` trong Python là một cách tiếp cận khác biệt và mạnh mẽ hơn.

**Starter Code:**

```python
from typing import List, Dict, Any

def filter_users(users: List[Dict[str, Any]], **kwargs) -> List[Dict[str, Any]]:
    # Your code here
    pass

# User data for testing
all_users = [
    {"name": "Alice", "city": "Hanoi", "role": "admin", "active": True},
    {"name": "Bob", "city": "Hanoi", "role": "user", "active": True},
    {"name": "Charlie", "city": "HCM", "role": "user", "active": False},
    {"name": "David", "city": "Danang", "role": "admin", "active": True},
]

if __name__ == "__main__":
    # Test cases
    active_users = filter_users(all_users, active=True)
    print("Active users:", active_users)

    hanoi_admins = filter_users(all_users, city="Hanoi", role="admin")
    print("Hanoi admins:", hanoi_admins)

    inactive_users_in_hcm = filter_users(all_users, city="HCM", active=False)
    print("Inactive users in HCM:", inactive_users_in_hcm)
```

**Expected Output:**

```
Active users: [{'name': 'Alice', 'city': 'Hanoi', 'role': 'admin', 'active': True}, {'name': 'Bob', 'city': 'Hanoi', 'role': 'user', 'active': True}, {'name': 'David', 'city': 'Danang', 'role': 'admin', 'active': True}]
Hanoi admins: [{'name': 'Alice', 'city': 'Hanoi', 'role': 'admin', 'active': True}]
Inactive users in HCM: [{'name': 'Charlie', 'city': 'HCM', 'role': 'user', 'active': False}]
```

### 🥇 Bài tập 3: Cài đặt Middleware Cơ bản (Nâng cao - 60 phút)

**Mô tả:** Bài tập này đưa bạn đến gần hơn với cách các framework như FastAPI hoạt động. Bạn sẽ sử dụng **first-class functions** và **closures** để tạo ra một hệ thống middleware rất đơn giản.

**Yêu cầu:**

  - [ ] Viết một hàm `create_middleware_chain(middlewares: list, final_handler: callable) -> callable`. Hàm này nhận một danh sách các middleware (là các hàm) và một hàm xử lý cuối cùng (`final_handler`).
  - [ ] Hàm này sẽ "gói" các middleware từ ngoài vào trong và trả về một hàm xử lý cuối cùng đã được bọc.
  - [ ] Mỗi middleware phải có chữ ký `def middleware(next_handler: callable) -> callable`. Tức là nó nhận một hàm `handler` tiếp theo và trả về một hàm mới.
  - [ ] Tạo hai middleware: `logger_middleware` (in ra request trước và sau) và `auth_middleware` (kiểm tra `is_authenticated` trước khi gọi `next_handler`).
  - [ ] Tạo một `final_handler` để xử lý logic cuối cùng.

**Real-world Scenario:** Đây là cách mà các framework web hiện đại như Laravel, Symfony, hay Express.js (Node.js) xử lý các "middleware" để thêm chức năng như authentication, logging, rate limiting... một cách không xâm lấn vào logic chính của ứng dụng.

**Implementation Steps:**

1.  Viết hàm `logger_middleware`.
2.  Viết hàm `auth_middleware`.
3.  Viết hàm `final_handler`.
4.  Viết hàm `create_middleware_chain`.
5.  Tạo một request giả lập và chạy chuỗi middleware.

**Starter Code:**

```python
def logger_middleware(next_handler):
    def handler(request):
        print("Logger Middleware: Request received.")
        response = next_handler(request)
        print("Logger Middleware: Response sent.")
        return response
    return handler

def auth_middleware(next_handler):
    def handler(request):
        if request.get("is_authenticated"):
            print("Auth Middleware: User is authenticated. Proceeding.")
            return next_handler(request)
        else:
            print("Auth Middleware: User not authenticated. Aborting.")
            return {"status": 401, "message": "Unauthorized"}
    return handler

def final_handler(request):
    print("Final Handler: Executing core logic.")
    return {"status": 200, "message": "Success"}

def create_middleware_chain(middlewares, final_handler):
    # Your code here
    pass

if __name__ == "__main__":
    # Test case with unauthenticated user
    unauth_request = {"is_authenticated": False}
    app_unauth = create_middleware_chain([logger_middleware, auth_middleware], final_handler)
    response_unauth = app_unauth(unauth_request)
    print("Response for unauthenticated request:", response_unauth)
    
    # Test case with authenticated user
    auth_request = {"is_authenticated": True}
    app_auth = create_middleware_chain([logger_middleware, auth_middleware], final_handler)
    response_auth = app_auth(auth_request)
    print("Response for authenticated request:", response_auth)
```

**Bonus Challenges:**

  - 🌟 Chỉnh sửa hàm `create_middleware_chain` để nó hỗ trợ các đối số bổ sung cho từng middleware.
  - 🌟 Thêm một middleware thứ ba để ghi lại thời gian xử lý của request.

-----

## ✅ Self-Assessment Checklist

**Trước khi chuyển sang bài tiếp theo, hãy đảm bảo bạn có thể:**

  - [ ] Phân biệt và sử dụng thành thạo `if/elif/else` thay cho cú pháp PHP.
  - [ ] Định nghĩa hàm Python với từ khóa `def` và type hints chính xác.
  - [ ] Viết các vòng lặp `for` để lặp qua các cấu trúc dữ liệu cơ bản.
  - [ ] Sử dụng `*args` và `**kwargs` để tạo ra các hàm linh hoạt tương tự variadic functions.
  - [ ] Giải thích được khái niệm first-class functions và tại sao chúng quan trọng.
  - [ ] Chuyển đổi một đoạn code PHP sử dụng hàm và luồng điều khiển sang Python.
  - [ ] Áp dụng `functools.wraps` khi viết decorators.
  - [ ] Hiểu được sự khác biệt cơ bản giữa cách các framework PHP và Python sử dụng hàm và middleware.

-----

## 🔗 Resources & Further Reading

### Essential Resources:

  - 📖 **[Python Functions Documentation](https://www.google.com/search?q=https://docs.python.org/3/tutorial/controlflow.html%23defining-functions):** Tài liệu chính thức về hàm và luồng điều khiển.
  - 📖 **[PEP 8 -- Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/):** Hướng dẫn về cách viết code Python "sạch" và dễ đọc.
  - 📝 **[Real Python's Python Function Arguments Tutorial](https://realpython.com/python-kwargs-and-args/):** Hướng dẫn chi tiết về `*args` và `**kwargs`.
  - 🎥 **[Video on Python Decorators Explained](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3DF6kOjs_XpA8):** Video giải thích khái niệm decorators một cách trực quan.

### For PHP Developers:

  - 🔄 **[PHP to Python Function Comparison](https://www.google.com/search?q=https://www.php-to-python.com/):** Một trang web đơn giản giúp so sánh cú pháp PHP và Python.
  - ⚖️ **[Comparison of PHP vs Python for Web Development](https://www.google.com/search?q=https://www.freecodecamp.org/news/php-vs-python/):** Bài viết so sánh hai ngôn ngữ ở cấp độ web development.

-----

## 🐛 Common Pitfalls & Solutions

### Pitfall 1: Indentation Errors (Sự thay đổi lớn từ PHP)

**Problem:** PHP sử dụng `{}` để xác định khối code, còn Python sử dụng indentation. Lỗi `IndentationError` là một trong những lỗi phổ biến nhất với người mới bắt đầu.
**PHP Background:** Các PHP developer thường quen với việc indent code cho dễ đọc, nhưng nó không bắt buộc.
**Solution:** Sử dụng một IDE tốt (như VS Code, PyCharm) với các extension Python sẽ tự động định dạng code đúng cách. **Luôn sử dụng 4 space** cho mỗi cấp indentation, đây là tiêu chuẩn của cộng đồng Python (PEP 8).
**Prevention:** Thiết lập IDE của bạn để tự động chuyển `Tab` thành `4 spaces`.

### Pitfall 2: Hiểu sai `*args` và `**kwargs`

**Problem:** Nhầm lẫn giữa việc truyền một list/dictionary làm đối số thông thường và việc sử dụng cú pháp `*` và `**`.
**PHP Background:** Trong PHP, bạn có thể truyền một mảng và sử dụng `extract()` để đưa các biến vào scope, điều này tương tự `**kwargs` nhưng không an toàn. Hoặc bạn có thể truyền một mảng và tự xử lý các `key/value`.
**Solution:** Hãy nhớ rằng `*args` và `**kwargs` chỉ là các biến đặc biệt thu thập các đối số. Nếu bạn đã có sẵn một list hoặc dictionary, bạn phải mở gói (unpack) chúng khi gọi hàm bằng cú pháp `*my_list` hoặc `**my_dict`.

```python
# Ví dụ về unpacking
my_nums = [1, 2, 3]
def add_three(a, b, c):
    return a + b + c
add_three(*my_nums) # Correct, tương đương add_three(1, 2, 3)

my_config = {"name": "Test", "host": "localhost"}
def connect(**kwargs):
    print(f"Connecting to {kwargs['host']} as user {kwargs['name']}")
connect(**my_config) # Correct
```

-----

## 🎉 Summary & Next Steps

### Key Takeaways:

1.  **Luồng Điều Khiển:** Python sử dụng `if/elif/else`, `for...in`, `while` và **indentation** thay vì `{}` để định nghĩa các khối code.
2.  **Hàm:** Được định nghĩa bằng `def`. **Type hints** giúp code an toàn và dễ đọc hơn, tương tự như trong PHP 7+.
3.  **Đối số linh hoạt:** `*args` và `**kwargs` cho phép bạn tạo ra các hàm linh hoạt, chấp nhận số lượng đối số không giới hạn, giống như variadic functions trong PHP.
4.  **First-Class Functions:** Hàm trong Python có thể được gán cho biến, truyền làm đối số, hoặc trả về từ một hàm khác. Đây là nền tảng của nhiều design patterns mạnh mẽ, bao gồm decorators.

### How this connects to your PHP experience:

Các khái niệm về luồng điều khiển và hàm là cốt lõi của mọi ngôn ngữ lập trình. Kinh nghiệm của bạn với `if/else`, `for`, `function`, và các hàm callback trong PHP sẽ là một lợi thế lớn. Điểm khác biệt lớn nhất mà bạn cần làm quen là **indentation**, và cách Python sử dụng `for...in` thay vì `for ($i=...)` truyền thống. Khái niệm **first-class functions** sẽ mở ra một cách tư duy mới để xây dựng các hệ thống linh hoạt hơn, điều mà bạn đã từng làm với Closures trong PHP.

### Preparation for next lesson:

  - [ ] Hoàn thành tất cả các bài tập trong bài học này để củng cố kiến thức về luồng điều khiển và hàm.
  - [ ] Cài đặt thư viện `pytest` (pip install pytest) để chuẩn bị cho việc học unit testing.
  - [ ] Đọc qua một chút về "comprehensions" trong Python (List comprehension, Dict comprehension) để làm quen với cách viết code ngắn gọn và hiệu quả.

### Quick Win:

💡 **Thử thách nhỏ trước bài học tiếp theo:** Hãy viết một hàm `filter_by_type(data, data_type)` nhận vào một list bất kỳ và trả về một list mới chỉ chứa các phần tử có cùng `data_type` được chỉ định. Sử dụng `isinstance()` và `for` loop.

-----

## 📝 Lesson Notes Template (For learners)

````markdown
## My Notes - Bài 3

### Key Insights:
- Indentation replaces curly braces `{}` from PHP.
- `def` is the equivalent of `function`. Type hints are essential for readability.
- `*args` and `**kwargs` are powerful for creating flexible functions.
- First-class functions are like PHP Closures, but more deeply integrated into the language.

### Code Snippets I want to remember:
```python
# A good example of using *args and **kwargs
def my_func(*args, **kwargs):
    # Process args (tuple) and kwargs (dict)
    pass

# A simple decorator
def my_decorator(func):
    def wrapper(*args, **kwargs):
        # Do something before
        result = func(*args, **kwargs)
        # Do something after
        return result
    return wrapper

@my_decorator
def my_wrapped_func():
    pass
````

### Questions for review:

1.  What is the main difference between Python's `for` loop and PHP's `for` loop?
2.  How do `*args` and `**kwargs` compare to PHP's variadic functions?
3.  Can a PHP function return another function? How does this compare to Python's first-class functions?

### Personal action items:

  - [ ] Practice writing a few functions with type hints and docstrings.
  - [ ] Refactor a simple PHP function to use Python's `*args` and `**kwargs`.
