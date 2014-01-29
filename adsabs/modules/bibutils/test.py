'''
Created on Jul 16, 2013

@author: ehenneken
'''

# general module imports
import sys
import os
import time
import operator
import glob
from itertools import groupby
from multiprocessing import Process, Queue, cpu_count
import xlwt
import uuid
import simplejson
import pymongo
from flask import current_app as app
from flask.ext.solrquery import solr #@UnresolvedImport
from flask.ext.adsdata import adsdata #@UnresolvedImport
from adsabs.core.solr import get_document_similar

# local imports
from config import config
from .errors import SolrCitationQueryError
from .errors import SolrReferenceQueryError
from .errors import SolrMetaDataQueryError
from .errors import MongoQueryError

__all__ = ['get_solr_stats']

class SolrDataHarvester(Process):
    """
    Class to allow parallel retrieval from publication data from Solr
    """
    def __init__(self, task_queue, result_queue):
        Process.__init__(self)
        self.task_queue = task_queue
        self.result_queue = result_queue

    def run(self):
        while True:
            solr_request = self.task_queue.get()
            if solr_request is None:
                break
            try:
                req = solr.create_request(**solr_request)
                req = solr.set_defaults(req)
                resp = solr.get_response(req)
                self.result_queue.put(resp)
            except SolrCitationQueryError, e:
                app.logger.error("Solr data query for %s blew up (%s)" % (q,e))
                raise
        return


def get_solr_stats(**args):
    """
    Method to prepare the actual citation dictionary creation
    """
    #
    request_types = [
        {'fl':'bibcode,year,read_count,property','stats':'true','stats.field':'read_count','stats.facet':'year','wt':'json'},
        {'fl':'bibcode,year,[citations],property,reference','stats':'true','stats.field':'citation_count','stats.facet':'year','wt':'json'},
    ]
    # create the queues
    tasks = Queue()
    results = Queue()
    # how many threads are there to be used
    threads = args.get('threads',cpu_count())
    # get the bibcodes for which to get metrics data
    solr_request = args.get('solr_req',{})
    # initialize the "harvesters" (each harvester get the metrics data for a bibcode)
    harvesters = [ SolrDataHarvester(tasks, results) for i in range(threads)]
    # start the harvesters
    for b in harvesters:
        b.start()
    # put the bibcodes in the tasks queue
    num_jobs = 0
    for req in request_types:
        req.update(solr_request)
        if num_jobs == 1:
            req['q'] = "citations%s"%req['q']
        tasks.put(req)
        num_jobs += 1
    # add some 'None' values at the end of the tasks list, to faciliate proper closure
    for i in range(threads):
        tasks.put(None)
    # gather all results into one metrics data dictionary
    metrics_data = []
    while num_jobs:
        data = results.get()
        print data
        try:
            metrics_data.append(data)
        except:
            pass
        num_jobs -= 1
    return metrics_data