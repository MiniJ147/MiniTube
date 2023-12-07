
//very stupid implmentaion (coding too many hours straight)
//will rework later

function send_to_video(name){
    let URL = window.location.href;

    let counter = 0;
    for(let i=0;i<URL.length;i++){
        if(URL[i]=='/')
            counter++;

        if(counter===3){
            window.location.replace(URL.slice(0,i)+`/video?video_search=${name}`);
            break;
        }
    }
}