Feature: Form Student flow

    ## happy path

    Scenario: Valid Contact us submission
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
