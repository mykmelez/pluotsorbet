/* -*- Mode: Java; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*- */
/* vim: set shiftwidth=4 tabstop=4 autoindent cindent expandtab: */

'Use strict';

Native["javax/microedition/lcdui/Graphics.getPixel.(IIZ)I"] = function(ctx, stack) {
    var isGray = stack.pop(), gray = stack.pop(), rgb = stack.pop(), _this = stack.pop();
    stack.push(rgb);
}

MIDP.HCENTER = 1;
MIDP.VCENTER = 2;
MIDP.LEFT = 4;
MIDP.RIGHT = 8;
MIDP.TOP = 16;
MIDP.BOTTOM = 32;
MIDP.BASELINE = 64;

MIDP.withClip = function(g, x, y, cb) {
    var clipX1 = g.class.getField("clipX1", "S").get(g),
        clipY1 = g.class.getField("clipY1", "S").get(g),
        clipX2 = g.class.getField("clipX2", "S").get(g),
        clipY2 = g.class.getField("clipY2", "S").get(g),
        clipped = g.class.getField("clipped", "Z").get(g),
        transX = g.class.getField("transX", "I").get(g),
        transY = g.class.getField("transY", "I").get(g);
    var ctx = MIDP.Context2D;
    if (clipped) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(clipX1, clipY1, clipX2 - clipX1, clipY2 - clipY1);
        ctx.clip();
    }
    if (transX || transY)
        ctx.translate(transX, transY);
    cb(x, y);
    if (clipped) {
        ctx.restore();
    }
}

MIDP.withAnchor = function(g, anchor, x, y, w, h, cb) {
    MIDP.withClip(g, x, y, function(x, y) {
        if (anchor & MIDP.RIGHT)
            x -= w;
        if (anchor & MIDP.HCENTER)
            x -= (w/2)|0;
        if (anchor & MIDP.BOTTOM)
            y -= h;
        if (anchor & MIDP.VCENTER)
            y -= (h/2)|0;
        cb(x, y);
    });
}

MIDP.withFont = function(font, str, cb) {
    var ctx = MIDP.Context2D;
    ctx.font = font.css;
    cb(ctx.measureText(str).width | 0);
}

MIDP.withTextAnchor = function(g, anchor, x, y, str, cb) {
    MIDP.withClip(g, x, y, function(x, y) {
        MIDP.withFont(g.class.getField("currentFont", "Ljavax/microedition/lcdui/Font;").get(g), str, function(w) {
            var ctx = MIDP.Context2D;
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            if (anchor & MIDP.RIGHT)
                x -= w;
            if (anchor & MIDP.HCENTER)
                x -= (w/2)|0;
            if (anchor & MIDP.BOTTOM)
                ctx.textBaseline = "bottom";
            if (anchor & MIDP.VCENTER)
                ctx.textBaseline = "middle";
            if (anchor & MIDP.BASELINE)
                ctx.textBaseline = "alphabetic";
            cb(x, y, w);
        });
    });
}

MIDP.withPixel = function(g, cb) {
    var pixel = g.class.getField("pixel", "I").get(g);
    var style = "#" + ("00000" + pixel.toString(16)).slice(-6);
    MIDP.Context2D.save();
    MIDP.Context2D.fillStyle = style;
    MIDP.Context2D.strokeStyle = style;
    cb();
    MIDP.Context2D.restore();
}

Native["javax/microedition/lcdui/Graphics.render.(Ljavax/microedition/lcdui/Image;III)Z"] = function(ctx, stack) {
    var anchor = stack.pop(), y = stack.pop(), x = stack.pop(), image = stack.pop(), _this = stack.pop(),
        img = image.class.getField("imageData", "Ljavax/microedition/lcdui/ImageData;").get(image),
        imgData = img.class.getField("nativeImageData", "I").get(img);
    MIDP.withAnchor(_this, anchor, x, y, imgData.width, imgData.height, function(x, y) {
        MIDP.Context2D.drawImage(imgData, x, y);
    });
    stack.push(1);
}

Native["javax/microedition/lcdui/Graphics.drawString.(Ljava/lang/String;III)V"] = function(ctx, stack) {
    var anchor = stack.pop(), y = stack.pop(), x = stack.pop(), str = util.fromJavaString(stack.pop()), _this = stack.pop();
    MIDP.withTextAnchor(_this, anchor, x, y, str, function(x, y) {
        MIDP.withPixel(_this, function() {
            MIDP.Context2D.fillText(str, x, y);
        });
    });
}

Native["javax/microedition/lcdui/Graphics.drawChars.([CIIIII)V"] = function(ctx, stack) {
    var anchor = stack.pop(), y = stack.pop(), x = stack.pop(),
        len = stack.pop(), offset = stack.pop(), data = stack.pop(), _this = stack.pop(),
        str = util.fromJavaChars(data, offset, len);
    MIDP.withTextAnchor(_this, anchor, x, y, str, function(x, y) {
        MIDP.withPixel(_this, function() {
            MIDP.Context2D.fillText(str, x, y);
        });
    });
}

Native["javax/microedition/lcdui/Graphics.drawChar.(CIII)V"] = function(ctx, stack) {
    var anchor = stack.pop(), y = stack.pop(), x = stack.pop(), chr = String.fromCharCode(stack.pop()), _this = stack.pop();
    MIDP.withTextAnchor(_this, anchor, x, y, chr, function(x, y) {
        MIDP.withPixel(_this, function() {
            MIDP.Context2D.fillText(chr, x, y);
        });
    });
}

Native["javax/microedition/lcdui/Graphics.fillRect.(IIII)V"] = function(ctx, stack) {
    var height = stack.pop(), width = stack.pop(), y = stack.pop(), x = stack.pop(), _this = stack.pop();
    MIDP.withClip(_this, x, y, function(x, y) {
        MIDP.withPixel(_this, function() {
            MIDP.Context2D.fillRect(x, y, width, height);
        });
    });
}

Native["javax/microedition/lcdui/Graphics.drawRect.(IIII)V"] = function(ctx, stack) {
    var h = stack.pop(), w = stack.pop(), y = stack.pop(), x = stack.pop(), _this = stack.pop();
    MIDP.withClip(_this, x, y, function(x, y) {
        MIDP.withPixel(_this, function() {
            MIDP.Context2D.strokeRect(x, y, Math.max(w, 1), Math.max(h, 1));
        });
    });
}

Native["javax/microedition/lcdui/Graphics.fillRoundRect.(IIIIII)V"] = function(ctx, stack) {
    var arcHeight = stack.pop(), arcWidth = stack.pop(),
        height = stack.pop(), width = stack.pop(),
        y = stack.pop(), x = stack.pop(), _this = stack.pop();
    MIDP.withClip(_this, x, y, function(x, y) {
        MIDP.withPixel(_this, function() {
            // TODO implement rounding
            MIDP.Context2D.fillRect(x, y, Math.max(width, 1), Math.max(height, 1));
        });
    });
}

Native["javax/microedition/lcdui/Graphics.drawArc.(IIIIII)V"] = function(ctx, stack) {
    var arcAngle = stack.pop(), startAngle = stack.pop(),
        height = stack.pop(), width = stack.pop(), y = stack.pop(), x = stack.pop(),
        _this = stack.pop();

    MIDP.withPixel(_this, function() {
        // TODO need to use bezierCurveTo to implement this properly,
        // but this works as a rough hack for now
        var radius = Math.ceil(Math.max(height, width) / 2);
        var startRad = startAngle * 0.0175;
        var arcRad = arcAngle * 0.0175;
        MIDP.Context2D.moveTo(x + radius, y);
        MIDP.Context2D.arc(x, y, radius, startRad, arcRad);
        MIDP.Context2D.stroke();
    })
}

MIDP.FACE_SYSTEM = 0;
MIDP.FACE_MONOSPACE = 32;
MIDP.FACE_PROPORTIONAL = 64;
MIDP.STYLE_PLAIN = 0;
MIDP.STYLE_BOLD = 1;
MIDP.STYLE_ITALIC = 2;
MIDP.STYLE_UNDERLINED = 4;
MIDP.SIZE_SMALL = 8;
MIDP.SIZE_MEDIUM = 0;
MIDP.SIZE_LARGE = 16;

Native["javax/microedition/lcdui/Font.init.(III)V"] = function(ctx, stack) {
    var size = stack.pop(), style = stack.pop(), face = stack.pop(), _this = stack.pop();
    var defaultSize = Math.max(12, (MIDP.Context2D.canvas.height / 40) | 0);
    if (size & MIDP.SIZE_SMALL)
        size = defaultSize / 1.5;
    else if (size & MIDP.SIZE_LARGE)
        size = defaultSize * 1.5;
    else
        size = defaultSize;
    size |= 0;

    if (style & MIDP.STYLE_BOLD)
        style = "bold";
    else if (style & MIDP.STYLE_ITALIC)
        style = "italic";
    else
        style = "";

    if (face & MIDP.MONOSPACE)
        face = "monospace";
    else if (face & MIDP.PROPORTIONAL)
        face = "san-serif";
    else
        face = "arial";

    _this.class.getField("baseline", "I").set(_this, (size/2)|0);
    _this.class.getField("height", "I").set(_this, (size * 1.3)|0);
    _this.css = style + " " + size + "pt " + face;
}

Native["javax/microedition/lcdui/Font.stringWidth.(Ljava/lang/String;)I"] = function(ctx, stack) {
    var str = util.fromJavaString(stack.pop()), _this = stack.pop();
    MIDP.withFont(_this, str, function(w) {
        stack.push(w);
    });
}

Native["javax/microedition/lcdui/Font.charWidth.(C)I"] = function(ctx, stack) {
    var str = String.fromCharCode(stack.pop()), _this = stack.pop();
    MIDP.withFont(_this, str, function(w) {
        stack.push(w);
    });
}

Native["javax/microedition/lcdui/Font.charsWidth.([CII)I"] = function(ctx, stack) {
    var len = stack.pop(), offset = stack.pop(), str = util.fromJavaChars(stack.pop()), _this = stack.pop();
    MIDP.withFont(_this, str.slice(offset, offset + len), function(w) {
        stack.push(w);
    });
}

Native["javax/microedition/lcdui/Font.substringWidth.(Ljava/lang/String;II)I"] = function(ctx, stack) {
    var len = stack.pop(), offset = stack.pop(), str = util.fromJavaString(stack.pop()), _this = stack.pop();
    MIDP.withFont(_this, str.slice(offset, offset + len), function(w) {
        stack.push(w);
    });
}

Native["com/sun/midp/lcdui/DisplayDevice.refresh0.(IIIIII)V"] = function(ctx, stack) {
    var y2 = stack.pop(), x2 = stack.pop(), y1 = stack.pop(), x1 = stack.pop(),
        displayId = stack.pop(), hardwareId = stack.pop(), _this = stack.pop();
}


MIDP.TRANS_NONE = 0;
MIDP.TRANS_MIRROR_ROT180 = 1;
MIDP.TRANS_MIRROR = 2;
MIDP.TRANS_MIRROR_ROT90 = 3;
MIDP.TRANS_MIRROR_ROT270 = 4;
MIDP.TRANS_MIRROR_ROT90 = 5;
MIDP.TRANS_MIRROR_ROT270 = 6;
MIDP.TRANS_MIRROR_ROT90 = 7;

Native["javax/microedition/lcdui/Graphics.renderRegion.(Ljavax/microedition/lcdui/Image;IIIIIIII)Z"] = function(ctx, stack) {
    var anchor = stack.pop(), y = stack.pop(), x = stack.pop(),
        transform = stack.pop(), sh = stack.pop(), sw = stack.pop(), sy = stack.pop(), sx = stack.pop(), image = stack.pop(), _this = stack.pop(),
        img = image.class.getField("imageData", "Ljavax/microedition/lcdui/ImageData;").get(image),
        imgData = img.class.getField("nativeImageData", "I").get(img);
    var w = sw, h = sh;
    if (transform >= 4) {
        w = sh;
        h = sw;
    }
    MIDP.withAnchor(_this, anchor, x, y, w, h, function(x, y) {
        var ctx = MIDP.Context2D;
        ctx.translate(w/2, h/2);
        if (transform === MIDP.TRANS_MIRROR || transform === MIDP.TRANS_MIRROR_ROT180)
            ctx.scale(-1, 1);
        if (transform === MIDP.TRANS_MIRROR_ROT90 || transform === MIDP.TRANS_MIRROR_ROT270)
            ctx.scale(1, -1);
        if (transform === MIDP.TRANS_ROT90 || transform === MIDP.TRANS_MIRROR_ROT90)
            ctx.rotate(Math.PI / 2);
        if (transform === MIDP.TRANS_ROT180 || transform === MIDP.TRANS_MIRROR_ROT180)
            ctx.rotate(Math.PI);
        if (transform === MIDP.TRANS_ROT270 || transform === MIDP.TRANS_MIRROR_ROT270)
            ctx.rotate(1.5 * Math.PI);
        MIDP.Context2D.drawImage(imgData, sx, sy, w, h, -w / 2, -h / 2, sw, sh);
    });
    stack.push(1);
}

Native["javax/microedition/lcdui/Graphics.drawLine.(IIII)V"] = function(ctx, stack) {
    var y2 = stack.pop(), x2 = stack.pop(), y1 = stack.pop(), x1 = stack.pop(), _this = stack.pop(),
        dx = x2 - x1, dy = y2 - y1;
    MIDP.withClip(_this, x1, y1, function(x, y) {
        var ctx = MIDP.Context2D;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
        ctx.closePath();
    });
}