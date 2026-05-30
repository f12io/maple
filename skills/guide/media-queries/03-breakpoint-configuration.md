#### 3. Breakpoint Configuration

Maple script accepts breakpoint configuration via query string.

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@f12io/maple/dist/maple.js?md=680px&4xl=1920px"></script>
  </head>

  <body>
    <!-- Now default md is overridden and a new breakpoint 4xl is added -->

    <div class="@md:bgc-red">
      <!-- Background is red when the viewport width is equal or greater than 680px -->
    </div>

    <div class="@4xl:bgc-blue">
      <!-- Background is blue when the viewport width is equal or greater than 1920px -->
    </div>
  </body>
</html>
```

