// Custom JS Google Maps 
declare var manywho: any;
declare var google: any;

import * as React from "react";
import { IObjectData } from "../interfaces/IMWData";
// import './index.css';

class piiGoogleMap extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            zoom: 3,
            maptype: "roadmap", // terrain // roadmap  //hybrid
            heading: 90,
            tilt: 75,
            place_formatted: "",
            place_id: "",
            place_location: "",
            rotateControl: true,
            lat: 40.7128,
            long: -74.0060,
            markers: [], 
            unknownLocations: []
        };
    }

    
    componentDidMount () {
        // Get the component's model, which includes any values bound to it
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        // const columns = manywho.component.getDisplayColumns(model.columns);

        const infowindow = new google.maps.InfoWindow();
        const unknownLocations: string[] = [];
        var bounds = new google.maps.LatLngBounds();

        // Create the map in an element on the page
        let map = new google.maps.Map(document.getElementById("map-canvas"), {
            center: { lat: this.state.lat, lng: this.state.long },
            zoom: this.state.zoom,
            mapTypeId: this.state.maptype,
            heading: this.state.heading,
            styles:[{
                featureType:"poi",
                elementType:"labels",
            }],
            tilt: this.state.tilt,
        });

        if (model.objectData !== null) {
            // Add geolocations
            model.objectData.forEach((od: IObjectData) => {
                
                const latitude = manywho.utils.getObjectDataProperty(od.properties, "latitude").contentValue;

                const longitude = manywho.utils.getObjectDataProperty(od.properties, "longitude").contentValue;
                
                let name = manywho.utils.getObjectDataProperty(od.properties, "name").contentValue;
                if (name.includes(":")) {
                    const names = name.split(":");
                    if (names[1] === "null") {
                        name = `${names[0]}`;
                    } else { 
                        name = name.split(":")[1];
                    }
                }

                if ( latitude === null || longitude === null ) {
                    if (unknownLocations.some((loc: string) => { return loc === name; })) return;
                    unknownLocations.push(name);
                    return;
                }

                let hostName = manywho.utils.getObjectDataProperty(od.properties, "host name").contentValue;
                
                let city = manywho.utils.getObjectDataProperty(od.properties, "city").contentValue;
                let stateCode = manywho.utils.getObjectDataProperty(od.properties, "region code").contentValue;

                // const url = "javascript:void"; //`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

                //  CC Boomi atom logos, goes with icon in marker var defintion
                //  var image = "https://files-manywho-com.s3.amazonaws.com/97d13c5b-c52a-4f69-a8d7-eee246bbacee/atom9.png";

                // Add the location to the map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: name
                });

                bounds.extend(marker.position);

                marker.addListener("click", () => {
                    //  Info Window
                    infowindow.setContent("<div class=\"content\">" + 
                                    "<h5>" + 
                                        // "<a target=\"blank\" href=" + url + ">" + 
                                            name +
                                        // "</a>" +
                                    "</h5>" +
                                    "<span>" + hostName + "</span><br/>" +
                                    city + ", " + stateCode +
                                "</div>"
                            );
                    infowindow.open(map, marker);
                });
                
                /*
                // Zoom when clicking on marker
                google.maps.event.addListener(marker,"click",function() {
                    map.setZoom(14);
                    infowindow.open(map, marker);
                });
                */
            });
        }
        
        map.fitBounds(bounds);
        
        if (unknownLocations.length > 0) this.setState({unknownLocations: unknownLocations});
    }

    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>
                {this.state.unknownLocations.length > 0 && 
                <div className="pad-top">
                    <p>
                        <span className="glyphicon glyphicon-warning-sign pad-right-small warning" aria-hidden="true"></span>
                        <strong>There are systems with unknown locations:</strong>
                    </p>
                    <p>
                        {this.state.unknownLocations.map((loc: string) => {
                            return <span className="pad-left">{loc} <br/></span>;
                        })}
                    </p>
                </div>
                }
            </div>
        );
    }
}

manywho.component.register("piiGoogleMap", piiGoogleMap);
export default piiGoogleMap;