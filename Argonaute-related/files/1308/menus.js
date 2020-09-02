activateMenu = function(nav) {
	if (document.all && document.getElementById(nav).currentStyle) {  
        var navroot = document.getElementById(nav);
        var lis=navroot.getElementsByTagName("LI");  
        for (i=0; i<lis.length; i++) {
        	if(lis[i].lastChild.tagName=="UL"){
             		lis[i].onmouseover=function() {	
                	   	this.lastChild.style.display="block";
                		}
                		lis[i].onmouseout=function() {                       
                   		this.lastChild.style.display="none";
                		}
            		}
        	}
    	}
}
addLoadEvent(function() {
	activateMenu('nav');
	activateMenu('help-menu');
});
