import React, { useEffect, useState } from 'react'

import { Dropdown  } from 'react-bootstrap'
import axios from 'axios'

import '../css/styles.css'

export default function SelectionBar({ handleChange,  name, type }) {
    const [elements, setElements] = useState([])

    useEffect(() => {
        if(type === 'brand'){
            axios.get('http://127.0.0.1:5000/vaccine_brand').then(res => {
                setElements([...res.data.vaccine_brand])
        })
        
    }
    else if(type === 'vaccine'){
        axios.get('http://127.0.0.1:5000/city_data').then(res => {
            setElements([...res.data.city])
    })
    }
    }, [type])

    return (
        <div className='selection'>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {name? name : type === 'vaccine' ? 'Overall Tweet' : 'Overall Brands'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {elements.map(ele => <Dropdown.Item name={ele} onClick={handleChange}>{ele}</Dropdown.Item>)}
                    
                    {/* <Dropdown.Item name='Melbourne' onClick={handleChange}>Melbourne</Dropdown.Item>
                    <Dropdown.Item name='Sydney' onClick={handleChange}>Sydney</Dropdown.Item>
                    <Dropdown.Item name='Canberra' onClick={handleChange}>Canberra</Dropdown.Item>
                    <Dropdown.Item name='Perth' onClick={handleChange}>Perth</Dropdown.Item>
                    <Dropdown.Item name='Adelaide' onClick={handleChange}>Adelaide</Dropdown.Item>
                    <Dropdown.Item name='Brisbane' onClick={handleChange}>Brisbane</Dropdown.Item>
                    <Dropdown.Item name='RuralArea' onClick={handleChange}>RuralArea</Dropdown.Item>       */}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}
