/**
 * Created by David Snawder on 7/29/2016.
 */

$(document).ready(function() {

/* Code for Log-In tab content */

    //Variables dealing with log-in page and user name cookie
    var message = document.getElementById('message');
    var myCookie = CookieUtil.get('name');
    var nameInput = document.getElementById('name');
    var addNameButton = document.getElementById('addName');

    //If user has logged in before, put user name in text field on log-in page
    if (myCookie) {
        nameInput.value = myCookie;
    }

    Welcome();

    //When user clicks inside text field to type, delete any existing text
    EventUtil.addHandler(nameInput, 'focus', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);
        target.value = "";
    });

    //Display welcome message for returning user or new user.
    //Called above.
    function Welcome() {
        if (myCookie) {
           message.innerHTML = "Hi " + myCookie + ", if this is not you, please enter your name below!";
        }
        else {
            message.innerHTML = "Please enter your name: ";
        }
    }

    //Get text from text field inputted by user and save it as a cookie.
    //Called when user clicks submit button.
    function addUserName() {
        if (nameInput.value !== "") {
            myCookie = nameInput.value;
            CookieUtil.set('name', myCookie);

            $('#myTabs a[href="#tab-home"]').trigger('click');

            $('loginmessage').innerHTML = "";
        }
        else {
            window.alert("Please enter a name");
        }
    }

    //Event for log-in submit button
    EventUtil.addHandler(addNameButton, 'click', function(event) {
        addUserName();
    });


/* Code for quizzes */

    //Call quiz function for each quiz
    Quiz(quiz1, 1);
    Quiz(quiz2, 2);
    Quiz(quiz3, 3);

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

        //display appropriate quiz title on page
        //var quizNameText = document.createTextNode("Quiz " + num);
        //var quizName = document.getElementById('quizName' + num);
        //quizName.replaceChild(quizNameText, quizName.childNodes[0]);

        displayQuestion();

        //When user clicks button for next question
        next.click(function () {
            var checkedRadioButton = $('input:radio:checked');

            if (!checkedRadioButton.val()) {    //If user hasn't selected an answer
                window.alert('You did not provide an answer!');
            }
            else {
                //Get choice that the user selected and save it in userChoices array
                val = checkedRadioButton.val();
                userChoices[questionIndex] = val;

                //If not the last question yet
                if (questionIndex < theQuestions.length-1) {

                    if (questionIndex === 0) {  //show back button
                        back.show();
                    }

                    //clear question, disable next button for half a second so user can't skip question
                    //by double clicking, update progress bar, and show next question
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

                //If on last question
                else if (questionIndex === theQuestions.length-1) {
                    //clear question, hide buttons, update progress bar,
                    // and show user score and retry button
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

        //Event for button to go back to previous question
        back.click(function() {
            fadeOutQuestion();
            back.prop("disabled", true);
            questionIndex--;

            setTimeout(function() {
                clearQuestion();
                moveProgress();
                displayQuestion();
                back.prop("disabled", false);

                //find user's choice for previous question and re-check it
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

        //Event for retry button
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

        //Dynamically create HTML elements with questions and choices from quizquestions.js
        //using Handlebars.js template
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
            question.fadeOut("slow");
        }

        //Calculate score and display text telling user his/her score
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

        //Update progress bar
        function moveProgress() {
            var newWidth = (questionIndex / theQuestions.length) * 100;
            progressBar.css("width", newWidth + "%");
        }

    }
});