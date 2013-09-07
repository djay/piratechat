import os
import robotsuite
import unittest



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
        suite.addTests(robotsuite.RobotTestSuite(test))

    return suite

suite = test_suite()

#unittest.TextTestRunner(verbosity=2).run(suite)

unittest.main(defaultTest='test_suite')

if __name__ == '__main__':
    import ipdb;ipdb.set_trace()
