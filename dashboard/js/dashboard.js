// The one interaction genuinely impossible in pure CSS: substring
// matching against two fields as the user types. Everything else in
// this dashboard runs on radios, :has(), :target and <details> alone.
document.getElementById("search-box").addEventListener("input", function (e) {
  var q = e.target.value.trim().toLowerCase();
  document.querySelectorAll("#history-rows tr").forEach(function (tr) {
    var haystack = tr.getAttribute("data-search") || "";
    tr.setAttribute(
      "data-search-hidden",
      q && haystack.indexOf(q) === -1 ? "true" : "false",
    );
  });
});
