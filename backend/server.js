const express = require('express')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const multer = require('multer')
const { uploadFile, getFileStream } = require('./s3')
const path = require('path')


const app = express()


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + "---" + file.originalname)
  }
})

const upload = multer({ storage: storage  })

// ---------------------------------------------------------------------
// const filestorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//   cb(null, "./uploads");
//   },
//   filename: (req, file, cb) => {
//   cb(null, Date.now() + "--" + file.originalname);
//   },
// });
//----------------------------------------------------------------------


// retrive images from " s3 Bucket "
app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key);

  readStream.pipe(res);
}) 


// uploading images to " s3 Bucket "
app.post('/images', upload.single("image"), async (req, res) => {
  const file = req.file
  console.log(file);
  //console.log("hey",file.path);




  const result = await uploadFile(file)
  await unlinkFile(file.path)
  console.log(result);
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
})



app.listen(8080, () => console.log("listening on port 8080"))



// path.extname(file.originalname)