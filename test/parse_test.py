import os
import subprocess
import unittest
import sxpb

class TestSxpbFiles(unittest.TestCase):
    def test_validate_sxpb_files(self):
        dirs_file = os.path.join(os.path.dirname(__file__), 'dirs.sxpb')
        config = sxpb.load(dirs_file)
        dirs_to_scan = config.get('dirs', [])

        sxpb_files = []
        # If we are in root, dirs are relative to root.
        # But we should be careful about where the test is run from.
        # Assuming run from root as per `pdm test`.

        for d in dirs_to_scan:
            if not os.path.exists(d):
                continue
            for root, _, files in os.walk(d):
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
