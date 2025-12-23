1.  p=4rem, p-4 z=4 z-4 {z-index:calc(var(--spacing) \* 4)}
2.  sort default style properties from dom and set priority list for order
3.  function getColorValueFromCanvas(colorName) {
    // 1. Create an off-screen canvas element (no need to append to the body)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 2. Set the color name as the fill style
    ctx.fillStyle = colorName;

        // 3. Read the resolved color value back.
        // The browser has resolved the color name to a hex code.
        const resolvedValue = ctx.fillStyle;

        // resolvedValue will be a hex string like "#ff0000" for "red"
        // or an rgba string like "rgba(0, 0, 0, 0)" for "transparent".
        return resolvedValue;

    }
