#!/usr/bin/env python3

import os
import sys
import re
import shutil
from unidecode import unidecode

def normalize_filename(text):
    # Loại bỏ dấu và chuyển sang chữ Latin
    text = unidecode(text)
    # Chuyển về thường
    text = text.lower()
    # Thay khoảng trắng và ký tự không phải a-z, 0-9 thành gạch ngang
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Xoá các gạch ngang dư thừa ở đầu và cuối
    text = text.strip('-')
    return text

def rename_files(input_folder, output_folder):
    if not os.path.isdir(input_folder):
        print(f"❌ Thư mục không tồn tại: {input_folder}")
        sys.exit(1)

    os.makedirs(output_folder, exist_ok=True)

    for filename in os.listdir(input_folder):
        if not filename.endswith('.md'):
            continue

        input_path = os.path.join(input_folder, filename)

        with open(input_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()

        if not first_line:
            print(f"⚠️ File rỗng hoặc không có dòng đầu: {filename}")
            continue

        new_name = normalize_filename(first_line) + '.md'
        output_path = os.path.join(output_folder, new_name)

        shutil.copy2(input_path, output_path)
        print(f"✅ {filename} → {new_name}")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python rename_md_files.py <input_folder> <output_folder>")
        sys.exit(1)

    input_folder = sys.argv[1]
    output_folder = sys.argv[2]
    rename_files(input_folder, output_folder)
