
var engine = {
	dataJSON: [],
	// currentPage: 0,
	self: this,

	users: ['polskiestrumyki', 'ESL_SC2', 'OgamingSC2', 'cretetion', 'freecodecamp', 'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas', '123', 'kubon', 'Bananasaurus_Rex'],// array of users and their channels

	// app makes request to Twitch API
	getUsersData: function (event) {
		$('header').hide();
		$('main').hide();
		$('body').prepend('<div class="loading"><img class="imgCenter" src="css/assets/loading.gif"></div>');
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
					showStreamingUsers(responses[i][0].stream);
				}
			}
			// make AJAX calls if there're any
			if (promises.length !== 0) {
				getUsersNotStr(promises);
			}
		}

		function handleError(jqXHR, error, errorThrown) {
			console.log(jqXHR, error, errorThrown);
			// $('main').html(<div class="error">Something went wrong</div>);    
		}

		// For users' not streaming do multiple parallel ajax requests
		// @promises array of ajaxRequestUsers
		function getUsersNotStr(promises) {
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
					showUnkownUsers(responses[i][0]);
				}
				else {
					// user not streaming exists 
					// collect all users to get their channel data, needs another AJAX call
					console.log(responses[i][0]);
					var user = {};
					user.bio = (responses[i][0].bio === null ? 'No bio available' : responses[i][0].bio.substring(0,140).concat('...'));
					user.created_at = responses[i][0].created_at;
					user.logo = (responses[i][0].logo === null ? 'css/assets/Glitch.png' : responses[i][0].logo);
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
		// @usersData array
		function getChannelsData(promises, usersData) {
			$.when.apply($, promises)
				// jak przekazać tablice usersdata do funkcji pararametru .done !!!
				.done(function () {
					var responses = arguments;
					for (var i in responses) {
						usersData[i].profile_banner = (responses[i][0].video_banner === null ? 'css/assets/profileLarge.png' : responses[i][0].video_banner);
						usersData[i].followers = responses[i][0].followers;
						usersData[i].status = (responses[i][0].status === null ? 'no status' : responses[i][0].status);
						if(usersData[i].status.length > 44){
							usersData[i].status = responses[i][0].status.substring(0,44).concat('...');
						}
					}
					showUsersNotStreaming(usersData);
				});
		}

		/***************************************
		* Functions producing output for different users 
		*
		* *****************************************************/
		function showStreamingUsers(user){
			if (Array.isArray(user) ){
				var content = user.forEach(produceOutput);
				$('#streamContent').append(content);
			}
			else{
				produceOutput(user);
				$('#streamContent').append(produceOutput(user));
			}

			function produceOutput(user) {
				var userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-online">' +
								'<div class="channelPreview">' +
									'<img class="img" src="'+user.preview.large+'">' +
								'</div>' +
									'<div class="channelDescription">' +
										'<h3><a href="https://www.twitch.tv/' + user.game + '">'+ user.game +'</a></h3>' +
										'<div class="row">' +
											'<div class="col-10">' +
												'<h4><a href="https://www.twitch.tv/' + user.channel.name + '">'+ user.channel.status +'</a></h4> ' +
											'</div>' +
											'<div class="col-2" style="text-align: center">' +
												'<p><span id="#online">'+ user.viewers +'</span> online</p>' +
											'</div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="col-2" style="padding-right:0;">' +
												'<a href="https://www.twitch.tv/' + user.channel.name + '">' +
													'<img class="img" src="'+ user.channel.logo + '">' +
												'</a>' +
											'</div>' +
										'<div class="col-10">' +
											'<p>followers: ' + user.channel.followers + '</p>' +
											'<p>Launched: ' + (user.created_at).substring(0,10) + '</p>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</article>';
				return userHTML;
			}
		}

		function showUsersNotStreaming(user) {
			for(var i in user){
				var userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-offline">' +
								'<div class="channelPreview">' +
									'<img class="img" src="'+user[i].profile_banner+'">' +
								'</div>' +
									'<div class="channelDescription">' +
										'<h3><a href="https://www.twitch.tv/' + user[i].display_name + '">'+ user[i].display_name +'</a></h3>' +
										'<div class="row">' +
											'<div class="col-12">' +
												'<p class="user-bio">' + user[i].bio +'</p>' +
											'</div>' +
										'</div>' +
										'<div class="row">' +
											'<div class="col-2" style="padding-right:0;">' +
												'<a href="https://www.twitch.tv/' + user[i].display_name + '">' +
													'<img class="img" src="'+ user[i].logo + '">' +
												'</a>' +
											'</div>' +
										'<div class="col-10">' +
											'<p>last status: ' + user[i].status +'</p>' +
											'<p>followers: ' + user[i].followers + '</p>' +
											'<p>Launched: ' + (user[i].created_at).substring(0,10) + '</p>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</article>';
				$('#streamContent').append(userHTML);
			}			
			$('.loading').hide();
			$('header').show();
			$('main').show();
		}
		function showUnkownUsers(user) {
			console.log(user);
			var userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-unavailable">' +
				'<div class="channelPreview">' +
					'<img class="img" src="css/assets/nostream.gif">' +
				'</div>' +
				'<div class="channelDescription">' +
					'<h3>' + user.message + ' or does not exist</h3>' +
				'</div>' +
			'</article>';
			$('#streamContent').append(userHTML);
		}
	}
};