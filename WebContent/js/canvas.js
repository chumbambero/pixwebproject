//Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
	window.addEventListener("load", function() {
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

		
		// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// LAYOUT START
		// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var bc, cp1, cp2, cp3, pMenuBar, pSubMenu, pSubMenuItem1, pSubMenuItem2, pSubMenuItem3, pSubMenu2, myPalette, strokeColorSelected, fillColorSelected, f1, f2, f3, f4;

		strokeColorSelected = true;
		fillColorSelected = false;

		dojo.addOnLoad(function() {
			// create a BorderContainer as the top widget in the hierarchy
			bc = new dijit.layout.BorderContainer({style: "height: 100%; width: 100%;"});

			// //////////////////////////////////////////////////////////////////////////////////////////////
			// MENU BAR START
			// //////////////////////////////////////////////////////////////////////////////////////////////
			pMenuBar = new dijit.MenuBar( {});
			// -----------------------------------
			// File Menu
			// -----------------------------------
			pSubMenu = new dijit.Menu( {});
			// New Image
			pSubMenuItem1 = new dijit.MenuItem( {label : "New Image"});
			pSubMenu.addChild(pSubMenuItem1);
			// Load Image
			pSubMenuItem2 = new dijit.MenuItem( {label : "Load Image"});
			pSubMenu.addChild(pSubMenuItem2);
			// Save Image
			pSubMenuItem3 = new dijit.MenuItem( {label : "Save Image",
				onClick : function(ev) {
				window.open(canvaso.toDataURL("image/png"));
				ev.preventDefault();}
			});
			pSubMenu.addChild(pSubMenuItem3);
			pMenuBar.addChild(new dijit.PopupMenuBarItem( {
				label : "File",
				popup : pSubMenu
			}));
			// -----------------------------------
			// Edit Menu
			// -----------------------------------
			pSubMenu2 = new dijit.Menu( {});
			// Clear Canvas
			pSubMenu2.addChild(new dijit.MenuItem( {
				label : "Clear Canvas",
				onClick : function() {
				contexto.clearRect(0, 0, canvas.width, canvas.height);
				context.clearRect(0, 0, canvas.width, canvas.height);
			}	
			}));
			pMenuBar.addChild(new dijit.PopupMenuBarItem( {
				label : "Edit",
				popup : pSubMenu2
			}));
			pMenuBar.startup();
			// //////////////////////////////////////////////////////////////////////////////////////////////
			// MENU BAR END
			// //////////////////////////////////////////////////////////////////////////////////////////////

			// create a ContentPane as the top pane in the
			// BorderContainer
			cp1 = new dijit.layout.ContentPane({
				region: "top",
				content: pMenuBar
			});		 
			bc.addChild(cp1);

			// create a ContentPane as the top pane in the
			// BorderContainer
			cp2 = new dijit.layout.ContentPane({
				region: "leading",
				content: dojo["cache"](new dojo._Url("menu.html"), {sanitize: true})
			});
			bc.addChild(cp2);

			// create a ContentPane as the center pane in the
			// BorderContainer
			cp3 = new dijit.layout.ContentPane({
				region: "center",
				content: dojo["cache"](new dojo._Url("canvas.html"), {sanitize: true})
			});
			bc.addChild(cp3);

			// put the top level widget into the document, and then call
			// startup()
			document.body.appendChild(bc.domNode);
			bc.startup();

			// create the new image dialog form and then append the dialog
			// to the body
			f1 = new dijit.Dialog({title: "New Image", id: "newDialog", content: dojo["cache"](new dojo._Url("new_img_form.html"), {sanitize: true})});
			document.body.appendChild(f1.domNode);
			// create the load image dialog form and then append the dialog
			// to the body
			f2 = new dijit.Dialog({title: "Load Image", id: "loadDialog", content: dojo["cache"](new dojo._Url("load_img_form.html"), {sanitize: true})});
			document.body.appendChild(f2.domNode);
			// create the load image from an URL dialog form and then append
			// the dialog to the body
			f3 = new dijit.Dialog({title: "Load Image From URL", id: "urlDialog", content: dojo["cache"](new dojo._Url("load_img_url_form.html"), {sanitize: true})});
			document.body.appendChild(f3.domNode);
			// create the load image from the google search engine dialog
			// form and then append the dialog to the body
			f4 = new dijit.Dialog({title: "Load Image From Google Image Seach", id:"googleDialog", content: dojo["cache"](new dojo._Url("load_img_google_form.html"), {sanitize: true})});
			document.body.appendChild(f4.domNode);

			init();
		});
		// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// LAYOUT END
		// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		var canvas, context, canvaso, contexto;

		// The active tool instance.
		var name_default = 'undefined';
		var tool;
		var tool_default = 'pencil';
		var color = '#000000';
		var colorStroke, colorFill;
		var line_width = 1;

		// holds all our elements
		var elements = [];

		// Element object to hold data for all drawn elements
		function Element() {
			this.data = null;
			this.x = null;
			this.y = null;
			this.w = null;
			this.h = null;
		}

		// add en element to elements
		function addElement(mousedownx, mousedowny, mouseupx, mouseupy) {
			var el = new Element;
			if(mousedownx<=mouseupx&&mousedowny<=mouseupy){
				el.x = mousedownx-line_width;
				el.y = mousedowny-line_width;
				el.w = mouseupx-mousedownx+line_width*2;
				el.h = mouseupy-mousedowny+line_width*2;
			}else if(mousedownx>mouseupx&&mousedowny<=mouseupy){
				el.x = mouseupx-line_width;
				el.y = mousedowny-line_width;
				el.w = mousedownx-mouseupx+line_width*2;
				el.h = mouseupy-mousedowny+line_width*2;
			}else if(mousedownx<=mouseupx&&mousedowny>mouseupy){
				el.x = mousedownx-line_width;
				el.y = mouseupy-line_width;
				el.w = mouseupx-mousedownx+line_width*2;
				el.h = mousedowny-mouseupy+line_width*2;
			}else{
				el.x = mouseupx-line_width;
				el.y = mouseupy-line_width;
				el.w = mousedownx-mouseupx+line_width*2;
				el.h = mousedowny-mouseupy+line_width*2;
			}
//			try {
//				 try { 
//					 var imgd = context.getImageData(el.x, el.y, el.w, el.h);  
//					} 
//				 catch (e) { 
//					 netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
//					 var imgd = context.getImageData(el.x, el.y, el.w, el.h); 
//				 }
//			} catch (e) {
//				throw new Error("unable to access image data: " + e)
//			}
			el.data = context.getImageData(el.x, el.y, el.w, el.h);
			console.log(el.x, el.y, el.w, el.h);
			elements.push(el);	
			console.log("element added");
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
		var mySelColor = '#000';
		var mySelWidth = 1;

		// since we can drag from anywhere in a node
		// instead of just its x/y corner, we need to save
		// the offset of the mouse when we start dragging.
		var offsetx, offsety;

		// Padding and border style widths for mouse offsets
		var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

		function invalidate() {
			canvasValid = false;
		}

		function init() {
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
				stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvaso, null)['paddingLeft'], 10)      || 0;
				stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvaso, null)['paddingTop'], 10)       || 0;
				styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvaso, null)['borderLeftWidth'], 10)  || 0;
				styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvaso, null)['borderTopWidth'], 10)   || 0;
			}

			document.getElementById("imageName").appendChild(document.createElement("h3"));
			var imageName = document.createTextNode(name_default);
			document.getElementById("imageName").lastChild.appendChild(imageName);

			// Add the temporary canvas.
			var container = canvaso.parentNode;
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
		}

		// The general-purpose event handler. This function just
		// determines the mouse
		// position relative to the canvas element.
		function ev_canvas(ev) {
			if (ev.layerX || ev.layerX == 0) { // Firefox
				ev._x = ev.layerX;
				ev._y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX == 0) { // Opera
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
		function ev_colorStroke_click(ev) {
			if (fillColorSelected) {
				colorFill.removeAttribute("class");
				colorStroke.setAttribute("class", "selected");
				fillColorSelected = false;
				strokeColorSelected = true;
			}
		}

		// The event handler for any changes made to the color fill
		// selector.
		function ev_colorFill_click(ev) {
			if (strokeColorSelected) {
				colorStroke.removeAttribute("class");
				colorFill.setAttribute("class", "selected");
				strokeColorSelected = false;
				fillColorSelected = true;
			}
		}

		// Draws a single element to a single context
		// draw() will call this with the normal canvas
		// myDown will call this with the ghost canvas
		function drawelement(ctx, element) {

			// We can skip the drawing of elements that have moved off
			// the screen:
			if (element.x > canvaso.width || element.y > canvaso.height) return; 
			if (element.x + element.w < 0 || element.y + element.h < 0) return;

			ctx.putImageData(element.data, element.x, element.y);
		}

		// While draw is called as often as the INTERVAL variable
		// demands,
		// It only ever does something if the canvas gets invalidated by
		// our code
		function draw() {
			if (canvasValid == false) {
				contexto.clearRect(0, 0, canvas.width, canvas.height);
				// Add stuff you want drawn in the background all the time
				// here
				// draw all elements
				var l = elements.length;
				for (var i = 0; i < l; i++) {
					drawelement(contexto, elements[i]);
				}
				// draw selection
				// right now this is just a stroke along the edge of the
				// selected box
				if (mySel != null) {
					contexto.strokeStyle = mySelColor;
					contexto.lineWidth = mySelWidth;
					contexto.strokeRect(mySel.x-3,mySel.y-3,mySel.w+6,mySel.h+6);
				}
				// Add stuff you want drawn on top all the time here
				canvasValid = true;
			}
		}

		// Sets mx,my to the mouse position relative to the canvas
		// unfortunately this can be tricky, we have to worry about
		// padding and borders
		function getMouse(ev) {
			var elem = canvaso, offsetX = 0, offsetY = 0;
			if (elem.offsetParent) {
				do {
					offsetX += elem.offsetLeft;
					offsetY += elem.offsetTop;
				} while ((elem = elem.offsetParent));
			}
			// Add padding and border style widths to offset
			offsetX += stylePaddingLeft;
			offsetY += stylePaddingTop;
			offsetX += styleBorderLeft;
			offsetY += styleBorderTop;
			mx = ev.pageX - offsetX;
			my = ev.pageY - offsetY;
		}

		// This function draws the #imageTemp canvas on top of
		// #imageView, after which
		// #imageTemp is cleared. This function is called each time when
		// the user
		// completes a drawing operation.
		function img_update() {
			contexto.drawImage(canvas, 0, 0);
			context.clearRect(0, 0, canvas.width, canvas.height);
		}

		// ///////////////////////////////////
		// New Dialog
		// ///////////////////////////////////
		dojo.addOnLoad(function() {
			dojo.connect(pSubMenuItem1, "onClick",
					f1, "show");
			imgSub = dijit.byId("newSubmit");
			dojo.connect(imgSub, "onClick", function() {
				checkData();
			});
		});

		// This function check if the data in the new image dialog have
		// a correct format
		function checkData() {
			var data = f1.attr('value');
			if (!validateNumeric(data.width)) {
				alert(data.width
						+ " for width input is not a valid number");
				return false;
			} else if (!validateNumeric(data.height)) {
				alert(data.height
						+ " for height input is not a valid number");
				return false;
			} else {
				canvas.width = data.width;
				canvas.height = data.height;
				canvaso.width = data.width;
				canvaso.height = data.height;
				document.getElementById("imageName").lastChild.removeChild(document.getElementById("imageName").lastChild.lastChild);
				imageName = document.createTextNode(data.name);
				document.getElementById("imageName").lastChild.appendChild(imageName);
				return true;
			}
		}

		function validateNumeric(strValue) {
			/***********************************************************
			 * DESCRIPTION: Validates that a string contains only valid
			 * numbers.
			 * 
			 * PARAMETERS: strValue - String to be tested for validity
			 * 
			 * RETURNS: True if valid, otherwise false.
			 **********************************************************/
			var objRegExp = /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
			// check for numeric characters
			return objRegExp.test(strValue);
		}

		// ///////////////////////////////////
		// Load Dialog
		// ///////////////////////////////////
		dojo.addOnLoad(function() {
			// loadDlg = dijit.byId("loadDialog");
			dojo.connect(pSubMenuItem2, "onClick",
					f2, "show");
			dojo.addOnLoad(function() {

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
			dojo.connect(loadSub, "onClick", function() {
				loadNext();
			});
		});

		// This function open the url dialog after click on the next
		// button of the Load Dialog
		function loadNext(){
			var loadComboBoxValue = dijit.byId('loadComboBox').attr('value');
			if(loadComboBoxValue == 'URL'){
				// ///////////////////////////////////
				// Url Dialog
				// ///////////////////////////////////
				// urlDlg = dijit.byId("urlDialog");
				f3.show();
				dojo.addOnLoad(function() {
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
				dojo.connect(urlSub, "onClick", function() {
					urlOk("urlComboBox", f3);
				});
			} 
			else if(loadComboBoxValue == 'Google Image Search'){
				// ///////////////////////////////////
				// Google Dialog
				// ///////////////////////////////////
				// googleDlg = dijit.byId("googleDialog");
				f4.show();
				dojo.addOnLoad(function() {
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
				dojo.connect(googleSearch, "onClick", function() {
					doSearch();
				});
				googleSub = dijit.byId("googleSubmit");
				dojo.connect(googleSub, "onClick", function() {
					urlOk("googleComboBox", f4);
				});
			} else {
				alert("Sorry but the selected type of loading is not implemented");
			}
		}

		function doSearch() {
			var store = new dojox.data.GoogleImageSearchStore();
			var query = {
					text: dojo.byId("googleSearchInput").value
			};
			var callbackFunction = function(items) {
				var table = dojo.byId("googleResultTable");
				var tableBody = table.tBodies[0];
				dojo.empty(tableBody);
				// Show the table
				dojo.style(table, "display", "");
				dojo.forEach(items, function(item, index) {
					if(validateImageUrl(store.getValue(item, 'unescapedUrl'))){
						var row = dojo.create("tr", {},
								tableBody);
						var sizeCell = dojo.create("td", {
							innerHTML: store.getValue(item, "width") + "x" + store.getValue(item, "height") + " px",
						},
						row);
						var imgCell = dojo.create("td", {
						},
						row);
						var link = dojo.create("button", {
							target: "_blank",
						},
						imgCell);
						dojo.create("img", {
							src: store.getValue(item, "tbUrl")
						},
						link);
						link.setAttribute("onClick", "dojo.byId('googleTextBox').value = '"+store.getValue(item, 'unescapedUrl')+"'");
					}
				})
			};
			var onErrorFunction = function() {
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
			if(cbox=="urlComboBox")
				urlTextValue = dlg.attr('value').urlTextBox;
			if(cbox=="googleComboBox")
				urlTextValue = dlg.attr('value').googleTextBox;
			if(validateImageUrl(urlTextValue)){
				var img = new Image();
				img.src = urlTextValue;
				// when image loaded
				img.onload = function() {
					var w = img.width;
					var h = img.height;
					if(w>canvaso.width||h>canvaso.height){
						if(urlTypeValue=="Automatically Resizing Canvas"){
							// make destination have same dimensions as
							// image
							if(w>canvaso.width){
								canvaso.width = w;
								canvas.width = w;
							}
							if(h>canvaso.height){
								canvaso.height = h;
								canvas.height = h;
							}
						}
						else {
							if(w>canvaso.width){
								img.width = canvaso.width;
								img.height = Math.round(h * canvaso.width / w);
								w = img.width;
								h = img.height;
							}
							if(h>canvaso.height){
								img.height = canvaso.height;
								img.width = Math.round(w * canvaso.height / h);
								w = img.width;
								h = img.height;
							}
						}
					}
					// transfer image to context
					context.drawImage(img, 6, 6, w, h);
					//addElement(6, 6, w, h);
					// console.log(context.getImageData(0, 0, w, h));
					img_update();
				}    
			}
		}

		function validateImageUrl(strValue) {
			/***********************************************************
			 * DESCRIPTION: Validates that a string contains only valid
			 * URL for an image.
			 * 
			 * PARAMETERS: strValue - String to be tested for validity
			 * 
			 * RETURNS: True if valid, otherwise false.
			 **********************************************************/
			var objRegExp = new RegExp("^https?://(?:[a-z\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$");
			// check for numeric characters
			return objRegExp.test(strValue);
		}

		// //////////////////////////////////////////////////////////////////////////////////////////////
		// COLOR PALETTE START
		// //////////////////////////////////////////////////////////////////////////////////////////////
		dojo.addOnLoad(function() {
			myPalette = new dijit.ColorPalette( {
				palette : "7x10",
				onChange : function(val) {
				if(strokeColorSelected){
					context.strokeStyle = val;
					document.getElementById("selectedStrokeColor").setAttribute("style", "background:"+val);
				}
				else {
					context.fillStyle = val;
					document.getElementById("selectedFillColor").setAttribute("style", "background:"+val);
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
		var pointerButton, pencilButton, lineButton, rectangleButton;
		var selected_tool = tool_default;
		dojo.addOnLoad(function() {
			var toolsTable = dojo.create("table", {id: "toolsTable"}, "tools");
			pointerButton = new dijit.form.Button({
				iconClass: "icons iconPointer", 
				showLabel: false,
				onClick: function() {
				ev_tool_change("pointer");
			}
			});
			pencilButton = new dijit.form.Button({
				iconClass: "icons iconPencil", 
				showLabel: false,
				disabled: true,
				onClick: function() {
				ev_tool_change("pencil");
			}
			});
			lineButton = new dijit.form.Button({
				iconClass: "icons iconLine", 
				showLabel: false,
				onClick: function() {
				ev_tool_change("line");
			}
			});
			rectangleButton = new dijit.form.Button({
				iconClass: "icons iconRectangle", 
				showLabel: false,
				onClick: function() {
				ev_tool_change("rect");
			}
			});
			var items = [pointerButton, pencilButton, lineButton, rectangleButton];
			var counter = 0;
			var row = 0;
			dojo.forEach(items, function(data){
				if(counter<4){
					if(counter==0){
						dojo.create("tr", null, toolsTable);
					}
					dojo.create("td", null, toolsTable.childNodes[row]).appendChild(data.domNode);
					counter++;
					if(counter==4){
						counter = 0;
						row++;
					}
				}
			});
		});
		function ev_tool_change(value) {
			if (tools[value]) {
				tool = new tools[value]();
				if(selected_tool=='pointer'){
					pointerButton.attr('disabled', false);
				}else if(selected_tool=='pencil'){
					pencilButton.attr('disabled', false);
				}else if(selected_tool=='line'){
					lineButton.attr('disabled', false);
				}else if(selected_tool=='rect'){
					rectangleButton.attr('disabled', false);
				}
				if(value=='pointer'){
					pointerButton.attr('disabled', true);
				}else if(value=='pencil'){
					pencilButton.attr('disabled', true);
				}else if(value=='line'){
					lineButton.attr('disabled', true);
				}else if(value=='rect'){
					rectangleButton.attr('disabled', true);
				}
				selected_tool=value;
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
		tools.pointer = function() {
			var tool = this;
			this.started = false;
			// Happens when the mouse is clicked in the canvas
			this.mousedown = function(ev){
				getMouse(ev);
				// clear the temp canvas from its last use
				context.clearRect(0, 0, canvas.width, canvas.height);
				// run through all the elements
				var l = elements.length;
				for (var i = l-1; i >= 0; i--) {
					// draw element onto temp context
					drawelement(context, elements[i]);
					// get image data at the mouse x,y pixel
					//var imageData = context.getImageData(mx, my, 1, 1);
					var imageData = context.getImageData(ev._x, ev._y, 1, 1);
					// if the mouse pixel exists, select and break
					console.log("r: "+imageData.data[0]);
					console.log("g: "+imageData.data[1]);
					console.log("b: "+imageData.data[2]);
					console.log("o: "+imageData.data[3]);
					if (imageData.data[3] > 0) {
						mySel = elements[i];
						offsetx = mx - mySel.x;
						offsety = my - mySel.y;
						mySel.x = mx - offsetx;
						mySel.y = my - offsety;
						tool.started = true;
						// make draw() fire every INTERVAL milliseconds.
						setInterval(draw, INTERVAL);
						canvas.onmousemove = tool.mousemove;
						invalidate();
						context.clearRect(0, 0, canvas.width, canvas.height);
						return;
					}
				}
				// haven't returned means we have selected nothing
				mySel = null;
				// clear the temp canvas for next time
				context.clearRect(0, 0, canvas.width, canvas.height);
				// invalidate because we might need the selection border
				// to disappear
				invalidate();
			};
			// Happens when the mouse is moving inside the canvas
			this.mousemove = function(ev){
				if (tool.started){
					getMouse(ev);
					mySel.x = mx - offsetx;
					// mySel.x = ev._x;
					mySel.y = my - offsety; 
					// mySel.y = ev._y;
					// something is changing position so we better
					// invalidate the canvas!
					invalidate();
				}
			};
			this.mouseup = function(ev){
				tool.started = false;
				clearInterval(draw);
			};
		};

		// The drawing pencil.
		tools.pencil = function() {
			var tool = this;
			this.started = false;
			this.smallerx, this.smallery, this.biggerx, this.biggery;
			context.lineWidth = 1;
			// This is called when you start holding down the mouse
			// button.
			// This starts the pencil drawing.
			this.mousedown = function(ev) {
				tool.smallerx=tool.biggerx=ev._x;
				tool.smallery=tool.biggery=ev._y;
				context.beginPath();
				context.moveTo(ev._x, ev._y);
				tool.started = true;
			};
			// This function is called every time you move the mouse.
			// Obviously, it only
			// draws if the tool.started state is set to true (when you
			// are holding down
			// the mouse button).
			this.mousemove = function(ev) {
				if (tool.started) {
					context.lineTo(ev._x, ev._y);
					context.stroke();
					if(ev._x<tool.smallerx){
						tool.smallerx=ev._x;
					}
					if(ev._x>tool.biggerx){
						tool.biggerx=ev._x;
					}
					if(ev._y<tool.smallery){
						tool.smallery=ev._y;
					}
					if(ev._y>tool.biggery){
						tool.biggery=ev._y;
					}
				}
			};
			// This is called when you release the mouse button.
			this.mouseup = function(ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					if(ev._x<tool.smallerx){
						tool.smallerx=ev._x;
					}
					if(ev._x>tool.biggerx){
						tool.biggerx=ev._x;
					}
					if(ev._y<tool.smallery){
						tool.smallery=ev._y;
					}
					if(ev._y>tool.biggery){
						tool.biggery=ev._y;
					}
					addElement(tool.smallerx, tool.smallery, tool.biggerx, tool.biggery);
					img_update();
				}
			};
		};

		// The rectangle tool.
		tools.rect = function() {
			var tool = this;
			this.started = false;
			var mousedownx, mousedowny, mouseupx, mouseupy;
			context.lineWidth = line_width;
			// This is called when you start holding down the mouse
			// button.
			this.mousedown = function(ev) {
				tool.started = true;
				tool.mousedownx = ev._x;
				tool.mousedowny = ev._y;
			};
			// This function is called every time you move the mouse.
			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}
				var x = Math.min(ev._x, tool.mousedownx), y = Math.min(ev._y,
						tool.mousedowny), w = Math.abs(ev._x - tool.mousedownx), h = Math
						.abs(ev._y - tool.mousedowny);

				context.clearRect(0, 0, canvas.width, canvas.height);
				if (!w || !h) {
					return;
				}
				context.strokeRect(x, y, w, h);
			};
			// This is called when you release the mouse button.
			this.mouseup = function(ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					tool.mouseupx = ev._x;
					tool.mouseupy = ev._y;
					addElement(tool.mousedownx, tool.mousedowny, tool.mouseupx, tool.mouseupy);
					img_update();
				}
			};
		};
		// The line tool.
		tools.line = function() {
			var tool = this;
			this.started = false;
			var mousedownx, mousedowny, mouseupx, mouseupy;
			context.lineWidth = line_width;
			// This is called when you start holding down the mouse
			// button.
			this.mousedown = function(ev) {
				tool.started = true;
				tool.mousedownx = ev._x;
				tool.mousedowny = ev._y;
			};
			// This function is called every time you move the mouse.
			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.beginPath();
				context.moveTo(tool.mousedownx, tool.mousedowny);
				context.lineTo(ev._x, ev._y);
				context.stroke();
				context.closePath();
			};
			// This is called when you release the mouse button.
			this.mouseup = function(ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					tool.mouseupx = ev._x;
					tool.mouseupy = ev._y;
					addElement(tool.mousedownx, tool.mousedowny, tool.mouseupx, tool.mouseupy);
					img_update();
				}
			};
		};
		// The elipse tool.
		tools.ellipse = function() {
			var tool = this;
			this.started = false;
			var mousedownx, mousedowny, mouseupx, mouseupy;
			// This is called when you start holding down the mouse
			// button.
			this.mousedown = function(ev) {
				tool.started = true;
				tool.mousedownx = ev._x;
				tool.mousedowny = ev._y;
			};
			// This function is called every time you move the mouse.
			this.mousemove = function(ev) {
				if (!tool.started) {
					return;
				}
				var x = Math.min(ev._x, tool.mousedownx), y = Math.min(ev._y,
						tool.mousedowny), w = Math.abs(ev._x - tool.mousedownx), h = Math
						.abs(ev._y - tool.mousedowny);

				context.clearRect(0, 0, canvas.width, canvas.height);
				if (!w || !h) {
					return;
				}
				context.strokeRect(x, y, w, h);
			};
			// This is called when you release the mouse button.
			this.mouseup = function(ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
					tool.mouseupx = ev._x;
					tool.mouseupy = ev._y;
					addElement(tool.mousedownx, tool.mousedowny, tool.mouseupx, tool.mouseupy);
					img_update();
				}
			};
		};
		// //////////////////////////////////////////////////////////////////////////////////////////////
		// TOOLS END
		// //////////////////////////////////////////////////////////////////////////////////////////////

	}, false);
}