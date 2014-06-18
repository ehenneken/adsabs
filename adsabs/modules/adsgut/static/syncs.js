// Generated by CoffeeScript 1.7.1

/*
the idea behind syncs.coffee is to create a Backbone sync component for our API.
For this we must identify the models and views across our pages.

The method signature of Backbone.sync is sync(method, model, [options])

method – the CRUD method ("create", "read", "update", or "delete")
model – the model to be saved (or collection to be read)
options – success and error callbacks, and all other jQuery request options

With the default implementation, when Backbone.sync sends up a request to save a model,
its attributes will be passed, serialized as JSON, and sent in the HTTP body with content-type application/json.
When returning a JSON response, send down the attributes of the model that have been changed by the server,
and need to be updated on the client. When responding to a "read" request from a collection (Collection#fetch),
send down an array of model attribute objects.

Whenever a model or collection begins a sync with the server, a "request" event is emitted.
If the request completes successfully you'll get a "sync" event, and an "error" event if not.

The sync function may be overriden globally as Backbone.sync, or at a finer-grained level,
by adding a sync function to a Backbone collection or to an individual model.

 *but we shall first start slow, by building in direct jquery functions here, instead of Backbone.sync.
This will document the api as well. We wont start with gets, but remember we want to later put gets inside
collections.fetch

error
Type: Function( jqXHR jqXHR, String textStatus, String errorThrown )
success
Type: Function( PlainObject data, String textStatus, jqXHR jqXHR )
 */

(function() {
  var $, accept_invitation, add_group, change_description, change_ownership, create_postable, delete_membable, do_get, doajax, get_postables, get_postables_writable, h, invite_user, make_public, post_for_itemsinfo, prefix, remove_items_from_postable, remove_memberable_from_membable, remove_note, remove_tagging, root, save_items, send_bibcodes, send_params, submit_note, submit_notes, submit_posts, submit_tag, submit_tags, taggings_postings_post_get, toggle_rw;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  $ = jQuery;

  h = teacup;

  doajax = $.ajax;

  prefix = GlobalVariables.ADS_PREFIX + "/adsgut";

  send_params = function(url, data, cback, eback) {
    var params, stringydata, xhr;
    stringydata = JSON.stringify(data);
    params = {
      type: 'POST',
      dataType: 'json',
      url: url,
      data: stringydata,
      contentType: "application/json",
      success: cback,
      error: eback
    };
    return xhr = doajax(params);
  };

  send_bibcodes = function(url, items, cback, eback) {
    var bibcodes, data, i;
    bibcodes = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        _results.push(i.basic.name);
      }
      return _results;
    })();
    data = {
      bibcode: bibcodes
    };
    return send_params(url, data, cback, eback);
  };

  do_get = function(url, cback, eback) {
    var params, xhr;
    params = {
      type: 'GET',
      dataType: 'json',
      url: url,
      success: cback,
      error: eback
    };
    return xhr = doajax(params);
  };

  change_ownership = function(adsid, fqpn, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + fqpn + "/changes";
    data = {
      memberable: adsid,
      op: 'changeowner'
    };
    return send_params(url, data, cback, eback);
  };

  toggle_rw = function(fqmn, fqpn, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + fqpn + "/changes";
    data = {
      memberable: fqmn,
      op: 'togglerw'
    };
    return send_params(url, data, cback, eback);
  };

  change_description = function(description, fqpn, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + fqpn + "/changes";
    data = {
      memberable: "crap",
      op: 'description',
      description: description
    };
    return send_params(url, data, cback, eback);
  };

  accept_invitation = function(adsid, fqpn, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + fqpn + "/changes";
    data = {
      memberable: adsid,
      op: 'accept'
    };
    return send_params(url, data, cback, eback);
  };

  invite_user = function(adsid, postable, changerw, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + postable + "/changes";
    data = {
      memberable: adsid,
      op: 'invite',
      changerw: changerw
    };
    return send_params(url, data, cback, eback);
  };

  create_postable = function(postable, postabletype, cback, eback) {
    var data, url;
    url = prefix + ("/" + postabletype);
    data = {
      name: postable.name,
      description: postable.description
    };
    return send_params(url, data, cback, eback);
  };

  add_group = function(selectedgrp, postable, changerw, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + postable + "/members";
    data = {
      member: selectedgrp,
      changerw: changerw
    };
    return send_params(url, data, cback, eback);
  };

  make_public = function(postable, cback, eback) {
    var data, url;
    url = prefix + "/postable/" + postable + "/members";
    data = {
      member: 'adsgut/user:anonymouse',
      changerw: false
    };
    return send_params(url, data, cback, eback);
  };

  get_postables = function(user, cback, eback) {
    var nick, url;
    nick = user;
    url = prefix + "/user/" + nick + "/postablesuserisin";
    return do_get(url, cback, eback);
  };

  get_postables_writable = function(user, cback, eback) {
    var nick, url;
    nick = user;
    url = prefix + "/user/" + nick + "/postablesusercanwriteto";
    return do_get(url, cback, eback);
  };

  submit_note = function(item, itemname, notetuple, ctxt, cback, eback) {
    var data, itemtype, tagtype, ts, url;
    tagtype = "ads/tagtype:note";
    itemtype = "ads/itemtype:pub";
    url = prefix + "/tags/" + item;
    ts = {};
    ts[itemname] = [
      {
        content: notetuple[0],
        tagtype: tagtype,
        tagmode: notetuple[1]
      }
    ];
    data = {
      tagspecs: ts,
      itemtype: itemtype
    };
    if (ctxt !== 'udg' && ctxt !== 'public' && ctxt !== 'none') {
      data.fqpn = ctxt;
    }
    if (notetuple[0] !== "") {
      return send_params(url, data, cback, eback);
    }
  };

  submit_tag = function(item, itemname, tag, pview, cback, eback) {
    var data, itemtype, tagmode, tagtype, ts, url;
    tagtype = "ads/tagtype:tag";
    itemtype = "ads/itemtype:pub";
    url = prefix + "/tags/" + item;
    tagmode = '1';
    if (pview === 'pub') {
      tagmode = '0';
    } else if (pview === 'udg' || pview === 'none') {
      tagmode = '0';
    } else {
      tagmode = pview;
    }
    ts = {};
    ts[itemname] = [
      {
        name: tag,
        tagtype: tagtype,
        tagmode: tagmode
      }
    ];
    data = {
      tagspecs: ts,
      itemtype: itemtype
    };
    if (tag !== "") {
      return send_params(url, data, cback, eback);
    }
  };

  remove_note = function(item, tagname, ctxt, cback, eback) {
    var data, tagtype, url;
    tagtype = "ads/tagtype:note";
    url = prefix + "/tagsremove/" + item;
    data = {
      tagtype: tagtype,
      tagname: tagname
    };
    if (ctxt !== 'udg' && ctxt !== 'none') {
      data.fqpn = ctxt;
    }
    if (ctxt === 'public') {
      data.fqpn = "adsgut/library:public";
    }
    return send_params(url, data, cback, eback);
  };

  remove_tagging = function(item, tagname, fqtn, ctxt, cback, eback) {
    var data, tagtype, url;
    tagtype = "ads/tagtype:tag";
    url = prefix + "/tagsremove/" + item;
    data = {
      tagtype: tagtype,
      tagname: tagname
    };
    if (fqtn !== void 0) {
      console.log("FQTN IS", fqtn);
      data.fqtn = fqtn;
    }
    if (ctxt !== 'udg' && ctxt !== 'none') {
      data.fqpn = ctxt;
    }
    if (ctxt === 'public') {
      data.fqpn = "adsgut/library:public";
    }
    return send_params(url, data, cback, eback);
  };

  remove_items_from_postable = function(items, ctxt, cback, eback) {
    var data, url;
    url = prefix + "/itemsremove";
    data = {
      items: items
    };
    if (ctxt !== 'udg' && ctxt !== 'none') {
      data.fqpn = ctxt;
    }
    if (ctxt === 'public') {
      data.fqpn = "adsgut/library:public";
    }
    return send_params(url, data, cback, eback);
  };

  submit_tags = function(items, tags, postables, cback, eback) {
    var data, fqin, i, inames, itemtype, name, p, t, tagtype, ts, url, _i, _j, _k, _len, _len1, _len2, _ref;
    tagtype = "ads/tagtype:tag";
    itemtype = "ads/itemtype:pub";
    url = prefix + "/items/taggings";
    ts = {};
    inames = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      i = items[_i];
      fqin = i.basic.fqin;
      name = i.basic.name;
      if (tags[fqin].length > 0) {
        inames.push(name);
        ts[name] = [];
        _ref = tags[fqin];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          t = _ref[_j];
          if (postables.length > 0) {
            for (_k = 0, _len2 = postables.length; _k < _len2; _k++) {
              p = postables[_k];
              ts[name].push({
                name: t,
                tagtype: tagtype,
                tagmode: p
              });
            }
          } else {
            ts[name].push({
              name: t,
              tagtype: tagtype
            });
          }
        }
      }
    }
    if (inames.length > 0) {
      data = {
        tagspecs: ts,
        itemtype: itemtype,
        items: inames
      };
      return send_params(url, data, cback, eback);
    } else {
      return cback();
    }
  };

  submit_notes = function(items, notetuples, cback, eback) {
    var data, fqin, i, inames, itemtype, name, nt, tagtype, ts, url, _i, _len;
    tagtype = "ads/tagtype:note";
    itemtype = "ads/itemtype:pub";
    url = prefix + "/items/taggings";
    ts = {};
    inames = [];
    for (_i = 0, _len = items.length; _i < _len; _i++) {
      i = items[_i];
      fqin = i.basic.fqin;
      name = i.basic.name;
      if (notetuples[fqin].length > 0) {
        inames.push(name);
        ts[name] = (function() {
          var _j, _len1, _ref, _results;
          _ref = notetuples[fqin];
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            nt = _ref[_j];
            _results.push({
              content: nt[0],
              tagtype: tagtype,
              tagmode: nt[1]
            });
          }
          return _results;
        })();
      }
    }
    if (inames.length > 0) {
      data = {
        tagspecs: ts,
        itemtype: itemtype,
        items: inames
      };
      return send_params(url, data, cback, eback);
    } else {
      return cback();
    }
  };

  submit_posts = function(items, postables, cback, eback) {
    var data, i, itemnames, itemtype, url;
    itemtype = "ads/itemtype:pub";
    itemnames = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        _results.push(i.basic.name);
      }
      return _results;
    })();
    url = prefix + "/items/postings";
    if (postables.length > 0) {
      data = {
        postables: postables,
        itemtype: itemtype,
        items: itemnames
      };
      return send_params(url, data, cback, eback);
    } else {
      return cback();
    }
  };

  save_items = function(items, cback, eback) {
    var data, i, itemnames, itemtype, url;
    itemtype = "ads/itemtype:pub";
    itemnames = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        i = items[_i];
        _results.push(i.basic.name);
      }
      return _results;
    })();
    url = prefix + "/items";
    data = {
      items: itemnames,
      itemtype: itemtype
    };
    return send_params(url, data, cback, eback);
  };

  taggings_postings_post_get = function(items, pview, cback) {
    var data, eback, url;
    url = prefix + "/items/taggingsandpostings";
    eback = function() {
      return alert("Error Occurred");
    };
    data = {
      items: items
    };
    if (pview !== 'udg' && pview !== 'none' && pview !== 'public') {
      data.fqpn = pview;
    }
    return send_params(url, data, cback, eback);
  };

  post_for_itemsinfo = function(url, itemstring, cback) {
    var data, eback;
    eback = function() {
      return alert("Error Occurred");
    };
    data = {
      items: itemstring
    };
    return send_params(url, data, cback, eback);
  };

  remove_memberable_from_membable = function(memberable, membable, cback, eback) {
    var data, url;
    url = prefix + "/memberremove";
    data = {
      fqpn: membable,
      member: memberable
    };
    return send_params(url, data, cback, eback);
  };

  delete_membable = function(membable, cback, eback) {
    var data, url;
    url = prefix + "/membableremove";
    data = {
      fqpn: membable
    };
    return send_params(url, data, cback, eback);
  };

  root.syncs = {
    accept_invitation: accept_invitation,
    invite_user: invite_user,
    add_group: add_group,
    make_public: make_public,
    change_ownership: change_ownership,
    toggle_rw: toggle_rw,
    get_postables: get_postables,
    get_postables_writable: get_postables_writable,
    submit_note: submit_note,
    submit_tag: submit_tag,
    submit_tags: submit_tags,
    submit_notes: submit_notes,
    submit_posts: submit_posts,
    save_items: save_items,
    create_postable: create_postable,
    change_description: change_description,
    send_bibcodes: send_bibcodes,
    taggings_postings_post_get: taggings_postings_post_get,
    post_for_itemsinfo: post_for_itemsinfo,
    remove_tagging: remove_tagging,
    remove_note: remove_note,
    remove_items_from_postable: remove_items_from_postable,
    remove_memberable_from_membable: remove_memberable_from_membable,
    delete_membable: delete_membable
  };

}).call(this);
