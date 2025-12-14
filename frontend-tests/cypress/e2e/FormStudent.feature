Feature: Form Student flow

    ## happy path

    @happy
    Scenario: Valid Student Form us submission
        Given navigate to the DEMOQA website
        When click on 'Forms' in menu
        And click on pratice form on the sub-menu
        And type a valid first name
        And type a valid last name
        And type a valid email
        And click in 'female' checkbox
        And type valid phone number
        And select a valid birth date
        And type 'English' as a valid subject
        And check 3 of 3 checkboxes: Sports,Reading or Music
        And click in escolher arquivo and upload teste.txt
        And type a valid current address Rua dos Testers
        And select a valid state NCR
        And select a valid city Delhi
        Then click on submit button


    ## alternate pathes
    @negative
    Scenario: Submit empty form
        Given navigate to the DEMOQA website
        And the form is reset
        When click on 'Forms' in menu
        And click on pratice form on the sub-menu
        Then click on submit button should not submit


    Scenario: Invalid email should not submit
        Given navigate to the DEMOQA website
        And the form is reset
        When click on 'Forms' in menu
        And click on pratice form on the sub-menu
        And type a valid first name
        And type a valid last name
        And type an invalid email
        Then click on submit button should not submit


    Scenario: Invalid phone number should not submit
        Given navigate to the DEMOQA website
        And the form is reset
        When click on 'Forms' in menu
        And click on pratice form on the sub-menu
        And type a valid first name
        And type a valid last name
        And type a valid email
        And click in 'female' checkbox
        And type invalid phone number
        Then click on submit button should not submit


    Scenario: Missing gender should not submit
        Given navigate to the DEMOQA website
        And the form is reset
        When click on 'Forms' in menu
        And click on pratice form on the sub-menu
        And type a valid first name
        And type a valid last name
        Then click on submit button should not submit
