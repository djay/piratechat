import os
import robotsuite
import unittest
from pyramid_robot.layer import Layer, layered
from piratechat.layers import PYRAMIDROBOTLAYER



def test_suite():
    suite = unittest.TestSuite()
    current_dir = os.path.abspath(os.path.dirname(__file__))
    robot_dir = os.path.join(current_dir, 'robot')
    robot_tests = [
        os.path.join('robot', doc) for doc in
        os.listdir(robot_dir) if doc.endswith('.robot') and
        doc.startswith('test_')
    ]
    print robot_tests
    for test in robot_tests:
        suite.addTests([
            layered(robotsuite.RobotTestSuite(test),
            layer=PYRAMIDROBOTLAYER),
        ])
    return suite

#suite = test_suite()

#unittest.TextTestRunner(verbosity=2).run(suite)

#unittest.main(defaultTest='test_suite')

if __name__ == '__main__':
    unittest.main(defaultTest='test_suite')
