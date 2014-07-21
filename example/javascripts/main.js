$(function () {

  // Upload all images on form submit.
  var $form1 = $('#uploader-1');

  // Instantiate Uploader
  var uploader1 = new Uploader({
    $form: $form1,
    postUrl: $form1.attr('action')
  });

  // Bind events
  $form1.on('upload.form.start', function (e) {
    $form1.prepend('<h3>Loading...</h3>');
    $('.error').remove();
    $('.success').remove();
  });

  $form1.on('upload.form.complete', function (e) {
    $('h3', $form1).remove();
  });

  $('input[type=file]', $form1).on('upload.input.start', function (evt, file) {
    $(this).after($('<div />', {
      'class': 'file-name is-uploading',
      'text': file.name
    }));
  });

  $('input[type=file]', $form1).on('upload.input.complete', function (evt, result) {
    $(this).next('.file-name').removeClass('is-uploading').addClass('is-' + result.status);
  });

  // doUploadForm on submit
  $form1.on('submit', function (evt) {
    evt.preventDefault();
    var results = uploader1.doUploadForm();
  });

  //=======================================================================
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

  //==========================================================
});
