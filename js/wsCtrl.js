app.factory('parser', function() {
    var parser = {};
    parser.script_id = "json-data";
    parser.init = function(){
        var el = document.getElementById(this.script_id);
        var json_data = el.innerHTML;
        this.data = JSON.parse(json_data);
    }
    return parser;
});

app.controller('wsCtrl', ['$scope', '$http', 'helperService','parser', function ($scope, $http, helper, parser ) {
    parser.init();
    $scope.data = parser.data;

$scope.loadQuiz = function (data) {
    $http.get('/angdata/')
        .then(function () {
            console.log('Hello ');
            $scope.quiz = $scope.data.Worksheet;
            $scope.config = helper.extend({}, $scope.defaultConfig, $scope.data.config);
            $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle($scope.data.Questions) : $scope.data.Questions;
            $scope.totalItems = $scope.questions.length;
            $scope.itemsPerPage = $scope.config.pageSize;
            $scope.currentPage = 1;
            $scope.mode = 'review';

            console.log('Current Page 1 '+$scope.currentPage);

            $scope.$watch('currentPage + itemsPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                    end = begin + $scope.itemsPerPage;

                $scope.filteredQuestions = $scope.questions.slice(begin, end);
                console.log('begin '+begin+' rnd '+end);
                console.log('Current Page 2 '+$scope.currentPage);

            });
            console.log('Current Page 3 '+$scope.currentPage);
        });
}
    $scope.defaultConfig = {
        'allowBack': true,
        'allowReview': true,
        'autoMove': false,  // if true, it will move to next question automatically when answered.
        'duration': 0,  // indicates the time in which quiz needs to be completed. post that, quiz will be automatically submitted. 0 means unlimited.
        'pageSize': 1,
        'requiredAll': false,  // indicates if you must answer all the questions before submitting.
        'richText': false,
        'shuffleQuestions': false,
        'shuffleOptions': false,
        'showClock': true,
        'showPager': true,
        'theme': 'none'
    }
    $scope.onSelect = function (question, option) {
        if (question.QuestionTypeId == 1) { //
            question.Options.forEach(function (element, index, array) {
                if (element.Id != option.Id) {
                    element.Selected = false;
                    question.Answered = element.Id;
                }
            });
        }

        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
            $scope.currentPage++;
    }

    $scope.onSubmit = function () {
        var answers = [];
        $scope.data.Questions.forEach(function (q, index) {
            answers.push({ 'QuizId': $scope.data.Worksheet.Id, 'QuestionId': q.Id, 'Answered': q.Answered });
        });
        // Post your data to the server here. answers contains the questionId and the users' answer.
        //$http.post('api/Quiz/Submit', answers).success(function (data, status) {
        //    alert(data);
        // });
        console.log(answers);
        console.log($scope.data.Questions);
        $scope.mode = 'result';
    }

    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };




    $scope.isAnswered = function (index) {
        var answered = 'not-answered';
        $scope.data.Questions[index].Options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    };
    $scope.goTo = function (index) {
        if (index > 0 && index <= $scope.totalItems) {
            $scope.currentPage = index;
            //$scope.mode = 'quiz';
            $scope.loadQuiz($scope.data.Questions[index])
        }
        console.log(index + $scope.isAnswered(index));
    }

    $scope.isCorrect = function (question) {
        var result = 'correct';
        question.Options.forEach(function (option, index, array) {
            if (helper.toBool(option.Selected) != option.IsAnswer) {
                result = 'wrong';
                return false;
            }
        });
        return result;
    };
}]);