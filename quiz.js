/**
 * Created by David Snawder on 7/29/2016.
 */

$(document).ready(function() {

    Quiz("quiz1.json");

    function Quiz(quizData) {

        var val = "";
        var score = 0;
        var questionIndex = 0;

        var question = $('.question');
        var next = $('#next');
        var retry = $('#retry');
        var progressBar = $('#progressBar');
        var radioButton = $('input:radio');
        var theQuestions;

        $('.card4').hide();
        retry.hide();

        // Get quiz data from separate JSON file and assign it to object 'theQuestions'
        $.ajax(quizData, {
            success: function(response) {
                theQuestions = response;
                displayQuestion();
            },
            error: function(request, errorType, errorMessage) {
                alert('Error: ' + errorType + ' with response ' + errorMessage);
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
                alert('You did not provide an answer!');
            }
            else {
                val = checkedRadioButton.val();

                radioButton.prop("checked", false);

                var theAnswer = theQuestions[questionIndex].answer;
                if (val === theQuestions[questionIndex].choices[theAnswer]) {
                    score++;
                }

                if (questionIndex < theQuestions.length-1) {
                    fadeOutQuestion();
                    setTimeout(function() {
                        clearQuestion();
                        questionIndex++;
                        moveProgress();
                        displayQuestion();
                    }, 500);

                }
                else if (questionIndex == theQuestions.length-1) {
                    fadeOutQuestion();

                    setTimeout(function() {
                        clearQuestion();
                        $('.quizArea').hide();
                        questionIndex++;
                        moveProgress();
                        $('.card4').show();
                        next.hide();
                        retry.show();
                    }, 500);

                    var endText = document.createTextNode("You finished the quiz! You got " +
                        score + " out of " + theQuestions.length + " questions correct!");

                    var done = document.getElementById('done');

                    done.replaceChild(endText, done.childNodes[0]);
                }
            }
        });

        retry.click(function() {
            $('.card4').hide();
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

        function moveProgress() {
            var newWidth = (questionIndex / theQuestions.length) * 100;
            progressBar.css("width", newWidth + "%");
        }

    }
});