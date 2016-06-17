$(document).ready(function() {



function findpostwords()  {
	var thebox = $('#playarea');
	var xbase = thebox.position().left;
	var ybase = thebox.position().top;
	var postwords = new Array();
	$('#playarea').find(".inplay").each(function(index) {
		postword = new Object();
		postword.lexicon = $(this).attr('id').replace("w","");
		postword.left = $(this).position().left - xbase;
		postword.top = $(this).position().top - ybase;
		postword.zindex = $(this).css('z-index');
		postwords[index] = postword;
	});
	return postwords
}

var thing = {plugin: 'jquery-json', version: 2.3};

var encoded = $.toJSON( thing );
var name = $.evalJSON( encoded ).plugin;
var version = $.evalJSON(encoded).version;

var ptitle = $( "#ptitle" ),
    ptitlereply = $( "#ptitlereply" ),
    fromname = $( "#fromname" ),
    fromnamereply = $( "#fromnamereply" ),
    fromemail = $( "#fromemail" ),
    toname = $( "#toname" ),
    toemail = $( "#toemail" ),
    message = $( "#message" ),
    messagereply = $( "#messagereply" ),
    kitid = $( "#kitid" ),
    kitidreply = $( "#kitidreply" ),
    poemid = $( "#poemid" );
    poemidreply = $( "#poemidreply" );



$(".draggable").hide();
$(".draggable").css({'visibility':'visible'});
$("#wordbin").hide();
$("#wordbin").css({'visibility':'visible'});

$( "input:submit, a, button", ".footerbar" ).button();


$(".draggable").addClass("inbin ui-corner-all");
$(".draggable").addTouch();
$("#playarea").addTouch();
$(".draggable").draggable({scroll: true, containment: '#playarea',  stack:'.draggable',
	stop: function(event, ui) {
		if ( $(this).hasClass('inbin')) {
			var posWord = $(this).offset();
			var prevWord = $(this).prev();
			$(this).appendTo("#playarea");
			$(this).offset(posWord);
			$(prevWord).after($(this).clone().css({'visibility':'hidden'}) );
			$(this).toggleClass("inplay inbin");
		}
	},
} );

$(".draggable").each(function(index) {
	var transformRand = Math.random()*2.5;
	if (Math.random() < 0.5) {
		transformRand = -1 * transformRand;
	}
	var transString = 'rotate(' + transformRand +'deg)';
	$(this).css({ '-moz-transform':transString });
	$(this).css({ '-webkit-transform':transString });
	$(this).css({ '-o-transform':transString });
	$(this).css({ '-ms-transform':transString });
	$(this).css({ 'transform':transString });
});

var MaxWordPages = 7

$(".draggable").each(function(index) {
	var wordSet = Math.floor(Math.random()*MaxWordPages);
	$(this).addClass("wordset" + wordSet);
});



currentWordset = 0;
$('#wordbin').fadeIn('slow');
$('.wordset' + currentWordset).show();


  $("#swapWordsForm").submit(function(event) {
      /* stop form from submitting normally */
      event.preventDefault();
      $("#swapWordsForm").hide();

      $('.wordset' + currentWordset).filter('.inbin').hide();
      $('#wordbin').hide();

      	currentWordset++;
	if (currentWordset == MaxWordPages) {
	  currentWordset = 0;
	  }


      $("#swapWordsForm").fadeIn(400);
     $('#wordbin').fadeIn(250);
     $('.wordset' + currentWordset).filter('.inbin').show();

   });

  $("#gameRestart").submit(function(event) {
      /* stop form from submitting normally */
      	event.preventDefault();

	$( "#dialog-confirm" ).dialog({
			resizable: false,
			height:200,
			modal: true,
			buttons: {
				"Start Over": function() {
				$( this ).dialog( "close" );
				$("#wordbin").fadeOut("slow");
				$("#playarea").fadeOut("slow");
				window.location.assign('http://play.magneticpoetry.com/poem/Mustache/kit');
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
	});


   });
  $("#gameDone").submit(function(event) {
      /* stop form from submitting normally */
      event.preventDefault();

	$( "#dialog-done" ).dialog({
			resizable: true,
			height:650,
			width:450,
			modal: true,
			buttons: {
				"Done": function() {
				$( this ).dialog( "close" );

				var postwords = findpostwords();

				var ptitlestr = ptitle.attr('value');
				var author = fromname.attr('value');
				if (ptitlestr.length == 0) { ptitlestr = 'untitled magnetic poem' ;}
				if (author.length == 0) { author = 'anonymous' ;}
				postdata = { fromemail: fromemail.attr('value'), title: ptitlestr, fromname:author, toname:toname.attr('value'), toemail:toemail.attr('value'), message:message.attr('value'), kitid:kitid.attr('value'), poemid:poemid.attr('value'), words:postwords};
				$.post( '/poem/post',  $.toJSON(postdata), function( data ) {
					window.location.href=data['purl'];
				 }, 'JSON' );


				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
	});
   });


  $("#gameReply").submit(function(event) {
      /* stop form from submitting normally */
      event.preventDefault();

	$( "#dialog-reply" ).dialog({
			resizable: true,
			height:450,
			width:450,
			modal: true,
			buttons: {
				"Done": function() {
				$( this ).dialog( "close" );
				var postwords = findpostwords();

				var ptitlestr = ptitlereply.attr('value');
				var author = fromnamereply.attr('value');
				if (ptitlestr.length == 0) { ptitlestr = 'untitled magnetic poem' ;}
				if (author.length == 0) { author = 'anonymous' ;}
				postdata = { title: ptitlestr, fromname:author,  message:messagereply.attr('value'), kitid:kitidreply.attr('value'), poemid:poemidreply.attr('value'), words:postwords ,replyOK:true};
				$.post( '/poem/post',  $.toJSON(postdata), function( data ) {
					window.location.href=data['purl'];
				 }, 'JSON' );

				},

				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
	});
   });







      });
