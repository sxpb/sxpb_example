import os
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
                try:
                    # 1. Read the file via the library, using precise=True
                    obj1 = sxpb.load(sxpb_file, precise=True)

                    # 2. Write the sxpb to a string
                    s1 = sxpb.dumps(obj1)

                    # 3. Parse sxpb from the string, using precise=True
                    obj2 = sxpb.loads(s1, precise=True)

                    # 4. Write the sxpb to another string
                    s2 = sxpb.dumps(obj2)

                    # 5. Compare the 2 written strings
                    self.assertEqual(s1, s2, f"Idempotency check failed for {sxpb_file}")

                except Exception as e:
                    self.fail(f"Failed to process {sxpb_file}: {e}")

if __name__ == '__main__':
    unittest.main()
