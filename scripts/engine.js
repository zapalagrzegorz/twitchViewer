
var engine = {
	dataJSON: [],
	// currentPage: 0,
	self: this,

	users: ['freecodecamp', 'esl_sc2', '123'],// array of users and their channels

	// app makes request to Twitch API
	getUsersData: function (event) {
		var self = this;

		// pick value from input form
		var search = $("#twitch-search").val();

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
				type: "get",
				url: "https://wind-bow.gomix.me/twitch-api/streams/" + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}

		// 
		function handleSuccessStreams() {
			var responses = arguments;
			var promises = [];
			for (i in responses) {
				if (responses[i][0].stream === null) {
					// collect all users which are not streaming
					promises.push(ajaxRequestUsers(self.users[i]));
				}
				else {
					showStreamData(responses[i]);
				}
			}
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
		}
		function ajaxRequestUsers(user) {
			return $.ajax({
				type: "get",
				url: "https://wind-bow.gomix.me/twitch-api/users/" + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				},
				success: function (response) {
					console.log(response);
				},
				error: function (response) {
					console.log("Error")
				}
			});
		}
		function handleSuccessUsers() {
			var responses = arguments;
			for (i in responses) {
				console.log(responses[i]);
			}
		}

		// receives object from Twitch API
		// produces HTML output 
		function showStreamData(stream){
			var streamData = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel">' +
								'<div class="channelPreview"><img class="img" src="' + https:static-cdn.jtvnw.net/previews-ttv/live_user_esl_sc2-640x360.jpg  + '"></div>' +
								'<div class="channelDescription">' +
									'<h3><a href="' + https:www.twitch.tv/directory/game/StarCraft%20II '">' + +'</a></h3>' +
									'<div class="row">' +
										'<div class="col-10">' +
											'<h4><a href="' + https:www.twitch.tv/esl_sc2 + '">' + +'</a></h4>' +
										'</div>' +
										'<div class="col-2" style="text-align: center">' +
											'<i class="fa fa-2x fa-user-circle" aria-hidden="true"></i>'
											'<p>' + +  'online</p>' +
										'</div>' +
									'</div>' +
									'<div class="row">' +
									'<div class="col-2" style="padding-right:0;">' +
										'<a href="https://www.twitch.tv/esl_sc2">
											'<img class="img" src="https://static-cdn.jtvnw.net/jtv_user_pictures/esl_sc2-profile_image-d6db9488cec97125-300x300.jpeg">' +
										'</a>' +
									'</div>' +
									'<div class="col-10">' +
										'<p><a href="' + '">' + + '</a></p>' +
										'<p>followers' + 141604 + '</p>' +
										'<p>Launched: + ' + 2017-01-14 + '</p>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</article>';
			$(find).append(streamData)
		}
	}
}