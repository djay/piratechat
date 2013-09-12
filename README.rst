Intro
=====

This is a demo created for a lightning talk designed to show off a number of things for a talk I gave
at kiwipycon 2013. The talk was "The goodies that Zope begat" and highlighted a number of tools created
or used in the Zope/Plone communities that might be useful Python developers.
The lightning talk is the 1st in `this youtube video <http://www.youtube.com/watch?v=G1fIPwkCsgg>`_.

Acceptance Test Driven Development
----------------------------------

I often start with a story of what I want to create which I write down in scenario form similar to this

.. code::

    User talks to a pirate parrot
       user opens piratechatapp
       user enters "pyramid_sockjs is cool"
       user hits "send"
       user sees "pyramid_sockjs is cool"

It's often not all the details of the interactions and not in any particular syntax.
Next I start building the app or give this spec to someone else to build. The idea is for them to turn
this into a "real" test as they build the app.

SockJS
------

This is a simple chameleon template that mainly does its work in realtime by using `sockjs <https://github.com/sockjs>`_.

.. code::

  ./piratechat/app.pt

SockJS is a nice library that wraps both AJAX and websockets to create a bidirectional socket compatible with
older browsers and networks. The template shows a simple form and some JS that sets up a connection back
to the server.

Pyramid
-------

.. code::

  ./piratechat/app.py

Pyramid is combined with ``pyramid_sockjs`` to create a very simple-to-write realtime web server. ``pyramid_sockjs``
has advantages over Tornado in that it can run on the same port as normal ``http`` connections, and Pyramid is
a great micro framework that won't hamper you if you decide to also create bigger projects with it.

.. code::

   class MapSession(Session):

        def on_message(self, line):
            print line
            response = urllib.urlopen("http://isithackday.com/arrpi.php?"+urllib.urlencode({'text':line})).read()
            print response
            self.send(response)


Gunicorn and Gevent
-------------------

Since we expect chatting to a pirate parrot to be widely popular, we want an asynchronous IO-based server to solve
the 10k problem. The 10k problem is how to handle 10k connections on a single machine without paying the overhead
of 10k threads. This style of network library has been made popular by libraries such as NodeJS, Tornado and Twisted.
Gevent solves this problem elegantly by not requiring you to change your code much, or work in awkward callbacks.
Gunicorn allows us to replace threaded workers with gevent workers transparently so our code doesn't change at all.

This can be seen in ``./paster.ini``

.. code::

    [app:main]
    use = egg:piratechat#app

    [server:main]
    use = egg:gunicorn#main
    host = 0.0.0.0
    port = 8080
    workers = 1
    worker_class = gevent

You'll notice we have a single worker, since asyncronous IO uses a single thread and takes control of which code gets
control itself.


Buildout
--------

Since ``gevent`` requires ``libev`` which isn't normally installed on most platforms and we want a simple install experience
for everyone, this demo uses ``buildout``. Buildout installs, compiles and downloads everything you need to run complex apps and allows
you to glue them together so you don't have to give complex install instructions.

The install instructions for a buildout-based application are always (note this doesn't change for any buildout-based application):

.. code::

    virtualenv .
    bin/easy_install -U setuptools
    bin/python bootstrap.py
    bin/buildout

which will create your scripts in ``./bin`` and things built in ``./parts``. In this case we also created a *virtualenv*
to ensure our buildout was completely isolated from the system Python in case of package conflicts.

To run

.. code::

    bin/pserve paster.ini

or to run the gunicorn/gevent version

.. code::

    bin/gunicorn_paster paster.ini

A buildout is made up of *parts*, and what each part does is determined by a *recipe* and its part definition.
A recipe is a package that is downloaded from pypi. For example the following ``gunicorn`` part

.. code::

    [gunicorn]
    recipe = zc.recipe.egg
    eggs =
      ${gevent:egg}
      gunicorn
      pyramid_sockjs
      piratechat
    interpreter=mypy

is the buildout equivalent of

.. code::

    virtualenv .
    bin/pip install gunicorn pyramid_sockjs piratechat
    mv bin/python bin/mypy

Except that in addition it will also include a custom compiled version of ``gevent`` which is built in another buildout part.



RobotFramework
--------------

Acceptance test driven development means that you take your original scenarios and turn them into acceptance tests.
As you work on the product you turn the text into working test actions and assertions. In this case we will also
need a tool that executes our tests in a real browser capable of javascript and websockets. RobotFramework is the
perfect fit. Written in Python, with a modular library system, it can used Selenium to drive real browsers such
as Firefox. Its simple test language allows us to turn very readable statements into actual tests.

In this case, your ``test_app.robot`` file includes

.. code::

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

Here we are using Selenium2 keywords but robot comes with many other libraries to test almost anything.

RobotFramework comes with its own test runner which we can use to run against a live server

.. code::

    bin/pybot piratechat/tests/test_app.robot

This will create logs of the run including screenshots and ``html`` of the pages where failures occur.

.. code::

    ./robot_report.html

RobotSuite
----------

To run fully automated repeatable tests we need to setup and teardown our environment between tests.
This is best done by integrating with Python's UnitTest framework via the RobotSuite tool.


We've included running the tests with two tools: ``zope.testrunner``

.. code::

   bin/test
   #TODO get this working

or ``pytest``

.. code::

   bin/py.test .
   #TODO get this working

Diazo
-----

Now that we have a working and tested app it's time to make it pretty. A frontend designer delivers
some wonderful HTML and CSS; however it's still a work in progress. Rather than wait until they are
finished, we decide to use WSGI middleware `Diazo <http://diazo.org>`_ to theme our application rather than pull apart the
HTML and templatise it.

#TODO

Plone
-----

A community has grown around the pirate parrot and we want to have a blog and community forums with
our app. We need a CMS. Plone is a great easy to use CMS written in python. We've decided to use WSGI
middleware to combine our app into a part of our Plone site.

#TODO

ZODB
----

We've decided to add a new feature that tracks what everyone enters. We just want something simple
but still transactional and we don't want to both installing a whole relational database. We
decide to use the ZODB

#TODO

ZTK Adapters
------------

We decide we want our application to be pluggable. We might like to have other services other than the
speak-like-a-pirate translator. So we define a ``ITranslator`` service interface.

#TODO

Traversal
---------

We will adjust our URLs so you can share them with others. After you type in your name, you will get
your own pirate chat room, and see all the recent chat in the room.

#TODO


