/*
 * Copyright (C) 2010, 2011 Alessandro Trombini
 *
 * This file is part of PixWeb.
 */

/**
 * @author Alessandro Trombini
 */

function IncludeJavaScript(jsFile){
    document.write('<script type="text/javascript" src="' +
    jsFile +
    '"></scr' +
    'ipt>');
}

//include the others javascripts
IncludeJavaScript("js/variables.js");
IncludeJavaScript("js/events.js");
IncludeJavaScript("js/functions.js");
IncludeJavaScript("js/dojo_requires.js");
IncludeJavaScript("js/objects/box.js");
IncludeJavaScript("js/objects/element.js");
IncludeJavaScript("js/objects/rectangle.js");
IncludeJavaScript("js/objects/line.js");
IncludeJavaScript("js/objects/circle.js");
IncludeJavaScript("js/objects/ellipse.js");
IncludeJavaScript("js/objects/selection.js");
IncludeJavaScript("js/tools/pointer.js");
IncludeJavaScript("js/tools/pencil.js");
IncludeJavaScript("js/tools/brush.js");
IncludeJavaScript("js/tools/line.js");
IncludeJavaScript("js/tools/rectangle.js");
IncludeJavaScript("js/tools/circle.js");
IncludeJavaScript("js/tools/ellipse.js");

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



//Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
    window.addEventListener("load", function(){
    
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // LAYOUT START
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
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
            pSubMenu2Item1 = new dijit.MenuItem({
                label: "Clear Canvas",
                onClick: function(){
                    clear(context);
                    clear(contexto);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    elements.remove(0, elements.length);
                }
            });
            pSubMenu2.addChild(pSubMenu2Item1);
            // Resize Canvas
            pSubMenu2Item2 = new dijit.MenuItem({
                label: "Resize Canvas"
            });
            pSubMenu2.addChild(pSubMenu2Item2);
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
                content: dojo["cache"](new dojo._Url("view/standard/menu.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp2);
            
            // create a ContentPane as the center pane in the
            // BorderContainer
            cp3 = new dijit.layout.ContentPane({
                region: "center",
                content: dojo["cache"](new dojo._Url("view/standard/canvas.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp3);
            
            // create a ContentPane as the center pane in the
            // BorderContainer
            cp4 = new dijit.layout.ContentPane({
                region: "top",
                style: "padding: 0px",
                content: dojo["cache"](new dojo._Url("view/standard/toolbar.html"), {
                    sanitize: true
                })
            });
            bc.addChild(cp4);
            
            cp5 = new dijit.layout.ContentPane({
                region: "trailing",
            });
            bc.addChild(cp5);
            
            // put the top level widget into the document, and then call
            // startup()
            document.body.appendChild(bc.domNode);
            bc.startup();
            
            dojo.byId('sizeLabel').setAttribute("style", "display:none");
            dojo.byId('widget_sizeSpinner').setAttribute("style", "display:none");
            dojo.byId('fillDrop').setAttribute("style", "display:none");
            dojo.byId('brushDrop').setAttribute("style", "display:none");
            dojo.byId('ereaser').setAttribute("style", "display:none");
            
            // create the new image dialog form and then append the dialog
            // to the body
            f1 = new dijit.Dialog({
                title: "New Image",
                id: "newDialog",
                content: dojo["cache"](new dojo._Url("view/standard/form/new_img_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f1.domNode);
            // create the load image dialog form and then append the dialog
            // to the body
            f2 = new dijit.Dialog({
                title: "Load Image",
                id: "loadDialog",
                content: dojo["cache"](new dojo._Url("view/standard/form/load_img_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f2.domNode);
            // create the load image from an URL dialog form and then append
            // the dialog to the body
            f3 = new dijit.Dialog({
                title: "Load Image From URL",
                id: "urlDialog",
                content: dojo["cache"](new dojo._Url("view/standard/form/load_img_url_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f3.domNode);
            // create the load image from the google search engine dialog
            // form and then append the dialog to the body
            f4 = new dijit.Dialog({
                title: "Load Image From Google Image Seach",
                id: "googleDialog",
                content: dojo["cache"](new dojo._Url("view/standard/form/load_img_google_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f4.domNode);
            // create the resize canvas dialog form and then append the dialog
            // to the body
            f5 = new dijit.Dialog({
                title: "Resize Canvas",
                id: "resizeCanvasDialog",
                content: dojo["cache"](new dojo._Url("view/standard/form/resize_canvas_form.html"), {
                    sanitize: true
                })
            });
            document.body.appendChild(f5.domNode);
            
            init();
        });
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // LAYOUT END
        // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // ///////////////////////////////////
        // New Dialog
        // ///////////////////////////////////
        dojo.addOnLoad(function(){
            dojo.connect(pSubMenuItem1, "onClick", function(){
                dojo.byId('resizeCanvasWidth').removeAttribute('value');
                dojo.byId('resizeCanvasHeight').removeAttribute('value');
                f1.show();
            });
            imgSub = dijit.byId("newSubmit");
            dojo.connect(imgSub, "onClick", function(){
                checkData('new');
            });
        });
        
        // ///////////////////////////////////
        // Resize Canvas Dialog
        // ///////////////////////////////////
        dojo.addOnLoad(function(){
            dojo.connect(pSubMenu2Item2, "onClick", function(){
                dojo.byId('resizeCanvasWidth').setAttribute('value', canvaso.width);
                dojo.byId('resizeCanvasHeight').setAttribute('value', canvaso.height);
                f5.show();
            });
            imgSub = dijit.byId("resizeCanvasSubmit");
            dojo.connect(imgSub, "onClick", function(){
                checkData('resizeCanvas');
            });
        });
        
        // This function check if the data in the new image dialog have
        // a correct format
        function checkData(form){
            var data;
            if (form == 'new') {
                data = f1.attr('value');
            }
            else {
                data = f5.attr('value');
            }
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
                    if (form == 'new') {
                        document.getElementById("imageName").lastChild.removeChild(document.getElementById("imageName").lastChild.lastChild);
                        imageName = document.createTextNode(data.name);
                        document.getElementById("imageName").lastChild.appendChild(imageName);
                    }
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
                                ghostcanvas.width = w;
                                ghostcanvaso.width = w;
                            }
                            if (h > canvaso.height) {
                                canvaso.height = h;
                                canvas.height = h;
                                ghostcanvas.height = h;
                                ghostcanvaso.height = h;
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
        dojo.addOnLoad(function(){
            var toolsTable = dojo.create("table", {
                id: "toolsTable"
            }, "tools");
            pointerButton = new dijit.form.Button({
                iconClass: "icons iconPointer",
                showLabel: false,
                onClick: function(){
                    ev_tool_change("pointer");
                    dojo.byId('sizeLabel').setAttribute("style", "display:none");
                    dojo.byId('widget_sizeSpinner').setAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            pencilButton = new dijit.form.Button({
                iconClass: "icons iconPencil",
                showLabel: false,
                disabled: true,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("pencil");
                    dojo.byId('sizeLabel').setAttribute("style", "display:none");
                    dojo.byId('widget_sizeSpinner').setAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            brushButton = new dijit.form.Button({
                iconClass: "icons iconBrush",
                showLabel: false,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("brush");
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Brush Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').removeAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            lineButton = new dijit.form.Button({
                iconClass: "icons iconLine",
                showLabel: false,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("line");
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Line Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').setAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            rectangleButton = new dijit.form.Button({
                iconClass: "icons iconRectangle",
                showLabel: false,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("rect");
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Stroke Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('fillDrop').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            circleButton = new dijit.form.Button({
                iconClass: "icons iconCircle",
                showLabel: false,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("circle");
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Stroke Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('sizeSpinner').setAttribute("aria-valuemax", Math.min(canvas.height, canvas.width) / 2 - 10);
                    dojo.byId('sizeSpinner').setAttribute("aria-valuenow", 1);
                    dojo.byId('fillDrop').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            ellipseButton = new dijit.form.Button({
                iconClass: "icons iconEllipse",
                showLabel: false,
                onClick: function(){
                    mySel = null;
                    clear(context);
                    clear(ghostcontext);
                    clear(ghostcontexto);
                    invalidate();
                    mainDraw();
                    ev_tool_change("ellipse");
                    dojo.byId('sizeLabel').removeAttribute("style", "display:none");
                    dojo.byId('sizeLabel').innerHTML = "Stroke Size";
                    dojo.byId('widget_sizeSpinner').removeAttribute("style", "display:none");
                    dojo.byId('sizeSpinner').setAttribute("aria-valuemax", Math.min(canvas.height, canvas.width) / 2 - 10);
                    dojo.byId('sizeSpinner').setAttribute("aria-valuenow", 1);
                    dojo.byId('fillDrop').removeAttribute("style", "display:none");
                    dojo.byId('brushDrop').setAttribute("style", "display:none");
                    dojo.byId('ereaser').setAttribute("style", "display:none");
                    bc.resize();
                }
            });
            var items = [pointerButton, pencilButton, brushButton, lineButton, rectangleButton, circleButton, ellipseButton];
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
        // //////////////////////////////////////////////////////////////////////////////////////////////
        // TOOLS MENU END
        // //////////////////////////////////////////////////////////////////////////////////////////////   
    }, false);
}
