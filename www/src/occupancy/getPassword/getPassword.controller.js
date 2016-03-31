angular
    .module('ylrent.rpt.controllers')
    .controller('GetPasswordController', GetPasswordController);

function GetPasswordController($log, GetPasswordService, $scope) {
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
        })
    }

    function getPassword(room) {
        $log.info(room);
        var uuid = room.uuid;
        if(uuid) {
            var dingPasswordResource = GetPasswordService.dingPassword();
            room.isGetting = true;
            dingPasswordResource.get({uuid: uuid}).$promise.then(function(data) {
                if(data.ErrNo !== 0) {
                    alert(data.ErrMsg);
                    localStorage.removeItem('user');
                    return ;
                }
                room.pwd = data.password;
            }, function(err) {
                alert('获取锁密码失败，请重试！');
            }).finally(function() {
                room.isGetting = false;
            })
        }
    }
}
