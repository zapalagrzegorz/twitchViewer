












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