import React from 'react';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import RadioGroup from 'devextreme-react/radio-group';


export default function RightCategoryForm(props) {
    const simpleRadio = ['Si', 'No'];
    const buildFiled = (question) => {

        let defaultValueInput = props.finalCategory[props.defaultMainCategory.categoria + '_' + props.defaultValue][question.pregunta];
        let key = props.defaultValue + '_' + question.pregunta;

        if (question.tipo === "Cantidad") {
            return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={(e) => { props.setFinalData(e, true) }} defaultValue={defaultValueInput} format="#0" />
        } else if (question.tipo === "Precio") {
            return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={(e) => { props.setFinalData(e, true) }} defaultValue={defaultValueInput} format="#,##0.##" />
        } else if (question.tipo === "Simple") {
            return <RadioGroup items={simpleRadio} id={question.pregunta} key={key} onValueChanged={(e) => { props.setFinalData(e, true) }} defaultValue={defaultValueInput} layout="horizontal" />
        } else if (question.tipo === "Tamaño") {
            return <NumberBox width={'100%'} id={question.pregunta} key={key} onValueChanged={(e) => { props.setFinalData(e, true) }} defaultValue={defaultValueInput} format="#,##0.###" />
        } else if (question.tipo === "Texto") {
            return <TextBox width={'100%'} id={question.pregunta} key={key} onValueChanged={(e) => { props.setFinalData(e, true) }} defaultValue={defaultValueInput} />
        }
    }

    return (
        <div className='rightPopupForm'>
            {
                props.selectedQuestions.length > 0 &&
                props.selectedQuestions.map((question, i) => {
                    return (
                        <div key={i} className="dx-fieldset">
                            <div className="dx-fieldset-header">{question.pregunta}</div>
                            <div className="dx-field">
                                {buildFiled(question)}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}