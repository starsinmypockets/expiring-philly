import "./App.css"
import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet"
import { Icon } from "leaflet"
import markerIconPng from "./red-x.png"
import CouncilDistricts from "./overlays/Council_Districts_2016.json"
import expiring from "./expiring_properties.json"
import "bootstrap/dist/css/bootstrap.min.css"

const ActiveDistrict = ({ district, person, properties, units }) => {
  return (
    <>
      <h3>District {district}</h3>
      <p>
        <strong>Expiring properties: </strong> {properties}
      </p>
      <p>
        <strong>Expiring units: </strong>
        {units}
      </p>
      <p>{person.name}</p>
      <p>
        <strong>email: </strong>
        {person.email}
      </p>
      <p>
        <strong>{person.phone1}</strong>
      </p>
      <p>
        <strong>{person.phone2}</strong>
      </p>
    </>
  )
}

const districts = {
  1: {
    units: 4,
    properties: 190,
  },
  2: {
    units: 251,
    properties: 6,
  },
  3: {
    units: 714,
    properties: 16,
  },
  4: {
    units: 285,
    properties: 2,
  },
  5: {
    units: 151,
    properties: 2,
  },
  6: {
    units: 0,
    properties: 0,
  },
  7: {
    units: 204,
    properties: 3,
  },
  8: {
    units: 63,
    properties: 2,
  },
  9: {
    units: 24,
    properties: 1,
  },
  10: {
    units: 0,
    properties: 0,
  },
}

const councilPeople = {
  1: {
    name: "Councilmember Mark Squilla",
    email: "mark.squilla@phila.gov",
    phone1: "(215) 686-3458",
    phone2: "(215) 686-3459",
  },
  2: {
    name: "Councilmember Kenyatta Johnson",
    email: "kenyatta.johnson@phila.gov",
    phone1: "(215) 686-3412",
    phone2: "(215) 686-3413",
  },
  3: {
    name: "Councilmember Jamie Gauthier",
    email: "jamie.gauthier@phila.gov",
    phone1: "(215) 686-0459",
    phone2: "(215) 686-0460",
  },
  4: {
    name: "Councilmember Curtis Jones, Jr.",
    email: "curtis.jones@phila.gov",
    phone1: "(215) 686-3416",
    phone2: "(215) 686-3417",
  },
  5: {
    name: "Council President Darrell Clarke",
    email: "darrell.clarke@phila.gov",
    phone1: "(215) 686-3442",
    phone2: "(215) 686-3443",
  },
  6: {
    name: "Bobby Henon",
    email: "bobby@bobbyhenon.com",
    phone1: "(215) 686-3444",
    phone2: "(215) 686-3445",
  },
  7: {
    name: "Councilmember Maria D. Quiñones-Sánchez",
    email: "maria.q.sanchez@phila.gov",
    phone1: "(215) 686-3448",
    phone2: "(215) 686-3449",
  },
  8: {
    name: "Councilmember Cindy Bass",
    email: "cindy.bass@phila.gov",
    phone1: "(215) 686-3424",
    phone2: "(215) 686-3425",
  },
  9: {
    name: "Councilmember Cherelle Parker",
    email: "cherelle.parker@phila.gov",
    phone1: "(215) 686-3454",
    phone2: "(215) 686-3455",
  },
  10: {
    name: "Councilmember Brian J. O’Neill",
    email: "brian.o'neill@phila.gov",
    phone1: "(215) 686-3422",
    phone2: "(215) 686-3423",
  },
}

const atLargeCouncil = [
  {
    name: "Kendra Brooks",
    email: "kendra.brooks@phila.gov",
    phone1: "(215) 686-3438",
    phone2: "(215) 686-3439",
  },
  {
    name: "Allan Domb",
    email: "allan.domb@phila.gov",
    phone1: "(215) 686-3414",
    phone2: "(215) 686-3415",
  },
  {
    name: "Derek Green",
    email: "derek.green@phila.gov",
    phone1: "(215) 686-3450",
    phone2: "(215) 686-3451",
  },
  {
    name: "Katherine Gilmore Richardson",
    email: "katherine.gilmore.richardson@phila.gov",
    phone1: "(215) 686-0454",
    phone2: "(215) 686-0455",
  },
  {
    name: "Helen Gym",
    email: "helen.gym@phila.gov",
    phon1: "(215) 686-3420",
    phone2: "(215) 686-3421",
  },
  {
    name: "David Oh",
    email: "david.oh@phila.gov",
    phone1: "(215) 686-3452",
    phone2: "(215) 686-3453",
  },
  {
    name: "Isaiah Thomas",
    email: "isaiah.thomas@phila.gov",
    phone1: "(215) 686-3446",
    phone2: "(215) 686-3447",
  },
]

const App = () => {
  const position = [39.952583, -75.165222]
  const [showDistricts, setShowDistricts] = useState(true)
  const [showProperties, setShowProperties] = useState(true)
  const [showCouncil, setShowCouncil] = useState(false)
  const [showAtLarge, setShowAtLarge] = useState(false)
  const [activeDistrict, setActiveDistrict] = useState()

  console.log({ expiring })
  const isMobile = window.innerWidth <= 756

  return (
    <div className="row">
      <div
        className="col-md-9"
        style={{ overflowX: "hidden", overflowY: "scroll" }}
      >
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ minHeight: isMobile ? "90vh" : "100vh", minWidth: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showDistricts && (
            <GeoJSON
              onEachFeature={(feature, layer) => {
                console.log({ feature, layer })
                const cp = councilPeople[feature.properties.DISTRICT]

                layer.bindPopup(
                  `<strong>DISTRICT ${feature.properties.DISTRICT}</strong><br/>${cp.name}<br/>${cp.email}<br/>${cp.phone1}<br/>${cp.phone2}`
                )
                layer.on("click", (e) => {
                  console.log(e)
                  setActiveDistrict(feature.properties.DISTRICT)
                })
              }}
              data={CouncilDistricts}
              style={{ strokeWidth: "1px", color: "green" }}
              stroke="blue"
            />
          )}
          {showProperties &&
            expiring.map((property) => (
              <Marker
                position={[property.Lat, property.Lon]}
                icon={
                  new Icon({
                    iconUrl: markerIconPng,
                    iconSize: [28, 34],
                    iconAnchor: [14, 17],
                  })
                }
              >
                <Popup>
                  <>
                    {property["Property Name"]}
                    <br />
                    {property["Property Address"]}
                    <br />
                    OWNER: {property["Owner Name"]}
                    <br />
                    UNITS: {property["Total Units"]}
                    <br />
                    Contract Expires*: {property["Earliest End Date"]}
                  </>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
      <div className="map-legend col-md-3">
        <div style={{ padding: "20px" }}>
          <h1>Expiring subsidized housing contracts</h1>
          {activeDistrict && (
            <ActiveDistrict
              district={activeDistrict}
              person={councilPeople[parseInt(activeDistrict)]}
              properties={districts[parseInt(activeDistrict)].properties}
              units={districts[parseInt(activeDistrict)].units}
            />
          )}
          <h3>Layers</h3>
          <ul
            style={{
              listStyleType: "none",
              paddingLeft: "0",
              fontSize: "1.2em",
            }}
          >
            <li>
              <input
                type="checkbox"
                checked={showDistricts}
                name="districts"
                onClick={(e) => {
                  setShowDistricts(!showDistricts)
                }}
              />
              <label htmlFor="districts" style={{ marginLeft: "4px" }}>
                Council Districts
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                checked={showProperties}
                name="properties"
                onClick={(e) => {
                  setShowProperties(!showProperties)
                }}
              />
              <label htmlFor="properties" style={{ marginLeft: "4px" }}>
                Expiring Properties
              </label>
            </li>
          </ul>
          <h3>About</h3>
          <p>
            Philadelphia is currently facing a housing crisis. In the midst of
            this crisis looms another crisis. There are currently nearly 2000
            units of subsidized affordable housing expiring in the next 5 years.
            There is a already a long waiting list and no relief in site.
          </p>
          <h3>What you can do</h3>
          <p>
            Contact district council people and let them know that strong and
            immediate action must be taken to preserve affordable and subsidized
            housing in your district.
          </p>
          <p>
            Contact Mayor Kenney and tell him to take immediate action to save
            the UC Townhomes and all expiring subsidized housing.
          </p>
          <p>Organize! Get involved! Meet your neighbors!</p>
          <div className="panel panel-default">
            <div className="panel-body">
              <h3>Mayor Jim Kenney</h3>
              <p>
                City Hall, Office 215
                <br />
                Philadelphia, PA 19107
                <br />
                <strong>(215) 686-2181</strong>
                <br />
                <a href="https://www.phila.gov/departments/mayor/mayors-correspondence-form/">
                  Correspondence form
                </a>
              </p>
            </div>
          </div>
          <h3>
            District Councilpeople{"  "}
            <span
              style={{ textDecoration: "underline", color: "blue" }}
              onClick={(e) => {
                setShowCouncil(!showCouncil)
              }}
            >
              {showCouncil ? "hide" : "show"}
            </span>
          </h3>
          {showCouncil &&
            Object.keys(councilPeople).map((d) => (
              <>
                <p>
                  <strong>{councilPeople[d].name}</strong>
                </p>
                <p>DISTRICT: {d}</p>
                <i>{councilPeople[d].email}</i>
                <p>{councilPeople[d].phone1}</p>
                <p>{councilPeople[d].phone2}</p>
                <hr />
              </>
            ))}
          <h3>
            At Large Councilpeople{"  "}
            <span
              style={{ textDecoration: "underline", color: "blue" }}
              onClick={(e) => {
                setShowAtLarge(!showAtLarge)
              }}
            >
              {showAtLarge ? "hide" : "show"}
            </span>
          </h3>
          {showAtLarge &&
            atLargeCouncil.map((person) => (
              <>
                <p>
                  <strong>{person.name}</strong>
                </p>
                <i>{person.email}</i>
                <p>{person.phone1}</p>
                <p>{person.phone2}</p>
                <hr />
              </>
            ))}
          <i>* "Expires" refers to earliest end date for contract</i>
          <hr/>
          <p>
            <i>Source: National Housing Preservation Database</i>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
