/**
 * Created by David Snawder on 7/29/2016.
 */
/*
var theQuestions = [{
  theQuestion: "How many pancakes do you think I can eat?",
  choices: ["All of them.", "Just one.", "Like a short stack or something.",
    "Trick question, they're waffles."],
  answer: 3
}, {
  theQuestion: "In the show Firefly, what is the name of the main ship?",
  choices: ["Firefly","Star Cruiser","Serenity","Trick question, it's a movie."],
  answer: 2
}, {
  theQuestion: "Books.",
  choices: ["Ehh.","Mmmm","CDs...What are we doing?","Ehh!"],
  answer: 3
}, {
  theQuestion: "Who was the original drummer for the band Toto?",
  choices: ["Mike Portnoy","Jeff Porcaro","Griffin Goldsmith","Me"],
  answer: 1
}
]
*/

$(document).ready(function() {

    Quiz("quiz1.json");

    function Quiz(quizData) {

        var val = "",
            score = 0,
            questionIndex = 0,
            userChoices = [],
            theQuestions;

        var question = $('.question'),
            next = $('#next'),
            back = $('#back'),
            retry = $('#retry'),
            progressBar = $('#progressBar'),
            radioButton = $('input:radio');

        $('.score').hide();
        retry.hide();
        back.hide();

        // Get quiz data from separate JSON file and assign it to object 'theQuestions'
        $.ajax(quizData, {
            success: function(response) {
                theQuestions = response;
                displayQuestion();
            },
            error: function(request, errorType, errorMessage) {
                window.alert('Error: ' + errorType + ' with response ' + errorMessage);
            },
            timeout: 3000
        });


        function displayQuestion() {
            question.fadeIn("slow");

            question.append('<h2 style="margin-top: 20px; margin-bottom: 40px; color: darkslategray" ' +
                'align="center">' + theQuestions[questionIndex].theQuestion + '</h2>');

            for (var i=0, len=theQuestions[questionIndex].choices.length; i < len; i++) {
                question.append('<p><input type=\'radio\' name=\'card0\' value="' +
                    theQuestions[questionIndex].choices[i] + '"/>' +
                    theQuestions[questionIndex].choices[i] + '</p>');
            }

        }

        next.click(function () {
            var checkedRadioButton = $('input:radio:checked');

            if (!checkedRadioButton.val()) {
                window.alert('You did not provide an answer!');
            }
            else {
                val = checkedRadioButton.val();
                userChoices[questionIndex] = val;

                if (questionIndex < theQuestions.length-1) {

                    if (questionIndex === 0) {
                        back.show();
                    }

                    fadeOutQuestion();
                    next.prop("disabled", true);
                    setTimeout(function() {
                        clearQuestion();
                        questionIndex++;
                        moveProgress();
                        displayQuestion();
                        next.prop("disabled", false);
                    }, 500);

                }
                else if (questionIndex === theQuestions.length-1) {
                    fadeOutQuestion();

                    setTimeout(function() {
                        clearQuestion();
                        $('.quizArea').hide();
                        questionIndex++;
                        moveProgress();
                        next.hide();
                        back.hide();
                        retry.show();
                        displayScore();
                    }, 500);
                }
            }
        });

        back.click(function() {
            fadeOutQuestion();
            back.prop("disabled", true);
            questionIndex--;

            setTimeout(function() {
                clearQuestion();
                moveProgress();
                displayQuestion();
                back.prop("disabled", false);

                $('input:radio').each(function() {
                    if ($(this).val() === userChoices[questionIndex]) {
                        $(this).prop('checked', true);
                    }
                });

                if (questionIndex === 0) {
                    back.hide();
                }

            }, 500);

        });

        retry.click(function() {
            $('.score').hide();
            $('.quizArea').show();
            next.show();
            retry.hide();
            radioButton.prop("checked", false);
            val = "";
            score = 0;
            questionIndex = 0;
            moveProgress();
            displayQuestion();
        });

        function clearQuestion() {
            question.empty();
        }

        function fadeOutQuestion() {
            question.fadeOut("slow", function() {
                $(this).css({visibility: "visible"}).fadeIn("slow");
            });
        }

        function displayScore() {
            $('.score').show();

            for (var i=0, len=theQuestions.length; i < len; i++) {
                if (userChoices[i] === theQuestions[i].choices[theQuestions[i].answer]) {
                    score++;
                }
            }

            var endText = document.createTextNode("You finished the quiz! You got " +
                score + " out of " + theQuestions.length + " questions correct!");

            var done = document.getElementById('done');

            done.replaceChild(endText, done.childNodes[0]);
        }

        function moveProgress() {
            var newWidth = (questionIndex / theQuestions.length) * 100;
            progressBar.css("width", newWidth + "%");
        }

    }
});