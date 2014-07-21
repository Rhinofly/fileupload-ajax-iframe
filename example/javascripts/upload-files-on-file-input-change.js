$(function () {

  // Upload each image on fileinput change
  var $form2 = $('#uploader-2');

  // Instantiate Uploader
  var uploader2 = new Uploader({
    $form: $form2,
    postUrl: $form2.attr('action'),
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
    }
  });

  $('input[type=file]', $form2).on('upload.input.start', function () {
    $(this).closest('.form-control').addClass('is-uploading');
  });

  $('input[type=file]', $form2).on('upload.input.complete', function (evt, result) {
    $(this).closest('.form-control').removeClass('is-uploading');
  });

  // doUploadSingleInput on change
  $('input[type="file"]', $form2).on('change', function () {
    var results = uploader2.doUploadSingleInput($(this));
  });
});