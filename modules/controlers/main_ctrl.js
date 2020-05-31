const path = require("path")
const bdd = require("../../models")
const generation = require("../generation")

module.exports = {
	index: (req, res, next) => {
		res.sendFile(path.join(__dirname, "../../web/index.html"))
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
	}
}