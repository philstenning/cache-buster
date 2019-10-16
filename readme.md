# Cache Buster

Copies files from the ./src/ folder and processes them by appending a querystring to the url's of **'link'** and **'img'** elements and in css files the urls of the **'background-image()'** property. when finished it puts the files in the ./dist/ folder

---

## Install

Install all the dependencies needed

```javascript
yarn install
```

---

## default

run the default process
appends all css and html files with a ?v=1.2.1

```shell
> gulp
```

---

## queryStringCss

Appends a querystring to all **css** files img and link elements within the document.

```shell

> gulp queryStringCss
```

input

```css
.main-image-jpg {
    background-image: url('IMG_20190810_073015.jpg');
}
```

output

```css
.main-image-jpg {
    background-image: url('IMG_20190810_073015.jpg?v=1.0.1');
}
```

---

## queryStringHtml

```shell
> gulp queryStringHtml
```

input

```html
<img src="./images/IMG_20190303_212013.jpg?
```

output

```html
<img src="./images/IMG_20190303_212013.jpg?v%3D1.0.1=d718b187" alt="" />
```

---

## clean

Cleans the output folder ./dist of all content

```shell
> gulp clean
```
