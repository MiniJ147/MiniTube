console.log('running');
window.onload = ()=>{
    const search_param = new URLSearchParams(window.location.search)
    const query = search_param.get('video_search');
    
    let video = document.getElementById('video_player');
    if(!video){
        throw "video does not exist";
    }

    //adjusting to the query
    video.setAttribute('src',`/video/download?video_search=${query}`);
}
