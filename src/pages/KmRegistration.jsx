import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import InputTextKm from "../components/InputTextKm";
import InputNumberKm from "../components/InputNumberKm";
import InputDropdownKm from "../components/InputDropdownKm";

import submitFormv2 from "../utils/submitFormv2";

import motoristas from "../data/motoristas.json";
import veiculos from "../data/veiculos.json";
import URL_Return from "../data/url.json";

function FormFuel() {
  const { placa } = useParams();

  const [showForm, setShowForm] = useState(true);
  const [localValue, setLocalValue] = useState("");
  const [kmValue, setKmValue] = useState("");
  const [motoristaValue, setMotoristaValue] = useState("");
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [lastTipo, setLastTipo] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalLocked, setModalLocked] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialDataLength, setInitialDataLength] = useState(0);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    setInitialDataLength(data.length);
  }, [data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const urlItem = URL_Return.find(
        (item) => item["veiculo/placa"] === placa
      );
      const response = await axios.get(urlItem.url);
      console.log("get vehicles response =>", response);

      const currentDate = new Date().toLocaleDateString();
      const filteredData = response.data.filter((item) =>
        item["Carimbo de data/hora"].includes(currentDate)
      );

      filteredData.sort(
        (a, b) =>
          new Date(b["Carimbo de data/hora"]) - new Date(a["Carimbo de data/hora"])
      );
  
      const last50Data = filteredData.slice(0, 50);
  
      setData(last50Data);
      setTableData(last50Data);
      console.log("vehicles data =>", data);
      setLoading(false);
  
      if (last50Data.length > 0) {
        const mostRecentLocal = last50Data[0].LOCAL;
        const secondMostRecentLocal = last50Data[1]?.LOCAL || "";
        const mostRecentKm = last50Data[0].KM;
        setLocalValue(
          mostRecentLocal === secondMostRecentLocal ? "" : mostRecentLocal
        );
        setKmValue(mostRecentKm.substring(0, 3));
        setLastTipo(last50Data[0].TIPO);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const initializeStates = () => {
    const found = veiculos.find(
      (veiculo) => veiculo["veiculo/placa"] === placa
    );

    if (!found) {
      setErrorMessage("PLACA INVÁLIDA! VERIFIQUE SEU ENDEREÇO ESTÁ CORRETO.");
      setShowErrorModal(true);
      setShowForm(false);
    }
  };

  const restoreDefaultValues = () => {
    setKmValue("");
    setMotoristaValue("");
  };

  const sendData = (tipoValue) => {
    let urlItem;
  
    for (let i = 0; i < URL_Return.length; i++) {
      if (URL_Return[i]["veiculo/placa"] === placa) {
        urlItem = URL_Return[i];
        break;
      }
    }
  
    if (urlItem) {
      const URI = urlItem.uri;
      const LOCAL = urlItem.local;
      const TIPO = urlItem.tipo;
      const KM = urlItem.km;
      const VEICULO = urlItem.veiculo;
      const MOTORISTA = urlItem.motorista;
  
      if (tipoValue && localValue && kmValue && placa && motoristaValue) {
        if (kmValue.length < 6) {
          setErrorMessage("O valor de KM deve ter pelo menos 6 dígitos.");
          setShowErrorModal(true);
          return;
        }
  
        const last8Digits = placa.substring(placa.length - 8);
  
        // Verificar se o KM é maior ou igual ao mais recente na tabela
        if (tableData.length > 0) {
          const mostRecentKm = parseInt(tableData[0].KM);
          if (parseInt(kmValue) < mostRecentKm) {
            setErrorMessage("O valor de KM não pode ser menor que o valor mais recente.");
            setShowErrorModal(true);
            return;
          }
        }
  
        const dataToPost = new FormData();
        dataToPost.append(LOCAL, localValue);
        dataToPost.append(TIPO, tipoValue);
        dataToPost.append(KM, kmValue);
        dataToPost.append(VEICULO, last8Digits);
        dataToPost.append(MOTORISTA, motoristaValue);
  
        const newEntry = {
          "Carimbo de data/hora": new Date().toLocaleString(),
          TIPO: tipoValue,
          KM: kmValue,
          LOCAL: localValue,
          "VEÍCULO/PLACA": last8Digits,
          MOTORISTA: motoristaValue,
        };
  
        setData([newEntry, ...data]);
        setTableData([newEntry, ...tableData]);
        setLastTipo(tipoValue);
  
        submitFormv2(URI, dataToPost);
  
        restoreDefaultValues();
  
        if (navigator.onLine) {
          setModalLocked(true);
          setDataUpdated(true);
        } else {
          setErrorMessage(
            "NÃO FOI POSSÍVEL ENVIAR, VERIFIQUE SUA CONEXÃO COM A INTERNET!"
          );
          setShowErrorModal(true);
        }
      } else {
        setErrorMessage("POR FAVOR, PREENCHA TODOS OS CAMPOS ANTES DE ENVIAR.");
        setShowErrorModal(true);
      }
    }
  };
  

  const diasDaSemana = [
    "DOMINGO",
    "SEGUNDA-FEIRA",
    "TERÇA-FEIRA",
    "QUARTA-FEIRA",
    "QUINTA-FEIRA",
    "SEXTA-FEIRA",
    "SÁBADO",
  ];

  const mesesDoAno = [
    "JANEIRO",
    "FEVEREIRO",
    "MARÇO",
    "ABRIL",
    "MAIO",
    "JUNHO",
    "JULHO",
    "AGOSTO",
    "SETEMBRO",
    "OUTUBRO",
    "NOVEMBRO",
    "DEZEMBRO",
  ];

  const dataAtual = new Date();
  const diaDaSemana = diasDaSemana[dataAtual.getDay()];
  const diaDoMes = dataAtual.getDate();
  const mesAtual = mesesDoAno[dataAtual.getMonth()];
  const anoAtual = dataAtual.getFullYear();
  const dataFormatada = `${diaDaSemana}, ${diaDoMes} DE ${mesAtual.toUpperCase()} DE ${anoAtual}`;

  const handleFinalModalClose = () => {
    setShowFinalModal(false);
  };

  const handleNewModalClose = () => {
    setShowSuccessModal(false);
    setModalLocked(false);
  };

  useEffect(() => {
    if (data.length > initialDataLength) {
      setShowSuccessModal(false);
      setModalLocked(false);
    }
  }, [data, initialDataLength]);

  useEffect(() => {
    if (!showSuccessModal && dataUpdated) {
      setShowFinalModal(true);
      setDataUpdated(false);
    }
  }, [showSuccessModal, dataUpdated]);

  useEffect(() => {
    if (showFinalModal) {
      const timer = setTimeout(() => {
        setShowFinalModal(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [showFinalModal]);

  useEffect(() => {
    initializeStates();
    fetchData();
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      const mostRecentLocal = tableData[0].LOCAL;
      const secondMostRecentLocal = tableData[1]?.LOCAL || "";
      const mostRecentKm = tableData[0].KM;
      setLocalValue(
        mostRecentLocal === secondMostRecentLocal ? "" : mostRecentLocal
      );
      setKmValue(mostRecentKm.substring(0, 3));
      setLastTipo(tableData[0].TIPO);
    }
  }, [tableData]);

  return (
    <div className="form-group">
      <div className="">
        {showForm && (
          <div className="text-light text-center font-weight-bold">
            <div className="text-danger font-weight-bold">{placa}</div>
            <div className="main-div">
              <InputDropdownKm
                name="MOTORISTA"
                value={motoristaValue}
                change={setMotoristaValue}
                items={motoristas}
                localStore={false}
                placeholder={true}
                placeholdertext="Selecione o Motorista"
                style={{ color: "gray" }}
              />
              <InputTextKm
                name="LOCAL"
                value={localValue}
                change={setLocalValue}
                placeholder="Digite o local"
                uppercase={true}
              />
              <InputNumberKm
                name="KM"
                value={kmValue}
                change={setKmValue}
                placeholder="Digite o KM"
                maxLen={6}
              />
            </div>
            <div className="main-div">ONDE VOCÊ ESTÁ?</div>
            <div className="d-flex justify-content-center mx-5">
              <Button
                className="btn btn-info btn-lg rounded-left w-50 font-weight-bold"
                onClick={() => sendData("ORIGEM")}
                disabled={lastTipo === "ORIGEM"}
              >
                ORIGEM
              </Button>
              <div className="mx-4"></div>
              <Button
                className="btn btn-warning btn-lg rounded-right w-50 font-weight-bold"
                onClick={() => sendData("DESTINO")}
                disabled={lastTipo === "DESTINO"}
              >
                DESTINO
              </Button>
            </div>
            <br />
            <br />
            <div className="text-success font-weight-bold">
              HISTÓRICO DE ENVIO:
            </div>
            <div className="text-light font-weight-bold">{dataFormatada}</div>
            <br />
            <div className="table-responsive-sm">
              {loading ? (
                <p>Carregando Tabela...</p>
              ) : (
                <table className="table table-striped table-dark w-100">
                  <thead className="small">
                    <tr>
                      <th>Data/Hora</th>
                      <th>Tipo</th>
                      <th>KM</th>
                      <th>Local</th>
                      <th>Placa</th>
                      <th>Motorista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((item, index) => (
                        <tr key={index}>
                          <td className="small">
                            {item["Carimbo de data/hora"]}
                          </td>
                          <td className="small">{item.TIPO}</td>
                          <td className="small">{item.KM}</td>
                          <td className="small">{item.LOCAL}</td>
                          <td className="small">{item["VEÍCULO/PLACA"]}</td>
                          <td className="small">{item.MOTORISTA}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Nenhum registro encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        show={showSuccessModal}
        onHide={modalLocked ? null : handleNewModalClose}
        backdrop={modalLocked ? "static" : true}
        keyboard={!modalLocked}
      >
        <Modal.Header closeButton={!modalLocked}>
          <Modal.Title>Enviando dados...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          POR FAVOR, AGUARDE ALGUNS SEGUNDOS. <p /> NÃO FECHE OU ATUALIZE ESTA
          PÁGINA!
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal show={showFinalModal} onHide={handleFinalModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enviado com sucesso!</Modal.Title>
        </Modal.Header>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Erro!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FormFuel;
