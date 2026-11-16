"""Offline unit checks for kit v4's heuristic motion diagnostic."""
import unittest
import numpy as np
from motion_check import analyse


class MotionCheckTests(unittest.TestCase):
    def test_static_rejected(self):
        result = analyse(np.zeros((21, 4, 4), np.uint8))
        self.assertFalse(result['passed'])
        self.assertEqual(result['staticWindowsOutsideExceptions'], [[0, 2]])

    def test_explicit_static_exception(self):
        result = analyse(np.zeros((21, 4, 4), np.uint8), [(0, 2)])
        self.assertEqual(result['staticWindowsOutsideExceptions'], [])
        self.assertFalse(result['passed'])  # Mean-motion gate still applies.

    def test_enough_motion(self):
        frames = np.array([np.full((4, 4), i % 2 * 20, np.uint8) for i in range(21)])
        self.assertTrue(analyse(frames)['passed'])
        self.assertEqual(analyse(frames)['meanMotionEnergy'], 20)

    def test_too_short(self):
        with self.assertRaises(ValueError):
            analyse(np.zeros((3, 4, 4), np.uint8))


if __name__ == '__main__':
    unittest.main()
