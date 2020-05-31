const path = require("path")
const fs = require("fs")
const bdd = require("../../models")
const generation = require("../generation")
const utils = require("../utils")
const mustache = require("mustache")

module.exports = {
	index: (req, res, next) => {
		var template = fs.readFileSync(path.join(__dirname, "../../web/index.mustache"), "utf8");
		var render_obj = {
			prefix: process.env.ADDR_PREFIX
		}

		res.setHeader("content-type", "text/html");
		res.send(mustache.render(template, render_obj))
	},
	add: (req, res, next) => {
		bdd.Video.create({
			status: "waiting",
			url: req.body.url,
			start_time: req.body.start,
			end_time: req.body.end
		}).then(() => {
			generation.init_new_generation();
			res.send("OK");
		})
	},
	dl_page: (req, res, next) => {
		bdd.Video.findAll({where: {status: "finished"}}).then((videos) => {
			var template = fs.readFileSync(path.join(__dirname, "../../web/dl_page.mustache"), "utf8");
			var render_obj = {prefix: process.env.ADDR_PREFIX, videos: []}

			videos.forEach((v) => {
				var obj = {
					title: v.title,
					link: "/" + process.env.ADDR_PREFIX + "/dl/" + v.id
				}

				render_obj.videos.push(obj)
			})

			res.setHeader("content-type", "text/html");
			res.send(mustache.render(template, render_obj))
		})
	},
	dl_video: (req, res, next) => {
		if (fs.existsSync(path.join(__dirname, "../../video/" + req.params.id + ".mp4"))) {
			bdd.Video.findByPk(req.params.id).then(video => {
				res.download(path.join(__dirname, "../../video/" + req.params.id + ".mp4"), `${utils.change_title(video.title)}.mp4`)
			})
		} else {
			res.status(404).send("Not Found")
		}
	}
}