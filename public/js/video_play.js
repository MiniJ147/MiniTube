console.log('running');
window.onload = ()=>{
    const search_param = new URLSearchParams(window.location.search)
    let query = {};

    //grabbing query
    for(const value of search_param.keys()){
        query[value] = search_param.get(value);
    }

    console.log(query);
    
    let video = document.getElementById('video_player');
    if(!video){
        throw "video does not exist";
    }

    //adjusting to the query
    video.setAttribute('src',`/video/download?channel=${query.channel}&video=${query.video}`);
}
