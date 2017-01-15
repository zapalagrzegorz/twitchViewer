$().ready(function () {
	// $('#wiki-search-button').click($.proxy(engine.getData, engine));
  // $('#wiki-search-random').click($.proxy(engine.getRandomData, engine))
  // $(document).bind('keypress',pressed);
  engine.getUsersData();
});

function pressed(e)
{
    if(e.keyCode === 13)
    {
       engine.getUsersData();
    }
}