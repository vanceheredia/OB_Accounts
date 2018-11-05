var gulp = require('gulp');
var Server = require('karma').Server;
gulp.task('unittest', function(done){
  Server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
}, function() {
    done();
});
});