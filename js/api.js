var token = '76847686f3cb1b1c50e2796d264bba0c';

var stageURL = 'http://stage.edusynch.com';
var devURL = 'http://develop.edusynch.com';

//keeps track of q # and p #
var qCount = 0;
var pCount = 0;
var currentExercise = {};

function skip() {
	$('#nextq').hide();
	$('.qresult').hide(); 
	qCount++;
	if (currentExercise.paragraphs[pCount].questions.length > qCount) {
		doExercise(currentExercise);
	} else {
		qCount = 0;
		$('.paragraph-txt-' + pCount).html(currentExercise.paragraphs[pCount].paragraph_text);
		$('.p-text').removeClass('active');

		pCount++;
		if (currentExercise.paragraphs.length > pCount) {
			doExercise(currentExercise);
		} else {
			alert('end of exercise');
			pCount = 0;
			nextExercise();
		}
	}
}

function doExercise(q) {
	console.log(q);
  	var qHTML = "";
  	var aHTML = "";
  	var v = q.paragraphs[pCount];

  	$('#questions').html('');
  	$('#alts').html('');


  	$('.qbtn').show();
	 
  	if (v.questions[qCount].question_paragraph != null) {
		$('.paragraph-txt-' + pCount).html(v.questions[qCount].question_paragraph);
  	} else {
  		$('.paragraph-txt-' + pCount).html(v.paragraph_text);
  	}

  	$('.paragraph-txt-' + pCount).addClass('active');

	qHTML = '<p>' + v.questions[qCount].description + '</p>';
	$('#questions').append(qHTML);

	$(v.questions[qCount].alternatives).each(function(index, alt) {
		aHTML = '<li><label><input class="li-radio" type="radio" name="question" value="' + alt.right + '"> &nbsp;' + alt.description + '</label></li>';
		$('#alts').append(aHTML);
	});
}

function getExercise(cat) {

	$.ajax({
		type: "POST",
	  	url: devURL + "/api/exercises/new_exercise?token="+token+"&category="+cat,
	  	success: function(data){ 
		    console.log(data);

		    var edusynchNext = devURL + "/api/questions/next_question?token="+token+"&exercise="+data.id;
 
			$.getJSON( edusynchNext, function( q ) {
				currentExercise = q;
				var pHTML = "";

				$(q.paragraphs).each(function(i, p) {
			  		pHTML = '<p class="p-text paragraph-txt-' + i + '">' + p.paragraph_text + '</p>';
			  		$('#paragraphs').append(pHTML);
			  	});

				doExercise(q);
		    	
			}); // end getJSON
		} // end success
	});// end Ajax
}// end function exersice

function nextExercise() {
	$('#questions').html('');
	$('#alts').html('');
	$('#paragraphs').html('');
	getExercise(1);
}

$(function() {

	$("#login").click(function(){

		var edusynchAPI = devURL + "/api/students/login?type=native&email=macksuel@edusynch.com&password=test";
	    $.getJSON( edusynchAPI, function( data ) {
	      	console.log(data);
	    });
	}); //end login click

	$("#categories").click(function(){

		var edusynchCats = devURL + "/api/categories/all?token="+token;
 
		$.getJSON( edusynchCats, function( data ) {
	      console.log(data);

	      $(data).each(function(i, v) {
	      	var catHTML = '<li><a href="#" onclick="getExercise(' + v.id + ')">' + v.name + '</a></li>';
	      	$('#cat-ul').append(catHTML);
	      });

	    });
	}); // end categoires click

	$('#new_passage').click(function() {
		nextExercise();
	}); //end new exercise click
 
	$('#skip').click(function() {
		skip();
	});

	$('#nextq').click(function() {
		skip();
	});

	$('#qsubmit').click(function() {
		var right = $("input:radio[name='question']:checked").val();
		console.log(right);

		if(right == 'true') {
			$('#qright').show();
		} else {
			$('#qwrong').show();
		}

		$('#nextq').show();

	});


});