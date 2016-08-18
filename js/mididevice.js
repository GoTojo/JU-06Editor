// WebMIDI main
// Copyright 2015 gotojo All Rights Reserved. 
var midiAccess = null;
var output = null;

function listInputsAndOutputs(access) {
	if (typeof midiAccess.inputs === "function") {
		var inputs = midiAccess.inputs();	
		var outputs = midiAccess.outputs();		
	} else {
       var inputIterator = midiAccess.inputs.values();
        inputs = [];
        for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
            inputs.push(o.value)
        }
        var outputIterator = midiAccess.outputs.values();
        outputs = [];
        for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
            outputs.push(o.value)
        }
	}

	for (var i = 0; i < inputs.length; i++) {
		var option = document.createElement("option");

		option.setAttribute("value", "midiInput");
		option.appendChild(document.createTextNode(inputs[i].name));
		var select=document.getElementById("midiInputSelect");
		if (select) select.appendChild(option);
		//console.log('input['+i+']:'+inputs[i].name);
	}

	for (var i = 0; i < outputs.length; i++) {
		var option = document.createElement("option");
		option.setAttribute("value", "midiOuput");
		option.appendChild(document.createTextNode(outputs[i].name));
		var select=document.getElementById("midiOutputSelect");
		if (select) select.appendChild(option);
		//console.log('output['+i+']:'+outputs[i].name);
	}
};

function onMIDISuccess(access) {
	midiAccess = access;
	//console.log("midi ready!");
	listInputsAndOutputs(access);
};

function onMIDIFailure(msg) {
	alert("Failed to midi available- " + msg);
};

function selectMidiInput() {
	var select = document.getElementById("midiInputSelect");
	var options = document.getElementById("midiInputSelect").options;
	var value = options.item(select.selectedIndex).value;
	if (select.selectedIndex==0) return;
	if (typeof midiAccess.inputs === "function") {
		var inputs = midiAccess.inputs();	
		var outputs = midiAccess.outputs();		
	} else {
       var inputIterator = midiAccess.inputs.values();
        inputs = [];
        for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
            inputs.push(o.value)
        }
        var outputIterator = midiAccess.outputs.values();
        outputs = [];
        for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
            outputs.push(o.value)
        }
	}

	try { 
		var input = inputs[select.selectedIndex-1];
		input.onmidimessage = onMIDIMessage;
	} catch (e) {
		alert("Exception! Couldn't get i/o ports." + e );
	}
};

function selectMidiOutput() {
	var select = document.getElementById("midiOutputSelect");
	var options = document.getElementById("midiOutputSelect").options;
	var value = options.item(select.selectedIndex).value;
	if (select.selectedIndex==0) return;
	if (typeof midiAccess.inputs === "function") {
		var inputs = midiAccess.inputs();	
		var outputs = midiAccess.outputs();		
	} else {
       var inputIterator = midiAccess.inputs.values();
        inputs = [];
        for (var o = inputIterator.next(); !o.done; o = inputIterator.next()) {
            inputs.push(o.value)
        }
        var outputIterator = midiAccess.outputs.values();
        outputs = [];
        for (var o = outputIterator.next(); !o.done; o = outputIterator.next()) {
            outputs.push(o.value)
        }
	}
	try { 
		output = outputs[select.selectedIndex-1];
		console.log('output('+output.name+')is selected')
	} catch (e) {
		alert("Exception! Couldn't get i/o ports." + e );
	}
};
