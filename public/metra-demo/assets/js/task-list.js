(() => {
  // src/assets/js/task-list.js
  (function() {
    "use strict";
    let checkAll = document.querySelector(".check-all");
    if (checkAll) {
      let checkAllFn = function() {
        if (checkAll.checked) {
          document.querySelectorAll(".task-checkbox input").forEach(function(e) {
            e.closest(".task-list").classList.add("selected");
            e.checked = true;
          });
        } else {
          document.querySelectorAll(".task-checkbox input").forEach(function(e) {
            e.closest(".task-list").classList.remove("selected");
            e.checked = false;
          });
        }
      };
      checkAll.addEventListener("click", checkAllFn);
    }
    let taskbtn = document.querySelectorAll(".task-delete-btn");
    if (taskbtn) {
      taskbtn.forEach((eleBtn) => {
        eleBtn.onclick = () => {
          let task = eleBtn.closest(".task-list");
          task.remove();
        };
      });
    }
    const multipleCancelButton = new Choices(
      "#choices-multiple-remove-button1",
      {
        allowHTML: true,
        removeItemButton: true
      }
    );
    flatpickr("#assignedDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
    flatpickr("#dueDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
    const myElement = document.getElementById("task-comments-area");
    if (myElement) {
      new SimpleBar(myElement, { autoHide: true });
    }
  })();
})();
