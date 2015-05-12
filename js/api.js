var token = '76847686f3cb1b1c50e2796d264bba0c';

var stageURL = 'http://stage.edusynch.com';
var devURL = 'http://develop.edusynch.com';

//keeps track of q # and Total
var qCount = 0;
var qTotal = 0;

function questions() {
	alert("in questions!!!");
}

function exercise(cat) {
	$.ajax({
		type: "POST",
	  	url: devURL + "/api/exercises/new_exercise?token="+token+"&category="+cat,
	  	success: function(data){ 
		    console.log(data);

		    var edusynchNext = devURL + "/api/questions/next_question?token="+token+"&exercise="+data.id;
 
			$.getJSON( edusynchNext, function( q ) {
		    	console.log(q);
		    	var pHTML = "";
		      	var qHTML = "";
		      	var aHTML = "";
		      	var v = q.paragraphs[0];

		      	$(q.paragraphs).each(function(i, p) {
		      		pHTML = '<p class="paragraph-txt-' + i + '">' + p.paragraph_text + '</p>';
		      		$('#paragraphs').append(pHTML);
		      	});
 	 	 
		      	if (v.questions[qCount].question_paragraph != null) {
	      			$('.paragraph-txt-' + qCount).html(v.questions[qCount].question_paragraph);
		      	}

		      	$('.paragraph-txt-' + qCount).addClass('active');

	      		qHTML = '<p>' + v.questions[qCount].description + '</p>';
	      		$('#questions').append(qHTML);

	      		$(v.questions[qCount].alternatives).each(function(index, alt) {
	      			aHTML = '<li><label><input class="li-radio" type="radio" name="question" value="' + alt.id + '"> &nbsp;' + alt.description + '</label></li>';
	      			$('#alts').append(aHTML);
	      		});
		    	
			}); // end getJSON
		} // end success
	});// end Ajax
}// end function exersice


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
	      	var catHTML = '<li><a href="#" onclick="exercise(' + v.id + ')">' + v.name + '</a></li>';
	      	$('#cat-ul').append(catHTML);
	      });

	    });
	}); // end categoires click

	$('#new_passage').click(function() {
		$('#questions').html('');
		$('#alts').html('');
		$('#paragraphs').html('');
		exercise(1);
	}); //end new exercise click

});