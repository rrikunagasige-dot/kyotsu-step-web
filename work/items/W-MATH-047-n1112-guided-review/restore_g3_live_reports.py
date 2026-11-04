"""Use the unchanged validated report restorer with the actual live-run archive."""
from pathlib import Path
import sys,json
import restore_g3_reports as existing
existing.B=Path(__file__).resolve().parent/'evidence/g3-live-ci/41760954117'
if __name__=='__main__':print(json.dumps(existing.restore(sys.argv[1]if len(sys.argv)>1 else None)))
