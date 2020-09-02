// Set name of parent window so it can be referred back to
window.name = "topdog";

// Set global variable newWindow so it can be referred to by other functions
var newWindow; 

function popup(file_path, win_name, win_width, win_height) {
   newWindow = window.open("",win_name,"toolbar=no,directories=no,menubar=no,scrollbars=yes,width=" + win_width + ",height=" + win_height + ",left=10,top=10,resizable=yes");
   newWindow.opener = null;	// IC-2383
   newWindow.location = file_path;
   newWindow.focus();
}
function popupWord(file_path, win_name, win_width, win_height) {
   newWindow = window.open("",win_name,"toolbar=yes,directories=no,menubar=no,scrollbars=yes,width=" + win_width + ",height=" + win_height + ",left=10,top=10,resizable=yes");
   newWindow.opener = null;	// IC-2383
   newWindow.location = file_path;
   newWindow.focus();
}
function popupMenubar(file_path, win_name, win_width, win_height) {
   newWindow = window.open("",win_name,"toolbar=no,directories=no,menubar=yes,scrollbars=yes,width=" + win_width + ",height=" + win_height + ",left=10,top=10,resizable=yes");
   newWindow.opener = null;	// IC-2383
   newWindow.location = file_path;
   newWindow.focus();
}
function popupBothBars(file_path, win_name, win_width, win_height) {
   newWindow = window.open("",win_name,"toolbar=yes,directories=no,menubar=yes,scrollbars=yes,width=" + win_width + ",height=" + win_height + ",left=10,top=10,resizable=yes");
   newWindow.opener = null;	// IC-2383
   newWindow.location = file_path;
   newWindow.focus();
}
function popupBothBarsPrint(file_path, win_name, win_width, win_height) {
   newWindow = window.open("",win_name,"toolbar=yes,directories=no,menubar=yes,scrollbars=yes,width=" + win_width + ",height=" + win_height + ",left=10,top=10,resizable=yes");
   newWindow.opener = null;	// IC-2383
   newWindow.location = file_path;
   newWindow.focus();
   newWindow.print();
}
function Help(fname) {
   var w = window.open('','HELP', 'scrollbars,resizable=no,width=566,height=400');
   w.opener = null;	// IC-2383
   w.location = fname;
}
function HelpWithbar(fname) {
   var w = window.open('','HELP', 'scrollbars,toolbar=yes,resizable=no,width=566,height=400');
   w.opener = null;	// IC-2383
   w.location = fname;
}
function LostPassword(fname) {
   var w = window.open('','HELP', 'scrollbars=no,resizable=no,width=380,height=360');
   w.opener = null;	// IC-2383
   w.location = fname;
}
function showOrder(fname) {
   var w = window.open('','HELP', 'menubar,scrollbars,resizable=no,width=566,height=600');
   w.opener = null;	// IC-2383
   w.location = fname;
}
