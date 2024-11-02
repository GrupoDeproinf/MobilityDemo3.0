import React, { Component } from "react";
import {app, fire} from "../../api/firebaseEnv";
import "../../pages";
import "./FileUpload.scss"; 


export class FileUpload extends Component {
    constructor() {
      super();
      this.state = {
        uploadValue: 0,
        picture: null,
        barra: null,
        State: null,
        message: null,
        currentUser: null,
      };
  
      this.handleUpload = this.handleUpload.bind(this);
    }
  
    handleUpload(event) {
      const file = event.target.files[0];
      console.log(file);
      const storageRef = app
        .storage()
        .ref(`files/profile_pics/${this.props.uid}/${file.profile_pics}`);
      const task = storageRef.put(file);
  
      task.on(
        "state_changed",
        (snapshot) => {
          let porcentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.setState({
            barra: porcentage,
          });
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          this.setState({
            barra: 100,
            picture: task.snapshot.ref.getDownloadURL,
          });
          task.snapshot.ref.getDownloadURL().then((url) => {
            const dato = url;
            this.props.image(dato);
            fire.collection("Usuarios").doc(this.props.uid).update({
              foto_personal: dato,
            });
            console.log(this.state);
          });
        }
      );
    }
  
    render() {
      return (
        <div className="file-select" id="src-file1">
        
          {/* <progress value={this.state.barra} max="100"></progress> */}
          <input
            type="file"
            name="src-file1"
            aria-label="Archivo"
            onChange={this.handleUpload}
          />
           
        </div>
      );
    }
  }
  
  export default FileUpload;
  