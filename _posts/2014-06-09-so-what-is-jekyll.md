---
layout:     post
title:      Serializing form inputs into flat object
date:       2015-08-21 12:32:18
summary:    Simple and easy way to get form input attribute names and values as object.
categories: javascript jQuery
---

There is a ```serializeArray``` method available in jQuery which returns a broader,
 quite cumbersome object, especially when everything you need is a attribue name and a value.

This elegant little method gets it done in a nice way:


{% highlight coffee lineanchors %}
$.fn.serializeObject = ->
  o = {}
  a = @serializeArray()
  $.each a, ->
    if o[@name] != undefined
      if !o[@name].push
        o[@name] = [ o[@name] ]
      o[@name].push @value or ''
    else
      o[@name] = @value or ''
    return
  o
{% endhighlight %}
