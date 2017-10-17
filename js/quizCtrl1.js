app.controller('quizCtrl', ['$scope', '$http', 'helperService','parser', function ($scope, $http, helper, parser ) {
    parser.init();
    $scope.data = parser.data;
    
    
    
    
    //Note: Only those configs are functional which is documented at: http://www.codeproject.com/Articles/860024/Quiz-Application-in-AngularJs
    // Others are work in progress.
    $scope.defaultConfig = {
        'allowBack': true,
        'allowReview': false,
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
                       //console.log($scope.datetime);
            question.object.Options.forEach(function (element, index, array) {
                //console.log("Element Id: "+element.Id + "Option Id: "+option.Id);
                if (element.Id != option.Id) {
                    element.Selected = false;
                    question.Answered = option.isanswer;                   
                    question.ref=question.object.ref;
                    //console.log("ANSWERED: "+element.Id + "Ref: "+question.object.ref);
                }
                
            });
        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
            $scope.currentPage++;
    }



    
    $scope.onSubmit = function () {
     
     
        $scope.endcurrentdate = new Date();
        $scope.enddatetime = $scope.endcurrentdate.getDate() + "-" + ($scope.endcurrentdate.getMonth()+1) + "-" + $scope.endcurrentdate.getFullYear() + " " + $scope.endcurrentdate.getHours() + ":" + $scope.endcurrentdate.getMinutes() + ":" +$scope.endcurrentdate.getSeconds();
        /*var quizid = [];
        var quizIdStr="{\"quizid\"\ :";
        var userid = [];
        var userIdStr="\"userid\"\ :";
        var author = [];
        var authorStr="\"author\"\ :";
        var pswd = [];
        var pswdStr="\"author\"\ :";*/
        var questionid = [];
        var questionidStr = "\"questionid\"\ :"+"[";
        var answergive = [];
        var answergiveStr = "\"answer\"\ :"+"[";

        //answers1.push({ 'type':'submit_mcq_quiz', 'QuizId': $scope.data.quizid,'UserId': $scope.data.userid});
        /*
        quizid.push(JSON.stringify($scope.data.quizid));
        quizIdStr += quizid + ",";
        userid.push(JSON.stringify($scope.data.userid));
        userIdStr += userid + ",";
        
        author.push(JSON.stringify($scope.data.author));
        authorStr += author + ",";
        
        pswd.push(JSON.stringify($scope.data.pass));
        pswdStr += pswd + ",";
        */
        $scope.quizid=$scope.data.quizid;
      
        $scope.userid=$scope.data.userid;
      
        $scope.author = $scope.data.author;

        
        $scope.pswd = $scope.data.pass;
        
        $scope.bTime=$scope.data.beginTime;
        $scope.eTime=$scope.data.endTime;
        
        
        $scope.questions.forEach(function (ques, index) {
            //console.log("Answered : "+ques.Answered + "reference "+ques.ref);
            var cip = ques.Answered;
            if(cip==null){
                cip="Skip";
                //console.log("Reference : "+ques.ref);
            }else if (cip==true){
                cip="Correct";
            }else if(cip==false){
                cip="Incorrect";
            }
            questionid.push(JSON.stringify(ques.ref));
            answergive.push(JSON.stringify(cip));
           
        });
        questionidStr += questionid +"],";
        answergiveStr += answergive +"]}";
        
        var startTime="\"starttime\"\ :"+JSON.stringify($scope.startdatetime)+",";
        var endTime="\"endtime\"\ :"+JSON.stringify($scope.enddatetime)+",";
   
   
        $scope.answers = "{"+startTime + endTime + questionidStr + answergiveStr;
        var postData = {quizid:$scope.quizid, userid:$scope.userid, author:$scope.author,pswd:$scope.pswd,bTime:$scope.bTime,eTime:$scope.eTime,data:$scope.answers,quizdata:$scope.quiz};

        var json = angular.toJson(postData);  
        //console.log("JSON String "+ answers);
        console.log("JSON Data 222 "+json);
        $http({
            method: 'POST',
            url: 'submitquiz/',
            data: json
        })
        .success(function() {})
        .error(function() {});

        $scope.mode = 'result';
    }

    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };

    $scope.loadQuiz = function (data) {
        $http.get('/getquiz')
           .then(function () {
                //console.log('Hello 1');
                //console.log('Current Page '+$scope.currentPage);
                $scope.currentdate = new Date();
                $scope.startdatetime = $scope.currentdate.getDate() + "-" + ($scope.currentdate.getMonth()+1) + "-" + $scope.currentdate.getFullYear() + " " + $scope.currentdate.getHours() + ":" + $scope.currentdate.getMinutes() + ":" +$scope.currentdate.getSeconds();
                $scope.quiz = $scope.data.quizdata;
                //console.log("Quiz Data is ---->>>"+JSON.stringify($scope.data.attempted));
                //console.log($scope.quiz.elements);
                $scope.config = helper.extend({}, $scope.defaultConfig, $scope.data.config);
                $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle($scope.quiz.elements) : $scope.quiz.elements;
                //console.log("Object length is : "+$scope.questions.object);
                $scope.totalItems = $scope.questions.length;
                $scope.itemsPerPage = $scope.config.pageSize;
                $scope.currentPage = 1;
                $scope.mode = 'review';

                //console.log('Current Page 1 '+$scope.currentPage);

                $scope.$watch('currentPage + itemsPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;
        //setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},5);
                    $scope.filteredQuestions = $scope.questions.slice(begin, end);
                    //MathJax.Hub.Queue(["Typeset", MathJax.Hub,$scope.filteredQuestions]);
                    
                    //console.log('begin '+begin+' rnd '+end);
                    //console.log('Current Page 2 '+$scope.currentPage);

                });
                //MathJax.Hub.Queue(["Typeset", MathJax.Hub,$scope.filteredQuestions]);
                //console.log('Current Page 3 '+$scope.currentPage);
           });

    }
    $scope.loadQuiz($scope.data);

    $scope.goTo = function (index) {
        //setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},5);
        if (index > 0 && index <= $scope.totalItems) {
        
            $scope.currentPage = index;
            //$scope.mode = 'quiz';
           // $scope.loadQuiz(index)
        }

        //console.log(index + $scope.isAnswered(index));
    }



    $scope.isAnswered = function (index) {
       var answered = 'not-answered';
        $scope.questions[index].object.Options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    };
    
    

    $scope.isCorrect = function (question) {
        var result = 'Skip';
        question.object.Options.forEach(function (option, index, array) {
        
        //console.log("Is Answer "+ helper.toBool(option.Selected)+'---------'+option.isanswer);
            if((helper.toBool(option.Selected) == true) && (helper.toBool(option.isanswer)==true)){
                result = 'Correct'; 
                //console.log("I am Right - Inside");
                return false;
            } else if((helper.toBool(option.Selected) == true) && (helper.toBool(option.isanswer)==false)){
                result = 'Wrong'; 
                //console.log("I am Wrong - Inside");
                return false;
            }
        });
        return result;
    };




}]);

app.factory('parser', function($http) {


    var parser = {};
    parser.script_id = "json-data";
    parser.init = function(){
        var el = document.getElementById(this.script_id);
        var json_data = el.innerHTML;
        this.data = JSON.parse(json_data);

    }
    return parser;
});
/*
app.factory('MainConnector', function($http, $q, $resource ) {
  return {
    mainConnection: function( ) 
      
    }      
  };
});
*/
app.directive('math', function() {
  return {
    restrict: 'EA',
    scope: {
      math: '@'
    },
    link: function(scope, elem, attrs) {
      scope.$watch('math', function(value) {
        if (!value) return;
        elem.html(value);
        setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},0);

      });
    }
  };
});
