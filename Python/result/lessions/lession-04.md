# Bài 4: Pythonic Code - Sức Mạnh của Comprehensions

## 📋 Thông tin Bài học

  - **Module:** Python Foundations for PHP Veterans
  - **Thời gian:** 3.5 giờ
  - **Độ khó:** ⭐⭐⭐⭐ (4 sao)
  - **Prerequisites:** Bài 1: Môi trường & Cú pháp, Bài 2: Cấu trúc dữ liệu, Bài 3: Luồng điều khiển & Hàm

## 🎯 Mục tiêu Bài học

### Sau khi hoàn thành bài này, học viên sẽ:

  - [ ] Hiểu và phân biệt được code "Pythonic" so với code viết theo phong cách ngôn ngữ khác (như PHP).
  - [ ] Sử dụng thành thạo List, Dictionary và Set Comprehensions để viết code gọn gàng, dễ đọc, và hiệu quả hơn.
  - [ ] Ánh xạ các cú pháp lặp phức tạp của PHP (như `array_map`, `array_filter`, `foreach` lồng) sang Python Comprehensions.
  - [ ] Ứng dụng lambda functions vào các tình huống thực tế để tạo ra các hàm ẩn danh (anonymous functions) một cách hiệu quả.
  - [ ] Tối ưu hóa code bằng cách sử dụng Generator Expressions thay vì List Comprehensions khi xử lý dữ liệu lớn để tiết kiệm bộ nhớ.
  - [ ] Refactor các đoạn code sử dụng loops truyền thống sang cú pháp Pythonic để nâng cao chất lượng code.

-----

## 🔑 Key Points (Khái niệm Quan trọng)

### 1\. The "Pythonic" Way

**PHP Comparison:** Trong PHP, chúng ta thường có nhiều cách để giải quyết một vấn đề, ví dụ dùng `foreach` truyền thống hoặc các hàm array mạnh mẽ như `array_map`, `array_filter` của ngôn ngữ. "Pythonic" là thuật ngữ chỉ cách viết code tận dụng tối đa những tính năng độc đáo của Python để code trở nên gọn, rõ ràng, và dễ đọc hơn, tuân thủ theo các nguyên tắc của PEP 8.
**Python Implementation:** Thay vì viết các vòng lặp `for` dài dòng, chúng ta sẽ sử dụng các cú pháp ngắn gọn và biểu cảm như **comprehensions** hay **generators**.
**Example:**

```python
# The "PHP" way in Python
squares = []
for i in range(10):
    squares.append(i * i)

# The "Pythonic" way
squares_pythonic = [i * i for i in range(10)]
```

### 2\. List Comprehensions

**PHP Comparison:** List Comprehensions là một cách viết cực kỳ mạnh mẽ và ngắn gọn, tương đương với việc kết hợp các hàm `array_map()` và `array_filter()` trong PHP. Nó cho phép bạn tạo một `list` mới dựa trên một `iterable` có sẵn chỉ trong một dòng code.
**Python Implementation:** Cú pháp cơ bản là `[expression for item in iterable if condition]`.
**Example:**

```python
# PHP equivalent: array_map(fn($n) => $n * 2, array_filter($numbers, fn($n) => $n > 5));
numbers = [1, 2, 3, 6, 7, 8]
doubled_even_numbers = [n * 2 for n in numbers if n % 2 == 0] # [12, 16]
```

### 3\. Dictionary & Set Comprehensions

**PHP Comparison:** Tương tự như List Comprehensions, nhưng áp dụng cho `dict` (mảng kết hợp trong PHP) và `set` (mảng không trùng lặp). Đây là cách hiệu quả để xây dựng một `dict` hoặc `set` mới từ một `iterable` khác.
**Python Implementation:** Cú pháp cho Dictionary là `{key_expression: value_expression for item in iterable}`. Set là `{expression for item in iterable}`.
**Example:**

```python
# PHP equivalent: array_unique($data);
data = [1, 1, 2, 3, 2, 4, 5, 5]
unique_numbers = {n for n in data} # {1, 2, 3, 4, 5}

# PHP equivalent: array_combine($keys, $values)
keys = ['a', 'b', 'c']
values = [1, 2, 3]
my_dict = {k: v for k, v in zip(keys, values)} # {'a': 1, 'b': 2, 'c': 3}
```

### 4\. Lambda Functions

**PHP Comparison:** Lambda functions (hàm ẩn danh) trong Python rất giống với **anonymous functions** hay **closures** trong PHP. Chúng là những hàm nhỏ, không có tên, thường chỉ chứa một biểu thức đơn giản và được dùng ngay tại chỗ.
**Python Implementation:** Cú pháp `lambda arguments: expression` rất đơn giản và gọn gàng.
**Example:**

```python
# PHP equivalent: array_filter($users, fn($u) => $u['age'] > 30);
users = [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 35}]
senior_users = list(filter(lambda user: user['age'] > 30, users))
# [{'name': 'Bob', 'age': 35}]
```

### 5\. Generator Expressions

**PHP Comparison:** Generator Expressions tương tự List Comprehensions, nhưng nó không tạo ra một danh sách (list) mới trong bộ nhớ ngay lập tức. Thay vào đó, nó tạo ra một **generator object** (đối tượng sinh) mà bạn có thể lặp qua. Đây là kỹ thuật cực kỳ quan trọng khi xử lý dữ liệu lớn, tương tự cách `yield` trong PHP hoạt động.
**Python Implementation:** Cú pháp tương tự List Comprehension nhưng sử dụng dấu ngoặc đơn `()` thay vì ngoặc vuông `[]`.
**Example:**

```python
# List comprehension: Tạo toàn bộ list trong bộ nhớ
big_list = [i for i in range(1000000)]

# Generator expression: Tạo một iterator, không tốn bộ nhớ lớn
big_generator = (i for i in range(1000000))
# Bạn có thể lặp qua nó nhưng không thể truy cập trực tiếp bằng index
```

-----

## 📚 Lý thuyết Chi tiết

### The "Pythonic" Way: Đọc và Hiểu Code Python

Là một PHP developer, bạn đã quen thuộc với những cú pháp và patterns nhất định. Khi chuyển sang Python, việc viết code đúng cú pháp là một chuyện, nhưng viết code theo cách mà cộng đồng Python mong đợi - tức là "Pythonic" - lại là chuyện khác.

Một đoạn code "Pythonic" thường có các đặc điểm:

  - **Gọn gàng và súc tích:** Sử dụng các tính năng đặc trưng của ngôn ngữ như comprehensions để thay thế các vòng lặp dài.
  - **Dễ đọc:** Cú pháp tự nhiên, giống ngôn ngữ nói. Ví dụ: `for item in items` đọc như "đối với mỗi item trong items".
  - **Hiệu quả:** Tận dụng các cấu trúc dữ liệu và thuật toán tối ưu của Python.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|:-----|:--------|:---------|
| `if ($flag == true) { ... }` | `if flag: ...` | Trong Python, một giá trị `True` hoặc `False` đã đủ để làm điều kiện |
| `$result = []; foreach ($items as $item) { $result[] = $item; }` | `result = [item for item in items]` | List Comprehension ngắn gọn hơn nhiều |
| `$user['name'] ?? 'Guest'` | `user.get('name', 'Guest')` | Phương thức `.get()` giúp lấy giá trị mặc định mà không gây lỗi `KeyError` |
| `function is_even($n) { return $n % 2 == 0; }` | `def is_even(n: int) -> bool: ...` | Thêm type hints giúp code rõ ràng và dễ bảo trì hơn |

**Best Practices:**

  - ✅ **Sử dụng `f-strings` thay cho nối chuỗi:** Cú pháp `f"Hello, {name}"` không chỉ gọn hơn mà còn nhanh hơn.
  - ✅ **Áp dụng comprehensions:** Đây là dấu hiệu rõ ràng nhất của code "Pythonic".
  - ❌ **Tránh các vòng lặp thủ công:** Hạn chế các vòng lặp `for` với `range(len(list))`. Thay vào đó, hãy lặp trực tiếp trên `list` hoặc dùng `enumerate` nếu cần index.
  - ❌ **Không cần kiểm tra `is_null` hay `isset`:** Python có cách xử lý hiệu quả hơn với `try/except` hoặc sử dụng các phương thức có sẵn của `dict`.

### List Comprehensions: `array_map` và `array_filter` trong một cú pháp

Trong PHP, nếu bạn muốn biến đổi một mảng, bạn có thể dùng `array_map`. Nếu bạn muốn lọc các phần tử, bạn dùng `array_filter`. Nếu bạn muốn làm cả hai, bạn phải lồng hai hàm đó vào nhau. List Comprehensions của Python cho phép bạn làm điều đó chỉ trong một dòng code.

Cú pháp: `[expression for item in iterable if condition]`

  - **`expression`**: Biểu thức sẽ được tính toán cho mỗi phần tử. Ví dụ: `item * 2`, `item.upper()`.
  - **`item`**: Biến đại diện cho từng phần tử trong quá trình lặp.
  - **`iterable`**: Một đối tượng có thể lặp (như `list`, `tuple`, `set`, `string`, `range`, ...).
  - **`if condition` (tùy chọn):** Điều kiện để lọc các phần tử trước khi áp dụng `expression`.

**Ví dụ:**

```python
# PHP equivalent:
// $users = [['name' => 'Alice'], ['name' => 'Bob']];
// $names = array_map(fn($user) => $user['name'], $users);
users = [{'name': 'Alice'}, {'name': 'Bob'}]
names = [user['name'] for user in users]
print(names)
# Output: ['Alice', 'Bob']
```

**Ví dụ nâng cao - Comprehensions lồng nhau:**
Comprehensions có thể lồng vào nhau, tương tự như các vòng lặp `for` lồng nhau.

```python
# PHP equivalent:
// $matrix = [[1, 2], [3, 4]];
// $flattened = [];
// foreach ($matrix as $row) {
//     foreach ($row as $number) {
//         $flattened[] = $number;
//     }
// }
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened_list = [num for row in matrix for num in row]
print(flattened_list)
# Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Dictionary Comprehensions

Dictionary Comprehensions là một công cụ mạnh mẽ để tạo một dictionary (mảng kết hợp) mới. Nó rất hữu ích cho các tác vụ như ánh xạ (mapping) dữ liệu, chuyển đổi key/value, hoặc tạo dictionary từ hai list.

Cú pháp: `{key_expression: value_expression for item in iterable if condition}`

**Ví dụ:**

```python
# Tạo một dict từ 2 list
keys = ['name', 'age', 'city']
values = ['Alice', 30, 'New York']
user_profile = {key: value for key, value in zip(keys, values)}
print(user_profile)
# Output: {'name': 'Alice', 'age': 30, 'city': 'New York'}

# Tạo một dict từ một dict khác
original_prices = {'apple': 1.2, 'banana': 0.8, 'orange': 1.5}
discounted_prices = {item: price * 0.9 for item, price in original_prices.items() if price > 1.0}
print(discounted_prices)
# Output: {'apple': 1.08, 'orange': 1.35}
```

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|:-----|:--------|:---------|
| `array_combine($keys, $values)` | `{k: v for k, v in zip(keys, values)}` | Cú pháp Python linh hoạt hơn, có thể thêm logic |
| `foreach ($arr as $k => $v) { ... }` | `for k, v in arr.items(): ...` | Cú pháp `items()` là cách chính tắc để lặp qua `dict` |

**Best Practices:**

  - ✅ Sử dụng `zip` để kết hợp nhiều `iterable` khi cần.
  - ✅ Khi lặp qua một dictionary, dùng `.items()` để truy cập cả key và value, `.keys()` cho key, và `.values()` cho value.

### Generator Expressions: Tối ưu bộ nhớ với `yield`

Generator Expressions là một khái niệm nâng cao hơn, nhưng cực kỳ quan trọng đối với các PHP developer đã làm việc với các ứng dụng web quy mô lớn. Trong PHP, khi xử lý một lượng dữ liệu lớn từ database, việc lấy toàn bộ dữ liệu vào bộ nhớ có thể gây lỗi. `yield` giúp bạn "stream" dữ liệu, chỉ lấy từng phần tử một khi cần. Generator Expressions trong Python cũng hoạt động tương tự.

**Sự khác biệt quan trọng:**

  - **List Comprehension:** Tạo và lưu trữ toàn bộ `list` trong bộ nhớ. Tuyệt vời cho các tập dữ liệu nhỏ.
  - **Generator Expression:** Tạo một `generator object` (một dạng iterator). Nó tính toán và trả về từng giá trị một khi bạn yêu cầu, không lưu trữ toàn bộ `list`. Lý tưởng cho các tập dữ liệu lớn hoặc luồng dữ liệu vô hạn.

**Ví dụ:**

```python
# Giả sử chúng ta có một tập dữ liệu cực lớn, ví dụ 1 tỷ dòng
# List comprehension sẽ gây tràn bộ nhớ (MemoryError)
# big_list = [i * i for i in range(1000000000)] # DON'T DO THIS!

# Generator expression không tốn bộ nhớ lớn
big_generator = (i * i for i in range(1000000000))

# Chúng ta có thể lặp qua nó một cách an toàn
for square in big_generator:
    print(square)
    if square > 1000:
        break
```

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|:-----|:--------|:---------|
| `function my_generator() { yield ... }` | `(expression for ...)` | `yield` trong PHP tương đương với Generator Expression trong Python |
| `array_map` trên một mảng lớn | `list(...)` trên một generator | Generator cho phép bạn xử lý dữ liệu lớn mà không bị hạn chế bởi bộ nhớ |

**Best Practices:**

  - ✅ Luôn sử dụng Generator Expressions khi làm việc với các tập dữ liệu mà bạn không chắc chắn về kích thước, đặc biệt khi đọc file hoặc xử lý dữ liệu từ database.
  - ✅ Biểu thức của List Comprehension và Generator Expression là giống nhau, chỉ khác ở dấu ngoặc `[]` và `()`.

### Lambda Functions: Hàm ẩn danh cho các tác vụ đơn giản

Lambda functions là những hàm nhỏ, không có tên, thường chỉ được sử dụng một lần. Chúng được dùng rất nhiều trong các hàm bậc cao (higher-order functions) như `map()`, `filter()`, `sorted()`.

Cú pháp: `lambda arguments: expression`

**Ví dụ:**

```python
# PHP equivalent:
// usort($users, fn($a, $b) => $a['age'] <=> $b['age']);
users = [{'name': 'Bob', 'age': 35}, {'name': 'Alice', 'age': 25}]
sorted_users = sorted(users, key=lambda user: user['age'])
print(sorted_users)
# Output: [{'name': 'Alice', 'age': 25}, {'name': 'Bob', 'age': 35}]

# `map` và `filter` với lambda
numbers = [1, 2, 3, 4, 5, 6]
squared = list(map(lambda x: x * x, numbers))
print(squared)
# Output: [1, 4, 9, 16, 25, 36]
```

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|:-----|:--------|:---------|
| `fn($n) => $n * $n` | `lambda n: n * n` | Cú pháp tương đồng, `lambda` gọn hơn `fn` |
| `array_map` | `map` | Cả hai đều có thể nhận một hàm ẩn danh làm tham số |

**Best Practices:**

  - ✅ Dùng lambda functions khi bạn cần một hàm đơn giản, một dòng, không có tên.
  - ✅ Nếu hàm của bạn phức tạp hơn một biểu thức, hãy dùng `def` để định nghĩa một hàm đầy đủ.

-----

## 💻 Code Examples & Demos

### Demo 1: Chuyển đổi dữ liệu user từ PHP sang Pythonic

**Scenario:** Bạn có một mảng các đối tượng user cũ, giờ bạn muốn tạo một danh sách mới chỉ chứa tên của các user từ 30 tuổi trở lên.

**PHP Equivalent:**

```php
<?php
// Cùng logic implemented in PHP để so sánh
$users = [
    ['name' => 'Alice', 'age' => 25, 'status' => 'active'],
    ['name' => 'Bob', 'age' => 35, 'status' => 'inactive'],
    ['name' => 'Charlie', 'age' => 40, 'status' => 'active']
];

$senior_users = array_filter($users, fn($user) => $user['age'] >= 30);
$senior_names = array_map(fn($user) => strtoupper($user['name']), $senior_users);

print_r($senior_names);
// Output: Array ( [1] => BOB [2] => CHARLIE )
?>
```

**Pythonic Code:**

```python
# Pythonic way - using a single list comprehension
# This is much cleaner and more readable than the PHP equivalent
users = [
    {'name': 'Alice', 'age': 25, 'status': 'active'},
    {'name': 'Bob', 'age': 35, 'status': 'inactive'},
    {'name': 'Charlie', 'age': 40, 'status': 'active'}
]

# The comprehension filters first (if user['age'] >= 30)
# and then transforms the data (user['name'].upper())
senior_names = [user['name'].upper() for user in users if user['age'] >= 30]

print(senior_names)
# Expected Output: ['BOB', 'CHARLIE']
```

### Demo 2: Xử lý dữ liệu CSV

**Scenario:** Bạn cần đọc một file CSV, bỏ qua dòng header, và tạo một danh sách các dictionary từ dữ liệu. Đây là một tác vụ rất phổ biến trong web development.

**Pythonic Code:**

```python
import csv
from io import StringIO
from typing import List, Dict

# Simulate a CSV file content
csv_data = """name,email,role,is_active
Alice,alice@example.com,admin,true
Bob,bob@example.com,user,false
Charlie,charlie@example.com,user,true
"""

def process_csv_data(data: str) -> List[Dict]:
    """
    Processes CSV data from a string and returns a list of dictionaries.
    Filters out inactive users.
    
    Args:
        data: A multi-line string containing CSV content.
    
    Returns:
        A list of dictionaries, one for each active user.
    """
    # Use StringIO to treat the string as a file
    # This is a good practice for unit testing
    file_like_object = StringIO(data)
    
    # Use csv.DictReader to automatically read rows as dictionaries
    csv_reader = csv.DictReader(file_like_object)

    # Use a list comprehension to build the list of active users
    # We transform the 'is_active' string to a boolean
    active_users = [
        {
            'name': row['name'],
            'email': row['email']
        }
        for row in csv_reader if row['is_active'] == 'true'
    ]
    
    return active_users

active_users = process_csv_data(csv_data)
print(active_users)
# Expected Output: [{'name': 'Alice', 'email': 'alice@example.com'}, {'name': 'Charlie', 'email': 'charlie@example.com'}]
```

**PHP Equivalent:**

```php
<?php
// Cùng logic implemented in PHP để so sánh
$csv_data = "name,email,role,is_active
Alice,alice@example.com,admin,true
Bob,bob@example.com,user,false
Charlie,charlie@example.com,user,true";

function process_csv_data_php(string $data): array {
    $rows = explode("\n", trim($data));
    $header = str_getcsv(array_shift($rows));
    
    $active_users = [];
    foreach ($rows as $row) {
        $values = str_getcsv($row);
        $user_data = array_combine($header, $values);
        
        if ($user_data['is_active'] === 'true') {
            $active_users[] = ['name' => $user_data['name'], 'email' => $user_data['email']];
        }
    }
    return $active_users;
}

print_r(process_csv_data_php($csv_data));
// Output: Array ( [0] => Array ( [name] => Alice [email] => alice@example.com ) [1] => Array ( [name] => Charlie [email] => charlie@example.com ) )
?>
```

### Demo 3: Biến đổi cấu trúc API Response

**Scenario:** Bạn nhận được một response JSON từ một API bên ngoài với cấu trúc hơi khác so với cấu trúc bạn cần để lưu vào database hoặc trả về cho client. Bạn cần biến đổi nó một cách hiệu quả.

**Pythonic Code:**

```python
from typing import Dict, List

# Simulate a raw API response
raw_response = {
    'results': [
        {'id': 1, 'username': 'user1', 'joined_at': '2023-01-01T10:00:00Z', 'is_active': True},
        {'id': 2, 'username': 'user2', 'joined_at': '2023-02-15T11:30:00Z', 'is_active': False},
        {'id': 3, 'username': 'user3', 'joined_at': '2023-03-20T12:00:00Z', 'is_active': True},
    ],
    'meta': {'total_count': 3, 'page': 1}
}

def transform_api_data(data: Dict) -> List[Dict]:
    """
    Transforms a raw API response to a simplified user list.
    Only includes active users.
    
    Args:
        data: The raw dictionary from the API.
        
    Returns:
        A list of dictionaries with simplified user info.
    """
    # Use list comprehension to iterate and filter the 'results' list
    # The 'if' condition filters for active users
    # The 'expression' creates a new dictionary for each user
    active_users = [
        {'user_id': user['id'], 'user_name': user['username'], 'status': 'ACTIVE'}
        for user in data['results'] if user['is_active']
    ]
    return active_users

processed_users = transform_api_data(raw_response)
print(processed_users)
# Expected Output: [{'user_id': 1, 'user_name': 'user1', 'status': 'ACTIVE'}, {'user_id': 3, 'user_name': 'user3', 'status': 'ACTIVE'}]
```

### Demo 4: Tối ưu bộ nhớ với Generator Expressions

**Scenario:** Bạn cần tính tổng các số chẵn trong một dải số rất lớn. Nếu dùng List Comprehension, bạn sẽ tạo ra một list khổng lồ trong bộ nhớ, dễ gây lỗi. Generator Expression là giải pháp tối ưu.

**Pythonic Code:**

```python
import sys
from typing import Generator

def get_even_numbers_gen(limit: int) -> Generator[int, None, None]:
    """
    A generator expression to yield even numbers up to a given limit.
    This is memory-efficient and perfect for large numbers.
    """
    return (num for num in range(limit) if num % 2 == 0)

# We use a large number to demonstrate the memory savings
# With a list comprehension, this would consume significant memory
# With a generator, it consumes very little memory
limit_number = 10000000

# Using a generator expression
even_numbers_gen = get_even_numbers_gen(limit_number)
gen_size = sys.getsizeof(even_numbers_gen)
print(f"Size of generator object: {gen_size} bytes") # Should be very small

# We can iterate over the generator and sum the numbers
total = sum(even_numbers_gen)
print(f"Total of even numbers from 0 to {limit_number}: {total}")

# Comparing with a list comprehension
even_numbers_list = [num for num in range(limit_number) if num % 2 == 0]
list_size = sys.getsizeof(even_numbers_list)
print(f"Size of list object: {list_size} bytes") # Much larger
```

### Demo 5: Sử dụng lambda functions với `sorted()`

**Scenario:** Bạn có một danh sách các dictionary (ví dụ: các user), và bạn muốn sắp xếp chúng dựa trên một key cụ thể (ví dụ: tuổi) mà không làm thay đổi danh sách gốc.

**Pythonic Code:**

```python
from typing import List, Dict

users = [
    {'name': 'Bob', 'age': 35},
    {'name': 'Alice', 'age': 25},
    {'name': 'Charlie', 'age': 40}
]

# Use sorted() with a lambda function as the 'key' argument
# The key function tells sorted() what value to sort by for each element
sorted_by_age = sorted(users, key=lambda user: user['age'])

print("Users sorted by age:")
print(sorted_by_age)

# Sorted in reverse order
sorted_by_age_desc = sorted(users, key=lambda user: user['age'], reverse=True)
print("\nUsers sorted by age (descending):")
print(sorted_by_age_desc)

# Original list remains unchanged
print("\nOriginal list:")
print(users)
```

**PHP Equivalent:**

```php
<?php
// Cùng logic implemented in PHP để so sánh
$users = [
    ['name' => 'Bob', 'age' => 35],
    ['name' => 'Alice', 'age' => 25],
    ['name' => 'Charlie', 'age' => 40]
];

usort($users, fn($a, $b) => $a['age'] <=> $b['age']);
echo "Users sorted by age:\n";
print_r($users);

usort($users, fn($a, $b) => $b['age'] <=> $a['age']);
echo "\nUsers sorted by age (descending):\n";
print_r($users);
?>
```

-----

## 🔨 Hands-on Exercises (3 Bài tập)

### 🥉 Bài tập 1: Data Transformation (Cơ bản - 30 phút)

**Mô tả:** Viết một hàm nhận vào một danh sách các chuỗi, sau đó trả về một danh sách mới chứa độ dài của các chuỗi đó. Chỉ bao gồm các chuỗi có độ dài lớn hơn 3.

**Yêu cầu:**

  - [ ] Sử dụng List Comprehension để giải quyết bài toán.
  - [ ] Viết type hints cho cả tham số và giá trị trả về.
  - [ ] So sánh cách làm này với một giải pháp dùng `foreach` truyền thống.

**Starter Code:**

```python
from typing import List

def get_long_string_lengths(strings: List[str]) -> List[int]:
    """
    Returns a list containing the lengths of strings longer than 3 characters.
    
    Args:
        strings: A list of string inputs.
        
    Returns:
        A list of integers representing the lengths.
    """
    # Your code here - use a list comprehension!
    pass

# Test cases
test_strings = ["apple", "banana", "cat", "dog", "elephant"]
print(get_long_string_lengths(test_strings))
```

**Expected Output:**

```
[5, 6, 8]
```

**Hints:**

  - 💡 Bắt đầu với cú pháp `[expression for item in iterable if condition]`.
  - 💡 `expression` của bạn sẽ là `len(item)`.
  - 💡 `condition` của bạn sẽ là `len(item) > 3`.

### 🥈 Bài tập 2: Tích hợp Lambda và Comprehensions (Trung bình - 45 phút)

**Mô tả:** Viết một hàm `create_index` nhận vào một danh sách các dictionary (giả sử là user) và một `key` (ví dụ: `'email'`). Hàm này sẽ trả về một dictionary mới, trong đó `key` là giá trị của `key` được truyền vào, và `value` là toàn bộ dictionary user đó. Bạn cần lọc ra những user không có email.

**Yêu cầu:**

  - [ ] Sử dụng Dictionary Comprehension để tạo `index_map`.
  - [ ] Sử dụng lambda function bên trong comprehension để lấy giá trị key một cách linh hoạt.
  - [ ] Include error handling nếu một user không có key được truyền vào.
  - [ ] So sánh với cách bạn làm trong PHP với `foreach` và `array_filter`.

**PHP Context:** Trong Laravel hoặc các framework PHP, bạn có thể dùng `collect($users)->keyBy('email')`. Bài tập này sẽ giúp bạn hiểu cách Python làm việc tương tự ở mức thấp.

**Starter Code:**

```python
from typing import List, Dict, Any

def create_index(items: List[Dict], key: str) -> Dict[Any, Dict]:
    """
    Creates a dictionary index from a list of dictionaries.
    
    Args:
        items: A list of dictionaries.
        key: The key to use for the new dictionary's keys.
        
    Returns:
        A dictionary with the specified key's value as keys.
    """
    # Use a dictionary comprehension with a lambda function and an 'if' filter
    pass

# Test cases
users = [
    {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'},
    {'id': 2, 'name': 'Bob', 'email': None},
    {'id': 3, 'name': 'Charlie', 'email': 'charlie@example.com'}
]
indexed_users = create_index(users, 'email')
print(indexed_users)

# Test with a different key
indexed_by_id = create_index(users, 'id')
print(indexed_by_id)
```

**Expected Output:**

```
{'alice@example.com': {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'}, 'charlie@example.com': {'id': 3, 'name': 'Charlie', 'email': 'charlie@example.com'}}
{1: {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'}, 2: {'id': 2, 'name': 'Bob', 'email': None}, 3: {'id': 3, 'name': 'Charlie', 'email': 'charlie@example.com'}}
```

**Implementation Steps:**

1.  Khởi tạo một dictionary comprehension.
2.  Lặp qua `items`.
3.  Thêm một điều kiện `if item.get(key)` để đảm bảo key tồn tại và có giá trị hợp lệ.
4.  `key_expression` sẽ là `item[key]`.
5.  `value_expression` sẽ là `item`.

### 🥇 Bài tập 3: Xử lý Big Data & Tối ưu hóa (Nâng cao - 60 phút)

**Mô tả:** Bạn nhận được một file log khổng lồ (giả sử có hàng trăm triệu dòng) từ một server. Mỗi dòng chứa thông tin về một request, ví dụ: `GET /api/v1/users/123 200`. Bạn cần tìm tất cả các request có status code là `404` và trích xuất URL của chúng, nhưng không được phép load toàn bộ file vào bộ nhớ.

**Real-world Scenario:** Đây là một bài toán rất thực tế trong việc phân tích log server, nơi bạn không thể dùng `file_get_contents` trong PHP.

**Technical Requirements:**

  - [ ] Sử dụng Generator Expression để xử lý từng dòng file mà không load toàn bộ vào RAM.
  - [ ] Mở file an toàn bằng `with open(...)` context manager.
  - [ ] Trích xuất URL từ mỗi dòng log chỉ khi nó có status code `404`.
  - [ ] Viết hàm có thể nhận đường dẫn file log và trả về một generator chứa các URL.

**Solution Architecture:**

```
(log_file.log) --> [open file] --> (Generator Expression) --> [filter for ' 404 '] --> (Yield URL)
```

**Starter Code:**

```python
from typing import Generator
import os

# Create a dummy large log file for testing
log_file_path = "large_server.log"
with open(log_file_path, "w") as f:
    for i in range(1000000):
        if i % 1000 == 0:
            f.write(f"GET /api/v1/posts/{i} 404\n")
        else:
            f.write(f"GET /api/v1/users/{i} 200\n")

def find_404_urls_generator(file_path: str) -> Generator[str, None, None]:
    """
    A generator function that reads a large log file line by line
    and yields only the URLs with a 404 status code.
    
    Args:
        file_path: The path to the log file.
    
    Yields:
        Each URL found with a 404 status.
    """
    # Your code here - use 'with open' and a generator expression
    pass

# Use the generator
print("Finding 404 URLs...")
for url in find_404_urls_generator(log_file_path):
    print(url)
    
# Clean up the dummy file
os.remove(log_file_path)
```

**Testing:**

```python
# The generated output should show URLs like:
# /api/v1/posts/0
# /api/v1/posts/1000
# /api/v1/posts/2000
# ...and so on.
```

**Bonus Challenges:**

  - 🌟 Viết một hàm `count_status_codes` sử dụng Dictionary Comprehension để đếm số lần xuất hiện của mỗi status code.
  - 🌟 Modify generator để nó có thể nhận một status code bất kỳ làm tham số.

-----

## ✅ Self-Assessment Checklist

**Trước khi chuyển sang bài tiếp theo, hãy đảm bảo bạn có thể:**

  - [ ] Phân biệt được List, Dict, Set, và Generator Comprehensions và biết khi nào nên dùng từng loại.
  - [ ] Refactor một vòng lặp `for` lồng nhau thành một comprehension lồng nhau.
  - [ ] Giải thích tại sao Generator Expressions lại quan trọng trong việc xử lý dữ liệu lớn.
  - [ ] Viết một hàm `sorted()` với tham số `key` sử dụng `lambda`.
  - [ ] Chuyển đổi một đoạn code PHP dùng `array_map` và `array_filter` sang List Comprehension của Python.

-----

## 🔗 Resources & Further Reading

### Essential Resources:

  - 📖 **[PEP 20 – The Zen of Python](https://peps.python.org/pep-0020/):** Đọc để hiểu triết lý cốt lõi đằng sau "Pythonic code"
  - 📖 **[Python official documentation on comprehensions](https://www.google.com/search?q=https://docs.python.org/3/tutorial/datastructures.html%23list-comprehensions):** Tài liệu chính thức về List, Dictionary, và Set Comprehensions
  - 🎥 **[Video tutorial on Python Generators](https://www.google.com/search?q=https://www.youtube.com/watch%3Fv%3DD-aT3I57j-I):** Hướng dẫn trực quan về cách hoạt động của Generators
  - 📝 **[Real Python's comprehensive guide on comprehensions](https://www.google.com/search?q=https://realpython.com/python-list-comprehension/):** Một bài viết rất chi tiết với nhiều ví dụ thực tế.

### For PHP Developers:

  - 🔄 **[Comparison: PHP array functions vs Python comprehensions](https://www.google.com/search?q=https://blog.devgenius.io/php-array-functions-vs-python-list-comprehensions-a-comparison-a99f122822a1):** Một bài viết so sánh trực tiếp giúp bạn dễ dàng ánh xạ kiến thức cũ.
  - ⚖️ **[Python's `yield` vs PHP's `yield`](https://www.google.com/search?q=%5Bhttps://www.php.net/manual/en/language.generators.overview.php%5D\(https://www.php.net/manual/en/language.generators.overview.php\)):** Hiểu sự tương đồng và khác biệt giữa `yield` trong hai ngôn ngữ.

-----

## 🐛 Common Pitfalls & Solutions

### Pitfall 1: Sử dụng Comprehensions quá phức tạp

**Problem:** Bạn cố gắng nhồi nhét quá nhiều logic vào một comprehension, khiến nó trở nên khó đọc, dài dòng và khó debug.
**PHP Background:** Trong PHP, một dòng code dài với nhiều hàm lồng nhau cũng là một `anti-pattern`.
**Solution:**

  - Hãy nhớ rằng mục tiêu của code "Pythonic" là dễ đọc, không phải là ngắn nhất.
  - Nếu một comprehension cần nhiều hơn hai dòng code, hoặc có nhiều điều kiện `if` phức tạp, hãy cân nhắc quay lại với vòng lặp `for` truyền thống.
    **Prevention:**
  - Giữ comprehension đơn giản: chỉ một `for` và một `if` là lý tưởng.
  - Sử dụng các hàm phụ trợ để làm cho `expression` trong comprehension gọn hơn.

### Pitfall 2: Không phân biệt List Comprehension và Generator Expression

**Problem:** Bạn dùng List Comprehension cho một tập dữ liệu lớn và gây ra lỗi tràn bộ nhớ (MemoryError).
**PHP Background:** Bạn đã quen với việc dùng `array_map` trên các mảng nhỏ và không nghĩ đến giới hạn bộ nhớ.
**Solution:**

  - Luôn tự hỏi: "Mình có cần toàn bộ dữ liệu này trong bộ nhớ cùng một lúc không?".
  - Nếu câu trả lời là "Không", hãy dùng Generator Expression `()` thay vì List Comprehension `[]`.
    **Prevention:**
  - Phát triển thói quen sử dụng Generator Expression `()` cho các tác vụ I/O (đọc file, xử lý stream dữ liệu) và dữ liệu lớn.
  - Dùng List Comprehension `[]` cho các tập dữ liệu nhỏ và các tác vụ tính toán đơn giản.

### Pitfall 3: Lạm dụng Lambda Functions

**Problem:** Bạn viết một lambda function phức tạp, có nhiều logic, hoặc thậm chí gọi các hàm khác từ bên trong nó.
**PHP Background:** Bạn đã quen với `closures` của PHP, có thể chứa nhiều dòng code.
**Solution:**

  - Lambda functions của Python chỉ được phép chứa một biểu thức.
  - Nếu bạn cần nhiều hơn một dòng, hãy dùng `def` để định nghĩa một hàm đầy đủ và có tên.
    **Prevention:**
  - Dùng lambda chỉ cho những tác vụ đơn giản như sắp xếp (với `key`), lọc (`filter`), hoặc ánh xạ (`map`).
  - Hãy coi lambda là một "mini-function" dùng một lần, không hơn.

-----

## 🎉 Summary & Next Steps

### Key Takeaways:

1.  **The "Pythonic Way":** Viết code gọn gàng, súc tích và dễ đọc bằng cách tận dụng các tính năng đặc trưng của Python.
2.  **Comprehensions:** List, Dictionary, và Set Comprehensions là công cụ mạnh mẽ để thay thế các vòng lặp `for` phức tạp. Chúng tương đương với sự kết hợp của `array_map` và `array_filter` trong PHP.
3.  **Generators:** Sử dụng Generator Expressions `()` để tối ưu bộ nhớ khi làm việc với dữ liệu lớn, tương tự cách `yield` hoạt động trong PHP.

### How this connects to your PHP experience:

Bài học này đã giúp bạn thấy rằng các khái niệm như biến đổi mảng, lọc dữ liệu, và xử lý dữ liệu lớn không phải là mới. Điểm khác biệt lớn nhất là cú pháp của Python cho phép bạn làm những điều này một cách ngắn gọn, biểu cảm và hiệu quả hơn. Khả năng ánh xạ `array_map/filter` sang comprehensions và `yield` sang generators là một bước tiến lớn giúp bạn chuyển đổi tư duy từ PHP sang Python.

### Preparation for next lesson:

  - [ ] Review lại các khái niệm về `import` trong Python.
  - [ ] Cài đặt một IDE như VS Code hoặc PyCharm nếu bạn chưa có.
  - [ ] Thử viết lại một script PHP nhỏ mà bạn đã làm trước đây (ví dụ: một `helper function` hay một `class` đơn giản) bằng Python.

### Quick Win:

💡 **Thử thách nhỏ trước bài tiếp theo:** Hãy viết một Dict Comprehension để tạo một dictionary ánh xạ từ một list các tên người và tuổi. Ví dụ: `['Alice', 25, 'Bob', 30]` -\> `{'Alice': 25, 'Bob': 30}`.