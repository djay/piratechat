from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid_sockjs.session import Session
import urllib

def index(request):
    return {}

class MapSession(Session):

    def on_message(self, line):
        print line
        response = urllib.urlopen("http://isithackday.com/arrpi.php?"+urllib.urlencode({'text':line})).read()
        print response
        self.send(response)

# our app configuration
def application(global_config, **settings):
    config = Configurator(settings=settings)
    config.include('pyramid_sockjs')
    config.add_static_view(name="static",path="static", cache_max_age=3600)
    config.add_sockjs_route(session=MapSession)
    config.add_view(index, renderer='piratechat:app.pt')
    return config.make_wsgi_app()

if __name__ == '__main__':
    from pyramid_sockjs.paster import gevent_server_runner
    gevent_server_runner(application(None), {}, host='0.0.0.0')
