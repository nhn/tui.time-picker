## v2.0.0 Migration Guide
In v2.0.0, jQuery is removed. It might cause other components to fail if they pass a jQuery object as a container.

Previously, you can use a `jQuery` to create an instance.
```javascript
// v1
var instance = new tui.TimePicker($('#timepicker-wrapper'), {
   // options
});
```

Now, you have to use `selector` or `HTMLElement` as a container.
```javascript
// v2
var instance = new tui.TimePicker('#timepicker-wrapper', {
   // options
});

// or

var container = document.getElementById('timepicker-wrapper');
var instance = new tui.TimePicker(container, {
    // options
});
```

## Load files

```html
<html>
    <head>
        ....
        <link href="tui-time-picker.css" rel="stylesheet">
    </head>
    <body>
        ....
        <script type="text/javascript" src="tui-time-picker.min.js"></script>
        ....
    </body>
</html>
```

## Write a wrapper element

```html
<div id="timepicker-wrapper"></div>
```

## Create instance

```js
var instance = new tui.TimePicker('#timepicker-wrapper', {
   // options
});
```

You can see the detail information at the [API & Examples](https://nhn.github.io/tui.time-picker/latest)
