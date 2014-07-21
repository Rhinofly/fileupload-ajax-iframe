$(function () {

  // Upload each image on fileinput change, always use iframe
  var $form3 = $('#uploader-3');

  // Instantiate Uploader
  var uploader3 = new Uploader({
    $form: $form3,

    postUrl: $form3.attr('action'),

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

    uploadFn: 'UploaderWithIframe'
  });

  $('input[type=file]', $form3).on('upload.input.start', function () {
    $(this).closest('.form-control').addClass('is-uploading');
  });

  $('input[type=file]', $form3).on('upload.input.complete', function (evt, result) {
    $(this).closest('.form-control').removeClass('is-uploading');
  });

  // doUploadSingleInput on change
  $('input[type="file"]', $form3).on('change', function () {
    var results = uploader3.doUploadSingleInput($(this));
  });
});