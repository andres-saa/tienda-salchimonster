import { defineStore } from "pinia";
import { URI,URI_SOCKET } from "../service/conection";
import axios from "axios";



export const useSitesStore = defineStore('sites-salcfsfsshimonster-usa', {

    persist: {

                key: 'sites-salchfsimonster-usaffsfssvv',
                storage: localStorage,
                paths:[
                    'location', 'delivery_price'

                    ]
    },
    state: () => {

        return {

            location: {
              "site":{
                "site_id": 7,
                "site_name": "MODELIA",
                "site_address": "Carrera 75 # 25C - 45",
                "site_phone": "+573053447255",
                "site_business_hours": "string",
                "horario_semanal": {
                    "dia": "string"
                },
                "wsp_link": "https://wa.link/6v0usl",
                "city_id": 8,
                "maps": "https://maps.app.goo.gl/krfe3WeK3jbZzse96",
                "show_on_web": true,
                "email_address": "hola@.com",
                "status": true,
                "comming_soon": false,
                "open": true,
                "pe_site_id": 3,
                "exist": true,
                "invoice_identifier": "MODELIA",
                "time_zone": "America/Bogota",
                "restaurant_id": 1
            },
              "neigborhood":    {
                "neighborhood_id": 15326,
                "name": "MODELIA",
                "delivery_price": 0.0,
                "site_id": 7,
                "city_id": 18
            },
              "city":    {
                "city_id": 8,
                "city_name": "Bogotá",
                "visible": true,
                "index": 3
            },
           },

           delivery_price:0,

            sonando: {

            },
            visibles: {
                currentSite: false,
                sonandoCurrentSite:false,
                currentSiteSites:false
            },
            current_delivery:0,
            webSocket: null,
            status:'closed'


        }
    },

    getters: {
        fucion: (state) => {
            return 0
        }
    },



    actions: {

        async func() {
            return func
        },

        setLocation(location, delivery_price = null) {

            this.location = location
            if (delivery_price) {
              this.delivery_price = delivery_price
            }
        },
        setVisible(item,status){
            this.visibles[item]=status
        },
        async connectWebSocket(siteId) {


        },
        async setNeighborhoodPrice(){

                try {
                    const response = await axios.get(`${URI}/neighborhood/${this.location.neigborhood.neighborhood_id}/`);
                    if (response.status === 200) {
                        this.location.neigborhood = response.data
                        return response.data;
                    } else {
                        console.error('An error occurred while fetching the ingredients:', response.status);
                        return null;
                    }
                } catch (error) {
                    console.error('An error occurred while fetching the ingredients:', error);
                    return null;
                }

        },
        async setNeighborhoodPriceCero(){

           this.location.neigborhood.delivery_price = 0
    }




    },


})


