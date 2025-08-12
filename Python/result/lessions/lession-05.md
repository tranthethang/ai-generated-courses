# Bài 5: Modules, Packages & Xử Lý File

## 📋 Thông tin Bài học

  - **Module:** Module 1: Python Foundations for PHP Veterans
  - **Thời gian:** 3 giờ
  - **Độ khó:** ⭐⭐⭐
  - **Prerequisites:** Bài 1-4 (Python cơ bản và Pythonic code)

## 🎯 Mục tiêu Bài học

### Sau khi hoàn thành bài này, học viên sẽ:

  - [ ] Hiểu rõ hệ thống `import` và cách tổ chức code thành modules, packages một cách chuyên nghiệp.
  - [ ] So sánh được cách quản lý file và package của Python với các hệ thống PHP quen thuộc như Composer và namespaces.
  - [ ] Xử lý file hiệu quả và an toàn bằng `with open()` context manager.
  - [ ] Thao tác thành thạo với các định dạng dữ liệu phổ biến như JSON, CSV.
  - [ ] Xây dựng cấu trúc dự án chuẩn, có khả năng mở rộng, tương tự như các dự án PHP sử dụng Composer.

## 🔑 Key Points (Khái niệm Quan trọng)

### 1\. Modules & Packages

**PHP Comparison:** `Modules` trong Python tương đương với các file PHP mà bạn `require` hoặc `include`. `Packages` tương tự như các Composer packages (ví dụ: `guzzlehttp/guzzle`) được tổ chức với cấu trúc thư mục và `namespaces`. Một thư mục chứa file `__init__.py` sẽ trở thành một package.
**Python Implementation:**

  - **Module:** Một file `.py` bất kỳ.
  - **Package:** Một thư mục chứa nhiều modules và một file `__init__.py`.
  - **Import:** Dùng từ khóa `import` để load module hoặc package.

**Example:**

```python
# Create a file named my_module.py
# In my_module.py
def say_hello(name):
    return f"Hello, {name}!"

# In a different file, e.g., main.py
import my_module

print(my_module.say_hello("World"))
# Output: Hello, World!
```

### 2\. Hệ thống `import` của Python

**PHP Comparison:** Trong PHP, bạn dùng `require`/`include` để nhúng các file. Nếu một file đã được `include`, bạn có thể vô tình `include` lại nó. PHP 7+ có `use App\Http\Controllers\UserController;` tương tự như `from package.module import Class`. Hệ thống `import` của Python mạnh mẽ và tự động xử lý các dependencies, tránh trùng lặp.
**Python Implementation:**

  - **`import <module>`:** Nhập toàn bộ module.
  - **`from <module> import <function/class>`:** Nhập một phần cụ thể từ module.
  - **`as` keyword:** Đặt alias cho tên module/function để code dễ đọc hơn.
  - **Absolute vs Relative imports:** `from my_package.utils import ...` (absolute) vs `from .utils import ...` (relative).
    **Example:**

<!-- end list -->

```python
# Assuming we have a package "my_project"
# my_project/
# ├── __init__.py
# └── utils/
#     ├── __init__.py
#     └── string_helpers.py
#
# In string_helpers.py
def capitalize_string(s):
    return s.capitalize()

# In another file within my_project/
from my_project.utils.string_helpers import capitalize_string

print(capitalize_string("hello"))
# Output: Hello
```

### 3\. Xử lý File với Context Managers (`with open()`)

**PHP Comparison:** Trong PHP, bạn thường dùng `fopen()`, sau đó xử lý file, và cuối cùng là `fclose()`. Nếu có lỗi xảy ra giữa chừng, bạn có thể quên `fclose()`, dẫn đến rò rỉ tài nguyên.
**Python Implementation:** Python giải quyết vấn đề này bằng `context managers` và từ khóa `with`. Khi `with open(...)` hoàn thành, nó sẽ tự động đóng file, bất kể có lỗi xảy ra hay không.
**Example:**

```python
# The Python way
with open("my_file.txt", "w") as f:
    f.write("Hello, World!")
# The file is automatically closed here, even if an error occurred inside the 'with' block.
```

### 4\. Thao tác với JSON

**PHP Comparison:** Trong PHP, bạn dùng `json_decode()` để chuyển JSON string thành PHP array (`array_decode($json_string, true)`) hoặc object, và `json_encode()` để làm ngược lại.
**Python Implementation:** Thư viện `json` built-in của Python cung cấp các hàm tương tự: `json.loads()` (Load String) và `json.dumps()` (Dump String).
**Example:**

```python
import json

data_string = '{"name": "John Doe", "age": 30}'
data_dict = json.loads(data_string)  # JSON string -> Python dictionary
print(data_dict['name']) # Output: John Doe

new_data_string = json.dumps(data_dict, indent=4) # Python dictionary -> JSON string (pretty print)
print(new_data_string)
```

## 📚 Lý thuyết Chi tiết

### Tổ chức Project với Modules và Packages

Là một PHP Senior Developer, bạn đã quen thuộc với cấu trúc project của Laravel, Symfony hay một Composer package. Mỗi file là một "class" hoặc "helper function", và `namespace` được dùng để tránh xung đột tên. Python có một hệ thống tương tự, nhưng đơn giản hơn và được tích hợp sâu hơn vào ngôn ngữ.

#### **Module**

Một module trong Python chỉ đơn giản là một file `.py`. Bất kỳ code nào bạn viết trong file đó đều có thể được `import` và sử dụng ở nơi khác.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `my_functions.php` | `my_functions.py` | Cả hai đều là file chứa code có thể tái sử dụng. |
| `require 'my_functions.php';` | `import my_functions` | Python tự động kiểm tra module đã được load chưa, tránh trùng lặp. |
| `include_once` | `from my_functions import my_function_name` | Tương tự việc chỉ load một phần cụ thể từ file. |

**Best Practices:**

  - ✅ **Đặt tên file dễ hiểu:** Ví dụ: `string_utils.py`, `database_client.py`.
  - ✅ **Mỗi module chỉ nên có một trách nhiệm duy nhất (Single Responsibility Principle):** Ví dụ, đừng đặt code xử lý database và code xử lý HTTP request trong cùng một file.
  - ❌ **Tránh `from module import *`:** Điều này có thể gây xung đột tên không mong muốn, tương tự như `use *` trong PHP.

#### **Package**

Một package là một thư mục chứa nhiều modules và một file đặc biệt tên là `__init__.py`. File này có thể trống, nhưng sự tồn tại của nó báo cho Python biết rằng đây là một package. Cấu trúc này cho phép bạn tổ chức code theo cấp bậc.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `vendor/guzzlehttp/guzzle/src/Client.php` | `guzzle/client.py` trong package | Tương tự cách Composer tổ chức các dependencies. |
| `namespace GuzzleHttp;` | `guzzle` package | Gói code lại thành một đơn vị duy nhất. |
| `use GuzzleHttp\Client;` | `from guzzle.client import Client` | Cả hai đều là cách import một class cụ thể từ một package. |

**Best Practices:**

  - ✅ **Sử dụng packages để nhóm các module có liên quan:** Ví dụ, một package `services` chứa các modules `user_service.py`, `auth_service.py`.
  - ✅ **Sử dụng `__init__.py` để định nghĩa các thuộc tính cấp cao của package:** Bạn có thể đặt `from . import user_service` bên trong `__init__.py` để khi `import services` thì `services.user_service` sẽ có sẵn.

-----

### Xử lý File một cách an toàn và hiệu quả

Là một lập trình viên có kinh nghiệm, bạn biết rằng việc quên đóng một file handle có thể gây ra lỗi nghiêm trọng. Python giải quyết vấn đề này một cách thanh lịch với `context managers` và từ khóa `with`.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `<?php $file = fopen('file.txt', 'w'); ... fclose($file); ?>` | `with open('file.txt', 'w') as f: ...` | Python `with` block tự động đóng file, an toàn hơn và ít code hơn. |
| `file_put_contents('file.txt', $data);` | `with open('file.txt', 'w') as f: f.write(data)` | `file_put_contents` là một helper function, nhưng `with` block của Python mang tính tổng quát và mạnh mẽ hơn. |

**Best Practices:**

  - ✅ **Luôn dùng `with open(...)`:** Tránh dùng `open()` và `close()` thủ công.
  - ✅ **Chỉ định `mode` rõ ràng:** `r` (read), `w` (write - ghi đè), `a` (append - ghi tiếp), `x` (exclusive creation), `r+` (read/write). Luôn chỉ định `encoding='utf-8'` khi làm việc với các file văn bản để tránh lỗi.
  - ❌ **Tránh đọc toàn bộ file lớn vào bộ nhớ cùng lúc:** Đối với các file lớn, hãy đọc từng dòng hoặc từng chunk để tiết kiệm bộ nhớ.

-----

### Thao tác với các định dạng dữ liệu phổ biến (JSON, CSV)

Thao tác với dữ liệu là một phần không thể thiếu của lập trình backend. Python có các thư viện built-in mạnh mẽ để xử lý các định dạng phổ biến này.

#### **JSON**

Python built-in `json` module cung cấp các hàm để chuyển đổi giữa JSON string và Python dictionary/list.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `json_decode($json_string, true)` | `json.loads(json_string)` | Chuyển JSON string thành Python `dict`. |
| `json_encode($data)` | `json.dumps(data)` | Chuyển Python `dict` thành JSON string. |

**Best Practices:**

  - ✅ **Dùng `json.loads()` và `json.dumps()`:** Đừng tự viết parser.
  - ✅ **Sử dụng `indent` trong `json.dumps()`:** Giúp code dễ đọc hơn khi debug hoặc ghi file.
  - ✅ **Xử lý `JSONDecodeError`:** Luôn bọc `json.loads()` trong `try...except` để xử lý các JSON string không hợp lệ.

#### **CSV**

Python built-in `csv` module giúp bạn đọc và ghi file CSV một cách có cấu trúc, tránh các vấn đề với dấu phẩy, dấu nháy kép, v.v.

**So sánh với PHP:**
| PHP | Python | Ghi chú |
|-----|--------|---------|
| `fgetcsv()` | `csv.reader()` | Đọc từng dòng của file CSV. |
| `fputcsv()` | `csv.writer()` | Ghi dữ liệu vào file CSV. |

**Best Practices:**

  - ✅ **Sử dụng `csv.DictReader` và `csv.DictWriter`:** Thao tác với dữ liệu CSV như các dictionaries, giúp code dễ đọc và dễ bảo trì hơn so với làm việc với các list chỉ mục.

## 💻 Code Examples & Demos

### Demo 1: Tổ chức Modules & Packages cơ bản

**Scenario:** Xây dựng một cấu trúc dự án đơn giản với một package `app` chứa các modules riêng biệt cho `services` và `utils`.

**Cấu trúc thư mục:**

```
my_app/
├── app/
│   ├── __init__.py
│   ├── services.py
│   └── utils.py
└── main.py
```

**`app/services.py`:**

```python
# app/services.py
from app.utils import format_user_name

class UserService:
    def get_user_data(self, user_id: int) -> dict:
        """
        Simulates fetching user data from a database.
        """
        # In a real app, this would be a DB call
        return {"id": user_id, "first_name": "John", "last_name": "Doe"}

    def get_full_name(self, user_id: int) -> str:
        """
        Retrieves user data and formats the full name.
        """
        user_data = self.get_user_data(user_id)
        return format_user_name(user_data['first_name'], user_data['last_name'])
```

**`app/utils.py`:**

```python
# app/utils.py
def format_user_name(first_name: str, last_name: str) -> str:
    """
    Formats a user's name.
    """
    return f"{first_name.capitalize()} {last_name.capitalize()}"
```

**`main.py`:**

```python
# main.py
from app.services import UserService

# Instantiate the service class
user_service = UserService()

# Use the service to get a formatted name
full_name = user_service.get_full_name(123)

print(f"The user's full name is: {full_name}")
# Output: The user's full name is: John Doe
```

**PHP Equivalent:**

```php
<?php
// app/services/UserService.php
namespace App\Services;

use App\Utils\StringHelper;

class UserService
{
    public function getUserData(int $userId): array
    {
        // Simulate DB fetch
        return ['id' => $userId, 'first_name' => 'John', 'last_name' => 'Doe'];
    }

    public function getFullName(int $userId): string
    {
        $userData = $this->getUserData($userId);
        return StringHelper::formatName($userData['first_name'], $userData['last_name']);
    }
}

// app/Utils/StringHelper.php
namespace App\Utils;

class StringHelper
{
    public static function formatName(string $firstName, string $lastName): string
    {
        return ucfirst($firstName) . ' ' . ucfirst($lastName);
    }
}

// main.php
require 'vendor/autoload.php'; // Assuming Composer autoload
use App\Services\UserService;

$userService = new UserService();
$fullName = $userService->getFullName(123);

echo "The user's full name is: " . $fullName . PHP_EOL;
?>
```

**So sánh:** Cả hai cách đều tạo ra một cấu trúc có tổ chức. Tuy nhiên, Python không cần một file autoloading như `vendor/autoload.php` của Composer. Hệ thống `import` của Python tự động xử lý điều này.

### Demo 2: Xử lý file JSON an toàn

**Scenario:** Một script đọc dữ liệu user từ file JSON, cập nhật một trường, sau đó ghi lại vào một file mới.

**`users.json`:**

```json
[
    {
        "id": 1,
        "name": "Alice",
        "email": "alice@example.com"
    },
    {
        "id": 2,
        "name": "Bob",
        "email": "bob@example.com"
    }
]
```

**Code Python:**

```python
import json

SOURCE_FILE = "users.json"
OUTPUT_FILE = "users_updated.json"

def update_user_data(file_path: str, new_email: str):
    """
    Reads user data from a JSON file, updates a specific user,
    and saves the new data to a new file.
    """
    try:
        # Use 'with' to safely open and close the file
        with open(file_path, "r", encoding="utf-8") as file:
            user_list = json.load(file)  # 'load' for file objects
            
        print(f"Successfully read {len(user_list)} users.")

        # Find the user and update their email
        for user in user_list:
            if user['id'] == 1:
                print(f"Updating email for user {user['name']}...")
                user['email'] = new_email
                break

        # Write the updated data to a new file
        with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
            json.dump(user_list, file, indent=4)  # 'dump' for file objects
        
        print(f"Data successfully saved to {OUTPUT_FILE}.")

    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file '{file_path}' contains invalid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Run the function
update_user_data(SOURCE_FILE, "alice.smith@newdomain.com")
```

**So sánh với PHP:**

```php
<?php
// PHP equivalent
$sourceFile = 'users.json';
$outputFile = 'users_updated.json';
$newEmail = 'alice.smith@newdomain.com';

if (!file_exists($sourceFile)) {
    die("Error: The file '$sourceFile' was not found.");
}

try {
    $jsonContent = file_get_contents($sourceFile);
    if ($jsonContent === false) {
        throw new \Exception("Could not read file.");
    }
    
    $userList = json_decode($jsonContent, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new \Exception("The file contains invalid JSON.");
    }

    echo "Successfully read " . count($userList) . " users." . PHP_EOL;

    foreach ($userList as &$user) {
        if ($user['id'] === 1) {
            echo "Updating email for user " . $user['name'] . "..." . PHP_EOL;
            $user['email'] = $newEmail;
            break;
        }
    }

    $updatedJson = json_encode($userList, JSON_PRETTY_PRINT);
    if ($updatedJson === false) {
        throw new \Exception("Could not encode JSON.");
    }

    if (file_put_contents($outputFile, $updatedJson) === false) {
        throw new \Exception("Could not write to file.");
    }

    echo "Data successfully saved to $outputFile." . PHP_EOL;

} catch (\Exception $e) {
    echo $e->getMessage() . PHP_EOL;
}
?>
```

**Nhận xét:** Cả hai ngôn ngữ đều có thể thực hiện tác vụ này, nhưng cú pháp `with open()` của Python làm cho việc quản lý tài nguyên file trở nên tự động và ít rủi ro hơn. Python cũng cung cấp các hàm `json.load()` và `json.dump()` để làm việc trực tiếp với file object, giúp code ngắn gọn hơn.

### Demo 3: Xử lý file CSV lớn bằng Generators (Pythonic)

**Scenario:** Đọc một file CSV rất lớn (giả định hàng triệu dòng) mà không tốn nhiều bộ nhớ, chỉ xử lý từng dòng một.

**`data.csv`:**

```csv
id,product_name,price,category
1,Laptop,1200,Electronics
2,Mouse,25,Electronics
3,Keyboard,75,Electronics
4,Chair,150,Furniture
5,Desk,300,Furniture
```

**Code Python:**

```python
import csv

def process_csv_file(file_path: str):
    """
    Processes a CSV file one row at a time using a generator pattern.
    This is memory-efficient for large files.
    """
    print("Starting to process CSV data...")
    total_products = 0
    total_price = 0.0

    try:
        # Use DictReader to treat each row as a dictionary
        with open(file_path, mode='r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            # The DictReader object is a generator,
            # so we iterate through it lazily
            for row in reader:
                total_products += 1
                try:
                    total_price += float(row['price'])
                    print(f"Processed product '{row['product_name']}'")
                except (ValueError, KeyError) as e:
                    print(f"Error processing row: {e} - Skipping.")

    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return

    print("\n--- Summary ---")
    print(f"Total products processed: {total_products}")
    print(f"Total price of all products: ${total_price:.2f}")

# Execute the function
process_csv_file('data.csv')
```

**PHP Equivalent:**

```php
<?php
// PHP equivalent
$filePath = 'data.csv';

echo "Starting to process CSV data..." . PHP_EOL;
$totalProducts = 0;
$totalPrice = 0.0;

try {
    if (($handle = fopen($filePath, "r")) !== FALSE) {
        $header = fgetcsv($handle); // Read header row
        
        while (($row = fgetcsv($handle)) !== FALSE) {
            // Map the row to an associative array for easier access
            $product = array_combine($header, $row);
            
            $totalProducts++;
            try {
                $totalPrice += (float)$product['price'];
                echo "Processed product '" . $product['product_name'] . "'" . PHP_EOL;
            } catch (\Exception $e) {
                echo "Error processing row: " . $e->getMessage() . " - Skipping." . PHP_EOL;
            }
        }
        
        fclose($handle);
        
        echo PHP_EOL . "--- Summary ---" . PHP_EOL;
        echo "Total products processed: " . $totalProducts . PHP_EOL;
        echo "Total price of all products: $" . number_format($totalPrice, 2) . PHP_EOL;
    } else {
        throw new \Exception("Could not open the file.");
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
}
?>
```

**Nhận xét:** Cả hai đều dùng một pattern lặp qua file mà không load toàn bộ vào RAM. Tuy nhiên, `csv.DictReader` của Python tự động tạo dictionary cho mỗi hàng, giúp code `for row in reader:` rất sạch và dễ đọc. Trong PHP, bạn cần thủ công kết hợp header với mỗi hàng bằng `array_combine()`.

### Demo 4: Xây dựng Configuration Manager với multiple file types

**Scenario:** Tạo một lớp quản lý cấu hình có thể đọc từ các file JSON, YAML hoặc biến môi trường, tương tự cách Laravel/Symfony quản lý cấu hình.

**Cấu trúc thư mục:**

```
config_project/
├── configs/
│   ├── app.json
│   └── database.json
└── config_manager.py
```

**`configs/app.json`:**

```json
{
  "APP_NAME": "My Python App",
  "APP_DEBUG": true,
  "APP_URL": "http://localhost:8000"
}
```

**`config_manager.py`:**

```python
import os
import json
import yaml # Requires 'pyyaml' package to be installed: pip install PyYAML
from typing import Any

class ConfigManager:
    """
    A simple configuration manager that can load settings from multiple sources.
    Similar to how Laravel's config() helper works.
    """
    def __init__(self):
        self._config = {}
        # Load from environment variables first (highest priority)
        self._load_from_env()

    def _load_from_env(self):
        """Loads configuration from environment variables."""
        # This is a good practice to allow overriding
        for key, value in os.environ.items():
            self._config[key] = value

    def load_from_file(self, file_path: str):
        """
        Loads configuration from a JSON or YAML file.
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                if file_path.endswith('.json'):
                    file_data = json.load(f)
                elif file_path.endswith('.yaml') or file_path.endswith('.yml'):
                    file_data = yaml.safe_load(f)
                else:
                    print(f"Warning: Unsupported file type for {file_path}. Skipping.")
                    return

            # File data will have a lower priority than environment variables
            for key, value in file_data.items():
                if key not in self._config:
                    self._config[key] = value

        except (FileNotFoundError, json.JSONDecodeError, yaml.YAMLError) as e:
            print(f"Error loading config from {file_path}: {e}")

    def get(self, key: str, default: Any = None) -> Any:
        """
        Retrieves a configuration value.
        Example: config.get('APP_NAME', 'Default App')
        """
        return self._config.get(key, default)

# --- Usage ---
if __name__ == "__main__":
    config = ConfigManager()
    
    # Load from a JSON file
    config.load_from_file('configs/app.json')
    
    # Simulate an environment variable override
    os.environ['APP_DEBUG'] = 'False'
    config._load_from_env() # Reload to apply env vars

    # Get values, showing precedence of env var over file
    print(f"App Name: {config.get('APP_NAME')}")
    print(f"App URL: {config.get('APP_URL')}")
    print(f"Is App Debugging Enabled: {config.get('APP_DEBUG')}")
    print(f"Non-existent key with default: {config.get('NON_EXISTENT', 'Fallback Value')}")
```

**PHP Equivalent (Conceptual):**

```php
<?php
// A conceptual PHP equivalent using a service container pattern
class Config
{
    private static array $instance = [];
    private array $data = [];

    private function __construct()
    {
        // Load from environment variables
        foreach ($_ENV as $key => $value) {
            $this->data[$key] = $value;
        }

        // Load from files (e.g., config/app.php)
        $this->loadFromFile(__DIR__ . '/config/app.php');
    }

    private function loadFromFile(string $filePath)
    {
        if (file_exists($filePath)) {
            $fileData = require $filePath;
            foreach ($fileData as $key => $value) {
                if (!isset($this->data[$key])) {
                    $this->data[$key] = $value;
                }
            }
        }
    }

    public static function getInstance(): Config
    {
        if (empty(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function get(string $key, $default = null)
    {
        return $this->data[$key] ?? $default;
    }
}

// In a file to be loaded by Composer
$config = Config::getInstance();
echo "App Name: " . $config->get('APP_NAME', 'Default App');
// ... and so on
?>
```

**Nhận xét:** Cả hai đều tuân theo nguyên tắc "Convention over Configuration" và "Precedence". Python làm điều này với các built-in modules như `json` và `os`, trong khi PHP thường dựa vào một container hoặc helper class để trừu tượng hóa các nguồn cấu hình.

## 🔨 Hands-on Exercises (3 Bài tập)

### 🥉 Bài tập 1: Data Conversion (Cơ bản - 30 phút)

**Mô tả:** Viết một script Python đơn giản để đọc một file JSON chứa danh sách người dùng, sau đó chuyển đổi danh sách này thành định dạng CSV và lưu vào một file mới.

**Yêu cầu:**

  - [ ] Đọc dữ liệu từ file `users.json` (sử dụng `json.load`).
  - [ ] Mở một file CSV mới (`users.csv`) để ghi dữ liệu (sử dụng `with open`).
  - [ ] Viết header cho file CSV: `id,full_name,email`.
  - [ ] Lặp qua danh sách người dùng và ghi từng người dùng vào file CSV.
  - [ ] Dùng `f-string` để tạo chuỗi `full_name` từ `first_name` và `last_name`.

**Starter Code:**

```python
import json
import csv

# Assume this file exists and contains a list of user dictionaries
JSON_FILE = 'users.json'
CSV_FILE = 'users.csv'

def convert_json_to_csv():
    # Write your code here
    pass

if __name__ == '__main__':
    # Create a dummy JSON file for testing
    dummy_data = [
        {"first_name": "Alice", "last_name": "Smith", "email": "alice@example.com", "id": 1},
        {"first_name": "Bob", "last_name": "Johnson", "email": "bob@example.com", "id": 2},
    ]
    with open(JSON_FILE, 'w') as f:
        json.dump(dummy_data, f, indent=4)
        
    print(f"Created dummy data in {JSON_FILE}")
    convert_json_to_csv()
    print(f"Successfully converted data to {CSV_FILE}")

```

**Expected Output:**

```
Created dummy data in users.json
Successfully converted data to users.csv
```

Và file `users.csv` sẽ có nội dung:

```csv
id,full_name,email
1,Alice Smith,alice@example.com
2,Bob Johnson,bob@example.com
```

**Hints:**

  - 💡 Bắt đầu bằng cách đọc file JSON, sau đó hãy tập trung vào việc ghi file CSV.
  - 💡 Hãy nhớ import module `csv`.
  - 💡 Đối với file CSV, bạn có thể dùng `csv.writer` để đơn giản hóa việc ghi từng dòng.
  - 💡 Chú ý đến thứ tự các trường trong CSV header.

### 🥈 Bài tập 2: File Processor Pipeline (Trung bình - 45 phút)

**Mô tả:** Xây dựng một package đơn giản để xử lý một file log. Package này sẽ bao gồm một module để đọc file log và một module để lọc các dòng log dựa trên một từ khóa.

**Yêu cầu:**

  - [ ] Tạo một package `log_processor` với cấu trúc: `log_processor/__init__.py`, `log_processor/reader.py`, `log_processor/filter.py`.
  - [ ] Trong `reader.py`, viết một hàm `read_lines(file_path)` sử dụng `yield` để trả về từng dòng của file log, tương tự như một generator.
  - [ ] Trong `filter.py`, viết một hàm `filter_by_keyword(lines, keyword)` nhận một iterable (generator từ `reader`) và một từ khóa, sau đó `yield` các dòng chứa từ khóa đó.
  - [ ] Viết một script `main.py` để sử dụng pipeline này: đọc file log, lọc các dòng có lỗi, và in ra.

**PHP Context:** Tương tự như việc bạn viết một chuỗi các hàm `(data | filterA | filterB)` để xử lý một stream dữ liệu trong PHP, bạn sẽ xây dựng một pipeline xử lý log trong Python.

**Implementation Steps:**

1.  Tạo cấu trúc thư mục `log_processor` và các file cần thiết.
2.  Viết hàm `read_lines` trong `reader.py` với `yield`.
3.  Viết hàm `filter_by_keyword` trong `filter.py` với `yield`.
4.  Viết `main.py` để import và kết nối các hàm này thành một pipeline.
5.  Tạo một file `sample.log` với vài dòng text, bao gồm cả từ khóa `ERROR`.

**Testing:**

```python
# In main.py
if __name__ == "__main__":
    from log_processor.reader import read_lines
    from log_processor.filter import filter_by_keyword
    
    # Create a dummy log file
    with open('sample.log', 'w') as f:
        f.write("INFO: User login successful\n")
        f.write("ERROR: Database connection failed\n")
        f.write("INFO: Data processed\n")
        f.write("ERROR: API rate limit exceeded\n")
        f.write("DEBUG: Variable value is 10\n")

    print("--- Reading and filtering log file ---")
    log_lines = read_lines('sample.log')
    error_logs = filter_by_keyword(log_lines, 'ERROR')
    
    for line in error_logs:
        print(line, end='')

# Expected Output:
# --- Reading and filtering log file ---
# ERROR: Database connection failed
# ERROR: API rate limit exceeded
```

### 🥇 Bài tập 3: Configuration Manager với OOP (Nâng cao - 60 phút)

**Mô tả:** Mở rộng bài tập Demo 4 để tạo ra một `Config` class hoàn chỉnh hơn, có khả năng xử lý nhiều file cấu hình và biến môi trường, tương tự như cách các framework PHP quản lý cấu hình.

**Yêu cầu:**

  - [ ] Viết một `Config` class có thể nhận một danh sách các file cấu hình khi khởi tạo.
  - [ ] `Config` class sẽ tự động load các file này theo thứ tự ưu tiên (file cuối cùng trong danh sách sẽ có ưu tiên cao hơn).
  - [ ] Biến môi trường sẽ luôn có ưu tiên cao nhất, ghi đè tất cả các file.
  - [ ] Viết một method `get(key, default=None)` để lấy giá trị cấu hình một cách an toàn.
  - [ ] Xử lý các trường hợp lỗi như file không tồn tại, JSON/YAML không hợp lệ.
  - [ ] Tạo một cấu trúc project đầy đủ, với `main.py` sử dụng `Config` class và các file cấu hình mẫu.

**Real-world Scenario:** Bạn đang xây dựng một service microservice với FastAPI. Service này cần đọc các thông số kết nối database, các khóa API, và các tham số khác từ các file cấu hình và biến môi trường. Điều quan trọng là phải có một hệ thống ưu tiên rõ ràng: Biến môi trường trong môi trường production sẽ ghi đè các giá trị mặc định trong file.

**Technical Requirements:**

  - [ ] Class `Config` với `__init__(self, config_files: list)`.
  - [ ] Private method `_load_files()` để xử lý logic đọc file.
  - [ ] Private method `_load_env()` để xử lý biến môi trường.
  - [ ] Sử dụng `try...except` để bắt `FileNotFoundError` và các lỗi parse file.

**Solution Architecture:**

  - `config_manager.py` sẽ chứa class `Config`.
  - `main.py` sẽ khởi tạo `Config` với `['configs/default.json', 'configs/production.json']`.
  - `main.py` sẽ in ra các giá trị cấu hình để chứng minh hệ thống ưu tiên hoạt động đúng.

**Bonus Challenges:**

  - 🌟 Tích hợp thêm YAML file và tự động detect loại file.
  - 🌟 Thêm tính năng "nesting" để bạn có thể gọi `config.get('database.host')` tương tự như Laravel.

## ✅ Self-Assessment Checklist

**Trước khi chuyển sang bài tiếp theo, hãy đảm bảo bạn có thể:**

  - [ ] Giải thích sự khác biệt giữa module và package trong Python.
  - [ ] So sánh hệ thống `import` của Python với `require`/`use` của PHP.
  - [ ] Viết một script Python để xử lý file an toàn bằng `with open()`.
  - [ ] Chuyển đổi qua lại giữa JSON string và Python dictionary/list.
  - [ ] Viết một package đơn giản với nhiều modules và `__init__.py`.
  - [ ] Hiểu cách sử dụng `yield` để tạo generator và xử lý file lớn một cách hiệu quả.

## 🔗 Resources & Further Reading

### Essential Resources:

  - 📖 **[Python Modules & Packages Official Documentation](https://docs.python.org/3/tutorial/modules.html)**: Tài liệu chính thức về cách sử dụng modules và packages.
  - 📖 **[Python `json` Module Documentation](https://www.google.com/search?q=%5Bhttps://docs.python.org/3/library/json.html%5D\(https://docs.python.org/3/library/json.html\))**: Hướng dẫn chi tiết về các hàm xử lý JSON.
  - 📖 **[Python `csv` Module Documentation](https://www.google.com/search?q=%5Bhttps://docs.python.org/3/library/csv.html%5D\(https://docs.python.org/3/library/csv.html\))**: Hướng dẫn về cách đọc và ghi file CSV.
  - 📝 **[Real Python's "File I/O in Python"](https://realpython.com/python-pathlib/)**: Bài viết chuyên sâu về các cách xử lý file trong Python.

### For PHP Developers:

  - 🔄 **[Python vs PHP: File Handling](https://www.google.com/search?q=https://www.geeksforgeeks.org/file-handling-in-python-vs-php/)**: Bài so sánh ngắn gọn về cách xử lý file trong hai ngôn ngữ.
  - ⚖️ **[Python vs PHP: Modules vs Composer Packages](https://www.google.com/search?q=https://www.php-vs-python.com/modules-and-packages-python-vs-composer-php/)**: Một bài viết so sánh cấu trúc project và quản lý dependencies.

### Advanced Topics:

  - 🚀 **[`pathlib` Module](https://www.google.com/search?q=%5Bhttps://docs.python.org/3/library/pathlib.html%5D\(https://docs.python.org/3/library/pathlib.html\))**: Một cách tiếp cận hiện đại hơn để làm việc với đường dẫn file.
  - 📊 **[`pyyaml` library](https://www.google.com/search?q=%5Bhttps://pypi.org/project/PyYAML/%5D\(https://pypi.org/project/PyYAML/\))**: Thư viện phổ biến để xử lý file cấu hình định dạng YAML.

## 🐛 Common Pitfalls & Solutions

### Pitfall 1: Trùng lặp `import`

**Problem:** PHP developer thường quen với việc `require` nhiều lần một file, dù không cần thiết. Trong Python, nếu bạn import cùng một module nhiều lần, nó sẽ không được load lại, nhưng có thể gây nhầm lẫn về phạm vi.
**PHP Background:** `require_once` được dùng để tránh lỗi này.
**Solution:** Python tự động xử lý điều này. Chỉ cần `import` một lần, Python sẽ cache module đó.

**Pythonic way:**

```python
# my_module.py
print("This module is loaded!")

# main.py
import my_module  # "This module is loaded!" is printed
import my_module  # Nothing is printed, as it's already in memory
```

### Pitfall 2: `import` tương đối không chính xác

**Problem:** Khi làm việc trong các package phức tạp, việc dùng `import .my_module` có thể gây lỗi nếu bạn chạy file đó trực tiếp.
**PHP Background:** Trong PHP, bạn có thể chạy bất kỳ file nào và `require` các file khác bằng đường dẫn tương đối.
**Solution:** Python `relative imports` chỉ hoạt động khi file được import như một module của package. Luôn chạy script chính từ thư mục gốc của project để đảm bảo các `import` tương đối hoạt động.

### Pitfall 3: Quên đóng file

**Problem:** Giống như trong PHP, việc quên `fclose()` có thể dẫn đến rò rỉ tài nguyên, đặc biệt là khi có exception.
**PHP Background:** Bạn phải nhớ `fclose()` hoặc dùng các helper function như `file_put_contents`.
**Solution:** Luôn sử dụng `with open(...) as f:` để đảm bảo file được đóng an toàn, bất kể điều gì xảy ra.

### Pitfall 4: Xử lý dữ liệu không an toàn

**Problem:** Khi đọc file CSV/JSON, dữ liệu có thể không đúng định dạng và gây ra `KeyError` hoặc `ValueError`.
**PHP Background:** Tương tự, `json_decode()` có thể trả về `null`, hoặc các key trong mảng không tồn tại.
**Solution:** Luôn bọc các thao tác xử lý dữ liệu trong `try...except` block để xử lý lỗi một cách chuyên nghiệp.

## 🎉 Summary & Next Steps

### Key Takeaways:

1.  **Modules & Packages:** Tổ chức code thành các file (`modules`) và thư mục có `__init__.py` (`packages`) giúp code tái sử dụng và dễ bảo trì.
2.  **Hệ thống `import`:** Sử dụng `import` và `from...import` thay thế cho `require/include`, với lợi thế tự động quản lý và tránh trùng lặp.
3.  **Xử lý File an toàn:** Dùng `with open()` là cách chuyên nghiệp và an toàn nhất để làm việc với file, tự động đóng tài nguyên.
4.  **Thư viện Built-in:** Các module như `json` và `csv` của Python rất mạnh mẽ và giúp bạn xử lý dữ liệu một cách hiệu quả mà không cần thư viện ngoài.

### How this connects to your PHP experience:

Bài học này đã giúp bạn chuyển đổi tư duy từ cấu trúc dự án dựa trên `require/include` và Composer sang hệ thống `import` và package tích hợp sẵn của Python. Bạn đã thấy rằng các vấn đề như quản lý file, xử lý JSON/CSV đều có các giải pháp tương đương (và thường là thanh lịch hơn) trong Python.

### Preparation for next lesson:

  - [ ] Ôn lại các khái niệm về `class`, `function` và `decorator`.
  - [ ] Chuẩn bị môi trường để cài đặt và sử dụng các thư viện bên ngoài.
  - [ ] Hoàn thành các bài tập trong bài này để nắm vững các kiến thức cơ bản về cấu trúc project.

### Quick Win:

💡 **Thử thách nhỏ trước bài tiếp theo:** Hãy thử viết một script Python đọc một file CSV, lọc các dòng theo một điều kiện nào đó (ví dụ: giá \> 100), sau đó ghi các dòng đã lọc vào một file CSV mới. Đây là một tác vụ cơ bản nhưng rất hiệu quả để củng cố kiến thức về xử lý file.