
////////////////////////////
$(function() {
	$('#purchaseexpand')/*.find('div.collapse').hide().end()*/
	.find('span.expand').wrapInner('<a href="#expand/collapse" title="Expand/Collapse" />');
	
	$('#moredetails').find('ul.collapse').hide().end()
	.find('span.expand').wrapInner('<a href="#expand/collapse" title="Expand/Collapse" />');
	
	$('#moreLikeThis').find('ul.collapse').hide().end()
	.find('span.expand').wrapInner('<a href="#expand/collapse" title="Expand/Collapse" />');

    $('span.expand').click(function() {
        $(this).toggleClass('open')
        .next('.collapse.normal').slideToggle('slow').end()
        .next('.collapse.slow').slideToggle('slow','linear');
    });
});

