
*** Settings ***

Variables  variables.py

Library  Selenium2Library  timeout=${SELENIUM_TIMEOUT}  implicit_wait=${SELENIUM_IMPLICIT_WAIT}

Suite Setup  Suite Setup
Suite Teardown  Suite Teardown

*** Test Cases ***

User talks to a pirate parrot
   user opens piratechatapp
   user enters "pyramid_sockjs is cool"
   user hits "send"
   user sees "pyramid_sockjs is cool"





*** Keywords ***

Suite Setup
  Open browser  ${APP_URL}  browser=${BROWSER}  remote_url=${REMOTE_URL}  desired_capabilities=${DESIRED_CAPABILITIES}

Suite Teardown
  Close All Browsers

user opens piratechatapp
  When I go to  ${APP_URL}

user enters "${line}"
   Input Text  line  ${line}

user hits "${button}"
   Click Button  ${button}

user sees "${text}"
   Page should Contain  ${text}

I go to
    [Arguments]  ${location}
    Go to  ${location}




