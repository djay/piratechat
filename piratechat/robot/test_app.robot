
*** Settings ***

Variables  pyramid_robot/tests/robot/variables.py

Library  Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}

Suite Setup  Suite Setup
Suite Teardown  Suite Teardown

*** Test Cases ***



User talks to a pirate parrot
   user enters "hello"
   user hits "send"
   user sees "ahoy"


#Scenario: Test Hello View
#     When I go to  ${APP_URL}/hello/Victor
#     Then Page Should Contain  Hello Victor!





*** Keywords ***

Suite Setup
  Open browser  ${APP_URL}  browser=${BROWSER}  remote_url=${REMOTE_URL}  desired_capabilities=${DESIRED_CAPABILITIES}

Suite Teardown
  Close All Browsers

user enters "${line}"
   Input Text  cssline  ${line}

user hits "${button}"
   Click Button  ${button}

user sees "${text}"
   Page Contains  ${text}

I go to
    [Arguments]  ${location}
    Go to  ${location}




