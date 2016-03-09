exports = module.exports  = {
  OK : function(/*name1, value1, name2, value2...*/) {
    var o = { code: 0 };
    for (var i = 0; i < arguments.length; i += 2) {
      var name = arguments[i];
      if (!!name) {
        o[name] = arguments[i + 1];
      }
    }
    
    return o;
  },
  NO_RECORD_FOUND : { code: 1, msg: 'no record found in database' },
  DATABASE_NOT_AVAILABLE : { code: 2, msg: 'database is not available' }
  
}