/*
 * GET home page.
 */
var fs = require('fs');
var filedir = "./uploads";


renderGall = function(res){
	fs.readdir(filedir, function(err, files) {
		for(var i = 0 ; i < files.length;i++){
			files[i] = "uploads/"+files[i];
		}
		res.render('gallery', {
			title : 'PhotoBooth Gallery',
			f : files
		});
	});
};

exports.gallery = function(req, res) {
	fs.exists(filedir, function(exists) {
		if (!exists) {
			fs.mkdir(filedir, function(err) {
				renderGall(res);
			});

		} else {
			renderGall(res);
		}
	});
};



exports.upload = function(req, res) {
	res.render('upload', {
		title : 'PhotoBooth Upload'
	});
};

exports.uploadpost = function(req, res) {
	var resp = "Upload Successful!";

	if (req.files.file != null) {
		fs.exists(filedir, function(exists) {
			if (!exists) {
				fs.mkdir(filedir, function(err) {

					fs.readdir(filedir, function(err, files) {
						var number = files.length;

						while (req.files.file.length > 0) {
							var file = req.files.file.pop();
							(function(file, number) {
								fs.rename(file.path, filedir + "/" + number
										+ file.name, function(err) {
									res.render('upload', {
										title : 'PhotoBooth Upload',
										response : resp
									});
								});
							})(file, number);
							number += 1;
						}
					});

				});
			} else {
				fs.readdir(filedir, function(err, files) {
					var number = files.length;

					while (req.files.file.length > 0) {
						var file = req.files.file.pop();
						(function(file, number) {
							fs.rename(file.path, filedir + "/" + number
									+ file.name, function(err) {
								res.render('upload', {
									title : 'PhotoBooth Upload',
									response : resp
								});
							});
						})(file, number);
						number += 1;
					}
				});
			}
		});

	} else {
		resp = "Remember to select a file!";
		res.render('upload', {
			title : 'PhotoBooth Upload',
			response : resp
		});
	}

};


exports.uploads = function(req, res) {
	fs.readFile('./uploads/'+req.route.params.path, "binary", function(error, file) {
	    if(error) {
	      res.writeHead(500, {"Content-Type": "text/plain"});
	      res.write(error + "\n");
	      res.end();
	    } else {

	      res.writeHead(200, {"Content-Type": "image/png"});
	      res.write(file, "binary");
	      res.end();
	    }
	});
};