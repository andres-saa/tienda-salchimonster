import { defineStore } from "pinia";
import { URI } from "../service/conection";


export const useUserStore = defineStore('user-salchi-usa23', {

    persist: {

                key: 'user-salchi23 sfvdvdddd',
                storage: localStorage,
                paths:[
                    'user','lang'

                    ]
    },
    state: () => {

        return {

            user: {
                name:'',
                neigborhood:'',
                address:'',
                phone_number:'',
                was_reserva:false,
                order_type:    {
                  "id": 3,
                  "name": "Enviar a domicilio"
              },
                phone_code:{ "code": "CO", "name": "Colombia", "dialCode": "+57", "flag": "https://flagcdn.com/h20/co.png", "label": "+57", "dialDigits": "57", "flagEmoji": "🇨🇴", "_imgError": false }

            },
            lang:   { name: 'es', label: 'Español',  flag: 'https://flagcdn.com/w20/co.png' },



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

    },


})


