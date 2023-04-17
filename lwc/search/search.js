import { LightningElement,track} from 'lwc';

// import server side apex class method 
import getContactList from '@salesforce/apex/customSearchSobjectLWC.getContactList';
import pubsub from 'omnistudio/pubsub'

// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class customSearchSobjectLWC extends LightningElement {

    @track contactsRecord;
    @track searchValue = '';
 
    // update searchValue var when input field value change
    handlesearchKeyword(event){
            this.searchValue = event.target.value;
            //console.log("result:" , this.searchValue)

            pubsub.fire("searchChannel","searchMember",{
                searchtext: this.searchValue
            });
        
        
    }

}   

