'''
Created on Apr 16, 2014

@author: ehenneken
'''
from flask import (Blueprint, render_template, flash, g, jsonify, current_app as app)
from config import config #the global config object
from .errors import *
from .utils import get_graphics

__all__ = ['graphics_blueprint','graphics']

recommender_blueprint = Blueprint('graphics', __name__, template_folder="templates", url_prefix='/graphics')

@recommender_blueprint.after_request
def add_caching_header(response):
    """
    Adds caching headers
    """
    if not config.DEBUG:
        cache_header = 'max-age=3600, must-revalidate'
    else:
        cache_header = 'no-cache'
    response.headers.setdefault('Cache-Control', cache_header)
    return response

@graphics_blueprint.route('/<id>/<format>', methods=('GET','POST'))
def graphics(bibcode,format):
    """
    Get graphics for a given article in a particular format (thumbnail, low-res, high-res)
    """
    results = None
    try:
        results = get_graphics(id=id, format=format)
    except CannotGetGraphicsResults, e:
        app.logger.error('ID %s. Unable to get results! (%s)' % (g.user_cookie_id,e))
    if resuls:
        return render_template('graphics_embedded.html', results=results)
    else:
        return render_template('no_results.html')