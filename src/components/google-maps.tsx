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
            zoom: 2,
            maptype: "roadmap", // terrain // roadmap  //hybrid
            heading: 90,
            tilt: 75,
            place_formatted: "",
            place_id: "",
            place_location: "",
            rotateControl: true,
            lat: 1.2966,
            long: 103.7764,
            markers: []
        };
    }

    componentDidMount () {
        // Get the component's model, which includes any values bound to it
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);
        // const columns = manywho.component.getDisplayColumns(model.columns);

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
                
                const name = manywho.utils.getObjectDataProperty(od.properties, "name").contentValue;

                //  Info Window
                var infowindow = new google.maps.InfoWindow({
                    content:  "<div id=\"content\">"+
                    "<div id=\"siteNotice\">"+
                    "</div>"+
                    "<h5>" + name +"</h5>"+
                    "<hr />"+
                    // avail.contentValue + "/" + capacity.contentValue+
                    "<a target=\"blank\" href=\"https://www.google.com/maps/dir/?api=1&origin=1.2966,103.776&destination=" + latitude + "," + longitude + "\">"+
                    "<hr />" +
                    "<p>Lat/Long:</p>" + latitude + "/" + longitude +
                    "</div>"+
                    "</div>",
                });

                //CC Boomi atom logos, goes with icon in marker var defintion
                // var image = "https://files-manywho-com.s3.amazonaws.com/97d13c5b-c52a-4f69-a8d7-eee246bbacee/atom9.png";

                // Add the location to the map
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latitude, longitude),
                    map: map,
                    animation: google.maps.Animation.DROP,
                    title: name
                });

                // //You are here Boomi Marker
                // var marker2 = new google.maps.Marker({
                //     position: new google.maps.LatLng(1.2966, 103.7764),
                //     map: map,
                //     animation: google.maps.Animation.DROP,
                //     title: name.contentValue,
                //     icon: image
                // });

                // Zoom to 9 when clicking on marker
                google.maps.event.addListener(marker,"click",function() {
                map.setZoom(14);
                infowindow.open(map, marker);
                });

            });
        }
    }

    render() {
        return (
            <div className="custom-component flex-container">
                <div id="map-canvas"></div>
                <div className="content-wrapper">
                    <div id='autocomplete-input'>
                        {/* <input id="ac-input" type='text' placeholder='Enter a location' /> */}
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register("piiGoogleMap", piiGoogleMap);
export default piiGoogleMap;