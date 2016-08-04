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
]; */

$(document).ready(function() {

    var message = document.getElementById('message');
    var myCookie = CookieUtil.get('name');
    var nameInput = document.getElementById('name');
    var addNameButton = document.getElementById('addName');

    if (myCookie) {
        nameInput.value = myCookie;
    }

    Welcome();

    EventUtil.addHandler(nameInput, 'focus', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        target.value = "";
    });

    function Welcome() {
        if (myCookie) {
           message.innerHTML = "Hi " + myCookie + ", if this is not you, please enter your name below!";
        }
        else {
            message.innerHTML = "Please enter your name: ";
        }
    }

    function addUserName() {
        if (nameInput.value !== "") {
            myCookie = nameInput.value;
            CookieUtil.set('name', myCookie);

            $('#myTabs a[href="#tab-home"]').trigger('click');
        }
        else {
            window.alert("Please enter a name");
        }
    }

    EventUtil.addHandler(addNameButton, 'click', function(event) {
        addUserName();
    });


    Quiz(quiz1, 1);
    Quiz(quiz2, 2);

    function Quiz(quizData, num) {

        var val = "",
            score = 0,
            questionIndex = 0,
            userChoices = [],
            theQuestions = quizData;

        var question = $('.question' + num),
            next = $('#next' + num),
            back = $('#back' + num),
            retry = $('#retry' + num),
            progressBar = $('#progressBar' + num),
            radioButton = $('input:radio');

        $('.score' + num).hide();
        retry.hide();
        back.hide();

        var quizNameText = document.createTextNode("Quiz " + num);
        var quizName = document.getElementById('quizName' + num);
        quizName.replaceChild(quizNameText, quizName.childNodes[0]);

        displayQuestion();

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
                        $('.quizArea' + num).hide();
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
            $('.score' + num).hide();
            $('.quizArea' + num).show();
            next.show();
            retry.hide();
            radioButton.prop("checked", false);
            val = "";
            score = 0;
            questionIndex = 0;
            moveProgress();
            displayQuestion();
        });

        function displayQuestion() {

            var theTemplateScript = $("#qtn-template").html();
            var theTemplate = Handlebars.compile(theTemplateScript);
            question.append(theTemplate(theQuestions[questionIndex]));

            question.fadeIn("slow");
        }

        function clearQuestion() {
            question.empty();
        }

        function fadeOutQuestion() {
            question.fadeOut("slow", function() {
                $(this).css({visibility: "visible"}).fadeIn("slow");
            });
        }

        function displayScore() {
            $('.score' + num).show();

            for (var i=0, len=theQuestions.length; i < len; i++) {
                if (userChoices[i] === theQuestions[i].choices[theQuestions[i].answer]) {
                    score++;
                }
            }

            var endText = document.createTextNode("You finished the quiz! You got " +
                score + " out of " + theQuestions.length + " questions correct!");

            var done = document.getElementById('done' + num);

            done.replaceChild(endText, done.childNodes[0]);
        }

        function moveProgress() {
            var newWidth = (questionIndex / theQuestions.length) * 100;
            progressBar.css("width", newWidth + "%");
        }

    }
});