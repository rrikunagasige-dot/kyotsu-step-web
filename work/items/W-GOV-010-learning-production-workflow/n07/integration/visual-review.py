"""Emit a compact lossless preview for inspection when CI owns the browser."""
from pathlib import Path
from PIL import Image
import base64, io
root=Path('/tmp/n07-browser')
paths=[root/'q07-before.png',root/'width-390-stage-7.png',root/'width-390-stage-11.png']
images=[]
for p in paths:
    if p.exists():
        im=Image.open(p).convert('RGB')
        # Keep the active teaching region, avoiding an excessively tall history image.
        im.thumbnail((390,2200));images.append(im)
if images:
    sheet=Image.new('RGB',(sum(im.width for im in images),max(im.height for im in images)),'white')
    x=0
    for im in images: sheet.paste(im,(x,0));x+=im.width
    buffer=io.BytesIO();sheet.save(buffer,format='PNG')
    print('N07_VISUAL_BASE64_BEGIN')
    print(base64.b64encode(buffer.getvalue()).decode())
    print('N07_VISUAL_BASE64_END')
else: print('No screenshots produced before failure')
