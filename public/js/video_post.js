window.onload = ()=>{
    let form = document.getElementById('upload_form')
    if(form){
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            //parsing data
            const name = document.getElementById('name');
            const desc = document.getElementById('desc');
            const file = document.getElementById('file');
            
            if(!name.value || !desc.value || !file.files[0]){
                alert('Please Enter All Fields');
                return;
            }

            const file_name = file.files[0].name;
            if(!file_name.includes('.mp4')){
                alert('Please Enter Correct File Type (.mp4)');
                return;
            }

            const form_data = new FormData();

            form_data.append('name', name.value);
            form_data.append('desc', desc.value);
            form_data.append('file',file.files[0]);

            console.log(...form_data);

            //submitting data
            fetch('/upload/submit', {
                method: 'POST',
                body: form_data,
            })
            .then(res => res.json())
            .then(data => console.log(data));
        })
    }
}
