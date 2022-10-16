import createFile from './CreateFile.js'

import fetch from 'node-fetch'

import fs from 'node:fs/promises'

const key = `k_bn1dl2qs`

function getMovieInfo(id){ 
    return fetch(`https://imdb-api.com/en/API/Title/${key}/${id}`).then(response=>response.json()) .then(data=> {
    const movie = { "id" : data.id, "title" : data.title, "duration" : data.runtimeMins}                                  
    return movie
    })
}

async function app(){
    try{
        const moviesPromise = fs.readFile('MovieIds.json').then(data=> JSON.parse(data))
        const movies = await moviesPromise
        
        let totalDuration = 0
        const movieList = []
        for (const id of movies["movie-ids"]){
            const movie = await getMovieInfo(id)
            totalDuration += parseInt(movie["duration"])
            movieList.push(movie)
        }
        
        const moviesInfo = {
            "total-duration" : totalDuration,
             "movies" : movieList}
        const moviesInfoString =  JSON.stringify(moviesInfo)
        createFile("movieInfo", moviesInfoString)

    }catch(err){
        console.log("Error", err)
    }  
    
 }
 
 function main(){
    app()
 }
 
 main()
 