import React from 'react'
import { useState, useEffect, createRef} from 'react'
import { useStore } from './hooks'
import { Map, TileLayer } from 'react-leaflet'
import Header from './Header'
import Marker from './Marker'
import IncidentForm from './IncidentForm'
import Register from './Register'
import Login from './Login'
import incidentsService from './services/incidents'
import authService from './services/auth'
import './App.scss';

const App = () => {
  const [position] = useState({ lat: 6.2486, lng: -75.5742, zoom: 13 })
  const incidents = useStore(incidentsService)
  const [forms, setForms] = useState({ register: false, login: false, incident: { show: false } })

  useEffect(() => {
    incidentsService.load()
    authService.loadUser()
  }, [])

  const openRegister = e => {
    e.preventDefault()
    setForms({ ...forms, register: true })
  }
  const closeRegister = () => setForms({ ...forms, register: false })

  const openLogin = e => {
    e.preventDefault()
    setForms({ ...forms, login: true })
  }
  const closeLogin = () => setForms({ ...forms, login: false })

  const openIncidentForm = e => {
    console.log(e);
    setForms({ ...forms, incident: { show: true, lat: e.latlng.lat, lng: e.latlng.lng } })
  }
  const closeIncidentForm = () => setForms({ ...forms, incident: { show: false } })

  const mapRef = createRef();
  return (
    <>
      <Header login={openLogin} register={openRegister}  />
      <div>
        <Map center={[position.lat, position.lng]} zoom={position.zoom} ref={mapRef} onClick={openIncidentForm}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { incidents.map(c => <Marker incident={c} key={`marker-${c.id}`} />) }
        </Map>
        { forms.incident.show ? <IncidentForm close={closeIncidentForm} lat={forms.incident.lat} lng={forms.incident.lng} /> : null }
        { forms.register ? <Register close={closeRegister} /> : null }
        { forms.login ? <Login close={closeLogin} /> : null }
      </div>
    </>
  );
}

export default App;
