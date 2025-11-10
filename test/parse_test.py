import os
import subprocess
import unittest

class TestSxpbFiles(unittest.TestCase):
    def test_validate_sxpb_files(self):
        sxpb_files = []
        for root, _, files in os.walk('.'):
            for file in files:
                if file.endswith('.sxpb'):
                    sxpb_files.append(os.path.join(root, file))

        self.assertTrue(len(sxpb_files) > 0, "No .sxpb files found")

        for sxpb_file in sxpb_files:
            with self.subTest(sxpb_file=sxpb_file):
                result = subprocess.run(
                    ['sxpb2sxpb', '--validate_only', sxpb_file],
                    capture_output=True,
                    text=True
                )
                self.assertEqual(result.returncode, 0, f"Validation failed for {sxpb_file}:\n{result.stderr}")

if __name__ == '__main__':
    unittest.main()
