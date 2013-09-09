import os
from webtest import http
from piratechat import app
from pyramid_robot.layer import Layer, layered
from paste.deploy import loadapp


class myPyramidLayer(Layer):

    defaultBases = ()

    def setUp(self):
        conf_dir = os.path.dirname(__file__)
        app = loadapp('config:test.ini', relative_to=conf_dir)
        self.server = http.StopableWSGIServer.create(app, port=8080)

        #app = app.main({})
        #self.server = http.StopableWSGIServer.create(app, port=8080)

    def tearDown(self):
        self.server.shutdown()

PYRAMIDROBOTLAYER = myPyramidLayer()
