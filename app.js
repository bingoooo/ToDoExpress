var express = require('express');			//initialisation d'express
var bodyParser = require('body-parser');	//utilisation de parser pour récupérer les données json
var app = express();						//initialisation de l'app par express

var table = [];								//tableau par défaut


app.use('/', express.static('public'));		//chemin de l'application
app.use( bodyParser.json() );				//prise en charge du format json en body parser
app.use(bodyParser.urlencoded({				//prise en charge du format html en body parser
	extended: true
}));

app.get('/get', function(req, res, next){	//réponse à une requête get dans la cible /get
	res.json(table);						//restitution de la table
});
app.post('/post', function(req, res, next){	//réponse à une requête post dans la cible /post
	table = req.body.todo;					//affectation de la valeur des todo List dans le tableau
});

var server = app.listen(3003, function(){	//initialisation du server express node
	var host = server.address().address;	//hote
	var port = server.address().port;		//port

	console.log('App listening to http://%s:%s', host, port); //sortie console vérifiant la bonne mise en route du serveur
});
