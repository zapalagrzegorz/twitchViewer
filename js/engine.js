// app makes three request to Twitch APIs
// I couldn't divided function call getUsersData into seperate properties as they're not independent.
// First it checks if users is streaming '/streams'. If responded positively, response data is enough for that user, and produces output.
// If not, it makes another call to /users/. If there isn't such user it's enough to produce adequate output.
// If users exists it makes call to corresponding /channel/ to get further data.
// Reponse data is transferred to other call (/streams/ -> /users/ -> /channel/ provided it gets the result
// so that it produces output only when a call is finished for that user. 

"use strict";

const engine = {
	users: ['bobross' , 'sandexperiment', 'timsww', 'soushibo', 'streamerhouse', 'Bananasaurus_Rex', 'freecodecamp','polskiestrumyki', 'ESL_SC2', 'cretetion',  'storbeck', 'habathcx', 'RobotCaleb', 'noobs2ninjas', '123', 'kubon', ],// array of users and their channels

	// app makes three request to Twitch API
	getUsersData: function (single) {
		let self = this;

		// conditions made for search option 
		// It was built later, so tried to put it into existing function
		// === is reserved for: "", [] and 0, see YDKJS I
		if(single === "" || invalidEntry(single)){
			return;
		}
		else if(typeof(single) == "string"){
			getSearchData(single);
		}
		else{
			getStreamsData();
		}


		/******************************************** 
		 * Helper functions to execute calls to API and produce output
		 *  
		 * ********************************************/

		// tests users input for valid user entry			
		function invalidEntry() {
			if(typeof(single) == "string"){
				// ^ begins with, * zero or more occurence, $ ends with, \s whitespace
				if(!/^[a-zA-Z0-9\s][a-zA-Z0-9_\s]*$/.test(single)){
					$("#searchValue").val("");
					$("#searchValue").attr("placeholder", "Invalid query");
					return true;
				}
			}
		}

		function getSearchData(single){
			$('.user-online').hide();
			$('.user-offline').hide();
			$('.user-unavailable').hide();
			$('#searchLoading').show();
			single = validateSearchEntry(single);
			let singleLw = single.toLowerCase();
			self.users.forEach(function(value) {
				let valueTemp = value.toLowerCase();
				if(singleLw == valueTemp){
					$('#'+value).show();
					$('#searchLoading').hide();
					return; 
				}
			});

			// functions were made with array parameter for the initial users array
			// not to redefine them, put single search value into array
			let promises = [];
			let promise = ajaxRequest('streams', single);
			promises.push(promise);
			
			// .when method executes once all of calls have finished
			// .apply method enables array where singular arguments expected
			// first argument '$' is made to use 'apply' 
			$.when.apply($, promises)
				.done(handleStreamResponses);
		}

		// Handle multiple parallel ajax requests
		function getStreamsData() {
			let promises = [];
			for (let i = 0, l = self.users.length; i < l; i++) {
				let promise = ajaxRequest('streams', self.users[i]);
				promises.push(promise);
			}
			$.when.apply($, promises)
				.done(handleStreamResponses);
		}
	
		
		// create single ajax requests for each user
		function ajaxRequest(call, user) {
			return $.ajax({
				type: 'get',
				url: '/wind-bow.glitch.me/' + call + '/' + user,
				headers: {
					Accept: 'application/vnd.twitchtv.v3+json'
				}
			});
		}

		function handleStreamResponses() {
			let responses = arguments, promises = [], userStreams = [], singleQ = false;
			if(responses.length == 3){
				responses = [];
				responses.push(arguments);
				singleQ = true;

				// need to call function again as single value is not changed
				single = validateSearchEntry(single);
			}
			for (let i in responses) {
				if (responses[i][0].stream == null && singleQ === true) {
					
					// queue calls for searched user which is not streaming
					promises.push(ajaxRequest('users', single));
				}
				else if(responses[i][0].stream == null) {
					
					// queue calls for all users which are not streaming
					promises.push(ajaxRequest('users', self.users[i]));
				}
				else {
					// users is streaming
					userStreams.push(responses[i][0].stream);
				}
			}
			// show those who stream
			produceOutput('streaming', userStreams);

			// make AJAX calls if there're users not streaming
			// For them do parallel ajax requests
			if (promises.length != 0) {
				$.when.apply($, promises)
					.done(handleSuccessUsers);
			}
		}

		function handleSuccessUsers() {
			let usersData = [], promisesChannels = [], responses = arguments;
			if(responses.length == 3){
				responses = [];
				responses.push(arguments);
			}
			for (let i in responses) {
				if (responses[i][0].hasOwnProperty('error')) {
					
					// show uknown users
					showUnkownUsers(responses[i][0]);
				}
				else {

					// Not streaming user exists, collect some of their data from /users/ and
					// postpone showing output until channel data will be received
					// Needs another AJAX call
					let user = {};
					user.bio = (responses[i][0].bio == null ? 'No bio available' : responses[i][0].bio.substring(0,140).concat('...'));
					user.created_at = responses[i][0].created_at;
					user.logo = (responses[i][0].logo == null ? 'css/assets/Glitch.png' : responses[i][0].logo);
					user.display_name = responses[i][0].display_name;
					usersData.push(user);
					promisesChannels.push(ajaxRequest('channels', responses[i][0].name));
				}
			}
			
			// only when channel data will be received, user output might be made
			// so usersData is collected and passed forward
			getChannelsData(promisesChannels, usersData);
		}

		// @usersData array
		function getChannelsData(promises, usersData) {
			$.when.apply($, promises)

				// how to pass array "usersData' to as parameter to .done?
				// don't know so, made local function 
				.done(function () {
					let responses = arguments;
					if(responses.length == 3){
						responses = [];
						responses.push(arguments);
					}
					for (let i in responses) {
						usersData[i].profile_banner = (responses[i][0].video_banner == null ? 'css/assets/profileLarge.png' : responses[i][0].video_banner);
						usersData[i].followers = responses[i][0].followers;
						usersData[i].status = (responses[i][0].status == null ? 'no status' : responses[i][0].status);
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
			for(let i in user){
				let pic, mainDesc, name, logo, followers, launchedAt, userHTML;
				
				if(typeOfUser == 'streaming'){
					pic = user[i].preview.large;
					mainDesc = user[i].game;
					name = user[i].channel.name;
					logo = user[i].channel.logo;
					followers = user[i].channel.followers;
					launchedAt = (user[i].created_at).substring(0,10);
					userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-online" id="'+ name+'"><div class="shadows"><div class="channelPreview"><a href="https://www.twitch.tv/' + name + '" target="_blank"><i class="fa fa-3x fa-play icon-play" aria-hidden="true"></i></a><div class="darken">';
				}
				else if (typeOfUser == 'nostreaming') {
					pic = user[i].profile_banner;
					mainDesc = user[i].display_name;
					name = user[i].name;	
					logo = user[i].logo;
					followers = user[i].followers;
					launchedAt = user[i].created_at;
					userHTML = '<article class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 channel user-offline" id="'+ name+'"><div class="shadows"><div class="channelPreview"><div>'; // extra div for darken
				}
				//  end of darken
				userHTML +=	'<img class="img" src="'+ pic +'"></div></div><div class="channelDescription">' +
									'<h3><a href="https://www.twitch.tv/' + mainDesc + '" target="_blank">'+ mainDesc +'</a></h3>';
				
				if(typeOfUser == 'streaming') {
					userHTML +=	'<div class="row"><div class="col-10">' +
										'<h4><a href="https://www.twitch.tv/' + user[i].channel.name + '" target="_blank">'+ user[i].channel.status +'</a></h4></div>' +
									'<div class="col-2" style="text-align: center">' +
										'<i class="fa fa-2x fa-user-circle" aria-hidden="true"></i><p><span id="#online">'+ user[i].viewers +'</span> online</p></div></div>';
				}
				else if(typeOfUser == 'nostreaming'){
					userHTML += '<div class="row"><div class="col-12">' +
									'<p class="user-bio">' + user[i].bio +'</p></div></div>';
				}

				userHTML += '<div class="row"><div class="col-2" style="padding-right:0;">' +
								'<a href="https://www.twitch.tv/' + name + '" target="_blank">' +
									'<img class="img" src="'+ logo + '"></a></div>' +
							'<div class="col-10" id="lastStatus' + mainDesc +'">' +
								'<p>followers: ' + followers + '</p>' +
								'<p>Launched: ' + launchedAt + '</p>' +
							'</div></div></div></div></article>';

				$('#streamContent').append(userHTML);
				
				if(typeOfUser == 'nostreaming'){
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
		function validateSearchEntry(single) {
			if(single.indexOf(" ") != -1){
				return single.replace(/\s/g, "_");
			}
			else {
				return single;
			}
		}
	}
}
