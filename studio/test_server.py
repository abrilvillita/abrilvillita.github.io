import unittest,tempfile,shutil,subprocess,os,time,json,urllib.request,urllib.error,http.cookiejar
from pathlib import Path
class StudioTest(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.temp=tempfile.TemporaryDirectory();cls.root=Path(cls.temp.name)
  shutil.copytree(Path(__file__).parent,cls.root/'studio',ignore=shutil.ignore_patterns('__pycache__'))
  shutil.copy(Path(__file__).parent.parent/'content.json',cls.root/'content.json')
  cls.proc=subprocess.Popen(['python',str(cls.root/'studio/server.py')],env={**os.environ,'APRIL_STUDIO_PORT':'18765'},stdout=subprocess.DEVNULL)
  cls.origin='http://127.0.0.1:18765';cls.client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
  for _ in range(50):
   try:cls.client.open(cls.origin+'/studio/');break
   except urllib.error.URLError:time.sleep(.05)
 @classmethod
 def tearDownClass(cls):cls.proc.terminate();cls.proc.wait();cls.temp.cleanup()
 def req(self,path,data=None,origin=None):
  return self.client.open(urllib.request.Request(self.origin+path,data=json.dumps(data).encode() if data is not None else None,headers={'Content-Type':'application/json','Origin':origin or self.origin,'X-April-Studio':'1'}))
 def test_private_and_export(self):
  with self.assertRaises(urllib.error.HTTPError) as e:urllib.request.urlopen(self.origin+'/api/content')
  self.assertEqual(e.exception.code,401)
  d=json.load(self.req('/api/content'));draft={**d['data']['items'][0],'id':'private-secret','title':'PRIVATE DRAFT','status':'draft'};d['data']['items'].append(draft)
  with self.assertRaises(urllib.error.HTTPError) as e:self.req('/api/save',d,origin='https://evil.example')
  self.assertEqual(e.exception.code,403)
  saved=json.load(self.req('/api/save',d));self.assertEqual(saved['revision'],1)
  with self.assertRaises(urllib.error.HTTPError) as e:self.req('/api/save',d)
  self.assertEqual(e.exception.code,409)
  d['revision']=1;json.load(self.req('/api/publish',d));published=json.loads((self.root/'content.json').read_text());self.assertNotIn('private-secret',[i['id'] for i in published['items']])
  self.assertTrue(any(i['status']=='pending' for i in published['items']))
  d['revision']=2;d['data']['items'][0]['url']='javascript:alert(1)'
  with self.assertRaises(urllib.error.HTTPError) as e:self.req('/api/save',d)
  self.assertEqual(e.exception.code,400)
if __name__=='__main__':unittest.main()
