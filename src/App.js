import React, { useState } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

function ResultComp(props) {
  console.log(props)

  return (
    <div className="result-comp">
      <img src={props.link} className="result-img" alt="img"/>
      <p className="result-txt">{props.msg}</p>
    </div>
  )
}
  
function App() {
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [fileStuff, setFileStuff] = useState();
    const [out, setOut] = useState();
    function handleChange(e) {
        console.log(e.target.files);
        setFileStuff(e.target.files[0])
        setFile(URL.createObjectURL(e.target.files[0]));
    }
    const onPredictClick = (e) => {
      setOut(null)
      setLoading(true)
      makePrediction()
    }
    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "black",
    };
    const makePrediction = () => {
      let formdata = new FormData()
      
      formdata.append("image", fileStuff)

      axios.post("http://localhost:5000/test", formdata, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res.data)
        setLoading(false)
        let output = res.data.predictions
        let outComps = output.map((item) => {
          return ResultComp(item)
        })
        let outFinal = <div className="out-wrapper">{outComps}</div>
        setOut(outFinal)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
    }
  
    return (
        <div className="App">
            <h2 id='title'>Breast Cancer Prediction:</h2>
            <input type="file" onChange={handleChange} id='input-box'/>
            <img src={file} id='preview'/>
            <button className="submit-button" onClick={onPredictClick}>Predict</button>
            <ClipLoader color="#000000" loading={loading} size={20} aria-label="Loading Spinner" cssOverride={override} speedMultiplier={2}/>
            {out ? out : <div></div>}
        </div>
  
    );
}

export default App;
