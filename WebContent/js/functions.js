/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

function invalidate(){
    canvasValid = false;
}

function setLineWidth(val){
    line_width = val;
}

// wipes the canvas context
function clear(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main draw loop.
// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our
// code
function mainDraw(){
    if (canvasValid == false) {
        clear(contexto);
        // Add stuff you want drawn in the background all the time here
        
        // draw all elements
        var l = elements.length;
        for (var i = 0; i < l; i++) {
            if (i == mySelIndex && eraserActive) {
                elements[i].draw(context);
            }
            else {
                elements[i].draw(contexto);
            }
        }
        // Add stuff you want drawn on top all the time here
        canvasValid = true;
    }
}


// Sets mx,my to the mouse position relative to the canvas
// unfortunately this can be tricky, we have to worry about
// padding and borders
function getMouse(ev){
    //            var elem = canvaso, offsetX = 0, offsetY = 0;
    //            if (elem.offsetParent) {
    //                do {
    //                    offsetX += elem.offsetLeft;
    //                    offsetY += elem.offsetTop;
    //                }
    //                while ((elem = elem.offsetParent));
    //            }
    //            // Add padding and border style widths to offset
    //            offsetX += stylePaddingLeft;
    //            offsetY += stylePaddingTop;
    //            offsetX += styleBorderLeft;
    //            offsetY += styleBorderTop;
    //            mx = ev.pageX - offsetX;
    //            my = ev.pageY - offsetY;
    mx = ev._x;
    my = ev._y;
}

function adjustDrawingTemp(ctx, element){
    if (element.new_w != element.w || element.new_h != element.h) {
        if (element.new_x > element.x || element.new_y > element.y) {
            if (element.new_x >= element.x + element.w - (1 + element.strokesize)) {
                element.new_x = element.x + element.w - (1 + element.strokesize);
            }
            if (element.new_y >= element.y + element.h - (1 + element.strokesize)) {
                element.new_y = element.y + element.h - (1 + element.strokesize);
            }
        }
        element.x = element.new_x;
        element.y = element.new_y;
        if (element.new_w <= 1 + element.strokesize * 2) {
            element.new_w = 1 + element.strokesize * 2;
        }
        if (element.new_h < 1 + element.strokesize * 2) {
            element.new_h = 1 + element.strokesize * 2;
        }
        if (element.shape) {
            ghostcontext.strokeStyle = element.strokecolor;
            ghostcontext.fillStyle = element.fillcolor;
            ghostcontext.lineWidth = element.strokesize;
            if (element.new_w != element.w) {
                element.w = element.new_w;
            }
            if (element.new_h != element.h) {
                element.h = element.new_h;
            }
            if (element.obj.type == 'rectangle') {
                ghostcontext.fillRect(element.x, element.y, element.w, element.h);
                ghostcontext.strokeRect(element.x, element.y, element.w, element.h);
            }
            if (element.obj.type == 'line') {
                ghostcontext.beginPath();
                if (element.obj.sy == element.obj.ey) {
                    element.obj.sx = element.x;
                    element.obj.ex = element.x + element.w;
                    element.obj.sy = element.obj.ey = element.y + element.h;
                }
                else 
                    if (element.obj.sx == element.obj.ex) {
                        element.obj.sy = element.y;
                        element.obj.ey = element.y + element.h;
                        element.obj.sx = element.obj.ex = element.x + element.w;
                    }
                    else 
                        if (element.obj.sx < element.obj.ex && element.obj.sy < element.obj.ey) {
                            element.obj.sx = element.x;
                            element.obj.sy = element.y;
                            element.obj.ex = element.x + element.w;
                            element.obj.ey = element.y + element.h;
                        }
                        else {
                            element.obj.sx = element.x;
                            element.obj.sy = element.y + element.h;
                            element.obj.ex = element.x + element.w;
                            element.obj.ey = element.y;
                        }
                ghostcontext.moveTo(element.obj.sx, element.obj.sy);
                ghostcontext.lineTo(element.obj.ex, element.obj.ey);
                ghostcontext.stroke();
                ghostcontext.fill();
                ghostcontext.closePath();
            }
            if (element.obj.type == 'circle') {
                var r = Math.min(element.w, element.h) / 2;
                ghostcontext.beginPath();
                ghostcontext.arc(element.x + r, element.y + r, r, 0, Math.PI * 2, true);
                ghostcontext.closePath();
                ghostcontext.stroke();
                ghostcontext.fill();
            }
            if (element.obj.type == 'ellipse') {
            	drawEllipse(element.x, element.y, element.x+element.w, element.y+element.h, ghostcontext);
            }
            ctx.drawImage(ghostcanvas, 0, 0);
            element.data = ctx.getImageData(element.x, element.y, element.w, element.h);
        }
        else {
            ghostcanvas.width = element.w;
            ghostcanvas.height = element.h;
            ghostcontext.putImageData(element.data, 0, 0);
            if (element.new_w != element.w) {
                element.w = element.new_w;
            }
            if (element.new_h != element.h) {
                element.h = element.new_h;
            }
            //ctx.drawImage(ghostcanvas, element.x, element.y, element.w, element.h);
            ghostcontexto.drawImage(ghostcanvas, element.x, element.y, element.w, element.h);
            element.data = ghostcontexto.getImageData(element.x, element.y, element.w, element.h);
            ctx.drawImage(ghostcanvaso, 0, 0);
            
            ghostcanvas.width = canvaso.width;
            ghostcanvas.height = canvaso.height;
            clear(ghostcontexto);
        }
        //element.data = ctx.getImageData(element.x, element.y, element.w, element.h);
        clear(ghostcontext);
    }
    else {
        ghostcontext.putImageData(element.data, element.x, element.y);
        ctx.drawImage(ghostcanvas, 0, 0);
        clear(ghostcontext);
    }
}

function adjustDrawing(ctx, element){
    ghostcontexto.putImageData(element.data, element.x, element.y);
    ctx.drawImage(ghostcanvaso, 0, 0);
    clear(ghostcontexto);
}

// This function draws the #imageTemp canvas on top of
// #imageView, after which
// #imageTemp is cleared. This function is called each time when
// the user
// completes a drawing operation.
function img_update(){
    contexto.drawImage(canvas, 0, 0);
    clear(context);
}