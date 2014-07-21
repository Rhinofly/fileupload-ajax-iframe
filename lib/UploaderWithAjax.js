var UploaderWithAjax = function (options) {

  'use strict';

  var file        = options.file;
  var $fileInput  = options.$fileInput;
  var submitting  = new $.Deferred();
  var postUrl     = options.postUrl;
  var formData    = new FormData();

  function doUpload() {
    addFileToFormData();

    var posting   = _doPost(formData);
    posting.fail(_handlePostingFail);
    posting.success(_handlePostingSuccess);

    return submitting.promise();
  }

  function addFileToFormData() {
    formData.append('file', file);
  }

  function _handlePostingFail(jqXHR, textStatus) {
    submitting.reject({
      'status'   : jqXHR.status,
      'statusText': jqXHR.statusText,
      'responseText' : JSON.parse(jqXHR.responseText).responseText,
      'inputId'  : $fileInput.attr('name')
    });
  }

  function _handlePostingSuccess(data) {
    console.log(arguments);
    var result = JSON.parse(data);

    if (result.status.match(/^20\d\b/)) { // 20x status code
      submitting.resolve(result);
    } else {
      submitting.reject(result);
    }
  }

  function _doPost(formData) {
    return $.ajax({
      url         : postUrl,
      type        : 'POST',
      data        : formData,
      contentType : false,
      processData : false
    });
  }

  return {
    doUpload: doUpload
  };
};