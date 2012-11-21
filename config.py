import os

_basedir = os.path.abspath(os.path.dirname(__file__))

APP_NAME = "adsabs"

class AppConfig(object):
    
    DEBUG = False
    TESTING = False

    ADMINS = frozenset(['youremail@yourdomain.com'])
    SECRET_KEY = 'SecretKeyForSessionSigning'

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(_basedir, 'app.db')
    DATABASE_CONNECT_OPTIONS = {}
    
    THREADS_PER_PAGE = 8

    CSRF_ENABLED=True
    CSRF_SESSION_KEY="somethingimpossibletoguess"

    RECAPTCHA_USE_SSL = False
    RECAPTCHA_PUBLIC_KEY = 'blahblahblahblahblahblahblahblahblah'
    RECAPTCHA_PRIVATE_KEY = 'blahblahblahblahblahblahprivate'
    RECAPTCHA_OPTIONS = {'theme': 'white'}
    
    APP_VERSION = '2012-08-21'
    
    MONGOALCHEMY_DATABASE = 'adsabs'
    MONGOALCHEMY_SERVER = 'localhost'
    MONGOALCHEMY_PORT = 27017
    MONGOALCHEMY_OPTIONS = "safe=true"
    
    SOLR_URL = 'http://adsate:8987/solr/collection1'
    SOLR_ROW_OPTIONS = [('20','20'),('50','50'),('100','100')]
    SOLR_DEFAULT_ROWS = '20'
    SOLR_DEFAULT_SORT = 'pubdate_sort desc'
    SOLR_SORT_OPTIONS = ['DATE','RELEVANCE','CITED','POPULARITY']
    SOLR_MISC_DEFAULT_PARAMS = [('fq', ['pubdate_sort:[* TO 20130000]'])]
    SOLR_DEFAULT_FORMAT = 'json'
    
    # copy logging.conf.dist -> logging.conf and uncomment
    LOGGING_CONFIG = os.path.join(_basedir, 'logging.conf')
    
    INVENIO_BASEURL = 'http://adsx.cfa.harvard.edu'
    ADS_CLASSIC_BASEURL = 'http://adsabs.harvard.edu'

    API_DEFAULT_RESPONSE_FORMAT = 'json'
    # this is the full list of fields available
    # Note that most api accounts will not have access to the full list of fields
    API_SOLR_FIELDS = ['bibcode','bibstem','title','author','pub','score','property','abstract','keyword','references','full','ack','identifier']
    API_SOLR_FACET_FIELDS = {
        'bibstem': 'bibstem_facet',
        'author': 'author_facet',
        'property': 'property',
        'keyword': 'keyword_facet',
        'pubdate': 'pubdate',
        'pub': 'pub',
    }

try:
    from local_config import LocalConfig
except ImportError:
    LocalConfig = type('LocalConfig', (object,), dict())
    
for attr in filter(lambda x: not x.startswith('__'), dir(LocalConfig)):
    setattr(AppConfig, attr, LocalConfig.__dict__[attr])
    
config = AppConfig