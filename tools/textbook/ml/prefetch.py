from .encode import Encoder

def prefetch(cache,**kwargs):return Encoder(cache,**kwargs).file_manifest()
