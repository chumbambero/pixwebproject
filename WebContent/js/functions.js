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
        if (element.new_h <= 1 + element.strokesize * 2) {
            element.new_h = 1 + element.strokesize * 2;
        }
        if (element.shape) {
            ghostcontext.strokeStyle = element.strokecolor;
            ghostcontext.fillStyle = element.fillcolor;
            ghostcontext.lineWidth = element.strokesize;
            element.w = element.new_w;
            element.h = element.new_h;
            if (element.obj.type == 'rectangle') {
                ghostcontext.fillRect(element.x, element.y, element.w, element.h);
                ghostcontext.strokeRect(element.x+element.strokesize/2, element.y+element.strokesize/2, element.w-element.strokesize, element.h-element.strokesize);
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
                if(element.strokecolor!='rgba(0, 0, 0, 0)'){
                	ghostcontext.arc(element.x + r, element.y + r, r-Math.ceil(element.strokesize/2), 0, Math.PI * 2, true);
                }else{
                	ghostcontext.arc(element.x + r, element.y + r, r, 0, Math.PI * 2, true);
                }
                ghostcontext.closePath();
                ghostcontext.stroke();
                ghostcontext.fill();
            }
            if (element.obj.type == 'ellipse') {
            	if(element.strokecolor!='rgba(0, 0, 0, 0)'){
            		drawEllipse(element.x+Math.ceil(element.strokesize/2), element.y+Math.ceil(element.strokesize/2), element.x+element.w-Math.ceil(element.strokesize/2), element.y+element.h-Math.ceil(element.strokesize/2), ghostcontext);
            	} else {
            		drawEllipse(element.x, element.y, element.x+element.w, element.y+element.h, ghostcontext);
            	}
            }
            if(element.angle!=0){
            	ghostcontexto.drawImage(ghostcanvas, 0, 0);
            	element.data = ghostcontexto.getImageData(element.x, element.y, element.w, element.h);
            	clear(ghostcontexto);
            	ctx.drawImage(ghostcanvas, 0-element.x-element.w/2, 0-element.y-element.h/2);
        	} else {
        		ctx.drawImage(ghostcanvas, 0, 0);
        		element.data = ctx.getImageData(element.x, element.y, element.w, element.h);
        	}
        }
        else {
            ghostcanvas.width = element.w;
            ghostcanvas.height = element.h;
            ghostcontext.putImageData(element.data, 0, 0);
            element.w = element.new_w;
            element.h = element.new_h;
            ghostcontexto.drawImage(ghostcanvas, element.x, element.y, element.w, element.h);
            element.data = ghostcontexto.getImageData(element.x, element.y, element.w, element.h);
            if(element.angle!=0){
            	ctx.drawImage(ghostcanvaso, 0-element.x-element.w/2, 0-element.y-element.h/2);
            } else {
            	ctx.drawImage(ghostcanvaso, 0, 0);
            }
            
            ghostcanvas.width = canvaso.width;
            ghostcanvas.height = canvaso.height;
            clear(ghostcontexto);
        }
        clear(ghostcontext);
    }
    else {
    	if(element.x<0&&(!(element.y<0||(element.y+element.h)>canvaso.height))){
    		ghostcontext.save();
    		ghostcontext.translate(element.x, 0);
    		ghostcontext.putImageData(element.data, 0, element.y);
    		ghostcontext.restore();
    	} else if((!(element.x<0||(element.x+element.w)>canvaso.width))&&element.y<0) {
    		ghostcontext.save();
    		ghostcontext.translate(0, element.y);
    		ghostcontext.putImageData(element.data, element.x, 0);
    		ghostcontext.restore();
    	} else if(element.x<0&&element.y<0) {
    		ghostcontext.save();
    		ghostcontext.translate(element.x, element.y);
    		ghostcontext.putImageData(element.data, 0, 0);
    		ghostcontext.restore();
    	} else if((element.x+element.w)>canvaso.width&&(!(element.y<0||(element.y+element.h)>canvaso.height))) {
    		ghostcontext.save();
    		ghostcontext.translate(0+((element.x+element.w)-canvaso.width), 0);
    		ghostcontext.putImageData(element.data, 0, element.y);
    		ghostcontext.restore();
    	} else if((!(element.x<0||(element.x+element.w)>canvaso.width))&&(element.y+element.h)>canvaso.height) {
    		ghostcontext.save();
    		ghostcontext.translate(0, 0+((element.y+element.h)-canvaso.height));
    		ghostcontext.putImageData(element.data, element.x, 0);
    		ghostcontext.restore();
    	} else if((element.x+element.w)>canvaso.width&&(element.y+element.h)>canvaso.height) {
    		ghostcontext.save();
    		ghostcontext.translate(0+((element.x+element.w)-canvaso.width), 0+((element.y+element.h)-canvaso.height));
    		ghostcontext.putImageData(element.data, 0, 0);
    		ghostcontext.restore();
    	} else if(element.x<0&&(element.y+element.h)>canvaso.height) {
    		ghostcontext.save();
    		ghostcontext.translate(element.x, 0+((element.y+element.h)-canvaso.height));
    		ghostcontext.putImageData(element.data, 0, 0);
    		ghostcontext.restore();
    	} else if(element.y<0&&(element.x+element.w)>canvaso.width) {
    		ghostcontext.save();
    		ghostcontext.translate(0+((element.x+element.w)-canvaso.width), element.y);
    		ghostcontext.putImageData(element.data, 0, 0);
    		ghostcontext.restore();
    	} else {
    		ghostcontext.putImageData(element.data, element.x, element.y);
    	}
    	if(element.angle!=0 || (element.tmp_angle!=0 && element.angle_changing)){
    		if(element.x<0&&(!(element.y<0))){
    			ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.y-element.h/2);
    		} else if((!(element.x<0))&&element.y<0) {
    			ctx.drawImage(ghostcanvas, 0-element.x-element.w/2, 0-element.h/2);
    		} else if(element.x<0&&element.y<0) {
    			ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.h/2);
    		} else if((element.x+element.w)>canvaso.width&&(!(element.y<0||(element.y+element.h)>canvaso.height))) {
    			ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.y-element.h/2);
        	} else if((!(element.x<0||(element.x+element.w)>canvaso.width))&&(element.y+element.h)>canvaso.height) {
        		ctx.drawImage(ghostcanvas, 0-element.x-element.w/2, 0-element.h/2);
        	} else if((element.x+element.w)>canvaso.width&&(element.y+element.h)>canvaso.height) {
        		ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.h/2);
        	} else if(element.x<0&&(element.y+element.h)>canvaso.height) {
        		ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.h/2);
        	} else if(element.y<0&&(element.x+element.w)>canvaso.width) {
        		ctx.drawImage(ghostcanvas, 0-element.w/2, 0-element.h/2);
        	} else {
    			ctx.drawImage(ghostcanvas, 0-element.x-element.w/2, 0-element.y-element.h/2);
    		}
    	}else{
    		ctx.drawImage(ghostcanvas, 0, 0);
    	}
        clear(ghostcontext);
    }
}

function adjustDrawing(ctx, element){
	ghostcontexto.putImageData(element.data, element.x, element.y);	
	if(element.angle!=0){
		ctx.drawImage(ghostcanvaso, 0-element.x-element.w/2, 0-element.y-element.h/2);
	} else {
		ctx.drawImage(ghostcanvaso, 0, 0);
	}
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

function compute_selection(el, vx, vy){
	Ax = (el.x-vx)*Math.cos(-el.angle)-(el.y-vy)*Math.sin(-el.angle)+vx;
	Ay = (el.x-vx)*Math.sin(-el.angle)+(el.y-vy)*Math.cos(-el.angle)+vy;
	Bx = ((el.x+el.w)-vx)*Math.cos(-el.angle)-(el.y-vy)*Math.sin(-el.angle)+vx;
	By = ((el.x+el.w)-vx)*Math.sin(-el.angle)+(el.y-vy)*Math.cos(-el.angle)+vy;
	Cx = (el.x-vx)*Math.cos(-el.angle)-((el.y+el.h)-vy)*Math.sin(-el.angle)+vx;
	Cy = (el.x-vx)*Math.sin(-el.angle)+((el.y+el.h)-vy)*Math.cos(-el.angle)+vy;
	Dx = ((el.x+el.w)-vx)*Math.cos(-el.angle)-((el.y+el.h)-vy)*Math.sin(-el.angle)+vx;
	Dy = ((el.x+el.w)-vx)*Math.sin(-el.angle)+((el.y+el.h)-vy)*Math.cos(-el.angle)+vy;
	el.selection.x = Math.min(Ax, Bx, Cx, Dx);
	el.selection.y = Math.min(Ay, By, Cy, Dy);
	el.selection.w = Math.max(Ax, Bx, Cx, Dx) - el.selection.x;
	el.selection.h = Math.max(Ay, By, Cy, Dy) - el.selection.y;
	el.selection.x -= mySelPadding;
	el.selection.y -= mySelPadding;
	mySel.selection.w += mySelPadding*2;
	mySel.selection.h += mySelPadding*2;
}