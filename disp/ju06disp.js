//
// ju06disp.js
// Copyright 2016 gotojo All Rights Reserved. 
//

var JU06Disp = function(left,top,idstring,parentid) {
	this.idstring=idstring;
	this.left=left;
	this.value=0;
	this.fdot=false;
	var image = new Image();
	image.src = "disp/ju06num.png";
	image.class="ju_disp";
	image.style.position="absolute";
	image.style.left=left+"px";
	image.style.top=top+"px";
	image.style.clip="rect(0px, 32px, 48px, 0px)";
	this.image=image;
	document.getElementById(parentid).appendChild(image);
	this.redraw();
	return this;
}
JU06Disp.prototype = {
	redraw: function() {
		var value=this.fdot?this.value+11:this.value;
		var offset=32*value;
		var rectstring="rect(0px, "+(offset+32)+"px, 48px, "+offset+"px)";
		this.image.style.clip=rectstring;
		this.image.style.left=this.left-offset+'px';
	},
	setvalue: function(value) {
		if (value<0) return;
		if (value>10) return;
		this.value=value;
		this.redraw();
	},
	setdot: function(f) {
		this.fdot=f;
		this.redraw();
	},
	sethyphen: function() {
		this.value=10;
		this.redraw();
	}
}