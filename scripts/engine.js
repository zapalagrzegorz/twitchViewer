
var engine = {
	dataJSON: [],
	// currentPage: 0,
	self: this,

	users: ['freecodecamp', 'esl_sc2', '123'],// array of users and their channels

	// app makes request to Twitch API
	getUsersData: function (event) {
		var self = this;

		// pick value from input form
		// var search = $("#twitch-search").val();

		getStreamsData();

		//handle multiple parallel ajax requests
		function getStreamsData() {
			var promises = [];
			for (var i = 0, l = self.users.length; i < l; i++) {
				var promise = ajaxRequestStream(self.users[i]);
				promises.push(promise);
			}
			// when deals when all of calls have finished
			// apply enables array where singular arguments neededs
			// first argument is as it is, for 'apply' reasons
			$.when.apply($, promises)
				.done(handleSuccessStreams);
		}

		// create single ajax requests for each user
		function ajaxRequestStream(user) {
			return $.ajax({
				type: 'get',
				url: 'https://wind-bow.gomix.me/twitch-api/streams/' + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}

		// 
		function handleSuccessStreams() {
			var responses = arguments;
			var promises = [];
			for (var i in responses) {
				if (responses[i][0].stream === null) {
					// queue calls for all users which are not streaming
					promises.push(ajaxRequestUsers(self.users[i]));
				}
				else {
					// showStreamData(responses[i][0].stream);
				}
			}
			// make AJAX calls if there're any
			if (promises.length !== 0) {
				getUsersData(promises);
			}
		}

		function handleError(jqXHR, error, errorThrown) {
			console.log(jqXHR, error, errorThrown);
			// $('main').html(<div class="error">Something went wrong</div>);    
		}

		// For users' not streaming do multiple parallel ajax requests
		// @promises array of ajaxRequestUsers
		function getUsersData(promises) {
			$.when.apply($, promises)
				.done(handleSuccessUsers);

			// gdy zwróci dane użytkowników, trzeba wywołać żadanie o chanell'ach  które są dostępne
			// i odroczyć dane do czasu wykonania żadania
		}
		function ajaxRequestUsers(user) {
			return $.ajax({
				type: 'get',
				url: 'https://wind-bow.gomix.me/twitch-api/users/' + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}

		function handleSuccessUsers() {
			var usersData = [];
			var promisesChannels = [];
			var responses = arguments;
			for (var i in responses) {
				if (responses[i][0].hasOwnProperty('error')) {
					console.log(responses[i][0]);
					// wyświetl, że użytkownika nie ma
					// showUknownUserData()
				}
				else {
					// user not streaming exists 
					// collect all users to get their channel data, needs another AJAX call
					console.log(responses[i][0]);
					var user = {};
					user.bio = responses[i][0].bio;
					user.created_at = responses[i][0].created_at;
					user.logo = responses[i][0].logo;
					user.display_name = responses[i][0].display_name;
					usersData.push(user);

					promisesChannels.push(ajaxRequestChannels(responses[i][0].name));
					// pobierz dla niego dane z channel
					// promisesChannels.push(ajaxRequestChannel(responses[i][0].name));
				}
			}
			if (promisesChannels.length !== 0) {
				getChannelsData(promisesChannels, usersData);
			}
		}
		function ajaxRequestChannels(user) {
			return $.ajax({
				type: 'get',
				url: 'https://wind-bow.gomix.me/twitch-api/channels/' + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}
		function getChannelsData(promises, usersData) {
			$.when.apply($, promises)
				// jak przekazać tablice usersdata do funkcji pararametru .done !!!
				.done(function () {
					var responses = arguments;
					for (var i in responses) {
						console.log(responses[i][0]);
						// var user = {};
						// user.bio = responses[i][0].bio;
						// users.created_at = responses[i][0].created_at;
						// users.logo = responses[i][0].logo;
						// users.dispaly_name = responses[i][0].dispaly_name;
						// usersData.push(user);

						// promisesChannels.push(ajaxRequestChannels(self.users[i]));
						// pobierz dla niego dane z channel
						// promisesChannels.push(ajaxRequestChannel(responses[i][0].name));
					}
				});
		}

		// receives object from Twitch API
		// produces HTML output for stream object
		// function showStreamData(streamData){
		// 	console.log(streamData);
		// 	userChannelData = {};
		// 	var stream = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel">' +
		// 					'<div class="channelPreview"><i class="fa fa-3x fa-play icon-play" aria-hidden="true"></i>' +
		// 						'<div class="darken"><img class="img" src="'+ streamData.preview.large  +'"></div>' +
		// 					'</div>' +
		// 						'<div class="channelDescription">' +
		// 							'<h3><a href="https://www.twitch.tv/game/' + streamData.channel.game + '">'+ streamData.channel.game +'</a></h3>' +
		// 							'<div class="row">' +
		// 								'<div class="col-10">' +
		// 									'<h4><a href="' + streamData.channel.url + '">'+ streamData.channel.status +'</a></h4>' +
		// 								'</div>' +
		// 								'<div class="col-2" style="text-align: center">' +
		// 									'<i class="fa fa-2x fa-user-circle" aria-hidden="true"></i>' +
		// 									'<p>' + streamData.viewers +' online</p>' +
		// 								'</div>' +
		// 							'</div>' +
		// 							'<div class="row">' +
		// 								'<div class="col-2" style="padding-right:0;">' +
		// 									'<a href="' + streamData.channel.url + '">' +
		// 										'<img class="img" src="'+ streamData.channel.logo + '">' +
		// 									'</a>' +
		// 								'</div>' +
		// 							'<div class="col-10">' +
		// 								'<p><a href="' + streamData.channel.url + '">' + streamData.channel.display_name + '</a></p>' +
		// 								'<p>followers: ' + streamData.channel.followers +'</p>' +
		// 								'<p>Launched: ' + (streamData.channel.created_at).substring(0,10) + '</p>' +
		// 							'</div>' +
		// 						'</div>' +
		// 					'</div>' +
		// 				'</article>';
		// 	$('#streamContent').append(stream);
		// }
		function showUserData(streamData) {
			console.log(streamData);
			// var userChannelData = {};
			// // to wywołanie dopiero jest zakolejkowane - musi być przeniesione do 
			// $.ajax({
			// 	type: "get",
			// 	url: "https://wind-bow.gomix.me/twitch-api/users/" + streamData.name,
			// 	headers: {
			// 		Accept: 'application/vnd.twitchtv.v3+json'
			// 	},
			// 	success: function (data) {
			// 		console.log(data);
			// 		userChannelData.profile_banner = data.profile_banner;
			// 		userChannelData.followers = data.followers;
			// 		// userChannelData.push(data) 
			// 	}
			// });	
			// console.log(userChannelData);
			// var stream = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel">' +
			// 				'<div class="channelPreview">' +
			// 					'<img class="img" src="'+userChannelData.profile_banner+'">' +
			// 				'</div>' +
			// 					'<div class="channelDescription">' +
			// 					// tu by można wrzucić jeszcze jedno zawołanie dla celów zdjecia offline
			// 						'<h3><a href="https://www.twitch.tv/' + streamData.name + '">'+ streamData.name +'</a></h3>' +
			// 						'<div class="row">' +
			// 							'<div class="col-12">' +
			// 								'<p class="user-bio">' + streamData.bio.substring(0,146) +'...</p>' +
			// 							'</div>' +
			// 						'</div>' +
			// 						'<div class="row">' +
			// 							'<div class="col-2" style="padding-right:0;">' +
			// 								'<a href="https://www.twitch.tv/' + streamData.name + '">' +
			// 									'<img class="img" src="'+ streamData.logo + '">' +
			// 								'</a>' +
			// 							'</div>' +
			// 						'<div class="col-10">' + +
			// 							'<p>followers: ' + userChannelData.profile_banner + '</p>' +
			// 							'<p>Launched: ' + (streamData.created_at).substring(0,10) + '</p>' +
			// 						'</div>' +
			// 					'</div>' +
			// 				'</div>' +
			// 			'</article>';
			// $('#streamContent').append(stream);
		}
	}
};