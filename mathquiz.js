class Question {
    constructor(a, b, op, ans) {
        this.num1 = a;
        this.num2 = b;
        this.operator = op;
        this.answer = ans;
    }
    
    correct() { 
        return this.submitted == this.answer();
    }
    
    print() {
        return this.num1 + " " + this.operator + " " + this.num2; 
    }
    
}

/* == Settings == */
let timelimit = 300;
let max_questions = 100;
/* == End of settings ==*/

let finished = false;
let cont;
let question_type;

let questions = new Array();
let active_question;

/**********************************************************************/

function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}

/**********************************************************************/



function random(from, to) {
    var delta = (to - from) + 1;
    return Math.floor(from + Math.random() * delta);
}

function addition() {
    var calcAnswer = function() { return this.num1 + this.num2 };
    return new Question(random(0,10), random(0,10), "+", calcAnswer);
}

function subtraction() {
    var calcAnswer = function() { return this.num1 - this.num2 };
    return new Question(random(0, 10), random(0, 10), "-", calcAnswer);
}

function multiplication() {
    var calcAnswer = function() { return this.num1 * this.num2 };
    return new Question(random(0, 10), random(0, 10), "*", calcAnswer);
}

function divisionInteger() {
    var divisor = random(1, 10);
    var calcAnswer = function () { return this.num1 / this.num2 };
    return new Question(random(0, 10) * divisor, divisor, "/", calcAnswer);
}

/**********************************************************************/


function createQuestion(type) {

    var q;
    switch (type) {
        case "m": q = multiplication(); break;
        case "d": q = divisionInteger(); break;
        case "s": q = subtraction(); break;
        case "a":
        default:  q = addition(); break;
    }
    questions.push(q);
    active_question = q;
}

function changeQuestion(event) {
    var answer = event.target.value;
    active_question.submitted = Number(answer);
    
    if ( questions.length >= max_questions ) {
        finish();
        return;
    }
        
    createQuestion(question_type);
    cont.innerHTML = renderQuestion(active_question);
    document.getElementById("answer").focus();
}

function finish() {
    console.log("called finished")
    if ( finished == true ) {
        return;
    }
    
    cont.innerHTML = renderResult();
    cont.removeEventListener("keydown");
    finished = true;
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = 0;
        }
    }, 1000);
}

function start(type) {
    question_type = type;
    setTypeHeader(question_type);
    cont = document.getElementById("container");
    cont.addEventListener("keydown", function (e) {
        if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
            changeQuestion(e);
        }
    });
    
    window.setTimeout(finish, timelimit*1000);
    startTimer(timelimit-1, document.getElementById("timer"));
    
    createQuestion(question_type);
    cont.innerHTML = renderQuestion(active_question);
    document.getElementById("answer").focus();
}


function renderQuestion(q) {
    return "<div class='question'>" + q.print() + " = <input type=\"text\" id=\"answer\" autofocus> </div>";
}

function renderResult() {
    var correctly_answered = 0;
    questions.forEach(function(item, index) {
        if ( item.correct() ) {
            correctly_answered++;
        }
    })
    var output = "<div class='results'><h2>You got</h2>" + correctly_answered + " of " + questions.length + " correct";
    return output;
    
}

function setTypeHeader(type) {
    let name;
    switch (type) {
        case "m": name = "Multiplication"; break;
        case "d": name = "Division"; break;
        case "s": name = "Subtraction"; break;
        case "a":
        default:  name = "Addition"; break;
    }
    document.getElementById("typeHeader").innerHtml = name;
}