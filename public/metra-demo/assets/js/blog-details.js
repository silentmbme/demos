(() => {
  // src/assets/js/blog-details.js
  (function() {
    "use strict";
    const blogDetailsComments = document.getElementById("blog-details-comment-list");
    if (blogDetailsComments) {
      new SimpleBar(blogDetailsComments, { autoHide: true });
    }
  })();
})();
