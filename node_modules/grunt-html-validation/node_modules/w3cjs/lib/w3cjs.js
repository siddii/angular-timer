var request = require('superagent');
var fs = require('fs');

var w3cCheckUrl = 'http://validator.w3.org/check';
var defaultOutput = 'json';
var defaultCallback = function (res) {
	console.log(res);
}

function setW3cCheckUrl(newW3cCheckUrl) {
	w3cCheckUrl = newW3cCheckUrl;
}

function validate(options) {
	var output = options.output || defaultOutput;
	var callback = options.callback || defaultCallback;
	var file = options.file;
	if(typeof file === 'undefined') {
		return false;
	}

	var isLocal = true;
	if(file.substr(0,5) === 'http:' || file.substr(0, 6) === 'https:') {
		isLocal = false;
	};

	if(isLocal) {
		var req = request.post(w3cCheckUrl);
		req.set('User-Agent','w3cjs - npm module')
		req.field('output', output);
		req.field('uploaded_file', fs.readFileSync(file, 'utf8'));
	} else {
		var req = request.get(w3cCheckUrl);
		req.set('User-Agent','w3cjs - npm module')
		req.query({ output: output })
        req.query({ uri: file })
	};
	req.end(function(res){
		if(output === 'json'){
			callback(res.body);
		} else {
			callback(res.text);
		}
	});
}
var w3cjs = {
	validate: validate,
	setW3cCheckUrl: setW3cCheckUrl
}
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = w3cjs;
  }
  exports.w3cjs = w3cjs
} else {
  root['w3cjs'] = w3cjs;
}
