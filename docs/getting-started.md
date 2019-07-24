### 1. Load dependency files
* Script - [tui-code-snippet](https://github.com/nhn/tui.code-snippet) 1.5.0 or later
* Script - [tui-dom](https://github.com/nhn/tui.dom) 3.0.0 or later
    > If your project should support IE8, please use `tui-dom.js`, not `tui-dom.min.js`.

```html
<html>
    <head>
        ....
        <link href="tui-time-picker.css" rel="stylesheet">
    </head>
    <body>
        ....
        <script type="text/javascript" src="tui-code-snippet.min.js"></script>
        <script type="text/javascript" src="tui-dom.min.js"></script>
        <script type="text/javascript" src="tui-time-picker.min.js"></script>
        ....
    </body>
</html>
```

### 2. Write a wrapper element

```html
<div id="timepicker-wrapper"></div>
```

### 3. Create instance

```js
var instance = new tui.TimePicker('#timepicker-wrapper', {
   // options
});
```

You can see the detail information at the [API & Examples](https://nhn.github.io/tui.time-picker/latest)
