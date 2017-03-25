$().ready(function () {
	
  // $(document).bind('keypress',pressed);
	$('#all').click(function(e){
		$('.navbar li.active').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
		$('.user-online').show();
		$('.user-offline').show();
		$('.user-unavailable').show();
	});
	
	$('#online').click(function(e){
		$('.navbar li.active').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
		$('.user-offline').hide();
		$('.user-unavailable').hide();
		$('.user-online').show();
		
	});

	$('#offline').click(function(e){
		$('.navbar li.active').removeClass('active');
		var $this = $(this);
		if (!$this.hasClass('active')) {
			$this.addClass('active');
		}
		e.preventDefault();
		$('.user-online').hide();
		$('.user-unavailable').hide();
		$('.user-offline').show();
	});
	engine.getUsersData();
});

// function pressed(e)
// {
// 	if(e.keyCode === 13)
//   {
// 		engine.getUsersData();
// 	}
// }