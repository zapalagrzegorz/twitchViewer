$().ready(function () {
	$('#wiki-search-button').click($.proxy(engine.getData, engine));
  $('#wiki-search-random').click($.proxy(engine.getRandomData, engine))
  $(document).bind('keypress',pressed);
  engine.getData();
});

function pressed(e)
{
    if(e.keyCode === 13)
    {
       engine.getData();
    }
}