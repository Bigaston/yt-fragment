# yt-fragment
Téléchargez des fragments de vidéos YouTube

## Instalation
Il est requis de télécharger FFMPEG [ici](https://www.ffmpeg.org/download.html)

1. Clonez ce repertoire
2. Utilisez la commande `npm install`
3. Dans le fichier `.env` vous pouvez personaliser différentes options
```
PORT=2448 			#Le port de l'application
ADDR_PREFIX=yt 		#Le préfix dans l'URL
KEEPING_TIME=24		#Le temps de concervation des vidéos (en heure)
MAX_DURING=1		#Le nombre de vidéos en traitement en simultané
```
4. Utilisez la commande `npm start` pour lancer le serveur et rendez vous sur l'adresse `localhost:[PORT]/[PREFIX]/`
5. Vous pouvez retrouver les vidéos une fois qu'elles sont générées dans `localhost:[PORT]/[PREFIX]/dl`

## Information
Ce petit code est un truc fait vite fait pour aider le vidéaste [Seldell](https://www.youtube.com/user/Seldell) à récupérer des fragments de vidéos sans avoir à télécharger l'entièretée de celle ci.
Je ne propose pas d'instance publique de l'outil pour éviter de faire exploser mon serveur, et aussi d'avoir des problèmes avec YouTube!
Ce site utilise le Framework CSS [Skeleton](http://getskeleton.com/)

## Me Soutenir
Si vous trouvez cet outil utile, vous pouvez [me suivre sur Twitter](https://twitter.com/Bigaston) ou [me faire un don sur uTip](https://utip.io/bigaston)