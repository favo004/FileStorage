const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(cors());
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send(`hit!`);
})

const uploadFile = (file) => {
    file.mv(`${__dirname}/public/${file.name}`, (error) => {
        console.log(error);
    })
}

app.post('/upload', (req, res) => {
    try{
        if(!req.files){
            return res.status(404).json({success: false, message: "Files not found"})
        }

        const files = req.files.files;
        const fileCount = files.length ? files.length : 1;
        if(fileCount > 1){
            // More then 1 file
            files.forEach(f => {
                uploadFile(f);
            })
        }
        else{
            uploadFile(files)
        }

        return res.json({success: true, message: `${fileCount} Files successfully uploaded`})
    }
    catch(err){        
        console.log(err);
        return res.status(400).json({success: false, message: err.message});

    }
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})