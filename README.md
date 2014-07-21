Asynchrounous File Uploader
=========

Upload files asynchronously through AJAX if supported. Older browsers post through an iframe.

  - Use one API for both types
  - Depends on jQuery
  - Lightweight
  - Callbacks and events

Use Case
---
To submit a form with file inputs (and other inputs) asynchronously. First the files are submitted one by one to a REST API, which returns JSON. From this JSON an ID is retrieved. The file IDs are submitted (after the file uploads) with the rest of the form.

The returned JSON assumes the following format on success:

    {
        "status": 201,
        "id": "anIDOfTheUploadedFile",
        "responseText": "success"
    }

And the following on error:

    {
        "status": 415,
        "id": null,
        "responseText": "Relevant error message"
    }

Additional items, like URLs can be added if necessary.

How it works
---
1. A test is run to see if a browser supports ajax uploads *and* has the files property on file inputs (which means the ```multiple``` attribute is supported).
2. All files to be uploaded are collected from the file inputs and stored in an array.
3. The array of files is processed either through AJAX or by posting to an iframe.

The basics
---
The uploader consists of 3 classes each in their own file:
- **Uploader.js** - This class is the only one that needs to be instantiated. The next two classes will be instantiated by this class as needed.
- **UploaderWithAjax.js** - This class is used to upload a file through AJAX. This uses the FormData API.
- **UploaderWithIframe.js** - This class is used by older browsers (Only IE9 is tested). This has no support for the ```multiple``` attribute, which is not supported by IE9 anyway. Each file input is moved into its own invisible form, and posts into a hidden iframe by using the deprecated ```target``` attribute. The file input is moved back to its original position. The iframe posts synchronously to the server. When the server has responded, this JSON response is parsed and the iframe and newly created form is removed from the DOM. Ugly? You bet!

Usage
---
Include the necessary files. It's trivial to modify them to use as AMD.

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.js"></script>
    <script src="UploaderWithAjax.js"></script>
    <script src="UploaderWithIframe.js"></script>
    <script src="Uploader.js"></script>

Instantiate the Uploader class, this requires at one argument: the options object.

At least one option is required: ```$form```: a jQuery object of the form DOM element.

_Note: an instance of Uploader is required for each form._

    <script>
        var $form = $('form');
        var uploader = new Uploader({ $form: $form });
    </script>

Then call one of the two public methods:
- **doUploadForm** - Accepts no arguments, submits all file inputs.


    <script>
        var $form = $('form');
        var uploader = new Uploader({ $form: $form });

        $form.on('submit', function () {
            uploader.doUploadForm();
        });
    </script>

Or:
- **doUploadSingleInput** - Accepts a jQuery object of a single file input as argument, submits the file(s) selected in a single file input.


    <script>
        var $form = $('form');
        var uploader = new Uploader({ $form: $form });

        $('input[type=file]', $form).on('change', function () {
            uploader.doUploadSingleInput($(this));
        });
    </script>

Methods
---
- **doUploadForm** - Accepts no arguments, submits all file inputs.
- **doUploadSingleInput** - Accepts a jQuery object of a single file input as argument, submits the file(s) selected in a single file input.

_See examples above_

Options
---

The instance accepts one argument: the options object.
These options are supported:
- **$form** - _required_ - _A jQuery object_ of the form DOM element. This does not have to be an actual ```<form />``` element, but can also be a ```<div />``` or whuteva.
- **postUrl** _optional if an ```action``` attribute exists on $form_ - An _URL_ the inputs should post to. If defined in the options, it will override the URL set as the ```action``` attribute.
- **onSuccessCallback** - _optional_ - A _function_ executed when a single file has successfully uploaded. See below for this function's arguments.
- **onErrorCallback** - _optional_ - A _function_ executed when a single file has failed to upload. See below for this function's arguments.
- **uploadFn** - _optional_ - The _class name_ of the class to use, either _UploadWithIframe_ or _UploadWithAjax_. This overrides the test to see which class to use. Useful for testing.

**Arguments for onSuccessCallback & onErrorCallback**
- **result** - The JSON response from the server.
- **file** - The ```File``` object. Note: when submitting through an iframe, only the name property exists.
- **$fileInput** - the jQuery object referencing the DOM element of the relevant file input.

**Example of instance with all options **


    <script>
        var uploader = new Uploader({
            $form: $('#my-form'),

            postUrl: '/api/files',

            onSuccessCallback: function (result, file, $fileInput) {
                $fileInput.after($('<div />', {
                    'class': 'file-name is-success',
                    'text': file.name + ' has been uploaded'

                }));
            },

            onErrorCallback: function (result, file, $fileInput) {
                $fileInput.after($('<div />)', {
                    'class': 'file-name is-failed',
                    'text': file.name + ' could not be uploaded, because: ' + result.responseText
                }));
            },

            uploadFn: 'UploaderWithIframe'
        });
    </script>


Events
---
- **upload.form.start** -  Is triggered on the $form element each time an upload sequence starts, either through doUploadForm (once) or doUploadSingleInput (for each file input). _event data: none_.
- **upload.form.complete** - Is triggered on the $form element each time  an upload sequence is complete, either through doUploadForm (once) or doUploadSingleInput (for each file input). _event.data: an array of all upload results_
- **upload.input.start** - Is triggered on the $fileInput element when a single file starts uploading (so will be triggered multiple times if multiple files are selected). _event.data: the File object. Note: only has the name property when uploading through an iframe_.
- **upload.input.complete** - Is triggered on the $fileInput element when a single file has finished uploading (so will be triggered multiple times if multiple files are selected). _event.data: the JSON response from the server.

**Example of events**

    <script>
        $form.on('upload.form.start', function () {
            $form.prepend('<h3>Loading...</h3>');
            $('.file-name').remove();
        });

        $form.on('upload.form.complete', function (evt, uploadResults) {
            $('h3', $form).remove();
            console.log(uploadResults);
        });

        $('input[type=file]', $form).on('upload.input.start', function (evt, file) {
            $(this).after($('<div />', {
                'class': 'file-name is-uploading',
                'text': file.name
            }));
        });

        $('input[type=file]', $form).on('upload.input.complete', function (evt, result) {
            $(this).next('.file-name')
                .removeClass('is-uploading')
                .addClass('is-' + result.status);
        });
    </script>


Tested with:
---
- IE9,
- Chrome 36,
- Firefox 30


Version
----

0.1.0

