from setuptools import setup, find_packages
import sys, os

version = '1.0'

setup(name='piratechat',
      version=version,
      description="Demo of pyramid_sockjs amoung others",
      classifiers=[], # Get strings from http://pypi.python.org/pypi?%3Aaction=list_classifiers
      keywords='gevent sockjs buildout pyramid',
      author='Dylan Jay',
      author_email='software@pretaweb.com',
      license='',
      packages=find_packages(exclude=['ez_setup']),
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          # -*- Extra requirements: -*-
#          'gevent-socketio',
          'pyramid',
          'pyramid_sockjs',
        ],
      extras_require={
        'test': ['pyramid_robot',
                 'robotframework-selenium2library',
                 'robotframework'
                 ],
      },
      entry_points={
        'paste.app_factory': [
            'app=piratechat.app:application',
        ]
        },
    )
