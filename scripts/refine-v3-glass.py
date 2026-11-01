"""ISNet photo segmentation + neutral transmission matte for green-backed glass.
Requires rembg, onnxruntime, Pillow, numpy, OpenCV; original session files.
No fitted shapes are used: all silhouettes come from the source photograph.
"""
from pathlib import Path
from PIL import Image
import numpy as np,cv2,json,sys
from rembg import new_session,remove
ROOT=Path(__file__).resolve().parents[1]
sources=json.loads((ROOT/'scripts/assets-v3-sources.json').read_text())
names=['filter','pour-over','aeropress','chemex','decoction','espresso-cherry','kissel',*[f'tea-{i}' for i in range(7)],'matcha-tonic','espresso-tonic','smoothie','sgroppino','kodama','liquorice','russian','irish','martini','spritz','hot-campari','prosecco','cider','pepperoni']
if len(sys.argv)>1:names=sys.argv[1:]
session=new_session('isnet-general-use');manifest=json.loads((ROOT/'assets/menu/provenance.json').read_text())
cache=Path('/data/v3-segmentation-cache');cache.mkdir(exist_ok=True)
for name in names:
 src=Image.open('/data/.agent-service/files/'+sources[name]+'/tool-output-0.jpg')
 cp=cache/(name+'.png')
 if not cp.exists():remove(src,session=session).save(cp)
 rgba=np.array(Image.open(cp));rgb=rgba[:,:,:3].astype(float);a=rgba[:,:,3]/255.
 if name=='pepperoni':
  # This item includes its serving plate: saliency alone removes pale ceramics.
  rgb=np.array(src.convert('RGB')).astype(float)
  lab=cv2.cvtColor(rgb.astype('uint8'),cv2.COLOR_RGB2LAB).astype(float)
  bg=np.median(np.concatenate([lab[:30].reshape(-1,3),lab[-30:].reshape(-1,3)]),axis=0)
  m=((np.linalg.norm(lab[:,:,1:]-bg[1:],axis=2)>12)&(lab[:,:,0]>95)).astype('uint8')*255
  m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8))
  contours,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  m[:]=0;cv2.drawContours(m,[max(contours,key=cv2.contourArea)],-1,255,-1)
  a=np.clip((cv2.GaussianBlur(m.astype(float)/255,(9,9),1.2)-.18)/.64,0,1)

 # Clear glass transmits the background; opaque colorful food/liquid is untouched.
 if name not in ['pepperoni','aeropress']:
  hsv=cv2.cvtColor(rgb.astype('uint8'),cv2.COLOR_RGB2HSV).astype(float)
  r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
  w=np.clip((np.minimum(g-r,g-b)-1)/9,0,1)
  if name.startswith('tea-') or name in ['decoction','kodama','matcha-tonic','pour-over']:
   w*=np.clip((90-hsv[:,:,1])/25,0,1)
  if name in ['kodama','matcha-tonic']:
   w[830:]=np.clip((np.minimum(g-r,g-b)[830:]-1)/9,0,1)
  w=cv2.GaussianBlur(w,(0,0),2)
  if name=='filter':w[:,535:]=0 # ceramic cup isn't transparent glass
  coverage=np.clip((g-65)/(255-65),.12,1)
  neutral=np.empty_like(rgb);neutral[:]=[235,236,235]
  rgb=rgb*(1-w[:,:,None])+neutral*w[:,:,None]
  a=a*(1-w*(1-coverage))
 # Reject low-opacity segmentation dust outside genuine object contours.
 a[a<.012]=0
 rgba=Image.fromarray(np.dstack([rgb.clip(0,255).astype('uint8'),(a*255).astype('uint8')]))
 out=rgba.crop(rgba.getbbox());scale=940/max(out.size)
 out=out.resize((round(out.width*scale),round(out.height*scale)),Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(1024,1024));canvas.alpha_composite(out,((1024-out.width)//2,(1024-out.height)//2))
 canvas.save(ROOT/'assets/menu'/f'{name}.webp',quality=96,method=6,exact=True)
 manifest[name]['alpha']='photo-derived ISNet segmentation; shadow removal; soft neutral glass transmission/despill, genuine rim and handle contours; no geometric mask'
 print(name,flush=True)
(ROOT/'assets/menu/provenance.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
