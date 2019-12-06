/**
 * Libs for kids-math;
 * 
 * Author: geoff golliher brokenway@gmail.com
 * 
 */

var KidsMathAbstract = function() {};

var KidsMathProblemWorker = function() {
  this.currentSet = undefined;
  this.use_exp = true;
  this.baseSetNum = undefined;
  this.baseReward = 0;
  this.rewardStep = 0.50;
};

KidsMathProblemWorker.prototype = new KidsMathAbstract();
KidsMathProblemWorker.prototype.baseSetNum = undefined;
KidsMathProblemWorker.prototype.nums = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
KidsMathProblemWorker.prototype.baseMults = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

KidsMathProblemWorker.prototype.problemAnswers = {
  pid: 0,
  pids: [],
  problems: {},
  answers: {},
  problemTries: {},
  correct: 0,
  incorrect: 0,
  push: function(problem, answer) {
    this.problems[this.pid] = problem;
    this.answers[this.pid] = answer;
    this.pid = this.pids.push(this.pid);
  },
  incrementProblemTries: function(pid) {
	if (this.problemTries[pid] == undefined) {
	  this.problemTries[pid] = 1;
	} else {
	  this.problemTries[pid] += 1;
	}
  },
  getAnswerById: function(id) {
	return this.answers[id];
  },
  getProblemById: function(id) {
	return this.problems[id];
  },
  getProblemAnswerById: function(id) {
	var problem = this.getProblemById(id);
	var answer = this.getAnswerById(id);
	return {problem: answer};
  }
};

KidsMathProblemWorker.prototype.createProblemSet = function(num) {
  var problems = [];
  this.baseSetNum = num;
  for (var i = 0; i < this.baseMults.length; ++i) {
	problems[i] = num + ',' + this.baseMults[i];
  }
  this.currentSet = problems;
  return problems;
};

KidsMathProblemWorker.prototype.solveProblem = function(pair) {
  var pairArray = pair.split(',');
  return pairArray[0] * pairArray[1];
};

KidsMathProblemWorker.prototype.solveProblemSet = function(set) {
  var solutions = {};
  for (var i = 0; i < this.baseMults.length; ++i) {
	solutions[set[i]] = this.solveProblem(set[i]);
  }
  return solutions;
};

KidsMathProblemWorker.prototype.setBaseSetNum = function(num) {
  this.baseSetNum = num;
  var set = this.createProblemSet(num);
  this.showSingleProblemNode(set);
  this.buildProblemSetDom(set, true);
};

KidsMathProblemWorker.prototype.getBaseSetNum = function() {
  return this.baseSetNum;
};

var KidsMathDom = function() {
  this.currentProblem = 0;
  this.currentPair = undefined;
  this.showKey = undefined;
};

KidsMathDom.prototype = new KidsMathProblemWorker();

KidsMathDom.prototype.buildSetList = function() {
  var baseElement = document.getElementById("sets");
  for (var i = 0; i < this.nums.length; ++i) {
	var setElement = document.createElement("div");
	setElement.setAttribute("class", "set-element");
	setElement.setAttribute("onClick", "km.setBaseSetNum(" + this.nums[i] + ")");
	var setText = document.createTextNode(this.nums[i] + "'s");
	setElement.appendChild(setText);
	baseElement.appendChild(setElement);
  }
};

KidsMathDom.prototype.buildProblemSetDom = function(set, opt_answers) {
  var baseElement = document.getElementById("key");
  baseElement.innerHTML = "<legend>Key</legend>";
  baseElement.style.visibility = this.showKey ? "visible" : "hidden";
  var fset = opt_answers ?
	  this.buildProblemSetDomWithAnswers(this.solveProblemSet(set), baseElement) :
		this.buildProblemSetDomNoAnswers(set, baseElement);
  return fset;
};

KidsMathDom.prototype.buildProblemSetDomWithAnswers = function(fset, element) {
  for (node in fset) {
	var problem = this.use_exp ? node.replace(",", " x ") + " = " : node.replace(",", "");
	this.buildTextWithBreak(problem + " " + fset[node], element);
  }
};

KidsMathDom.prototype.buildProblemSetDomNoAnswers = function(fset, element) {
  for (var i = 0; i < fset.length; ++i) {
	var problem = this.use_exp ? fset[i].replace(",", " x ") + " = ?" : fset[i].replace(",", "");
	this.buildTextWithBreak(problem, element);
  }
};

KidsMathDom.prototype.buildTextWithBreak = function(text, element) {
  var ptext = document.createTextNode(text);
  var breakLine = document.createElement("br");
  element.appendChild(ptext);
  element.appendChild(breakLine);
};

KidsMathDom.prototype.cleanProblemNode = function(node) {
  var problemIn = document.getElementById("problem-input");
  var problemHid = document.getElementById("problem-hidden");
  if (problemIn != undefined && problemHid != undefined) {
    node.removeChild(problemIn);
    node.removeChild(problemHid);
  }
};

KidsMathDom.prototype.cleanAndBuildProblemNode = function(set, opt_exp) {
  var problemNode = document.getElementById("problem");
  this.cleanProblemNode(problemNode);
  var problemInput = document.createElement("input");
  var problemHidden = document.createElement("input");
  problemHidden.setAttribute("type", "hidden");
  problemHidden.setAttribute("id", "problem-hidden");
  problemHidden.setAttribute("value", set[this.currentProblem]);
  problemInput.setAttribute("id", "problem-input");
  problemInput.setAttribute("class", "problem-input");
  if (opt_exp || this.use_exp) {
	var problem = set[this.currentProblem].replace(",", " x ") + " = ?";
  } else {
    var problem = set[this.currentProblem].replace(",", "");
  }
  problemInput.setAttribute("value", problem);
  problemInput.setAttribute("readonly", "readonly");
  problemNode.appendChild(problemInput);
  problemNode.appendChild(problemHidden);
  answer.focus();
};

KidsMathDom.prototype.showSingleProblemNode = function(set, opt_exp) {
  console.log(this.currentProblem);
  console.log(Math.max.apply(Math, this.nums));
  if (this.currentProblem == set.length) {
    var maxSet = Math.max.apply(Math, this.nums);
    if ((this.baseSetNum + 1) >= maxSet) {
      alert("All Done!!");
      return;
    } else {
      this.baseSetNum += 1;
      set = this.createProblemSet(this.baseSetNum);
      this.buildProblemSetDom(set, true);
      this.currentProblem = 0;
    }
  }
  this.cleanAndBuildProblemNode(set, opt_exp);
};

KidsMathDom.prototype.buildSubmitAnswerButton = function() {
  var button = document.createElement("div");
  var buttonContainer = document.getElementById("navs");
  button.setAttribute("id", "answer-button");
  button.setAttribute("class", "answer-button");
  button.setAttribute("onClick", "km.checkAnswerNode()");
  button.innerHTML = "Check Answer";
  buttonContainer.appendChild(button);
  var answerInput = document.getElementById("answer");
  answerInput.setAttribute("onkeypress", "km.checkKeyCode(event)");
};

// bug in this function.
KidsMathDom.prototype.updateScore = function() {
  var baseNode = document.getElementById("score");
  var more = this.currentSet.length - this.problemAnswers.correct;
  var totalAnswers = this.problemAnswers.correct + this.problemAnswers.incorrect;
  var percentage = (this.problemAnswers.correct / totalAnswers) * 100;
  var stepMult = this.problemAnswers.correct / totalAnswers;
  this.baseReward = this.baseReward * stepMult;
  baseNode.innerHTML = this.problemAnswers.correct + " correct so far!";
  baseNode.innerHTML += "<br /> Correct percentage: " + percentage.toFixed(2) + "%";
  baseNode.innerHTML += "<br /><br /> Reward so far: $" + this.baseReward.toFixed(2);
};

KidsMathDom.prototype.checkAnswerNode = function() {
  var inputValue = document.getElementById("answer").value;
  var problemCurrent = document.getElementById("problem-input").value;
  var problemValue = document.getElementById("problem-hidden").value;
  var correctAnswer = this.solveProblem(problemValue);
  var answer = document.getElementById("answer");
  if (correctAnswer == inputValue) {
	this.problemAnswers.incrementProblemTries(this.currentProblem);
	this.problemAnswers.push(problemCurrent, inputValue);
	this.currentProblem += 1;
	this.problemAnswers.correct += 1;
	this.baseReward += this.rewardStep;
	this.updateScore();
	this.showSingleProblemNode(this.currentSet, this.use_exp);
	answer.setAttribute("class", "answer");
	answer.value = '';
	answer.focus();
  } else {
	this.problemAnswers.incorrect += 1;
	this.problemAnswers.incrementProblemTries(this.currentProblem);
	this.updateScore();
	answer.setAttribute("class", "answer-inc");
	answer.focus();
  }
};

KidsMathDom.prototype.checkKeyCode = function(e) {
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) {
	this.checkAnswerNode();
  }
};

KidsMathDom.prototype.toggleMode = function(node) {
  var toggleVal = node.getAttribute("state");
  var newState = (toggleVal == "true") ? false : true;
  var togMessage = (toggleVal == "true") ? "Expanded" : "Combined";
  var currentState = (toggleVal == "true") ? "Combined" : "Expanded";
  var togState = (toggleVal == "true") ? "false" : "true";
  var ptype = document.getElementById("ptype");
  ptype.innerText = "Type: " + currentState;
  this.use_exp = newState;
  node.innerHTML = togMessage;
  node.setAttribute("state", togState);
  console.log(this.baseSetNum);
  var set = this.createProblemSet(this.baseSetNum);
  this.showSingleProblemNode(set);
  this.buildProblemSetDom(set, true);
};

KidsMathDom.prototype.toggleKey = function(node) {
  var toggleVal = node.getAttribute("state");
  var newState = (toggleVal == "true") ? false : true;
  var togMessage = newState ? "Hide Key" : "Show Key";
  var togState = (toggleVal == "true") ? "false" : "true";
  var key = document.getElementById("key");
  key.style.visibility = newState ? "visible" : "hidden";
  this.showKey = newState;
  node.setAttribute("state", togState);
  node.innerHTML = togMessage;
};

var KidsMath = function() {};
KidsMath.prototype = new KidsMathDom();


