var list = document.getElementById('list');
var search = document.getElementById('search');
var allGists = [];
var gists = [];

var renderGists = function() {
  for (var i = 0; i < gists.length; i++) {
    var gist = gists[i];

    var div = document.createElement('div');
    var pName = document.createElement('p');
    var pUrl = document.createElement('p');
    var hr = document.createElement('hr');

    pName.innerText = gist.title;
    pUrl.innerText = gist.url;

    div.appendChild(pName);
    div.appendChild(pUrl);
    div.style.cursor = "pointer";

    div.addEventListener('click', function() {
      chrome.tabs.create({ url: gist.url });
    })

    list.appendChild(div);
    list.appendChild(hr);
  }
}

chrome.history.search({text: "gist.github.com", maxResults: 1000}, function(results) {
  for(var i = 0; i < results.length; i++) {
    if(results[i].url.match(/gist.github.com\/.*\/.*/)) {
      gists.push(results[i]);
    }
  }

  allGists = gists.map(a => Object.assign({}, a));

  renderGists();
});

search.addEventListener('keyup', function() {
  var queryString = search.value;

  gists = allGists.filter(function(gist) {
    return gist.title.toLowerCase().match(new RegExp(queryString.toLowerCase()));
  });

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  renderGists();
});
