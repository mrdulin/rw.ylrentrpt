angular
    .module('ylrent.rpt.services')
    .factory('GetPasswordService', GetPasswordService);

function GetPasswordService($log, $http, $resource) {

    var service = {};

    angular.extend(service, {
        findRoom: findRoom,
        dingPassword: dingPassword
    });

    function findRoom(roomName) {
        var url = '/api/room/find/' + roomName;
        return $http.get(url);
    }

    function dingPassword() {
        var url = '/pass/getDynamicPass/:uuid'
        return $resource(url, {uuid: '@uuid'});
    }

    return service;
}
