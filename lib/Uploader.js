var Uploader = function (options) {

  'use strict';

  var uploadResults = [];
  var $fileInputs = [];
  var files = [];
  var isOldie = _isOldBrowser();
  var self = this;

  options.postUrl = options.postUrl || options.$form.attr('action');

  // Upload by iframe does not support multiple
  // This is no problem since older browsers do not support
  // attribute, but just in case:
  if (isOldie || options.uploadFn === 'UploaderWithIframe') {
    $('input[type="file"]', options.$form).removeAttr('multiple');
  }

  // Public method
  // Upload all the <input type="file" />
  // elements in the $form
  function doUploadForm() {
    _resetVars();
    options.$form.trigger('upload.form.start');

    $fileInputs = _getNonEmptyFileInputs(options.$form);

    $fileInputs.each(function (index, fileInput) {
      $.merge(files, _getFilesFromFileInput($(fileInput)));
    });

    _doUpload();
  }

  // Public method
  // Upload a single <input type="file" />
  function doUploadSingleInput($fileInput) {
    _resetVars();

    options.$form.trigger('upload.form.start');

    $fileInputs.push($fileInput);
    files = _getFilesFromFileInput($fileInput);

    _doUpload();
  }

  // Reset all 'global' variables
  function _resetVars() {
    uploadResults = [];
    $fileInputs = [];
    files = [];
  }

  // Filter the empty file inouts
  function _getNonEmptyFileInputs($form) {
    return $('input[type="file"]', $form).filter(function (index, fileInput) {
      return !!$(fileInput).val();
    });
  }

  function _doUpload() {
    var uploadFn = getUploadFn();

    _asyncForEach(files, function (fileObj, callback) {
      fileObj.$fileInput.trigger('upload.input.start', fileObj.file);

      var uploading = uploadFn(fileObj);
      uploading.always(function () {
        callback();
      });

    }, function () {
      options.$form.trigger('upload.form.complete', uploadResults);
      _resetVars();
    });
  }

  function getUploadFn() {
    return options.uploadFn || isOldie ? _doUploadWithIframe : _doUploadWithAjax;
  }

  function _getFilesFromFileInput($fileInput) {
    var filesFromFileInput = [];
    var inputFiles;
    if ($fileInput.get(0).files) {
      // Modern browsers
      inputFiles = $fileInput.get(0).files;
    } else {
      // fileInput.files does not work in IE9,
      // it doesn't support multiple uploads anyway, so we can just query the value
      // $fileInput.val() looks like: C:\fakepath\filename.ext, even on OSX,
      // We pass just the filename.ext
      inputFiles = [{'name': $fileInput.val().split('\\')[2]}];
    }

    $.each(inputFiles, function (index, file) {
      filesFromFileInput.push({
        $fileInput: $fileInput,
        file: file
      });
    });
    return filesFromFileInput;
  }

  function _doUploadWithAjax(fileObj) {
    var uploader = new UploaderWithAjax($.extend({}, options, fileObj));
    return _handleAsyncUploadResults(uploader.doUpload(), fileObj);
  }

  function _doUploadWithIframe(fileObj) {
    var uploader = new UploaderWithIframe($.extend({}, options, fileObj));
    return _handleAsyncUploadResults(uploader.doUpload(), fileObj);
  }

  function _handleAsyncUploadResults(uploading, fileObj) {
    var file = fileObj.file;
    var $fileInput = fileObj.$fileInput;

    uploading.done(function (result) {
      if (options.onSuccessCallback && typeof options.onSuccessCallback === 'function') {
        options.onSuccessCallback(result, file, $fileInput);
      }
    });

    uploading.fail(function (result) {
      if (options.onErrorCallback && typeof options.onErrorCallback === 'function') {
        options.onErrorCallback(result, file, $fileInput);
      }
    });

    uploading.always(function (result) {
      uploadResults.push(result);
      $fileInput.trigger('upload.input.complete', result);
    });
    return uploading;
  }

  function _asyncForEach(array, fn, callback) {
    array = array.slice(0);
    function processOne() {
      var item = array.pop();

      fn(item, function(result) {
        if (array.length > 0) {
          setTimeout(processOne, 0); // schedule immediately
        } else {
          callback(); // Done!
        }
      });
    }
    if (array.length > 0) {
      setTimeout(processOne, 0); // schedule immediately
    } else {
      callback(); // Done!
    }
  }

  // Test if the files property exists on the
  // file input element and if
  // window.FormData is supported
  // if either is not supported, it's an old browser
  // and we upload through an iframe
  function _isOldBrowser() {
     var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.files || !window.FormData;
  }

  return {
    doUploadForm: doUploadForm,
    doUploadSingleInput: doUploadSingleInput,
    isOldie: isOldie
  };
};