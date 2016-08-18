//
// ju06button.js
// Copyright 2016 gotojo All Rights Reserved. 
//

var JU06Button = function(left,top,idstring,parentid,cbdown,cbup,panel) {
	var imgurl="button/JU-06Button.png";
	this.status="off";
	this.idstring=idstring;
	this.top=top;
	this.cbdown=cbdown;
	this.cbup=cbup;
	this.panel=panel;
	var image = new Image();
	image.src = imgurl;
	image.class="ju_button";
	image.style.position="absolute";
	image.style.left=left+"px";
	image.style.top=top-38+"px";
	image.style.clip="rect(38px, 24px, 76px, 0px)";
	image.addEventListener("mousedown",(function(_this){
      return function(e){
        _this.ondown(e);
      };
    })(this),false);
	image.addEventListener("mouseup",(function(_this){
      return function(e){
        _this.onup(e);
      };
    })(this),false);
	this.image=image;
	this.redraw();
	document.getElementById(parentid).appendChild(image);
	return this;
}
JU06Button.prototype = {
	redraw: function() {
		if (this.status=="on") {
			this.image.style.top = this.top+'px'; 
			this.image.style.clip = 'rect(0px, 24px, 38px, 0px)'; 
		} else {
			this.image.style.top = this.top-38+'px'; 
			this.image.style.clip = 'rect(38px, 24px, 76px, 0px)'; 
		}
	},
	setstatus: function(status) {
		this.status=status;
		this.redraw();
	},
	on: function() {
		this.status="on";
		this.redraw();
	},
	off: function() {
		this.status="off";
		this.redraw();
	},
	ondown: function(e) {
		this.cbdown(this);
		this.redraw();
	},
	onup: function(e) {
		this.cbup(this);
		this.redraw;
	}
}