import { api, LightningElement,track } from 'lwc';
import pubsub from 'omnistudio/pubsub'

export default class GenericInputPatternMethod extends LightningElement {
    value = '';

      @api pattern;
      @api channelName;
      @api eventName;
    
      handleInputFocus(event){
        console.log(this.pattern);
        const inputValue = event.target.value;
        const alphanumericRegex = this.pattern;
        if (inputValue.match(alphanumericRegex)) {
            this.value = inputValue;
            console.log('focus on')
          }
          pubsub.fire(this.channelName,this.eventName,{
            searchtext: this.value
        });   

      }

}