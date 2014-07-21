var UploaderWithIframe = function (options) {

  'use strict';

  var $fileInput = options.$fileInput;
  var $form      = options.$form;
  var postUrl    = options.postUrl;


  function doUpload() {
    // Create a form and an iframe for each file input,
    // We need to move the $fileInput to the new form
    // Later we move it back to the original position

    // We need to check if multiple files are being
    // uploaded through attribute multiple,
    // If so we need to create a form and iframe for each one

    var id         = _generateRandomId();
    var $inputForm = _createFormWithCopiedFileInput($fileInput, id, postUrl);
    var $iframe    = _createIframe(id);
    var submitting = new $.Deferred();

    // Append both to dom, outside of the main form
    $form.after($inputForm, $iframe);

    // Submit the form
    $inputForm.submit();

    // Delete the new form,
    // note: this returns the
    // $fileInput to its original position
    _deleteFormAndRestoreFileInput($inputForm);

    $iframe.on('load', function () {
      var iframe = this;
      var result = JSON.parse(_getContentFromIframe(iframe));

      if (result.status.toString().match(/^20\d\b/)) { // 20x status code
        submitting.resolve(result);
      } else {
        submitting.reject(result);
      }
      $(iframe).remove();
    });

    return submitting.promise();
  }

  function _generateRandomId() {
    return Math.round(Math.random() * 10000000);
  }

  function _deleteFormAndRestoreFileInput($inputForm) {
    var $fileInput = $('input[type="file"]', $inputForm);
    var placeholderId = $fileInput.data('placeholderId');

    $fileInput
      .insertBefore('#' + placeholderId)
      .removeData('placeholderId');

    $('#' + placeholderId).remove();

    $inputForm.remove();
  }

  function _createFormWithCopiedFileInput($fileInput, id, url) {
    var placeholderId = 'upload-input-placeholder-' + id;
    var $placeholder = $('<div />', { id: placeholderId });

    $fileInput
      .data('placeholderId', placeholderId)
      .after($placeholder);

    return $('<form />', {
      'action': url,
      'method': 'post',
      'enctype': 'multipart/form-data',
      'target': 'upload-iframe-' + id
    }).css({ display: 'none' }).append($fileInput);
  }

  function _createIframe(id) {
    return $('<iframe />', {
      'frameborder' : 0,
      'width': 0,
      'height': 0,
      'id': 'upload-iframe-' + id,
      'name': 'upload-iframe-' + id
    }).css({ display: 'none' });
  }

  function _getContentFromIframe(iframe) {
    return iframe.contentWindow.document.body.innerHTML;
  }

  return {
    doUpload: doUpload
  };
};