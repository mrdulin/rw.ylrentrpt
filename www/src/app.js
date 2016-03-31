angular.module('ylrent.rpt', [
    'ui.router',
    'ngResource',
    'angular-loading-bar',
    'ngAnimate',
    'ui.bootstrap',
    'ngTouch',
    'http-auth-interceptor',
    'ylrent.rpt.controllers',
    'ylrent.rpt.services',
    'ylrent.rpt.directives',
    'ylrent.rpt.filters',
    'ylrent.rpt.templateCache'
]);

angular.module('ylrent.rpt.controllers', []);
angular.module('ylrent.rpt.services', []);
angular.module('ylrent.rpt.directives', []);
angular.module('ylrent.rpt.filters', []);
angular.module('ylrent.rpt.templateCache', []);

angular
    .module('ylrent.rpt')
    .run(run);

function run($http) {

    var user = angular.fromJson(localStorage.getItem('user'));

    if(user && user.token) {
        $http.defaults.headers.common["x-access-token"] = user.token;
    }
}

angular
    .module('ylrent.rpt.controllers')
    .controller('MainController', MainController)
    .controller('LoginController', LoginController);

MainController.$inject = ['$log', 'CommonService', '$uibModal', '$scope'];

function MainController($log, CommonService, $uibModal, $scope) {

    var vm = this;

    angular.extend(vm, {
        lastupdatetime: '',
        sidebar: {
            occupancy: {
                name: '入住情况',
                subMenus: [
                    {
                        key: 'summary',
                        name: '汇总',
                        baseKey: 'occupancy'
                    },
                    {
                        key: 'cannotoccupancy',
                        name: '不可用房',
                        baseKey: 'occupancy'
                    },
                    {
                        key: 'oooReason',
                        name: '不可用房明细',
                        baseKey: 'occupancy'
                    },
                    {
                        key: 'tomorrowoccupancy',
                        name: '入住统计',
                        baseKey: 'occupancy'
                    },
                    {
                        key: 'tomorrowcheckout',
                        name: '退房统计',
                        baseKey: 'occupancy'
                    },
                    {
                        key: 'getPassword',
                        name: '获取密码',
                        baseKey: 'occupancy'
                    }
                ]
            }
            // order: {
            //     name: '订单汇总',
            //     subMenus: [
            //         {
            //             key: 'daily',
            //             name: '日租订单',
            //             baseKey: 'order'
            //         }
            //     ]
            // }
        },
        openLoginModal: openLoginModal
    });

    var lastupdatetimePromise = CommonService.getLastUpDatetime().$promise.then(function(data) {
        vm.lastupdatetime = data;
    }, function(err) {
        alert(err.msg);
    });

    function openLoginModal() {
        var modalInstance = $uibModal.open({
            templateUrl: 'login.html',
            controller: 'LoginController as vm',
            size: 'sm',
        });
    }

    $scope.$on('event:auth-loginRequired', function() {
        openLoginModal();
        $log.info('loginRequired');
    });
}

function LoginController($uibModalInstance, $log, $http, $timeout, $scope, authService) {

    var vm = this;
    var timer = null;

    angular.extend(vm, {
        close: close,
        login: login,
        name: '',
        password: '',
        err: '',
        _startCountDown: _startCountDown,
        isLogining: false
    });

    function login() {
        var url = '/authenticate';
        var data = {
            name: vm.name,
            password: vm.password
        };
        vm.isLogining = true;
        $http.post(url, data).then(function(res) {
            var result = res.data;
            if(result.success) {
                var token = result.token;
                authService.loginConfirmed('success', function(config){
                    config.headers["x-access-token"] = token;
                    data.token = token;
                    localStorage.setItem('user', angular.toJson(data));
                    return config;
                });
            } else {
                vm.err = result.message;
                _startCountDown();
            }
        }, function() {
            vm.err = '登陆出错';
            _startCountDown();
        }).finally(function() {
            vm.isLogining = false;
        });
    }

    function close() {
        vm.isLogining = false;
        $uibModalInstance.dismiss();
    }

    function _startCountDown() {
        timer = $timeout(function() {
            vm.err = '';
            _destroyTimer();
        }, 3000);
    }

    function _destroyTimer() {
        if(angular.isDefined(timer)) {
            $timeout.cancel(timer);
            timer = null;
        }
    }

    $scope.$on('event:auth-loginConfirmed', function() {
        $log.info('loginConfirmed');
        vm.close();
    });

    $scope.$on('$destroy', function() {
        _destroyTimer();
    });

}
