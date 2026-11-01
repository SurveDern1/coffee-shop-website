from pathlib import Path
import json,base64,hashlib,shutil
folder=Path('.github/import-assets')
manifest=json.loads((folder/'manifest.json').read_text())
for item in manifest:
 target=Path(item['path'])
 if not str(target).startswith(('assets/','.agents/')) or '..' in target.parts:raise ValueError('Invalid target')
 data=base64.b64decode(''.join((folder/p).read_text() for p in item['parts']),validate=True)
 if hashlib.sha256(data).hexdigest()!=item['sha256']:raise ValueError('Asset verification failed: '+str(target))
 target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(data)
 print('Verified',target)
shutil.rmtree(folder)
print('Restored',len(manifest),'original binary files.')
