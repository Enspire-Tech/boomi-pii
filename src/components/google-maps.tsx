// Custom JS Google Maps 
declare var manywho: any;
declare var google: any;

import * as React from "react";
import { IObjectData } from "../interfaces/IMWData";
// import './index.css';

class googleMaps extends React.Component<any, any> {

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
debugger;
        // Loop through all the data in the value this component is bound to
        model.objectData.forEach((od: IObjectData) => {
            
            // TODO: BW - remove assumptions
            
            // Assume the latitude is the 1st "display column" set in the page component
            // const latitude = result.properties.find(property => property.typeElementPropertyId === columns[0].typeElementPropertyId);
            const latitude = manywho.utils.getObjectDataProperty(od.properties, "latitude").contentValue;

            // Assume the longitude is the 2nd "display column" set in the page component
            // const longitude = od.properties.find(property => property.typeElementPropertyId === columns[1].typeElementPropertyId);
            const longitude = manywho.utils.getObjectDataProperty(od.properties, "longitude").contentValue;
            
            // Assume the name is the 3rd "display column" set in the page component
            // const name = od.properties.find(property => property.typeElementPropertyId === columns[2].typeElementPropertyId);
            const name = manywho.utils.getObjectDataProperty(od.properties, "name").contentValue;
            /*
            // Assume the available spots is the 4th "display column" set in the page component
            const avail = result.properties.find(property => property.typeElementPropertyId === columns[3].typeElementPropertyId);

            // Assume the total spots is the 5th "display column" set in the page component
            const capacity = result.properties.find(property => property.typeElementPropertyId === columns[4].typeElementPropertyId);
*/
            //CC Info Window
            var contentString = "<div id=\"content\">"+
              "<div id=\"siteNotice\">"+
              "</div>"+
              "<h5>" + name.contentValue +"</h5>"+
              "<hr />"+
              // avail.contentValue + "/" + capacity.contentValue+
              "<a target=\"blank\" href=\"https://www.google.com/maps/dir/?api=1&origin=1.2966,103.776&destination=" + latitude.contentValue + "," + longitude.contentValue + "\">"+
              "<hr />" +
              "<p>Lat/Long:</p>" + latitude.contentValue + "/" + longitude.contentValue+
              "</div>"+
              "</div>";

            /*
            var contentString2 = "<div id=\"content\">"+
              "<div id=\"siteNotice\">"+
              "</div>"+
              "<h5> You are here! </h5>"+
              "<hr />"+
              "<p>Lat/Long: 1.2966 / 103.7764</p>"+
              "</div>"+
              "</div>";

            // var youAreHere = '<div id="content"><h5>You Are Here</h5></div>';
            */

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
              });

            /*
            var infowindow2 = new google.maps.InfoWindow({
                content: contentString2,
              });
            */

            //CC Boomi atom logos, goes with icon in marker var defintion
            // var image = "https://files-manywho-com.s3.amazonaws.com/97d13c5b-c52a-4f69-a8d7-eee246bbacee/atom9.png";

            // Add the list object as a marker on the map
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude.contentValue, longitude.contentValue),
                map: map,
                animation: google.maps.Animation.DROP,
                title: name.contentValue
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

            // // Zoom to 9 when clicking on you're here marker
            // google.maps.event.addListener(marker2,'click',function() {
            //   map.setZoom(12);
            //   infowindow2.open(map, marker2);
            //   marker2.setAnimation(google.maps.Animation.BOUNCE);
            //   setTimeout(function(){ marker2.setAnimation(null); }, 750);
            //   });

        });

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

manywho.component.register("google-map2", googleMaps);
export default googleMaps;