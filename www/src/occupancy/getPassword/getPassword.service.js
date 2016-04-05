angular
    .module('ylrent.rpt.services')
    .factory('GetPasswordService', GetPasswordService);

function GetPasswordService($log, $http, $resource) {

    var service = {};

    angular.extend(service, {
        findRoom: findRoom,
        dingPassword: dingPassword,
        getTimePassword: getTimePassword
    });

    function findRoom(roomName) {
        var url = '/pass/find/' + roomName;
        return $http.get(url);
    }

    function dingPassword() {
        var url = '/pass/getDynamicPass/:uuid'
        return $resource(url, {
            uuid: '@uuid'
        });
    }

    function getTimePassword(data) {
        var url = '/pass/addpass';
        return $http.post(url, data);
    }

    return service;
}
