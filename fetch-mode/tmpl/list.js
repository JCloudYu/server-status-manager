const content = require('list_child');

module.exports = function(params=[]){
    return `
<div class='server card-deck'>
    ${params.map(val => 
        `<div class='card-container'>
            <div class='card bg-light'>
                <div class='card-body'>
                    <h4 class='card-title'>${val.identity}</h4>
                    <div class='card-text'>${content(val)}</div>
                </div>
            </div>
        </div>`
    ).join('')}
</div>
`;
};