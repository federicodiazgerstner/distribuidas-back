const Formidable = require('formidable')
const bluebird = require('bluebird')
var fs = require('fs');
var fs = bluebird.promisifyAll(require('fs'))
var {join} = require('path');
const UserImg = require('../models/UserImg.model');
const UserImgService = require('../services/userImg.service');
const { formatWithOptions } = require('util');

// Returns true if successful or false otherwise
async function checkCreateUploadsFolder (uploadsFolder) {
    try 
    {
		await fs.statAsync(uploadsFolder)
    } 
    catch (e) 
    {
        if (e && e.code == 'ENOENT') 
        {
			console.log('The uploads folder doesn\'t exist, creating a new one...')
            try 
            {
				await fs.mkdirAsync(uploadsFolder)
            } 
            catch (err) 
            {
				console.log('Error creating the uploads folder 1')
				return false
			}
        } 
        else 
        {
			console.log('Error creating the uploads folder 2')
			return false
		}
	}
	return true
}

// Returns true or false depending on whether the file is an accepted type
function checkAcceptedExtensions (file) 
{
	const type = file.type.split('/').pop()
	const accepted = ['jpeg', 'jpg', 'png', 'gif', 'pdf','webp']
	if (accepted.indexOf(type) == -1) {
		return false
	}
	return true
}

exports.uploadFilesImgUser = async function (req, res, next) {
    //console.log("req",req.body);
    let form = Formidable.IncomingForm()
    //console.log("form",form);
    const uploadsFolder = process.env.UPLOAD_DIR;
    //console.log("uploadFolder",uploadsFolder);
	form.multiples = true
	form.uploadDir = uploadsFolder
	form.maxFileSize = 50 * 1024 * 1024 // 50 MB
	const folderCreationResult = await checkCreateUploadsFolder(uploadsFolder)
	if (!folderCreationResult) {
		return res.json({ok: false, msg: "The uploads folder couldn't be created"})
	}
	form.parse(req, async (err, fields, files) => {
		let myUploadedFiles = []
		if (err) {
			console.log('Error parsing the incoming form',err)
			return res.json({ok: false, msg: 'Error passing the incoming form'})
		}
		// If we are sending only one file:
		console.log(files)
		const file = files.files
		console.log("soy Fileeeeeeeeee", file)
		if (!checkAcceptedExtensions(file)) {
			console.log('The received file is not a valid type')
			return res.json({ok: false, msg: 'The sent file is not a valid type'})
		}
		const fileName = encodeURIComponent(file.name.replace(/&. *;+/g, '-'))
		myUploadedFiles.push(fileName)
		try {
			await fs.renameAsync(file.path, join(uploadsFolder, fileName))
		} catch (e) {
			console.log('Error uploading the file')
			try { await fs.unlinkAsync(file.path) } catch (e) {}
			return res.json({ok: false, msg: 'Error uploading the file'})
		}
		
		var imgObject = await UserImgService.guardarImagenUser(myUploadedFiles[0])
		var token = res.locals.token ? res.locals.token : ""
		res.json({ok: true, msg: 'Files uploaded succesfully!', imgObject,token:token})
	})
}
