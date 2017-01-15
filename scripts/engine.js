
var engine = {
	dataJSON: [],
	// currentPage: 0,
	self: this,
	
	users: ['freecodecamp', '1'],// array of users and their channels

	// app makes request to Twitch API
	getData: function (event) {
		var self = this;
		
		// pick value from input form
		var search = $("#twitch-search").val();
		
		// clear page data if no entry is given
		var url = "esl_sc2";
		
		// jQuery call to Twitch API
		var streams = {
			type: "get",
			url: "https://wind-bow.gomix.me/twitch-api/streams/esl_sc2",
			headers: {
				Accept: 'application/vnd.twitchtv.v3+json'
			}
		};
		var streams2 = {
			type: "get",
			url: "https://wind-bow.gomix.me/twitch-api/streams/freecodecamp",
			headers: {
				Accept: 'application/vnd.twitchtv.v3+json'
			}
		};
		var bool = 0;
		
		function setAjaxData(element) {
			if(bool == 0){
				bool = 1;
				return $.ajax(streams);
			}
			else{
				return $.ajax(streams2);
			}
		};
		var arrayOfAjax = []
		arrayOfAjax.push(streams, streams2)	;

		$.when.apply($, arrayOfAjax).done(
			// self.dataJSON = [];
			// var length = data.query.search.length;
			// for (var i = 0; i < length; i++) {
			// 	if (i % 10 === 0) {
			// 		var arr = [];
			// 	}
			// 	// bez tego mamy tylko jeden obiekt
			// 	var obj = {}; 
			// 	obj.title = data.query.search[i].title;
			// 	obj.snippet = data.query.search[i].snippet;
			// 	arr.push(obj);
			// 	if (i % 10 === 0) {
			// 		self.dataJSON.push(arr);
				// }
			// }
				fillCountryCapitals)
				// function(data, data1) {
    			// alert( "success" );
				// console.log(data)
				// console.log(data1)
  			// },
			//   	function(data, data1){
			// 	console.log("failure");
			//   }
			//   );
	function fillCountryCapitals (){
		var countries = [];
        var responses = arguments;
        for(i in responses){
            console.log(responses[i]);
            // countries.push(responses[i][0][0].nativeName)
        }  
        // $('#countries').text(countries);
	}
	},
			// 		$.get( "test.php" ).then(
		//   function() {
		//     alert( "$.get succeeded" );
		//   }, function() {
		//     alert( "$.get failed!" );
		//   }
		// );

	// Random button
	getRandomData: function () {
		var self = this;
		var url = "http://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&origin=*";
		$.getJSON(url, function (data) {
			console.log(data);
			console.log('random');
			self.dataJSON = [];
			var length = 1;
			var arr = [];
			var obj = {};
			obj.title = data.query.random[0].title;
			obj.snippet = "Random wiki title";
			arr.push(obj);
			self.dataJSON.push(arr);
			self.showData();
		})
			.fail(function() {
    			console.log( "error" );
  			});
	},

	// presents data on page
	showData: function () {
		var numPages = engine.dataJSON.length
		setPagination(numPages);
		setQueryResults(0);

		// sets pagination, numPages: number
		function setPagination(numPages) {

			// setup HTML
			var navigation = '<nav aria-label="Page navigation">' +
				'<ul class="pagination">' +
				'<li class="page-item">' +
				'<a class="page-link previousPage" href="#" aria-label="Previous" data-pagenum="-1">' +
				'<span aria-hidden="true">&laquo;</span>' +
				'<span class="sr-only">Previous</span>' +
				'</a>' +
				'</li>';
			for (var i = 0; i < numPages; i++) {
				navigation += '<li class="page-item"><a class="page-link" data-pagenum="' + i + '" href="#">' + (i + 1) + '</a></li>';
			}
			navigation += '<li class="page-item">' +
				'<a class="page-link" href="#" aria-label="Next" data-pagenum="++">' +
				'<span aria-hidden="true">&raquo;</span>' +
				'<span class="sr-only">Next</span>' +
				'</a>'
			'</li>'
			'</ul>'
			'</nav>';

			$('.nav').html(navigation);

			// setup JS event handler
			$('a.page-link').click(function (event) {
				event.preventDefault();	
				var pageNum = $(this).data('pagenum');
				if (pageNum === -1 && (self.currentPage - 1) >= 0) {
					setQueryResults(self.currentPage - 1);
				}
				else if (pageNum == "++" && (self.currentPage < numPages-1)) {
					setQueryResults(self.currentPage+1);
				}
				else if (pageNum > 0) {
					setQueryResults(pageNum);
				}
				else {
					return false;
				}
			});
		}

		// sets results
		function setQueryResults(pageNum) {
			this.currentPage = pageNum;
			$('#results').html('');
			engine.dataJSON[pageNum].forEach(function (item) {
				var result = $('<div class="wiki-results default-primary-color">').html('<a class="text-primary-color" href="https://en.wikipedia.org/wiki/' + item.title + '" target="_blank"><div class="wiki-header"><h2>' + item.title + '</h2></a></div><p class="wiki-extract">' + item.snippet + '...' + '</p>');
				$('#results').append(result);
			});
		}
	},
	// clears page
	clear: function(){
		$('.nav').html('');
		$('#results').html('');
	}

}