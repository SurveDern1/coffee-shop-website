"""Native 1024px individual photographic assets, actual chromatic matte, no geometry masks."""
from pathlib import Path
from PIL import Image
import cv2, numpy as np,json,sys
ROOT=Path(__file__).resolve().parents[1]
SOURCES=json.loads((ROOT/'scripts/assets-v3-sources.json').read_text())
FOOD={'english','salmon-pancakes','chicken-pancakes','cheese-syrniki','salmon-syrniki','sweet-syrniki','benedict','copenhagen','chicken-bowl','salmon-bowl','buckwheat','oatmeal','chicken-sandwich','pepperoni','cheese-cranberry'}
manifest={}
for name,source in SOURCES.items():
 rgb=np.array(Image.open(Path('/data/.agent-service/files')/source/'tool-output-0.jpg').convert('RGB'))
 lab=cv2.cvtColor(rgb,cv2.COLOR_RGB2LAB).astype(np.float32)
 border=np.concatenate((lab[:30].reshape(-1,3),lab[-30:].reshape(-1,3),lab[:,:30].reshape(-1,3),lab[:,-30:].reshape(-1,3)))
 bg=np.median(border,axis=0)
 dist=np.linalg.norm(lab[:,:,1:]-bg[1:],axis=2)
 # Full-resolution color-separation retains sharp genuine ceramic/photo contours.
 raw=(dist>12).astype(np.uint8)*255
 raw=cv2.morphologyEx(raw,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
 n,labels,stats,_=cv2.connectedComponentsWithStats(raw)
 keep=[i for i in range(1,n) if stats[i,cv2.CC_STAT_AREA]>130]
 mask=np.isin(labels,keep).astype(np.uint8)*255
 if name in FOOD or name in {'usucha','kodama','matcha-tonic'}:
  contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  contour=max(contours,key=cv2.contourArea);mask[:]=0;cv2.drawContours(mask,[contour],-1,255,-1)
 # Subpixel antialiasing follows actual segmentation boundary; no fitted circle/polygon.
 soft=cv2.GaussianBlur(mask.astype(np.float32)/255,(11,11),1.5)
 alpha=np.clip((soft-.18)/.64,0,1)
 # Remove chroma spill from the 1px matte boundary with adjacent opaque object color.
 opaque=alpha>.98
 _,nearest=cv2.distanceTransformWithLabels((~opaque).astype(np.uint8),cv2.DIST_L2,5,labelType=cv2.DIST_LABEL_PIXEL)
 yy,xx=np.where(opaque)
 edge=(alpha>0)&(alpha<.98)
 rgb[edge]=rgb[yy[nearest[edge]-1],xx[nearest[edge]-1]]
 rgba=Image.fromarray(np.dstack((rgb,(alpha*255).astype(np.uint8))))
 bbox=rgba.getbbox();out=rgba.crop(bbox)
 scale=940/max(out.size)
 if abs(scale-1)>.001:out=out.resize((round(out.width*scale),round(out.height*scale)),Image.Resampling.LANCZOS)
 canvas=Image.new('RGBA',(1024,1024));canvas.alpha_composite(out,((1024-out.width)//2,(1024-out.height)//2))
 canvas.save(ROOT/'assets/menu'/f'{name}.webp',quality=96,method=6,exact=True)
 manifest[name]={'source':source,'sourceSize':[rgb.shape[1],rgb.shape[0]],'outputSize':[1024,1024],'kind':'individually generated photographic menu illustration','alpha':'full-resolution color separation, antialiased actual contour, edge chroma decontamination; no geometric mask'}
 if name in {'oatmeal','masala','cappuccino'}:
  for color,label in [('#263e30','dark'),('#f8f4ec','light')]:
   back=Image.new('RGBA',canvas.size,color);back.alpha_composite(canvas);back.convert('RGB').save(f'/data/v3-{name}-{label}.jpg',quality=97)
 print(name, bbox, 'saved',flush=True)
(ROOT/'assets/menu/provenance.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
