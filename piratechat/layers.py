from webtest import http
from piratechat import app
from pyramid_robot.layer import Layer, layered


class myPyramidLayer(Layer):

    defaultBases = ()

    def setUp(self):
        assert 0
        app = app.main({})
        self.server = http.StopableWSGIServer.create(app, port=8080)

    def tearDown(self):
        self.server.shutdown()

PYRAMIDROBOTLAYER = myPyramidLayer()
