import FileUploader from 'devextreme-react/file-uploader';
import * as DinamicQueries from '../../../api/DinamicsQuery';
import { SelectBox } from 'devextreme-react/select-box';
import { XCircleFill } from 'react-bootstrap-icons';
import TextArea from 'devextreme-react/text-area';
import React, {useState, useEffect} from 'react';
import './modalPhoto.scss';
import axios from 'axios';

export default function ModalPhoto (props) {
    const [tags, setTags] = useState([]);

    const allowedFileExtensions = ['.jpg', '.jpeg', '.png'];

    useEffect(()=>{
        console.log('Cambió saveImage? ');
        console.log(props.saveImage)
        SearchTag()
    }, [props.saveImage])  

    const SearchTag = () => {
        DinamicQueries.getData('getTag', 'formularios/').then((resp) => {
            console.log(resp.data.data[0].tags)
            resp.data.data[0].tags.unshift("TODOS")
            setTags(resp.data.data[0].tags);
        });
    }  

    const convertImageToBase64 = (imgUrl, funtionFile) => {
        const image = new Image();
        image.crossOrigin='anonymous';
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.height = image.naturalHeight;
          canvas.width = image.naturalWidth;
          ctx.drawImage(image, 0, 0);
          const dataUrl = canvas.toDataURL();
          console.log(dataUrl)
          funtionFile(dataUrl)
        }
        image.src = imgUrl;
      }


    const onValueChanged = async (e) => {
        console.log('Value ', e);

        let images_temporal = [...props.finalImages]
        e.value.map((img, i)=>{
            const fileReader = new FileReader();
            fileReader.readAsDataURL(img);
            fileReader.onload = () => {
                
                let duplicateImg = images_temporal.find(x=> x.name === img.name)
                
                if(duplicateImg === undefined ){
                    images_temporal.push({source: fileReader.result, name: img.name, key: i + img.name, description: '', file: img});
                }

                if(e.value.length === i + 1 ){
                    console.log(images_temporal);
                    
                    let newArr = new Set(images_temporal);
                    let result = [...newArr];
                    console.log(result)
                    props.setFinalImages(result)
                }
            }
        })
    }

    const deleteImage = (e) => {
        console.log('Delete Image ', e)
        let images_temporal = [...props.finalImages];
        let index = images_temporal.findIndex(data => data.key === e);
        if(index !== -1){
            images_temporal.splice(index, 1);
            console.log('Images ', images_temporal);
            
            props.setFinalImages(images_temporal)
        }else{
            console.log(index)
        }
    }

    const setDescription = (e, key) => {
        console.log('Description ', e);
        let images_temporal = [...props.finalImages];
        let index = images_temporal.findIndex(data => data.key === key);
        if(index !== -1){
            images_temporal[index].description = e.value;

            console.log(images_temporal);
            props.setFinalImages(images_temporal)
        }
    }

    const setTag = (e, key) => {
        console.log('Description ', e);
        let images_temporal = [...props.finalImages];
        console.log(images_temporal)
        let index = images_temporal.findIndex(data => data.key === key);
        if(index !== -1){
            images_temporal[index].tag = e.value;

            console.log(images_temporal);
            props.setFinalImages(images_temporal)
        }
    }

    return (
        <React.Fragment>
            <div className="widget-container flex-box-photo">
                <FileUploader
                    id="file-uploader"
                    multiple={true}
                    allowedFileExtensions={ allowedFileExtensions}
                    accept={'.jpg, .jpeg, .png'}
                    uploadMode="instantly"
                    visible={true}
                    onValueChanged={onValueChanged}
                    labelText={'O arrastra tu archivo aquí'}
                    selectButtonText={'Elegir archivo'}
                ></FileUploader>
                <div className="flex-box-img d-flex w-100">
                    {   props.finalImages.map((x)=>{
                            return (
                                <div className='card-image dx-card-img' key={x.key} style={{height:"100%"}}>
                                    <XCircleFill className='delete-img' onClick={() => deleteImage(x.key)} /> 
                                    <img id="dropzone-image" height={'10%'} width={'10%'} src={x.source} alt="" />
                                    <TextArea value={x.description} height={90} onValueChanged={(e) => setDescription(e, x.key)} placeholder="Descripción..."/>

                                    <SelectBox
                                        label='Etiquetas'
                                        dataSource={tags}
                                        defaultValue={x.tag}
                                        value={x.tag}
                                        onValueChanged={(e) => setTag(e,x.key)}
                                        searchEnabled={true}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </React.Fragment>
    )
}