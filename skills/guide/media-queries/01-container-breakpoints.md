#### 1. Container Breakpoints

Use predefined breakpoints directly.

- `xs` for `min-width: 480px`
- `sm` for `min-width: 640px`
- `md` for `min-width: 768px`
- `lg` for `min-width: 1024px`
- `xl` for `min-width: 1280px`
- `2xl` for `min-width: 1536px`

```html
<div class="md:bgc-red">
  <!-- Background is red when in a container which width is equal or greater than 768px -->
</div>

<div class="lg:bgc-blue">
  <!-- Background is blue when in a container which width is equal or greater than 1024px -->
</div>

<div class="md(sidebar):bgc-green">
  <!-- Background is green when in a container which width is equal or greater than 768px and its name is sidebar -->
</div>
```

> [!IMPORTANT]
> Container queries won't work out of the box because a container query looks for the nearest ancestor that has a defined containment context.
>
> You must convert a parent element into a container by setting the `container-type` property. In Maple, you can do this easily with the `cnt` (container) utility. However, you should not add this class to the `<body>` or `<html>` elements. Instead, you should wrap your application in an element having `cnt` class.

```html
<body>
  <div class="cnt">
    <!-- Application supporting container queries -->
  </div>
</body>
```

In the application, you can define as many containers as you want, even with different names. The children's container queries will work according to the nearest matching container with that name.

```html
<body>
  <div class="cnt">
    <div class="cnt=sidebar">
      <div class="md(sidebar):bgc-green">
        <!-- Background is green when sidebar's width is equal or greater than 768px -->
      </div>
    </div>
  </div>
</body>
```

