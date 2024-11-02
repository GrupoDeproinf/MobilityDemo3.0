import { useState } from "react";
import "./login.scss";
import Carousel from "../Carousel/Carousel";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import axios from "axios";
import settings from "../../api/enviroment";

export default function Login() {
  const [Login1, setLogin1] = useState(false);
  const [Login, setLogin] = useState(false);
  const [form1, setForm1] = useState("1");

  function ValidadorLogin(e) {
    if (e === "signIn") {
      setLogin(false);
      setLogin1(true);
    }
    if (e === "Register") {
      setLogin(true);
      setLogin1(false);
    }
  }

  return (
    <div className="Hea">
      <div className="Hea">
        <div className="izquier">
          <div className="ColorBack">
              <div className="IconMobility">
                <div className="Ic">
                  <div className="ImgIco">
                    <img src="assets/images/logos/logo.png" />
                  </div>
                  <div className="brandi">
                    <img src="assets/images/logos/Branding.png" />
                  </div>
                </div>
              </div>
              <div>
                <Carousel />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
