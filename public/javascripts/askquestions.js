var questions =[
	"1. First prompt", 
	"2. Second prompt", 
	"3. Third prompt",
	"4. Fouth prompt",
	"5. Fifth prompt",
	]

$( document ).ready(function() {
	var numRand = Math.floor(Math.random()*(questions.length))
  	$( "#prompts" ).html(questions[numRand]);
});