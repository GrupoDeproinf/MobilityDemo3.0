import React, {useEffect, useState} from 'react'
import { Toast } from 'devextreme-react/toast';


export default function ToastGeneral(props) {
console.log(props)
    const [toastConfig, setToastConfig] = useState({
        isVisible: true,
        type: props.type,
        message: props.message,
        displayTime: 2000,
      }, []);
      useEffect(()=>{},[props])
    
      const onHiding = () => {
        setToastConfig({
          ...toastConfig,
          isVisible: false,
        });
      }
  return (
    <Toast
    visible={toastConfig.isVisible}
    message={toastConfig.type}
    type={toastConfig.message}
    onHiding={onHiding}
    displayTime={600}
  />
  )
}
