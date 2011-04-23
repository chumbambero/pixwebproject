var line_width = 1;
var hasStroke = true;
var hasFill = false;
var brush_type = 'circleBrush';

function setLineWidth(val){
    line_width = val;
}
//
//function hasStroke(){
//    hasStroke = true;
//}
//
//function hasFill(){
//    hasFill = true;
//}


//Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
    window.addEventListener("load", function(){
        // layout
        dojo.require("dijit.layout.BorderContainer");
        // color palette
        dojo.require("dijit.ColorPalette");
        // menu
        dojo.require("dijit.MenuBar");
        dojo.require("dijit.MenuBarItem");
        dojo.require("dijit.PopupMenuBarItem");
        dojo.require("dijit.Menu");
        dojo.require("dijit.MenuItem");
        dojo.require("dijit.PopupMenuItem");
        // dialog
        dojo.require("dijit.form.Button");
        dojo.require("dijit.Dialog");
        dojo.require("dijit.form.TextBox");
        dojo.require("dijit.form.ValidationTextBox");
        // combobox
        dojo.require("dijit.form.ComboBox");
        dojo.require("dojo.data.ItemFileReadStore");
        // google search engine
        dojo.require("dojox.data.GoogleSearchStore");
        // layout
        dojo.require("dijit.layout.ContentPane");
        // external files
        dojo.require("dojo.cache");
        
        dojo.require("dijit.Toolbar");
        
        dojo.require("dojo.parser");
        dojo.require("dijit.form.NumberSpinner");
        
        
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // LAYOUT START
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var bc, cp1, cp2, cp3, cp4, pMenuBar, pSubMenu, pSubMenuItem1, pSubMenuItem2, pSubMenuItem3, pSubMenu2, myPalette, strokeColorSelected, fillColorSelected, f1, f2, f3, f4;
        
        strokeColorSelected = true;
        fillColorSelected = false;
        
        dojo.addOnLoad(function(){
            // create a BorderContainer as the top widget in the hierarchy
            bc = new dijit.layout.BorderContainer({
                style: "height: 100%; width: 100%;"
            });
            
            // //////////////////////////////////////////////////////////////////////////////////////////////
            // MENU BAR START
            // //////////////////////////////////////////////////////////////////////////////////////////////
            pMenuBar = new dijit.MenuBar({});
            // -----------------------------------
            // File Menu
            // -----------------------------------
            pSubMenu = new dijit.Menu({});
            // New Image
            pSubMenuItem1 = new dijit.MenuItem({
                label: "New Image"
            });
            pSubMenu.addChild(pSubMenuItem1);
            // Load Image
            pSubMenuItem2 = new dijit.MenuItem({
                label: "Load Image"
            });
            pSubMenu.addChild(pSubMenuItem2);
            // Save Image
            pSubMenuItem3 = new dijit.MenuItem({
                label: "Save Image",
                onClick: function(ev){
                    window.open(canvaso.toDataURL("image/png"));
                    ev.preventDefault();
                }
            });
            pSubMenu.addChild(pSubMenuItem3);
            pMenuBar.addChild(new dijit.PopupMenuBarItem({
                label: "File",
                popup: pSubMenu
            }));
            // -----------------------------------
            // Edit Menu
            // -----------------------------------
            pSubMenu2 = new dijit.Menu({});
            // Clear Canvas
            pSubMenu2.addChild(new dijit.MenuItem({
                label: "Clear Canvas",
                onClick: function(){
					clear(context);
					clear(contexto);
					clear(ghostcontext);
					clear(ghostcontexto);
                }
            }));
            pMenuBar.addChild(new dijit.PopupMenuBarItem({
                label: "Edit",
                popup: pSubMenu2
            }));
            pMenuBar.startup();
            // //////////////////////////////////////////////////////////////////////////////////////////////
            // MENU BAR END
            // //////////////////////////////////////////////////////////////////////////////////////////////
            
            // create a ContentPane as the top pane in the
            // BorderContainer
            cp1 = new dijit.layout.ContentPane({
                region: "top",
                content: pMenuBar,
                style: "padding: 0"
            });
            bc.addChild(cp1);
            
            // create a ContentPane as the top pane in the
            // BorderContainer
            cp2 = new dijit.layout.ContentPane({
                region: "leading",
                content: dojo["cache"](new dojo._Url("menu.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp2);
            
            // create a ContentPane as the center pane in the
            // BorderContainer
            cp3 = new dijit.layout.ContentPane({
                region: "center",
                content: dojo["cache"](new dojo._Url("canvas.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp3);
            
            // create a ContentPane as the center pane in the
            // BorderContainer
            cp4 = new dijit.layout.ContentPane({
                region: "top",
                style: "display: none; padding: 0px",
                content: dojo["cache"](new dojo._Url("toolbar.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp4);
            
            // put the top level widget into the document, and then call
            // startup()
            document.body.appendChild(bc.domNode);
            bc.startup();
            
            // create the new image dialog form and then append the dialog
            // to the body
            f1 = new dijit.Dialog({
                title: "New Image",
                id: "newDialog",
                content: dojo["cache"](new dojo._Url("new_img_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f1.domNode);
            // create the load image dialog form and then append the dialog
            // to the body
            f2 = new dijit.Dialog({
                title: "Load Image",
                id: "loadDialog",
                content: dojo["cache"](new dojo._Url("load_img_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f2.domNode);
            // create the load image from an URL dialog form and then append
            // the dialog to the body
            f3 = new dijit.Dialog({
                title: "Load Image From URL",
                id: "urlDialog",
                content: dojo["cache"](new dojo._Url("load_img_url_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f3.domNode);
            // create the load image from the google search engine dialog
            // form and then append the dialog to the body
            f4 = new dijit.Dialog({
                title: "Load Image From Google Image Seach",
                id: "googleDialog",
                content: dojo["cache"](new dojo._Url("load_img_google_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f4.domNode);
            
            init();
        });
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // LAYOUT END
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        var canvas, context, canvaso, contexto, ghostcanvas, ghostcontext, ghostcanvaso, ghostcontexto;
        var ghostImage = new Image();
        
        // The active tool instance.
        var name_default = 'undefined';
        var tool;
        var tool_default = 'pencil';
        var color_stroke = '#000';
        var color_fill = '#fff';
        var colorStroke, colorFill;
        
        // holds all our elements
        var elements = [];
        
        // New, holds the 8 tiny boxes that will be our selection handles
        // the selection handles will be in this order:
        // 0 1 2
        // 3 4
        // 5 6 7
        var selectionHandles = [];
        
        // Box object to hold data
        function Box(){
            this.x = 0;
            this.y = 0;
            this.w = 1; // default width and height?
            this.h = 1;
            this.fill = '#fff';
        }
        
        // Element object to hold data for all drawn elements
        function Element(){
            this.data = null;
            this.x = null;
            this.y = null;
            this.w = null;
            this.h = null;
            this.new_x = null;
            this.new_y = null;
            this.new_w = null;
            this.new_h = null;
            this.shape = null;
            this.strokesize = null;
            this.strokecolor = null;
            this.fillcolor = null;
            this.obj = null;
        }
        
        // New methods on the Element class
        Element.prototype = {
            // we used to have a solo draw function
            // but now each element is responsible for its own drawing
            // mainDraw() will call this with the normal canvas
            // mousedown will call this with the temp canvas with 'black'
            draw: function(ctx, optionalColor){
                if (ctx === context) {
                    ctx.fillStyle = 'black'; // always want black for the
                    // temp canvas
                }
                
                // We can skip the drawing of elements that have moved off the
                // screen:
                if (this.x > canvas.width || this.y > canvas.height) 
                    return;
                if (this.x + this.w < 0 || this.y + this.h < 0) 
                    return;
                
                if (mySel === this) {
                    adjustDrawingTemp(ctx, this);
                }
                else {
                    adjustDrawing(ctx, this);
                }
                
                // draw selection
                // this is a stroke along the box and also 8 new selection
                // handles
                if (mySel === this) {
                    ctx.strokeStyle = mySelColor;
                    ctx.lineWidth = mySelWidth;
                    ctx.strokeRect(this.x - mySelPadding, this.y - mySelPadding, this.w + mySelPadding * 2, this.h + mySelPadding * 2);
                    // draw the boxes
                    var half = mySelBoxSize / 2;
                    // 0 1 2
                    // 3   4
                    // 5 6 7
                    // top left, middle, right
                    selectionHandles[0].x = this.x - mySelPadding - half;
                    selectionHandles[0].y = this.y - mySelPadding - half;
                    selectionHandles[1].x = this.x + this.w / 2 - half;
                    selectionHandles[1].y = this.y - mySelPadding - half;
                    selectionHandles[2].x = this.x + mySelPadding + this.w - half;
                    selectionHandles[2].y = this.y - mySelPadding - half;
                    // middle left
                    selectionHandles[3].x = this.x - mySelPadding - half;
                    selectionHandles[3].y = this.y + this.h / 2 - half;
                    // middle right
                    selectionHandles[4].x = this.x + mySelPadding + this.w - half;
                    selectionHandles[4].y = this.y + this.h / 2 - half;
                    // bottom left, middle, right
                    selectionHandles[5].x = this.x - mySelPadding - half;
                    selectionHandles[5].y = this.y + mySelPadding + this.h - half;
                    selectionHandles[6].x = this.x + this.w / 2 - half;
                    selectionHandles[6].y = this.y + mySelPadding + this.h - half;
                    selectionHandles[7].x = this.x + mySelPadding + this.w - half;
                    selectionHandles[7].y = this.y + mySelPadding + this.h - half;
                    
                    ctx.fillStyle = mySelBoxColor;
                    for (var i = 0; i < 8; i++) {
                        var cur = selectionHandles[i];
                        ctx.fillRect(cur.x, cur.y, mySelBoxSize, mySelBoxSize);
                    }
                }
            } // end draw
        };
        
        // add en element to elements
        function addElement(mousedownx, mousedowny, mouseupx, mouseupy, strokesize, strokecolor, fillcolor, shape, obj){
            var el = new Element;
            el.strokesize = strokesize;
            el.strokecolor = strokecolor;
            el.fillcolor = fillcolor;
            el.shape = shape;
            el.obj = obj;
            if (mousedownx <= mouseupx && mousedowny <= mouseupy) {
                el.x = el.new_x = mousedownx - Math.ceil(el.strokesize / 2);
                el.y = el.new_y = mousedowny - Math.ceil(el.strokesize / 2);
                el.w = el.new_w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2) * 2;
                el.h = el.new_h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2) * 2;
            }
            else 
                if (mousedownx > mouseupx && mousedowny <= mouseupy) {
                    el.x = el.new_x = mouseupx - Math.ceil(el.strokesize / 2);
                    el.y = el.new_y = mousedowny - Math.ceil(el.strokesize / 2);
                    el.w = el.new_w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2) * 2;
                    el.h = el.new_h = mouseupy - mousedowny + Math.ceil(el.strokesize / 2) * 2;
                }
                else 
                    if (mousedownx <= mouseupx && mousedowny > mouseupy) {
                        el.x = el.new_x = mousedownx - Math.ceil(el.strokesize / 2);
                        el.y = el.new_y = mouseupy - Math.ceil(el.strokesize / 2);
                        el.w = el.new_w = mouseupx - mousedownx + Math.ceil(el.strokesize / 2) * 2;
                        el.h = el.new_h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2) * 2;
                    }
                    else {
                        el.x = el.new_x = mouseupx - Math.ceil(el.strokesize / 2);
                        el.y = el.new_y = mouseupy - Math.ceil(el.strokesize / 2);
                        el.w = el.new_w = mousedownx - mouseupx + Math.ceil(el.strokesize / 2) * 2;
                        el.h = el.new_h = mousedowny - mouseupy + Math.ceil(el.strokesize / 2) * 2;
                    }
            // try {
            // try {
            // var imgd = context.getImageData(el.x, el.y, el.w, el.h);
            // }
            // catch (e) {
            // netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            // var imgd = context.getImageData(el.x, el.y, el.w, el.h);
            // }
            // } catch (e) {
            // throw new Error("unable to access image data: " + e)
            // }
            el.data = context.getImageData(el.x, el.y, el.w, el.h);
            elements.push(el);
            invalidate();
        }
        
        // Rectangle object to hold data
        function Rectangle(){
            this.type = "rectangle";
        }
        
        // Line object to hold data
        function Line(sx, sy, ex, ey){
            this.sx = sx;
            this.sy = sy;
            this.ex = ex;
            this.ey = ey;
            this.type = "line";
        }
        
        // Circle object to hold data
        function Circle(){
            this.type = "circle";
        }
        
        // how often, in milliseconds, we check to see if a redraw
        // is needed
        var INTERVAL = 20;
        
        // mouse coordinates
        var mx, my;
        
        // when set to true, the canvas will redraw everything
        // invalidate() just sets this to false right now
        // we want to call invalidate() whenever we make a
        // change
        var canvasValid = true;
        
        // The node (if any) being selected.
        // If in the future we want to select multiple objects, this
        // will get turned into an array
        var mySel;
        
        // The selection color and width. Right now we have a black
        // selection with a small width
        var mySelColor = '#999';
        var mySelWidth = 1;
        var mySelBoxColor = 'darkred'; // New for selection boxes
        var mySelBoxSize = 6;
        var mySelPadding = 3;
        
        // since we can drag from anywhere in a node
        // instead of just its x/y corner, we need to save
        // the offset of the mouse when we start dragging.
        var offsetx, offsety;
        
        // Padding and border style widths for mouse offsets
        var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
        
        function invalidate(){
            canvasValid = false;
        }
        
        function init(){
            // Find the canvas element.
            canvaso = document.getElementById('imageView');
            if (!canvaso) {
                alert('Error: I cannot find the canvas element!');
                return;
            }
            
            if (!canvaso.getContext) {
                alert('Error: no canvas.getContext!');
                return;
            }
            
            // Get the 2D canvas context.
            contexto = canvaso.getContext('2d');
            if (!contexto) {
                alert('Error: failed to getContext!');
                return;
            }
            
            // fixes mouse co-ordinate problems when there's a border or
            // padding
            // see getMouse for more detail
            if (document.defaultView && document.defaultView.getComputedStyle) {
                stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvaso, null)['paddingLeft'], 10) || 0;
                stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvaso, null)['paddingTop'], 10) || 0;
                styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvaso, null)['borderLeftWidth'], 10) || 0;
                styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvaso, null)['borderTopWidth'], 10) || 0;
            }
            
            document.getElementById("imageName").appendChild(document.createElement("h3"));
            var imageName = document.createTextNode(name_default);
            document.getElementById("imageName").lastChild.appendChild(imageName);
            
            var container = canvaso.parentNode;
            
            // Add the ghost canvas.
            ghostcanvaso = document.createElement('canvas');
            if (!ghostcanvaso) {
                alert('Error: I cannot create a new canvas element!');
                return;
            }
            
            ghostcanvaso.id = 'ghosto';
            ghostcanvaso.width = canvaso.width;
            ghostcanvaso.height = canvaso.height;
            container.appendChild(ghostcanvaso);
            
            ghostcontexto = ghostcanvaso.getContext('2d');
            
            // Add the ghost canvas.
            ghostcanvas = document.createElement('canvas');
            if (!ghostcanvas) {
                alert('Error: I cannot create a new canvas element!');
                return;
            }
            
            ghostcanvas.id = 'ghost';
            ghostcanvas.width = canvaso.width;
            ghostcanvas.height = canvaso.height;
            container.appendChild(ghostcanvas);
            
            ghostcontext = ghostcanvas.getContext('2d');
            
            // Add the temporary canvas.
            canvas = document.createElement('canvas');
            if (!canvas) {
                alert('Error: I cannot create a new canvas element!');
                return;
            }
            
            canvas.id = 'imageTemp';
            canvas.width = canvaso.width;
            canvas.height = canvaso.height;
            container.appendChild(canvas);
            
            context = canvas.getContext('2d');
            
            // Get color select input
            colorStroke = document.getElementById('selectedStrokeColor');
            colorStroke.addEventListener('click', ev_colorStroke_click, false);
            colorFill = document.getElementById('selectedFillColor');
            colorFill.addEventListener('click', ev_colorFill_click, false);
            
            // Activate the default tool.
            if (tools[tool_default]) {
                tool = new tools[tool_default]();
            }
            
            // Attach the mousedown, mousemove and mouseup event
            // listeners.
            canvas.addEventListener('mousedown', ev_canvas, false);
            canvas.addEventListener('mousemove', ev_canvas, false);
            canvas.addEventListener('mouseup', ev_canvas, false);
            
            // set up the selection handle boxes
            for (var i = 0; i < 8; i++) {
                var rect = new Box;
                selectionHandles.push(rect);
            }
        }
        
        // wipes the canvas context
        function clear(ctx){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // The general-purpose event handler. This function just
        // determines the mouse
        // position relative to the canvas element.
        function ev_canvas(ev){
            if (ev.layerX || ev.layerX == 0) { // Firefox
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            }
            else 
                if (ev.offsetX || ev.offsetX == 0) { // Opera
                    ev._x = ev.offsetX;
                    ev._y = ev.offsetY;
                }
            
            // Call the event handler of the tool.
            var func = tool[ev.type];
            if (func) {
                func(ev);
            }
        }
        
        // The event handler for any changes made to the color stroke
        // selector.
        function ev_colorStroke_click(ev){
            if (fillColorSelected) {
                colorFill.removeAttribute("class");
                colorStroke.setAttribute("class", "selected");
                fillColorSelected = false;
                strokeColorSelected = true;
            }
        }
        
        // The event handler for any changes made to the color fill
        // selector.
        function ev_colorFill_click(ev){
            if (strokeColorSelected) {
                colorStroke.removeAttribute("class");
                colorFill.setAttribute("class", "selected");
                strokeColorSelected = false;
                fillColorSelected = true;
            }
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
                    elements[i].draw(contexto);
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
                        ghostcontext.closePath();
                    }
                    if (element.obj.type == 'circle') {
                        //            			element.w = element.h = Math.min(element.w, element.h);
                        var r = Math.min(element.w, element.h) / 2;
                        ghostcontext.beginPath();
                        ghostcontext.arc(element.x + r, element.y + r, r, 0, Math.PI * 2, true);
                        ghostcontext.closePath();
                        ghostcontext.stroke();
                    }
                    ctx.drawImage(ghostcanvas, 0, 0);
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
                    ctx.drawImage(ghostcanvas, element.x, element.y, element.w, element.h);
                    
                    ghostcanvas.width = canvaso.width;
                    ghostcanvas.height = canvaso.height;
                }
                element.data = ctx.getImageData(element.x, element.y, element.w, element.h);
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
        
        // ///////////////////////////////////
        // New Dialog
        // ///////////////////////////////////
        dojo.addOnLoad(function(){
            dojo.connect(pSubMenuItem1, "onClick", f1, "show");
            imgSub = dijit.byId("newSubmit");
            dojo.connect(imgSub, "onClick", function(){
                checkData();
            });
        });
        
        // This function check if the data in the new image dialog have
        // a correct format
        function checkData(){
            var data = f1.attr('value');
            if (!validateNumeric(data.width)) {
                alert(data.width +
                " for width input is not a valid number");
                return false;
            }
            else 
                if (!validateNumeric(data.height)) {
                    alert(data.height +
                    " for height input is not a valid number");
                    return false;
                }
                else {
                    canvas.width = data.width;
                    canvas.height = data.height;
					ghostcanvas.width = data.width;
                    ghostcanvas.height = data.height;
					ghostcanvaso.width = data.width;
                    ghostcanvaso.height = data.height;
                    canvaso.width = data.width;
                    canvaso.height = data.height;
                    document.getElementById("imageName").lastChild.removeChild(document.getElementById("imageName").lastChild.lastChild);
                    imageName = document.createTextNode(data.name);
                    document.getElementById("imageName").lastChild.appendChild(imageName);
                    return true;
                }
        }
        
        function validateNumeric(strValue){
            /*******************************************************************
             * DESCRIPTION: Validates that a string contains only valid numbers.
             *
             * PARAMETERS: strValue - String to be tested for validity
             *
             * RETURNS: True if valid, otherwise false.
             ******************************************************************/
            var objRegExp = /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
            // check for numeric characters
            return objRegExp.test(strValue);
        }
        
        // ///////////////////////////////////
        // Load Dialog
        // ///////////////////////////////////
        dojo.addOnLoad(function(){
            // loadDlg = dijit.byId("loadDialog");
            dojo.connect(pSubMenuItem2, "onClick", f2, "show");
            dojo.addOnLoad(function(){
            
                var loadSource = new dojo.data.ItemFileReadStore({
                    url: "ComboBoxItems/load.json"
                });
                
                var loadComboBox = dijit.byId("loadComboBox");
                loadComboBox.setAttribute("name", "loadSource");
                loadComboBox.setAttribute("value", "URL");
                loadComboBox.setAttribute("store", loadSource);
                loadComboBox.setAttribute("searchAttr", "name");
            });
            loadSub = dijit.byId("loadSubmit");
            dojo.connect(loadSub, "onClick", function(){
                loadNext();
            });
        });
        
        // This function open the url dialog after click on the next
        // button of the Load Dialog
        function loadNext(){
            var loadComboBoxValue = dijit.byId('loadComboBox').attr('value');
            if (loadComboBoxValue == 'URL') {
                // ///////////////////////////////////
                // Url Dialog
                // ///////////////////////////////////
                // urlDlg = dijit.byId("urlDialog");
                f3.show();
                dojo.addOnLoad(function(){
                    var urlSource = new dojo.data.ItemFileReadStore({
                        url: "ComboBoxItems/url.json"
                    });
                    var urlComboBox = dijit.byId("urlComboBox");
                    urlComboBox.setAttribute("name", "urlSource");
                    urlComboBox.setAttribute("value", "Automatically Resizing Image");
                    urlComboBox.setAttribute("store", urlSource);
                    urlComboBox.setAttribute("searchAttr", "name");
                });
                urlSub = dijit.byId("urlSubmit");
                dojo.connect(urlSub, "onClick", function(){
                    urlOk("urlComboBox", f3);
                });
            }
            else 
                if (loadComboBoxValue == 'Google Image Search') {
                    // ///////////////////////////////////
                    // Google Dialog
                    // ///////////////////////////////////
                    // googleDlg = dijit.byId("googleDialog");
                    f4.show();
                    dojo.addOnLoad(function(){
                        var googleSource = new dojo.data.ItemFileReadStore({
                            url: "ComboBoxItems/url.json"
                        });
                        var googleComboBox = dijit.byId("googleComboBox");
                        googleComboBox.setAttribute("name", "googleSource");
                        googleComboBox.setAttribute("value", "Automatically Resizing Image");
                        googleComboBox.setAttribute("store", googleSource);
                        googleComboBox.setAttribute("searchAttr", "name");
                    });
                    googleSearch = dijit.byId("googleSearchButton");
                    dojo.connect(googleSearch, "onClick", function(){
                        doSearch();
                    });
                    googleSub = dijit.byId("googleSubmit");
                    dojo.connect(googleSub, "onClick", function(){
                        urlOk("googleComboBox", f4);
                    });
                }
                else {
                    alert("Sorry but the selected type of loading is not implemented");
                }
        }
        
        function doSearch(){
            var store = new dojox.data.GoogleImageSearchStore();
            var query = {
                text: dojo.byId("googleSearchInput").value
            };
            var callbackFunction = function(items){
                var table = dojo.byId("googleResultTable");
                var tableBody = table.tBodies[0];
                dojo.empty(tableBody);
                // Show the table
                dojo.style(table, "display", "");
                dojo.forEach(items, function(item, index){
                    if (validateImageUrl(store.getValue(item, 'unescapedUrl'))) {
                        var row = dojo.create("tr", {}, tableBody);
                        var sizeCell = dojo.create("td", {
                            innerHTML: store.getValue(item, "width") + "x" + store.getValue(item, "height") + " px",
                        }, row);
                        var imgCell = dojo.create("td", {}, row);
                        var link = dojo.create("button", {
                            target: "_blank",
                        }, imgCell);
                        dojo.create("img", {
                            src: store.getValue(item, "tbUrl")
                        }, link);
                        link.setAttribute("onClick", "dojo.byId('googleTextBox').value = '" + store.getValue(item, 'unescapedUrl') + "'");
                    }
                })
            };
            var onErrorFunction = function(){
                alert("An error occurred getting Google Search data");
            }
            store.fetch({
                query: query,
                count: 30,
                start: 0,
                onComplete: callbackFunction,
                onError: onErrorFunction
            });
        }
        
        // This function check if the data in an url input have a
        // correct format
        function urlOk(cbox, dlg){
            var urlTypeValue = dijit.byId(cbox).attr('value');
            if (cbox == "urlComboBox") 
                urlTextValue = dlg.attr('value').urlTextBox;
            if (cbox == "googleComboBox") 
                urlTextValue = dlg.attr('value').googleTextBox;
            if (validateImageUrl(urlTextValue)) {
                var img = new Image();
                img.src = urlTextValue;
                // when image loaded
                img.onload = function(){
                    var w = img.width;
                    var h = img.height;
                    if (w > canvaso.width || h > canvaso.height) {
                        if (urlTypeValue == "Automatically Resizing Canvas") {
                            // make destination have same dimensions as
                            // image
                            if (w > canvaso.width) {
                                canvaso.width = w;
                                canvas.width = w;
                            }
                            if (h > canvaso.height) {
                                canvaso.height = h;
                                canvas.height = h;
                            }
                        }
                        else {
                            if (w > canvaso.width) {
                                img.width = canvaso.width;
                                img.height = Math.round(h * canvaso.width / w);
                                w = img.width;
                                h = img.height;
                            }
                            if (h > canvaso.height) {
                                img.height = canvaso.height;
                                img.width = Math.round(w * canvaso.height / h);
                                w = img.width;
                                h = img.height;
                            }
                        }
                    }
                    // transfer image to context
                    context.drawImage(img, 6, 6, w, h);
                    // addElement(6, 6, w, h);
                    img_update();
                }
            }
        }
        
        function validateImageUrl(strValue){
            /*******************************************************************
             * DESCRIPTION: Validates that a string contains only valid URL for
             * an image.
             *
             * PARAMETERS: strValue - String to be tested for validity
             *
             * RETURNS: True if valid, otherwise false.
             ******************************************************************/
            var objRegExp = new RegExp("^https?://(?:[a-z\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$");
            // check for numeric characters
            return objRegExp.test(strValue);
        }
        
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // COLOR PALETTE START
        // //////////////////////////////////////////////////////////////////////////////////////////////
        dojo.addOnLoad(function(){
            myPalette = new dijit.ColorPalette({
                palette: "7x10",
                onChange: function(val){
                    if (strokeColorSelected) {
                        color_stroke = val;
                        context.strokeStyle = val;
                        document.getElementById("selectedStrokeColor").setAttribute("style", "background:" + val);
                    }
                    else {
                        color_fill = val;
                        context.fillStyle = val;
                        document.getElementById("selectedFillColor").setAttribute("style", "background:" + val);
                    }
                }
            }, "placeHolder");
            bc.resize();
        });
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // COLOR PALETTE END
        // //////////////////////////////////////////////////////////////////////////////////////////////
        
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // TOOLS MENU START
        // //////////////////////////////////////////////////////////////////////////////////////////////
        var pointerButton, pencilButton, lineButton, rectangleButton, circleButton;
        var selected_tool = tool_default;
        dojo.addOnLoad(function(){
            var toolsTable = dojo.create("table", {
                id: "toolsTable"
            }, "tools");
            pointerButton = new dijit.form.Button({
                iconClass: "icons iconPointer",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("pointer");
                    cp4.attr('style', 'display: block');
                    dojo.byId('sizeLabel').setAttribute("style", "display:none");
                    dojo.byId('widget_sizeSpinner').setAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:inline");
                    dojo.byId('delete').setAttribute("style", "display:inline");
                    bc.resize();
                }
            });
            pencilButton = new dijit.form.Button({
                iconClass: "icons iconPencil",
                showLabel: false,
                disabled: true,
                onClick: function(){
                    ev_tool_change("pencil");
                    cp4.attr('style', 'display: none');
                    bc.resize();
                }
            });
            brushButton = new dijit.form.Button({
                iconClass: "icons iconBrush",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("brush");
                    cp4.attr('style', 'display: block');
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Brush Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').removeAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    dojo.byId('delete').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            lineButton = new dijit.form.Button({
                iconClass: "icons iconLine",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("line");
                    cp4.attr('style', 'display: block');
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Line Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    dojo.byId('delete').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            rectangleButton = new dijit.form.Button({
                iconClass: "icons iconRectangle",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("rect");
                    cp4.attr('style', 'display: block');
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Stroke Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    dojo.byId('delete').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            circleButton = new dijit.form.Button({
                iconClass: "icons iconCircle",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("circle");
                    cp4.attr('style', 'display: block');
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Stroke Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('sizeSpinner').setAttribute("aria-valuemax", Math.min(canvas.height, canvas.width) / 2 - 10);
                    dojo.byId('sizeSpinner').setAttribute("aria-valuenow", 1);
                    dojo.byId('fillDrop').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    dojo.byId('delete').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            var items = [pointerButton, pencilButton, brushButton, lineButton, rectangleButton, circleButton];
            var counter = 0;
            var row = 0;
            dojo.forEach(items, function(data){
                if (counter < 4) {
                    if (counter == 0) {
                        dojo.create("tr", null, toolsTable);
                    }
                    dojo.create("td", null, toolsTable.childNodes[row]).appendChild(data.domNode);
                    counter++;
                    if (counter == 4) {
                        counter = 0;
                        row++;
                    }
                }
            });
        });
        function ev_tool_change(value){
            if (tools[value]) {
                tool = new tools[value]();
                if (selected_tool == 'pointer') {
                    pointerButton.attr('disabled', false);
                }
                else 
                    if (selected_tool == 'pencil') {
                        pencilButton.attr('disabled', false);
                    }
                    else 
                        if (selected_tool == 'brush') {
                            brushButton.attr('disabled', false);
                        }
                        else 
                            if (selected_tool == 'line') {
                                lineButton.attr('disabled', false);
                            }
                            else 
                                if (selected_tool == 'rect') {
                                    rectangleButton.attr('disabled', false);
                                }
                                else 
                                    if (selected_tool == 'circle') {
                                        circleButton.attr('disabled', false);
                                    }
                if (value == 'pointer') {
                    pointerButton.attr('disabled', true);
                }
                else 
                    if (value == 'pencil') {
                        pencilButton.attr('disabled', true);
                    }
                    else 
                        if (value == 'brush') {
                            brushButton.attr('disabled', true);
                        }
                        else 
                            if (value == 'line') {
                                lineButton.attr('disabled', true);
                            }
                            else 
                                if (value == 'rect') {
                                    rectangleButton.attr('disabled', true);
                                }
                                else 
                                    if (value == 'circle') {
                                        circleButton.attr('disabled', true);
                                    }
                selected_tool = value;
            }
        }
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // TOOLS MENU END
        // //////////////////////////////////////////////////////////////////////////////////////////////
        
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // TOOLS START
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // This object holds the implementation of each drawing tool.
        var tools = {};
        
        // the pointer
        tools.pointer = function(){
            var tool = this;
            this.started = false;
            this.isDrag = false;
            this.isResizeDrag = false;
            var offsetx, offsety;
            // will save the # of the selection handle if the mouse is over one.
            this.expectResize = -1;
            // Happens when the mouse is clicked in the canvas
            this.mousedown = function(ev){
                getMouse(ev);
                // we are over a selection box
                if (tool.expectResize !== -1) {
                    tool.isResizeDrag = true;
                    return;
                }
                if (mySel != null) {
                    console.log(mx + ">" + mySel.x + " " + (mx > mySel.x) + ", " + my + ">" + mySel.y + " " + (my > mySel.y) + ", " + mx + "<" + (mySel.x + mySel.w) + " " + (mx < (mySel.x + mySel.w)) + ", " + my + "<" + (mySel.y + mySel.h) + " " + (my < (mySel.x + mySel.w)));
                    // we are over a selection
                    if (mx > mySel.x && my > mySel.y && mx < (mySel.x + mySel.w) && my < (mySel.y + mySel.h)) {
                        tool.offsetx = mx - mySel.x;
                        tool.offsety = my - mySel.y;
                        mySel.x = mx - tool.offsetx;
                        mySel.y = my - tool.offsety;
                        tool.isDrag = true;
                        return;
                    }
                }
                clear(context);
				clear(ghostcontext);
				clear(ghostcontexto);
                var l = elements.length;
                for (var i = l - 1; i >= 0; i--) {
                    // draw element onto temp context
                    elements[i].draw(context, 'black');
                    // get image data at the mouse x,y pixel
                    // var imageData = context.getImageData(mx, my, 1, 1);
                    var imageData = context.getImageData(ev._x, ev._y, 1, 1);
                    // if the mouse pixel exists, select and break
                    if (imageData.data[3] > 0) {
                        mySel = elements[i];
                        tool.offsetx = mx - mySel.x;
                        console.log("mx: " + mx);
                        console.log("mySel.x: " + mySel.x);
                        console.log("offsetx: " + tool.offsetx);
                        tool.offsety = my - mySel.y;
                        console.log("my: " + my);
                        console.log("mySel.y: " + mySel.y);
                        console.log("offsety: " + tool.offsety);
                        mySel.x = mx - tool.offsetx;
                        console.log("mySel.x: " + mySel.x);
                        mySel.y = my - tool.offsety;
                        console.log("mySel.y: " + mySel.y);
                        tool.started = true;
                        tool.isDrag = true;
                        // make mainDraw() fire every INTERVAL milliseconds.
                        setInterval(mainDraw, INTERVAL);
                        invalidate();
                        clear(context);
						clear(ghostcontext);
						clear(ghostcontexto);
                        return;
                    }
                }
                // haven't returned means we have selected nothing
                mySel = null;
                // clear the ghost canvas for next time
                clear(context);
				clear(ghostcontext);
				clear(ghostcontexto);
                // invalidate because we might need the selection border to
                // disappear
                invalidate();
                clearInterval(mainDraw);
                tool.started = false;
                canvas.style.cursor = 'crosshair';
                context.strokeStyle = color_stroke;
                context.fillStyle = color_fill;
            };
            // Happens when the mouse is moving inside the canvas
            this.mousemove = function(ev){
                if (tool.started) {
                    if (tool.isDrag) {
                        getMouse(ev);
                        mySel.x = mySel.new_x = mx - tool.offsetx;
                        mySel.y = mySel.new_y = my - tool.offsety;
                        // something is changing position so we better
                        // invalidate the canvas!
                        invalidate();
                    }
                    else 
                        if (tool.isResizeDrag) {
                            // time to resize!
                            var oldx = mySel.x;
                            var oldy = mySel.y;
                            // 0 1 2
                            // 3   4
                            // 5 6 7
                            switch (tool.expectResize) {
                                case 0:
                                    mySel.new_x = mx;
                                    mySel.new_y = my;
                                    mySel.new_w += oldx - mx;
                                    mySel.new_h += oldy - my;
                                    break;
                                case 1:
                                    mySel.new_y = my;
                                    mySel.new_h += oldy - my;
                                    break;
                                case 2:
                                    mySel.new_y = my;
                                    mySel.new_w = mx - oldx;
                                    mySel.new_h += oldy - my;
                                    break;
                                case 3:
                                    mySel.new_x = mx;
                                    mySel.new_w += oldx - mx;
                                    break;
                                case 4:
                                    mySel.new_w = mx - oldx;
                                    break;
                                case 5:
                                    mySel.new_x = mx;
                                    mySel.new_w += oldx - mx;
                                    mySel.new_h = my - oldy;
                                    break;
                                case 6:
                                    mySel.new_h = my - oldy;
                                    break;
                                case 7:
                                    mySel.new_w = mx - oldx;
                                    mySel.new_h = my - oldy;
                                    break;
                            }
                            invalidate();
                        }
                    getMouse(ev);
                    // if there's a selection see if we grabbed one of the
                    // selection handles
                    if (mySel !== null && !tool.isResizeDrag) {
                        for (var i = 0; i < 8; i++) {
                            // 0 1 2
                            // 3 4
                            // 5 6 7
                            var cur = selectionHandles[i];
                            // we don't need to use the temp context because
                            // selection handles will always be rectangles
                            if (mx >= cur.x && mx <= cur.x + mySelBoxSize &&
                            my >= cur.y &&
                            my <= cur.y + mySelBoxSize) {
                                // we found one!
                                tool.expectResize = i;
                                invalidate();
                                switch (i) {
                                    case 0:
                                        canvas.style.cursor = 'nw-resize';
                                        break;
                                    case 1:
                                        canvas.style.cursor = 'n-resize';
                                        break;
                                    case 2:
                                        canvas.style.cursor = 'ne-resize';
                                        break;
                                    case 3:
                                        canvas.style.cursor = 'w-resize';
                                        break;
                                    case 4:
                                        canvas.style.cursor = 'e-resize';
                                        break;
                                    case 5:
                                        canvas.style.cursor = 'sw-resize';
                                        break;
                                    case 6:
                                        canvas.style.cursor = 's-resize';
                                        break;
                                    case 7:
                                        canvas.style.cursor = 'se-resize';
                                        break;
                                }
                                return;
                            }
                        }
                        if (mx > mySel.x && my > mySel.y && mx < (mySel.x + mySel.w) && my < (mySel.y + mySel.h)) {
                            canvas.style.cursor = 'move';
                        }
                        else {
                            canvas.style.cursor = 'crosshair';
                        }
                        
                        // not over a selection box, return to normal
                        tool.isResizeDrag = false;
                        tool.expectResize = -1;
                    }
                }
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                tool.isDrag = false;
                tool.isResizeDrag = false;
                tool.expectResize = -1;
            };
        };
        
        // The drawing pencil.
        tools.pencil = function(){
            var tool = this;
            this.started = false;
            this.smallerx, this.smallery, this.biggerx, this.biggery;
            context.lineWidth = 1;
			context.strokeStyle = color_stroke;
            // This is called when you start holding down the mouse
            // button.
            // This starts the pencil drawing.
            this.mousedown = function(ev){
                tool.smallerx = tool.biggerx = ev._x;
                tool.smallery = tool.biggery = ev._y;
                context.beginPath();
                context.moveTo(ev._x, ev._y);
                tool.started = true;
            };
            // This function is called every time you move the mouse.
            // Obviously, it only
            // draws if the tool.started state is set to true (when you
            // are holding down
            // the mouse button).
            this.mousemove = function(ev){
                if (tool.started) {
                    context.lineTo(ev._x, ev._y);
                    context.stroke();
                    if (ev._x < tool.smallerx) {
                        tool.smallerx = ev._x;
                    }
                    if (ev._x > tool.biggerx) {
                        tool.biggerx = ev._x;
                    }
                    if (ev._y < tool.smallery) {
                        tool.smallery = ev._y;
                    }
                    if (ev._y > tool.biggery) {
                        tool.biggery = ev._y;
                    }
                }
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    if (ev._x < tool.smallerx) {
                        tool.smallerx = ev._x;
                    }
                    if (ev._x > tool.biggerx) {
                        tool.biggerx = ev._x;
                    }
                    if (ev._y < tool.smallery) {
                        tool.smallery = ev._y;
                    }
                    if (ev._y > tool.biggery) {
                        tool.biggery = ev._y;
                    }
                    addElement(tool.smallerx, tool.smallery, tool.biggerx, tool.biggery, 1, color_stroke, false, null, null);
                    img_update();
                }
            };
        };
        
        // The drawing brush.
        tools.brush = function(){
            var tool = this;
            this.started = false;
            this.smallerx, this.smallery, this.biggerx, this.biggery, this.oldmx, this.oldmy;
            // This is called when you start holding down the mouse
            // button.
            // This starts the brush drawing.
            this.mousedown = function(ev){
                tool.started = true;
                context.lineWidth = line_width;
				context.strokeStyle = color_stroke;
                context.fillStyle = color_stroke;
                getMouse(ev);
                tool.smallerx = mx - Math.ceil(line_width / 2);
				tool.biggerx = mx + Math.ceil(line_width / 2);
				
                tool.smallery = my - Math.ceil(line_width / 2);
				tool.biggery = my + Math.ceil(line_width / 2);
                tool.oldmx = mx;
                tool.oldmy = my;
                mx = tool.smallerx;
                my = tool.smallery;
                if (brush_type == 'circleBrush') {
                    drawCircleBrush(tool.oldmx, tool.oldmy, Math.ceil(line_width / 2));
                }
                else 
                    if (brush_type == 'squareBrush') {
                        drawSquareBrush()
                    }
            };
            // This function is called every time you move the mouse.
            // Obviously, it only
            // draws if the tool.started state is set to true (when you
            // are holding down
            // the mouse button).
            this.mousemove = function(ev){
                if (tool.started) {
                    getMouse(ev);
                    tool.oldmx = mx;
                    tool.oldmy = my;
                    mx = mx - Math.ceil(line_width / 2);
                    my = my - Math.ceil(line_width / 2);
                    if (brush_type == 'circleBrush') {
                        drawCircleBrush(tool.oldmx, tool.oldmy, Math.ceil(line_width / 2));
                    }
                    else 
                        if (brush_type == 'squareBrush') {
                            drawSquareBrush()
                        }
                    if (mx < tool.smallerx) {
                        tool.smallerx = mx;
                    }
                    if (mx+line_width > tool.biggerx) {
                        tool.biggerx = mx+line_width;
                    }
                    if (my < tool.smallery) {
                        tool.smallery = my;
                    }
                    if (my+line_width > tool.biggery) {
                        tool.biggery = my+line_width;
                    }
                }
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                if (tool.started) {
                    //tool.mousemove(ev);
                    getMouse(ev);
                    tool.started = false;
                    if (mx < tool.smallerx) {
                        tool.smallerx = mx;
                    }
                    if (mx+line_width > tool.biggerx) {
                        tool.biggerx = mx+line_width;
                    }
                    if (my < tool.smallery) {
                        tool.smallery = my;
                    }
                    if (my+line_width > tool.biggery) {
                        tool.biggery = my+line_width;
                    }
                    addElement(tool.smallerx, tool.smallery, tool.biggerx, tool.biggery, line_width, color_stroke, false, null, null);
                    img_update();
                }
            };
        };
        
		//Auxiliary functions for the circle brush tool 
        function drawCircleBrush(cx, cy, r){
            context.beginPath();
            context.arc(cx, cy, r, 0, Math.PI * 2, true);
            context.closePath();
            context.stroke();
            context.fill();
        }
        
		//Auxiliary functions for the square brush tool 
        function drawSquareBrush(){
            context.strokeRect(mx, my, line_width, line_width);
            context.fillRect(mx, my, line_width, line_width);
        }
        
        // The rectangle tool.
        tools.rect = function(){
            var tool = this;
            this.started = false;
            var mousedownx, mousedowny, mouseupx, mouseupy, x, y, w, h, stroke, fill;
            // This is called when you start holding down the mouse
            // button.
            this.mousedown = function(ev){
                tool.started = true;
                tool.stroke;
                tool.fill;
                context.lineWidth = line_width;
                if (hasStroke) {
                    tool.stroke = color_stroke;
                }
                else {
                    tool.stroke = 'rgba(0, 0, 0, 0)';
                }
                if (hasFill) {
                    tool.fill = color_fill;
                }
                else {
                    tool.fill = 'rgba(0, 0, 0, 0)';
                }
                context.strokeStyle = tool.stroke;
                context.fillStyle = tool.fill;
                tool.mousedownx = ev._x;
                tool.mousedowny = ev._y;
            };
            // This function is called every time you move the mouse.
            this.mousemove = function(ev){
                if (!tool.started) {
                    return;
                }
                tool.x = Math.min(ev._x, tool.mousedownx), tool.y = Math.min(ev._y, tool.mousedowny), tool.w = Math.abs(ev._x - tool.mousedownx), tool.h = Math.abs(ev._y - tool.mousedowny);
                
                clear(context);
                if (!tool.w || !tool.h) {
                    return;
                }
                context.fillRect(tool.x, tool.y, tool.w, tool.h);
                context.strokeRect(tool.x, tool.y, tool.w, tool.h);
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    context.strokeStyle = color_stroke;
                    context.fillStyle = color_fill;
                    tool.mouseupx = ev._x;
                    tool.mouseupy = ev._y;
                    addElement(tool.x, tool.y, tool.x + tool.w, tool.y + tool.h, line_width, tool.stroke, tool.fill, true, new Rectangle());
                    img_update();
                }
            };
        };
        // The line tool.
        tools.line = function(){
            var tool = this;
            this.started = false;
            var mousedownx, mousedowny, mouseupx, mouseupy;
            // This is called when you start holding down the mouse
            // button.
            this.mousedown = function(ev){
                tool.started = true;
                context.lineWidth = line_width;
                tool.mousedownx = ev._x;
                tool.mousedowny = ev._y;
            };
            // This function is called every time you move the mouse.
            this.mousemove = function(ev){
                if (!tool.started) {
                    return;
                }
                clear(context);
                context.beginPath();
                context.moveTo(tool.mousedownx, tool.mousedowny);
                context.lineTo(ev._x, ev._y);
                context.stroke();
                context.closePath();
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    tool.mouseupx = ev._x;
                    tool.mouseupy = ev._y;
                    addElement(tool.mousedownx, tool.mousedowny, tool.mouseupx, tool.mouseupy, line_width, color_stroke, "rgba(0, 0, 0, 0)", true, new Line(tool.mousedownx, tool.mousedowny, tool.mouseupx, tool.mouseupy));
                    img_update();
                }
            };
        };
        // The circle tool.
        tools.circle = function(){
            var tool = this;
            this.started = false;
            var mousedownx, mousedowny, x, y, r, stroke, fill;
            // This is called when you start holding down the mouse
            // button.
            this.mousedown = function(ev){
                tool.started = true;
				tool.stroke;
                tool.fill;
                context.lineWidth = line_width;
                if (hasStroke) {
                    tool.stroke = color_stroke;
                }
                else {
                    tool.stroke = 'rgba(0, 0, 0, 0)';
                }
                if (hasFill) {
                    tool.fill = color_fill;
                }
                else {
                    tool.fill = 'rgba(0, 0, 0, 0)';
                }
                context.strokeStyle = tool.stroke;
                context.fillStyle = tool.fill;
                tool.mousedownx = ev._x;
                tool.mousedowny = ev._y;
            };
            // This function is called every time you move the mouse.
            this.mousemove = function(ev){
                if (!tool.started) {
                    return;
                }
                var w = Math.abs(ev._x - tool.mousedownx), h = Math.abs(ev._y - tool.mousedowny);
                tool.x = Math.min(ev._x, tool.mousedownx), tool.y = Math.min(ev._y, tool.mousedowny), tool.r = Math.min(w, h) / 2;
                
                clear(context);
                if (!w || !h) {
                    return;
                }
                context.beginPath();
                context.arc(tool.x + tool.r, tool.y + tool.r, tool.r, 0, Math.PI * 2, true);
                context.closePath();
                context.stroke();
				context.fill();
            };
            // This is called when you release the mouse button.
            this.mouseup = function(ev){
                if (tool.started) {
                    tool.mousemove(ev);
                    tool.started = false;
                    addElement(tool.x, tool.y, tool.x + tool.r * 2, tool.y + tool.r * 2, line_width, color_stroke, color_fill, true, new Circle());
                    img_update();
                }
            };
        };
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // TOOLS END
        // //////////////////////////////////////////////////////////////////////////////////////////////
    
    }, false);
}
