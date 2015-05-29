angular.module('starter.controllers', ['ngOpenFB'])

.controller('DashCtrl', function($scope, $ionicLoading, $state, $stateParams, $cookieStore, ngFB) {

	$scope.title = $stateParams.feedId;
	
	$ionicLoading.show({
      templateUrl: "templates/spinner.html"
    });

	//Initialize Couch DB
	var db = new PouchDB('trulyhappy', {adapter: 'websql'});
  	var remoteCouch = "https://ajinkya.iriscouch.com/trulyhappy";

  	//DB Syncing
  	var opts = {live: true};
  	db.replicate.to(remoteCouch, opts, syncError);
	db.replicate.from(remoteCouch, opts, syncError);
	function syncError() {
		console.log("Couch DB sync error");
	}

	//Read
	console.log("Reading");
	tests = [];
	
	ngFB.api({
        path: '/me'
        // params: {fields: 'id,name'}
    }).then(
        function (resp) {
            //console.log("jsjs");
            //console.log(resp.id);
            	myPic = "http://graph.facebook.com/" + resp.id + "/picture?width=270&height=270";
		db.allDocs({attachments:true, include_docs:true}).then(function(rr) { 
		for(i=0;i<rr.rows.length;i++) {
			// tests.push({img1: rr.rows[i].doc._attachments["test1.jpg"].data, img2: rr.rows[i].doc._attachments["test2.jpg"].data });
			tests.push({img1: myPic, img2: rr.rows[i].doc._attachments["test2.jpg"].data });
			//$scope.test = rr.rows[0].doc._attachments["test1.jpg"].data;
			console.log(rr.rows[i].doc._attachments["test1.jpg"].digest);
			//setTimeout(function(){
				$scope.tests = tests;
				// console.log($scope.tests[0].img1);
				// console.log($scope.tests[0].img2);
				$ionicLoading.hide();
			//},2000);
		}
	})


        },
        function (error) {
            //alert('Facebook error: ' + error.error_description);
            $ionicLoading.hide();
            $state.go("login");
        });

	// ngFB.api('/me/picture', function (response) {
	// 	console.log("sdsdds");
	// 	console.log(response);
	// 	myPic = response.data.url;
	// 	db.allDocs({attachments:true, include_docs:true}).then(function(rr) { 
	// 	for(i=0;i<rr.rows.length;i++) {
	// 		// tests.push({img1: rr.rows[i].doc._attachments["test1.jpg"].data, img2: rr.rows[i].doc._attachments["test2.jpg"].data });
	// 		tests.push({img1: myPic, img2: rr.rows[i].doc._attachments["test2.jpg"].data });
	// 		//$scope.test = rr.rows[0].doc._attachments["test1.jpg"].data;
	// 		console.log(rr.rows[i].doc._attachments["test1.jpg"].digest);
	// 		setTimeout(function(){
	// 			$scope.tests = tests;
	// 			console.log($scope.tests[0].img1);
	// 			console.log($scope.tests[0].img2);
	// 			$ionicLoading.hide();
	// 		},2000);
	// 	}
	// })	
	// });

	
	// db.allDocs({include_docs: true, descending: true}).then(function(doc) {
	// 	console.log("Result");
	// 	console.log(doc.rows);
	// }).catch(function(err) {
	// 	console.log(err);
	// });
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('CameraCtrl', function($scope, $stateParams, Camera) {
  console.log("Got to see the camera");
  $scope.title = $stateParams.feedId;
  Camera.getPicture().then(function(imageURI) {
  	console.log("here");
      console.log(imageURI);
    }, function(err) {
    	console.log("there");
      console.err(err);
    });
  console.log("done");
})

.controller('FeedCtrl', function($scope, $state, $stateParams) {
  console.log("Got to see the feed");

  $scope.ff = function(ss) {
  		console.log(ss);
  		$state.go('tab.camera', {feedId: '1'});
	}
})

.controller('LoginCtrl', function($scope, $state, $stateParams, $cookieStore, Chats, ngFB) {
	// $scope.fbLogin = function () {
 //        FB.login(function (response) {
 //        	console.log("resp");
 //        	console.log(response);
 //            if (response.authResponse) {
 //                getUserInfo();
 //            } else {
 //                console.log('User cancelled login or did not fully authorize.');
 //            }
 //        }, {scope: 'email,user_photos,user_videos'});
 
 //        function getUserInfo() {
 //            // get basic info
 //            FB.api('/me', function (response) {
 //                console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
 //                // get profile picture
 //                FB.api('/me/picture?type=normal', function (picResponse) {
 //                    console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
 //                    response.imageUrl = picResponse.data.url;
 //                    // store data to DB - Call to API
 //                    // Todo
 //                    // After posting user data to server successfully store user data locally
 //                    var user = {};
 //                    user.name = response.name;
 //                    user.email = response.email;
 //                    if(response.gender) {
 //                        response.gender.toString().toLowerCase() === 'male' ? user.gender = 'M' : user.gender = 'F';
 //                    } else {
 //                        user.gender = '';
 //                    }
 //                    user.profilePic = picResponse.data.url;
 //                    $cookieStore.put('userInfo', user);
 //                    console.log("userAAA");
 //                    console.log(user);
 //                    $state.go('tab.dash');
 
 //                });
 //            });
 //        }
 //    };
			 $scope.fbLogin = function () {
			    ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
			        function (response) {
			            if (response.status === 'connected') {
			                console.log('Facebook login succeeded');
			                //$scope.closeLogin();
			                $state.go('tab.feed');
			            } else {
			                alert('Facebook login failed');
			            }
			        });
			};
// See more at: http://techiedreams.com/facebook-and-google-oauth-with-ionic-and-angularjs/#sthash.2YYi6bwj.dpuf
});