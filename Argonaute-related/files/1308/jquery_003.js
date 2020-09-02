/*
jQuery.fn.stripTags = function() 
//{ return this.replaceWith( this.html().replace(/<\/?[^>]+>/gi, '') ); };
{ return this.replaceWith( this.html().replace(<(?!\/?a(?=>|\\s.*>))\/?.*?>/gi, '') ); };
$(".descriptionitem").stripTags();
*/



var timeout    = 500;
var closetimer = 0;
var ddmenuitem = 0;
var buttonselected = 0;

function menu_open()
{  
	menu_canceltimer();
   menu_close();
   
   var $searchoptioncontainingdiv =  $(this).parents(".searchoptions");
   
   ddmenuitem = $searchoptioncontainingdiv.find('ul').removeClass('hidden');
   buttonselected = $searchoptioncontainingdiv.find('a.searchoptionsbutton').addClass('selected');
   
}

function menu_close()
{  if(ddmenuitem) ddmenuitem.addClass('hidden');
   if(buttonselected) buttonselected.removeClass('selected');
}

function menu_timer()
{  
	closetimer = window.setTimeout(menu_close, timeout);
	}

function menu_canceltimer()
{  if(closetimer)
   {  window.clearTimeout(closetimer);
      closetimer = null;}}

$(document).ready(function(){  
	$(".submitVpubForm").click(function() {
		$("#addArticleToVPub").empty().append($(this).parents(".VpubFormContainer").find(".appendArticleToVPubForm")).submit();
	});
	
	/*$(".searchoptionsbutton").mouseover(function(){ 
		menu_open
	});*/
	
	$('.searchoptionsbutton').bind('mouseover', menu_open)
	$('.searchoptionmenu').bind('mouseover', menu_open)
	$('.searchoptionsbutton').bind('mouseout', menu_timer)
	$('.searchoptionmenu').bind('mouseout', menu_timer) 
	
});

document.onclick = menu_close;
