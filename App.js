import createFile from './CreateFile.js'

import fetch from 'node-fetch'

import fs from 'node:fs/promises'
import { create } from 'node:domain'

const key = `k_bn1dl2qs`

function getMovieInfo(movies){
    let totalDuration = 0
    const movieList = []
    for (const movieInfo of movies){
        totalDuration += parseInt(movieInfo.runtimeMins)
        const movieSelectedInfo = { "id" : movieInfo.id, "title" : movieInfo.title, "duration" : movieInfo.runtimeMins}   
        movieList.push(movieSelectedInfo)
    }
    const moviesInfo = {"total-duration" : totalDuration, "movies" : movieList}
    return moviesInfo
}



function createMovieFile(movies){
     const promises = movies["movie-ids"].map(id => fetch(`https://imdb-api.com/en/API/Title/${key}/${id}`).then(response=>response.json()).catch(error=>console.log(error)))
     Promise.all(promises).then(results=>{
        const moviesInfo = getMovieInfo(results)
        createFile("moviesInfo",JSON.stringify(moviesInfo))
     }
    ).catch((err) => {  console.error("There was problem retrieving data.", err)})

}

function app(){
    fs.readFile('MovieIds.json').then(data => JSON.parse(data)).then(movies=>createMovieFile(movies)).catch(error => console.log(error))            
}

function main(){
    app()

}

main()
