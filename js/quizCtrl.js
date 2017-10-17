app.controller('quizCtrl', ['$scope', '$http', 'helperService','myService','$timeout','$interval', function ($scope, $http, helper,myService,$timeout,$interval) {

    $scope.data = "test(2).json"; //quiz json file.
    $scope.currentPage = 1;// set default current page to be 1. means first question to be loaded.
    
    //check that if the quiz is marked for review.
    $scope.isReviewQuestions=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.isReviewQuestions.push(0); // default value 0
                 
                }



    //console.log("Data is "+$scope.data);
    $scope.answergive = [];
    //================================Quiz Program Start Here====================================
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





// =================================================   TIMER FUNCTIONS ===================================================================


//function to parse time into hour.
 var parseTime=function(diff){

    var msec = diff;
var hh = Math.floor(msec / 1000 / 60 / 60);
msec -= hh * 1000 * 60 * 60;
var mm = Math.floor(msec / 1000 / 60);
msec -= mm * 1000 * 60;
var ss = Math.floor(msec / 1000);
msec -= ss * 1000;

 $scope.hh=hh;
 $scope.mm=mm;
 $scope.ss=ss;
 }

$scope.timerType="timeSpent";
 
$scope.timerToggle=function(){
    if($scope.timerType=="timeSpent")
        $scope.timerType="timeLeft";
    else
        $scope.timerType="timeSpent";
 }



// timer function
var tick = function() {



        if($scope.timerType=="timeSpent"){//for showing time consumed.
    
    $scope.clock = new Date();//current time
   
    var timeLeft = $scope.clock - $scope.currentdate;//current time - time at which
    //console.log(timeLeft);
    parseTime(timeLeft);

    }
    else  // if timer is set to show time left.
    {
   
     var duration=$scope.allData.meta.duration;

     if(duration==null){// if duration is not give in Json file then end time - statrt time will be considered as duration.
     
     // its end time of validity of quiz   
    var beginTime= $scope.allData.meta.endTime;
    //console.log(typeof beginTime);
    var arr=[];
    arr=beginTime.split(' ');//split date and time indiviually
    beginDate=arr[0];//date
    var arr0=[];
    arr0=beginDate.split('-');//spliting date into yr,month,day
    
    beginTime=arr[1];//split time
    var arr1=[];
    arr1=beginTime.split(':');
    
    //generating a javascript date.
    var date1 = new Date(arr0[2], arr0[1]-1, arr0[0], arr1[0], arr1[1],arr1[2])
   
    $scope.clock = new Date();
    
    var timeLeft =  date1-$scope.clock  ;
   // console.log(timeLeft);

    }else{ // if duration  is given.


//break minutes into milliseconds.
duration=duration*60*1000;
//parse into hour, miuntes,seconds;


    $scope.clock = new Date();
    
    //time consumed


    var timeLeft =  $scope.clock - $scope.currentdate ;
    timeLeft=duration-timeLeft;
    console.log(timeLeft);
    }

    //remaing time
    parseTime(timeLeft);
}
  }
 
  $timeout(function(){tick();}, 1000);
  $interval(tick, 1000);




    //function to validate the time to enter the quiz..
    $scope.validateTime=function(){
 
    var dd=myService.getTime();


//function to change 5 to 05 in timer
Number.prototype.padLeft = function(base,chr){
   var  len = (String(base || 10).length - String(this).length)+1;
   return len > 0? new Array(len).join(chr || '0')+this : this;
}

var d = new Date,
    dformat = [(d.getDate()).padLeft(),
               (d.getMonth()+1).padLeft(),
               d.getFullYear()].join('-') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');


        //console.log($scope.startdatetime);
        console.log(dformat);
        console.log( $scope.allData.meta.beginTime);
        if(dformat> $scope.allData.meta.beginTime ){
         return true;       
        }else
        return false;
    }
//====================================================== TIMER FUNCTION ENDS ==========================================================================

//call for quizdemo.html  
     $scope.proceedButton=function() {
        // body...
        if(!document.getElementById("checkme").checked){
            alert('You must agree to the terms first.');
            return false
        }
        else{ 
            if($scope.validateTime())
                window.location.href='#/quiz';
             else alert('You can not enter before starting time of the quiz');
         }
    }


//===============================================================QUIZ FUNCTION STARTS FROM HERE  =========================================================

// on select mcq.
    $scope.onSelect = function (question, option,id) {
                   
                       
                       // lock the mcq type question.
                     $scope.lockToggle(id);


            question.object.options.forEach(function (element, index, array) {
              
                //console.log("Element Id: "+element.Id + "Option Id: "+option.Id);
                if (element.Id != option.Id) {
                    element.Selected = false;
                    question.Answered = option.isanswer;                   
                   // question.ref=question.object.ref;
                    //console.log("ANSWERED: "+element.Id + "Ref: "+question.object.ref);
                }
                
            });
        if ($scope.config.autoMove == true && $scope.currentPage < $scope.totalItems)
            $scope.currentPage++;
    }



       
    $scope.pageCount = function () {
        return Math.ceil($scope.questions.length / $scope.itemsPerPage);
    };

    //========================================= lOAD QUIZ =============================================
    $scope.loadQuiz = function (file) {
        $http.get(file)
           .then(function (res) {
                $scope.allData=res.data;
                $scope.quiz =res.data.quizdata;
             // var x = "Total Width: " + screen.width;
            //  console.log(x);
                   // for arrange type Questions. 
                $scope.swapOptions=[];// 

                $scope.currentdate = new Date();
                $scope.startdatetime = $scope.currentdate.getDate() + "-" + ($scope.currentdate.getMonth()+1) + "-" + $scope.currentdate.getFullYear() + " " + $scope.currentdate.getHours() + ":" + $scope.currentdate.getMinutes() + ":" +$scope.currentdate.getSeconds();
                $scope.config = helper.extend({}, $scope.defaultConfig, $scope.data.config);
                 
                
                $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle($scope.quiz.elements) : $scope.quiz.elements;

                $scope.TwentyQuestions= $scope.getTwentyQuestions();

                $scope.totalItems = $scope.questions.length;

             
                // for making a new variable to store bool value of review for each question.
                //$scope.isReviewQuestions=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.isReviewQuestions[i]=0;
                 
                }


                $scope.timeTaken=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.timeTaken.push(0);
                  
                }
                $scope.Stime=[];
                for( var i=0; i<$scope.totalItems;i++){
                    //var d= new Date();
                    $scope.Stime.push(0);
                 
                }
                $scope.Etime=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.Etime.push(0);
                  
                }
                $scope.hintUsed=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.hintUsed.push(0);
                   
                }
               
                $scope.answSelected=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.answSelected.push(-1);
                  
                }
                 $scope.lock=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.lock.push(false);
                   
                }


               

                $scope.itemsPerPage = $scope.config.pageSize;
                
                $scope.mode = 'review';
                $scope.getStartTime($scope.currentPage);
                //console.log('Current Page 1 '+$scope.currentPage);

                $scope.$watch('currentPage + itemsPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;
                //setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},5);


                    $scope.filteredQuestions = $scope.questions.slice(begin, end);
                
                });
                
           });

    }
  
// load  response typeof fill in type question
$scope.loadResponseFillIn=function(){

   //for fill In type.
                      console.log("currentPage" + ($scope.currentPage-1));
                      if($scope.questions[$scope.currentPage-1].type==='fillIn'){ 
                    //$scope.questions[i].object.speed=$scope.quizResponse[i].answerId.speed;
                    //console.log($scope.quizResponse[i].answerId.speed);
                    //console.log($scope.questions[i].object.speed);
                    console.log("he;");

                     var inputCount = document.getElementById('divFillInBlank').getElementsByTagName('input').length;
                    for( var i=0; i<inputCount;i++){
                // find the name and value of the input tag.
                var name=document.getElementById('divFillInBlank').getElementsByTagName('input')[i].getAttribute("name"); 
              //  var value=document.getElementsByName(name)[0].value;
                //console.log("the value " + typeof value);
                $scope.questions[$scope.currentPage-1].object[name]=$scope.quizResponse[$scope.currentPage-1].answerId[name];
              
                
                }




                 }


}
// load  response typeof mcq type question
$scope.loadResponseMcq=function(){

for( var i=0; i<$scope.totalItems;i++){
                
                if($scope.questions[i].type==='mcq'){  
                //console.log($scope.questions[i].type + i) ;

                for( var j=0; j<$scope.questions[i].object.options.length;j++){
                    $scope.questions[i].object.options[j].Selected=false;        

                        }
                         if($scope.quizResponse[i].answerId!= -1){
                       $scope.questions[i].object.options[$scope.quizResponse[i].answerId - 1].Selected=true; 
                   }
                      }

                    
                    }


}

// =============================================LOAD RESPONSE =======================================================================================
//function to load a quiz and response.
$scope.loadResponse = function (file) {
        var jsonData=myService.getData(file);
        jsonData.then(function(result){
        $scope.quiz =result.quizdata;    


                $scope.swapOptions=[];// 

                $scope.currentdate = new Date();
                $scope.startdatetime = $scope.currentdate.getDate() + "-" + ($scope.currentdate.getMonth()+1) + "-" + $scope.currentdate.getFullYear() + " " + $scope.currentdate.getHours() + ":" + $scope.currentdate.getMinutes() + ":" +$scope.currentdate.getSeconds();
                $scope.config = helper.extend({}, $scope.defaultConfig, $scope.data.config);
                 
                
                $scope.questions = $scope.config.shuffleQuestions ? helper.shuffle($scope.quiz.elements) : $scope.quiz.elements;

                $scope.TwentyQuestions= $scope.getTwentyQuestions();

                $scope.totalItems = $scope.questions.length;


             var respJson=myService.getData( "formdata.json");
             respJson.then(function(result){
                
                $scope.quizResponse=result.response;
                console.log($scope.quizResponse[0]);

           for( var i=0; i<$scope.totalItems;i++){
                    $scope.isReviewQuestions[i]=$scope.quizResponse[i].review;
                 
                }

                $scope.timeTaken=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.timeTaken[i]=$scope.quizResponse[i].timeTaken;
                  
                }
                $scope.Stime=[];
                for( var i=0; i<$scope.totalItems;i++){
                    //var d= new Date();
                    $scope.Stime[i]=0;
                 
                }
                $scope.Etime=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.Etime[i]=$scope.quizResponse[i].timeTaken;
                  
                }
                $scope.hintUsed=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.hintUsed[i]=$scope.quizResponse[i].helpUsed;
                   
                }
               
                $scope.answSelected=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.answSelected[i]=$scope.quizResponse[i].answerId;
                  
                }
                 $scope.lock=[];
                for( var i=0; i<$scope.totalItems;i++){
                    $scope.lock[i]=$scope.quizResponse[i].lock;
                   
                }

                

            $scope.loadResponseMcq();
              



                $scope.itemsPerPage = $scope.config.pageSize;
                $scope.currentPage = 1;
                $scope.mode = 'review';
                $scope.getStartTime($scope.currentPage);
                //console.log('Current Page 1 '+$scope.currentPage);

                $scope.$watch('currentPage + itemsPerPage', function () {
                    var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                        end = begin + $scope.itemsPerPage;
        //setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},5);


                    $scope.filteredQuestions = $scope.questions.slice(begin, end);

                    //put $timeout to force it wait for sometime.
                    //load the response of fill in type.
                    $timeout(function(){$scope.loadResponseFillIn();}, 1000);
 

                });




             });


                // for making a new variable to store bool value of review for each question.




        });
                
             

    }

//=================================  run any of the function to  load quiz or load the response.

   // $scope.loadResponse($scope.data);
    $scope.loadQuiz($scope.data);
//----end





 //======================   NEXT 20 / PREVIOUS 20 BUTTON ===================================   
    //default variables to compute next twenty questions.
    $scope.initQuestions=0;
    $scope.offset=0;
    $scope.getTwentyQuestions=function(){
        var length= $scope.questions.length;
        var div = Math.floor(length/20);
        var rem = length % 20;
        if($scope.initQuestions*20 +20 < length)
        var questions=$scope.questions.slice($scope.initQuestions*20,$scope.initQuestions*20 +20);
        else
        var questions=$scope.questions.slice($scope.initQuestions*20,$scope.initQuestions*20+rem);
    
        return questions;

    }

    //get next twenty set of questions
    $scope.nextTwentyQuestions=function(){
         var length= $scope.questions.length;
        var div = Math.floor(length/20);
        var rem = length % 20;
        var temp=0;
        if(rem>0)
            temp=1;
     //   console.log("temp"+ temp);
        if($scope.initQuestions!=div+temp-1){
         $scope.initQuestions++;
         $scope.offset=$scope.initQuestions*20;
         $scope.TwentyQuestions= $scope.getTwentyQuestions();
         //onRight(20,21);
         $scope.onRight($scope.currentPage,$scope.offset+1);
         //$scope.goTo($scope.offset+1);
     }
    
    }
    $scope.prevTwentyQuestions=function(){
         if( $scope.initQuestions!=0){
         $scope.initQuestions--;
         $scope.offset=$scope.initQuestions*20;
         $scope.TwentyQuestions= $scope.getTwentyQuestions();

         // onlfet(21,1)
         $scope.onLeft((($scope.initQuestions+1)*20) + 1,$scope.offset+1) ;
         //$scope.goTo($scope.offset+1);
     }
    }
    //===========================================NEXT 20 / PREVIOUS 20 BUTTON ENDS =========================================================







 
    //go to the last question of the set of twenty questions.
    $scope.goToLast =function(){
        if( $scope.initQuestions!=0){
        $scope.prevTwentyQuestions();
        //onLfet(21,20);

        $scope.onLeft((($scope.initQuestions+1)*20) + 1,$scope.initQuestions*20 +20);
      //  $scope.goTo($scope.initQuestions*20 +20);
  }
    }

    //go to particular page.
    $scope.goTo = function (index) {
        //setTimeout(function(){MathJax.Hub.Queue(["Typeset", MathJax.Hub]);},5);
       
        if (index > 0 && index <= $scope.totalItems) {
        
            $scope.currentPage = index;
            //$scope.mode = 'quiz';
           // $scope.loadQuiz(index)
        }

        //console.log(index + $scope.isAnswered(index));
    }


    //check whether the question is being answered or not.
    $scope.isAnswered = function (index) {
       var answered = 'not-answered';
        $scope.questions[index].object.options.forEach(function (element, index, array) {
            if (element.Selected == true) {
                answered = 'Answered';
                return false;
            }
        });
        return answered;
    };
    
    

    //function will be called when some one click review button. 
    $scope.doReview=function(currentQues){
        if($scope.isReviewQuestions[$scope.currentPage-1]==0)
        $scope.isReviewQuestions[$scope.currentPage-1]=1;
        else
          $scope.isReviewQuestions[$scope.currentPage-1]=0;



    }


    // check if the particular question is being checked for review.
    $scope.checkReview= function(currentQ){
//console.log("the number" + (currentQ-1));
    
        if($scope.isReviewQuestions[(currentQ-1)]==0)
            return false;
        else
            return true;
    }


//checks the color of current question.
// changes the color of the current question to blue color.
    $scope.currentQ=function(id){
        if($scope.currentPage==id)
            return true;
        else
            return false;

    }

    //demo fn
    $scope.checkClick=function(){
       //console.log("Hah Clicked");
       var a= new Date();
       console.log(a);
       

    }

//set the hint used
    $scope.setHintUsed=function(id){
        if($scope.hintUsed[id-1]==0)
        $scope.hintUsed[id-1]=1;


    }
//get the hint used.    
$scope.getHintUsed=function(id){
       return $scope.hintUsed[id-1];


    }


  //set the explnation used.    
    $scope.setExpUsed=function(id){
        if($scope.hintUsed[id-1]==1)
        $scope.hintUsed[id-1]=2;


    }

    
$scope.onLeft=function(currentPage,prev){
if(currentPage>1){

$scope.getStartTime(prev );
$scope.getEndTime(currentPage);
$scope.getTotalTime(currentPage);
$scope.goTo(prev);
}
}

$scope.onRight=function(currentPage,next){
if(currentPage<$scope.totalItems){
$scope.checkClick();
$scope.getStartTime(next);
$scope.getEndTime(currentPage);
$scope.getTotalTime(currentPage);
$scope.goTo(next);

}
}


// ================ Functions for toggling hint Explanation Button============== 

$scope.ShowDiv2=function(){
    if(document.getElementById("instruction").style.display=='none'){
      document.getElementById("instruction").style.display="";
          
    }else
      document.getElementById("instruction").style.display='  none';
    }


    


     $scope.ShowDiv=function(id){
      if(document.getElementById("hints").style.display=='none'){
      document.getElementById("hints").style.display="";
      
              
    }else{
      document.getElementById("hints").style.display='none';
     
    }
    }


       $scope.ShowDiv1=function(id){
        if($scope.hintUsed[id-1]>=1){
            $scope.setExpUsed($scope.currentPage);
      if( document.getElementById("explanation").style.display=='none' ){
      document.getElementById("explanation").style.display="";
      
            
    }else{
      document.getElementById("explanation").style.display='none';
       

    }
        }else alert("Use Hint First");
  

    }

     $scope.hideAll=function() {
      // body...
     
     
      document.getElementById("hints").style.display='none';
      document.getElementById("explanation").style.display='none'
    }

//============= function to toggle button ends here ===============================





//===================== All logic to print json===================================


$scope.selectAns=function(id,ansId){
   // if question type == mcq then ansId will be Option Id
   // If it is arrange type then andID will be A Number like 3214 which represents the pattern

// if code fr mcq type questions.


$scope.answSelected[id-1]=ansId;


// if the question is of arrange type. set it to again empty array for the next question


}


    $scope.getTime= function(){
    var d = new Date();

    return d;
    }
    $scope.getStartTime=function(id){
        
        var d=$scope.getTime();
        $scope.Stime[id-1]=d;
       
        
    }


    $scope.getEndTime=function(id){
       
        var d=$scope.getTime();
        $scope.Etime[id-1]=d;
     
    }
    $scope.getTimeDiff=function(id){
        
        var now=$scope.Stime[id-1];
        var then=$scope.Etime[id-1];
     
      
       var d=then-now;
        //var d=moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
      
        return d;
    }
    //on cliccking submit
$scope.onFinish=function(currentPage){
console.log("current page"+ currentPage);    
$scope.getEndTime(currentPage);
$scope.getTotalTime(currentPage);
}   
    $scope.getTotalTime=function(id){
        $scope.timeTaken[id-1]= $scope.timeTaken[id-1]+ ($scope.getTimeDiff(id)/1000);
      
    }
    $scope.getTotalTimeOflastQues=function(id){
        $scope.timeTaken[id-1]= $scope.timeTaken[id-1]+ ($scope.getTimeDiff(id)/1000);
      
    }

 // function to make a response object.   
$scope.getResponse=function(){

    $scope.quizResponse={};
$scope.quizResponse.response=[];
  for( var i=0; i<$scope.totalItems;i++){
    $scope.quizResponse.response[i]={};
    $scope.quizResponse.response[i].ref=$scope.questions[i].ref;
    $scope.quizResponse.response[i].type=$scope.questions[i].type;
    $scope.quizResponse.response[i].timeTaken=$scope.timeTaken[i];
    $scope.quizResponse.response[i].helpUsed=$scope.hintUsed[i];
    $scope.quizResponse.response[i].lock=$scope.lock[i];
    $scope.quizResponse.response[i].review=$scope.isReviewQuestions[i];
    $scope.quizResponse.response[i].answerId=$scope.answSelected[i];
    
    

}
$http.post('save-json.php', $scope.quizResponse).then(function(data) {
      $scope.msg = 'Data saved';
    });

alert('Response Submitted');
//$scope.saveToPc($scope.quizResponse,"vivek1.json" );
}



//get summary of the quiz
$scope.getSummary=function(){
 var finaldate = new Date();
$scope.summary=[];
 for( var i=0; i<2;i++){
        $scope.summary.push(0);
                   // console.log(" review is "+$scope.isReviewQuestions[i]+" "+i);
                }
for( var i=0; i<$scope.totalItems;i++){
if($scope.answSelected[i]==-1)
    $scope.summary[0]++;
else
    $scope.summary[1]++;

}

 $scope.timeTakenToComplete=((finaldate-$scope.currentdate)/60000).toFixed(2);

}


//validate that all input tag is filled and then lock is preessed. For Fill in the blank type.
$scope.validateForm=function()
{
    var inputCount = document.getElementById('divFillInBlank').getElementsByTagName('input').length;//get the number of input tags
    var temp=false;

  for (var i = 0; i < inputCount; i++) {
   // fieldname = fields[i];
    var name=document.getElementById('divFillInBlank').getElementsByTagName('input')[i].getAttribute("name"); 
                var value=document.getElementsByName(name)[0].value;
    if (value === "") {
     
      temp= true;
    }
  }
  return temp;
}


// Important function. Lock==> perform acc to question type.


$scope.Lock=function(){
    // for fill In type Questions
    if($scope.questions[$scope.currentPage-1].type=='fillIn'){
         if($scope.lock[$scope.currentPage-1]){// toggle lock. if lock is already pressed. unlock the lock.
           
            $scope.selectAns($scope.currentPage,-1); //make answer = -1
          $scope.lock[$scope.currentPage-1]=false; //set value of lock = false

         }else{//lock the answer.

            if($scope.validateForm()){//check wheterher all the blanks are filled
                alert("First fill all the blanks before submitting!");
                $scope.lock[$scope.currentPage-1]=false;
            }else{


            var inputCount = document.getElementById('divFillInBlank').getElementsByTagName('input').length;
        //    console.log("NUMBER OF input" + inputCount);
            var temp={};
            for( var i=0; i<inputCount;i++){
                // find the name and value of the input tag.
                var name=document.getElementById('divFillInBlank').getElementsByTagName('input')[i].getAttribute("name"); 
                var value=document.getElementsByName(name)[0].value;
                console.log("the value " + typeof value);
                temp[name]=value;
               // console.log(temp); 
                }
                $scope.selectAns($scope.currentPage,temp);
       
            $scope.lock[$scope.currentPage-1]=true;
        
            }

        }

    }else{ // For arrange type questions.




    if($scope.lock[$scope.currentPage-1]){//toggle lock. if lock is already pressed. unlock the lock.

        //multiply the answer with -1 to represent it as skipped question
        var temp=$scope.answSelected[$scope.currentPage-1]*-1;
        temp=temp.toString();
        $scope.selectAns($scope.currentPage,temp); 
          $scope.lock[$scope.currentPage-1]=false; 
    }else{

        var temp=[];
// send answer to print json.
        for( var i=0; i<$scope.questions[$scope.currentPage-1].object.options.length;i++){
            temp[i]=$scope.swapOptions[i];//store the patter into temp variable

                }
            var temp2=temp.join('');//join it to  make one number to represent the mattern like 3,2,1,4= 3214
            $scope.selectAns($scope.currentPage,temp2);//store the answer.
       
         $scope.lock[$scope.currentPage-1]=true;//set locked
    

    }
}
}

// =============== lock toggle is only for mcq type.
// the purpose of this function is to toggle lock and skip the answer if not selected.
$scope.lockToggle=function(ansId){
  var temp=ansId;  
console.log("checked"+temp);
 if(document.getElementById(temp).checked){
    $scope.lock[$scope.currentPage-1]=true;
    $scope.selectAns($scope.currentPage,ansId);

}else{
    $scope.lock[$scope.currentPage-1]=false;
    $scope.selectAns($scope.currentPage,-1);
}

}

// ============================================================================================
// Add different type of question and thier template url here.
$scope.quizOptions = [{
        url: 'templates/Options/mcq.html'},
        
        {
       
        url: 'templates/Options/arrange.html'},
        {
       
        url: 'templates/Options/fill.html'}



        ];
 //                                 ARRANGE TYPE           
// ================================================================================================

$scope.flag=false;
$scope.ToID=-1; //it will contain the option number to swap
$scope.FromID=-1; //it will contain the option number from swap
 
$scope.flag2=false;

$scope.isFlag=function(){
return $scope.flag;

}

//select to swap function.  
$scope.selectToSwap=function(id){

$scope.flag=true; // flag has been set to true so that next function will be called is selectFrom swap.

//T make Option.Selected=false so that it will be marked as not attempted which help in changing the grid color.
//this is the prequisite to check whether the option is answered or not which is inherited from mcq type.
for( var i=0; i<$scope.questions[$scope.currentPage-1].object.options.length;i++){
$scope.questions[$scope.currentPage-1].object.options[i].Selected=false;        

    }


// remove the borders of previous arrangement.
if($scope.flag2){
    document.getElementById('my'+$scope.FromID).style.border='none ';
    document.getElementById('my'+$scope.ToID).style.border='none ';
}


//set the border for selection
document.getElementById('my'+id).style.border='solid #88b27e  ';
$scope.ToID=id;//select the swap id.
//$scope.selectAns(id,$scope.arrangeIntialPattern);

}


$scope.selectFromSwap=function(id){
$scope.lock[$scope.currentPage-1]=true;// mark the question answered.
$scope.FromID=id;

//T make Option.Selected==true so that it will change color and marked as attmepted question.
//It will make the current change for the number tab of question.
$scope.questions[$scope.currentPage-1].object.options[id-1].Selected=true; // set it  true so that it can be considered as answered.

 //   console.log("Hello allllll");
// change color the border color of options
document.getElementById('my'+id).style.border='solid #88b27e  ';   //set the border. 

$scope.flag2=true;

$scope.Swap(); //cal the function swap.
var temp=[];
// send answer to print json.
for( var i=0; i<$scope.questions[id-1].object.options.length;i++){
    temp[i]=$scope.swapOptions[i];//copy array swapOptions into temp.

}
var temp2=temp.join('');//join the aray to make a number
$scope.selectAns($scope.currentPage,temp2); //set the answer in our answer array.
 

  $scope.flag=false;  
  // Now Reset Everything.

// save the output in answer so that it can be generated in response 

}


// reset all the data for the next arrangement type questions.
$scope.resetAll=function(){
$scope.flag=false;
$scope.ToID=-1;
$scope.FromID=-1;
$scope.swapOptions=[];
$scope.flag2=false;

}
$scope.Swap=function(){


    tempOutput = [];
    var tempNumber=$scope.arrangeIntialPattern;
while (tempNumber) {
    tempOutput.push(tempNumber % 10);
    tempNumber = Math.floor(tempNumber/10);
}
console.log(tempOutput.reverse().join(',')); // 1,2,3,4,9,8,7

var temp=tempOutput[$scope.ToID-1];
tempOutput[$scope.ToID-1]=tempOutput[$scope.FromID-1];
tempOutput[$scope.FromID-1]=temp;
//console.log(tempOutput.join(','));
$scope.arrangeIntialPattern=tempOutput.join('');
//console.log($scope.arrangeIntialPattern);

$scope.swapOptions=$scope.arrangeIntialPattern.split('');
//console.log($scope.swapOptions);
}



//$scope.arrangeIntialPattern=1234;

// A function which will return a number based on Question type which will be used to choose the template.
//It will be called on every page.
$scope.getType=function(id){
//console.log("THis function");
var index=0;

if($scope.questions[id-1].type=='mcq')
    index=0;
if($scope.questions[id-1].type=='fillIn'){
    index=2;
// its temporary to make the change of color of question number when answered    

}
 if($scope.questions[id-1].type=='arrange'){
    index=1;   

       for( var i=0; i<$scope.questions[id-1].object.options.length;i++){
          $scope.swapOptions.push(i+1);// fill the array swap options with as number 1,2,3,4 depending upon length of array. 

    }

    // if the answer is already  locked. then again come back too the same question from any other question. then the saved arrangement is loaded.
    if($scope.lock[$scope.currentPage-1]){
     $scope.arrangeIntialPattern= $scope.answSelected[$scope.currentPage-1];
      var temp=Math.abs($scope.arrangeIntialPattern);
      temp=temp.toString();
      $scope.arrangeIntialPattern=temp;
      $scope.swapOptions=temp.split('');  
        }
     else   
    $scope.arrangeIntialPattern=$scope.swapOptions.join(''); 

   
}
// for arrange 

//console.log("the index is "+index);
return index;

}


// FillIn type functions start here
$scope.saveFillIn=function(){
var inputCount = document.getElementById('divFillInBlank').getElementsByTagName('input').length;

}
$scope.clickclick=function(){
    alert("hello aax`x  ");
}

 $scope.AppendText = function() {
     var myEl = angular.element( document.querySelector( '#divID' ) );
     myEl.append($scope.filteredQuestions[0].object.statement);     
    }
// Fill in type ends here.
// Question template ends here.


    //======================================End Here=============================================

}]);

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




app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);

        $compile(ele.contents())(scope);
      });
    }
  };
});


app.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    });