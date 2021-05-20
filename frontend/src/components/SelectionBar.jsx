import React, { useEffect, useState } from 'react'

import { Dropdown  } from 'react-bootstrap'
import axiosConfig from '../axiosConfig'

import '../css/styles.css'

export default function SelectionBar({ handleChange,  name, type }) {
    const [elements, setElements] = useState([])

    const partyName = ['Green', 'Australian Labor Party', 'Liberal', 'Nationals']

    useEffect(() => {
        if(type === 'brand'){
            axiosConfig.get('/vaccine_brand').then(res => {
                setElements([...res.data.vaccine_brand])
        })
        
    }
    else if(type === 'vaccine'){
        axiosConfig.get('/city_data').then(res => {
            setElements([...res.data.city])
    })
    }
    else if(type === 'parties'){
        setElements(['the_greens', 'australian_labor_party', 'liberal', 'the_nationals'])
    }
    }, [type])

    return (
        <div className='selection'>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {name ? name : type === 'vaccine' ? 'Overall Tweet' : type === 'parties' ? 'Green' : 'Overall Brands'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {type === 'parties' ? 
                    elements.map(ele => 
                        <Dropdown.Item name={ele} onClick={handleChange}>{partyName[elements.indexOf(ele)]}</Dropdown.Item>
                        )
                        :
                        elements.map(ele => 
                            <Dropdown.Item name={ele} onClick={handleChange}>{ele}</Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}
