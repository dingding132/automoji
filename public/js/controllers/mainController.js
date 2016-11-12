/**
 * Created by JohnWu on 2016-11-12.
 */

angular.module('controller', [])
    .controller('mainController', function($scope, $http, $timeout) {

        $scope.status_code;

        $scope.greeting = "Hello World";

        $http.post('/api/kairos').success(function(response) {
            $timeout( function () {
                getResult(JSON.parse(response).id);
            }, 5000 );

        });

        var getResult = function (id) {
            $http.get('/api/kairos/' + id).success(function(response) {
                console.log("Final response", JSON.parse(response));

                $scope.status_code = JSON.parse(response).status_code;

                if ( $scope.status_code != '4' ) {
                    console.log("hello");
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

                    $scope.analysis = {
                        anger: anger/JSON.parse(response).frames.length,
                        disgust: disgust/JSON.parse(response).frames.length,
                        fear: fear/JSON.parse(response).frames.length,
                        joy: joy/JSON.parse(response).frames.length,
                        sadness: sadness/JSON.parse(response).frames.length,
                        surprise: surprise/JSON.parse(response).frames.length
                    };
                    deleteResult(JSON.parse(response).id);
                }

            });
        }

        var deleteResult = function (id) {
            $http.delete('/api/kairos/' + id).success(function(response) {
                console.log("Delete response", JSON.parse(response));
            });
        };

    });
