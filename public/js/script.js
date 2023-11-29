/**
 * 
 * Validates the input in the event page form fields.
 * @param {Event} e
 *
 */

function submit_event(e){
    e.preventDefault();

    console.log('attemping a video uplaod');
    const title = document.getElementById('name').value.trim();
    const desc = document.getElementById('desc').value.trim();
    const file = document.getElementById('file').value;

    if(!title || !desc){
        alert('please enter all the following fields!');
        return;
    }

    alert('Uploading Video');
    document.getElementById('upload_form').submit();
}