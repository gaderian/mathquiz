function random(from, to) {
    var delta = (to - from) +1;
    return Math.floor(from + Math.random()*delta)
}

function construct(a, b, op, ans) {
    var correct = function() { return (this.submitted == this.answer()) }
    var print = function() { return this.a + " " + this.operator + " " + this.b }
    return {a: a, b: b, answer: ans, operator: op, submitted: null, correct: correct, print: print}
}

function addition() {
    var calcAnswer = function() { return this.a + this.b }
    return construct(random(0,9), random(0,9), "+", calcAnswer)
}

function subtraction() {
    var calcAnswer = function() { return this.a - this.b }
    return construct(random(0,9), random(0,9), "-", calcAnswer)
}

function multiplication() {
    var calcAnswer = function() { return this.a * this.b }
    return construct(random(0,9), random(0,9), "*", calcAnswer)
}

function division_integer() {
    var divisor = random(1,9)
    var calcAnswer = function() { return this.a / this.b }
    return construct(random(0,9)*divisor, divisor, "/", calcAnswer)
}

function createQuestion(type) {

    switch (type) {
        case "*":
            return multiplication();
            break;
        case "/":
            return division_integer();
            break;
        case "-":
            return subtraction();
            break;
        case "+":
        default:
            return addition();
            break;
    }
}

function renderQuestion(q) {
    return "<div class='question'>" + q.print() + " = _</div>"
}
