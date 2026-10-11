(() => {
  // src/assets/js/fileupload.js
  (function() {
    "use strict";
    let myDropzone = new Dropzone(".dropzone");
    myDropzone.on("addedfile", (file) => {
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
    FilePond.create(
      document.querySelector(".single-fileupload"),
      {
        labelIdle: `Drag & Drop your picture or <span class="filepond--label-action">Browse</span>`,
        imagePreviewHeight: 170,
        imageCropAspectRatio: "1:1",
        imageResizeTargetWidth: 200,
        imageResizeTargetHeight: 200,
        stylePanelLayout: "compact circle",
        styleLoadIndicatorPosition: "center bottom",
        styleButtonRemoveItemPosition: "center bottom"
      }
    );
  })();
})();
