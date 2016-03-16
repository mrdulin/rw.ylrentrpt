angular
	.module('ylrent.rpt.directives')
	.directive('stickUp', stickUp);

stickUp.$inject = ['$timeout', '$log'];

function stickUp($timeout, $log) {
	return {
		restrict: 'A',
		link: link
	};

	function link(scope, element, attr) {

		$(window).on('scroll', function(e) {
			$log.log(element[0].getBoundingClientRect().top);
		});

		$timeout(function() {
			$(element).floatThead({
				position: "auto",
			});	
		});

	}
}