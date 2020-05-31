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
		var ws = fs.createWriteStream("./tmp/video_" + video.id + ".mp4")
		var ws_audio = fs.createWriteStream("./tmp/audio_" + video.id + ".mp4")

		ytdl.getBasicInfo(video.url, undefined, (err, info) => {
			video.title = info.title
			video.save().then((vid) => {
				video = vid;
				
				ytdl(video.url, {quality: "highestvideo"}).pipe(ws)

				ws.on('finish', function() {
					console.log(video.id + " Vidéo téléchargée")
					ytdl(video.url, {quality: "highestaudio"}).pipe(ws_audio)
					ws_audio.on("finish", function() {
						console.log(video.id + " Audio téléchargé")
		
						module.exports.cut_video(video);
					})
				});
			})
		})
	},
	cut_video: (video) => {
		console.log(video.id + " Découpage de la vidéo");

		splited_start = video.start_time.split(":")
		splited_end = video.end_time.split(":")
		
		var s_start = splited_start[0] * 3600 + splited_start[1] * 60 + parseInt(splited_start[2])
		var s_end = splited_end[0] * 3600 + splited_end[1] * 60 + parseInt(splited_end[2])

		var duration = parseInt(s_end) - parseInt(s_start)
	
		var child = spawn("ffmpeg", ["-ss", s_start, "-i", `./tmp/audio_${video.id}.mp4`, "-ss", s_start, "-i", `./tmp/video_${video.id}.mp4`, "-t", duration, `./video/${video.id}.mp4`]);
    
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
				fs.unlinkSync(path.join(__dirname, "../tmp/", `video_${video.id}.mp4`))
				fs.unlinkSync(path.join(__dirname, "../tmp/", `audio_${video.id}.mp4`))
			
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