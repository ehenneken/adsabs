'''
Module to interface with the back-end authentication system
'''

class adsUser(object):
    _ID = u'7r23yrhfn4dmosi230984hfbndmsoki23d'
    _USERNAME = 'my@email.com'
    _PASSWORD = 'mypasswd'
    _ACTIVE = True
    _ANONYMOUS = False
    
    def __repr__(self):
        return '<User %r>' % self._USERNAME
    
    def is_authenticated(self):
        return True

    def is_active(self):
        return self._ACTIVE

    def is_anonymous(self):
        return self._ANONYMOUS

    def get_id(self):
        return self._ID
    
        
    

def get_user_by_id(id):
    """
    function needed by the Flask-Login to make the Login work
    given an user id (an actual meaningless id) it returns the user object
    """
    
    #for now I simply work with the fake user in this module
    return adsUser() if id == adsUser._ID else None


def authenticate(login, password):
    """
    function that authenticate an user against a back-end service
    given username and password
    """
    #for now I simply work with the fake user in this module
    
    #if the login works I return the user object and a boolean true that indicates if the user successfully authenticated
    if login == adsUser._USERNAME and password == adsUser._PASSWORD:
        return adsUser(), True
    else:
        return None, False