---
layout:     post
title:      Serializing form inputs
date:       2015-08-21 12:32:18
summary:    The most common ways to get form inputs serialized
categories: javascript jQuery
---

When processing a form, there's a need to serialize all inputs to be able to send values via ajax.
Example of a form (no labels for brevity):

{% highlight html lineanchors %}
<form>
  <input type="text" name="model" value="T1000">

  <select name="gender">
    <option selected="selected">male</option>
    <option>female</option>
  </select>

  <select name="targets" multiple="multiple">
    <option selected="selected">John Connor</option>
    <option>Kyle Reese</option>
    <option selected="selected">Sarah Connor</option>
  </select>

  <input type="checkbox" name="weapons" value="pistol">
  <input type="checkbox" name="weapons" value="machine gun" checked="checked">

  <input type="radio" name="vehicle" value="helicopter" checked="checked">
  <input type="radio" name="vehicle" value="car">

  <button type="submit">Submit</button>
</form>
{% endhighlight %}

### `serialize`

Usually it's enough to serialize form elements as a string:

{% highlight javascript %}
$('form').serialize();
{% endhighlight %}

We'll get following string as a result:

{% highlight html %}
model=T1000&gender=male&targets=John+Connor&targets=Sarah+Connor&weapons=machine+gun&vehicle=helicopter
{% endhighlight %}

And that's fine if validation is taking place in the backend.
But what if you wanted to validate attributes on the client side? Then the simplest way would be to
check for every input using something like `$('form').find('input[name=model]').val()`. But that would
be tiresome for each input and not future proof.

### `serializeArray`

You can get an array of all inputs as objects by using:

{% highlight javascript %}
$('form').serializeArray();
{% endhighlight %}

This will get us a following result:

{% highlight json %}
[
  {name:"model",   value:"T1000"},
  {name:"gender",  value:"male"},
  {name:"targets", value:"John Connor"},
  {name:"targets", value:"Sarah Connor"},
  {name:"weapons", value:"machine gun"},
  {name:"vehicle", value:"helicopter"}
]
{% endhighlight %}

Each input is treated as an object - that's fine but not as handy, because you have to reference `name`
and `value` and code will not be as short as you'd like.

### `$.fn.serializeObject`

Then there's a beautiful method that can be added to your code so that you'll
be able to get flat object consisting of name:value pairs:

{% highlight javascript lineanchors %}
$.fn.serializeObject = function() {
  var obj = {},
      arr = this.serializeArray();
  $.each(arr, function() {
    if (obj[this.name] !== void 0) {
      if (!obj[this.name].push) {
        obj[this.name] = [obj[this.name]];
      }
      obj[this.name].push(this.value || '');
    } else {
      obj[this.name] = this.value || '';
    }
  });
  return obj;
};
{% endhighlight %}

Originally found on [StackOverflow](http://stackoverflow.com/a/31751351/484363){:target='_blank'}.

When calling this method on form

{% highlight javascript %}
$('form').serializeObject();
{% endhighlight %}

We'll get a following result:

{% highlight json %}
{
  model:    "T1000",
  gender:   "male",
  targets:[
    "John Connor",
    "Sarah Connor"
  ],
  weapons:  "machine gun",
  vehicle:  "helicopter"
}
{% endhighlight %}

Now this result is a much more cleaner and ready for validations - something similar to
model validations in Backbone.js:

{% highlight javascript lineanchors %}

var attributes = $('form').serializeObject();
getErrors(attributes);

getErrors: function(attrs) {
  if (!attrs.model) {
    return 'Please fill in model field.';
  }
  if (attrs.model.length < 3) {
    return 'Model must be at least 3 characters long.';
  }
  return false;
}
{% endhighlight %}

[Here's a JSFiddle to play around](http://jsfiddle.net/a2n017am/){:target='_blank'}.
