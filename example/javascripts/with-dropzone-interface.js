// See http://www.dropzonejs.com/

Dropzone.autoDiscover = false;

$(function () {
  var $form4 = $('#uploader-4');
  var myDropzone = new Dropzone('#uploader-4', {
    maxFiles: 3,
    //forceFallback: true,
    fallback: fileUploadFallback
  });

  function fileUploadFallback() {
    var uploader4 = new Uploader({
      $form: $form4,

      postUrl: $form4.attr('action'),

      onErrorCallback: function (result, file, $fileInput) {
        $fileInput.after($('<div />)', {
          'class': 'file-name is-' + result.status,
          'text': file.name + ' could not be uploaded, because: ' + result.responseText
        }));
      },

      onSuccessCallback: function (result, file, $fileInput) {
        $fileInput.after($('<div />)', {
          'class': 'file-name is-' + result.status,
          'text': file.name + ' is uploaded, yo!'
        }));
      },
      // No need to include UploaderWithAjax.js
      uploadFn: 'UploaderWithIframe'
    });

    $('input[type=file]', $form4).on('upload.input.start', function () {
      $(this).closest('.form-control').addClass('is-uploading');
    });

    $('input[type=file]', $form4).on('upload.input.complete', function (evt, result) {
      $(this).closest('.form-control').removeClass('is-uploading');
    });

    // doUploadSingleInput on change
    $('input[type="file"]', $form4).on('change', function () {
      var results = uploader4.doUploadSingleInput($(this));
    });
  }
});