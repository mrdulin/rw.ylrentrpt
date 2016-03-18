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

        var wSize = 0;

        $timeout(function () {
            $(element).floatThead({
                position: "auto",
            });
            $(element).closest('.table-responsive').on('scroll', function () {
                $(element).floatThead('reflow');
            });
        });

    }
}