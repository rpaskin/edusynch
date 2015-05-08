var token = '76847686f3cb1b1c50e2796d264bba0c';

function exercise(cat) {
	$.ajax({
	  type: "POST",
	  url: "http://develop.edusynch.com/api/exercises/new_exercise?token="+token+"&category="+cat,
	  success: function(data){ 

		    console.log(data);

		    var edusynchNext = "http://develop.edusynch.com/api/questions/next_question?token="+token+"&exercise="+data.id;
 
			$.getJSON( edusynchNext, function( q ) {
		      console.log(q);

		      $(q.paragraphs).each(function(i, v) {
		      	var pHTML = '<p>' + v.paragraph_text + '</p>';
		      	$('#paragraphs').append(pHTML);

		      	$(v.questions).each(function(index, q) {

		      		$('#q-cat').html(q.category);

		      		var qHTML = '<p>' + q.description + '</p>';
		      		$('#questions').append(qHTML);

		      		$(q.alternatives).each(function(index, alt) {

		      			var aHTML = '<li><input type="radio" name="question" value="' + alt.id + '">' + alt.description + '</li>';
		      			$('#alts').append(aHTML);

		      		});
		      	});

		      });

			});
		}
	});
}


$(function() {
  // Handler for .ready() called.

	$("#login").click(function(){

		var edusynchAPI = "http://develop.edusynch.com/api/students/login?type=native&email=macksuel@edusynch.com&password=test";
	    $.getJSON( edusynchAPI, function( data ) {
	      	console.log(data);
	    });
	});

	$("#categories").click(function(){

		var edusynchCats = "http://develop.edusynch.com/api/categories/all?token="+token;
 
		$.getJSON( edusynchCats, function( data ) {
	      console.log(data);

	      $(data).each(function(i, v) {
	      	var catHTML = '<li><a href="#" onclick="exercise(' + v.id + ')">' + v.name + '</a></li>';
	      	$('#cat-ul').append(catHTML);
	      });

	    });

	});

});