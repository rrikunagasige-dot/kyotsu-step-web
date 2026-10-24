from ..corpus.core import split_groups

def audit_split(rows,split):
    actual=split_groups(rows)
    if actual['hash']!=split['hash']:raise ValueError('split mismatch')
    return actual
