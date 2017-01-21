$().ready(function () {

	$('header').hide();
	$('main').hide();
	
	engine.getUsersData();

	$('.nav-item').click(function(e){
		$('.navbar li.active').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
	})

	$('#all').click(function(e){
		e.preventDefault();
		$('.user-online').show();
		$('.user-offline').show();
		$('.user-unavailable').show();
	});
	
	$('#online').click(function(e){
		e.preventDefault();
		$('.user-offline').hide();
		$('.user-unavailable').hide();
		$('.user-online').show();
		
	});

	$('#offline').click(function(e) {
		e.preventDefault();
		$('.user-online').hide();
		$('.user-unavailable').hide();
		$('.user-offline').show();
	});
  	$(document).bind('keypress', pressed);
	
	$('#searchUser').click( function(e) {
		e.preventDefault();
		var searchValue = $("#searchValue").val();
		engine.getUsersData(searchValue);
		$('.user-online').hide();
		$('.user-offline').hide();
		$('.user-unavailable').hide();
	});
	
});
function pressed(e)
{
    if(e.keyCode === 13)
    {
       engine.getUsersData($("#searchUser").val());
	   	$('.user-online').hide();
		$('.user-offline').hide();
		$('.user-unavailable').hide();
    }
}