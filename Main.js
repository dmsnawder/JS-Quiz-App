/**
 * Created by David Snawder on 7/27/2016.
 */

var val = "";
var score = 0;
var questionIndex = 0;
/*
var theQuestions = [{
    question0: "How many pancakes do you think I can eat?",
    choices: ["All of them.", "Just one.", "Like a short stack or something.",
                "Trick question, they're waffles."],
    answer: 3
}, {
    question1: "In the show Firefly, what is the name of the main ship?",
    choices: ["Firefly","Star Cruiser","Serenity","Trick question, it's a movie."],
    answer: 2
}, {
    question2: "Books.",
    choices: ["Ehh.","Mmmm","CDs...What are we doing?","Ehh!"],
    answer: 3
}, {
    question3: "Who was the original drummer for the band Toto?",
    choices: ["Mike Portnoy","Jeff Porcaro","Griffin Goldsmith","Me"],
    answer: 1
}

];
*/
function initialize() {

    $('.card1').hide();
    $('.card2').hide();
    $('.card3').hide();
    $('.card4').hide();
    $('#retry').hide();

    val = "";
    score = 0;
    questionIndex = 0;
}

$(document).ready(function() {

    initialize();
    $('card0').show();
    var next = $('#next');
    var retry = $('#retry');
    var progressBar = $('#progressBar');
    var radioButton = $('input:radio');

    radioButton.click(function () {
        val = $('input:radio:checked').val();
    });

    next.click(function () {

        if (!$('input:radio:checked').val()) {
            alert('You did not provide an answer!');
        }
        else {
            radioButton.prop("checked", false);

            var theAnswer = theQuestions[questionIndex].answer;

            if (val === theQuestions[questionIndex].choices[theAnswer]) {
                score++;
            }

            var currentCard = $(".card" + questionIndex);
            var nextCard = currentCard.next();

            if (questionIndex < theQuestions.length-1) {
                currentCard.hide();
                nextCard.show();
            }
            else if (questionIndex == theQuestions.length-1) {
                currentCard.hide();
                nextCard.show();
                next.hide();
                retry.show();

                var endText = document.createTextNode("You finished the quiz! You got " +
                    score + " out of " + theQuestions.length + " questions correct!");

                var done = document.getElementById('done');

                done.replaceChild(endText, done.childNodes[0]);

            }

            questionIndex++;
            moveProgress();
        }
    });

    retry.click(function() {

        $('.card0').fadeIn();
        next.fadeIn();
        radioButton.prop("checked", false);
        initialize();
        moveProgress();

    });

    function moveProgress() {
        var newWidth = (questionIndex / theQuestions.length) * 100;
        progressBar.css("width", newWidth + "%");
    }

});
