from setuptools import setup, find_packages
import sys, os

version = '1.0'

setup(name='piratechat',
      version=version,
      description="all your hosts are belong to us!!!",
      classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='gevent',
      author='Dylan Jay',
      author_email='software@pretaweb.com',
      license='',
      packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          # -*- Extra requirements: -*-
#          'gevent-socketio',
          'pyramid',
          'pyramid_sockjs',
        ],
      entry_points={
        'paste.app_factory': [
            'app=piratechat.app:application',
        ]
        },
    )
