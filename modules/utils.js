const bdd = require("../models")
const fs = require("fs")
const path = require("path")

module.exports = {
	flush: () => {
		bdd.Video.findAll({where: {status: "finished"}}).then((videos) => {
			if (videos.length >=1) {
				for (i = 0; i < videos.length; i++) {
					time = Date.now() - videos[i].end_timestamp
					time = time / (1000 * 60 * 60);
					
					if (time > process.env.KEEPING_TIME) {
						try {
							fs.unlinkSync(path.join(__dirname, `../video/${videos[i].id}.mp4`))
						} catch (err) {
							console.log(err)
							console.log(`Fichier ${videos[i].id}.mp4 déjà supprimé`)
						}
						videos[i].destroy()
						console.log("Flush video " + videos[i].id)
					}
				}
			}
		})
	},
}