// Copyright 2016 gotojo All Rights Reserved. 

var JU06ParamObj = function(id,min,max,initvalue,ccnum,fissw) {
    this.id=id;
    this.min=min;
    this.max=max;
    this.initvalue=initvalue;
    this.value=initvalue;
    this.ccnum=ccnum;
    this.fissw=fissw;
}

JU06ParamObj.prototype = {
    set: function(value) {
        if (value<this.min) return false;
        if (value>this.max) return false;
        this.value=value;
        return true;
    },
    get: function() { return this.value; },
    getccnum: function() { return this.ccnum; },
    setmidivalue: function(value) { 
        if (this.fissw) {
            if (this.value<64) this.value=0;
            else this.value=127;
        } else if (this.max>127) {
            this.value=value<<1;
        } else {
            this.value=value;
        }
    },
    getmidivalue: function() { 
        if (this.fissw) {
            if (this.value==0) return 0;
            else return 127;
        } else if (this.max>127) {
            return this.value>>1;
        } else {
            return this.value;
        }
    }
}

var JU06Param = function() {
    this.name="";
    this.param=[];
    this.param["lforate"]    = new JU06ParamObj("lforate",    0,255,0, 3,false);
    this.param["lfodelay"]   = new JU06ParamObj("lfodelay",   0,255,0, 9,false);
    this.param["dcolfo"]     = new JU06ParamObj("dcolfo",     0,255,0,13,false);
    this.param["dcopwm"]     = new JU06ParamObj("dcopwm",     0,255,0,14,false);
    this.param["dcosub"]     = new JU06ParamObj("dcosub",     0,255,0,18,false);
    this.param["dconoise"]   = new JU06ParamObj("dconoise",   0,255,0,19,false);
    this.param["hpffreq"]    = new JU06ParamObj("hpffreq",    0,255,0,20,false);
    this.param["vcffreq"]    = new JU06ParamObj("vcffreq",    0,255,0,74,false);
    this.param["vcfreso"]    = new JU06ParamObj("vcfreso",    0,255,0,71,false);
    this.param["vcfenv"]     = new JU06ParamObj("vcfenv",     0,255,0,22,false);
    this.param["vcflfo"]     = new JU06ParamObj("vcflfo",     0,255,0,23,false);
    this.param["vcfkybd"]    = new JU06ParamObj("vcfkybd",    0,255,0,24,false);
    this.param["vcalevel"]   = new JU06ParamObj("vcalevel",   0,255,0,26,false);
    this.param["attack"]     = new JU06ParamObj("attack",     0,255,0,73,false);
    this.param["decay"]      = new JU06ParamObj("decay",      0,255,0,75,false);
    this.param["sustain"]    = new JU06ParamObj("sustain",    0,255,0,27,false);
    this.param["release"]    = new JU06ParamObj("release",    0,255,0,72,false);
    this.param["pwmsrc"]     = new JU06ParamObj("pwmsrc",     0,  1,0,15,false);
    this.param["vcfenvmode"]     = new JU06ParamObj("vcfenvmode", 0,  1,0,21,false);
    this.param["vcaenvmode"]     = new JU06ParamObj("vcaenvmode", 0,  1,0,25,false);
    this.param["dcorange"]   = new JU06ParamObj("dcorange",   0,  2,0,12,false);
    this.param["dcosqr"]     = new JU06ParamObj("dcosqr",     0,  1,0,16,false);
    this.param["dcosaw"]     = new JU06ParamObj("dcosaw",     0,  1,0,17,false);
    this.param["chorus"]     = new JU06ParamObj("chorus",     0,  3,0,93,false);
    this.param["dlylev"]     = new JU06ParamObj("dlylev",     0,255,0,91,false);
    this.param["dlytim"]     = new JU06ParamObj("dlytim",     0,255,0,82,false);
    this.param["dlyfb"]      = new JU06ParamObj("dlyfb",      0,255,0,83,false);
    this.param["portasw"]    = new JU06ParamObj("portasw",    0,  1,0,65,true);
    this.param["portatim"]   = new JU06ParamObj("portatim",   0,255,0, 5,false);
    this.param["asgnmode"]   = new JU06ParamObj("asgnmode",   0,  3,0,86,false);
    this.param["bendrange"]  = new JU06ParamObj("bendrange",  0, 24,0,87,false);
    this.mem_bank=-1;
    this.mem_num=-1;
}

JU06Param.prototype = {
    getobj: function(id) { return this.param[id]; },
    setvalue: function(id,value) { return this.param[id].set(value); },
    setsw: function(id) { 
        if (this.getvalue(id)==0) this.param[id].set(1);
        else this.param[id].set(0);
    },
    getvalue: function(id) { return this.param[id].get(); },
    getccnum: function(id) { return this.param[id].getccnum(); },
    getmidivalue: function(id) { return this.param[id].getmidivalue(); },
    getidfromcc: function(ccnum) {
        for (var id in this.param) {
            if (this.getccnum(id)==ccnum) return id;
        }
        return -1;
    },
    setvaluebyccnum: function(ccnum,value) { 
        var id=this.getidfromcc(ccnum);
        if (id==-1) return;
        this.param[id].setmidivalue(value); 
    },
    save: function(num) {
    },
    load: function(num) {
        var patch=eval("patch"+(num+1));
        for (var i in this.param) {
            this.param[i].value=patch[i];
        }
        this.name=patch.name;
        // console.log(this.name);
    },
    sendcc: function(id) {
        controlchange(this.getccnum(id),this.getmidivalue(id));
    },
    sendccall: function() {
        for (var i in this.param) {
            if (this.param[i].ccnum>=0) this.sendcc(i);
        }
    }
}

var JU06Panel = function(parent) {
    this.param=new JU06Param;
    this.param.name="";
    this.tmpbank=-1;
    this.membank=-1;
    this.memnum=-1;
    this.fmanual=true;
    this.fedit=false;
    this.button=[];
    this.slider=[];
    this.switch=[];
    this.createbutton( 431, 124,  "dco16", parent, this);
    this.createbutton( 431, 192,   "dco8", parent, this);
    this.createbutton( 431, 263,   "dco4", parent, this);
    this.createbutton( 571, 194, "dcosqr", parent, this);
    this.createbutton( 571, 264, "dcosaw", parent, this);

    this.createbutton( 336, 361,   "pad1", parent, this);
    this.createbutton( 379, 361,   "pad2", parent, this);
    this.createbutton( 421, 361,   "pad3", parent, this);
    this.createbutton( 463, 361,   "pad4", parent, this);
    this.createbutton( 508, 360,   "pad5", parent, this);
    this.createbutton( 550, 360,   "pad6", parent, this);
    this.createbutton( 591, 360,   "pad7", parent, this);
    this.createbutton( 635, 360,   "pad8", parent, this);

    this.createbutton( 763, 360,   "pad9", parent, this);
    this.createbutton( 806, 360,  "pad10", parent, this);
    this.createbutton( 849, 360,  "pad11", parent, this);
    this.createbutton( 892, 360,  "pad12", parent, this);
    this.createbutton( 934, 360,  "pad13", parent, this);
    this.createbutton( 976, 360,  "pad14", parent, this);
    this.createbutton(1019, 360,  "pad15", parent, this);
    this.createbutton(1061, 360,  "pad16", parent, this);

    this.createbutton(1136, 360,"chorus1", parent, this);
    this.createbutton(1178, 360,"chorus2", parent, this);
    this.createbutton(1221, 360, "manual", parent, this);

    this.slider["lforate"]  = document.getElementById("lforate");
    this.slider["lfodelay"] = document.getElementById("lfodelay");
    this.slider["dcolfo"]   = document.getElementById("dcolfo");
    this.slider["dcopwm"]   = document.getElementById("dcopwm");
    this.slider["dcosub"]   = document.getElementById("dcosub");
    this.slider["dconoise"] = document.getElementById("dconoise");
    this.slider["hpffreq"]  = document.getElementById("hpffreq");
    this.slider["vcffreq"]  = document.getElementById("vcffreq");
    this.slider["vcfreso"]  = document.getElementById("vcfreso");
    this.slider["vcfenv"]   = document.getElementById("vcfenv");
    this.slider["vcflfo"]   = document.getElementById("vcflfo");
    this.slider["vcfkybd"]  = document.getElementById("vcfkybd");
    this.slider["vcalevel"] = document.getElementById("vcalevel");
    this.slider["attack"]   = document.getElementById("attack");
    this.slider["decay"]    = document.getElementById("decay");
    this.slider["sustain"]  = document.getElementById("sustain");
    this.slider["release"]  = document.getElementById("release");
    this.slider["dlylev"]   = document.getElementById("dlylev");
    this.slider["dlytim"]   = document.getElementById("dlytim");
    this.slider["dlyfb"]    = document.getElementById("dlyfb");
    this.slider["portatim"] = document.getElementById("portatim");
    this.slider["asgnmode"] = document.getElementById("asgnmode");
    this.slider["bendrange"]    = document.getElementById("bendrange");

    this.switch["pwmsrc"]   = document.getElementById("pwmsrc");
    this.switch["vcfenvmode"]   = document.getElementById("vcfenvmode");
    this.switch["vcaenvmode"]   = document.getElementById("vcaenvmode");

    this.switch["portasw"]  = document.getElementById("portasw");
    this.switch["solo"]  = document.getElementById("solo");
    this.switch["unison"]  = document.getElementById("unison");
    this.switch["poly"]  = document.getElementById("poly");

    this.disp0=new JU06Disp(678,355,"disp0",parent);
    this.disp1=new JU06Disp(712,355,"disp1",parent);

    // this.button["portasw"]=new SimpleButton( 10, 10, 10, 10, "portasw", "subpanel", this.onbuttondown, this.onbuttonup, this);     

    this.updateall();
}
JU06Panel.prototype = {
    createbutton: function(left,top,id,parent,panel) {
        this.button[id]=new JU06Button( left, top, id, parent, this.onbuttondown, this.onbuttonup, panel);     
    },
    onbuttondown: function(obj) {
        var id=obj.idstring;
        switch (id) {
        case "dco16":
            obj.panel.param.setvalue("dcorange",0);
            obj.panel.param.sendcc("dcorange");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "dco8":
            obj.panel.param.setvalue("dcorange",1);
            obj.panel.param.sendcc("dcorange");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "dco4":
            obj.panel.param.setvalue("dcorange",2);
            obj.panel.param.sendcc("dcorange");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "dcosqr":
            obj.panel.param.setsw("dcosqr");
            obj.panel.param.sendcc("dcosqr");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "dcosaw":
            obj.panel.param.setsw("dcosaw");
            obj.panel.param.sendcc("dcosaw");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "pad1":
            obj.panel.settmpbank(0);
            break;
        case "pad2":
            obj.panel.settmpbank(1);
            break;
        case "pad3":
            obj.panel.settmpbank(2);
            break;
        case "pad4":
            obj.panel.settmpbank(3);
            break;
        case "pad5":
            obj.panel.settmpbank(4);
            break;
        case "pad6":
            obj.panel.settmpbank(5);
            break;
        case "pad7":
            obj.panel.settmpbank(6);
            break;
        case "pad8":
            obj.panel.settmpbank(7);
            break;
        case "pad9":
            obj.panel.setmemnum(0);
            break;
        case "pad10":
            obj.panel.setmemnum(1);
            break;
        case "pad11":
            obj.panel.setmemnum(2);
            break;
        case "pad12":
            obj.panel.setmemnum(3);
            break;
        case "pad13":
            obj.panel.setmemnum(4);
            break;
        case "pad14":
            obj.panel.setmemnum(5);
            break;
        case "pad15":
            obj.panel.setmemnum(6);
            break;
        case "pad16":
            obj.panel.setmemnum(7);
            break;
        case "chorus1":
            if (window.event.shiftKey) {
                if (obj.panel.param.getvalue("chorus")==3) obj.panel.param.setvalue("chorus",0);
                else obj.panel.param.setvalue("chorus",3);
            } else {
                if (obj.panel.param.getvalue("chorus")==1) obj.panel.param.setvalue("chorus",0);
                else obj.panel.param.setvalue("chorus",1);
            }
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            obj.panel.param.sendcc("chorus");
            break;
        case "chorus2":
            if (window.event.shiftKey) {
                if (obj.panel.param.getvalue("chorus")==3) obj.panel.param.setvalue("chorus",0);
                else obj.panel.param.setvalue("chorus",3);
            } else {
                if (obj.panel.param.getvalue("chorus")==2) obj.panel.param.setvalue("chorus",0);
                else obj.panel.param.setvalue("chorus",2);
            }
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            obj.panel.param.sendcc("chorus");
           break;
        case "manual":
            obj.panel.tmpbank=-1;
            obj.panel.membank=-1;
            obj.panel.memnum=-1;
            obj.panel.fmanual=true;
            obj.panel.param.sendccall();
            obj.panel.fedit=false;
            obj.panel.update("pad1");
            obj.panel.update("pad9");
            obj.panel.param.name="";
            obj.panel.updatepatchname();
            break;
        case "portasw":
            obj.panel.param.setsw("portasw");
            obj.panel.param.sendcc("portasw");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "poly":
            obj.panel.param.setvalue("asgnmode",obj.panel.param.getvalue("portasw")?1:0);
            obj.panel.param.sendcc("asgnmode");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "unison":
            obj.panel.param.setvalue("asgnmode",3);
            obj.panel.param.sendcc("asgnmode");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
            break;
        case "solo":
            obj.panel.param.setvalue("asgnmode",2);
            obj.panel.param.sendcc("asgnmode");
            if (!obj.panel.fmanual) obj.panel.fedit=true;
           break;
        default:
            break;
        }
        obj.panel.update(id);
        obj.panel.updatedisp();
    },
    onbuttonup: function(obj) {
    },
    setvalue: function(id,value) {
        if ((id=="bendrange")&&(value>12)) value=24;
        this.param.setvalue(id,value);
        if (!this.fmanual) this.fedit=true;
        var valuestr="";
        valuestr=id+": "+value;
        document.getElementById("curvalue").innerHTML=valuestr;
        this.updatedisp();
    },
    settmpbank: function(bank) {
        this.tmpbank=bank;
        this.update("pad9");
    },
    setmemnum: function(num) {
        if (this.tmpbank>=0) {
            this.membank=this.tmpbank;
            this.tmpbank=-1;
        } else if (this.membank<0) {
           return;
        }
        this.memnum=num;
        this.fmanual=false;
        this.fedit=false;
        this.param.load(this.membank*8+this.memnum);
        this.param.sendccall();
        this.updateall();
    },
    sendcc: function(id) {
        this.param.sendcc(id);
    },
    midiin: function(event) {
        var status=event.data[0]&0xF0;
        if (status==0xB0) {
            this.param.setvaluebyccnum(event.data[1],event.data[2]);
            this.update(this.param.getidfromcc(event.data[1]));
        }
    },
    update: function(id) {
        var elem=document.getElementById(id);
        switch (id) {
        case "dcorange":
        case "dco16":
        case "dco8":
        case "dco4":
            switch (this.param.getvalue("dcorange")) {
            case 0:
                this.button["dco16"].on();
                this.button["dco8"].off();
                this.button["dco4"].off();
                break;
            case 1:
                this.button["dco16"].off();
                this.button["dco8"].on();
                this.button["dco4"].off();
                break;
            case 2:
                this.button["dco16"].off();
                this.button["dco8"].off();
                this.button["dco4"].on();
                break;
            default:
                break;
            }
            break;
        case "dcosqr":
        case "dcosaw":
            if (this.param.getvalue(id)) this.button[id].on();
            else this.button[id].off();
            break;
        case "pad1":
        case "pad2":
        case "pad3":
        case "pad4":
        case "pad5":
        case "pad6":
        case "pad7":
        case "pad8":
            for (var i=0; i<8; i++) {
                var padid="pad"+(i+1);
                if (i==this.tmpbank) this.button[padid].on();
                else if (i==this.membank&&this.tmpbank<0) this.button[padid].on();
                else this.button[padid].off();
            }
            break;
        case "pad9":
        case "pad10":
        case "pad11":
        case "pad12":
        case "pad13":
        case "pad14":
        case "pad15":
        case "pad16":
            for (var i=0; i<8; i++) {
                var padid="pad"+(i+8+1);
                if (i==this.memnum&&this.tmpbank<0) this.button[padid].on();
                else this.button[padid].off();
            }
            break;
        case "chorus":
        case "chorus1":
        case "chorus2":
            switch (this.param.getvalue("chorus")) {
            case 0:
                this.button["chorus1"].off();
                this.button["chorus2"].off();
                break;
            case 1:
                this.button["chorus1"].on();
                this.button["chorus2"].off();
                break;
            case 2:
                this.button["chorus1"].off();
                this.button["chorus2"].on();
                break;
             case 3:
                this.button["chorus1"].on();
                this.button["chorus2"].on();
                break;
            default:
                break;
            }
            break;
        case "manual":
            if (this.fmanual) this.button[id].on();
            else this.button[id].off();
            break;
        case "lforate":
        case "lfodelay":
        case "dcolfo":
        case "dcopwm":
        case "dcosub":
        case "dconoise":
        case "hpffreq":
        case "vcffreq":
        case "vcfreso":
        case "vcfenv":
        case "vcflfo":
        case "vcfkybd":
        case "vcalevel":
        case "attack":
        case "decay":
        case "sustain":
        case "release":
            this.slider[id].value=this.param.getvalue(id);
            break;
        case "pwmsrc":
        case "vcfenvmode":
        case "vcaenvmode":
            this.switch[id].value=this.param.getvalue(id);
            break;
        case "asgnmode":
        case "poly":
        case "unison":
        case "solo":
            switch (this.param.getvalue("asgnmode")) {
            case 0:
            case 1:
                this.switch["poly"].style.backgroundColor="blue";
                this.switch["unison"].style.backgroundColor="white";
                this.switch["solo"].style.backgroundColor="white";
                break;
            case 2:
                this.switch["poly"].style.backgroundColor="white";
                this.switch["unison"].style.backgroundColor="white";
                this.switch["solo"].style.backgroundColor="blue";
                break;
            case 3:
                this.switch["poly"].style.backgroundColor="white";
                this.switch["unison"].style.backgroundColor="blue";
                this.switch["solo"].style.backgroundColor="white";
                break;
            default:
                break;
            }
            break;
        case "portasw":
            this.switch[id].style.backgroundColor=this.param.getvalue(id)?"blue":"white";
            break;
        case "dlylev":
        case "dlytim":
        case "dlyfb":
        case "portatim":
            this.slider[id].value=this.param.getvalue(id);
            break;
        case "bendrange":
            {
                var value=this.param.getvalue(id);
                if (value>12) this.slider[id].value=13;
                else this.slider[id].value=value;
            }
            break;
        default:
            break;
        }
    },
    updatedisp: function() {
        this.disp1.setdot(this.fedit);
        if (this.tmpbank>=0) {
            this.disp0.setvalue(this.tmpbank+1);
            this.disp1.sethyphen();
        } else {
            if (this.membank>=0) this.disp0.setvalue(this.membank+1);
            else this.disp0.sethyphen();
            if (this.memnum>=0) this.disp1.setvalue(this.memnum+1);
            else this.disp1.sethyphen();
        }
    },
    updatepatchname: function() {
        var name="Patch Name:  "+this.param.name;
        document.getElementById("patchname").innerHTML=name;
    },
    updateall: function() {
        this.update("dco16");
        this.update("dco8");
        this.update("dco4");
        this.update("dcosqr");
        this.update("dcosaw");
        this.update("pad1");
        this.update("pad9");
        this.update("chorus1");
        this.update("manual");
        this.update("lforate");
        this.update("lfodelay");
        this.update("dcolfo");
        this.update("dcopwm");
        this.update("dcosub");
        this.update("dconoise");
        this.update("hpffreq");
        this.update("vcffreq");
        this.update("vcfreso");
        this.update("vcfenv");
        this.update("vcflfo");
        this.update("vcfkybd");
        this.update("vcalevel");
        this.update("attack");
        this.update("decay");
        this.update("sustain");
        this.update("release");
        this.update("pwmsrc");
        this.update("vcfenvmode");
        this.update("vcaenvmode");
        this.update("dlylev");
        this.update("dlytim");
        this.update("dlyfb");
        this.update("portasw");
        this.update("portatim");
        this.update("asgnmode");
        this.update("bendrange");
        this.updatedisp();
        this.updatepatchname();
    }
}