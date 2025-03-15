const multer = require('multer');
const path = require('path');
const { createFolder, getFolderByUser, deleteFolderById } = require('../model/prismaQueries');
const fs = require('fs');
const supabase = require('../config/supabase');


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const folderName = req.body.foldername;
//         const userId = req.user.id;
    
//         if (!folderName) {
//             return cb(new Error('Choose a folder'), null);
//         }

//         const uploadPath = `public/files/${userId}/${folderName}`;

//         fs.mkdir(uploadPath, { recursive: true}, (err) => {
//             if (err) return cb(err);
//             cb(null, uploadPath);
//         });
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

const storage = multer.memoryStorage();
const upload = multer({storage:storage});




const getHomePage = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    
    return res.render('home', {file: null, folders: folders, error: null, files: []});
}

const postUploadFile = async (req, res) => {
    // const folders =  await getFolderByUser(req.user.id);
    // const folderName = req.body.foldername;

    // upload(req, res, (err) => {
    //     if (err) {

    //         return res.render('home', {file: "Please select a valid folder before uploading.", folders: folders, error: null, files: []})
    //     } else {
            
    //         if(!req.file) {
    //             const noFile = 'No File Uploaded.'
    //             return res.render('home', {file: noFile, folders: folders, error: null, files: []});
    //         } else {
    //             const file = 'File Uploaded!'
    //             return res.render('home', {file, folders, error: null, files: []})
    //         }
    //     }
    // })
        const folderName = req.body.foldername;
        const userId = req.user.id;
        const file = req.file;
        const folders =  await getFolderByUser(userId);
    try {
        

        if (!folderName || !file) {
            const noFile = 'No File Uploaded.'
             return res.render('home', {file: noFile, folders: folders, error: null, files: []});
        }

        const filePath = `${userId}/${folderName}/${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase
            .storage
            .from('file-driver')
            .upload(filePath, file.buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.mimetype
            });
        
        if (error) throw error;

        return res.render('home', {file: 'File Uploaded Successfully!', folders, error: null, files: []})
    } catch (err) {
        console.error(err);
        return res.render('home', {file: 'File upload failed.', folders, error: null, files: []})
    }

}

const postNewFolder = async (req, res) => {
    try {
        const newFolder = req.body.newFolder;
        const folderPath = path.join(__dirname, newFolder)

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, {recursive: true});
            console.log('Folder created successfully');
        } else {
            console.log('Folder already exist.');
        }
        createFolder(newFolder, req.user.id);
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        throw err;
    }
    
}


const getFilesByFolder = async (req, res) => {
    const folders =  await getFolderByUser(req.user.id);
    const userId = req.user.id;
    const folderName = req.body.folders;

    // fs.readdir(folderPath, async (err, files) => {
    //     if (err || !files.length) {
    //         return res.render('home', {error: "No files yet. Upload a file to this folder.", files: folderName, folders, file: ''})
    //     }

    //     const fileDetails = await Promise.all(
    //         files.map(async (file) => {
    //             const filePath = `${folderPath}/${file}`;
    //             const stats = fs.statSync(filePath);
    //             return {
    //                 name: file,
    //                 size: (stats.size / (1024 * 1024)).toFixed(2),
    //                 createdAt: stats.birthtime.toISOString().split('T')[0],
    //             }
    //         })
    //     )
  
    //     const fileObj = {
    //         foldername: folderName,
    //         details: fileDetails
    //          }
    //     console.log(fileObj)
    //     return res.render('home', {file: '', folders, error:null, files: fileObj})
    // })
    const { data, error} = await supabase
        .storage
        .from('file-driver')
        .list(`${userId}/${folderName}`);

    if (error) {
        console.error('Error fetching files:', error);
        return res.render('home', {error: "Error fetching files.", files: folderName, folders, file: ''})
    }

    const files = await Promise.all(data.map(async (file) => {
        const { data: signedUrlData, error } = await supabase.storage
            .from('file-driver')
            .createSignedUrl(`${userId}/${folderName}/${file.name}`, 60 * 60);
    
        return {
            name: file.name,
            url: error ? '' : signedUrlData.signedUrl, // Handle errors gracefully
            size: (file.metadata.size / (1024 * 1024)).toFixed(2) + ' MB',
            uploadedAt: new Date(file.metadata.lastModified).toLocaleDateString(),
            foldername: folderName
        };
    }));

    return res.render('home', {file: '', folders, error:null, files})

}

const deleteFolder = async (req, res) => {
    // try {
    //     const folderPath = path.join(__dirname, '../public/files', req.user.id, req.params.foldername);

    //     if (fs.existsSync(folderPath)) {
    //         await fs.promises.rm(folderPath, {recursive: true, force:true});
    //     }
    

    //     await deleteFolderById(parseInt(req.params.id));
    //     return res.redirect('/home');
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }
    const { folderName, folderId } = req.body;
    const userId = req.user.id;

    try {

        const {data, error} = await supabase
            .storage
            .from('file-driver')
            .list(`${userId}/${folderName}`);

        await deleteFolderById(parseInt(folderId));

        if (error) throw error;
 

        if (!data || data.length === 0) {
            console.log('Deleting files:', filePaths);
        } else {
            const filePaths = data.map(file => `${userId}/${folderName}/${file.name}`);
            console.log('Deleting files:', filePaths);
            const { error: deleteFilesError} = await supabase
                .storage
                .from('file-driver')
                .remove(filePaths);

                if (deleteFilesError) throw deleteFilesError;
  
        }
        console.log(`Folder ${folderName} deleted successfully.`);
        return res.redirect('/home');
    } catch (err) {
        console.error('Error deleting folder: ', err.message);
        return res.redirect('/home');
    }
}

const deleteFile = async (req, res) => {
    // try {
    //     const fileUrl = decodeURIComponent(req.query.file);
        
    //     if (fs.existsSync(fileUrl)) {
    //         fs.unlinkSync(fileUrl);
    //         console.log('File succesfully Deleted');
    //     } else {
    //         console.log('File not found');
    //     }



    //     return res.redirect('/home');
    // } catch (err) {
    //     console.error(err);
    //     throw err;
    // }
    
    try {
        const {fileName, folderName} = req.body;
        const userId = req.user.id;

        const filePath = `${userId}/${folderName}/${fileName}`;

        const { error } = await supabase.storage.from('file-driver').remove([filePath]);

        if (error) {
            console.error("Error deleteting file:", error.message);
            return res.redirect('/home');
        }

        console.log("File Deleted:" , filePath);
        return res.redirect('/home');
    } catch(err) {
        console.error(err);
        res.redirect('/home');
    }
    
}

module.exports = { getHomePage, upload, postUploadFile, postNewFolder, getFilesByFolder, deleteFolder, deleteFile };