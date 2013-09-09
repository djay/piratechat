import robotsuite
import unittest
from pyramid_robot.layer import Layer, layered
from piratechat.layers import PYRAMIDROBOTLAYER


def test_suite():
    suite = unittest.TestSuite()
    suite.addTests([
        layered(robotsuite.RobotTestSuite("test_app.robot"),
                layer=PYRAMIDROBOTLAYER),
    ])
    return suite

#suite = test_suite()


#unittest.main(defaultTest='test_suite')

if __name__ == '__main__':
    #unittest.main(defaultTest='test_suite')
    unittest.TextTestRunner(verbosity=2).run(test_suite())
