(() => {
  // src/assets/js/create-project.js
  (function() {
    "use strict";
    flatpickr("#startDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
    flatpickr("#endDate", {
      enableTime: true,
      dateFormat: "Y-m-d H:i"
    });
    const multipleCancelButton = new Choices(
      "#assigned-team-members",
      {
        allowHTML: true,
        removeItemButton: true
      }
    );
    const toolbarOptions = [
      [{ "header": [1, 2, 3, 4, 5, 6, false] }],
      [{ "font": [] }],
      ["bold", "italic", "underline", "strike"],
      // toggled buttons
      ["blockquote", "code-block"],
      [{ "header": 1 }, { "header": 2 }],
      // custom button values
      [{ "list": "ordered" }, { "list": "bullet" }],
      [{ "script": "sub" }, { "script": "super" }],
      // superscript/subscript
      [{ "indent": "-1" }, { "indent": "+1" }],
      // outdent/indent
      [{ "direction": "rtl" }],
      // text direction
      [{ "size": ["small", false, "large", "huge"] }],
      // custom dropdown
      [{ "color": [] }, { "background": [] }],
      // dropdown with defaults from theme
      [{ "align": [] }],
      ["image", "video"],
      ["clean"]
      // remove formatting button
    ];
    const quill = new Quill("#project-descriptioin-editor", {
      modules: {
        toolbar: toolbarOptions
      },
      theme: "snow"
    });
    FilePond.registerPlugin(
      FilePondPluginImagePreview,
      FilePondPluginImageExifOrientation,
      FilePondPluginFileValidateSize,
      FilePondPluginFileEncode,
      FilePondPluginImageEdit,
      FilePondPluginFileValidateType,
      FilePondPluginImageCrop,
      FilePondPluginImageResize,
      FilePondPluginImageTransform
    );
    const MultipleElement = document.querySelector(".multiple-filepond");
    if (MultipleElement) FilePond.create(MultipleElement);
    const textUniqueVals = new Choices("#choices-text-unique-values", {
      allowHTML: true,
      paste: false,
      duplicateItemsAllowed: false,
      editItems: true
    });
  })();
})();
