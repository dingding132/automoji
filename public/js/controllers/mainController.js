/**
 * Created by JohnWu on 2016-11-12.
 */

angular.module('controller', [])
    .controller('mainController', function($scope, $http, $timeout) {

        $scope.status_code;

        $scope.messageData = {};
        $scope.emojiMessage = "ADD EMOJI";

        $http.get('/api/messages').success(function(data) {
            $scope.messages = data;

            for (var i=0; i<data.length; i++) {
                $http.delete('/api/messages/' + data[i]._id).success(function(data) {});
            }

            $timeout( function () {
                refreshMessages();
            }, 3000 );
        });

        $scope.addEmoji = function() {
            $scope.emojiMessage = "ANALYZING....";
            $http.post('/api/kairos').success(function(response) {
                $timeout( function () {
                    getResult(JSON.parse(response).id);
                }, 5000 );

            });
        };

        var refreshMessages = function() {
            $http.get('/api/messages').success(function(data) {
                $scope.messages = data;
            });
            $timeout( function () {
                refreshMessages();
            }, 3000 );
        };

        var getResult = function (id) {
            $http.get('/api/kairos/' + id).success(function(response) {
                console.log("Final response", JSON.parse(response));

                $scope.status_code = JSON.parse(response).status_code;

                if ( $scope.status_code != '4' ) {
                    $timeout( function () {
                        getResult(id);
                    }, 500 );
                } else {
                    var anger = 0;
                    var disgust = 0;
                    var fear = 0;
                    var joy = 0;
                    var sadness = 0;
                    var surprise = 0;

                    for (var i=0; i<JSON.parse(response).frames.length; i++) {
                        anger += JSON.parse(response).frames[i].people[0].emotions.anger;
                        disgust += JSON.parse(response).frames[i].people[0].emotions.disgust;
                        fear += JSON.parse(response).frames[i].people[0].emotions.fear;
                        joy += JSON.parse(response).frames[i].people[0].emotions.joy;
                        sadness += JSON.parse(response).frames[i].people[0].emotions.sadness;
                        surprise += JSON.parse(response).frames[i].people[0].emotions.surprise;
                    }

                    anger = anger/JSON.parse(response).frames.length;
                    disgust = disgust/JSON.parse(response).frames.length;
                    fear = fear/JSON.parse(response).frames.length;
                    joy = joy/JSON.parse(response).frames.length;
                    sadness = sadness/JSON.parse(response).frames.length;
                    surprise = surprise/JSON.parse(response).frames.length;

                    var highestValue = anger;
                    var highestFeeling = "anger";
                    if ( disgust > highestValue ) {
                        highestValue = disgust;
                        highestFeeling = "disgust";
                    }
                    if ( fear > highestValue ) {
                        highestValue = fear;
                        highestFeeling = "fear";
                    }
                    if ( joy > highestValue ) {
                        highestValue = joy;
                        highestFeeling = "joy";
                    }
                    if ( sadness > highestValue ) {
                        highestValue = sadness;
                        highestFeeling = "sadness";
                    }
                    if ( surprise > highestValue ) {
                        highestValue = surprise;
                        highestFeeling = "surprise";
                    }

                    switch (highestFeeling) {
                        case "anger":
                            $scope.messageData.emoji = "em em-rage";
                            break;
                        case "disgust":
                            $scope.messageData.emoji = "em em-stuck_out_tongue_closed_eyes";
                            break;
                        case "fear":
                            $scope.messageData.emoji = "em em-fearful";
                            break;
                        case "joy":
                            $scope.messageData.emoji = "em em-smiley";
                            break;
                        case "sadness":
                            $scope.messageData.emoji = "em em-disappointed_relieved";
                            break;
                        case "surprise":
                            $scope.messageData.emoji = "em em-scream_cat";
                            break;
                        default:
                            $scope.messageData.emoji = "em em-sushi";
                    }

                    $scope.analysis = {
                        anger: anger,
                        disgust: disgust,
                        fear: fear,
                        joy: joy,
                        sadness: sadness,
                        surprise: surprise
                    };
                    $scope.emojiMessage = "ADD A DIFFERENT EMOJI";
                    deleteResult(JSON.parse(response).id);
                }

            });
        }

        var deleteResult = function (id) {
            $http.delete('/api/kairos/' + id).success(function(response) {
                console.log("Delete response", JSON.parse(response));
            });
        };

        $scope.addMessage = function() {
            if ($scope.messageData != undefined) {
                $http.post('/api/messages', $scope.messageData).success(function(data) {
                    $scope.messageData = {};
                    $scope.emojiMessage = "ADD EMOJI";
                    $scope.messages = data;
                });
            }
        };

    });
