import { storage } from "./firebaseEnv";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"


export const uploadImages = async (files, ruta) => {
    if(files.length == 0){
        return ['No se encontró ninguna imagen'];
    }else{
        let uploadedImages = [];

        await files.forEach(async (file, i)=>{
            const storageRef = ref(storage, ruta + `${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            await uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const percent = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log(percent);
                    // update progress
                    // setPercent(percent);
                },
                (err) => {
                    console.log(err)
                    uploadedImages.push({error: true, message: err, ...file});
                },
                () => {
                    // download url
                    getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                        console.log(url);
                        uploadedImages.push({success: true, message: url, ...file});

                        if(files.length == i+1){
                            return uploadedImages;
                        }
                    });
                }
            );
        })
    }
}