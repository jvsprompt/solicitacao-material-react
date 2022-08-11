import React, { useState } from 'react';

import InputDate from '../components/InputDate';
import InputDropdown from '../components/InputDropdown';
import InputText from '../components/InputText';
import InputTextArea from '../components/InputTextArea';
import submitForm from '../utils/submitForm';
import { unidades } from '../data/unidades';
import setor from '../data/setores.json';

function Form() {
  // const [encarregadoValue, setEncarregadoValue] = useState('');
  const [servicosValue, setServicosValue] = useState('');
  const [dataLevantValue, setDataLevantValue] = useState('');
  // const [data1ExValue, setData1ExValue] = useState('');
  // const [data2ExValue, setData2ExValue] = useState('');
  const [unidadesValue, setUnidadesValue] = useState('UPA-BOTAFOGO');
  const [setorValue, setSetorValue] = useState('');
  // const [osValue, setOsValue] = useState('');
  // const [materiaisValue, setMateriaisValue] = useState('');

  const entry = {
    ecarregado: 'entry.848539894',
    servico: 'entry.1136451657',
    unidade: 'entry.275485717',
    
  }

  const sendData = () => {
    const url = 'fwsfwef';
    const dataToPost = new FormData();

    const { day, month, year } = getDate(dataLevantValue);

    // dataToPost.append(entry.ecarregado, encarregadoValue);
    dataToPost.append(entry.servico, servicosValue);
    dataToPost.append('', day);
    dataToPost.append('', month);
    dataToPost.append('', year);
    dataToPost.append('', unidadesValue);
    dataToPost.append('', setorValue);
    // dataToPost.append('', osValue);
    // dataToPost.append('', materiaisValue);

    submitForm(url, dataToPost);
  };

  const getDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return { day, month, year };
  };

  const getSetor = (unidade) => {
    if (unidade === '') {
      return ['Selecione a unidade primeiro'];
    }

    if (unidade === 'UPA-BOTAFOGO') {
      return setor.botafogo;
    }

    if (unidade === 'UPA-COPACABANA') {
      return ['Setor de Copacabana'];
    }

    if (unidade === 'UPA-MARÉ') {
      return ['Setor de Maré'];
    }

    if (unidade === 'UPA-TAQUARA') {
      return ['Setor de Taquara'];
    }

    if (unidade === 'UPA-TIJUCA') {
      return setor.tijuca;
    }
  };

  return (
    <div className='main-div'>
      {/* <InputDropdown
        name='ENCARREGADO'
        value={encarregadoValue}
        change={setEncarregadoValue}
        items={['ENCARREGADO 1', 'ENCARREGADO 2', 'ENCARREGADO 3']}
        localStore={true}
      /> */}
      <InputDropdown
        name='SERVIÇO'
        value={servicosValue}
        change={setServicosValue}
        items={['PLANEJADO', 'EMERGÊNCIA']}
        localStore={false}
      />
      <InputDate
        name='DATA DE LEVANTAMENTO'
        value={dataLevantValue}
        change={setDataLevantValue}
        localStore={false}
      />
      {/* <InputDate
        name='1ª DATA DE EXECUÇÃO'
        value={data1ExValue}
        change={setData1ExValue}
        localStore={false}
      />
      <InputDate
        name='2ª DATA DE EXECUÇÃO'
        value={data2ExValue}
        change={setData2ExValue}
        localStore={false}
      /> */}
      <InputDropdown
        name='UNIDADE'
        value={unidadesValue}
        change={setUnidadesValue}
        items={ unidades }
        localStore={false}
      />
      <InputDropdown
        name='SETOR'
        value={setorValue}
        change={setSetorValue}
        items={getSetor(unidadesValue)}
        localStore={false}
      />
      {/* <InputText
        name='OS'
        value={osValue}
        change={setOsValue}
        localStore={false}
      /> */}
      <InputTextArea
        name='MATERIAIS'
        // value={materiaisValue}
        // change={setMateriaisValue}
        // localStore={false}
        cols='30'
        rows='6'
        maxLen={1500}
        // minLen={9}
      />

      <button className="myButton" type="submit" onClick={sendData}>Enviar</button>
<div className='botton'></div>
    </div>

  );
}

export default Form;