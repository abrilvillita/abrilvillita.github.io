"""Private, loopback-only April Studio. Run: python studio/server.py"""
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
from pathlib import Path
import json,sqlite3,secrets,os,mimetypes,base64,re,hashlib
ROOT=Path(__file__).resolve().parent.parent
PRIVATE=ROOT/'.april-studio';PRIVATE.mkdir(exist_ok=True)
DB=PRIVATE/'content.sqlite3';SESSION=secrets.token_urlsafe(32)
PORT=int(os.environ.get('APRIL_STUDIO_PORT','8765'))
ORIGIN=f'http://127.0.0.1:{PORT}'
with sqlite3.connect(DB) as db:
 db.execute('create table if not exists content (id integer primary key, data text not null, revision integer not null)')
 if not db.execute('select id from content where id=1').fetchone():db.execute('insert into content values(1,?,0)',(json.dumps(json.loads((ROOT/'content.json').read_text())),))
def valid_url(v):return isinstance(v,str) and (not v or v.startswith('https://') or v.startswith('mailto:') or bool(re.fullmatch(r'assets/[a-f0-9]{32}\.(png|jpg|webp|pdf|mp4|webm)',v)))
def validate(d):
 if not isinstance(d,dict) or not valid_url(d.get('tutorial')) or not isinstance(d.get('items'),list) or len(d['items'])>300:return False
 ids=set()
 for i in d['items']:
  if not isinstance(i,dict) or i.get('type') not in ['project','story','link','certificate','cv','media'] or i.get('status') not in ['draft','published','pending'] or i.get('size') not in ['small','medium','large','tall']:return False
  if any(not isinstance(i.get(k),str) or len(i[k])>20000 for k in ['id','title','description','url','github','image','category']):return False
  if i['id'] in ids or not isinstance(i.get('order'),(int,float)):return False
  if any(not valid_url(i[k]) for k in ['url','github','image']):return False
  if i['type']=='certificate' and i['status']=='published' and not i['url']:return False
  ids.add(i['id'])
 return True
class Handler(BaseHTTPRequestHandler):
 def log_message(self,*args):pass
 def reply(self,obj,status=200,ctype='application/json'):
  body=json.dumps(obj,ensure_ascii=False).encode() if ctype=='application/json' else obj
  self.send_response(status);self.send_header('Content-Type',ctype);self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');self.end_headers();self.wfile.write(body)
 def host_ok(self):return self.headers.get('Host')==f'127.0.0.1:{PORT}'
 def authorized(self):return self.host_ok() and f'april_session={SESSION}' in self.headers.get('Cookie','')
 def do_GET(self):
  if not self.host_ok():return self.reply({'error':'Host no permitido'},403)
  path=self.path.split('?')[0]
  if path in ['/studio','/studio/']:
   self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Set-Cookie',f'april_session={SESSION}; HttpOnly; SameSite=Strict; Path=/');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write((ROOT/'studio/index.html').read_bytes());return
  if path=='/api/content':
   if not self.authorized():return self.reply({'error':'Abre April Studio en esta computadora.'},401)
   with sqlite3.connect(DB) as db:r=db.execute('select data,revision from content where id=1').fetchone()
   return self.reply({'data':json.loads(r[0]),'revision':r[1]})
  file=(ROOT/path.lstrip('/')).resolve() if path!='/' else ROOT/'index.html'
  allowed={'.html','.css','.js','.json','.png','.jpg','.webp','.pdf','.mp4','.webm','.svg'}
  if not file.is_relative_to(ROOT) or any(p.startswith('.') for p in file.relative_to(ROOT).parts) or file.suffix not in allowed or not file.is_file():return self.reply({'error':'No encontrado'},404)
  if 'studio' in file.relative_to(ROOT).parts and not self.authorized():return self.reply({'error':'No autorizado'},401)
  self.reply(file.read_bytes(),ctype=mimetypes.guess_type(file.name)[0] or 'application/octet-stream')
 def do_POST(self):
  if not self.authorized() or self.headers.get('Origin')!=ORIGIN or self.headers.get('X-April-Studio')!='1':return self.reply({'error':'No autorizado'},403)
  try:
   size=int(self.headers.get('Content-Length','0'))
   if not 0<size<=35000000:return self.reply({'error':'Solicitud demasiado grande'},413)
   body=json.loads(self.rfile.read(size))
  except (ValueError,TypeError):return self.reply({'error':'JSON no válido'},400)
  if self.path in ['/api/save','/api/publish']:
   if not validate(body.get('data')):return self.reply({'error':'Contenido no válido. Usa enlaces HTTPS. Los certificados publicados requieren enlace.'},400)
   with sqlite3.connect(DB) as db:
    rev=db.execute('select revision from content where id=1').fetchone()[0]
    if body.get('revision')!=rev:return self.reply({'error':'Otra sesión guardó cambios. Recarga antes de continuar.'},409)
    db.execute('update content set data=?, revision=? where id=1',(json.dumps(body['data'],ensure_ascii=False),rev+1))
   if self.path=='/api/publish':
    published=dict(body['data']);published['items']=[i for i in published['items'] if i['status']!='draft'];tmp=ROOT/'content.json.tmp';tmp.write_text(json.dumps(published,ensure_ascii=False,indent=2));tmp.replace(ROOT/'content.json')
    # Copy only media referenced by published records. Private drafts remain outside the web root.
    referenced=[published.get('tutorial','')]+[i[k] for i in published['items'] for k in ['image','url']]
    for name in referenced:
     if name.startswith('assets/') and (PRIVATE/name).is_file():
      (ROOT/'assets').mkdir(exist_ok=True);(ROOT/name).write_bytes((PRIVATE/name).read_bytes())
   return self.reply({'revision':rev+1,'message':'Exportación pública preparada en content.json. Sube los cambios a GitHub.' if self.path=='/api/publish' else 'Borrador guardado en tu computadora.'})
  if self.path=='/api/upload':
   formats={'image/png':('png',b'\x89PNG'),'image/jpeg':('jpg',b'\xff\xd8\xff'),'image/webp':('webp',b'RIFF'),'application/pdf':('pdf',b'%PDF'),'video/mp4':('mp4',None),'video/webm':('webm',b'\x1aE\xdf\xa3')}
   kind=body.get('type');spec=formats.get(kind)
   if not spec:return self.reply({'error':'Formato no permitido'},400)
   try:raw=base64.b64decode(body.get('base64',''),validate=True)
   except ValueError:return self.reply({'error':'Archivo inválido'},400)
   if len(raw)>25000000 or not raw:return self.reply({'error':'Máximo 25 MB'},413)
   if spec[1] and not raw.startswith(spec[1]):return self.reply({'error':'El contenido no coincide con el formato'},400)
   if kind=='video/mp4' and raw[4:8]!=b'ftyp':return self.reply({'error':'MP4 inválido'},400)
   if kind=='image/webp' and raw[8:12]!=b'WEBP':return self.reply({'error':'WebP inválido'},400)
   name='assets/'+hashlib.sha256(raw).hexdigest()[:32]+'.'+spec[0];(PRIVATE/'assets').mkdir(exist_ok=True);(PRIVATE/name).write_bytes(raw);return self.reply({'url':name})
  return self.reply({'error':'Ruta desconocida'},404)
if __name__=='__main__':
 print(f'April Studio privado: {ORIGIN}/studio/\nSolo escucha en esta computadora. Ctrl+C para cerrar.',flush=True)
 ThreadingHTTPServer(('127.0.0.1',PORT),Handler).serve_forever()
