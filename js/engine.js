
var engine = {
	self: this,
	users: ['soushibo', 'streamerhouse', 'Bananasaurus_Rex', 'freecodecamp','polskiestrumyki', 'ESL_SC2', 'cretetion',  'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas', '123', 'kubon', ],// array of users and their channels

	// app makes request to Twitch API
	getUsersData: function () {
		var self = this;

		getStreamsData();

		//handle multiple parallel ajax requests
		function getStreamsData() {
			var promises = [];
			for (var i = 0, l = self.users.length; i < l; i++) {
				var promise = ajaxRequest('streams', self.users[i]);
				promises.push(promise);
			}
			// when deals when all of calls have finished
			// apply enables array where singular arguments neededs
			// first argument is as it is, for 'apply' reasons
			$.when.apply($, promises)
				.done(handleSuccessStreams);
		}
		
		// create single ajax requests for each user
		function ajaxRequest(call, user) {
			return $.ajax({
				type: 'get',
				url: 'https://wind-bow.gomix.me/twitch-api/' + call + '/' + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}

		function handleSuccessStreams() {
			var responses = arguments;
			var promises = [];
			var userStreams = [];
			for (var i in responses) {
				if (responses[i][0].stream === null) {
					
					// queue calls for all users which are not streaming
					promises.push(ajaxRequest('users', self.users[i]));
				}
				else {
					userStreams.push(responses[i][0].stream);
				}
			}
			produceOutput('stream', userStreams);
			// make AJAX calls if there're any
			// For users' not streaming do multiple parallel ajax requests
			if (promises.length !== 0) {
				$.when.apply($, promises)
					.done(handleSuccessUsers);
			}
		}

		function handleSuccessUsers() {
			var usersData = [];
			var promisesChannels = [];
			var responses = arguments;
			for (var i in responses) {
				if (responses[i][0].hasOwnProperty('error')) {
					// show uknown users
					showUnkownUsers(responses[i][0]);
				}
				else {
					// user exists, not streaming 
					// collect also their channel data - needs another AJAX call
					console.log(responses[i][0]);
					var user = {};
					user.bio = (responses[i][0].bio === null ? 'No bio available' : responses[i][0].bio.substring(0,140).concat('...'));
					user.created_at = responses[i][0].created_at;
					user.logo = (responses[i][0].logo === null ? 'css/assets/Glitch.png' : responses[i][0].logo);
					user.display_name = responses[i][0].display_name;
					usersData.push(user);

					promisesChannels.push(ajaxRequest('channels', responses[i][0].name));
					// pobierz dla niego dane z channel
					// promisesChannels.push(ajaxRequestChannel(responses[i][0].name));
				}
			}
			if (promisesChannels.length !== 0) {
				getChannelsData(promisesChannels, usersData);
			}
		}


		// @usersData array
		function getChannelsData(promises, usersData) {
			$.when.apply($, promises)
				// how to pass array "usersData' to as parameter to .done?
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
					produceOutput('nostreaming', usersData);
				});
			$('.loading').hide();
			$('header').show();
			$('main').show();
		}

		/***************************************
		* Functions producing output for different users 
		*
		* *****************************************************/

		function produceOutput(typeOfUser, user) {
			for(var i in user){
				var pic;
				var mainDesc;
				var name;
				var status;
				var viewers;
				var logo;
				var followers;
				var launchedAt;
				if(typeOfUser === 'stream'){
					pic = user[i].preview.large;
					mainDesc = user[i].game;
					name = user[i].channel.name;
					status = user[i].channel.status;
					viewers = user[i].viewers;
					logo = user[i].channel.logo;
					followers = user[i].channel.followers;
					launchedAt = (user[i].created_at).substring(0,10);
				}
				else if (typeOfUser === 'nostreaming') {
					pic = user[i].profile_banner;
					mainDesc = user[i].display_name;
					logo = user[i].logo;
					followers = user[i].followers;
					launchedAt = user[i].created_at;


				}

				var userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-online"><div class="channelPreview">' +
									'<img class="img" src="'+ pic +'"></div>' +
								'<div class="channelDescription">' +
									'<h3><a href="https://www.twitch.tv/' + mainDesc + '">'+ mainDesc +'</a></h3>';
				
				if(typeOfUser === 'stream') {
					userHTML +=	'<div class="row"><div class="col-10">' +
										'<h4><a href="https://www.twitch.tv/' + name + '">'+ status +'</a></h4></div>' +
									'<div class="col-2" style="text-align: center">' +
										'<p><span id="#online">'+ viewers +'</span> online</p></div></div>';
				}
				else if(typeOfUser === 'nostreaming'){
					userHTML += '<div class="row"><div class="col-12">' +
									'<p class="user-bio">' + user[i].bio +'</p></div></div>';
				}

				userHTML += '<div class="row"><div class="col-2" style="padding-right:0;">' +
								'<a href="https://www.twitch.tv/' + mainDesc + '">' +
									'<img class="img" src="'+ logo + '"></a></div>' +
							'<div class="col-10" id="lastStatus' + mainDesc +'">' +
								'<p>followers: ' + followers + '</p>' +
								'<p>Launched: ' + launchedAt + '</p>' +
							'</div></div></div></article>';
				$('#streamContent').append(userHTML);
				
				if(typeOfUser === 'nostreaming'){
					var lastStatus = '<p>Last status: '+ user[i].status + '</p>';
					$('#lastStatus' + mainDesc).prepend(lastStatus);
				}
			}
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
		// function handleError(jqXHR, error, errorThrown) {
		// 	console.log(jqXHR, error, errorThrown);
		// 	// $('main').html(<div class="error">Something went wrong</div>);    
		// }
	}
};
