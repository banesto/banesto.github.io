jQuery(function() {

  $('#search-box').focus();

  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  window.idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('url');
    this.field('content');
    this.field('category');
    this.field('date');
  });

  // Download the data from the JSON file we generated
  window.data = $.getJSON('/search_data.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function(loaded_data){
    $.each(loaded_data, function(index, value){
      window.idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });

  function doSearch() {
    var query = $("#search-box").val(); // Get the value for the text field
    var results = window.idx.search(query); // Get lunr to perform a search
    display_search_results(results); // Hand the results off to be displayed
  }

  $("#site-search").keydown(function(e) {
    switch (e.keyCode) {
      case 9:
        e.preventDefault();
        break;
      case 13:
        e.preventDefault();
        link = $("#search-results").find('li.active > a').attr('href');
        if (link !== undefined) {
          window.location.href = link;
        }
        break;
      case 27:
        cancelSearch();
        break;
    }
  });

  $("#site-search").keyup(function(e) {
    if (e.keyCode < 16 || e.keyCode >= 36 && e.keyCode < 91) {
      switch (e.keyCode) {
        case 38:
        case 40:
        case 9:
          changeFocus(e);
          break;
        case 37:
        case 39:
          break;
        case 13:
          break;
        default:
          return doSearch();
      }
    }
  });

  $('#search-box').blur(cancelSearch);

  function changeFocus(e) {
    var $active, $active_suggestion, $lia, activeIndex, index;
    $active_suggestion = $("#search-results").find('li.active');
    if ($active_suggestion) {
      activeIndex = $active_suggestion.attr('data-index');
      $active_suggestion.removeClass('active');
    }
    $lia = $("#search-results").find('li');
    if (e.keyCode === 40 || e.keyCode === 9) {
      if (activeIndex === void 0 || parseInt(activeIndex) === $lia.size() - 1) {
        index = 0;
      } else {
        index = parseInt(activeIndex) + 1;
      }
    } else if (e.keyCode === 38) {
      if (parseInt(activeIndex) === 0 - $lia.size()) {
        index = -1;
      } else {
        index = parseInt(activeIndex) - 1;
      }
    }
    $active = $lia.eq(index);
    $active.addClass('active');
    $("#search-box").val($active.find('a').text());
    return false;
  }

  function cancelSearch() {
    $("#search-results").html('');
    $("#search-box").val('');
  }

  function display_search_results(results) {
    var $searchResults = $("#search-results");

    // Wait for data to load
    window.data.then(function(loaded_data) {
      if (results.length) {
        $searchResults.empty(); // Clear any old results

        // Iterate over the results
        $.each(results, function(index, result) {
          var item = loaded_data[result.ref];
          var appendString = '<li data-index="' + index + '"><a href="' + item.url + '">' + item.title + '</a></li>';
          $searchResults.append(appendString);
        });
      } else {
        $searchResults.html('<li>No results found</li>');
      }
    });
  }
});
