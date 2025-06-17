```shell
sudo apt install python3-pip
```

```shell
sudo apt install python3-venv
```

```shell
python3 -m venv myenv
```

```shell
source myenv/bin/activate
```

```shell
 pip install unidecode    
```

```shell
python cmd_rename.py ./in ./out
```

```shell
deactivate
```


2. JS Command
```shell
chmod +x cmd_md2html.js
npm link
```

```shell
md2html "./ReactJS & NextJS" -o ./out -c javascript
```


3. HTML to PDF

```
# Chỉ định thư mục input và output
node html-to-pdf.js -i ./my-html-files -o ./my-pdfs

# Định dạng A3, landscape
node html-to-pdf.js --format A3 --landscape

# Tùy chỉnh margin (top,right,bottom,left)
node html-to-pdf.js --margin "20,15,20,15"

# Đợi 5 giây trước khi tạo PDF (cho JS load xong)
node html-to-pdf.js --wait 5

# Scale PDF (0.1-2)
node html-to-pdf.js --scale 0.8

# Custom background color
node cmd_html2pdf.js -i ./html/TypeScript  -o ./pdf/TypeScript --margin "20,15,20,15" --bg "rgb(255, 249, 245)"     
```