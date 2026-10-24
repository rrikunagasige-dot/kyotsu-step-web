"""CI実画面検査用の固定日本語フォント。生成HTMLへは埋め込まない。"""
import hashlib,json,subprocess,urllib.request
from pathlib import Path

URL='https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf'
EXPECTED_GIT_BLOB='f56224957fb13a81b4c14bac34f2f058a017f9fb'

def main():
    data=urllib.request.urlopen(URL,timeout=60).read()
    blob=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    if blob!=EXPECTED_GIT_BLOB:raise ValueError('日本語フォントの固定版と不一致')
    fonts=Path.home()/'.local/share/fonts';fonts.mkdir(parents=True,exist_ok=True)
    (fonts/'NotoSansCJKjp-Regular.otf').write_bytes(data)
    subprocess.run(['fc-cache','-f',str(fonts)],check=True,timeout=30)
    evidence={'source_url':URL,'git_blob_sha':blob,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'purpose':'CI表示検査のみ'}
    out=Path(__file__).with_name('output');out.mkdir(exist_ok=True)
    (out/'font_evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(evidence,ensure_ascii=False))

if __name__=='__main__':main()
