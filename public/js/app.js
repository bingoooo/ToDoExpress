"use strict";

console.log('Linked : app.js');

$(document).ready(function(){
	console.log('Linked : jquery.js');

	//Fonction ajoutant l'évènement qui supprime l'élément de la liste
	function supprElem(){
		$('.delete').click(function(mouse){
			mouse.preventDefault;
			$(this).parent().remove();
			updateItems();	
		});
	}

	//Fonction qui ajoute l'évènement lié à un élément coché
	function checkElem(){
		$('.todo-checkbox').change(function(event){
			//console.log(this.checked);
			event.preventDefault;
			if (this.checked){
				$(this).parent().find("span").addClass("ischecked");
				$(this).parent().addClass("done");
			}
			else {
				$(this).parent().find("span").removeClass("ischecked");
				$(this).parent().removeClass("done");
			}
		});		
	}

	//Fonction mettant à jour le nombre d'éléments du tableau
	function updateItems(){
		$('#status').html($('#todolist').children().size() + " items left");
	}

	//Gestion nde l'éènement lié à un ajout d'un élément de la Todo list
	$('#newTodo').keypress(function(key){
		if (key.which == 13){
			key.preventDefault();
			var text = $('#newTodo').val();
			$('#todolist').append('<div class="todo"><input type="checkbox" class="todo-checkbox" {checked}><span class="todo-content">' + text + '</span><button class="delete">X</button></div>');
			updateItems();
			console.log(text);
			supprElem();
			checkElem();
		}
	});

	
})