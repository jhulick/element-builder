elementModule.directive('elementViewHtml', function ($compile, $http) {
    return {
        restrict: 'E',
        scope: { value: '=' },
		link: function(scope, element, attrs) {
			
			scope.$watch('value', function(){
				
				console.log("Rerender Html");
				var html = renderElement (scope.value);
				
				element.html('<pre class="prettyprint">'  + escapeHtml(html) + '</pre>'	);
			
				$compile(element.contents())(scope); 
			}, true);
			
		} 
    }
	
	function renderElement (elements){
		var html = "";
		
		for (var i=0;i<elements.length;i++){
 			element = elements[i];
			var template;
			
			// get template
			jQuery.ajax({
				url: 'element/' + element.template + '.html',
				success: function(data) {
					template = data;
				},
				async:false
			});
			
			template = renderTemplate(template, element);
			
			if(element.elements){
				var child = renderElement (element.elements);
				template.find('element-include').replaceWith(child);
			}
			
			template = template.prop('outerHTML');
			console.log(template);
			
			html += template;
			
		}	

		return html;
	}
	
	function escapeHtml(text) {
	  return text
		  .replace(/&/g, "&amp;")
		  .replace(/</g, "&lt;")
		  .replace(/>/g, "&gt;")
		  .replace(/"/g, "&quot;")
		  .replace(/'/g, "&#039;");
	}
});