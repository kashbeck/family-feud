import Vue from "./vue/2.5.21/vue.esm.browser.min.js";

var isInitialized = false;
var vueApp = null;

function convertToJson(text) {
  var lines = text.split('\n');
  var json = {};
  
  lines.forEach(function(line) {
    convertLineToJson(line, json);
  });
  
  return json;
}

function convertLineToJson(line, json) {
  //"Tell me something specific you have lost more than once":[["Keys",63],["Money",7],["Weight",5],["Contact Lens",4],["Eyeglasses",4],["Wallet",3],["Earring",2]],
  
  var fields = line.split('\t');
  
  // need at least question text and two questions/answers
  if (fields.length < 5) {
    return;
  }
  
  var question = fields[0];
  question = encodeQuestion(question);
  
  // question already exists
  if (json[question]) {
    return;
  }
  
  json[question] = [];
  
  // return new array (removing question)
  var answersAndPoints = fields.slice(1);
  
  var answer, points;
  for (var i = 0; i < answersAndPoints.length; i = i + 2) {
    answer = answersAndPoints[i];
    points = answersAndPoints[i + 1];
    
    if (answer && points) {
      json[question].push([ answer, points ]);
    }
  };
}

function encodeQuestion(text) {
  return text.replace(new RegExp('"', 'g'), "&x22;");
}

export function init() {

  if (isInitialized) {
    return;
  }
  
  vueApp = new Vue({
     
    el: '#app',
    data: function() {
      return {
        inputText: "",
        convertedText: ""
      }
    },
    
    methods: {
      
      onBtnConvertClicked: function() {
        this.convertedText = convertToJson(this.inputText);
      }
      
    },
    
    mounted: function() {
      // alert("HERE");
    }
    
  });
  
  isInitialized = true;
  return vueApp;
}