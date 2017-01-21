$().ready(function () {

	$('header').hide();
	$('main').hide();
	
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

	$('#offline').click(function(e){
		e.preventDefault();
		$('.user-online').hide();
		$('.user-unavailable').hide();
		$('.user-offline').show();
	});
	engine.getUsersData();
});