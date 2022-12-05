import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import AppContext from '../context/AppContext';

import '../css/EquipModal.css';

function EquipModal(props) {
  const {
    materialList,
    setMaterialList,
  } = useContext(AppContext);
  const table = props.table;

  const [selectedItem, setSelectedItem] = useState({});
  const [filteredData, setFilteredData] = useState(table);
  const [searchInput, setSearchInput] = useState('');
  const [quantidade, setQuantidade] = useState();

  const removeSelectedClass = () => {
    // Provisório ↑
    console.log('removing selected class')
    const selectedClass = document.querySelector('.selected');
    if (selectedClass) {
      selectedClass.classList.remove('selected');
    }
  };

  const selectedI = async (event) => {
    console.log('running selectedI');
    const selected = event.target;

    removeSelectedClass();
    selected.parentNode.classList.add('selected');

    const findMaterial = props.table.find((data) => {
      const s = selected.parentNode.innerText.split('	');
      if (data.tag === s[0]) return true;
      return false;
    });
    setSelectedItem(findMaterial);
    console.log(selectedItem);
  };

  const updateSearch = (e) => {
    const searchNormalize = searchInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const filter = table.filter(({ name, tag }) =>
      name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(searchNormalize)
      || tag.includes(searchNormalize)
    );
    setFilteredData(filter);
  };
  
  const {
    id,
    tag,
    name,
    unidade,
  } = selectedItem;
  
  const pushMaterial = () => {
    const pushItem = {
      id: selectedItem.id,
      name: selectedItem.name,
      quantidade: quantidade ? quantidade : '0',
      tag: selectedItem.tag,
      unidade: selectedItem.unidade,
    };
    setMaterialList([...materialList, pushItem]);
    };
  
  useEffect(() => {
    updateSearch()
  }, [searchInput]);

  useEffect(() => {
    console.log('selected Item -=>', selectedItem);
    console.log('name =>', name);
    console.log('material list =>', materialList);
  })

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Digite a Tag ou o Nome"
            value={searchInput}
            className='search-input'
            onChange={(e) => { setSearchInput(e.target.value) }}
          />
        </Form.Group>
      </Modal.Header>
      <Modal.Body>
        <table className='table modal-table'>
          <thead>
            <tr>
              {props.columns.map((data, i) => (
                <th key={i}>{data}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((data, i) => (
              <tr onClick={selectedI} key={i}>
                <td>{data.tag}</td>
                <td>{data.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Form>
          <Form.Group className="mb-3 tag-input">
            <Form.Label>TAG</Form.Label>
            <Form.Control
              type='text'
              placeholder='Digite a TAG'
              value={tag}
            // onChange={(e) => {
            //   if (tag !== 99999) return;
            //   setSelectedItem({
            //     id, tag: e.target.value,
            //     name, unidade,
            //   })
            // }}
            />
          </Form.Group>
          <Form.Group className='mb-3 tag-input'>
            <Form.Label>QUANTIDADE</Form.Label>
            <Form.Control
              type='number'
              placeholder='Digite a Quantidade'
              value={quantidade}
              onChange={(e) => {
                setQuantidade(e.target.value)
                setSelectedItem({
                  id, tag, name,
                  quantidade: quantidade,
                  unidade,
                })
              }}
            />
          </Form.Group>
          <Form.Group className='mb-3 tag-input'>
            <Form.Label>UNIDADE</Form.Label>
            <Form.Control
              type='text'
              placeholder='UNIDADE'
              value={unidade}
              onChange={(e) => {
                if (tag !== '99999') return;
                setSelectedItem({
                  id, tag, name, quantidade,
                  unidade: e.target.value,
                })
              }}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>DESCRIÇÃO</Form.Label>
            <Form.Control
              type='text'
              placeholder='Descrição do Material'
              value={name}
              onChange={(e) => {
                if (tag !== '99999') return;
                setSelectedItem({
                  id, tag, name: e.target.value,
                  quantidade, unidade,
                })
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          pushMaterial()
          props.onHide()
        }}>Selecionar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EquipModal;
