import '../css/community-classify.css';
import Base from 'base';

class communityClassifyPage extends Base{
    constructor() {
        var config = {
            searchCon:''
        }
        super(config);
    };
    ready(){  
        console.log(this.config)
        console.log(this.host);
    };
};

new communityClassifyPage();