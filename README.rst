Intro
=====

This is a demo created for a lightning talk designed to show off a number of things for a talk I gave
at kiwipycon 2013. The talk was "The goodies that zope begat" and highlighted a number of tools created
or used in the zope/plone/zope communities that might be useful python developers.

Acceptance Test Driven Development
----------------------------------

I often start with a story of what I want to create which I write down in scenario form similar to this

    User talks to a pirate parrot
       user opens piratechatapp
       user enters "pyramid_sockjs is cool"
       user hits "send"
       user sees "pyramid_sockjs is cool"

SockJS
------

./piratechat/app.pt

SockJS is a nice library that wraps both AJAX and websockets to create a bidirectional socket compatible with
older browsers and networks. The template shows a simple form and some JS that sets up a connection back
to the server.

Pyramid
-------

./piratechat/app.py

Pyramid is combined with pyramid_sockjs to create a very simple to write realtime web server. Pyramid_sockjs
has advantages over Tornado in that it can run on the same port as normal http connections and Pyramid is
a great micro framework that won't hamper you if you decide to also create bigger projects with it.

    class MapSession(Session):

        def on_message(self, line):
            print line
            response = urllib.urlopen("http://isithackday.com/arrpi.php?"+urllib.urlencode({'text':line})).read()
            print response
            self.send(response)


Gunicorn and Gevent
-------------------

Since we expect chatting to a pirate parrot to be widely popular we want a asynchronous IO based server to solve
10k problem. The 10k problem is how to handle 10k connections on a single machine without paying the overhead
of 10k threads. This style of a network library has been made popular by libraries such a NodeJS, Tornado and Twisted.
Gevent solves this problem elegnatly by not requiring you to change your code much, or work in awkard callbacks.
Gunicorn allows us to replace threaded workers with gevent workers transparently so our code doesn't change at all.

This can be seen in ./paster.ini

    [app:main]
    use = egg:piratechat#app

    [server:main]
    use = egg:gunicorn#main
    host = 0.0.0.0
    port = 8080
    workers = 1
    worker_class = gevent

You'll notice we have a single worker since asyncronous IO uses a single thread and takes control of which code gets
control itself.


Buildout
--------

Since gevent requires libev which isn't noramally installed on most platforms and we want a simple install experience
for everyone this demo uses buildout. Buildout installs, compiles and downloads everything you need to run complex apps and allows
you to glue them togeather so you don't have to give complex install instructions.

The install instructions for a buildout based application are always (note this doesn't change for any buildout based application)

    virtualenv .
    bin/easy_install -U setuptools
    bin/python bootstrap.py
    bin/buildout

which will create your scripts in ./bin and things built into ./parts. In this case we also created a virtualenv
to ensure our buildout was completely isolated from system python in case of package conflicts.

To run

    bin/pserve paster.ini

or to run the gunicorn/gevent version

    bin/gunicorn_paster paster.ini

A buildout is made up of parts, and what each part does is determined by a recipe and it's part definition.
A recipe is a package that is downloaded off pypi. For example the following gunicorn part

    [gunicorn]
    recipe = zc.recipe.egg
    eggs =
      ${gevent:egg}
      gunicorn
      pyramid_sockjs
      piratechat
    interpreter=mypy

is the buildout equivilent of

    virtualenv .
    bin/pip install gunicorn pyramid_sockjs piratechat
    mv bin/python bin/mypy

Except that in addition it will also include a custom compiled version of gevent which is built in another buildout part.



RobotFramework
--------------

Acceptance test driven development means that you take your original scenarios and turn them into acceptance tests.
As you work on the product you turn the text into working test actions and assertions. In this case we will also
need a tool that exectues our tests in a real browser capable of javascript and websockets. RobotFramework is the
perfect fit. Written in python, with a modular library system it can used selenium to driven real browsers such
as firefox. Its simple test language allows us to turn very readable statements into actual tests.

In this case your test_app.robot file includes

    *** Test Cases ***

    User talks to a pirate parrot
       user opens piratechatapp
       user enters "pyramid_sockjs is cool"
       user hits "send"
       user sees "pyramid_sockjs be cool"

    *** Keywords ***

    user opens piratechatapp
      go to  ${APP_URL}

    user enters "${line}"
       Input Text  line  ${line}

    user hits "${button}"
       Click Button  ${button}

    user sees "${text}"
       Page should Contain  ${text}

Here we are using Selenium2 keywords but robot comes with many other librariest to test almost anything.

RobotFramework comes with it's own test runner which we can use to run against a live server.

    bin/pybot piratechat/tests/test_app.robot

This will create logs of the run including screenshots and html of the pages where failures occur.

    ./robot_report.html

RobotSuite
----------

To run fully automated repeatable tests we need to setup and teardown our environment between tests.
This is best done by integrating with pythons UnitTest framework via the RobotSuite tool.


We've included running the tests with two tools. zope.testrunner

   bin/test
   #TODO get this working

or pytest

   bin/py.test .
   #TODO get this working

Diazo
-----

Now that we have a working and tested app it's time to make it pretty. A frontend designer delivers
some wonderful html and css however it's still a work in progress. Rather than wait until they are
finished we decide to use wsgi middleware diazo to theme our application rather than pull apart the
html and templatise it.

#TODO

Plone
-----

A community has grown around the pirateparrot and we want to have a blog and community forums with
our app. We need a CMS. Plone is a great easy to use CMS written in python. We've decided to use wsgi
middleware to combine our app into a part of the our plone site.

#TODO

ZODB
----

We've decided to add a new feature that tracks what everyone enters. We just want something simple
but still transactional and we don't want to both installing a whole relational database. We
decide to use the ZODB

#TODO

ZTK Adapters
------------

We decide we want our application to be plugable. We might like to have other services other the
speak like a pirate translater. So we define a ITranslator service interface.

#TODO

Traversal
---------

We will adjust our urls so you can share them with others. After you type in your name will get
your own pirate chat room, and see all the recent chat in the room.

#TODO


