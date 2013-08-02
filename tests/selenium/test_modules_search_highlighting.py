import os
import sys
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from base import case_ins_contains, wait_for_page, start_page

def test_generate():

    test_params = [
        ('grant1','"GO9-0102X"','GO9-0102X', False),
        ('grant2','full:"GO9-0102X"','GO9-0102X', False),
        ('grant3','"GO9-0102x"','GO9-0102x',False),
        ('shapley1','shapley bibcode:1913AN....196..385S','shapley',False),
        ('shapley2','full:shapley bibcode:1913AN....196..385S','shapley',False),
        ('postagb','"post-agb"','post-agb',False),
        ('mcmc1','MCMC +monte*', 'MCMC',False),
        ('mcmc2','MCMC +monte*', 'monte',False),
        ('author1','author:"de Souza"', None, True),
        ('author2','author:"*woo"', None, True),
        ]
    
    for name, q, match, not_exist in test_params:

        if not_exist:
            func = lambda q: check_highlights_not_exist(q)
            desc = "search %s should not display highlights" % q
            func.description = 'test_%s: %s' % (name, desc)
            yield func, q
        else:
            func = lambda q, match: check_highlights(q, match)
            desc = "search %s, highlights should contain %s" % (q, match)
            func.description = 'test_%s: %s' % (name, desc)
            yield func, q, match
        
def check_highlights(q, match):
    # check that matching highlights are displayed
    browser = webdriver.Firefox()
    start_page(browser)
    query_input = browser.find_element_by_name("q")
    query_input.clear()
    query_input.send_keys(q + Keys.RETURN)
    wait_for_page(browser, "footer")
    xpath = '//span[@class="highlight"]/em[%s]' % case_ins_contains(match.lower())
    elements = browser.find_elements_by_xpath(xpath)
    assert len(elements) > 0, "no highlights for query: %s" % q
    browser.close()

def check_highlights_not_exist(q):
    # test that no highlights are displayed
    browser = webdriver.Firefox()
    start_page(browser)
    query_input = browser.find_element_by_name("q")
    query_input.clear()
    query_input.send_keys(q + Keys.RETURN)
    wait_for_page(browser, "footer")
    elements = browser.find_elements_by_xpath('//span[@class="highlight"]')
    assert len(elements) == 0, "found highlights for query: %s" % q
    browser.close()
    
if __name__ == '__main__':
    import nose
    nose.run(defaultTest=__name__, argv=[__file__, '-v'])
