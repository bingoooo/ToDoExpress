"use strict";
//Implémenter une méthode qui prenne en compte l'état coché de la tâche


$(document).ready(function(){
	console.log('Linked : appjo.js')
	
		var app = {
			//HTML à insérer lors de la création de la tache
			todoHtmlPre : '<div class="todo"><input type="checkbox" class="todo-checkbox" {checked}><span class="todo-content">',
			todoHtmlPost : '</span><button class="delete">X</button></div>',
			ajaxData : {},
			//Fonction initialisation des évènements de la page
			init : function(){
				this.get();
				app.elements();	
			},
			//fonction qui récupère les données du tableau dans le serveur express
			get : function(){
				$.ajax({			//utilisation d'ajax pour le contrôle des erreurs
					url : "/get",
					type : "GET",
					dataType : "json",
					success : function(json){
						for (var i = 0; i < json.length; i++){	//affichage des différentes taches du tableau
							$('#todolist').append(app.todoHtmlPre + json[i] + app.todoHtmlPost);
							app.updateList();		//mise à jour des évènements liés à la liste
							app.updateItemCount();	//mise à jour du nombre d'éléments de la liste
						}								//envoi de la liste des tâches vers express
					},
				});
			},
			//Fonction initialisant les évènements au rafraichissement de la page
			elements : function(){
				$('#newTodo').on("keypress",app.addToList);	//Event listener lié à l'ajout d'une tache (input id="newTodo") appui sur Entrée
				//$('#newTodo').submit(app.addToList2);
				//$('#todolist').on("change", 'span:todo-content', app.editTask);
				$('#show-all').on("click", app.all);			//Event listener lié au boutton All (montre toutes les taches)
				$('#active').on("click", app.active);			//Event listener lié au boutton Active (montre les taches en cours, non cochées)
				$('#completed').on("click", app.completed);	//Event listener lié au boutton Completed (montre les taches finies, cochées)
				$('#clear').on("click", app.clear);			//Event listener lié au boutton Clear (efface les taches finies, cochées)
				//$('.todo-content').on("dbclick", this.editTask);
				app.updateItemCount();							//Rafraichissement du nombre de tâches à accomplir
			},
			//Fonction qui met à jour les évènements liés à la liste des tâches
			updateList : function(){
				$('.delete').click(app.removeParent);			//évènement lié au bouton 'delete'
				$('.todo-checkbox').change(app.checkboxElem);	//évènement lié à la checkbox
				$('.todo-content').on("dblclick", app.editTask);			//évènement lié à l'édition d'une tâche
			},
			//Fonction de mise à jour du nombre d'éléments dans la liste de tâches
			updateItemCount : function(){
				var size = $('#todolist').children().size();		//récupération de la quantité de tâches
				var todoContent = document.getElementsByClassName('todo-content');	//récupération des éléments de classe todo-content
				var todos = [];										//tableau de la liste des tâches à envoyer
				for (var i = 0; i < size; i++){						//insertion des tâches à envoyer à express
					todos.push(todoContent[i].innerHTML);
				}
				$.ajax({			//requête ajax post pour envoyer les données au serveur
					url : "/post",
					type : "POST",
					data : {
						todo: todos
					},
				});
				(size < 2)?$('#status').html(size + " item left"):$('#status').html(size + " items left");
			},

			//Fonction lié au boutton qui supprime l'élément correspondant de la liste
			removeParent : function(event){
				event.preventDefault();		//annulation de la fonction par défaut
				$(this).parent().remove();	//retrait de la tâche de la liste
				app.updateItemCount();		//mise à jour des éléments de la liste
			},

			//Fonction attachée à l'élément checkbox
			checkboxElem : function(event){
					event.preventDefault();
					if (this.checked){						//Test de la condition de l'élément checkbox
						$(this).parent().addClass('done');						//ajoute la classe 'done' à l'élément parent
						$(this).parent().find("span").addClass('ischecked');	//ajoute la classe 'ischecked' à l'élément frère au tag "span"
					} else {
						$(this).parent().removeClass('done');					//retire la classe 'done' à l'élément parent		
						$(this).parent().find("span").removeClass('ischecked');	//retire la classe 'ischecked' à l'élément frère au tag "span"
					}
			},


			//Fonction associée au boutton All qui montre tous les éléments de la liste ("todo")
			all : function(){
					//app.showAll();
					$('.todo').show();		//montre tous les éléments de classe "todo"
					$('.selectable').removeClass('selected');	//retire la classe "selected" de tous les éléments de classe "selectable"
					$(this).addClass('selected');				//ajoute la classe "selected" au boutton All
			},

			//Fonction associée au boutton Active
			active : function(){
					$('.todo').show()		//Montre les éléments de classe "todo" (les tâches)
					$('.done').hide();		//Cache les éléments de classe "done" (les tâches)
					$('.selectable').removeClass('selected'); 	//retire la classe "selected" de tous les éléments de classe "selectable"
					$(this).addClass('selected');				//ajoute la classe "selected" au boutton Active
					},

			//Fonction associée au boutton Completed
			completed : function(){
					$('.todo').hide();		//Cache les éléments de classe "todo" (les tâches)
					$('.done').show();		//montre les éléments de classe "done" (les tâches)
					$('.selectable').removeClass('selected');	//retire la classe "selected" de tous les éléments de classe "selectable"
					$(this).addClass('selected');				//ajoute la classe "selected" au boutton Completed
			},

			//Fonction associée au boutton Clear
			clear : function(){
					$('.selectable').removeClass('selected');	//retire la classe "selected" de tous les éléments de classe "selectable"
					$(this).addClass('selected');				//ajoute la classe "selected" au boutton Clear
					$('.done').remove();						//efface tous les éléments de class "done"
					app.updateItemCount();	//mise à jour des éléments de la liste
			},

			//Fonction associée à l'input utilisateur
			addToList : function(event){
				if (event.which == 13) {			//bind à l'évènement "entrée"
					event.preventDefault();			//annulation du comportement par défaut
					var text = $('#newTodo').val();	//récupération du champ de l'input
					if (text != ''){				//condition requise, qu'il existe un caractère
						$('#newTodo').val('');		//effacement du champ de l'input
						$('#todolist').prepend(app.todoHtmlPre + text + app.todoHtmlPost);	//ajout du champ à la liste
						app.updateList();			//mise à jour des évènements liés à la liste des tâches
						app.updateItemCount();		//mise à jour de la quantité d'éléments du tableau et envoi de la liste au serveur
					}
				};
			},
			editTask : function(event){
				event.preventDefault();			//désactive le comportement par défaut
				var target = $(this).parent();	//cible de la modification
				var task = $(this).html();		//récupération de la "valeur" de la tache
				$(this).remove();				//suppression de la balise "span"
												//ajout d'une balise "input" à la place du "span"
				target.prepend('<input class="edit" placeholder="Quelque chose à faire..." value=' + task + ' autofocus>');
				$('.todo-content').off();		//désactivation de la fonction double clickable des autres éléments 'editable'
				$('.edit').on("keypress", function(event){	//évènement lorsqu'il y a pression sur entrée
					if (event.which == 13){
						var task = $(this).val();			//récupération de la valeur à l'intérieur de "input"
						$(this).remove();					//suppression de "input"
						target.append('<span class="todo-content">' + task + '</span>');	//ajout d'une balise "span" à la place du "input"
						app.updateList();					//rafraichissement des évènements de la liste
						app.updateItemCount();	//mise à jour de la quantité d'éléments du tableau et envoi de la liste au serveur
					}
				});
			}
		};
	
	//Appel de la fonction principale exécutant le code JS
	app.init();	
})