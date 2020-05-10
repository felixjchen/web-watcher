from gevent import monkey
monkey.patch_all()

if True:
    from app import app
