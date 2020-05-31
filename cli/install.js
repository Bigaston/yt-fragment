if (!fs.existsSync(path.join(__dirname, "../.env"))) {
    fs.writeFileSync(path.join(__dirname, "../.env"), `
PORT=2448
ADDR_PREFIX=yt
KEEPING_TIME=24
MAX_DURING=1`)
}

if(!fs.existsSync(path.join(__dirname, "../video"))) {
    fs.mkdirSync(path.join(__dirname, "../video"))
}

if (!fs.existsSync(path.join(__dirname, "../tmp"))) {
    fs.mkdirSync(path.join(__dirname, "../tmp"))
}