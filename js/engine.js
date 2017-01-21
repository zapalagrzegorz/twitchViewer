
var engine = {
	self: this,
	users: ['bobross', 'sandexperiment', 'timsww', 'soushibo', 'streamerhouse', 'Bananasaurus_Rex', 'freecodecamp','polskiestrumyki', 'ESL_SC2', 'cretetion',  'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas', '123', 'kubon', ],// array of users and their channels

	// app makes request to Twitch API
	getUsersData: function (single) {
		var self = this;
		
		if(single !== undefined && single !== ""){
			var single = validateSearch(single);
			var singleLw = single.toLowerCase();
			self.users.forEach(function(value) {
				var valueTemp = value.toLowerCase();
				if(singleLw === valueTemp){
					$('#'+value).show();
					$('#searchLoading').hide();
					return; 
				}
			});
			var promises = [];
			var promise = ajaxRequest('streams', single);
			promises.push(promise);
			$.when.apply($, promises)
				.done(handleSuccessStreams);
		}
		else{
			getStreamsData();
		}

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
			var singleQ = false;
			if(responses.length === 3){
				responses = [];
				responses.push(arguments);
				singleQ = true;
			}
			for (var i in responses) {
				if (responses[i][0].stream === null && singleQ === true) {
					
					// queue calls for all users which are not streaming
					promises.push(ajaxRequest('users', single));
				}
				else if(responses[i][0].stream === null) {
					
					// queue calls for all users which are not streaming
					promises.push(ajaxRequest('users', self.users[i]));
				}
				else {
					userStreams.push(responses[i][0].stream);
				}
			}
			// show those who stream
			produceOutput('stream', userStreams);

			// make AJAX calls if there're users not streaming
			// For them do parallel ajax requests
			if (promises.length !== 0) {
				$.when.apply($, promises)
					.done(handleSuccessUsers);
			}
		}

		function handleSuccessUsers() {
			var usersData = [];
			var promisesChannels = [];
			var responses = arguments;
			if(responses.length === 3){
				responses = [];
				responses.push(arguments);
			}
			for (var i in responses) {
				if (responses[i][0].hasOwnProperty('error')) {
					
					// show uknown users
					showUnkownUsers(responses[i][0]);
				}
				else {

					// not streaming user exists, 
					// collect also their channel data - needs another AJAX call
					var user = {};
					user.bio = (responses[i][0].bio === null ? 'No bio available' : responses[i][0].bio.substring(0,140).concat('...'));
					user.created_at = responses[i][0].created_at;
					user.logo = (responses[i][0].logo === null ? 'css/assets/Glitch.png' : responses[i][0].logo);
					user.display_name = responses[i][0].display_name;
					usersData.push(user);
					promisesChannels.push(ajaxRequest('channels', responses[i][0].name));
				}
			}
			getChannelsData(promisesChannels, usersData);
		}

		// @usersData array
		function getChannelsData(promises, usersData) {
			$.when.apply($, promises)
				// how to pass array "usersData' to as parameter to .done?
				.done(function () {
					var responses = arguments;
					if(responses.length === 3){
						responses = [];
						responses.push(arguments);
					}
					for (var i in responses) {
						usersData[i].profile_banner = (responses[i][0].video_banner === null ? 'css/assets/profileLarge.png' : responses[i][0].video_banner);
						usersData[i].followers = responses[i][0].followers;
						usersData[i].status = (responses[i][0].status === null ? 'no status' : responses[i][0].status);
						if(usersData[i].status.length > 44){
							usersData[i].status = responses[i][0].status.substring(0,44).concat('...');
						}
					}
					// show not streaming users
					produceOutput('nostreaming', usersData);
					$('header').show();
					$('main').show();
					$('#mainLoading').hide();
				});

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
				var logo;
				var followers;
				var launchedAt;
				var userHTML;
				if(typeOfUser === 'stream'){
					pic = user[i].preview.large;
					mainDesc = user[i].game;
					name = user[i].channel.name;
					logo = user[i].channel.logo;
					followers = user[i].channel.followers;
					launchedAt = (user[i].created_at).substring(0,10);
					userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-online" id="'+ name+'"><div class="shadows"><div class="channelPreview">';
				}
				else if (typeOfUser === 'nostreaming') {
					pic = user[i].profile_banner;
					mainDesc = user[i].display_name;
					name = user[i].name;	
					logo = user[i].logo;
					followers = user[i].followers;
					launchedAt = user[i].created_at;
					userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-offline" id="'+ name+'"><div class="shadows"><div class="channelPreview">';
				}
				 
				userHTML +=	'<img class="img" src="'+ pic +'"></div><div class="channelDescription">' +
									'<h3><a href="https://www.twitch.tv/' + mainDesc + '">'+ mainDesc +'</a></h3>';
				
				if(typeOfUser === 'stream') {
					userHTML +=	'<div class="row"><div class="col-10">' +
										'<h4><a href="https://www.twitch.tv/' + user[i].channel.name + '">'+ user[i].channel.status +'</a></h4></div>' +
									'<div class="col-2" style="text-align: center">' +
										'<i class="fa fa-2x fa-user-circle" aria-hidden="true"></i><p><span id="#online">'+ user[i].viewers +'</span> online</p></div></div>';
				}
				else if(typeOfUser === 'nostreaming'){
					userHTML += '<div class="row"><div class="col-12">' +
									'<p class="user-bio">' + user[i].bio +'</p></div></div>';
				}

				userHTML += '<div class="row"><div class="col-2" style="padding-right:0;">' +
								'<a href="https://www.twitch.tv/' + name + '">' +
									'<img class="img" src="'+ logo + '"></a></div>' +
							'<div class="col-10" id="lastStatus' + mainDesc +'">' +
								'<p>followers: ' + followers + '</p>' +
								'<p>Launched: ' + launchedAt + '</p>' +
							'</div></div></div></div></article>';
				$('#streamContent').append(userHTML);
				
				if(typeOfUser === 'nostreaming'){
					var lastStatus = '<p>Last status: '+ user[i].status + '</p>';
					$('#lastStatus' + mainDesc).prepend(lastStatus);
				}
			}
			$('#searchLoading').hide();
		}

		function showUnkownUsers(user) {
			var userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-unavailable"><div class="shadows"><div class="channelPreview">' +
					'<img class="img" src="css/assets/nostream.gif"></div>' +
				'<div class="channelDescription">' +
					'<h3>' + user.message + ' or does not exist</h3></div></div></article>';
			$('#streamContent').append(userHTML);
		}
		// function handleError(jqXHR, error, errorThrown) {
		// 	console.log(jqXHR, error, errorThrown);
		// 	// $('main').html(<div class="error">Something went wrong</div>);    
		// }
		function validateSearch(single) {
			if(single.indexOf(" ") !== -1){
				return single.replace(/\s/g, "_")
			}
			return single;
		}
	}

	// getRequestedUser: function(search){
 	// 	$.ajax({
	// 		type: 'get',
	// 		url: 'https://wind-bow.gomix.me/twitch-api/' + call + '/' + user,
	// 		headers: {
	// 			Accept: 'application/vnd.twitchtv.v3+json'
	// 		},
	// 		success: this.

	// 		}
	// 	});
		// }
	// }
}
