const fs = require('fs');
const path = require("path")
const ytdl = require('ytdl-core');
const bdd = require("../models")
const { spawn } = require('child_process');

module.exports = {
	restart_generation: () => {
		console.log("Reprise de générations...")
		bdd.Video.findAll({where: {status: "during"}}).then((videos) => {
			videos.forEach((v) => {
				module.exports.start_generation(v)
			})
		})	  
	},
	start_generation: (video) => {
        console.log(video.id + " Démarage de la création");
		var ws = fs.createWriteStream("./tmp/" + video.id + ".flv")

		ytdl(video.url, {begin: video.start_time + ".000"}).pipe(ws)

		ws.on('finish', function() {
			module.exports.cut_video(video);
		});
	},
	cut_video: (video) => {
		console.log(video.id + " Découpage de la vidéo");

		splited_start = video.start_time.split(":")
		splited_end = video.end_time.split(":")
		
		var s_start = splited_start[0] * 3600 + splited_start[1] * 60 + parseInt(splited_start[2])
		var s_end = splited_end[0] * 3600 + splited_end[1] * 60 + parseInt(splited_end[2])

		var duration = parseInt(s_end) - parseInt(s_start)
	
		var child = spawn("ffmpeg", ["-i", `./tmp/${video.id}.flv`, "-t", duration, `./video/${video.id}.mp4`]);
    
        child.stdout.on('data', function (data) {
        	console.log(video.id + ' stdout: ' + data);
        });
    
        child.stderr.on('data', function (data) {
        	console.log(video.id + ' stderr: ' + data);
        });
    
        child.on('close', function (code) {
			console.log(video.id + " Vidéo générée!")
			video.status = "finished"
			video.end_timestamp = Date.now()
			video.save()
			.then(() => {
				fs.unlinkSync(path.join(__dirname, "../tmp/", `${video.id}.flv`))
			
				module.exports.init_new_generation()
			});
        });
	},
	init_new_generation: () => {
		bdd.Video.count({where: {status: "during"}}).then((nb) => {
			if (nb < process.env.MAX_DURING) {
				bdd.Video.findOne({where: {status: "waiting"}, order: [["id", "ASC"]]}).then((video) => {
					if(video != null) {
						video.status = 'during'
						video.save().then((video) => {
							module.exports.start_generation(video)
						})
					}
				})
			}
		})
	}
}