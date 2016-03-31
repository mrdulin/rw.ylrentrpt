angular
    .module('ylrent.rpt.controllers')
    .controller('GetPasswordController', GetPasswordController);

function GetPasswordController($log, GetPasswordService, $scope, $http, $rootScope) {
    var vm = this;

    angular.extend(vm, {
        search: search,
        searchModel: '',
        rooms: null,
        getPassword: getPassword
    });

    function search() {
        if(!_.size(vm.searchModel)) return ;
        GetPasswordService.findRoom(vm.searchModel).then(function(res) {
            vm.rooms = res.data;
        }, function(err) {
            if(err.status === 404) {
                alert('无此房源信息');
            }
        });
    }

    function getPassword(room) {
        var uuid = room.uuid;

        if(uuid) {
            var dingPasswordResource = GetPasswordService.dingPassword();
            dingPasswordResource.get({uuid: uuid}).$promise.then(function(data) {
                if(angular.isDefined(data.ErrNo) && data.ErrNo !== 0) {
                    $log.info('delete token');
                    alert(data.ErrMsg);
                    localStorage.removeItem('user');
                    delete $http.defaults.headers.common["x-access-token"];
                } else {
                    room.pwd = data.password;
                }
            }, function(err) {
                alert('获取锁密码失败，请重试！');
            }).finally(function() {
            });
        }
    }
}
