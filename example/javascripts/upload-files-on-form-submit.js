$(function () {

  // Upload all files on form submit.
  var $form1 = $('#uploader-1');

  // Instantiate Uploader
  var uploader1 = new Uploader({
    $form: $form1,
    postUrl: $form1.attr('action')
  });

  // Bind events
  $form1.on('upload.form.start', function (e) {
    $form1.prepend('<h3>Loading...</h3>');
    $('.file-name').remove();
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
});