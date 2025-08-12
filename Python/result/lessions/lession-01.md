# Module 1: Python Foundations for PHP Veterans

## Bài 1: Môi Trường & Cú Pháp So Sánh

### **Thông tin Bài học**

| **Mục** | **Chi tiết** |
| --- | --- |
| **Tên Module** | Module 1: Python Foundations for PHP Veterans |
| **Bài học số** | 1 |
| **Tên bài học** | Môi Trường & Cú Pháp So Sánh |
| **Thời lượng ước tính** | 3-4 giờ |
| **Đối tượng** | Senior PHP Developer (10+ năm kinh nghiệm) |
| **Ngôn ngữ** | Tiếng Việt (Code comments và thuật ngữ kỹ thuật bằng Tiếng Anh) |
| **Điều kiện tiên quyết** | Không có (Bài học đầu tiên) |

---

### **Mục tiêu Bài học**

Sau khi hoàn thành bài học này, bạn sẽ có thể:

1.  **Thiết lập môi trường phát triển Python chuyên nghiệp:** Hiểu và sử dụng `virtualenv` để quản lý các môi trường độc lập, tương tự như cách bạn dùng Composer cho từng dự án PHP.
2.  **Nắm vững cú pháp cơ bản của Python:** So sánh và đối chiếu trực tiếp với cú pháp PHP, nhận diện các điểm tương đồng và khác biệt cốt lõi về biến, kiểu dữ liệu, và toán tử.
3.  **Sử dụng thành thạo cấu trúc điều khiển của Python:** Viết các lệnh `if`, `for`, `while` một cách tự nhiên, hiểu rõ sự khác biệt với cú pháp của PHP (ví dụ: `foreach` vs. `for...in`, không có `switch`).
4.  **Làm chủ các cấu trúc dữ liệu cốt lõi:** Phân biệt và sử dụng hiệu quả `List` và `Dictionary` của Python, hiểu rõ chúng thay thế cho mảng (array) đa năng của PHP như thế nào.
5.  **Viết và thực thi các script Python đầu tiên:** Tự tin tạo ra các script đơn giản để giải quyết các bài toán nhỏ, áp dụng các kiến thức đã học.
6.  **Hiểu được triết lý thiết kế của Python:** Bắt đầu cảm nhận "The Zen of Python" và hiểu tại sao cú pháp của nó lại ưu tiên sự rõ ràng và đơn giản so với tính linh hoạt đôi khi phức tạp của PHP.

---

### **Key Points (Những điểm chính)**

| Key Point | So sánh với Kinh nghiệm PHP |
| :--- | :--- |
| **1. Môi trường ảo (`virtualenv`) là bắt buộc** | Trong PHP, Composer quản lý dependencies ở cấp độ dự án (`vendor` folder). Python còn đi xa hơn: `virtualenv` tạo ra một bản sao của toàn bộ trình thông dịch Python và các thư viện cho từng dự án, đảm bảo sự cô lập tuyệt đối, tránh "dependency hell" mà đôi khi PHP gặp phải với các extension hệ thống. |
| **2. Cú pháp "sạch" và bắt buộc thụt đầu dòng** | PHP dùng `{}` và `;` để định nghĩa khối lệnh và kết thúc câu lệnh. Python dùng thụt đầu dòng (indentation) - thường là 4 dấu cách. Điều này ban đầu có thể gây khó chịu, nhưng nó ép buộc code phải sạch sẽ, dễ đọc ngay từ đầu, loại bỏ các cuộc tranh luận về style-guide (PSR-12). |
| **3. Kiểu dữ liệu tường minh hơn** | PHP có kiểu dữ liệu linh hoạt (type juggling). Python cũng là dynamic-typed nhưng chặt chẽ hơn. Đặc biệt, Python phân biệt rõ ràng giữa `List` (mảng tuần tự) và `Dictionary` (mảng kết hợp key-value), không giống như `array` "tất cả trong một" của PHP. |
| **4. Vòng lặp `for` mạnh mẽ hơn `foreach`** | Vòng lặp `for item in iterable:` của Python là cách chuẩn để duyệt qua mọi thứ, từ `List`, `Dictionary` cho đến các đối tượng phức tạp. Nó tương đương với `foreach` của PHP nhưng linh hoạt hơn, có thể kết hợp với các hàm như `range()`, `enumerate()` để thay thế cho vòng lặp `for` truyền thống với biến đếm. |
| **5. Không có `echo`, `print_r`, `var_dump`** | `print()` là hàm cơ bản để xuất dữ liệu ra console. Để debug, bạn sẽ dùng `print(variable)`, `print(type(variable))`, `print(dir(variable))` hoặc các thư viện gỡ lỗi chuyên dụng như `pdb` hay các IDE debugger, thay thế cho `print_r` và `var_dump`. |
| **6. Mọi thứ đều là đối tượng (Object)** | Trong Python, số, chuỗi, hàm... tất cả đều là đối tượng với các phương thức và thuộc tính riêng. Điều này khác với PHP, nơi các kiểu dữ liệu nguyên thủy không phải là đối tượng. Ví dụ, bạn có thể gọi `"hello".upper()` trong Python, trong khi ở PHP bạn phải dùng `strtoupper("hello")`. |

---

### **Lý thuyết Chi tiết**

#### **1. Giới thiệu và Cài đặt Môi trường: Từ Composer/PECL đến Pip/Virtualenv**

Là một PHP developer kỳ cựu, bạn đã quá quen thuộc với Composer. Mỗi dự án có một file `composer.json` và một thư mục `vendor`. Điều này thật tuyệt vời cho việc quản lý thư viện ở cấp độ dự án. Tuy nhiên, bạn vẫn phụ thuộc vào phiên bản PHP và các extension được cài đặt trên hệ thống (thông qua `apt`, `yum`, hoặc `pecl`). Đã bao giờ bạn gặp cảnh dự án A cần `php-imagick` phiên bản X, trong khi dự án B lại cần phiên bản Y chưa? Đó chính là vấn đề mà môi trường ảo của Python giải quyết triệt để.

**1.1. Python's Philosophy: Isolation is Key**

Triết lý của Python là mỗi dự án nên được chứa trong một "bong bóng" hoàn toàn độc lập. Bong bóng này không chỉ chứa các thư viện (như `vendor` của Composer) mà còn chứa cả phiên bản trình thông dịch Python cụ thể. Đây được gọi là **Virtual Environment** (môi trường ảo).

*   **PHP Analogy:** Hãy tưởng tượng mỗi dự án PHP của bạn không chỉ có thư mục `vendor` riêng, mà còn có một bản sao PHP binary (ví dụ `php7.4`) và file `php.ini` riêng. Bạn có thể chạy dự án A với PHP 8.1 và dự án B với PHP 8.2 trên cùng một máy mà không cần dùng đến Docker hay các công cụ phức tạp khác. Đó chính là sức mạnh của `virtualenv`.

**1.2. Cài đặt Python và các công cụ cần thiết**

Hầu hết các hệ điều hành dựa trên Unix (Linux, macOS) đều có sẵn Python. Tuy nhiên, phiên bản này thường là của hệ thống và bạn **không bao giờ** nên đụng vào nó. Chúng ta sẽ cài đặt một phiên bản Python hiện đại và dùng nó để tạo môi trường ảo.

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install python3.11 python3.11-venv python3-pip

# For CentOS/RHEL
sudo dnf install python3.11

# For macOS (using Homebrew)
brew install python@3.11
```

*   `python3.11`: Trình thông dịch Python.
*   `python3.11-venv`: Module `venv` (virtual environment) đi kèm.
*   `python3-pip`: Trình quản lý gói của Python (tương đương Composer).

**1.3. Tạo và kích hoạt môi trường ảo với `venv`**

Giả sử bạn có một thư mục dự án mới `my-python-project`.

```bash
# 1. Create the project directory
mkdir my-python-project
cd my-python-project

# 2. Create the virtual environment
# Syntax: python<version> -m venv <name_of_env_folder>
# We'll name our folder '.venv' which is a common convention
python3.11 -m venv .venv

# What just happened?
# A new directory '.venv' is created. It contains:
# - A copy of the python3.11 interpreter
# - The pip package manager
# - Standard library files
# This is your project's isolated "bubble".
```

Bây giờ, hãy kích hoạt "bong bóng" đó:

```bash
# 3. Activate the virtual environment
source .venv/bin/activate

# Your shell prompt will change to indicate you're inside the venv:
# (.venv) user@machine:~/my-python-project$
```

Từ bây giờ, mọi lệnh `python` hay `pip` bạn gõ sẽ chỉ thực thi bên trong thư mục `.venv` này. Phiên bản Python và các thư viện hệ thống sẽ không bị ảnh hưởng.

**1.4. Quản lý Dependencies với `pip` và `requirements.txt`**

`pip` là Composer của thế giới Python. File `composer.json` được thay thế bằng một file `requirements.txt` đơn giản hơn.

*   **PHP Workflow (Composer):**
    1.  `composer require guzzlehttp/guzzle`
    2.  Composer tự động cập nhật `composer.json` và `composer.lock`.

*   **Python Workflow (Pip):**
    1.  `pip install requests` (tương đương Guzzle)
    2.  `pip freeze > requirements.txt` (để lưu lại danh sách các gói đã cài)

```bash
# Inside the activated virtual environment (.venv)

# Install a package
pip install requests

# See what's installed
pip list
# Package    Version
# ---------- -------
# certifi    2024.7.4
# charset-normalizer 3.3.2
# idna       3.7
# pip        24.0
# requests   2.32.3
# setuptools 69.5.1
# urllib3    2.2.2

# Save these packages to a file for others to install
pip freeze > requirements.txt
```

File `requirements.txt` sẽ trông như thế này:
```
certifi==2024.7.4
charset-normalizer==3.3.2
idna==3.7
requests==2.32.3
urllib3==2.2.2
```

Khi một developer khác tham gia dự án, họ chỉ cần:
```bash
# Clone the repo
git clone ...
cd project

# Create their own venv
python3.11 -m venv .venv
source .venv/bin/activate

# Install all dependencies from the file
pip install -r requirements.txt
```

Đây là quy trình chuẩn, tương tự như `composer install`.

---

#### **2. Cú pháp Cơ bản: So sánh Python và PHP**

Phần này sẽ là một cú sốc nhẹ. Python loại bỏ rất nhiều "tiếng ồn" (noise) mà bạn thấy trong PHP.

**2.1. Biến và Kiểu dữ liệu (Variables and Data Types)**

| Feature | PHP | Python | Ghi chú cho PHP Dev |
| :--- | :--- | :--- | :--- |
| **Khai báo biến** | `$name = "John";` | `name = "John"` | Không có `$` ở đầu. Không có `;` ở cuối. |
| **Constants** | `define('VERSION', '1.0');` <br> `const VERSION = '1.0';` | `VERSION = "1.0"` | Python không có hằng số thực sự. Quy ước là viết hoa tên biến để báo hiệu nó không nên được thay đổi. |
| **Chuỗi (Strings)** | `$s1 = 'single';` <br> `$s2 = "double $var";` | `s1 = 'single'` <br> `s2 = "double"` | Nháy đơn và nháy kép trong Python là **như nhau**. Cả hai đều không nội suy biến. |
| **Nối chuỗi** | `$full = $first . ' ' . $last;` | `full = first + " " + last` | Dùng dấu `+` thay vì `.`. |
| **Định dạng chuỗi** | `$msg = sprintf("Hi %s", $name);` | `msg = f"Hi {name}"` (f-string) | **F-strings** là một trong những tính năng được yêu thích nhất. Nó siêu mạnh mẽ và dễ đọc, giống như `"` trong PHP nhưng an toàn hơn. |
| **Kiểm tra tồn tại** | `isset($var)` | `if 'var' in locals():` <br> `if hasattr(obj, 'attr')` | Không có hàm `isset()` trực tiếp. Cách kiểm tra phụ thuộc vào ngữ cảnh (biến cục bộ, thuộc tính đối tượng, key trong dictionary). |
| **Null** | `$var = null;` | `var = None` | `None` là một đối tượng singleton, tương đương với `null` của PHP. |

**Side-by-side Comparison:**

```php
// PHP
$name = "Alice";
$age = 30;
$greeting = "Hello, $name!"; // Variable interpolation
echo $greeting . "\n";
echo 'Your age is ' . $age . "\n";

$user = null;
if (isset($user)) {
    // ...
}
```

```python
# Python
name = "Alice"
age = 30
# f-string is the modern, preferred way
greeting = f"Hello, {name}!" 
print(greeting)
# You can also use .format() or +
print("Your age is " + str(age)) # Note: must cast int to str for concatenation

user = None
if user is not None: # More pythonic to check for identity with 'is'
    # ...
```

**"Aha Moment":** F-string trong Python `f"Hello {name}"` giống như chuỗi nháy kép trong PHP `"Hello $name"`, nhưng bạn có thể đặt cả biểu thức phức tạp bên trong `{}`. Ví dụ: `f"Total: {price * quantity:.2f}"`. 

**2.2. Toán tử (Operators)**

Hầu hết các toán tử số học (`+`, `-`, `*`, `/`) đều giống nhau. Tuy nhiên, có một vài điểm khác biệt quan trọng.

| Operator | PHP | Python | Ghi chú cho PHP Dev |
| :--- | :--- | :--- | :--- |
| **Chia lấy nguyên** | `(int) (10 / 3)` | `10 // 3` | Python có toán tử riêng `//` cho việc này, rất tiện lợi. |
| **Luỹ thừa** | `pow(2, 3)` | `2 ** 3` | Toán tử `**` ngắn gọn hơn nhiều. |
| **So sánh bằng** | `==` (giá trị), `===` (giá trị & kiểu) | `==` (giá trị) | Python `==` hoạt động giống `==` của PHP cho các kiểu cơ bản, nhưng đối với đối tượng, nó so sánh giá trị. Không có `===`. |
| **So sánh định danh** | `$a === $b` (cho đối tượng) | `a is b` | `is` kiểm tra xem hai biến có trỏ đến cùng một đối tượng trong bộ nhớ hay không. Đây là cách thay thế cho `===` khi bạn thực sự quan tâm đến định danh của đối tượng. |
| **Toán tử logic** | `&&`, `||`, `!` | `and`, `or`, `not` | Python dùng từ tiếng Anh, làm cho code dễ đọc hơn. `if ($a && $b)` trở thành `if a and b:`. |
| **Null Coalescing** | `$name = $_GET['user'] ?? 'guest';` | `name = data.get('user', 'guest')` | Không có toán tử `??`. Cách xử lý phổ biến là dùng phương thức `.get()` của dictionary. |
| **Spaceship** | `$a <=> $b` | `(a > b) - (a < b)` | Không có toán tử spaceship. Phải tự triển khai logic so sánh. |

**2.3. Cấu trúc điều khiển (Control Structures)**

Đây là nơi bạn sẽ thấy sự khác biệt lớn nhất về cú pháp: **thụt đầu dòng (indentation)**.

**If/Elif/Else:**

```php
// PHP
$score = 85;
if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} else {
    echo "C";
}
```

```python
# Python
score = 85
if score >= 90:
    print("A")
elif score >= 80: # Note: it's 'elif', not 'elseif'
    print("B")
else:
    print("C")

# Notice the colons (:) and the mandatory indentation.
```

**"Aha Moment":** Ban đầu bạn sẽ ghét việc thụt đầu dòng. Nhưng sau một tuần, bạn sẽ yêu nó. Nó ép buộc mọi người trong team viết code theo cùng một style, dễ đọc hơn rất nhiều. Tạm biệt các cuộc tranh cãi về việc đặt dấu `{` ở đâu!

**Vòng lặp (Loops):**

Python không có vòng lặp `for` kiểu C như PHP. Vòng lặp `for` của Python hoạt động giống `foreach` của PHP.

```php
// PHP: Looping through an indexed array
$colors = ["red", "green", "blue"];
foreach ($colors as $color) {
    echo $color . "\n";
}

// PHP: Looping with index
for ($i = 0; $i < count($colors); $i++) {
    echo $i . ": " . $colors[$i] . "\n";
}
```

```python
# Python: The standard 'for' loop
colors = ["red", "green", "blue"]
for color in colors:
    print(color)

# Python: Looping with index using enumerate()
for i, color in enumerate(colors):
    print(f"{i}: {color}")

# Python: Looping a certain number of times using range()
for i in range(5): # from 0 to 4
    print(i)
```

**"Aha Moment":** `enumerate()` và `range()` là những người bạn mới của bạn. `enumerate()` thay thế cho nhu cầu dùng biến đếm `$i` trong `foreach`. `range()` thay thế cho vòng lặp `for ($i=...; ...; ...)` truyền thống.

**Switch/Case:**

Một sự thật gây sốc: **Python không có `switch/case`**. Điều này là do triết lý "chỉ nên có một cách (và tốt nhất là chỉ một) để làm điều đó".

```php
// PHP
switch ($role) {
    case 'admin':
        echo "Admin access";
        break;
    case 'editor':
        echo "Editor access";
        break;
    default:
        echo "Guest access";
}
```

```python
# Python: The common pattern is to use if/elif/else
role = 'admin'
if role == 'admin':
    print("Admin access")
elif role == 'editor':
    print("Editor access")
else:
    print("Guest access")

# For more complex cases, a dictionary lookup is preferred
def get_admin_access():
    return "Admin access (from function)"

def get_editor_access():
    return "Editor access (from function)"

def get_guest_access():
    return "Guest access (from function)"

access_levels = {
    'admin': get_admin_access,
    'editor': get_editor_access,
}

# .get() provides a default value if the key is not found
access_function = access_levels.get(role, get_guest_access)
print(access_function())
```

**"Aha Moment":** Việc dùng dictionary để thay thế `switch` không chỉ là một "workaround". Nó là một pattern rất mạnh mẽ, cho phép bạn xây dựng các hệ thống dispatch động, dễ mở rộng hơn nhiều so với một khối `switch` cứng nhắc.

---

#### **3. Cấu trúc Dữ liệu: Từ `array()` của PHP đến `List` & `Dictionary` của Python**

Trong PHP, `array` là một con "quái vật" đa năng. Nó có thể là một mảng tuần tự, một mảng kết hợp (hash map), hoặc cả hai.

```php
// PHP's "one size fits all" array
$php_array = [
    0 => "apple",          // indexed element
    1 => "banana",         // indexed element
    "type" => "fruit",     // associative element
    "quantity" => 12
];
```

Python tách bạch hai vai trò này thành hai cấu trúc dữ liệu riêng biệt, được tối ưu hóa cao: `List` và `Dictionary`.

**3.1. `List`: Mảng tuần tự (Indexed Arrays)**

`List` trong Python tương đương với mảng chỉ có key là số nguyên, tuần tự trong PHP.

| Feature | PHP (Indexed Array) | Python (`List`) | Ghi chú cho PHP Dev |
| :--- | :--- | :--- | :--- |
| **Khai báo** | `$items = ["a", "b", "c"];` <br> `$items = array("a", "b", "c");` | `items = ["a", "b", "c"]` <br> `items = list(("a", "b", "c"))` | Cú pháp `[]` là phổ biến nhất. |
| **Truy cập phần tử** | `$items[0]` | `items[0]` | Giống hệt nhau. |
| **Thêm phần tử** | `$items[] = "d";` <br> `array_push($items, "d");` | `items.append("d")` | `append()` là phương thức của đối tượng list. Nhớ rằng mọi thứ trong Python đều là đối tượng. |
| **Đếm phần tử** | `count($items)` | `len(items)` | Dùng hàm `len()` toàn cục, không phải phương thức. Đây là một quy ước thiết kế của Python. |
| **Kiểm tra tồn tại** | `in_array("a", $items)` | `"a" in items` | Cú pháp `in` tự nhiên và dễ đọc hơn nhiều. |
| **Xóa phần tử** | `unset($items[1]);` | `del items[1]` <br> `items.pop(1)` <br> `items.remove("b")` | Python cung cấp nhiều cách xóa: theo index (`del`, `pop`), theo giá trị (`remove`). |

**Side-by-side Comparison:**

```php
// PHP
$fruits = ['apple', 'banana', 'cherry'];
$fruits[] = 'orange';
echo count($fruits) . "\n"; // 4
unset($fruits[1]); // Removes 'banana'
print_r($fruits);
// Array ( [0] => apple [2] => cherry [3] => orange )
// Notice the keys are not re-indexed!
```

```python
# Python
fruits = ['apple', 'banana', 'cherry']
fruits.append('orange')
print(len(fruits)) # 4
fruits.pop(1) # Removes 'banana' and returns it
print(fruits)
# ['apple', 'cherry', 'orange']
# The list is automatically re-indexed. This is a key difference!
```

**3.2. `Dictionary`: Mảng kết hợp (Associative Arrays)**

`Dictionary` (thường gọi là `dict`) trong Python là mảng key-value của PHP.

| Feature | PHP (Associative Array) | Python (`Dictionary`) | Ghi chú cho PHP Dev |
| :--- | :--- | :--- | :--- |
| **Khai báo** | `$user = ["name" => "John", "age" => 30];` | `user = {"name": "John", "age": 30}` | Dùng `{}` và `:`. |
| **Truy cập phần tử** | `$user["name"]` | `user["name"]` | Giống hệt nhau. |
| **Truy cập an toàn** | `isset($user['email']) ? $user['email'] : null` | `user.get("email")` | Phương thức `.get()` cực kỳ hữu ích, nó trả về `None` (hoặc một giá trị mặc định `user.get("email", "N/A")`) nếu key không tồn tại, tránh lỗi. |
| **Thêm/Cập nhật** | `$user["city"] = "New York";` | `user["city"] = "New York"` | Giống hệt nhau. |
| **Kiểm tra key** | `array_key_exists("age", $user)` | `"age" in user` | Lại là cú pháp `in` tiện lợi. |
| **Lấy tất cả keys** | `array_keys($user)` | `list(user.keys())` | `user.keys()` trả về một đối tượng view đặc biệt, cần chuyển thành `list` nếu muốn dùng như mảng thông thường. |
| **Lấy tất cả values** | `array_values($user)` | `list(user.values())` | Tương tự `keys()`. |

**Side-by-side Comparison:**

```php
// PHP
$config = [
    'db_host' => 'localhost',
    'db_user' => 'root',
];
$config['db_pass'] = 'secret';

foreach ($config as $key => $value) {
    echo "$key: $value\n";
}
```

```python
# Python
config = {
    'db_host': 'localhost',
    'db_user': 'root',
}
config['db_pass'] = 'secret'

# Looping through a dictionary
for key, value in config.items():
    print(f"{key}: {value}")

# Just looping through keys (most common)
for key in config:
    print(f"Key: {key}, Value: {config[key]}")
```

**"Aha Moment":** Phương thức `.items()` là cách "Pythonic" để duyệt qua cả key và value của một dictionary. Nó hiệu quả hơn và dễ đọc hơn cách làm của PHP. Việc tách `List` và `Dict` giúp trình thông dịch Python tối ưu hóa bộ nhớ và tốc độ truy cập cho từng loại cấu trúc dữ liệu, điều mà `array` đa năng của PHP không thể làm tốt bằng.

---

### **Code Examples & Demos**

#### **Example 1: Basic Script - User Greeting**

Một script đơn giản để lấy tên người dùng và in lời chào.

**PHP Version (`greeting.php`)**
```php
<?php
// greeting.php

// In a real web app, this would come from $_GET or $_POST
// For a CLI script, we can use $argv
$name = $argv[1] ?? 'Guest';

$hour = (int)date('H');
$greeting = "Good day";

if ($hour < 12) {
    $greeting = "Good morning";
} elseif ($hour < 18) {
    $greeting = "Good afternoon";
} else {
    $greeting = "Good evening";
}

echo sprintf("%s, %s!", $greeting, $name) . PHP_EOL;
?>
```
*Run: `php greeting.php ThangTT`*

**Python Version (`greeting.py`)**
```python
# greeting.py
import sys
from datetime import datetime

def main():
    """
    Main function to greet the user.
    This is a common pattern in Python to structure code.
    """
    # In Python, we access command-line arguments via sys.argv
    # sys.argv[0] is the script name itself, so we start from index 1
    try:
        name = sys.argv[1]
    except IndexError:
        name = "Guest"

    hour = datetime.now().hour
    greeting = "Good day"

    if hour < 12:
        greeting = "Good morning"
    elif hour < 18:
        greeting = "Good afternoon"
    else:
        greeting = "Good evening"

    # Using an f-string for clean output
    print(f"{greeting}, {name}!")

# This special block ensures the main() function is called only when
# the script is executed directly (not when imported as a module).
# This is a crucial concept for code reusability.
if __name__ == "__main__":
    main()
```
*Run: `python greeting.py ThangTT`*

**Key Differences:**
*   **Entry Point:** Python dùng `if __name__ == "__main__":` để tạo một entry point rõ ràng, giúp file vừa có thể chạy như một script, vừa có thể được import bởi các file khác mà không tự động chạy code. PHP không có cơ chế tương đương trực tiếp.
*   **Dependencies:** Python cần `import sys` và `import datetime` một cách tường minh.
*   **Error Handling:** Python khuyến khích dùng `try...except` để xử lý các lỗi dự kiến, như việc không có argument dòng lệnh.

---

#### **Example 2: Data Processing - Simple Report**

Xử lý một danh sách "giao dịch" và tính tổng doanh thu theo danh mục.

**PHP Version (`report.php`)**
```php
<?php
// report.php
$transactions = [
    ['category' => 'Electronics', 'amount' => 1200.00],
    ['category' => 'Groceries', 'amount' => 150.50],
    ['category' => 'Electronics', 'amount' => 800.00],
    ['category' => 'Clothing', 'amount' => 250.00],
    ['category' => 'Groceries', 'amount' => 75.25],
];

$report = [];

foreach ($transactions as $tx) {
    $category = $tx['category'];
    $amount = $tx['amount'];

    if (!isset($report[$category])) {
        $report[$category] = 0;
    }
    $report[$category] += $amount;
}

// Sort by category name
ksort($report);

echo "Sales Report:\n";
foreach ($report as $category => $total) {
    echo sprintf("- %-15s: $%10.2f\n", $category, $total);
}
?>
```

**Python Version (`report.py`)**
```python
# report.py
from collections import defaultdict

def generate_sales_report(transactions: list[dict]) -> dict:
    """
    Processes a list of transactions and calculates total sales per category.
    
    :param transactions: A list of transaction dictionaries.
    :return: A dictionary with category totals.
    """
    # defaultdict is a specialized dictionary. If a key is accessed for the
    # first time, it automatically creates an entry with a default value
    # (in this case, float(), which is 0.0), avoiding the need for an 'if' check.
    report = defaultdict(float)

    for tx in transactions:
        report[tx['category']] += tx['amount']
        
    return report

def print_report(report: dict):
    """Prints the formatted report."""
    print("Sales Report:")
    # .items() gives us key-value pairs. sorted() can sort them by key.
    for category, total in sorted(report.items()):
        # f-string formatting is powerful for alignment and precision
        print(f"- {category:<15}: ${total:>10.2f}")

if __name__ == "__main__":
    transactions = [
        {'category': 'Electronics', 'amount': 1200.00},
        {'category': 'Groceries', 'amount': 150.50},
        {'category': 'Electronics', 'amount': 800.00},
        {'category': 'Clothing', 'amount': 250.00},
        {'category': 'Groceries', 'amount': 75.25},
    ]
    
    sales_report = generate_sales_report(transactions);
    print_report(sales_report)
```

**Key Differences & Python Advantages:**
*   **`defaultdict`:** Đây là một ví dụ điển hình về thư viện chuẩn mạnh mẽ của Python. `defaultdict` làm cho code tính tổng gọn gàng và hiệu quả hơn, loại bỏ hoàn toàn khối `if (!isset(...))` trong vòng lặp.
*   **Type Hints:** `transactions: list[dict]` và `-> dict` là các gợi ý kiểu. Chúng không được thực thi lúc runtime nhưng cực kỳ hữu ích cho IDE, static analysis (như MyPy) và giúp người đọc hiểu code nhanh hơn. Đây là tiêu chuẩn trong code Python hiện đại, tương tự như type hinting trong PHP 7.4+.
*   **Functions:** Code Python được tổ chức thành các hàm nhỏ, có mục đích rõ ràng (`generate_sales_report`, `print_report`), thúc đẩy tái sử dụng và testability.
*   **Sorting:** `sorted(report.items())` là một cách thanh lịch để lấy một danh sách các cặp (key, value) đã được sắp xếp theo key.

---
### **Hands-on Exercises**

#### **Exercise 1: Bronze 🥉 - The FizzBuzz Challenge (Pythonic Way)** (30 phút)

**PHP Context:** FizzBuzz là bài toán phỏng vấn kinh điển. Trong PHP, bạn sẽ dùng toán tử `%` (modulo) và một vòng lặp `for` hoặc `foreach` với `range()`. Mục tiêu ở đây là làm quen với cú pháp `for...in range()` và `if/elif/else` của Python.

**Requirements Checklist:**
- [ ] Viết một script Python tên là `fizzbuzz.py`.
- [ ] Script sẽ lặp từ 1 đến 100 (bao gồm cả 100).
- [ ] In "Fizz" nếu số đó chia hết cho 3.
- [ ] In "Buzz" nếu số đó chia hết cho 5.
- [ ] In "FizzBuzz" nếu số đó chia hết cho cả 3 và 5.
- [ ] In ra số đó trong các trường hợp còn lại.
- [ ] Sử dụng `if/elif/else` và toán tử `%`.
- [ ] Sử dụng vòng lặp `for num in range(...)`.

**Starter Code Template (`fizzbuzz.py`):**
```python
# fizzbuzz.py

def fizzbuzz():
    """
    Implements the FizzBuzz logic from 1 to 100.
    """
    # Your code goes here
    # Hint: range(1, 101) will give you numbers from 1 to 100.
    pass # The 'pass' keyword is a placeholder, you should remove it.

if __name__ == "__main__":
    fizzbuzz()
```

**Expected Output (một phần):**
```
1
2
Fizz
4
Buzz
Fizz
...
14
FizzBuzz
...
98
Fizz
Buzz
```

**Step-by-step Hints:**
1.  Bên trong hàm `fizzbuzz`, tạo một vòng lặp `for` với `range(1, 101)`.
2.  Bên trong vòng lặp, điều kiện **đầu tiên** bạn nên kiểm tra là trường hợp phức tạp nhất: chia hết cho cả 3 và 5. `if num % 3 == 0 and num % 5 == 0:` (hoặc `if num % 15 == 0:`).
3.  Sử dụng `elif` để kiểm tra các điều kiện còn lại (chia hết cho 3, chia hết cho 5).
4.  Sử dụng `else` cho trường hợp cuối cùng (in ra số).

---

#### **Exercise 2: Silver 🥈 - Configuration File Loader** (45 phút)

**PHP Context:** Trong các framework như Laravel hay Symfony, bạn thường có các file config trả về một mảng (ví dụ `config/database.php`). Bài tập này mô phỏng việc đọc một file `.ini` đơn giản và chuyển nó thành một `Dictionary` trong Python, xử lý các kiểu dữ liệu khác nhau.

**Requirements Checklist:**
- [ ] Tạo một file `config.ini` với nội dung bên dưới.
- [ ] Viết một script Python `config_loader.py` để đọc file này.
- [ ] Script phải chuyển đổi nội dung file thành một `Dictionary`.
- [ ] Các giá trị `true`/`false` phải được chuyển thành `bool` (`True`/`False`).
- [ ] Các giá trị số nguyên phải được chuyển thành `int`.
- [ ] Các giá trị số thực phải được chuyển thành `float`.
- [ ] Các giá trị khác giữ nguyên là `string`.
- [ ] Script phải in ra `Dictionary` kết quả và kiểu dữ liệu của mỗi giá trị.
- [ ] Không được dùng thư viện `configparser` của Python. Mục đích là để luyện tập xử lý file và chuỗi.

**Starter Files:**

**`config.ini`**
```ini
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=s3cr3t_p@ssw0rd

# Application Settings
APP_DEBUG=true
MAX_CONNECTIONS=100
REQUEST_TIMEOUT=2.5
APP_ENV=development
```

**`config_loader.py` (Starter Template)**
```python
# config_loader.py

def parse_value(value: str):
    """
    Tries to convert a string value to its correct type (bool, int, float).
    Returns the original string if no conversion is possible.
    """
    # Hint: Check for 'true'/'false' first.
    # Then, try to convert to int, then float, using try-except blocks.
    
    # Check for boolean
    if value.lower() == 'true':
        return True
    if value.lower() == 'false':
        return False
    
    # Check for integer
    try:
        return int(value)
    except ValueError:
        pass # Not an int, try float
        
    # Check for float
    try:
        return float(value)
    except ValueError:
        pass # Not a float either
        
    # Return as string if all else fails
    return value


def load_config(filepath: str) -> dict:
    """
    Reads a .ini file and parses it into a dictionary.
    """
    config = {}
    # Hint: Open the file using 'with open(...) as f:'
    # This ensures the file is closed automatically.
    # Loop through each line in the file.
    # Ignore empty lines and lines starting with '#'.
    # Split the line at the first '=' character.
    # Use the parse_value function on the value part.
    
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip() # Remove leading/trailing whitespace
            if not line or line.startswith('#'):
                continue
            
            key, value = line.split('=', 1)
            config[key.strip()] = parse_value(value.strip())
            
    return config

if __name__ == "__main__":
    config_data = load_config('config.ini')
    
    print("--- Loaded Configuration ---")
    print(config_data)
    
    print("\n--- Value Types ---")
    for key, value in config_data.items():
        print(f"'{key}': {value} ({type(value)})")

```

**Expected Output:**
```
--- Loaded Configuration ---
{'DB_HOST': 'localhost', 'DB_USER': 'root', 'DB_PASS': 's3cr3t_p@ssw0rd', 'APP_DEBUG': True, 'MAX_CONNECTIONS': 100, 'REQUEST_TIMEOUT': 2.5, 'APP_ENV': 'development'}

--- Value Types ---
'DB_HOST': localhost (<class 'str'>)
'DB_USER': root (<class 'str'>)
'DB_PASS': s3cr3t_p@ssw0rd (<class 'str'>)
'APP_DEBUG': True (<class 'bool'>)
'MAX_CONNECTIONS': 100 (<class 'int'>)
'REQUEST_TIMEOUT': 2.5 (<class 'float'>)
'APP_ENV': development (<class 'str'>)
```

---

#### **Exercise 3: Gold 🥇 - Log File Analyzer** (60 phút)

**PHP Context:** Giả sử bạn có một file log của Nginx hoặc Apache. Trong PHP, bạn sẽ dùng `fopen`, `fgets` và biểu thức chính quy (`preg_match`) để phân tích từng dòng. Bài tập này yêu cầu bạn làm điều tương tự trong Python, trích xuất thông tin có cấu trúc từ dữ liệu phi cấu trúc và tính toán một số thống kê cơ bản.

**Requirements Checklist:**
- [ ] Cho một file log `access.log`, viết script `log_analyzer.py`.
- [ ] Đọc và phân tích từng dòng của file log.
- [ ] Với mỗi dòng hợp lệ, trích xuất: địa chỉ IP, phương thức HTTP (GET, POST), và status code.
- [ ] Đếm tổng số request.
- [ ] Đếm số lượng request theo từng phương thức (GET, POST, etc.).
- [ ] Đếm số lượng request theo từng status code (200, 404, 500, etc.).
- [ ] In ra một bản báo cáo tổng hợp các thông tin trên.
- [ ] Sử dụng `Dictionary` để lưu trữ các bộ đếm.
- [ ] Sử dụng `try-except` để bỏ qua các dòng log không đúng định dạng.

**Starter Files:**

**`access.log`**
```log
127.0.0.1 - - [10/Aug/2025:13:55:36 +0000] "GET /api/v1/users HTTP/1.1" 200 1024
192.168.1.1 - - [10/Aug/2025:13:56:01 +0000] "GET /api/v1/products HTTP/1.1" 200 4096
127.0.0.1 - - [10/Aug/2025:13:57:12 +0000] "POST /api/v1/users HTTP/1.1" 201 256
This is a malformed log line.
192.168.1.2 - - [10/Aug/2025:13:58:00 +0000] "GET /static/style.css HTTP/1.1" 304 0
192.168.1.1 - - [10/Aug/2025:13:59:30 +0000] "GET /api/v1/products/123 HTTP/1.1" 404 128
127.0.0.1 - - [10/Aug/2025:14:00:05 +0000] "PUT /api/v1/users/1 HTTP/1.1" 500 512
192.168.1.1 - - [10/Aug/2025:14:01:15 +0000] "POST /api/v1/orders HTTP/1.1" 201 512
```

**`log_analyzer.py` (Starter Template)**
```python
# log_analyzer.py
from collections import defaultdict

def analyze_log(filepath: str) -> dict:
    """
    Analyzes a log file and returns statistics.
    """
    total_requests = 0
    method_counts = defaultdict(int)
    status_counts = defaultdict(int)

    with open(filepath, 'r') as f:
        for line in f:
            try:
                # Your parsing logic here
                # Hint: Split the line string to extract parts.
                # The part with "GET /path HTTP/1.1" is the most interesting.
                # You can split it further by space.
                parts = line.split('"')
                if len(parts) < 2:
                    continue # Malformed line

                request_part = parts[1] # e.g., "GET /api/v1/users HTTP/1.1"
                request_details = request_part.split()
                
                method = request_details[0]
                
                status_code_part = parts[2].strip().split()[0]
                status_code = int(status_code_part)

                # If parsing is successful, update counters
                total_requests += 1
                method_counts[method] += 1
                status_counts[status_code] += 1

            except (ValueError, IndexError):
                # This will catch errors from int() conversion or list index out of bounds
                # for malformed lines.
                print(f"Skipping malformed line: {line.strip()}")
                continue

    return {
        "total_requests": total_requests,
        "method_counts": dict(method_counts), # Convert defaultdict to dict for cleaner output
        "status_counts": dict(status_counts),
    }

def print_analysis_report(stats: dict):
    """Prints a formatted analysis report."""
    print("\n--- Log Analysis Report ---")
    print(f"Total Requests: {stats['total_requests']}")

    print("\nRequests by Method:")
    for method, count in stats['method_counts'].items():
        print(f"- {method}: {count}")

    print("\nRequests by Status Code:")
    for status, count in stats['status_counts'].items():
        print(f"- {status}: {count}")


if __name__ == "__main__":
    log_stats = analyze_log('access.log')
    print_analysis_report(log_stats)
```

**Expected Output:**
```
Skipping malformed line: This is a malformed log line.

--- Log Analysis Report ---
Total Requests: 6

Requests by Method:
- GET: 3
- POST: 2
- PUT: 1

Requests by Status Code:
- 200: 2
- 201: 2
- 304: 1
- 404: 1
- 500: 1
```

---

### ✅ **Self-Assessment Checklist**

Đánh dấu vào các ô sau để đảm bảo bạn đã nắm vững kiến thức.

- [ ] Tôi có thể giải thích sự khác biệt giữa `pip` và `Composer`, và tại sao `virtualenv` lại quan trọng trong Python.
- [ ] Tôi có thể tự tay tạo, kích hoạt và hủy kích hoạt một môi trường ảo.
- [ ] Tôi có thể cài đặt một gói bằng `pip` và lưu các dependencies vào file `requirements.txt`.
- [ ] Tôi có thể viết biến, chuỗi, và hằng số (theo quy ước) trong Python mà không cần nhìn lại cú pháp PHP.
- [ ] Tôi hiểu và có thể sử dụng f-string `f"..."` để định dạng chuỗi một cách hiệu quả.
- [ ] Tôi có thể viết các khối lệnh `if/elif/else` với thụt đầu dòng chính xác.
- [ ] Tôi biết cách sử dụng vòng lặp `for item in iterable` và các hàm trợ giúp như `range()` và `enumerate()`.
- [ ] Tôi có thể giải thích tại sao Python không có `switch` và cách để thay thế nó bằng `if/elif` hoặc `dict`.
- [ ] Tôi phân biệt được khi nào nên dùng `List` và khi nào nên dùng `Dictionary`.
- [ ] Tôi có thể thực hiện các thao tác cơ bản trên `List` (append, pop, len) và `Dictionary` (truy cập, gán, .get(), .items()).
- [ ] Tôi hiểu cấu trúc `if __name__ == "__main__":` và mục đích của nó.

---

### **Resources & Further Reading**

-   **Official Python Tutorial:** [The Python Tutorial](https://docs.python.org/3/tutorial/) - Cực kỳ đáng tin cậy, nhưng có thể hơi khô khan.
-   **Real Python:** [Python Virtual Environments: A Primer](https://realpython.com/python-virtual-environments-a-primer/) - Giải thích sâu hơn về `venv`.
-   **Automate the Boring Stuff with Python:** [Chapter 1 – Python Basics](https://automatetheboringstuff.com/2e/chapter1/) - Một cách tiếp cận rất thực tế và dễ hiểu.
-   **Python for PHP Developers:** Một bài viết so sánh khá hay (dù hơi cũ) nhưng vẫn còn giá trị: [Python for PHP Programmers](http://www.informit.com/articles/article.aspx?p=1703433)
-   **The Zen of Python:** Gõ `import this` vào một trình thông dịch Python để đọc triết lý thiết kế của nó.

---

### **Common Pitfalls & Solutions for PHP Developers**

1.  **Pitfall: Quên dấu hai chấm (`:`)**
    *   **Vấn đề:** PHP không dùng `:`, nên bạn sẽ thường xuyên quên nó sau `if`, `for`, `def`, `class`.
    *   **Giải pháp:** Lỗi này (`SyntaxError: invalid syntax`) rất phổ biến. Hầu hết các IDE và linter sẽ ngay lập tức gạch chân nó. Hãy tập thói quen gõ `:` ngay sau khi kết thúc một câu lệnh định nghĩa khối.

2.  **Pitfall: Lỗi thụt đầu dòng (`IndentationError`)**
    *   **Vấn đề:** Trộn lẫn tab và dấu cách, hoặc thụt đầu dòng không nhất quán.
    *   **Giải pháp:** **Luôn luôn** cấu hình IDE của bạn để chuyển tab thành 4 dấu cách. Đây là tiêu chuẩn PEP 8. Không bao giờ trộn lẫn chúng. `IndentationError` là lỗi bạn sẽ gặp nhiều nhất trong tuần đầu tiên, nhưng nó cũng là lỗi dễ sửa nhất.

3.  **Pitfall: Cố gắng nối chuỗi với số**
    *   **Vấn đề:** PHP tự động chuyển kiểu (`'Age: ' . 25` hoạt động tốt). Python thì không (`'Age: ' + 25` sẽ gây `TypeError`).
    *   **Giải pháp:** Luôn sử dụng f-string: `f'Age: {25}'`. Nó sẽ tự động xử lý việc chuyển đổi. Nếu không, bạn phải chuyển kiểu thủ công: `'Age: ' + str(25)`.

4.  **Pitfall: Tìm kiếm `isset()` hoặc toán tử `??`**
    *   **Vấn đề:** Cố gắng kiểm tra sự tồn tại của key trong dictionary bằng một hàm không tồn tại. `if (my_dict['optional_key']):` sẽ gây `KeyError` nếu key không có.
    *   **Giải pháp:** Nắm vững pattern `value = my_dict.get('key', default_value)`. Nó an toàn, dễ đọc và là cách làm "Pythonic". Để kiểm tra sự tồn tại, dùng `if 'key' in my_dict:`.

5.  **Pitfall: Mảng bị thay đổi key sau khi `unset`**
    *   **Vấn đề:** Trong PHP, `unset($arr[1])` để lại một "lỗ hổng" trong các key. Trong Python, `del my_list[1]` hoặc `my_list.pop(1)` sẽ làm cho list được sắp xếp lại chỉ số ngay lập tức.
    *   **Giải pháp:** Hãy nhận thức rằng `List` của Python luôn duy trì tính tuần tự của chỉ số. Đây thường là hành vi bạn mong muốn. Nếu bạn cần một cấu trúc có "lỗ hổng", có lẽ bạn đang cần một `Dictionary` thay vì `List`.

---

### **Summary & Next Steps**

Trong bài học đầu tiên này, chúng ta đã đi từ những bước cơ bản nhất là thiết lập một môi trường phát triển Python chuyên nghiệp, منعزل bằng `venv`, đến việc nắm vững những khác biệt cốt lõi trong cú pháp so với PHP. Bạn đã học cách:

-   Quản lý project dependencies bằng `pip` và `requirements.txt`.
-   Viết code Python "sạch" hơn nhờ vào thụt đầu dòng bắt buộc.
-   Sử dụng các cấu trúc điều khiển và vòng lặp theo cách của Python.
-   Phân biệt và làm chủ hai cấu trúc dữ liệu nền tảng: `List` và `Dictionary`.

Bạn đã vượt qua rào cản lớn nhất khi chuyển đổi ngôn ngữ: sự khác biệt về cú pháp và tư duy. Bạn không còn nhìn Python qua lăng kính của PHP nữa, mà đã bắt đầu suy nghĩ theo "Pythonic way".

**Trong bài học tiếp theo (Bài 2: Functions, Modules, and Classes), chúng ta sẽ nâng cấp cuộc chơi:**

-   **Functions:** Đi sâu vào cách định nghĩa hàm, các loại tham số (`*args`, `**kwargs`), và type hinting nâng cao.
-   **Modules:** Cách bạn tổ chức code thành các file và thư mục có thể tái sử dụng, tương đương với `include`/`require` và namespaces của PHP.
-   **Classes & Objects:** Xây dựng các lớp đầu tiên của bạn trong Python, so sánh cú pháp `class` của nó với PHP, và hiểu về các phương thức đặc biệt như `__init__` (tương đương `__construct`).

Hãy sẵn sàng để xây dựng những khối code có cấu trúc và tái sử dụng được, nền tảng cho bất kỳ ứng dụng phức tạp nào.
