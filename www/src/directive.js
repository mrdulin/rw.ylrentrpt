angular
	.module('ylrent.rpt.directives')
	.directive('stickUp', stickUp);

stickUp.$inject = ['$timeout'];

function stickUp($timeout) {
	return {
		restrict: 'A',
		link: link
	};

	function link(scope, element, attr) {

		$timeout(function() {
			$(element).floatThead();	
		});

	}
}