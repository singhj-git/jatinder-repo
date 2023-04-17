import { LightningElement, wire, track } from "lwc";
import getCases from "@salesforce/apex/FilteredTableController.getCases";
import { NavigationMixin } from "lightning/navigation";
import { getPicklistValues } from "lightning/uiObjectInfoApi";


export default class FilteredTable extends NavigationMixin(
    LightningElement
) {
    @track data;
    searchable = [];
    wiredCaseCount; 
    wiredCases;

    doneTypingInterval = 0;

    searchAllValue;

    caseNumber = "";
    accountName = "";
    contactName = "";

    @wire(getCases, {
        caseNumber: "$caseNumber",
        accountName: "$accountName",
        contactName: "$contactName",
    })
    wiredSObjects(result) {
        this.wiredCases = result;
        console.log("4", result.data[1]);
        if (result.data) {
            this.searchable = this.data = result.data.map((caseObj, index) => ({
                caseData: { ...caseObj },
                index: index + 1,
                rowIndex: index
            }));
        } else if (result.error) {
            console.error("Error", error);
        }
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    handleKeyUp(event) {
        clearTimeout(this.typingTimer);
        let value = event.target.value;
        let name = event.target.name;

        this.typingTimer = setTimeout(() => {
            this[name] = value;
        }, this.doneTypingInterval);
    }



    handleSearchAll(event) {
        this.searchAllValue = event.target.value;
        this.searchAll();
    }

    searchAll() {
        let searchStr = this.searchAllValue.toLowerCase();
        const regex = new RegExp(
            " (^" + searchStr + ") | (." + searchStr + ") | (" + searchStr + "$) "
        );
        if (searchStr.length > 2) {
            this.searchable = this.data.filter((item) => {
                if (
                    regex.test(
                        item.caseData.CaseNumber.toLowerCase() +
                            " " +
                            item.caseData.CaseNumber.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.Account?.Name?.toLowerCase() +
                            " " +
                            item.caseData.Account?.Name?.toLowerCase()
                    ) ||
                    regex.test(
                        item.caseData.Contact?.Name?.toLowerCase() +
                            " " +
                            item.caseData.Contact?.Name?.toLowerCase()
                    ) 
                ) {
                    return item;
                }
            });
        } else if (this.caseNumber.length <= 2) {
            this.searchable = this.data;
        }
        console.log(this.searchable);
    }

    handleNavigate(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                actionName: "view",
                recordId: event.target.dataset.id
            }
        });
    }
}