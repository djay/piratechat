from webtest import http
from piratechat import app
from pyramid_robot.layer import Layer, layered


class myPyramidLayer(Layer):

    defaultBases = ()

    def setUp(self):
        import pdb; pdb.set_trace()
        conf_dir = os.path.dirname(__file__)
        app = loadapp('config:test.ini', relative_to=conf_dir)
        self.server = http.StopableWSGIServer.create(app, port=8080)

        #app = app.main({})
        #self.server = http.StopableWSGIServer.create(app, port=8080)

    def tearDown(self):
        self.server.shutdown()

PYRAMIDROBOTLAYER = myPyramidLayer()
