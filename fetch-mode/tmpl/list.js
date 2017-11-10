const content = require('list_child');

module.exports = function(params=[]){
    return `
<div class='server wrap'>
    ${params.map(val => 
        `<div class='wrap-child'>
            <div class='block'>
                <div class='title'>${val.identity}</div>
                <div class='content'>${content(val)}</div>
            </div>
        </div>`
    ).join('')}
</div>
`;
};