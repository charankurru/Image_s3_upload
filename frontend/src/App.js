import { useState } from 'react'
import axios from 'axios'
//import PDFViewer from 'pdf-viewer-reactjs'

import './App.css'

async function postImage({image, description}) {
  const formData = new FormData();
  formData.append("image", image)
  formData.append("description", description)

  const result = await axios.post('/images', formData, { headers: {'Content-Type': 'multipart/form-data'}})
  return result.data
}


function App() {

  const [file, setFile] = useState()
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])

  const submit = async event => {
    event.preventDefault()
    const result = await postImage({image: file, description})
    setImages([result.image, ...images])
  }

  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)
	}

  return (
    <div className="App">
      <form encType="multipart/form-data" onSubmit={submit}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <input value={description} onChange={e => setDescription(e.target.value)} type="text"></input>
        <button type="submit">Submit</button>
      </form>

      { images.map( image => (
        <div key={image}>
          <img src={image}></img>
        </div>
      ))}
      
      
      <img src={'1653393588184 --- map1.jpg'}></img>

    </div>
  );
}
// const ExamplePDFViewer = () => {
//   return (
//       <PDFViewer
//           document={{
//               url: 'https://photos-bucket-demo.s3.ap-south-1.amazonaws.com/1651921339342%20---%20litreviewsample.pdf',
//           }}
//       />
//   )
// }



export default App;
