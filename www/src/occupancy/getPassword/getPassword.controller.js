angular
    .module('ylrent.rpt.controllers')
    .controller('GetPasswordController', GetPasswordController)
    .controller('TimePasswordController', TimePasswordController);

function GetPasswordController($log, GetPasswordService, $scope, $http, $rootScope, $uibModal) {
    var vm = this;

    angular.extend(vm, {
        search: search,
        searchModel: '',
        rooms: null,
        getPassword: getPassword,
        getTimePassword: getTimePassword
    });

    function getTimePassword(room) {
        var modalInstance = $uibModal.open({
            templateUrl: './src/occupancy/getPassword/timePasswordModal.html',
            controller: 'TimePasswordController as vm',
            size: 'sm',
            resolve: {
                room: function () {
                    return room;
                }
            }
        });

        modalInstance.result.then(function (data) {
            GetPasswordService.getTimePassword(data).then(function (res) {
                var result = res.data;
                if (result.ErrNo !== 0) {
                    $rootScope.user = null;
                    localStorage.removeItem('user');
                    delete $http.defaults.headers.common["x-access-token"];
                    alert(result.ErrMsg);
                } else {

                    alert('获取时效密码成功！\n有效期为' + moment(result.startime).format('YYYY-M-D HH:mm') + '至' + moment(result.endtime).format('YYYY-M-D HH:mm'));
                }
            }, function (err) {
                alert('获取密码失败，请重试！');
                $log.info(err);
            });
        });
    }

    function search() {
        if (!_.size(vm.searchModel)) return;
        GetPasswordService.findRoom(vm.searchModel).then(function (res) {
            vm.rooms = res.data;
        }, function (err) {
            if (err.status === 404) {
                alert('无此房源信息');
            }
        });
    }

    function getPassword(room) {
        var uuid = room.uuid;

        if (uuid) {
            var dingPasswordResource = GetPasswordService.dingPassword();
            dingPasswordResource.get({
                uuid: uuid
            }).$promise.then(function (data) {
                if (angular.isDefined(data.ErrNo) && data.ErrNo !== 0) {
                    $log.info('delete token');
                    alert(data.ErrMsg);
                    $rootScope.user = null;
                    localStorage.removeItem('user');
                    delete $http.defaults.headers.common["x-access-token"];
                } else {
                    room.pwd = data.password;
                }
            }, function (err) {
                alert('获取锁密码失败，请重试！');
            }).finally(function () {});
        }
    }
}

function TimePasswordController($log, $uibModalInstance, room) {

    var vm = this;

    angular.extend(vm, {
        close: $uibModalInstance.dismiss,
        ok: ok,
        dateType: 1,
        mobile: '',
        name: '',
        time: '',
        errMsg: ''
    });

    function ok(form) {
        var isValid = _validateForm(form);
        var data = {
            "cellphone": vm.mobile,
            "starttime": moment().format('YYYY-M-D HH:mm'),
            "addtype": vm.dateType,
            "name": vm.name,
            "uuid": room.uuid,
            "span": vm.time
        };
        $log.info(data);
        isValid && $uibModalInstance.close(data);

    }

    function _validateForm(form) {
        if (form.mobile.$error.required) {
            vm.errMsg = '请填写手机号码';
            return false;
        } else if (form.mobile.$error.pattern) {
            vm.errMsg = '手机号码格式不正确';
            return false;
        } else if (form.name.$error.required) {
            vm.errMsg = '请填写您的姓名';
            return false;
        } else if (form.time.$error.required) {
            vm.errMsg = '请填写时间';
            return false;
        } else {
            return true;
        }
    }

}
