"""Create an offline, one-file preview, independent of deployment. Usage: python scripts/build-preview.py [output.html]"""
from pathlib import Path
import sys,re,json,base64
root=Path(__file__).resolve().parents[1]
output=Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'coffee-26-v3-preview.html'
def uri(path,mime):return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
fonts=(root/'assets/fonts.css').read_text()
fonts=re.sub(r"url\('\./([^']+)'\)",lambda m:"url('"+uri(root/'assets'/m[1],'font/ttf')+"')",fonts)
html=(root/'index.html').read_text().replace('<link rel="stylesheet" href="assets/fonts.css">','<style>'+fonts+'</style>').replace('<link rel="stylesheet" href="style.css">','<style>'+(root/'style.css').read_text()+'</style>')
html=re.sub(r'<link rel="preload"[^>]+>','',html)
html=html.replace('<script src="app.js" type="module"></script>','')
html=html.replace('href="assets/favicon.svg"','href="'+uri(root/'assets/favicon.svg','image/svg+xml')+'"')
html=html.replace('href="assets/menu.pdf" target="_blank" rel="noopener"','href="#" data-preview-pdf')
images={p.stem:uri(p,'image/webp') for p in (root/'assets/menu').glob('*.webp')}
menu=(root/'menu.js').read_text().replace('export const','const').replace('export function','function')
app=(root/'app.js').read_text()
app=re.sub(r"import .*? from './menu.js';\n",'',app)
app=app.replace('const picture=id=>`assets/menu/${id}.webp`;','const picture=id=>assetMap[id];')
app=app.replace('src="assets/hero-v2.webp"','src="'+uri(root/'assets/hero-v2.webp','image/webp')+'"')
app=app.replace('href="assets/menu.pdf" target="_blank" rel="noopener"','href="${pdfUrl}" download="coffee-26-menu.pdf"')
script='const assetMap='+json.dumps(images)+';\nconst pdfUrl='+json.dumps(uri(root/'assets/menu.pdf','application/pdf'))+';\n'+menu+'\n'+app+'\ndocument.querySelectorAll("[data-preview-pdf]").forEach(a=>{a.href=pdfUrl;a.download="coffee-26-menu.pdf";});'
html=html.replace('</body>','<script type="module">'+script+'</script></body>')
output.write_text(html)
print('Preview:',output.name,round(output.stat().st_size/1024),'KB')
