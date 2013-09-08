To install

virtualenv .
bin/easy_install -U setuptools
bin/python bootstrap.py
bin/buildout

To run

bin/pserve paster.ini

To Test

bin/pybot piratechat/tests/test_app.robot